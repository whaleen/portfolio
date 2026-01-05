#!/usr/bin/env python3
"""
Rename "Resume Worthy" column to "Pinned" in projects.csv
"""

import csv
import os

# Get the project root directory (parent of scripts/)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)

# Paths
CSV_PATH = os.path.join(PROJECT_ROOT, "public", "data", "projects.csv")

def rename_column():
    """Rename Resume Worthy column to Pinned"""
    print("🔄 Renaming 'Resume Worthy' to 'Pinned'...")

    if not os.path.exists(CSV_PATH):
        print(f"❌ CSV file not found: {CSV_PATH}")
        return False

    # Read all projects
    with open(CSV_PATH, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        projects = list(reader)

    # Check if Resume Worthy column exists
    if "Resume Worthy" not in fieldnames:
        print("❌ 'Resume Worthy' column not found")
        return False

    # Check if Pinned already exists
    if "Pinned" in fieldnames:
        print("✅ 'Pinned' column already exists")
        return True

    # Create new fieldnames with Pinned instead of Resume Worthy
    new_fieldnames = []
    for field in fieldnames:
        if field == "Resume Worthy":
            new_fieldnames.append("Pinned")
        else:
            new_fieldnames.append(field)

    # Update each project row
    new_projects = []
    for project in projects:
        new_project = {}
        for field in fieldnames:
            if field == "Resume Worthy":
                new_project["Pinned"] = project.get("Resume Worthy", "")
            else:
                new_project[field] = project.get(field, "")
        new_projects.append(new_project)

    # Create backup
    backup_path = f"{CSV_PATH}.backup"
    os.rename(CSV_PATH, backup_path)
    print(f"💾 Backup created: {backup_path}")

    # Write updated CSV
    with open(CSV_PATH, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=new_fieldnames)
        writer.writeheader()
        writer.writerows(new_projects)

    print(f"✅ Column renamed: 'Resume Worthy' → 'Pinned'")
    return True

if __name__ == "__main__":
    success = rename_column()
    exit(0 if success else 1)
