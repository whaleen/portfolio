#!/usr/bin/env python3
"""
Copy social preview images from local repos to portfolio public folder
"""

import shutil
from pathlib import Path

# Configuration
PROJECTS_DIR = Path("/Users/josh/Projects")
PORTFOLIO_PUBLIC = Path("/Users/josh/Projects/portfolio/public/social-previews")

# Repos with social previews
REPOS = [
    ("_whaleen", "video-tiling"),
    ("_whaleen", "ephemeral-text"),
    ("_nothingdao", "earth"),
    ("_nothingdao", "studio-sites"),
    ("_nothingdao", "shadcn-solana"),
    ("_orthfx", "orthfx"),
    ("_orthfx", "jpb"),
    ("_orthfx", "orthodox-reader"),
    ("_orthfx", "orthobot"),
    ("_orthfx", "orthodox-nkjv"),
]

def main():
    # Create public directory structure
    PORTFOLIO_PUBLIC.mkdir(parents=True, exist_ok=True)

    copied = 0
    errors = 0

    print("📋 Copying social previews to portfolio public folder...\n")

    for org_dir, repo_name in REPOS:
        source = PROJECTS_DIR / org_dir / repo_name / ".github" / "social-preview.png"

        if not source.exists():
            print(f"⚠️  {org_dir}/{repo_name} - Source image not found")
            continue

        # Create org directory in public folder
        org_name = org_dir.replace("_", "")
        dest_dir = PORTFOLIO_PUBLIC / org_name
        dest_dir.mkdir(exist_ok=True)

        dest = dest_dir / f"{repo_name}.png"

        try:
            shutil.copy2(source, dest)
            print(f"✅ {org_name}/{repo_name} - Copied")
            copied += 1
        except Exception as e:
            print(f"❌ {org_name}/{repo_name} - Error: {e}")
            errors += 1

    # Summary
    print("\n" + "=" * 50)
    print("📊 Summary")
    print("=" * 50)
    print(f"✅ Copied: {copied}")
    print(f"❌ Errors: {errors}")

    if copied > 0:
        print(f"\n📁 Images copied to: {PORTFOLIO_PUBLIC}")
        print("💡 Images will be available at: /social-previews/{org}/{repo}.png")

if __name__ == "__main__":
    main()
