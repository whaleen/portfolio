#!/usr/bin/env python3
"""
Fetch Open Graph metadata from project homepage URLs

This script:
1. Reads projects.csv
2. For each project with a Homepage URL, fetches the page
3. Extracts Open Graph meta tags
4. Updates CSV with OG data (title, description, image, type, etc.)
"""

import csv
import argparse
import requests
from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urljoin

# Configuration
CSV_PATH = Path(__file__).parent.parent / "src/data/projects.csv"
BACKUP_PATH = CSV_PATH.with_suffix('.csv.backup')

# Open Graph fields to extract and store
OG_FIELDS = [
    "OG Title",
    "OG Description",
    "OG Image",
    "OG Type",
    "OG URL",
    "OG Site Name",
    "Favicon",
]

def fetch_og_data(url):
    """Fetch Open Graph metadata from a URL

    Args:
        url: The URL to fetch

    Returns:
        dict: Open Graph data or None if fetch fails
    """
    try:
        print(f"  📡 Fetching {url}...")

        # Set a reasonable timeout and user agent
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10, allow_redirects=True)
        response.raise_for_status()

        # Parse HTML
        soup = BeautifulSoup(response.text, 'html.parser')

        # Extract Open Graph tags
        og_data = {}

        # Look for og: meta tags
        for tag in soup.find_all('meta', property=True):
            prop = tag.get('property', '')
            if prop.startswith('og:'):
                og_key = prop.replace('og:', '').title()
                content = tag.get('content', '')

                # Map to our field names
                if og_key == 'Title':
                    og_data['OG Title'] = content
                elif og_key == 'Description':
                    og_data['OG Description'] = content
                elif og_key == 'Image':
                    # Ensure absolute URL
                    og_data['OG Image'] = urljoin(url, content)
                elif og_key == 'Type':
                    og_data['OG Type'] = content
                elif og_key == 'Url':
                    og_data['OG URL'] = content
                elif og_key == 'Site_name':
                    og_data['OG Site Name'] = content

        # Fallbacks if OG tags not found
        if not og_data.get('OG Title'):
            title_tag = soup.find('title')
            if title_tag:
                og_data['OG Title'] = title_tag.get_text().strip()

        if not og_data.get('OG Description'):
            desc_tag = soup.find('meta', attrs={'name': 'description'})
            if desc_tag:
                og_data['OG Description'] = desc_tag.get('content', '').strip()

        # Extract favicon
        favicon_url = None
        # Look for link rel="icon" or rel="shortcut icon"
        for rel in ['icon', 'shortcut icon', 'apple-touch-icon']:
            favicon_tag = soup.find('link', rel=rel)
            if favicon_tag and favicon_tag.get('href'):
                favicon_url = urljoin(url, favicon_tag.get('href'))
                break

        # Fallback to /favicon.ico
        if not favicon_url:
            from urllib.parse import urlparse
            parsed = urlparse(url)
            favicon_url = f"{parsed.scheme}://{parsed.netloc}/favicon.ico"

        og_data['Favicon'] = favicon_url

        print(f"  ✅ Found OG data:")
        if og_data.get('OG Title'):
            print(f"     Title: {og_data['OG Title'][:60]}...")
        if og_data.get('OG Description'):
            print(f"     Description: {og_data['OG Description'][:60]}...")
        if og_data.get('OG Image'):
            print(f"     Image: {og_data['OG Image'][:60]}...")
        if og_data.get('Favicon'):
            print(f"     Favicon: {og_data['Favicon'][:60]}...")

        return og_data

    except requests.Timeout:
        print(f"  ⚠️  Timeout fetching {url}")
        return None
    except requests.RequestException as e:
        print(f"  ⚠️  Error fetching {url}: {e}")
        return None
    except Exception as e:
        print(f"  ⚠️  Unexpected error: {e}")
        return None

def update_csv(repo_filter=None):
    """Update CSV with Open Graph data

    Args:
        repo_filter: Optional filter to process only one repo
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
        fieldnames = [f for f in reader.fieldnames if f and f.strip()]
        rows = list(reader)

    # Add new fields if they don't exist
    updated_fieldnames = list(fieldnames)
    for field in OG_FIELDS:
        if field not in updated_fieldnames:
            updated_fieldnames.append(field)

    print(f"\n📊 Processing {len(rows)} repos...\n")

    updated_count = 0
    skipped_count = 0
    error_count = 0

    for row in rows:
        repo_name = row.get('Repo', '').strip()
        github_org = row.get('GitHub Org', '').strip()
        homepage = row.get('Homepage', '').strip()

        if not repo_name or not github_org:
            skipped_count += 1
            continue

        # Apply repo filter if specified
        if repo_filter:
            repo_match = repo_name.lower() == repo_filter.lower()
            org_repo_match = f"{github_org}/{repo_name}".lower() == repo_filter.lower()
            if not (repo_match or org_repo_match):
                skipped_count += 1
                continue

        # Skip if no homepage
        if not homepage or homepage == "none":
            print(f"\n{github_org}/{repo_name}")
            print(f"  ⏭️  No homepage URL")
            skipped_count += 1
            continue

        print(f"\n{github_org}/{repo_name}")

        # Fetch OG data
        og_data = fetch_og_data(homepage)

        if not og_data:
            print("  ❌ Failed to fetch OG data")
            error_count += 1
            continue

        # Update row with OG data
        for field in OG_FIELDS:
            if field in og_data:
                row[field] = og_data[field]

        # Ensure all fieldnames exist in row
        for key in updated_fieldnames:
            if key and key.strip() and key not in row:
                row[key] = ""

        updated_count += 1

    # Ensure all rows have all fieldnames
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
        for field in OG_FIELDS:
            if field not in fieldnames:
                print(f"  + {field}")

def main():
    parser = argparse.ArgumentParser(
        description="Fetch Open Graph metadata from project homepage URLs",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Fetch OG data for all projects with homepage URLs
  python3 scripts/fetch-og-data.py

  # Fetch only one project
  python3 scripts/fetch-og-data.py --repo video-tiling

  # Fetch only one project by org/repo
  python3 scripts/fetch-og-data.py --repo whaleen/video-tiling
        """
    )
    parser.add_argument(
        '--repo',
        type=str,
        help='Process only a specific repo. Can be repo name or org/repo'
    )

    args = parser.parse_args()

    print("🌐 Open Graph Data Fetcher\n")

    if args.repo:
        print(f"🎯 Filtering to repo: {args.repo}\n")

    update_csv(repo_filter=args.repo)

if __name__ == "__main__":
    main()
