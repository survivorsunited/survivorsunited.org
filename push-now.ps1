# Simple push script
git add -A
$date = Get-Date -Format "yyyyMMdd"
git commit -m "#$date fix: pipeline updates" 2>&1 | Out-String
git push 2>&1 | Out-String
Write-Host "Done. Check: gh run list --limit 3"




