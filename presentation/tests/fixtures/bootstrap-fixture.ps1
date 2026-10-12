param([string]$Script, [string]$RepoPath, [string[]]$Flags)
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $env:MOCK_NATIVE_PREFERENCE -eq 'true'
Set-Variable -Name HOME -Value (Join-Path $PWD 'fixture-home') -Force
$env:ProgramFiles = $env:MOCK_PROGRAM_FILES
$env:ProgramData = $env:MOCK_PROGRAM_DATA
function Assert-FixtureWrite {
    param([string]$Path)
    $full = [IO.Path]::GetFullPath($Path)
    if (-not $full.StartsWith(([string]$PWD + '\'), [StringComparison]::OrdinalIgnoreCase)) {
        throw "Unmocked filesystem write blocked: $full"
    }
}
function global:New-Item {
    param([string]$Path, [string]$ItemType, [switch]$Force)
    Assert-FixtureWrite $Path
    Microsoft.PowerShell.Management\New-Item -Path $Path -ItemType $ItemType -Force:$Force
}
function global:Move-Item {
    param([string]$LiteralPath, [string]$Destination, [switch]$Force)
    Assert-FixtureWrite $LiteralPath
    Assert-FixtureWrite $Destination
    Microsoft.PowerShell.Management\Move-Item -LiteralPath $LiteralPath -Destination $Destination -Force:$Force
}
function global:Remove-Item {
    param([string]$LiteralPath, [string]$Path, [switch]$Force, [switch]$Recurse)
    $target = $(if ($LiteralPath) { $LiteralPath } else { $Path })
    Assert-FixtureWrite $target
    Microsoft.PowerShell.Management\Remove-Item -LiteralPath $target -Force:$Force -Recurse:$Recurse
}
function global:Set-Content {
    param([string]$LiteralPath, [string]$Path, [Parameter(ValueFromPipeline)]$Value, [string]$Encoding = 'UTF8')
    process {
        $target = $(if ($LiteralPath) { $LiteralPath } else { $Path })
        Assert-FixtureWrite $target
        Microsoft.PowerShell.Management\Set-Content -LiteralPath $target -Value $Value -Encoding $Encoding
    }
}
function global:Add-Content {
    param([string]$LiteralPath, [string]$Path, [Parameter(ValueFromPipeline)]$Value)
    process {
        $target = $(if ($LiteralPath) { $LiteralPath } else { $Path })
        Assert-FixtureWrite $target
        Microsoft.PowerShell.Management\Add-Content -LiteralPath $target -Value $Value -Encoding UTF8
    }
}
$mock = Join-Path $PSScriptRoot 'bootstrap-native-mock.mjs'
$manifestPath = Join-Path (Split-Path $Script -Parent) 'bootstrap-demo-vm.packages.json'
if (-not (Test-Path $manifestPath)) {
    $manifestPath = Join-Path $PSScriptRoot '..\..\..\scripts\bootstrap-demo-vm.packages.json'
}
$machineManifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
$tools = @('winget', 'git', 'node', 'npm', 'copilot', 'squad', 'code',
    'az', 'gh', 'terraform', 'pwsh', 'aca', 'docker', 'wsl', 'whoami')
foreach ($tool in $tools) {
    $body = "& '$($env:MOCK_NODE.Replace("'", "''"))' '$($mock.Replace("'", "''"))' '$tool' @args"
    Set-Item -Path "Function:\global:$tool" -Value ([scriptblock]::Create($body))
}
function global:Get-Command {
    param([string]$Name, [string]$ErrorAction)
    $name = (Split-Path $Name -Leaf) -replace '\.(cmd|exe)$', ''
    $state = Get-Content -LiteralPath $env:MOCK_STATE -Raw | ConvertFrom-Json
    if ($name -notin $tools) { throw "Unmocked tool discovery: $Name" }
    if ($name -notin $state.missing) { [pscustomobject]@{ Source = $name } }
}
function global:Invoke-WebRequest {
    param([string]$Uri, [switch]$UseBasicParsing, [string]$OutFile)
    Add-Content -LiteralPath $env:MOCK_LOG -Value (@{ tool = 'download'; args = @($Uri); file = $OutFile } | ConvertTo-Json -Compress)
    $state = Get-Content -LiteralPath $env:MOCK_STATE -Raw | ConvertFrom-Json
    if ($OutFile) {
        $package = $machineManifest.packages | Where-Object { $_.url -eq $Uri } | Select-Object -First 1
        if (-not $package -or -not $OutFile.StartsWith($env:ProgramFiles, [StringComparison]::OrdinalIgnoreCase)) {
            throw "Unmocked machine payload URL/path: $Uri"
        }
        if ($state.machineDownloadFailure -eq $package.id) { throw 'safe machine download failed' }
        if ($package.kind -ne 'zip') { Set-Content -LiteralPath $OutFile -Value 'harmless mocked installer'; return }
        Add-Type -AssemblyName System.IO.Compression, System.IO.Compression.FileSystem
        $zip = [IO.Compression.ZipFile]::Open($OutFile, [IO.Compression.ZipArchiveMode]::Create)
        try {
            $names = @($package.tools | ForEach-Object { $_.path.Substring($package.directory.Length + 1).Replace('\', '/') })
            if ($state.zipAttack -and $package.id -eq 'GitHub.Copilot') { $names = @($state.zipAttack) }
            foreach ($name in $names) {
                $entry = $zip.CreateEntry($name)
                if ($state.zipSymlink -and $package.id -eq 'GitHub.Copilot') { $entry.ExternalAttributes = -1577058304 }
                $writer = New-Object IO.StreamWriter($entry.Open())
                try { $writer.Write('harmless mocked executable') } finally { $writer.Dispose() }
            }
        }
        finally { $zip.Dispose() }
        return
    }
    if ($Uri -ne 'https://aka.ms/aca-cli-install-ps') { throw "Unmocked URL: $Uri" }
    if ($state.downloadFailure) { throw 'safe download failed' }
    if ($state.emptyInstaller) { return @{ Content = '' } }
    if ($state.installerThrow) { return @{ Content = "throw 'safe installer terminating failure'" } }
    $content = "param([string]`$InstallDir); & '$($env:MOCK_NODE.Replace("'", "''"))' '$($mock.Replace("'", "''"))' 'aca-installer' 'install'"
    [pscustomobject]@{ Content = $content }
}
function global:Get-FileHash {
    param([string]$LiteralPath, [string]$Path, [string]$Algorithm)
    $file = $(if ($LiteralPath) { $LiteralPath } else { $Path })
    $package = $machineManifest.packages | Where-Object {
        (Split-Path $file -Leaf) -eq ($_.id + $(if ($_.kind -eq 'inno') { '.exe' } else { '.' + $_.kind }))
    } | Select-Object -First 1
    if ($package) {
        Add-Content -LiteralPath $env:MOCK_LOG -Value (@{ tool = 'machine-hash'; args = @($package.id); file = $file } | ConvertTo-Json -Compress)
        $state = Get-Content -LiteralPath $env:MOCK_STATE -Raw | ConvertFrom-Json
        return [pscustomobject]@{ Hash = $(if ($state.machineHashMismatch -eq $package.id) { '0' * 64 } else { $package.sha256 }) }
    }
    if ($file -notin @($Script, $manifestPath)) { throw "Unmocked file hash: $file" }
    $sha = [Security.Cryptography.SHA256]::Create()
    $stream = [IO.File]::OpenRead($file)
    try { [pscustomobject]@{ Hash = ([BitConverter]::ToString($sha.ComputeHash($stream))).Replace('-', '') } }
    finally { $stream.Dispose(); $sha.Dispose() }
}
function global:Start-Process {
    param([string]$FilePath, [string[]]$ArgumentList, [switch]$Wait, [switch]$PassThru,
        [switch]$NoNewWindow, [string]$RedirectStandardOutput, [string]$RedirectStandardError)
    $state = Get-Content -LiteralPath $env:MOCK_STATE -Raw | ConvertFrom-Json
    if ($RedirectStandardOutput) {
        $executable = $FilePath
        if ((Split-Path $FilePath -Leaf) -eq 'cmd.exe') {
            if ($ArgumentList[0] -ne '/d' -or $ArgumentList[1] -ne '/s' -or $ArgumentList[2] -ne '/c') {
                throw 'Unmocked shell invocation'
            }
            $executable = [regex]::Match($ArgumentList[-1], '^""([^"]+)"').Groups[1].Value
        }
        if (-not $executable.StartsWith($env:ProgramFiles, [StringComparison]::OrdinalIgnoreCase)) {
            throw "Unmocked machine version path: $executable"
        }
        $name = (Split-Path $executable -Leaf) -replace '\.(exe|cmd)$', ''
        $package = $machineManifest.packages | Where-Object { $_.tools.name -contains $name } | Select-Object -First 1
        if (-not $package) { throw "Unmocked version command: $name" }
        $tool = $package.tools | Where-Object { $_.name -eq $name } | Select-Object -First 1
        Add-Content -LiteralPath $env:MOCK_LOG -Value (@{ tool = 'machine-version'; args = @($name); file = $executable; nativeFile = $FilePath; nativeArgs = $ArgumentList } | ConvertTo-Json -Compress)
        $version = $(if ($state.machineBadVersion -eq $name) { '0.0.0' } else { $tool.version })
        $output = $(if ($name -eq 'az') { @{ 'azure-cli' = $version } | ConvertTo-Json } else { $version })
        Set-Content -LiteralPath $RedirectStandardOutput -Value $output
        Set-Content -LiteralPath $RedirectStandardError -Value ''
        return [pscustomobject]@{ ExitCode = $(if ($state.machineVersionFailure -eq $name) { 42 } else { 0 }) }
    }
    $payload = $(if ((Split-Path $FilePath -Leaf) -eq 'msiexec.exe') { $ArgumentList[1].Trim('"') } else { $FilePath })
    $package = $machineManifest.packages | Where-Object {
        (Split-Path $payload -Leaf) -eq ($_.id + $(if ($_.kind -eq 'inno') { '.exe' } else { '.' + $_.kind }))
    } | Select-Object -First 1
    if (-not $package -or -not $payload.StartsWith($env:ProgramFiles, [StringComparison]::OrdinalIgnoreCase)) {
        throw "Unmocked machine installer: $FilePath"
    }
    Add-Content -LiteralPath $env:MOCK_LOG -Value (@{ tool = 'machine-install'; args = @($package.id); file = $FilePath; nativeArgs = $ArgumentList } | ConvertTo-Json -Compress)
    if ($state.machineInstallerPackage -eq $package.id -and $state.machineInstallerExit -ne 0) {
        return [pscustomobject]@{ ExitCode = $state.machineInstallerExit }
    }
    if (-not $state.machineInstallNoop) {
        foreach ($tool in $package.tools) {
            $path = Join-Path $env:ProgramFiles $tool.path
            New-Item -ItemType Directory -Path (Split-Path $path -Parent) -Force | Out-Null
            Set-Content -LiteralPath $path -Value 'harmless mocked executable'
        }
    }
    [pscustomobject]@{ ExitCode = 0 }
}
function global:Get-ItemProperty {
    param([string]$LiteralPath, [string]$Name)
    if ($LiteralPath -ne 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Environment' -or $Name -ne 'Path') {
        throw 'Unmocked registry read'
    }
    $state = Get-Content -LiteralPath $env:MOCK_STATE -Raw | ConvertFrom-Json
    [pscustomobject]@{ Path = $state.machinePath }
}
function global:Set-ItemProperty {
    param([string]$LiteralPath, [string]$Name, [string]$Value)
    if ($LiteralPath -ne 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Environment' -or $Name -ne 'Path') {
        throw 'Unmocked registry write'
    }
    Add-Content -LiteralPath $env:MOCK_LOG -Value (@{ tool = 'machine-path'; args = @($Value) } | ConvertTo-Json -Compress)
    $state = Get-Content -LiteralPath $env:MOCK_STATE -Raw | ConvertFrom-Json
    if (-not $state.machinePathNoop) {
        $state.machinePath = $Value
        $state | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $env:MOCK_STATE -Encoding UTF8
    }
}
function global:Set-Acl {
    param([string]$LiteralPath, [object]$AclObject)
    if (-not $LiteralPath.StartsWith($env:ProgramFiles) -and -not $LiteralPath.StartsWith($env:ProgramData)) {
        throw 'Unmocked host ACL write'
    }
    Add-Content -LiteralPath $env:MOCK_LOG -Value (@{ tool = 'machine-acl'; args = @($LiteralPath) } | ConvertTo-Json -Compress)
}
function global:Get-Acl {
    param([string]$LiteralPath)
    if (-not $LiteralPath.StartsWith($env:ProgramFiles) -and -not $LiteralPath.StartsWith($env:ProgramData)) {
        throw 'Unmocked host ACL read'
    }
    $state = Get-Content -LiteralPath $env:MOCK_STATE -Raw | ConvertFrom-Json
    $acl = New-Object Security.AccessControl.DirectorySecurity
    $sid = New-Object Security.Principal.SecurityIdentifier $(if ($state.machineUnsafeAcl) { 'S-1-1-0' } else { 'S-1-5-18' })
    $rule = New-Object Security.AccessControl.FileSystemAccessRule($sid, 'FullControl', 'ContainerInherit, ObjectInherit', 'None', 'Allow')
    $acl.AddAccessRule($rule)
    return $acl
}
function global:Get-CimInstance {
    param([string]$ClassName, [string]$Filter)
    if ($ClassName -ne 'Win32_OptionalFeature' -or $Filter -notmatch 'VirtualMachinePlatform') {
        throw 'Unmocked host inventory'
    }
    $state = Get-Content -LiteralPath $env:MOCK_STATE -Raw | ConvertFrom-Json
    foreach ($name in @('Microsoft-Windows-Subsystem-Linux', 'VirtualMachinePlatform')) {
        [pscustomobject]@{ Name = $name; InstallState = $(if ($state.wslFeatures) { 1 } else { 2 }) }
    }
}
# Any future dangerous call not belonging to the mocked native surface fails closed.
foreach ($name in @('Restart-Computer', 'Enable-WindowsOptionalFeature',
    'Set-ExecutionPolicy', 'Invoke-RestMethod')) {
    Set-Item -Path "Function:\global:$name" -Value { throw 'Unmocked side effect attempted' }
}
$env:Path = "$env:MOCK_SESSION_PATH;$env:Path"
$beforePath = $env:Path
$beforeTemp = $env:TEMP
$beforeTmp = $env:TMP
$options = @{}
foreach ($flag in ($Flags -split ',')) {
    if ([string]::IsNullOrWhiteSpace($flag)) { continue }
    $name, $value = $flag -split '=', 2
    $options[$name] = $(if ($value) { $value } else { $true })
}
try {
    & $Script -RepoPath $RepoPath @options
    $scriptExit = $LASTEXITCODE
}
catch { Write-Host "Fixture failure: $($_.Exception.Message)"; throw }
finally {
    if ($options.ContainsKey('WhatIf') -and $env:Path -ne $beforePath) { throw 'WhatIf modified session PATH' }
    if ($env:TEMP -ne $beforeTemp -or $env:TMP -ne $beforeTmp) { throw 'ACA scratch environment was not restored' }
}
if ($scriptExit) { exit $scriptExit }
