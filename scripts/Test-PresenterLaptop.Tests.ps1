# Controlled execution only. All product, filesystem-inventory and HTTP checks are mocked.
# Usage: pwsh -NoProfile -File .\scripts\Test-PresenterLaptop.Tests.ps1
param([string]$FixtureRoot, [string]$CaseBase64)
$ErrorActionPreference = 'Stop'

if ($CaseBase64) {
  $script:case = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($CaseBase64)) | ConvertFrom-Json
  Set-Variable -Name HOME -Value $FixtureRoot -Force -Scope Global
  $script:configPath = "$HOME\.copilot\mcp-config.json"
  $script:mirrorRoot = if ($script:case.MirrorRoot) { $script:case.MirrorRoot } else { 'C:\terraform-offline' }

  function copilot {
    if ($script:case.MissingCopilot) { throw 'Synthetic missing Copilot CLI' }
    Set-Variable -Name LASTEXITCODE -Value 0 -Scope Global
    '1.0.93'
  }
  function squad {
    if ($script:case.MissingSquad) { throw 'Synthetic missing Squad' }
    Set-Variable -Name LASTEXITCODE -Value 0 -Scope Global
    if ($script:case.SquadVersion) { $script:case.SquadVersion } else { '1.0.1' }
  }
  function code {
    if ($script:case.MissingCode) { throw 'Synthetic missing VS Code CLI' }
    Set-Variable -Name LASTEXITCODE -Value $(if ($script:case.CodeExitFailure) { 1 } else { 0 }) -Scope Global
    '1.105.0'
  }
  function winget {
    if ($script:case.MissingWinget) { throw 'Synthetic missing WinGet' }
    if (($args -join ' ') -ne 'list --id GitHub.CopilotApp --exact --source winget --disable-interactivity') {
      throw 'Only exact installed-app inventory is allowed in this fixture'
    }
    Set-Variable -Name LASTEXITCODE -Value $(if ($script:case.MissingApp -or $script:case.AppExitFailure) { 1 } else { 0 }) -Scope Global
    if ($script:case.CatalogOnly) { 'Found GitHub Copilot [GitHub.CopilotApp]'; 'Version: 1.0.7' }
    elseif ($script:case.MissingApp) { 'No installed package found matching input criteria.' }
    else { 'Name           Id                Version Source'; 'GitHub Copilot GitHub.CopilotApp 1.0.7   winget' }
  }
  function terraform {
    Set-Variable -Name LASTEXITCODE -Value 0 -Scope Global
    "Terraform v$($script:case.Terraform)"
  }
  function tflint { Set-Variable -Name LASTEXITCODE -Value 0 -Scope Global; 'TFLint version 0.64.0' }
  function docker {
    Set-Variable -Name LASTEXITCODE -Value 0 -Scope Global
    if ($args[0] -eq 'image') { 'sha256:423a6b8e2ee06aff-synthetic' } else { '28.5.0' }
  }
  function gh {
    if (($args -join ' ') -ne 'auth status') { throw 'Unexpected gh command' }
    Set-Variable -Name LASTEXITCODE -Value $(if ($script:case.GhFailure) { 1 } else { 0 }) -Scope Global
  }
  function Test-Path {
    param([string]$Path)
    if ($Path -eq (Join-Path $script:mirrorRoot 'providers\registry.terraform.io\azure\azapi\terraform-provider-azapi_2.12.0_windows_amd64.zip')) { return (-not $script:case.MissingMirror) }
    if ($Path -eq (Join-Path $script:mirrorRoot 'terraform.tfrc')) { return (-not $script:case.MissingMirrorConfig) }
    throw 'Unexpected filesystem probe (OBS is deliberately absent)'
  }
  function Select-String {
    param([string]$Path, [string]$Pattern, [switch]$Quiet)
    if ($Path -ne (Join-Path $script:mirrorRoot 'terraform.tfrc') -or $Pattern -ne 'direct' -or -not $Quiet) { throw 'Unexpected mirror probe' }
    [bool]$script:case.DirectMirror
  }
  function Get-ChildItem {
    param([string]$Path)
    if ($Path -ne 'Env:') { throw 'Unexpected inventory access' }
    if ($script:case.InheritedCredentials) { [pscustomobject]@{Name='ARM_SYNTHETIC_TEST_ONLY'} }
  }
  function Get-Content {
    param([string]$Path, [switch]$Raw, [string]$ErrorAction)
    if ($Path -ne $script:configPath -or -not $Raw) { throw 'Real file reads are forbidden in this fixture' }
    if ($script:case.InvalidConfig) { return '{"synthetic-only-not-a-key":' }
    if ($script:case.MissingHosted) { return '{"mcpServers":{}}' }
    Microsoft.PowerShell.Management\Get-Content -LiteralPath $script:configPath -Raw -ErrorAction Stop
  }
  function Get-PSDrive {
    param([string]$Name)
    if ($Name -ne 'C') { throw 'Unexpected disk probe' }
    [pscustomobject]@{Free=42GB}
  }
  function Invoke-WebRequest {
    param([string]$Uri, [string]$Method, [string]$Body, [string]$ContentType, [hashtable]$Headers, [int]$TimeoutSec, [switch]$UseBasicParsing, [string]$ErrorAction)
    if (-not $UseBasicParsing) { throw 'Windows-safe basic HTML parsing is required' }
    switch ($Uri) {
      'https://learn.microsoft.com/api/mcp' {
        if ($Method -ne 'Post' -or ($Body | ConvertFrom-Json).method -ne 'initialize') { throw 'Expected MCP initialize' }
        if ($script:case.LearnFailure) { throw 'Synthetic public MCP failure' }
        return [pscustomobject]@{StatusCode=200}
      }
      'https://synthetic-hosted.invalid/mcp' {
        if ($Method -ne 'Post' -or ($Body | ConvertFrom-Json).method -ne 'initialize') { throw 'Expected hosted initialize' }
        if (-not $Headers) {
          if ($script:case.HostedAllowsNoKey) { return [pscustomobject]@{StatusCode=200} }
          $exception = New-Object System.Exception('Synthetic HTTP failure')
          $exception | Add-Member -NotePropertyName Response -NotePropertyValue ([pscustomobject]@{StatusCode=[Net.HttpStatusCode]::Forbidden})
          throw $exception
        }
        if ($Headers['X-Synthetic-Key'] -ne 'synthetic-only-not-a-key') { throw 'Only the fake header is permitted' }
        if ($script:case.HostedRejectsKey) { throw 'Synthetic authenticated failure: synthetic-only-not-a-key' }
        return [pscustomobject]@{StatusCode=200}
      }
      'https://martinopedal.github.io/squad-terraform-session-2026-10-14/presentation/' {
        return [pscustomobject]@{StatusCode=200; Content='<html>Main fixture deck</html>'}
      }
      'https://martinopedal.github.io/squad-terraform-session-2026-10-14/presentation/short/' {
        if ($script:case.ShortMissing) { throw 'Synthetic HTTP 404' }
        return [pscustomobject]@{StatusCode=$(if ($script:case.ShortStatus) { $script:case.ShortStatus } else { 200 }); Content=$script:case.ShortHtml}
      }
      default { throw 'Real network access is forbidden in this fixture' }
    }
  }
  if ($script:case.MirrorRoot) { . "$PSScriptRoot\Test-PresenterLaptop.ps1" -OfflineMirrorRoot $script:case.MirrorRoot }
  else { . "$PSScriptRoot\Test-PresenterLaptop.ps1" }
  exit $LASTEXITCODE
}

$tokens = $null; $parseErrors = $null
foreach ($path in @("$PSScriptRoot\Test-PresenterLaptop.ps1", $PSCommandPath)) {
  $ast = [Management.Automation.Language.Parser]::ParseFile($path, [ref]$tokens, [ref]$parseErrors)
  if ($parseErrors.Count) { throw "Syntax failure in $path : $($parseErrors.Message -join '; ')" }
  if ($path -eq "$PSScriptRoot\Test-PresenterLaptop.ps1") { $preflightAst = $ast }
}
# Execute only the production version helper with harmless native commands, never product CLIs.
$versionHelper = $preflightAst.Find({
  param($node)
  $node -is [Management.Automation.Language.AssignmentStatementAst] -and $node.Left.Extent.Text -eq '$v'
}, $true)
if (-not $versionHelper) { throw 'Production version helper not found' }
. ([scriptblock]::Create($versionHelper.Extent.Text))
$nativePass = & $v @($env:ComSpec, '/d', '/c', 'echo synthetic-native-version & exit /b 0')
$nativeFail = & $v @($env:ComSpec, '/d', '/c', 'echo synthetic-native-version & exit /b 7')
$nativeMissing = & $v @("$PSScriptRoot\does-not-exist-native-tool.exe", '--version')
if ($nativePass -ne 'synthetic-native-version' -or $nativeFail -ne '(unavailable or command failed)' -or $nativeMissing -ne '(unavailable or command failed)') {
  throw 'Actual native command success/failure/missing-command handling regressed'
}
'PASS 3/3 actual native helper checks (cmd.exe only; no product commands)'
$ids = @('short-who-we-are', 'short-what-we-show', 'short-snippets', 'short-takeaways', 'short-links')
$shortHtml = ($ids | ForEach-Object { "<section id=`"$_`" data-title-id=`"$_-title`"></section>" }) -join "`n"
$fourHtml = ($ids[0..3] | ForEach-Object { "<section id=`"$_`" data-title-id=`"$_-title`"></section>" }) -join "`n"
$cases = @(
  @{Name='OBS absent; all 18 mocked checks PASS'; Failures=0}
  @{Name='Alternate offline mirror root passes'; MirrorRoot='C:\synthetic-mirror'; Failures=0}
  @{Name='Missing provider mirror fails'; MissingMirror=$true; Failures=1; FailedChecks=@('offline azapi 2.12.0 mirror')}
  @{Name='Missing mirror configuration fails'; MissingMirrorConfig=$true; Failures=1; FailedChecks=@('offline terraform.tfrc (no direct)')}
  @{Name='Direct provider installation fails'; DirectMirror=$true; Failures=1; FailedChecks=@('offline terraform.tfrc (no direct)')}
  @{Name='Terraform 1.14.7 fails'; Terraform='1.14.7'; Failures=1; FailedChecks=@('terraform >=1.14.8 <2')}
  @{Name='Terraform 1.14.8 passes'; Failures=0}
  @{Name='Terraform 1.16.4 passes'; Terraform='1.16.4'; Failures=0}
  @{Name='Terraform 2.0.0 fails'; Terraform='2.0.0'; Failures=1; FailedChecks=@('terraform >=1.14.8 <2')}
  @{Name='Terraform 2.0 fails'; Terraform='2.0'; Failures=1; FailedChecks=@('terraform >=1.14.8 <2')}
  @{Name='Terraform 1.14.0 fails'; Terraform='1.14.0'; Failures=1; FailedChecks=@('terraform >=1.14.8 <2')}
  @{Name='Terraform prerelease fails'; Terraform='1.14.8-alpha1'; Failures=1; FailedChecks=@('terraform >=1.14.8 <2')}
  @{Name='Malformed Terraform version fails'; Terraform='99999999999999.14.8'; Failures=1; FailedChecks=@('terraform >=1.14.8 <2')}
  @{Name='Copilot CLI missing fails'; MissingCopilot=$true; Failures=1; FailedChecks=@('copilot cli 1.0.x')}
  @{Name='Squad missing fails'; MissingSquad=$true; Failures=1; FailedChecks=@('squad 1.0.1')}
  @{Name='Squad baseline preserved'; SquadVersion='1.0.2'; Failures=1; FailedChecks=@('squad 1.0.1')}
  @{Name='VS Code missing fails'; MissingCode=$true; Failures=1; FailedChecks=@('VS Code CLI available')}
  @{Name='VS Code command failure cannot pass'; CodeExitFailure=$true; Failures=1; FailedChecks=@('VS Code CLI available')}
  @{Name='Installed Copilot app missing fails'; MissingApp=$true; Failures=1; FailedChecks=@('GitHub Copilot desktop app')}
  @{Name='Installed-app inventory unavailable fails'; MissingWinget=$true; Failures=1; FailedChecks=@('GitHub Copilot desktop app')}
  @{Name='Failed installed-app query cannot pass'; AppExitFailure=$true; Failures=1; FailedChecks=@('GitHub Copilot desktop app')}
  @{Name='App catalog is not installed evidence'; CatalogOnly=$true; Failures=1; FailedChecks=@('GitHub Copilot desktop app')}
  @{Name='Missing companion fails'; ShortMissing=$true; Failures=1; FailedChecks=@('live five-slide companion')}
  @{Name='Non-200 companion fails'; ShortStatus=404; Failures=1; FailedChecks=@('live five-slide companion')}
  @{Name='Four slides with repeated data attrs fail'; ShortHtml=$fourHtml; Failures=1; FailedChecks=@('live five-slide companion')}
  @{Name='Five sections with incorrect slide ID fail'; ShortHtml=$shortHtml.Replace('id="short-links"', 'id="wrong-slide"'); Failures=1; FailedChecks=@('live five-slide companion')}
  @{Name='data-id cannot replace section ID'; ShortHtml=$shortHtml.Replace('id="short-links"', 'data-id="short-links"'); Failures=1; FailedChecks=@('live five-slide companion')}
  @{Name='Quoted data attribute cannot impersonate ID'; ShortHtml=$fourHtml + '<section data-note="id=''short-links''"></section>'; Failures=1; FailedChecks=@('live five-slide companion')}
  @{Name='Commented slide cannot pass'; ShortHtml=$fourHtml + '<!-- <section id="short-links"></section> -->'; Failures=1; FailedChecks=@('live five-slide companion')}
  @{Name='Script string cannot impersonate section'; ShortHtml=$fourHtml + '<script>let fake = ''<section id="short-links"></section>'';</script>'; Failures=1; FailedChecks=@('live five-slide companion')}
  @{Name='Extra sixth section fails'; ShortHtml=$shortHtml + '<section id="extra"></section>'; Failures=1; FailedChecks=@('live five-slide companion')}
  @{Name='Single-quoted IDs pass'; ShortHtml=($ids | ForEach-Object { "<section id='$_'></section>" }) -join "`n"; Failures=0}
  @{Name='Invalid isolated MCP config fails safely'; InvalidConfig=$true; Failures=1; Checks=17; FailedChecks=@('hosted MCP configured')}
  @{Name='Missing hosted configuration fails'; MissingHosted=$true; Failures=1; Checks=17; FailedChecks=@('hosted MCP configured')}
  @{Name='Hosted accepting no key fails'; HostedAllowsNoKey=$true; Failures=1; FailedChecks=@('hosted MCP rejects no key')}
  @{Name='Hosted rejecting fake key fails without disclosure'; HostedRejectsKey=$true; Failures=1; FailedChecks=@('hosted MCP accepts key (cold ok)')}
  @{Name='gh authentication failure fails'; GhFailure=$true; Failures=1; FailedChecks=@('gh signed in')}
  @{Name='Inherited credential name fails'; InheritedCredentials=$true; Failures=1; FailedChecks=@('no inherited credentials')}
  @{Name='Public MCP failure fails'; LearnFailure=$true; Failures=1; FailedChecks=@('Microsoft Learn MCP')}
  @{Name='Four independent failures aggregate exit 4'; Terraform='1.14.7'; MissingCode=$true; MissingApp=$true; ShortHtml=$fourHtml; Failures=4; FailedChecks=@('terraform >=1.14.8 <2', 'VS Code CLI available', 'GitHub Copilot desktop app', 'live five-slide companion')}
)

$fixture = Join-Path $PSScriptRoot ("preflight-fixture-{0}" -f [guid]::NewGuid().ToString('N'))
$engine = (Get-Process -Id $PID).Path
$passed = 0
try {
  New-Item -ItemType Directory -Path "$fixture\.copilot" -Force | Out-Null
  '{"mcpServers":{"terraform-hosted":{"url":"https://synthetic-hosted.invalid/mcp","headers":{"X-Synthetic-Key":"synthetic-only-not-a-key"}}}}' |
    Set-Content -LiteralPath "$fixture\.copilot\mcp-config.json" -Encoding UTF8
  foreach ($test in $cases) {
    if (-not $test.ContainsKey('Terraform')) { $test.Terraform = '1.14.8' }
    if (-not $test.ContainsKey('ShortHtml')) { $test.ShortHtml = $shortHtml }
    if (-not $test.ContainsKey('Checks')) { $test.Checks = 18 }
    $encoded = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes(($test | ConvertTo-Json -Compress)))
    $output = @(& $engine -NoLogo -NoProfile -File $PSCommandPath -FixtureRoot $fixture -CaseBase64 $encoded 2>&1)
    $exitCode = $LASTEXITCODE
    $text = $output -join "`n"
    $checkLines = @($output | Where-Object { $_ -match '^(PASS|FAIL)\s' })
    $failedLines = @($output | Where-Object { $_ -match '^FAIL\s' })
    if ($exitCode -ne $test.Failures -or $failedLines.Count -ne $test.Failures -or $checkLines.Count -ne $test.Checks -or
        $text -notmatch [regex]::Escape("--- $($test.Failures) failure(s)")) {
      throw "$($test.Name): incorrect exit/count/summary (exit $exitCode).`n$text"
    }
    foreach ($name in $test.FailedChecks) {
      if (-not @($failedLines | Where-Object { $_ -match ('^FAIL\s+' + [regex]::Escape($name) + '(?:\s|$)') }).Count) {
        throw "$($test.Name): expected named failure '$name'.`n$text"
      }
    }
    if ($text -match 'synthetic-only-not-a-key|OBS installed') { throw "$($test.Name): leaked fake header or retained OBS gate" }
    if ($test.Failures -eq 0) {
      foreach ($name in @('copilot cli 1.0.x', 'squad 1.0.1', 'VS Code CLI available', 'GitHub Copilot desktop app', 'terraform >=1.14.8 <2', 'live five-slide companion', 'hosted MCP rejects no key', 'hosted MCP accepts key (cold ok)')) {
        if (-not @($checkLines | Where-Object { $_ -match ('^PASS\s+' + [regex]::Escape($name) + '(?:\s|$)') }).Count) { throw "Missing PASS for $name" }
      }
    }
    "PASS $($test.Name)"
    $passed++
  }
} finally {
  if (Test-Path -LiteralPath $fixture) { Remove-Item -LiteralPath $fixture -Recurse -Force }
}
"Controlled execution: $passed/$($cases.Count) scenarios passed; syntax PASS; 18 normal checks (17 if hosted config unavailable). No real products, credentials or HTTP were tested."
exit 0
