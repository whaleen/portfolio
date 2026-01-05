#!/usr/bin/env python3
"""
Mark all projects without GitHub data as hidden
"""

import csv
import os

# Get the project root directory (parent of scripts/)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)

# Paths
CSV_PATH = os.path.join(PROJECT_ROOT, "public", "data", "projects.csv")

def has_github_data(project):
    """Check if project has GitHub data"""
    stars = project.get("Stars", "").strip()
    social_preview = project.get("Social Preview URL", "").strip()

    return stars != "" and social_preview != ""

def hide_projects_without_github_data():
    """Mark all projects without GitHub data as hidden"""
    print("🔍 Finding projects without GitHub data...")

    if not os.path.exists(CSV_PATH):
        print(f"❌ CSV file not found: {CSV_PATH}")
        return False

    # Read all projects
    with open(CSV_PATH, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        projects = list(reader)

    # Find projects without GitHub data
    to_hide = []
    for project in projects:
        if not has_github_data(project):
            repo_name = f"{project['GitHub Org']}/{project['Repo']}"
            to_hide.append(repo_name)
            project["Hidden"] = "yes"

    if not to_hide:
        print("✅ All projects have GitHub data")
        return True

    print(f"📋 Found {len(to_hide)} projects without GitHub data:")
    for repo in to_hide:
        print(f"  - {repo}")

    # Create backup
    backup_path = f"{CSV_PATH}.backup"
    os.rename(CSV_PATH, backup_path)
    print(f"💾 Backup created: {backup_path}")

    # Write updated CSV
    with open(CSV_PATH, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(projects)

    print(f"✅ Marked {len(to_hide)} projects as hidden")
    return True

if __name__ == "__main__":
    success = hide_projects_without_github_data()
    exit(0 if success else 1)
