[CmdletBinding(SupportsShouldProcess = $true, ConfirmImpact = 'Low')]
param(
    [string]$RepoUrl = 'https://github.com/martinopedal/terraform-azapi-aks-automatic.git',
    [string]$RepoPath = "$HOME\demo\aks-module",
    [ValidateSet('Npm', 'Winget')]
    [string]$SquadInstallSource = 'Winget',
    [ValidateSet('WebFlow', 'DeviceCode')]
    [string]$CopilotLoginMode = 'WebFlow',
    [switch]$SkipLogin
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if ($SquadInstallSource -eq 'Npm') {
    throw 'Squad 1.0.1 is not published as @bradygaster/squad-cli on npm. Use -SquadInstallSource Winget for the rehearsed version.'
}

$wingetCommonArgs = @(
    '--exact',
    '--source', 'winget',
    '--accept-package-agreements',
    '--accept-source-agreements',
    '--silent'
)

function Write-Step {
    param([string]$Message)
    Write-Host "`n==> $Message" -ForegroundColor Cyan
}

function Refresh-SessionPath {
    $machinePath = [Environment]::GetEnvironmentVariable('Path', 'Machine')
    $userPath = [Environment]::GetEnvironmentVariable('Path', 'User')
    $env:Path = "$machinePath;$userPath"
}

function Get-CommandSource {
    param([string]$Name)

    return (Get-Command $Name -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty Source)
}

function Invoke-NativeCommand {
    param(
        [string]$FilePath,
        [string[]]$ArgumentList,
        [int[]]$AcceptedExitCodes = @(0)
    )

    # Check explicitly even when PowerShell's optional native-error preference is enabled.
    $PSNativeCommandUseErrorActionPreference = $false
    & $FilePath @ArgumentList
    $exitCode = $LASTEXITCODE
    if ($exitCode -notin $AcceptedExitCodes) {
        throw "$FilePath failed with exit code $exitCode."
    }
}

function Get-ToolVersion {
    param([string]$Name)

    switch ($Name) {
        'git' {
            if (Get-CommandSource git) { return (Invoke-NativeCommand git @('--version')) }
        }
        'node' {
            if (Get-CommandSource node) { return (Invoke-NativeCommand node @('--version')) }
        }
        'npm' {
            if (Get-CommandSource npm) { return (Invoke-NativeCommand npm @('--version')) }
        }
        'copilot' {
            if (Get-CommandSource copilot) {
                $version = Invoke-NativeCommand copilot @('--version')
                return ($version | Select-Object -First 1)
            }
        }
        'squad' {
            if (Get-CommandSource squad) { return (Invoke-NativeCommand squad @('--version')) }
        }
        'code' {
            if (Get-CommandSource code) { return (Invoke-NativeCommand code @('--version')) }
        }
    }

    return 'not installed'
}

function Ensure-WingetPackage {
    param(
        [string]$CommandName,
        [string]$PackageId,
        [string]$PackageVersion
    )

    if ($CommandName -and (Get-CommandSource $CommandName)) {
        if ($PackageVersion -and (Get-ToolVersion $CommandName) -notmatch "\b$([regex]::Escape($PackageVersion))\b") {
            throw "$CommandName is installed but is not the rehearsed version $PackageVersion. Resolve the version manually before continuing."
        }
        Write-Host "$CommandName already available. Skipping install."
        return
    }

    if (-not $CommandName) {
        $installed = Invoke-NativeCommand winget @('list', '--id', $PackageId, '--exact', '--source', 'winget', '--accept-source-agreements') -AcceptedExitCodes @(0, -1978335212)
        if ($installed -match [regex]::Escape($PackageId)) {
            Write-Host "$PackageId already installed. Skipping install."
            return
        }
    }

    if ($PSCmdlet.ShouldProcess($PackageId, 'Install with winget')) {
        $installArgs = @('install', '--id', $PackageId) + $wingetCommonArgs
        if ($PackageVersion) { $installArgs += @('--version', $PackageVersion) }
        # WinGet 0x8A15002B means the installed package has no applicable update.
        Invoke-NativeCommand winget $installArgs -AcceptedExitCodes @(0, -1978335189)
        Refresh-SessionPath
    }
}

function Ensure-Squad {
    Ensure-WingetPackage -CommandName 'squad' -PackageId 'bradygaster.Squad' -PackageVersion '1.0.1'
}

function Ensure-RepositoryClone {
    if (Test-Path $RepoPath) {
        $isGitRepo = (Invoke-NativeCommand git @('-C', $RepoPath, 'rev-parse', '--is-inside-work-tree') -AcceptedExitCodes @(0, 128) 2>$null) -eq 'true'

        if ($isGitRepo) {
            Write-Host "Repository already present at $RepoPath. Skipping clone."
            return
        }

        throw "RepoPath exists but is not a Git repository: $RepoPath"
    }

    $parent = Split-Path -Parent $RepoPath
    if (-not (Test-Path $parent) -and $PSCmdlet.ShouldProcess($parent, 'Create parent directory')) {
        New-Item -ItemType Directory -Path $parent -Force | Out-Null
    }

    if ($PSCmdlet.ShouldProcess($RepoUrl, "Clone into $RepoPath")) {
        Invoke-NativeCommand git @('clone', $RepoUrl, $RepoPath)
    }
}

function Ensure-SquadInit {
    $squadPath = Join-Path $RepoPath '.squad'
    if (Test-Path $squadPath) {
        Write-Host "Squad already initialized at $RepoPath. Skipping squad init."
        return
    }

    if ($PSCmdlet.ShouldProcess($RepoPath, 'Run squad init')) {
        Push-Location $RepoPath
        try {
            Invoke-NativeCommand squad @('init')
        }
        finally {
            Pop-Location
        }
    }
}

function Invoke-CopilotLogin {
    if ($SkipLogin) {
        Write-Host 'SkipLogin set. Skipping copilot login.'
        return
    }

    $loginArgs = @('login')
    if ($CopilotLoginMode -eq 'DeviceCode') {
        $loginArgs += '--device-code'
    }
    else {
        $loginArgs += '--web-flow'
    }

    if ($PSCmdlet.ShouldProcess('copilot', "Authenticate with $CopilotLoginMode")) {
        Invoke-NativeCommand copilot $loginArgs
    }
}

function Show-VersionSummary {
    Write-Step 'Version summary'
    [pscustomobject]@{
        Git            = Get-ToolVersion git
        Node           = Get-ToolVersion node
        Npm            = Get-ToolVersion npm
        CopilotCli     = Get-ToolVersion copilot
        SquadCli       = Get-ToolVersion squad
        VSCode         = Get-ToolVersion code
        RepoPath       = $RepoPath
        SquadDirectory = Test-Path (Join-Path $RepoPath '.squad')
    } | Format-List
}

Write-Step 'Installing prerequisites'
Ensure-WingetPackage -CommandName 'git' -PackageId 'Git.Git'
Ensure-WingetPackage -PackageId 'GitHub.CopilotApp'
Ensure-WingetPackage -CommandName 'code' -PackageId 'Microsoft.VisualStudioCode'
Ensure-WingetPackage -CommandName 'copilot' -PackageId 'GitHub.Copilot'
Ensure-Squad

Write-Step 'Authenticating Copilot CLI'
Invoke-CopilotLogin

Write-Step 'Preparing repository'
Ensure-RepositoryClone
Ensure-SquadInit

Show-VersionSummary

Write-Step 'Next steps'
Write-Host 'Open GitHub Copilot from the Start menu and sign in manually; its app policy is separate from CLI policy.'
Write-Host "Open VS Code manually from the repository root: code ."
Write-Host "Run from the repository root: copilot --agent squad"
Write-Host 'Then describe the project and confirm the proposed roster.'
