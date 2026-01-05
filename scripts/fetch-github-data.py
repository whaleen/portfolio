#!/usr/bin/env python3
"""
Fetch GitHub API data and update projects.csv

This script:
1. Reads projects.csv
2. Fetches data from GitHub API for each repo
3. Updates CSV with latest GitHub data
4. Adds new fields: Stars, Forks, Description, Topics, etc.
"""

import csv
import json
import subprocess
import sys
import argparse
import base64
import requests
from pathlib import Path
from datetime import datetime

# Configuration
CSV_PATH = Path(__file__).parent.parent / "public/data/projects.csv"
BACKUP_PATH = CSV_PATH.with_suffix('.csv.backup')
README_DIR = Path(__file__).parent.parent / "public/readmes"
SOCIAL_PREVIEW_DIR = Path(__file__).parent.parent / "public/social-previews"

# All GitHub API fields to add to CSV
NEW_FIELDS = [
    # Stats
    "Stars",
    "Forks",
    "Watchers",
    "Subscribers",
    "Network Count",
    "Open Issues",
    "Size (KB)",
    "Contributors Count",
    "Releases Count",
    # Dates
    "Created At",
    "Pushed At",
    "Latest Release Date",
    # Info
    "Description",
    "Homepage",
    "Full Name",
    "Primary Language",
    "Language Breakdown",
    "Topics",
    # Status
    "Is Fork",
    "Archived",
    "Disabled",
    "Private",
    "Visibility",
    # Features
    "Has Pages",
    "Has Issues",
    "Has Projects",
    "Has Wiki",
    "Has Downloads",
    # Config
    "Default Branch",
    "License",
    "License Name",
    # URLs
    "HTML URL",
    "Clone URL",
    "Git URL",
    "SSH URL",
    "Social Preview URL",
    # README
    "README URL",
    "README Size (bytes)",
    "README Name",
    "README Path",
    "Has README",
    # Latest Release
    "Latest Release Tag",
    "Latest Release Name",
    # Latest Commit
    "Latest Commit Message",
    "Latest Commit Date",
    "Latest Commit Author",
]

def run_gh_api(endpoint, accept_header=None):
    """Run GitHub CLI API call"""
    try:
        cmd = ["gh", "api", endpoint]
        if accept_header:
            cmd.extend(["-H", f"Accept: {accept_header}"])

        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            check=True
        )
        return json.loads(result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"  ⚠️  API error: {e.stderr.strip()}")
        return None
    except FileNotFoundError:
        print("❌ GitHub CLI (gh) not found. Please install: brew install gh")
        sys.exit(1)

def run_gh_graphql(query):
    """Run GitHub CLI GraphQL query"""
    try:
        cmd = ["gh", "api", "graphql", "-f", f"query={query}"]
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            check=True
        )
        return json.loads(result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"  ⚠️  GraphQL error: {e.stderr.strip()}")
        return None
    except FileNotFoundError:
        print("❌ GitHub CLI (gh) not found. Please install: brew install gh")
        sys.exit(1)

def save_readme(org, repo, readme_data):
    """Save README content to public/readmes/{org}/{repo}.md

    Args:
        org: GitHub organization
        repo: Repository name
        readme_data: README data from GitHub API

    Returns:
        Path to README file relative to public/ or empty string if no README
    """
    if not readme_data or not readme_data.get("content"):
        return ""

    try:
        # Decode base64 content
        content = base64.b64decode(readme_data["content"]).decode('utf-8')

        # Create org directory
        org_dir = README_DIR / org
        org_dir.mkdir(parents=True, exist_ok=True)

        # Save README
        readme_path = org_dir / f"{repo}.md"
        with open(readme_path, 'w', encoding='utf-8') as f:
            f.write(content)

        # Return path relative to public/
        return f"/readmes/{org}/{repo}.md"
    except Exception as e:
        print(f"  ⚠️  Failed to save README: {e}")
        return ""

def save_social_preview(org, repo, social_preview_url):
    """Download and save social preview image to public/social-previews/{org}/{repo}.png

    Args:
        org: GitHub organization
        repo: Repository name
        social_preview_url: URL to the social preview image

    Returns:
        Path to social preview image relative to public/ or empty string if failed
    """
    if not social_preview_url:
        return ""

    try:
        # Download image
        print(f"  🖼️  Downloading social preview...")
        response = requests.get(social_preview_url, timeout=10)
        response.raise_for_status()

        # Create org directory
        org_dir = SOCIAL_PREVIEW_DIR / org
        org_dir.mkdir(parents=True, exist_ok=True)

        # Save image
        image_path = org_dir / f"{repo}.png"
        with open(image_path, 'wb') as f:
            f.write(response.content)

        print(f"  ✅ Saved social preview ({len(response.content) // 1024} KB)")

        # Return path relative to public/
        return f"/social-previews/{org}/{repo}.png"
    except requests.RequestException as e:
        print(f"  ⚠️  Failed to download social preview: {e}")
        return ""
    except Exception as e:
        print(f"  ⚠️  Failed to save social preview: {e}")
        return ""

def fetch_repo_data(org, repo):
    """Fetch repository data from GitHub API"""
    print(f"  📡 Fetching {org}/{repo}...")

    # Get main repo data
    repo_data = run_gh_api(f"/repos/{org}/{repo}")
    if not repo_data:
        return None

    # Get languages
    languages = run_gh_api(f"/repos/{org}/{repo}/languages")

    # Get topics
    topics_data = run_gh_api(
        f"/repos/{org}/{repo}/topics",
        accept_header="application/vnd.github.mercy-preview+json"
    )

    # Get README
    readme_data = run_gh_api(f"/repos/{org}/{repo}/readme")

    # Get contributors count
    # Note: Getting exact count requires pagination, so we'll try to get it from repo_data first
    # If not available, we'll check if contributors endpoint exists
    contributors_count = repo_data.get("contributors_count", "")
    if not contributors_count:
        # Try to check if contributors endpoint exists (some repos might not have it)
        contributors_data = run_gh_api(f"/repos/{org}/{repo}/contributors?per_page=1&anon=1")
        if contributors_data:
            contributors_count = "1+"  # Indicates at least 1, but total unknown without pagination
    
    # Get releases (first page only for latest release info)
    releases_data = run_gh_api(f"/repos/{org}/{repo}/releases?per_page=1")

    # Get latest commit
    commits_data = run_gh_api(f"/repos/{org}/{repo}/commits?per_page=1")

    # Extract all useful data from GitHub API
    license_obj = repo_data.get("license", {})
    default_branch = repo_data.get("default_branch", "main")

    # Get the actual social preview URL (custom or default) via GraphQL
    graphql_query = f'''
    {{
      repository(owner: "{org}", name: "{repo}") {{
        openGraphImageUrl
      }}
    }}
    '''
    graphql_data = run_gh_graphql(graphql_query)
    social_preview_url = ""
    if graphql_data and "data" in graphql_data and graphql_data["data"]["repository"]:
        social_preview_url = graphql_data["data"]["repository"].get("openGraphImageUrl", "")

    # Download and save social preview image
    save_social_preview(org, repo, social_preview_url)

    data = {
        # Stats
        "Stars": repo_data.get("stargazers_count", 0),
        "Forks": repo_data.get("forks_count", 0),
        "Watchers": repo_data.get("watchers_count", 0),
        "Subscribers": repo_data.get("subscribers_count", 0),
        "Network Count": repo_data.get("network_count", 0),
        "Open Issues": repo_data.get("open_issues_count", 0),
        "Size (KB)": repo_data.get("size", 0),
        "Contributors Count": contributors_count,
        "Releases Count": len(releases_data) if releases_data else 0,
        # Dates
        "Created At": repo_data.get("created_at", ""),
        "Pushed At": repo_data.get("pushed_at", ""),
        "Last Updated": repo_data.get("updated_at", ""),
        "Latest Release Date": releases_data[0].get("published_at", "") if releases_data and len(releases_data) > 0 else "",
        # Info
        "Description": repo_data.get("description", ""),
        "Homepage": repo_data.get("homepage", ""),
        "Full Name": repo_data.get("full_name", ""),
        "Primary Language": repo_data.get("language", ""),
        "Topics": ",".join(topics_data.get("names", [])) if topics_data else "",
        # Status
        "Is Fork": "yes" if repo_data.get("fork") else "no",
        "Archived": "yes" if repo_data.get("archived") else "no",
        "Disabled": "yes" if repo_data.get("disabled") else "no",
        "Private": "yes" if repo_data.get("private") else "no",
        "Visibility": repo_data.get("visibility", ""),
        # Features
        "Has Pages": "yes" if repo_data.get("has_pages") else "no",
        "Has Issues": "yes" if repo_data.get("has_issues") else "no",
        "Has Projects": "yes" if repo_data.get("has_projects") else "no",
        "Has Wiki": "yes" if repo_data.get("has_wiki") else "no",
        "Has Downloads": "yes" if repo_data.get("has_downloads") else "no",
        "Has README": "yes" if readme_data else "no",
        # Config
        "Default Branch": default_branch,
        "License": license_obj.get("spdx_id", "") if license_obj else "",
        "License Name": license_obj.get("name", "") if license_obj else "",
        # URLs
        "HTML URL": repo_data.get("html_url", ""),
        "Clone URL": repo_data.get("clone_url", ""),
        "Git URL": repo_data.get("git_url", ""),
        "SSH URL": repo_data.get("ssh_url", ""),
        "Social Preview URL": social_preview_url,
        # README
        "README URL": readme_data.get("html_url", "") if readme_data else "",
        "README Size (bytes)": readme_data.get("size", 0) if readme_data else 0,
        "README Name": readme_data.get("name", "") if readme_data else "",
        "README Path": save_readme(org, repo, readme_data),
        # Latest Release
        "Latest Release Tag": releases_data[0].get("tag_name", "") if releases_data and len(releases_data) > 0 else "",
        "Latest Release Name": releases_data[0].get("name", "") if releases_data and len(releases_data) > 0 else "",
        # Latest Commit
        "Latest Commit Message": commits_data[0].get("commit", {}).get("message", "") if commits_data and len(commits_data) > 0 else "",
        "Latest Commit Date": commits_data[0].get("commit", {}).get("committer", {}).get("date", "") if commits_data and len(commits_data) > 0 else "",
        "Latest Commit Author": commits_data[0].get("commit", {}).get("author", {}).get("name", "") if commits_data and len(commits_data) > 0 else "",
    }

    # Get primary language percentage if languages available
    if languages:
        total = sum(languages.values())
        if total > 0:
            data["Language Breakdown"] = ", ".join([
                f"{lang}: {(count/total*100):.1f}%"
                for lang, count in sorted(languages.items(), key=lambda x: x[1], reverse=True)[:3]
            ])
    else:
        data["Language Breakdown"] = ""

    return data

def update_csv(repo_filter=None):
    """Update CSV with GitHub data
    
    Args:
        repo_filter: Optional filter to process only one repo. Can be:
            - "repo-name" (will match any repo with this name)
            - "org/repo-name" (will match specific org/repo)
    """
    print("📋 Reading projects.csv...")

    # Create backup
    if CSV_PATH.exists():
        import shutil
        shutil.copy2(CSV_PATH, BACKUP_PATH)
        print(f"💾 Backup created: {BACKUP_PATH.name}")

    # Read existing CSV
    with open(CSV_PATH, 'r') as f:
        reader = csv.DictReader(f)
        # Filter out None/empty fieldnames
        fieldnames = [f for f in reader.fieldnames if f and f.strip()]
        rows = list(reader)

    # Add new fields if they don't exist
    updated_fieldnames = list(fieldnames)
    for field in NEW_FIELDS:
        if field not in updated_fieldnames:
            updated_fieldnames.append(field)

    print(f"\n📊 Processing {len(rows)} repos...\n")

    updated_count = 0
    skipped_count = 0
    error_count = 0

    for row in rows:
        repo_name = row.get('Repo', '').strip()
        github_org = row.get('GitHub Org', '').strip()

        if not repo_name or not github_org:
            # Clean the row - remove invalid keys, but keep all valid fieldnames
            keys_to_remove = [k for k in row.keys() if not k or not k.strip()]
            for key in keys_to_remove:
                del row[key]
            # Ensure all fieldnames exist in row
            for key in updated_fieldnames:
                if key and key.strip() and key not in row:
                    row[key] = ""
            skipped_count += 1
            continue

        # Apply repo filter if specified
        if repo_filter:
            repo_match = repo_name.lower() == repo_filter.lower()
            org_repo_match = f"{github_org}/{repo_name}".lower() == repo_filter.lower()
            if not (repo_match or org_repo_match):
                # Skip this repo, but still ensure it has all fields
                keys_to_remove = [k for k in row.keys() if not k or not k.strip()]
                for key in keys_to_remove:
                    del row[key]
                for key in updated_fieldnames:
                    if key and key.strip() and key not in row:
                        row[key] = ""
                skipped_count += 1
                continue
            # If we get here, the repo matched the filter - proceed to fetch data
            print(f"  ✓ Matched filter: {github_org}/{repo_name}")

        print(f"\n{github_org}/{repo_name}")

        # Fetch data from GitHub
        github_data = fetch_repo_data(github_org, repo_name)

        if not github_data:
            print("  ❌ Failed to fetch data")
            # Clean the row - remove invalid keys, but keep all valid fieldnames
            keys_to_remove = [k for k in row.keys() if not k or not k.strip()]
            for key in keys_to_remove:
                del row[key]
            # Ensure all fieldnames exist in row
            for key in updated_fieldnames:
                if key and key.strip() and key not in row:
                    row[key] = ""
            error_count += 1
            continue

        # Update row with GitHub data
        # First, ensure all fields from API are in fieldnames
        for key in github_data.keys():
            if key not in updated_fieldnames:
                updated_fieldnames.append(key)
        
        # Now update the row
        for key, value in github_data.items():
            old_value = row.get(key, "")
            row[key] = value
            # Debug: show if value actually changed
            if str(old_value) != str(value) and key in ["Description", "Topics", "Stars", "Forks", "Last Updated"]:
                print(f"     {key}: '{old_value}' → '{value}'")

        # Clean the row - remove invalid keys, but keep all valid fieldnames
        # Update in place to maintain reference to rows list
        keys_to_remove = [k for k in row.keys() if not k or not k.strip()]
        for key in keys_to_remove:
            del row[key]
        
        # Ensure all fieldnames exist in row (with empty string if missing)
        for key in updated_fieldnames:
            if key and key.strip() and key not in row:
                row[key] = ""

        # Show what was updated
        print(f"  ✅ Updated:")
        print(f"     Stars: {github_data.get('Stars', 0)} | Forks: {github_data.get('Forks', 0)} | Issues: {github_data.get('Open Issues', 0)}")
        if github_data.get('Topics'):
            print(f"     Topics: {github_data['Topics'][:60]}...")
        if github_data.get('Primary Language'):
            print(f"     Language: {github_data['Primary Language']}")

        updated_count += 1

    # Ensure all rows have all fieldnames (fill missing fields with empty strings)
    for row in rows:
        for key in updated_fieldnames:
            if key and key.strip() and key not in row:
                row[key] = ""

    # Write updated CSV
    print("\n💾 Writing updated CSV...")
    with open(CSV_PATH, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=updated_fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    # Summary
    print("\n" + "=" * 50)
    print("📊 Summary")
    print("=" * 50)
    print(f"✅ Updated: {updated_count}")
    print(f"⏭️  Skipped: {skipped_count}")
    print(f"❌ Errors: {error_count}")
    print(f"\n💾 CSV updated: {CSV_PATH}")
    print(f"💾 Backup: {BACKUP_PATH}")

    if updated_count > 0:
        print("\n✨ New fields added:")
        for field in NEW_FIELDS:
            if field not in fieldnames:
                print(f"  + {field}")

def main():
    parser = argparse.ArgumentParser(
        description="Fetch GitHub API data and update projects.csv",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Fetch all repos
  python3 scripts/fetch-github-data.py
  
  # Fetch only one repo by name
  python3 scripts/fetch-github-data.py --repo video-tiling
  
  # Fetch only one repo by org/repo
  python3 scripts/fetch-github-data.py --repo whaleen/video-tiling
        """
    )
    parser.add_argument(
        '--repo',
        type=str,
        help='Process only a specific repo. Can be repo name (e.g., "video-tiling") or org/repo (e.g., "whaleen/video-tiling")'
    )
    
    args = parser.parse_args()
    
    print("🚀 GitHub Data Fetcher\n")
    
    if args.repo:
        print(f"🎯 Filtering to repo: {args.repo}\n")

    # Check if gh is authenticated
    try:
        subprocess.run(["gh", "auth", "status"], capture_output=True, check=True)
    except subprocess.CalledProcessError:
        print("❌ GitHub CLI not authenticated. Run: gh auth login")
        sys.exit(1)

    update_csv(repo_filter=args.repo)

if __name__ == "__main__":
    main()
