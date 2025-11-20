#!/usr/bin/env pwsh
# Start script for local Docusaurus development server

Write-Host "🚀 Starting Survivors United Documentation Site..." -ForegroundColor Cyan

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  Warning: .env file not found. Some environment variables may not be set." -ForegroundColor Yellow
}

# Start the development server
Write-Host "🌐 Starting Docusaurus development server..." -ForegroundColor Green
Write-Host "   Site will be available at: http://localhost:3000" -ForegroundColor Gray
Write-Host "   Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

npm start

