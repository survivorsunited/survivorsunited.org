#!/usr/bin/env pwsh
# Test parsing the sample README locally

Write-Host "🧪 Testing README parsing with sample file..." -ForegroundColor Cyan
Write-Host ""

$sampleReadme = "docs\README-1.21.8.md"

if (-not (Test-Path $sampleReadme)) {
    Write-Host "❌ Sample README not found: $sampleReadme" -ForegroundColor Red
    exit 1
}

Write-Host "📄 Reading sample README: $sampleReadme" -ForegroundColor Yellow
$content = Get-Content $sampleReadme -Raw

# Simple test: count lines with "|" that contain "Mandatory"
$lines = $content -split "`r?`n"
$inTable = $false
$headerFound = $false
$modCount = 0
$categories = @{}

foreach ($line in $lines) {
    if ($line -match "## Mods Table") {
        $inTable = $true
        Write-Host "✅ Found 'Mods Table' section" -ForegroundColor Green
        continue
    }
    
    if ($inTable -and $line -match "^\|") {
        if ($line -match "---") {
            $headerFound = $true
            continue
        }
        
        if ($headerFound -and $line -match "Mandatory") {
            $modCount++
            # Extract category (5th column)
            $parts = $line -split "\|" | ForEach-Object { $_.Trim() }
            if ($parts.Length -ge 6) {
                $category = $parts[5]
                if ($categories.ContainsKey($category)) {
                    $categories[$category]++
                } else {
                    $categories[$category] = 1
                }
            }
        }
        
        if ($line -match "^## " -and $line -notmatch "Mods Table") {
            break
        }
    }
}

Write-Host ""
Write-Host "📊 Results:" -ForegroundColor Cyan
Write-Host "   Found $modCount mandatory mods" -ForegroundColor White
Write-Host ""
Write-Host "📦 Categories:" -ForegroundColor Cyan
foreach ($cat in $categories.GetEnumerator() | Sort-Object Value -Descending) {
    Write-Host "   $($cat.Key): $($cat.Value)" -ForegroundColor White
}

Write-Host ""
Write-Host "✅ Parsing test complete!" -ForegroundColor Green

