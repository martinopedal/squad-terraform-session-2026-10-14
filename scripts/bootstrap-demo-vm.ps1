[CmdletBinding(SupportsShouldProcess = $true, ConfirmImpact = 'Low')]
param(
    [string]$RepoUrl = 'https://github.com/martinopedal/terraform-azapi-aks-automatic.git',
    [string]$RepoPath = "$HOME\demo\aks-module",
    [ValidateSet('Npm', 'Winget')]
    [string]$SquadInstallSource = 'Npm',
    [ValidateSet('WebFlow', 'DeviceCode')]
    [string]$CopilotLoginMode = 'WebFlow',
    [switch]$SkipLogin
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

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

function Get-ToolVersion {
    param([string]$Name)

    switch ($Name) {
        'git' {
            if (Get-CommandSource git) { return (git --version) }
        }
        'node' {
            if (Get-CommandSource node) { return (node --version) }
        }
        'npm' {
            if (Get-CommandSource npm) { return (npm --version) }
        }
        'copilot' {
            if (Get-CommandSource copilot) { return ((copilot --version) | Select-Object -First 1) }
        }
        'squad' {
            if (Get-CommandSource squad) { return (squad --version) }
        }
    }

    return 'not installed'
}

function Ensure-WingetPackage {
    param(
        [string]$CommandName,
        [string]$PackageId
    )

    if (Get-CommandSource $CommandName) {
        Write-Host "$CommandName already available. Skipping install."
        return
    }

    if ($PSCmdlet.ShouldProcess($PackageId, 'Install with winget')) {
        & winget install --id $PackageId @wingetCommonArgs
        Refresh-SessionPath
    }
}

function Ensure-NodeToolchain {
    if (Get-CommandSource npm) {
        Write-Host 'npm already available. Skipping Node.js install.'
        return
    }

    if ($PSCmdlet.ShouldProcess('OpenJS.NodeJS.LTS', 'Install with winget')) {
        & winget install --id OpenJS.NodeJS.LTS @wingetCommonArgs
        Refresh-SessionPath
    }
}

function Ensure-Squad {
    switch ($SquadInstallSource) {
        'Npm' {
            Ensure-NodeToolchain
            if ($PSCmdlet.ShouldProcess('@bradygaster/squad-cli', 'Install or update globally with npm')) {
                & npm install --global --no-audit --no-fund @bradygaster/squad-cli
                Refresh-SessionPath
            }
        }
        'Winget' {
            Ensure-WingetPackage -CommandName 'squad' -PackageId 'bradygaster.Squad'
        }
    }
}

function Ensure-RepositoryClone {
    if (Test-Path $RepoPath) {
        try {
            $isGitRepo = (git -C $RepoPath rev-parse --is-inside-work-tree 2>$null) -eq 'true'
        }
        catch {
            $isGitRepo = $false
        }

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
        git clone $RepoUrl $RepoPath
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
            squad init
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
        & copilot @loginArgs
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
        RepoPath       = $RepoPath
        SquadDirectory = Test-Path (Join-Path $RepoPath '.squad')
    } | Format-List
}

Write-Step 'Installing prerequisites'
Ensure-WingetPackage -CommandName 'git' -PackageId 'Git.Git'
Ensure-WingetPackage -CommandName 'copilot' -PackageId 'GitHub.Copilot'
Ensure-Squad

Write-Step 'Authenticating Copilot CLI'
Invoke-CopilotLogin

Write-Step 'Preparing repository'
Ensure-RepositoryClone
Ensure-SquadInit

Show-VersionSummary

Write-Step 'Next steps'
Write-Host "Run from the repository root: copilot --agent squad"
Write-Host 'Then describe the project and confirm the proposed roster.'
