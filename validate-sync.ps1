#!/usr/bin/env pwsh
# Validate that the modpack sync script compiles correctly

Write-Host "🔍 Validating modpack sync script..." -ForegroundColor Cyan
Write-Host ""

# Check TypeScript compilation
Write-Host "📝 Checking TypeScript compilation..." -ForegroundColor Yellow
npm run typecheck

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ TypeScript compilation successful!" -ForegroundColor Green
} else {
    Write-Host "❌ TypeScript compilation failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Checking dependencies..." -ForegroundColor Yellow

if (-not (Test-Path "node_modules\adm-zip")) {
    Write-Host "⚠️  adm-zip not found. Installing..." -ForegroundColor Yellow
    npm install adm-zip --save-dev
}

if (Test-Path "node_modules\adm-zip") {
    Write-Host "✅ adm-zip is installed" -ForegroundColor Green
} else {
    Write-Host "❌ adm-zip installation failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Validation complete! Script is ready to run." -ForegroundColor Green
Write-Host ""
Write-Host "To test the sync, run:" -ForegroundColor Cyan
Write-Host "  .\test-sync.ps1" -ForegroundColor White
Write-Host ""

