[CmdletBinding()]
param(
    [string]$SourceRoot = 'C:\demo\session-repo',
    [string]$DemoRoot = 'C:\demo',
    [string]$Pin = '0abb202f34af385b7e0a34b1775643aa5b4871ed',
    [Parameter(Mandatory)][string]$ProviderMirror,
    [string]$TakeName = 'take-20261014'
)
$ErrorActionPreference = 'Stop'
function Invoke-DemoGit([string]$Root, [string[]]$Arguments) {
    $result = & git -C $Root @Arguments
    if ($LASTEXITCODE) { throw "Git failed: $($Arguments -join ' ')" }
    return $result
}
function FullPath([string]$Path) { return [IO.Path]::GetFullPath($Path).TrimEnd('\') }
if ($Pin -notmatch '^[0-9a-f]{40}$' -or $TakeName -notmatch '^take-[a-zA-Z0-9-]+$') {
    throw 'Use a reviewed full commit SHA and a simple approved take name.'
}
$SourceRoot = FullPath $SourceRoot
$root = (Invoke-DemoGit $SourceRoot @('rev-parse','--show-toplevel')).Replace('/','\')
if ((FullPath $root) -ne $SourceRoot) { throw 'Source must be the exact public Git root.' }
if ((Invoke-DemoGit $SourceRoot @('remote','get-url','origin')) -ne 'https://github.com/martinopedal/squad-terraform-session-2026-10-14.git') {
    throw 'Wrong public source origin; preserve existing files.'
}
if (@(Invoke-DemoGit $SourceRoot @('status','--porcelain')).Count) { throw 'Source is dirty; preserve and review it.' }
Invoke-DemoGit $SourceRoot @('cat-file','-e', "${Pin}:terraform/modules/aks-automatic-corp/tests/contract.tftest.hcl") | Out-Null
$contract = Invoke-DemoGit $SourceRoot @('show', "${Pin}:terraform/modules/aks-automatic-corp/tests/contract.tftest.hcl")
if (($contract -join "`n") -match 'run\s+"alternate_network_payload"') { throw 'Checkpoint already has the C1 regression.' }
$ProviderMirror = FullPath $ProviderMirror
$package = Join-Path $ProviderMirror 'registry.terraform.io\azure\azapi'
if (-not (Test-Path $package -PathType Container) -or
    -not (Get-ChildItem $package -Recurse -File | Where-Object {
        $_.Name -match '^terraform-provider-azapi_2\.12\.0_windows_amd64\.zip$' -or
        $_.FullName.Replace('/','\') -match '\\2\.12\.0\\windows_amd64\\terraform-provider-azapi_v?2\.12\.0.*\.exe$'
    })) {
    throw 'Supply an already qualified filesystem mirror containing AzAPI 2.12.0 for Windows; no download here.'
}
$take = Join-Path (Join-Path (FullPath $DemoRoot) 'checkpoints') $TakeName
$common = FullPath (Invoke-DemoGit $SourceRoot @('rev-parse','--path-format=absolute','--git-common-dir'))
$required = @('AGENTS.md', '.github\agents\terraform-coder.agent.md',
    '.github\agents\terraform-validator.agent.md', '.github\agents\terraform-reviewer.agent.md',
    'terraform\modules\aks-automatic-corp\tests\contract.tftest.hcl',
    'terraform\modules\aks-automatic-corp\.terraform.lock.hcl')
foreach ($name in 'A','B','guided') {
    $path = Join-Path $take $name
    if (Test-Path $path) {
        $actualRoot = (Invoke-DemoGit $path @('rev-parse','--show-toplevel')).Replace('/','\')
        if ((FullPath $actualRoot) -ne (FullPath $path) -or
            (FullPath (Invoke-DemoGit $path @('rev-parse','--path-format=absolute','--git-common-dir'))) -ne $common -or
            (Invoke-DemoGit $path @('rev-parse','HEAD')) -ne $Pin -or
            @(Invoke-DemoGit $path @('status','--porcelain')).Count) {
            throw "Existing $name is dirty, mismatched or not this source's worktree; preserve it."
        }
        foreach ($file in $required) {
            if (-not (Test-Path (Join-Path $path $file) -PathType Leaf)) { throw "Existing $name lacks $file." }
        }
    }
}
if ((Test-Path $take) -and
    @('A','B','guided','offline','evidence').Where({ -not (Test-Path (Join-Path $take $_)) }).Count) {
    throw 'Partial/existing take detected; preserve it and select another approved take name.'
}
$evidence = Join-Path $take 'evidence'
$offline = Join-Path $take 'offline'
$mirror = Join-Path $offline 'providers'
$config = "provider_installation {`n  filesystem_mirror {`n    path = `"$($mirror.Replace('\','/'))`"`n    include = [`"registry.terraform.io/azure/azapi`"]`n  }`n}`n"
if (Test-Path $take) {
    if ((Get-Content (Join-Path $evidence 'checkpoint.txt') -Raw).Trim() -ne $Pin -or
        (Get-Content (Join-Path $offline 'terraform.tfrc') -Raw) -ne $config) {
        throw 'Existing evidence/config does not match this checkpoint; preserve it.'
    }
    $incoming = @(Get-ChildItem $ProviderMirror -Recurse -File)
    $staged = @(Get-ChildItem $mirror -Recurse -File)
    if ($incoming.Count -ne $staged.Count) { throw 'Existing mirror inventory differs.' }
    foreach ($file in $incoming) {
        $other = Join-Path $mirror ([IO.Path]::GetRelativePath($ProviderMirror, $file.FullName))
        if (-not (Test-Path $other -PathType Leaf) -or
            (Get-FileHash $file.FullName).Hash -ne (Get-FileHash $other).Hash) {
            throw 'Existing mirror bytes differ; preserve them.'
        }
    }
    "VERIFIED existing pristine take: $take ($Pin)"
    return
}
New-Item -ItemType Directory -Path $take, $evidence, $offline | Out-Null
$paths = @('AGENTS.md','QUALITY.md','PUBLICATION.md','README.md','CONTRIBUTING.md','.gitignore',
    '.github/agents/','.github/skills/','.github/instructions/','.github/copilot-instructions.md',
    '.github/pull_request_template.md','docs/','presentation/README.md','presentation/index.html',
    'terraform/module-source.json','terraform/modules/aks-automatic-corp/',
    '.squad/team.md','.squad/routing.md','.squad/decisions.md','.squad/config.json',
    '.squad/casting/registry.json','.squad/casting/policy.json',
    '.squad/agents/*/charter.md','.squad/templates/')
$patterns = $paths | ForEach-Object { '/' + $_ }
foreach ($name in 'A','B','guided') {
    $path = Join-Path $take $name
    Invoke-DemoGit $SourceRoot @('worktree','add','--detach','--no-checkout',$path,$Pin) | Out-Null
    Invoke-DemoGit $path (@('sparse-checkout','set','--no-cone','--') + $patterns) | Out-Null
    Invoke-DemoGit $path @('checkout','-q','--detach') | Out-Null
    foreach ($file in $required) {
        if (-not (Test-Path (Join-Path $path $file) -PathType Leaf)) { throw "Created $name lacks $file." }
    }
    if ((Invoke-DemoGit $path @('rev-parse','HEAD')) -ne $Pin -or @(Invoke-DemoGit $path @('status','--porcelain')).Count) {
        throw 'Created worktree did not qualify; preserve partial take for inspection.'
    }
}
Copy-Item -LiteralPath $ProviderMirror -Destination $mirror -Recurse
[IO.File]::WriteAllText((Join-Path $offline 'terraform.tfrc'), $config, [Text.UTF8Encoding]::new($false))
$Pin | Set-Content (Join-Path $evidence 'checkpoint.txt')
Invoke-DemoGit (Join-Path $take 'guided') @('ls-files','-s','--','terraform/modules/aks-automatic-corp') |
    Set-Content (Join-Path $evidence 'checkpoint-tree.txt')
"CREATED A/B/guided + offline/evidence: $take ($Pin)"
