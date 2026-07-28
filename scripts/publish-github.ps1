$ErrorActionPreference = "Stop"

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  throw "GitHub CLI is required. Install it with: winget install --id GitHub.cli"
}

gh auth status | Out-Null
if ($LASTEXITCODE -ne 0) {
  throw "Authenticate first with: gh auth login"
}

$repo = "ShawnDTB/bee-organization-platform"
$existing = gh repo view $repo 2>$null

if ($LASTEXITCODE -eq 0) {
  throw "The repository $repo already exists. Review it before changing remotes."
}

gh repo create $repo --private --source . --remote origin --push --description "Brand, website, sales, and operations platform for BEE Organization LLC."
Write-Host "Created and pushed https://github.com/$repo"
