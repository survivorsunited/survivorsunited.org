#!/usr/bin/env pwsh
# Test script for modpack synchronization

Write-Host "🧪 Testing Modpack Sync Script" -ForegroundColor Cyan
Write-Host ""

# Check if dependencies are installed
Write-Host "📦 Checking dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules\adm-zip")) {
    Write-Host "⚠️  adm-zip not found. Installing dependencies..." -ForegroundColor Yellow
    npm install --silent
}

Write-Host "✅ Dependencies ready" -ForegroundColor Green
Write-Host ""

# Run the sync script with output
Write-Host "🚀 Running modpack sync..." -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

$env:GIT_PAGER = "cat"
npm run modpack:sync

$exitCode = $LASTEXITCODE

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

if ($exitCode -eq 0) {
    Write-Host "✅ Sync completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📄 Check the following files for updates:" -ForegroundColor Cyan
    Write-Host "   - docs/minecraft/supported-mods.md" -ForegroundColor White
    Write-Host "   - docs/minecraft/mods/installation.md" -ForegroundColor White
    Write-Host "   - .env" -ForegroundColor White
} else {
    Write-Host "❌ Sync failed with exit code: $exitCode" -ForegroundColor Red
}

Write-Host ""

