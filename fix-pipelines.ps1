# Fix and deploy - commit, push, and monitor pipelines
param(
    [string]$Message = "fix: pipeline updates"
)

Write-Host "🔧 Fixing and deploying..." -ForegroundColor Cyan

# Check git status
Write-Host "`n📋 Checking git status..." -ForegroundColor Cyan
git status --short

# Add all changes
Write-Host "`n➕ Staging all changes..." -ForegroundColor Cyan
git add -A

# Commit
Write-Host "`n💾 Committing changes..." -ForegroundColor Cyan
git commit -m "#$(Get-Date -Format 'yyyyMMdd') $Message"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Commit failed (maybe no changes?)" -ForegroundColor Yellow
} else {
    Write-Host "✅ Committed successfully" -ForegroundColor Green
}

# Push
Write-Host "`n🚀 Pushing to remote..." -ForegroundColor Cyan
git push

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Push failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Pushed successfully" -ForegroundColor Green

# Wait a moment for GitHub to register the push
Write-Host "`n⏳ Waiting for GitHub to register push..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

# Check pipeline status
Write-Host "`n📊 Checking pipeline status..." -ForegroundColor Cyan
& "$PSScriptRoot\check-pipelines.ps1"




