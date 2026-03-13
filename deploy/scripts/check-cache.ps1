# Check if cache is valid
# Returns: "yes" if cache exists and is valid, "no" otherwise

param(
    [string]$Path
)

$nodeModulesPath = Join-Path $Path "node_modules"
$hashPath = Join-Path $Path ".moduleshash"

if (-not (Test-Path $nodeModulesPath)) {
    Write-Output "no"
    exit 0
}

if (-not (Test-Path $hashPath)) {
    Write-Output "no"
    exit 0
}

Write-Output "yes"
