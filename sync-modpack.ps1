#!/usr/bin/env pwsh
# Script to synchronize modpack release information

Write-Host "🔄 Starting modpack synchronization..." -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host ""
}

# Check for adm-zip specifically
if (-not (Test-Path "node_modules\adm-zip")) {
    Write-Host "📦 Installing missing dependency: adm-zip..." -ForegroundColor Yellow
    npm install adm-zip --save-dev
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install adm-zip" -ForegroundColor Red
        exit 1
    }
    Write-Host ""
}

# Run the sync script
Write-Host "🚀 Running modpack sync..." -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

npm run modpack:sync

$exitCode = $LASTEXITCODE

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

if ($exitCode -eq 0) {
    Write-Host "✅ Modpack synchronization completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📄 Updated files:" -ForegroundColor Cyan
    Write-Host "   - docs/minecraft/supported-mods/index.md" -ForegroundColor White
    Write-Host "   - docs/minecraft/mods/installation.md" -ForegroundColor White
    Write-Host "   - .env" -ForegroundColor White
    Write-Host "   - README.md" -ForegroundColor White
} else {
    Write-Host "❌ Modpack synchronization failed" -ForegroundColor Red
    exit 1
}

