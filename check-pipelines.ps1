# Check latest pipeline status
Write-Host "Checking latest pipeline runs..." -ForegroundColor Cyan

$runs = gh run list --limit 5 --json status,conclusion,name,headBranch,createdAt,url
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to fetch pipeline runs" -ForegroundColor Red
    exit 1
}

$runsObj = $runs | ConvertFrom-Json

if ($runsObj.Count -eq 0) {
    Write-Host "No pipeline runs found" -ForegroundColor Yellow
    exit 0
}

Write-Host "`nLatest Pipeline Runs:" -ForegroundColor Green
Write-Host "====================" -ForegroundColor Green

foreach ($run in $runsObj) {
    $statusColor = switch ($run.status) {
        "completed" { if ($run.conclusion -eq "success") { "Green" } else { "Red" } }
        "in_progress" { "Yellow" }
        "queued" { "Cyan" }
        default { "White" }
    }
    
    $conclusion = if ($run.conclusion) { "($($run.conclusion))" } else { "" }
    Write-Host "$($run.name) - $($run.status) $conclusion" -ForegroundColor $statusColor
    Write-Host "  Branch: $($run.headBranch)" -ForegroundColor Gray
    Write-Host "  Created: $($run.createdAt)" -ForegroundColor Gray
    Write-Host "  URL: $($run.url)" -ForegroundColor Gray
    Write-Host ""
}

# Check for failed runs
$failedRuns = $runsObj | Where-Object { $_.status -eq "completed" -and $_.conclusion -ne "success" }
if ($failedRuns.Count -gt 0) {
    Write-Host "`n⚠️  FAILED RUNS DETECTED:" -ForegroundColor Red
    foreach ($run in $failedRuns) {
        Write-Host "  - $($run.name) ($($run.headBranch))" -ForegroundColor Red
        Write-Host "    View logs: $($run.url)" -ForegroundColor Yellow
    }
    exit 1
} else {
    Write-Host "`n✅ All recent runs are successful!" -ForegroundColor Green
    exit 0
}


