#!/usr/bin/env python3
"""
Delete a project from projects.csv
"""

import csv
import os
import argparse
from datetime import datetime

# Get the project root directory (parent of scripts/)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)

# Paths
CSV_PATH = os.path.join(PROJECT_ROOT, "public", "data", "projects.csv")

def delete_project(repo_full_name):
    """Delete a project from the CSV"""
    print(f"🗑️  Deleting project: {repo_full_name}")

    if not os.path.exists(CSV_PATH):
        print(f"❌ CSV file not found: {CSV_PATH}")
        return False

    # Read all projects
    with open(CSV_PATH, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        projects = list(reader)

    # Find and remove the project
    initial_count = len(projects)
    projects = [p for p in projects if f"{p['GitHub Org']}/{p['Repo']}" != repo_full_name]

    if len(projects) == initial_count:
        print(f"❌ Project not found: {repo_full_name}")
        return False

    # Create backup
    backup_path = f"{CSV_PATH}.backup"
    os.rename(CSV_PATH, backup_path)
    print(f"💾 Backup created: {backup_path}")

    # Write updated CSV
    with open(CSV_PATH, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(projects)

    print(f"✅ Project deleted: {repo_full_name}")
    print(f"📊 Projects remaining: {len(projects)}")
    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Delete a project from projects.csv")
    parser.add_argument("--repo", required=True, help="Full repo name (org/repo)")

    args = parser.parse_args()

    success = delete_project(args.repo)
    exit(0 if success else 1)
