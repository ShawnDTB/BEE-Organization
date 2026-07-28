#!/usr/bin/env bash
set -euo pipefail

command -v gh >/dev/null 2>&1 || { echo "GitHub CLI is required: https://cli.github.com/" >&2; exit 1; }
gh auth status >/dev/null
repo="ShawnDTB/bee-organization-platform"
if gh repo view "$repo" >/dev/null 2>&1; then
  echo "Repository $repo already exists. Review it before changing remotes." >&2
  exit 1
fi
gh repo create "$repo" --private --source . --remote origin --push --description "Brand, website, sales, and operations platform for BEE Organization LLC."
echo "Created and pushed https://github.com/$repo"
