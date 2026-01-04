#!/usr/bin/env python3
"""
Clean the CSV:
1. Remove all forked repos
2. Remove empty/None columns
3. Fix any data issues
"""

import csv
from pathlib import Path

CSV_PATH = Path(__file__).parent.parent / "src/data/projects.csv"
BACKUP_PATH = CSV_PATH.with_suffix('.csv.backup')

def main():
    print("🧹 Cleaning CSV...\n")

    # Backup first
    if CSV_PATH.exists():
        import shutil
        shutil.copy2(CSV_PATH, BACKUP_PATH)
        print(f"💾 Backup created: {BACKUP_PATH.name}")

    # Read CSV
    with open(CSV_PATH, 'r') as f:
        reader = csv.DictReader(f)
        # Filter out None/empty fieldnames
        fieldnames = [f for f in reader.fieldnames if f and f.strip()]
        rows = list(reader)

    print(f"📋 Original: {len(rows)} repos")
    print(f"📊 Columns: {len(fieldnames)}")

    # Remove forks
    non_forks = []
    forks_removed = []

    for row in rows:
        # Check if it's a fork
        is_fork = row.get('Is Fork', '').lower() == 'yes'

        if not is_fork:
            # Clean the row - remove None keys
            cleaned_row = {k: v for k, v in row.items() if k and k.strip()}
            non_forks.append(cleaned_row)
        else:
            forks_removed.append(f"{row.get('GitHub Org', '?')}/{row.get('Repo', '?')}")

    print(f"\n🍴 Removed {len(forks_removed)} forks:")
    for fork in forks_removed[:10]:  # Show first 10
        print(f"  - {fork}")
    if len(forks_removed) > 10:
        print(f"  ... and {len(forks_removed) - 10} more")

    # Write cleaned CSV
    with open(CSV_PATH, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(non_forks)

    print(f"\n✅ Cleaned CSV written")
    print(f"📊 Final: {len(non_forks)} repos")
    print(f"📋 Columns: {len(fieldnames)}")

if __name__ == "__main__":
    main()
