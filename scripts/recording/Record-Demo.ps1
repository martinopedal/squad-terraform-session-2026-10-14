[CmdletBinding()]
param(
    [Parameter(Mandatory)]
    [ValidateSet('Preflight', 'Record', 'ApproveFrame', 'Mark', 'Stop', 'Verify', 'Export')]
    [string] $Action,
    [Parameter(Mandatory)][string] $OutputRoot,
    [string] $TakeId,
    [ValidateSet('ReviewedCli')][string] $Consent,
    [string] $WindowTitle,
    [int] $WindowPid,
    [ValidateRange(1, 7200)][int] $MaxSeconds = 90,
    [string] $Chapter = 'Slate',
    [string] $Label,
    [string] $ExportName,
    [double] $StartSeconds = 0,
    [double] $DurationSeconds = 0
)

$ErrorActionPreference = 'Stop'
$pythonArgs = @(
    (Join-Path $PSScriptRoot 'record_demo.py'),
    $Action.ToLowerInvariant(), '--output-root', $OutputRoot
)
foreach ($item in @(
    @('take-id', $TakeId), @('consent', $Consent),
    @('window-title', $WindowTitle),
    @('label', $Label), @('export-name', $ExportName)
)) {
    if ($item[1]) { $pythonArgs += @("--$($item[0])", [string]$item[1]) }
}
$pythonArgs += @('--chapter', $Chapter)
$pythonArgs += @('--max-seconds', [string]$MaxSeconds)
if ($WindowPid) { $pythonArgs += @('--window-pid', [string]$WindowPid) }
$pythonArgs += @('--start-seconds', $StartSeconds.ToString([cultureinfo]::InvariantCulture))
$pythonArgs += @('--duration-seconds', $DurationSeconds.ToString([cultureinfo]::InvariantCulture))
& python @pythonArgs
if ($LASTEXITCODE -ne 0) { throw "Recorder failed with exit code $LASTEXITCODE." }
