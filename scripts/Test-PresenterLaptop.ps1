# Manual, read-only live-session preflight; not a rehearsal attestation. No secrets are printed.
# Four-tool bootstrap: GitHub Copilot app, VS Code, Copilot CLI, and Squad 1.0.1. OBS is not required.
param([string]$OfflineMirrorRoot = 'C:\terraform-offline')
$ErrorActionPreference = 'Continue'; $fail = 0
function Out-Check($name, [bool]$ok, $info='') { if (-not $ok) { $script:fail++ }; '{0,-4} {1,-34} {2}' -f ($(if($ok){'PASS'}else{'FAIL'})), $name, $info }
$v = {
  param($c)
  try {
    $global:LASTEXITCODE = 0
    $arguments = @($c | Select-Object -Skip 1)
    $output = @(& $c[0] @arguments 2>$null)
    if ($global:LASTEXITCODE -ne 0 -or -not $output.Count) { return '(unavailable or command failed)' }
    $output[0].ToString().Trim()
  } catch { '(unavailable or command failed)' }
}
$cp = & $v @('copilot','--version'); Out-Check 'copilot cli 1.0.x' ($cp -match '(?:^|\s)1\.0\.\d+(?:\s|$)') $cp
$sq = & $v @('squad','--version');   Out-Check 'squad 1.0.1' ($sq -match '^1\.0\.1(?:\s|$)') $sq
$code = & $v @('code','--version'); Out-Check 'VS Code CLI available' ($code -match '^\d+\.\d+\.\d+(?:\s|$)') $code
try {
  $global:LASTEXITCODE = 0
  # This queries installed packages, not the catalog (GitHub.Copilot is the separate CLI).
  $app = @(winget list --id GitHub.CopilotApp --exact --source winget --disable-interactivity 2>$null)
  $appInstalled = ($global:LASTEXITCODE -eq 0) -and (($app -join "`n") -match '(?m)^\s*[^\r\n]*\sGitHub\.CopilotApp\s+\S+')
  Out-Check 'GitHub Copilot desktop app' $appInstalled 'installed package: GitHub.CopilotApp'
} catch { Out-Check 'GitHub Copilot desktop app' $false 'installed-package query unavailable' }
$tf = & $v @('terraform','version')
$tfVersion = $null
if ($tf -match '^Terraform v(\d+\.\d+\.\d+)(?:\s|$)') { [void][version]::TryParse($Matches[1], [ref]$tfVersion) }
Out-Check 'terraform >=1.14.8 <2' ($null -ne $tfVersion -and $tfVersion -ge [version]'1.14.8' -and $tfVersion -lt [version]'2.0') $tf
$tl = & $v @('tflint','--version');   Out-Check 'tflint 0.64.0' ($tl -match '0\.64\.0') $tl
$dk = & $v @('docker','version','--format','{{.Server.Version}}'); Out-Check 'docker daemon running' ($dk -match '^\d+\.') $dk
try {
  $global:LASTEXITCODE = 0
  $img = @(docker image ls --digests --format '{{.Digest}}' hashicorp/terraform-mcp-server 2>$null)
  Out-Check 'terraform MCP image pinned' ($global:LASTEXITCODE -eq 0 -and [bool]($img -match '423a6b8e2ee06aff')) 'sha256:423a6b8e...'
} catch { Out-Check 'terraform MCP image pinned' $false 'docker image query unavailable' }
$providerMirror = Join-Path $OfflineMirrorRoot 'providers\registry.terraform.io\azure\azapi\terraform-provider-azapi_2.12.0_windows_amd64.zip'
$mirrorConfig = Join-Path $OfflineMirrorRoot 'terraform.tfrc'
Out-Check 'offline azapi 2.12.0 mirror' (Test-Path $providerMirror) $OfflineMirrorRoot
Out-Check 'offline terraform.tfrc (no direct)' ((Test-Path $mirrorConfig) -and -not (Select-String -Path $mirrorConfig -Pattern 'direct' -Quiet))
$cred = Get-ChildItem Env: | Where-Object Name -Match '^(ARM_|AZURE_(?!CORE_)|TF_VAR_|TF_CLI_ARGS)' | ForEach-Object Name
Out-Check 'no inherited credentials' (-not $cred) ($cred -join ',')
try { $global:LASTEXITCODE = 0; gh auth status 1>$null 2>$null; Out-Check 'gh signed in' ($global:LASTEXITCODE -eq 0) } catch { Out-Check 'gh signed in' $false 'gh auth query unavailable' }
$body = '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"preflight","version":"1"}}}'
try { $r = Invoke-WebRequest https://learn.microsoft.com/api/mcp -Method Post -Body $body -ContentType 'application/json' -Headers @{Accept='application/json, text/event-stream'} -TimeoutSec 20 -UseBasicParsing -ErrorAction Stop; Out-Check 'Microsoft Learn MCP' ($r.StatusCode -eq 200) $r.StatusCode } catch { Out-Check 'Microsoft Learn MCP' $false 'request failed' }
$h = $null
try { $h = (Get-Content "$HOME\.copilot\mcp-config.json" -Raw -ErrorAction Stop | ConvertFrom-Json -ErrorAction Stop).mcpServers.'terraform-hosted' } catch {}
if ($h) {
  try { Invoke-WebRequest $h.url -Method Post -Body $body -ContentType 'application/json' -TimeoutSec 60 -UseBasicParsing -ErrorAction Stop | Out-Null; Out-Check 'hosted MCP rejects no key' $false 'got 2xx' } catch { Out-Check 'hosted MCP rejects no key' ($_.Exception.Response.StatusCode.value__ -eq 403) 'expected HTTP 403' }
  $hd = @{Accept='application/json, text/event-stream'}; $h.headers.PSObject.Properties | ForEach-Object { $hd[$_.Name] = $_.Value }
  try { $r = Invoke-WebRequest $h.url -Method Post -Body $body -ContentType 'application/json' -Headers $hd -TimeoutSec 90 -UseBasicParsing -ErrorAction Stop; Out-Check 'hosted MCP accepts key (cold ok)' ($r.StatusCode -eq 200) $r.StatusCode } catch { Out-Check 'hosted MCP accepts key (cold ok)' $false 'request failed' }
} else { Out-Check 'hosted MCP configured' $false 'terraform-hosted missing, or mcp-config unreadable/invalid' }
try { $p = Invoke-WebRequest https://martinopedal.github.io/squad-terraform-session-2026-10-14/presentation/ -TimeoutSec 20 -UseBasicParsing -ErrorAction Stop; Out-Check 'live deck reachable' ($p.StatusCode -eq 200) } catch { Out-Check 'live deck reachable' $false 'request failed' }
try {
  $p = Invoke-WebRequest https://martinopedal.github.io/squad-terraform-session-2026-10-14/presentation/short/ -TimeoutSec 20 -UseBasicParsing -ErrorAction Stop
  $html = [regex]::Replace($p.Content, '(?is)<!--.*?-->|<(script|style)\b[^>]*>.*?</\1\s*>', '')
  $sections = [regex]::Matches($html, '(?is)<section\b(?:[^>"'']|"[^"]*"|''[^'']*'')*>')
  $ids = @($sections | ForEach-Object {
    [regex]::Matches($_.Value, '(?is)(?<name>[^\s/=>]+)\s*=\s*(?:"(?<value>[^"]*)"|''(?<value>[^'']*)''|(?<value>[^\s>]+))') |
      Where-Object { $_.Groups['name'].Value -ieq 'id' } | ForEach-Object { $_.Groups['value'].Value }
  })
  $expected = @('short-who-we-are', 'short-what-we-show', 'short-snippets', 'short-takeaways', 'short-links')
  Out-Check 'live five-slide companion' ($p.StatusCode -eq 200 -and $sections.Count -eq 5 -and ($ids -join ',') -ceq ($expected -join ',')) "HTTP $($p.StatusCode); $($sections.Count) sections; expected five slide IDs"
} catch { Out-Check 'live five-slide companion' $false 'request or section inspection failed' }
$free = [math]::Round((Get-PSDrive C).Free/1GB,1); Out-Check 'disk free >= 10 GiB' ($free -ge 10) "$free GiB"
"--- $fail failure(s)"; exit $fail
