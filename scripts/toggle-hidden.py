#!/usr/bin/env python3
"""
Toggle Hidden status for a project in CSV

This script:
1. Reads projects.csv
2. Finds the specified repo
3. Toggles or sets the Hidden field
4. Updates CSV
"""

import csv
import argparse
from pathlib import Path

# Configuration
CSV_PATH = Path(__file__).parent.parent / "public/data/projects.csv"
BACKUP_PATH = CSV_PATH.with_suffix('.csv.backup')

def toggle_hidden(repo_filter, hidden_value):
    """Toggle or set hidden status for a repo"""
    print(f"🔄 Toggling hidden status for {repo_filter}...")

    # Create backup
    if CSV_PATH.exists():
        import shutil
        shutil.copy2(CSV_PATH, BACKUP_PATH)
        print(f"💾 Backup created: {BACKUP_PATH.name}")

    # Read existing CSV
    with open(CSV_PATH, 'r') as f:
        reader = csv.DictReader(f)
        fieldnames = [f for f in reader.fieldnames if f and f.strip()]
        rows = list(reader)

    # Add Hidden field if it doesn't exist
    if 'Hidden' not in fieldnames:
        fieldnames.append('Hidden')
        print("✨ Added 'Hidden' field to CSV")

    # Find and update the repo
    found = False
    for row in rows:
        repo_name = row.get('Repo', '').strip()
        github_org = row.get('GitHub Org', '').strip()

        if not repo_name or not github_org:
            continue

        # Match by repo name or org/repo
        repo_match = repo_name.lower() == repo_filter.lower()
        org_repo_match = f"{github_org}/{repo_name}".lower() == repo_filter.lower()

        if repo_match or org_repo_match:
            # Ensure all fieldnames exist in row
            for key in fieldnames:
                if key and key.strip() and key not in row:
                    row[key] = ""

            # Set hidden value
            row['Hidden'] = hidden_value
            found = True
            print(f"✅ Updated {github_org}/{repo_name}")
            print(f"   Hidden: {hidden_value}")
            break

    if not found:
        print(f"❌ Repo not found: {repo_filter}")
        return False

    # Ensure all rows have all fieldnames
    for row in rows:
        for key in fieldnames:
            if key and key.strip() and key not in row:
                row[key] = ""

    # Write updated CSV
    print("💾 Writing updated CSV...")
    with open(CSV_PATH, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"✅ CSV updated: {CSV_PATH}")
    return True

def main():
    parser = argparse.ArgumentParser(
        description="Toggle Hidden status for a project",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Hide a project
  python3 scripts/toggle-hidden.py --repo video-tiling --hidden yes

  # Show a project
  python3 scripts/toggle-hidden.py --repo whaleen/video-tiling --hidden no
        """
    )
    parser.add_argument(
        '--repo',
        type=str,
        required=True,
        help='Repo to update. Can be repo name or org/repo'
    )
    parser.add_argument(
        '--hidden',
        type=str,
        required=True,
        choices=['yes', 'no'],
        help='Set hidden status: yes or no'
    )

    args = parser.parse_args()

    print("👁️  Project Hidden Toggle\n")

    success = toggle_hidden(args.repo, args.hidden)

    if not success:
        exit(1)

if __name__ == "__main__":
    main()
