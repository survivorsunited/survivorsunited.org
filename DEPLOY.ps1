# Quick deploy script - commit, push, and check status
param(
    [string]$Message = "fix: pipeline updates"
)

Write-Host "🚀 Deploying..." -ForegroundColor Cyan

# Stage all changes
git add -A

# Commit
$commitMsg = "#$(Get-Date -Format 'yyyyMMdd') $Message"
git commit -m $commitMsg

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Committed" -ForegroundColor Green
} else {
    Write-Host "⚠️  No changes to commit" -ForegroundColor Yellow
    exit 0
}

# Push
git push

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Pushed successfully" -ForegroundColor Green
    Write-Host "`n📊 Check pipeline status:" -ForegroundColor Cyan
    Write-Host "   gh run list --limit 5" -ForegroundColor Gray
} else {
    Write-Host "❌ Push failed" -ForegroundColor Red
    exit 1
}


