[CmdletBinding()]
param(
    [string] $RepositoryRoot = (Split-Path -Parent $PSScriptRoot),
    [Parameter(Mandatory)]
    [string] $DemoHome,
    [string] $InitialPromptFile
)

$ErrorActionPreference = 'Stop'
$root = (Resolve-Path -LiteralPath $RepositoryRoot).Path
$profile = (Resolve-Path -LiteralPath $DemoHome).Path
if ($profile -eq $root -or $profile.StartsWith($root + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) {
    throw 'Use a demo configuration directory outside the public repository.'
}
$names = @('SQUAD_NO_PERSONAL', 'COPILOT_HOME', 'COPILOT_ALLOW_ALL', 'COPILOT_CUSTOM_INSTRUCTIONS_DIRS')
$previous = @{}
foreach ($name in $names) {
    $previous[$name] = [Environment]::GetEnvironmentVariable($name, 'Process')
}
$arguments = @('--no-auto-update', '--agent', 'squad', '--plan', '--secret-env-vars=COPILOT_GITHUB_TOKEN,GH_TOKEN,GITHUB_TOKEN')
if ($InitialPromptFile) {
    $promptPath = (Resolve-Path -LiteralPath $InitialPromptFile).Path
    $arguments += @('--interactive', [IO.File]::ReadAllText($promptPath))
}

Push-Location -LiteralPath $root
try {
    $env:SQUAD_NO_PERSONAL = '1'
    $env:COPILOT_HOME = $profile
    $env:COPILOT_ALLOW_ALL = 'false'
    $env:COPILOT_CUSTOM_INSTRUCTIONS_DIRS = ''
    $Host.UI.RawUI.WindowTitle = 'Copilot CLI - Squad Terraform demo'
    Write-Host 'Native GitHub Copilot CLI with the Squad agent.'
    Write-Host 'Using an isolated demo configuration; no personal plugins or histories were copied.'
    Write-Host 'Plan mode first. No automatic tool or plan approval is enabled.'
    & copilot --no-auto-update --version
    if ($LASTEXITCODE -ne 0) {
        throw 'Copilot CLI is not available.'
    }
    & copilot @arguments
    if ($LASTEXITCODE -ne 0) {
        throw "Copilot CLI exited with code $LASTEXITCODE."
    }
}
finally {
    Pop-Location
    foreach ($name in $names) {
        [Environment]::SetEnvironmentVariable($name, $previous[$name], 'Process')
    }
}
