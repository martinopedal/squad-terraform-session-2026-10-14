[CmdletBinding(SupportsShouldProcess = $true, ConfirmImpact = 'Low')]
param(
    [string]$RepoUrl = 'https://github.com/martinopedal/terraform-azapi-aks-automatic.git',
    [string]$RepoPath = "C:\demo\aks-module",
    [ValidateSet('Npm', 'Winget')]
    [string]$SquadInstallSource = 'Winget',
    [ValidateSet('WebFlow', 'DeviceCode')]
    [string]$CopilotLoginMode = 'WebFlow',
    [switch]$SkipLogin,
    [Alias('PackageOnly')]
    [switch]$SkipRepository,
    [switch]$AllUsers,
    [switch]$InstallDocker
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if ($SquadInstallSource -eq 'Npm') {
    throw 'Squad 1.0.1 is not published as @bradygaster/squad-cli on npm. Use -SquadInstallSource Winget for the rehearsed version.'
}
if (-not $AllUsers -and -not $WhatIfPreference -and [Security.Principal.WindowsIdentity]::GetCurrent().IsSystem) {
    throw 'LocalSYSTEM/AllUsers bootstrap is blocked in presenter mode. Use the explicit -AllUsers native machine-payload mode; no presenter installation, auth, clone or Squad init was attempted.'
}

$wingetCommonArgs = @(
    '--exact',
    '--source', 'winget',
    '--accept-package-agreements',
    '--accept-source-agreements',
    '--silent'
)
$versions = [ordered]@{}
$authStatus = [ordered]@{}
$acaInstallUri = 'https://aka.ms/aca-cli-install-ps'
$acaBin = Join-Path $HOME '.aca\bin'
$desktopVersion = 'not checked'

function Write-Step {
    param([string]$Message)
    Write-Host "`n==> $Message" -ForegroundColor Cyan
}

function Refresh-SessionPath {
    if ($PSCmdlet.ShouldProcess('Current process PATH', 'Merge session, machine, user and ACA paths')) {
        $paths = @($env:Path, [Environment]::GetEnvironmentVariable('Path', 'Machine'),
            [Environment]::GetEnvironmentVariable('Path', 'User'), $acaBin)
        $unique = New-Object 'System.Collections.Generic.HashSet[string]' ([StringComparer]::OrdinalIgnoreCase)
        $entries = foreach ($path in $paths) {
            foreach ($entry in ($path -split ';')) {
                if (-not [string]::IsNullOrWhiteSpace($entry) -and $unique.Add($entry)) { $entry }
            }
        }
        $env:Path = $entries -join ';'
    }
}

function Get-CommandSource {
    param([string]$Name)

    $candidates = @($Name)
    if ($Name -in @('npm', 'code', 'az')) { $candidates = @("$Name.cmd", $Name) }
    foreach ($candidate in $candidates) {
        $command = Get-Command $candidate -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($command) { return $command.Source }
    }
    if ($Name -eq 'aca' -and (Test-Path (Join-Path $acaBin 'aca.exe'))) {
        return (Join-Path $acaBin 'aca.exe')
    }
}

function Invoke-NativeCommand {
    param(
        [string]$FilePath,
        [string[]]$ArgumentList,
        [int[]]$AcceptedExitCodes = @(0),
        [switch]$Installer,
        [switch]$Quiet,
        [switch]$Interactive
    )

    # Windows PowerShell 5.1 treats redirected native stderr as ErrorRecords.
    # Exit codes, not either engine's optional native-error behavior, are authoritative.
    $ErrorActionPreference = 'Continue'
    $PSNativeCommandUseErrorActionPreference = $false
    $global:LASTEXITCODE = $null
    $output = @()
    if ($Interactive) {
        & $FilePath @ArgumentList 2>&1 | Out-Host
    }
    elseif ($Quiet) {
        & $FilePath @ArgumentList *> $null
    }
    else {
        $output = @(& $FilePath @ArgumentList 2>&1)
    }
    $exitCode = $LASTEXITCODE
    if ($null -eq $exitCode) { throw "$FilePath did not report a native exit code." }
    # MSI statuses and WinGet's documented reboot HRESULTs are never a readiness pass.
    if ($Installer -and $exitCode -in @(3010, 1641, -1978334967, -1978334966, -1978334965)) {
        Write-Warning "Reboot required/reported by $FilePath (exit code $exitCode). No reboot requested by this script. Stop, review, restart manually if approved, then rerun."
        exit $exitCode
    }
    if ($exitCode -notin $AcceptedExitCodes) {
        throw "$FilePath failed with exit code $exitCode."
    }
    return [pscustomobject]@{ Output = $output; ExitCode = $exitCode }
}

function Get-ToolVersion {
    param([string]$Name)

    $source = Get-CommandSource $Name
    if (-not $source) {
        if ($WhatIfPreference) { return 'missing (installation previewed; not verified)' }
        throw "Required command '$Name' is unavailable after setup. Open a new shell or resolve the installer/PATH before rerunning."
    }
    $arguments = @('--version')
    if ($Name -eq 'az') { $arguments = @('version', '--output', 'json') }
    if ($Name -eq 'pwsh') {
        $arguments = @('-NoLogo', '-NoProfile', '-Command', '$PSVersionTable.PSVersion.ToString()')
    }
    $result = Invoke-NativeCommand $source $arguments
    if (-not $result.Output.Count -or [string]::IsNullOrWhiteSpace(($result.Output -join ' '))) {
        throw "$Name returned an empty version response."
    }
    if ($Name -eq 'az') {
        $version = ($result.Output -join "`n" | ConvertFrom-Json).'azure-cli'
        if (-not $version) { throw 'az version did not report azure-cli.' }
        return $version
    }
    return [string]($result.Output | Select-Object -First 1)
}

function Ensure-WingetPackage {
    param(
        [string]$CommandName,
        [string]$PackageId,
        [string]$PackageVersion,
        [string]$InstallerOverride
    )

    if ($CommandName -and (Get-CommandSource $CommandName)) {
        $versions[$CommandName] = Get-ToolVersion $CommandName
        if ($PackageVersion -and $versions[$CommandName] -notmatch "(?<![\d.])$([regex]::Escape($PackageVersion))(?![\d.])") {
            throw "$CommandName is installed but is not the rehearsed version $PackageVersion. Resolve the version manually before continuing."
        }
        Write-Host "$CommandName already available. Skipping install."
        return
    }

    $winget = Get-CommandSource winget
    if (-not $winget -and -not $WhatIfPreference) {
        throw 'WinGet is required for missing packages and desktop-app inventory. Install Microsoft App Installer through the approved Windows image/Store first.'
    }
    if (-not $CommandName -and $winget -and
        $PSCmdlet.ShouldProcess($PackageId, 'Query installed app with WinGet (accept source agreements)')) {
        $installed = Invoke-NativeCommand $winget @('list', '--id', $PackageId, '--exact', '--source', 'winget', '--accept-source-agreements') -AcceptedExitCodes @(0, -1978335212)
        if ($installed.ExitCode -eq 0) {
            $match = [regex]::Match(($installed.Output -join "`n"), "$([regex]::Escape($PackageId))\s+(\S+)")
            if (-not $match.Success) { throw "WinGet inventory did not report the exact package $PackageId." }
            $script:desktopVersion = $match.Groups[1].Value
            Write-Host "$PackageId already installed. Skipping install."
            return
        }
    }

    if ($PSCmdlet.ShouldProcess($PackageId, 'Install with winget')) {
        $installArgs = @('install', '--id', $PackageId) + $wingetCommonArgs
        if ($PackageId -eq 'Docker.DockerDesktop') {
            $installArgs = @($installArgs | Where-Object { $_ -ne '--accept-package-agreements' })
        }
        if ($PackageVersion) { $installArgs += @('--version', $PackageVersion) }
        if ($InstallerOverride) { $installArgs += @('--override', $InstallerOverride) }
        # WinGet 0x8A15002B means the installed package has no applicable update.
        Invoke-NativeCommand $winget $installArgs -AcceptedExitCodes @(0, -1978335189) -Installer -Interactive | Out-Null
        Refresh-SessionPath
        if ($CommandName) {
            $versions[$CommandName] = Get-ToolVersion $CommandName
            if ($PackageVersion -and $versions[$CommandName] -notmatch "(?<![\d.])$([regex]::Escape($PackageVersion))(?![\d.])") {
                throw "$CommandName installation did not produce the rehearsed version $PackageVersion."
            }
        }
        else {
            # Requery installation, not the online catalog, for the desktop summary.
            $installed = Invoke-NativeCommand $winget @('list', '--id', $PackageId, '--exact', '--source', 'winget', '--accept-source-agreements')
            $match = [regex]::Match(($installed.Output -join "`n"), "$([regex]::Escape($PackageId))\s+(\S+)")
            if (-not $match.Success) { throw "WinGet installation did not produce the exact package $PackageId." }
            $script:desktopVersion = $match.Groups[1].Value
        }
    }
    elseif ($CommandName) {
        $versions[$CommandName] = 'missing (installation previewed/declined; not verified)'
    }
    else {
        $script:desktopVersion = 'missing (installation previewed/declined; not verified)'
    }
}

function Ensure-Aca {
    if (Get-CommandSource aca) {
        $versions['aca'] = Get-ToolVersion aca
        Write-Host 'aca already available. Skipping install.'
        return
    }
    if ($PSCmdlet.ShouldProcess($acaInstallUri, 'Download and run official ACA installer (upstream verifies binary SHA-256)')) {
        $installer = (Invoke-WebRequest -Uri $acaInstallUri -UseBasicParsing).Content
        if ([string]::IsNullOrWhiteSpace($installer)) { throw 'Official ACA installer download was empty.' }
        $installerBlock = [scriptblock]::Create($installer)
        # The official installer uses TEMP/TMP. Isolate its scratch files under
        # the working directory, not a shared system temporary directory.
        $scratch = Join-Path $PWD ('.bootstrap-aca-' + [guid]::NewGuid().ToString('N'))
        $previousTemp = $env:TEMP
        $previousTmp = $env:TMP
        New-Item -ItemType Directory -Path $scratch | Out-Null
        try {
            $env:TEMP = $scratch
            $env:TMP = $scratch
            $global:LASTEXITCODE = $null
            & $installerBlock -InstallDir $acaBin
            if ($null -ne $LASTEXITCODE -and $LASTEXITCODE -ne 0) {
                throw "Official ACA installer failed with exit code $LASTEXITCODE."
            }
        }
        finally {
            $env:TEMP = $previousTemp
            $env:TMP = $previousTmp
            Remove-Item -LiteralPath $scratch -Recurse -Force
        }
        Refresh-SessionPath
        $versions['aca'] = Get-ToolVersion aca
    }
    else { $versions['aca'] = 'missing (installation previewed/declined; not verified)' }
}

function Assert-DockerPrerequisites {
    if ($WhatIfPreference) {
        Write-Host 'Docker preview only: WSL 2, nested virtualization, licensing and restart readiness are NOT verified.'
        return
    }
    $wsl = Get-CommandSource wsl
    if (-not $wsl) { throw 'Docker requires operator-prepared WSL 2. This script never installs WSL or enables Windows features.' }
    $features = @(Get-CimInstance -ClassName Win32_OptionalFeature -Filter "Name = 'Microsoft-Windows-Subsystem-Linux' OR Name = 'VirtualMachinePlatform'")
    if ($features.Count -ne 2 -or @($features | Where-Object { $_.InstallState -ne 1 }).Count) {
        throw 'Docker requires enabled WSL and VirtualMachinePlatform features and an approved restart first. No features changed.'
    }
    $result = Invoke-NativeCommand $wsl @('--version')
    $match = [regex]::Match(($result.Output -join ' '), '\d+\.\d+\.\d+')
    if (-not $match.Success -or [version]$match.Value -lt [version]'2.1.5') {
        throw 'Docker requires WSL version 2.1.5 or newer. Prepare/update it separately with operator approval.'
    }
    Invoke-NativeCommand $wsl @('--status') -Quiet | Out-Null
}

function Ensure-RepositoryClone {
    if (Test-Path $RepoPath) {
        $git = Get-CommandSource git
        if (-not $git -and $WhatIfPreference) {
            Write-Host 'Existing RepoPath cannot be verified without Git; no existing files will be changed in this preview.'
            return
        }
        $result = Invoke-NativeCommand $git @('-C', $RepoPath, 'rev-parse', '--is-inside-work-tree') -AcceptedExitCodes @(0, 128)
        $isGitRepo = $result.ExitCode -eq 0 -and ($result.Output -contains 'true')

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
        $stagingPath = "$RepoPath.bootstrap-$([guid]::NewGuid().ToString('N'))"
        try {
            Invoke-NativeCommand (Get-CommandSource git) @('clone', $RepoUrl, $stagingPath) -Interactive | Out-Null
            if (Test-Path $RepoPath) { throw "RepoPath appeared during cloning; refusing to overwrite it: $RepoPath" }
            Move-Item -LiteralPath $stagingPath -Destination $RepoPath
        }
        finally {
            if (Test-Path $stagingPath) { Remove-Item -LiteralPath $stagingPath -Recurse -Force }
        }
    }
}

function Ensure-SquadInit {
    $squadPath = Join-Path $RepoPath '.squad'
    if ((Test-Path $squadPath) -or (Test-Path (Join-Path $RepoPath '.github\agents\squad.agent.md'))) {
        Write-Host "Squad already initialized at $RepoPath. Skipping squad init."
        return
    }

    if ($PSCmdlet.ShouldProcess($RepoPath, 'Run squad init only for a repository without existing Squad state/profile')) {
        Push-Location $RepoPath
        try {
            Invoke-NativeCommand (Get-CommandSource squad) @('init') -Interactive | Out-Null
        }
        finally {
            Pop-Location
        }
    }
}

function Invoke-CopilotLogin {
    if (-not $PSCmdlet.ShouldProcess('copilot', 'Check GitHub authentication; sign in to Copilot if no reusable GitHub session exists')) {
        $authStatus['Copilot'] = 'previewed/declined; not checked'
        return
    }
    # Copilot has no standalone auth-status command. A valid gh OAuth session
    # is a supported credential source, not proof of Copilot entitlement.
    $github = Invoke-NativeCommand (Get-CommandSource gh) @('auth', 'status', '--hostname', 'github.com') -AcceptedExitCodes @(0, 1) -Quiet
    if ($github.ExitCode -eq 0) {
        $authStatus['Copilot'] = 'GitHub session available; verify Copilot entitlement/session manually'
        Write-Host 'GitHub session available. Skipping repeated Copilot login; verify Copilot manually in its UI.'
        return
    }
    $loginArgs = @('login')
    if ($CopilotLoginMode -eq 'DeviceCode') {
        $loginArgs += '--device-code'
    }
    else {
        $loginArgs += '--web-flow'
    }

    Invoke-NativeCommand (Get-CommandSource copilot) $loginArgs -Interactive | Out-Null
    $authStatus['Copilot'] = 'login completed; verify entitlement/session manually'
}

function Ensure-Login {
    param([string]$Name, [string[]]$StatusArguments, [string[]]$LoginArguments)
    if (-not $PSCmdlet.ShouldProcess($Name, 'Check authentication and sign in only if needed')) {
        $authStatus[$Name] = 'previewed/declined; not checked'
        return
    }
    $source = Get-CommandSource $Name
    $status = Invoke-NativeCommand $source $StatusArguments -AcceptedExitCodes @(0, 1) -Quiet
    if ($status.ExitCode -ne 0) {
        Invoke-NativeCommand $source $LoginArguments -Interactive | Out-Null
        Invoke-NativeCommand $source $StatusArguments -Quiet | Out-Null
    }
    $authStatus[$Name] = 'authenticated (not target access/readiness)'
}

function Show-VersionSummary {
    Write-Step 'Version summary'
    [pscustomobject]$versions | Format-List
    [pscustomobject]@{
        CopilotDesktop = $desktopVersion
        Docker         = $(if ($versions.Contains('docker')) { $versions['docker'] } else { 'optional; not installed by default' })
        WSL            = 'operator-managed optional prerequisite; never installed/enabled by bootstrap'
        Bicep          = 'not required by current tracked Terraform demo; not installed'
        Authentication = $(if ($SkipLogin) { 'skipped; zero auth calls' } else { ($authStatus.GetEnumerator() | ForEach-Object { "$($_.Key): $($_.Value)" }) -join '; ' })
        Reboot         = 'not requested; reported installer reboot codes stop setup'
        RepoPath       = $RepoPath
        Repository     = $(if ($SkipRepository) { 'skipped (package-only; no clone or Squad init)' } else { 'existing repository preserved or new clone prepared' })
        SquadDirectory = $(if ($SkipRepository) { 'not checked (package-only)' } else { Test-Path (Join-Path $RepoPath '.squad') })
        InstallScope   = 'presenter-context inventory; AllUsers/SYSTEM completion is NOT established'
    } | Format-List
    Write-Host 'Inventory only: not clean-VM execution, native UI, selected Azure target or rehearsal proof.'
}

function Assert-NoReparsePath {
    param([string]$Path)
    $current = [IO.Path]::GetFullPath($Path)
    while ($current) {
        if (Test-Path -LiteralPath $current) {
            $item = Get-Item -LiteralPath $current -Force
            if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) {
                throw "Machine path contains a reparse point; refusing to follow it: $current"
            }
        }
        $current = Split-Path -Parent $current
    }
}

function Initialize-ProtectedDirectory {
    param([string]$Path)
    Assert-NoReparsePath $Path
    if (Test-Path -LiteralPath $Path) {
        $acl = Get-Acl -LiteralPath $Path
        $writeMask = 2 -bor 4 -bor 16 -bor 64 -bor 256 -bor 65536 -bor 262144 -bor 524288
        foreach ($rule in $acl.GetAccessRules($true, $true, [Security.Principal.SecurityIdentifier])) {
            if ($rule.AccessControlType -eq 'Allow' -and ([int]$rule.FileSystemRights -band $writeMask) -and
                $rule.IdentityReference.Value -notin @('S-1-5-18', 'S-1-5-32-544')) {
                throw "Existing bootstrap directory is writable outside SYSTEM/Administrators; preserve and repair it explicitly: $Path"
            }
        }
        return
    }
    New-Item -ItemType Directory -Path $Path | Out-Null
    $acl = New-Object Security.AccessControl.DirectorySecurity
    $acl.SetAccessRuleProtection($true, $false)
    foreach ($entry in @(@('S-1-5-18', 'FullControl'), @('S-1-5-32-544', 'FullControl'), @('S-1-5-32-545', 'ReadAndExecute'))) {
        $sid = New-Object Security.Principal.SecurityIdentifier $entry[0]
        $rule = New-Object Security.AccessControl.FileSystemAccessRule($sid, $entry[1],
            'ContainerInherit, ObjectInherit', 'None', 'Allow')
        $acl.AddAccessRule($rule)
    }
    Set-Acl -LiteralPath $Path -AclObject $acl
}

function Expand-VerifiedMachineArchive {
    param([string]$Archive, [string]$Destination, [string]$PackageId)
    Add-Type -AssemblyName System.IO.Compression, System.IO.Compression.FileSystem
    $zip = [IO.Compression.ZipFile]::OpenRead($Archive)
    try {
        $names = New-Object 'System.Collections.Generic.HashSet[string]' ([StringComparer]::OrdinalIgnoreCase)
        $totalLength = 0L
        foreach ($entry in $zip.Entries) {
            $relative = $entry.FullName.Replace('/', '\').TrimEnd('\')
            $parts = @($relative -split '\\')
            if (-not $relative -or [IO.Path]::IsPathRooted($relative) -or $relative.Contains(':') -or
                @($parts | Where-Object { $_ -in @('', '.', '..') -or $_ -match '[. ]$|^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(\.|$)' }).Count) {
                throw "$PackageId unsafe ZIP entry: $($entry.FullName)"
            }
            if (-not $names.Add($relative) -or
                (($entry.ExternalAttributes -shr 16) -band 61440) -eq 40960 -or
                ($entry.ExternalAttributes -band 1024)) {
                throw "$PackageId duplicate/symlink/reparse ZIP entry: $($entry.FullName)"
            }
            $totalLength += $entry.Length
            if ($totalLength -gt 2GB) { throw "$PackageId ZIP exceeds the 2 GiB extraction limit." }
            $target = [IO.Path]::GetFullPath((Join-Path $Destination $relative))
            if (-not $target.StartsWith(([IO.Path]::GetFullPath($Destination).TrimEnd('\') + '\'), [StringComparison]::OrdinalIgnoreCase)) {
                throw "$PackageId ZIP entry escapes extraction root: $($entry.FullName)"
            }
        }
    }
    finally { $zip.Dispose() }
    Assert-NoReparsePath $Destination
    [IO.Compression.ZipFile]::ExtractToDirectory($Archive, $Destination)
}

function Invoke-MachineProcess {
    param(
        [string]$PackageId, [string]$FilePath, [string[]]$Arguments,
        [string]$OutputPath, [string]$ErrorPath, [switch]$Installer
    )
    $options = @{ FilePath = $FilePath; ArgumentList = $Arguments; Wait = $true; PassThru = $true; NoNewWindow = $true }
    if ($OutputPath) {
        $options['RedirectStandardOutput'] = $OutputPath
        $options['RedirectStandardError'] = $ErrorPath
    }
    try { $process = Start-Process @options }
    catch { throw "$PackageId process launch failed for ${FilePath}: $($_.Exception.Message)" }
    if ($null -eq $process -or $null -eq $process.ExitCode) { throw "$PackageId process did not report an exit code: $FilePath" }
    $code = $process.ExitCode
    if ($Installer -and $code -in @(3010, 1641)) {
        Write-Warning "$PackageId reboot required/reported (exit code $code). No reboot requested. Review and restart manually if approved, then rerun."
        exit $code
    }
    if ($code -ne 0) { throw "$PackageId failed with exit code ${code}: $FilePath" }
}

function Get-MachineToolVersion {
    param([object]$Package, [object]$Tool, [string]$Path, [string]$Scratch)
    Assert-NoReparsePath $Path
    if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
        throw "$($Package.id) missing expected machine executable: $Path"
    }
    $arguments = @('--version')
    if ($Tool.name -eq 'az') { $arguments = @('version', '--output', 'json') }
    if ($Tool.name -eq 'pwsh') { $arguments = @('-NoLogo', '-NoProfile', '-Command', '"$PSVersionTable.PSVersion.ToString()"') }
    $file = $Path
    if ([IO.Path]::GetExtension($Path) -eq '.cmd') {
        $file = Join-Path $env:SystemRoot 'System32\cmd.exe'
        $arguments = @('/d', '/s', '/c', ('""{0}" {1}"' -f $Path, ($arguments -join ' ')))
    }
    $output = Join-Path $Scratch "$($Tool.name).stdout"
    $errors = Join-Path $Scratch "$($Tool.name).stderr"
    Invoke-MachineProcess -PackageId $Package.id -FilePath $file -Arguments $arguments -OutputPath $output -ErrorPath $errors
    $text = Get-Content -LiteralPath $output -Raw
    if ([string]::IsNullOrWhiteSpace($text)) { throw "$($Package.id) empty version response: $Path" }
    $version = ($text -split '\r?\n' | Select-Object -First 1)
    if ($Tool.name -eq 'az') { $version = ($text | ConvertFrom-Json).'azure-cli' }
    $expected = [regex]::Escape($Tool.version)
    if (-not $version -or $version -notmatch "(?<![\d.])$expected(?![\d.\-+])") {
        throw "$($Package.id) expected $($Tool.name) version $($Tool.version) at $Path; reported '$version'. Resolve the version before rerunning."
    }
    return [string]$version
}

function Invoke-AllUsersBootstrap {
    $SkipLogin = $true
    $SkipRepository = $true
    if ($InstallDocker) { throw '-AllUsers does not install Docker or enable WSL/features. Prepare that optional lane separately.' }
    $manifestPath = Join-Path $PSScriptRoot 'bootstrap-demo-vm.packages.json'
    $manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
    $required = @('pwsh', 'git', 'code', 'copilot', 'az', 'gh', 'terraform', 'node', 'npm', 'squad', 'aca')
    $listed = @($manifest.packages | ForEach-Object { $_.tools | ForEach-Object { $_.name } })
    if ($manifest.schemaVersion -ne 1 -or $manifest.architecture -ne 'x64' -or $manifest.packages.Count -ne 10 -or
        @((Compare-Object ($required | Sort-Object) ($listed | Sort-Object))).Count) {
        throw 'Machine payload manifest does not describe the exact x64 core bundle.'
    }
    foreach ($package in $manifest.packages) {
        if ($package.kind -notin @('msi', 'inno', 'zip') -or $package.sha256 -notmatch '^[0-9a-fA-F]{64}$' -or
            $package.url -notmatch '^https://' -or $package.url -match '/latest[/?.]') {
            throw "Invalid pinned machine payload: $($package.id)"
        }
        foreach ($tool in $package.tools) {
            if ([IO.Path]::IsPathRooted($tool.path) -or $tool.path.Contains(':') -or ($tool.path -split '\\') -contains '..') {
                throw "Unsafe machine executable path in $($package.id): $($tool.path)"
            }
        }
        if ($package.kind -in @('zip', 'inno')) {
            if ([IO.Path]::IsPathRooted($package.directory) -or $package.directory.Contains(':') -or
                ($package.directory -split '\\') -contains '..') {
                throw "Unsafe machine directory in $($package.id): $($package.directory)"
            }
            if ($package.kind -eq 'zip' -and @($package.tools | Where-Object {
                -not $_.path.StartsWith(($package.directory + '\'), [StringComparison]::OrdinalIgnoreCase)
            }).Count) { throw "$($package.id) portable paths do not match its fixed directory." }
        }
    }
    $programFiles = [IO.Path]::GetFullPath($env:ProgramFiles)
    $root = Join-Path $programFiles 'DemoBootstrap'
    $reportRoot = Join-Path $env:ProgramData 'DemoBootstrap'
    $reportPath = Join-Path $reportRoot 'machine-bootstrap.json'
    $registryPath = 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Environment'
    if ($programFiles -match '\\(Users|systemprofile)(\\|$)' -or $reportRoot -match '\\systemprofile(\\|$)') {
        throw 'AllUsers install/report roots must not be user or SYSTEM profile directories.'
    }
    if ($WhatIfPreference) {
        foreach ($package in $manifest.packages) {
            $null = $PSCmdlet.ShouldProcess("$($package.id) $($package.version)", 'Validate fixed machine paths; download pinned payload, verify SHA-256 and install only if missing')
        }
        $null = $PSCmdlet.ShouldProcess($registryPath, 'Preserve and append required MACHINE PATH entries')
        $null = $PSCmdlet.ShouldProcess($reportPath, 'Write machine receipt; authentication, repository and desktop onboarding remain deferred')
        Write-Host 'AllUsers preview only: no installs/downloads/PATH/receipt/auth/repository changes; machine tool versions NOT verified.'
        return
    }
    if (-not [Environment]::Is64BitOperatingSystem -or -not [Environment]::Is64BitProcess) {
        throw 'AllUsers requires Windows x64 and 64-bit PowerShell; do not invoke it through a WOW64 host.'
    }
    $whoami = Get-Command (Join-Path $env:SystemRoot 'System32\whoami.exe') -ErrorAction Stop
    $groups = Invoke-NativeCommand $whoami.Source @('/groups', '/fo', 'csv', '/nh')
    $tokenGroups = $groups.Output -join ' '
    if ($tokenGroups -notmatch 'S-1-5-32-544(?!\d)' -or $tokenGroups -notmatch 'S-1-16-(12288|16384)(?!\d)') {
        throw 'AllUsers requires an already-elevated Administrator or LocalSYSTEM token. No elevation or policy change is requested.'
    }
    if (-not $PSCmdlet.ShouldProcess($root, 'Prepare protected machine scratch; install/check pinned core only (zero auth/repository calls)')) {
        throw 'AllUsers machine setup was declined; core completion is not established.'
    }
    Initialize-ProtectedDirectory $root
    Assert-NoReparsePath $reportPath
    $scratch = Join-Path $root ('.bootstrap-' + [guid]::NewGuid().ToString('N'))
    New-Item -ItemType Directory -Path $scratch | Out-Null
    $previousTemp = $env:TEMP
    $previousTmp = $env:TMP
    $rows = @()
    try {
        $env:TEMP = $scratch
        $env:TMP = $scratch
        foreach ($package in $manifest.packages) {
            Write-Step "AllUsers: $($package.id) $($package.version)"
            $paths = @($package.tools | ForEach-Object { Join-Path $programFiles $_.path })
            foreach ($path in $paths) { Assert-NoReparsePath $path }
            $present = @($paths | Where-Object { Test-Path -LiteralPath $_ -PathType Leaf })
            if ($present.Count -and $present.Count -ne $paths.Count) {
                throw "$($package.id) incomplete existing machine installation; preserve it and resolve manually."
            }
            if (-not $present.Count) {
                if (-not $PSCmdlet.ShouldProcess("$($package.id) $($package.url)", 'Download, SHA-256 verify and install native AllUsers payload')) {
                    throw "$($package.id) installation declined; no core PASS."
                }
                $extension = $(if ($package.kind -eq 'inno') { '.exe' } else { '.' + $package.kind })
                $payload = Join-Path $scratch ($package.id + $extension)
                try { Invoke-WebRequest -Uri $package.url -OutFile $payload -UseBasicParsing }
                catch { throw "$($package.id) download failed from $($package.url): $($_.Exception.Message)" }
                try { $actualHash = (Get-FileHash -LiteralPath $payload -Algorithm SHA256).Hash }
                catch { throw "$($package.id) hash verification failed for $($package.url): $($_.Exception.Message)" }
                if ($actualHash -ne $package.sha256) {
                    throw "$($package.id) SHA-256 mismatch for $($package.url): expected $($package.sha256), actual $actualHash. Payload not executed."
                }
                if ($package.kind -eq 'zip') {
                    $destination = Join-Path $programFiles $package.directory
                    Assert-NoReparsePath $destination
                    if (Test-Path -LiteralPath $destination) { throw "$($package.id) existing portable directory is incomplete; refusing to overwrite $destination" }
                    $extracted = Join-Path $scratch ($package.id + '-extract')
                    try { Expand-VerifiedMachineArchive -Archive $payload -Destination $extracted -PackageId $package.id }
                    catch { throw "$($package.id) archive failure for $($package.url): $($_.Exception.Message)" }
                    foreach ($tool in $package.tools) {
                        $relative = $tool.path.Substring($package.directory.Length + 1)
                        Get-MachineToolVersion $package $tool (Join-Path $extracted $relative) $scratch | Out-Null
                    }
                    # Directory.Move refuses an existing target instead of nesting
                    # into a concurrently created/unowned portable directory.
                    try { [IO.Directory]::Move($extracted, $destination) }
                    catch { throw "$($package.id) portable publish failed for $($package.url): $($_.Exception.Message)" }
                }
                elseif ($package.kind -eq 'msi') {
                    $installer = Join-Path $env:SystemRoot 'System32\msiexec.exe'
                    $arguments = @('/i', ('"{0}"' -f $payload), '/qn', '/norestart', 'ALLUSERS=1') + $package.arguments
                    Invoke-MachineProcess -PackageId $package.id -FilePath $installer -Arguments $arguments -Installer
                }
                else {
                    $directory = Join-Path $programFiles $package.directory
                    $arguments = @('/ALLUSERS', '/SP-', '/VERYSILENT', '/SUPPRESSMSGBOXES', '/NORESTART',
                        '/RESTARTEXITCODE=3010', '/NOCLOSEAPPLICATIONS', '/NOFORCECLOSEAPPLICATIONS', '/NORESTARTAPPLICATIONS',
                        ('/DIR="{0}"' -f $directory)) + $package.arguments
                    Invoke-MachineProcess -PackageId $package.id -FilePath $payload -Arguments $arguments -Installer
                }
            }
            foreach ($tool in $package.tools) {
                $path = Join-Path $programFiles $tool.path
                $version = Get-MachineToolVersion $package $tool $path $scratch
                $rows += [pscustomobject]@{ Package = $package.id; Tool = $tool.name; Version = $version; PinnedVersion = $tool.version; Path = $path; Result = 'pass' }
                # Session-only dependency visibility; never persist inherited user/SYSTEM PATH entries.
                $env:Path = (Split-Path -Parent $path) + ';' + $env:Path
            }
        }
        if (-not $PSCmdlet.ShouldProcess($registryPath, 'Append validated core executable directories to persistent MACHINE PATH')) {
            throw 'Machine PATH update declined; no AllUsers core PASS.'
        }
        $machinePath = (Get-ItemProperty -LiteralPath $registryPath -Name Path).Path
        $unique = New-Object 'System.Collections.Generic.HashSet[string]' ([StringComparer]::OrdinalIgnoreCase)
        $entries = foreach ($entry in @($rows | ForEach-Object { Split-Path -Parent $_.Path }) + @($machinePath -split ';')) {
            if (-not [string]::IsNullOrWhiteSpace($entry) -and $unique.Add($entry.TrimEnd('\'))) { $entry }
        }
        $newMachinePath = $entries -join ';'
        if ($newMachinePath -ne $machinePath) { Set-ItemProperty -LiteralPath $registryPath -Name Path -Value $newMachinePath }
        if ((Get-ItemProperty -LiteralPath $registryPath -Name Path).Path -ne $newMachinePath) {
            throw 'Machine PATH read-back failed; no AllUsers core PASS.'
        }
        if (-not $PSCmdlet.ShouldProcess($reportPath, 'Write verified machine core receipt with deferred per-user components')) {
            throw 'Machine receipt declined; setup is incomplete.'
        }
        Initialize-ProtectedDirectory $reportRoot
        $receipt = [ordered]@{
            SchemaVersion = 1; Mode = 'AllUsers'; Core = 'pass'; Architecture = 'x64'
            VerifiedAtUtc = [DateTime]::UtcNow.ToString('o'); RunId = [guid]::NewGuid().ToString('N')
            ScriptSha256 = (Get-FileHash -LiteralPath $PSCommandPath -Algorithm SHA256).Hash
            ManifestSha256 = (Get-FileHash -LiteralPath $manifestPath -Algorithm SHA256).Hash
            Packages = $rows; MachinePath = $newMachinePath
            Authentication = 'skipped; zero auth calls'; Repository = 'skipped; no clone/init/roster'
            DeferredPerUser = @('GitHub Copilot desktop app installation/onboarding', 'VS Code Copilot extensions and sign-in if desired', 'Copilot /user and entitlement', 'GitHub/Azure/ACA sign-in and explicit-target doctor')
            Reboot = 'not requested'; Readiness = 'local core only; not both presenters, live CSE execution, Azure target or rehearsal proof'
        }
        $stagedReport = Join-Path $reportRoot ('.machine-bootstrap-' + [guid]::NewGuid().ToString('N') + '.json')
        try {
            $receipt | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $stagedReport -Encoding UTF8
            Move-Item -LiteralPath $stagedReport -Destination $reportPath -Force
        }
        finally { if (Test-Path -LiteralPath $stagedReport) { Remove-Item -LiteralPath $stagedReport -Force } }
        $rows | Format-Table -AutoSize
        Write-Host "AllUsers core verified locally. Receipt: $reportPath"
        Write-Host 'DEFERRED PER USER: Copilot desktop app/extensions/sign-in, Copilot entitlement/UI, Azure/ACA target access and rehearsal. No WinGet, auth, repository/init, Docker/WSL, policy or reboot action performed.'
        Write-Host 'Both presenters must open fresh sign-in sessions and independently check command paths/versions; existing shells may retain stale PATH.'
    }
    finally {
        $env:TEMP = $previousTemp
        $env:TMP = $previousTmp
        Remove-Item -LiteralPath $scratch -Recurse -Force
    }
}

if ($AllUsers) {
    Invoke-AllUsersBootstrap
    exit 0
}

Write-Step 'Installing prerequisites'
Refresh-SessionPath
if ($InstallDocker -and -not (Get-CommandSource docker)) { Assert-DockerPrerequisites }
Ensure-WingetPackage -CommandName 'pwsh' -PackageId 'Microsoft.PowerShell'
Ensure-WingetPackage -CommandName 'git' -PackageId 'Git.Git'
Ensure-WingetPackage -PackageId 'GitHub.CopilotApp'
Ensure-WingetPackage -CommandName 'code' -PackageId 'Microsoft.VisualStudioCode'
Ensure-WingetPackage -CommandName 'copilot' -PackageId 'GitHub.Copilot'
Ensure-WingetPackage -CommandName 'az' -PackageId 'Microsoft.AzureCLI'
Ensure-WingetPackage -CommandName 'gh' -PackageId 'GitHub.cli'
Ensure-WingetPackage -CommandName 'terraform' -PackageId 'Hashicorp.Terraform'
Ensure-WingetPackage -CommandName 'node' -PackageId 'OpenJS.NodeJS.LTS'
$versions['npm'] = Get-ToolVersion npm
Ensure-WingetPackage -CommandName 'squad' -PackageId 'bradygaster.Squad' -PackageVersion '1.0.1'
Ensure-Aca
if ($InstallDocker) {
    # Override the catalog's --accept-license; GUI license consent stays human.
    Ensure-WingetPackage -CommandName 'docker' -PackageId 'Docker.DockerDesktop' -InstallerOverride 'install --quiet --backend=wsl-2 --no-windows-containers'
}
elseif (Get-CommandSource docker) { $versions['docker'] = Get-ToolVersion docker }

if (-not $WhatIfPreference) {
    foreach ($name in @('pwsh', 'git', 'code', 'copilot', 'az', 'gh', 'terraform', 'node', 'npm', 'squad', 'aca')) {
        if (-not (Get-CommandSource $name)) { throw "Required tool '$name' is missing/declined. Stopping before authentication or repository changes." }
    }
    if ($desktopVersion -like 'missing*') { throw 'Copilot desktop installation was declined. Setup is incomplete.' }
}
Write-Step 'Authentication'
if ($SkipLogin) { Write-Host 'SkipLogin set. Skipping ALL authentication checks and sign-ins.' }
else {
    Invoke-CopilotLogin
    Ensure-Login -Name 'gh' -StatusArguments @('auth', 'status', '--hostname', 'github.com') -LoginArguments @('auth', 'login', '--hostname', 'github.com', '--git-protocol', 'https', '--web')
    Ensure-Login -Name 'az' -StatusArguments @('account', 'show', '--output', 'none') -LoginArguments @('login', '--output', 'none')
    Ensure-Login -Name 'aca' -StatusArguments @('auth', 'status') -LoginArguments @('auth', 'login')
}

if ($SkipRepository) { Write-Host 'SkipRepository set. Skipping clone and Squad init (package-only).' }
else {
    Write-Step 'Preparing repository'
    Ensure-RepositoryClone
    Ensure-SquadInit
}

Show-VersionSummary

Write-Step 'Next steps'
Write-Host 'Open GitHub Copilot from the Start menu and sign in manually; its app policy is separate from CLI policy.'
Write-Host 'For ACA, run aca doctor only with the separately reviewed explicit subscription/resource-group/sandbox-group/region; compare its printed target. Bootstrap does not create or qualify a sandbox.'
Write-Host 'Docker/WSL are optional for local Terraform MCP: prepare WSL 2/nested virtualization separately, review licensing, then use -InstallDocker and start Docker Desktop manually.'
Write-Host 'If started in Windows PowerShell 5.1, open the installed PowerShell 7 profile before running Copilot.'
Write-Host 'Custom Script Extension/LocalSYSTEM uses explicit -AllUsers native machine-payload mode; presenter-context setup is not machine-wide certification.'
Write-Host "Open VS Code manually from the repository root: code ."
Write-Host "Run from the repository root: copilot --agent squad"
Write-Host 'Then describe the project and confirm the proposed roster.'
exit 0
