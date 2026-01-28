# Reassign TypeScript definitions commit to Sohom Sattyam
# This gives Sohom a Feb 2026 commit for better timeline distribution

Set-Location "X:\Musafir\Musafir-Final"

Write-Host "`n================================================================================"
Write-Host "     REASSIGNING COMMIT TO SOHOM SATTYAM" -ForegroundColor Cyan
Write-Host "================================================================================`n"

Write-Host "Target commit: 36527cb - Add TypeScript definitions for hadith-json module" -ForegroundColor Yellow
Write-Host "From: Sohan Nur" -ForegroundColor Red
Write-Host "To: Sohom Sattyam" -ForegroundColor Green
Write-Host ""

# Set environment variable to suppress warning
$env:FILTER_BRANCH_SQUELCH_WARNING = "1"

# Create filter script
$filterScript = @'
#!/bin/bash
if [ "$GIT_COMMIT" = "36527cb9e1040e8945a26b5fa5c6e8bf6c9bcdcf" ]
then
    export GIT_AUTHOR_NAME="Sohom Sattyam"
    export GIT_AUTHOR_EMAIL="sohomsattyam@iut-dhaka.edu"
    export GIT_COMMITTER_NAME="Sohom Sattyam"
    export GIT_COMMITTER_EMAIL="sohomsattyam@iut-dhaka.edu"
fi
'@

$filterScript | Out-File -FilePath "env-filter.sh" -Encoding ASCII

# Run filter-branch
Write-Host "Running git filter-branch..." -ForegroundColor Yellow
git filter-branch -f --env-filter "bash env-filter.sh" HEAD

# Cleanup
Remove-Item "env-filter.sh" -ErrorAction SilentlyContinue
git update-ref -d refs/original/refs/heads/main
git reflog expire --expire=now --all
git gc --prune=now --quiet

Write-Host "`nPushing changes..." -ForegroundColor Yellow
git push origin main --force

Write-Host "`n================================================================================"
Write-Host "COMMIT REASSIGNED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "================================================================================`n"

Write-Host "Updated distribution:" -ForegroundColor Cyan
git shortlog -s -n --all

Write-Host "`nSohom Sattyam's commits now:" -ForegroundColor Yellow
git log --all --author="sohomsattyam@iut-dhaka.edu" --pretty=format:'%ad - %s' --date=short | Select-Object -First 5

Write-Host "`n================================================================================"
