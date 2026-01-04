#!/usr/bin/env python3
"""
Distribute social preview to ALL repos from CSV
"""

import csv
import shutil
from pathlib import Path

# Configuration
SOURCE = Path("/Users/josh/Projects/_nothingdao/earth/.github/social-preview.png")
PROJECTS_DIR = Path("/Users/josh/Projects")
CSV_PATH = Path(__file__).parent.parent / "public/data/projects.csv"

# Org to directory mapping
ORG_DIRS = {
    "whaleen": "_whaleen",
    "nothingdao": "_nothingdao",
    "orthfx": "_orthfx",
    "boringprotocol": "_boringprotocol",
}

def load_repos_from_csv():
    """Load all repos from CSV file"""
    repos = []
    with open(CSV_PATH, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            repo_name = row.get('Repo', '').strip()
            github_org = row.get('GitHub Org', '').strip()

            if repo_name and github_org:
                repos.append((github_org, repo_name))

    return repos

def main():
    if not SOURCE.exists():
        print(f"❌ Source image not found: {SOURCE}")
        return

    if not CSV_PATH.exists():
        print(f"❌ CSV not found: {CSV_PATH}")
        return

    copied = 0
    skipped = 0
    not_found = 0
    errors = 0

    print("📋 Distributing social preview images to ALL repos in CSV...\n")

    repos = load_repos_from_csv()
    print(f"Found {len(repos)} repos in CSV\n")

    for github_org, repo_name in repos:
        # Map org to directory
        org_dir = ORG_DIRS.get(github_org.lower())
        if not org_dir:
            # Try the org name as-is if not in mapping
            org_dir = f"_{github_org.lower()}"

        repo_path = PROJECTS_DIR / org_dir / repo_name

        # Skip if directory doesn't exist
        if not repo_path.exists():
            not_found += 1
            continue

        github_dir = repo_path / ".github"
        dest_file = github_dir / "social-preview.png"

        # Skip if already exists
        if dest_file.exists():
            print(f"⏭️  {github_org}/{repo_name} - already exists")
            skipped += 1
            continue

        try:
            # Create .github directory if needed
            github_dir.mkdir(exist_ok=True)

            # Copy file
            shutil.copy2(SOURCE, dest_file)
            print(f"✅ {github_org}/{repo_name} - Copied to .github/social-preview.png")
            copied += 1
        except Exception as e:
            print(f"❌ {github_org}/{repo_name} - Error: {e}")
            errors += 1

    # Summary
    print("\n" + "=" * 50)
    print("📊 Summary")
    print("=" * 50)
    print(f"📋 Total repos in CSV: {len(repos)}")
    print(f"✅ Copied: {copied}")
    print(f"⏭️  Skipped (already exists): {skipped}")
    print(f"📂 Not found locally: {not_found}")
    print(f"❌ Errors: {errors}")

    if copied > 0:
        print("\n✨ Next Steps:")
        print("1. Run: npm run social:scan")
        print("2. Commit changes to each repo")

if __name__ == "__main__":
    main()
