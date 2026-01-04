#!/bin/bash

# Distribute social preview to all local repos
# Usage: ./scripts/distribute.sh [--dry-run]

SOURCE="/Users/josh/Projects/_nothingdao/earth/.github/social-preview.png"
PROJECTS_DIR="/Users/josh/Projects"
DRY_RUN=false

# Check for dry-run flag
if [[ "$1" == "--dry-run" ]]; then
  DRY_RUN=true
  echo "🔍 DRY RUN - No files will be copied"
  echo ""
fi

# Check source exists
if [ ! -f "$SOURCE" ]; then
  echo "❌ Source image not found: $SOURCE"
  exit 1
fi

COPIED=0
SKIPPED=0
ERRORS=0

# Function to copy to a repo
copy_to_repo() {
  local org_dir=$1
  local repo=$2
  local repo_path="$PROJECTS_DIR/$org_dir/$repo"

  # Skip if repo doesn't exist
  if [ ! -d "$repo_path" ]; then
    return
  fi

  local dest_dir="$repo_path/.github"
  local dest_file="$dest_dir/social-preview.png"

  # Skip if already exists
  if [ -f "$dest_file" ]; then
    echo "⏭️  $org_dir/$repo - already exists"
    ((SKIPPED++))
    return
  fi

  if [ "$DRY_RUN" = true ]; then
    echo "🔍 $org_dir/$repo - Would copy to .github/social-preview.png"
    ((COPIED++))
  else
    # Create .github dir if needed
    mkdir -p "$dest_dir"

    # Copy file
    if cp "$SOURCE" "$dest_file"; then
      echo "✅ $org_dir/$repo - Copied to .github/social-preview.png"
      ((COPIED++))
    else
      echo "❌ $org_dir/$repo - Failed to copy"
      ((ERRORS++))
    fi
  fi
}

# Process all repos in each org
echo "📋 Distributing social preview images..."
echo ""

# _whaleen repos
copy_to_repo "_whaleen" "video-tiling"
copy_to_repo "_whaleen" "ephemeral-text"
copy_to_repo "_whaleen" "ephemeral-text-tauri"

# _nothingdao repos (skip earth - it's the source)
copy_to_repo "_nothingdao" "studio-sites"
copy_to_repo "_nothingdao" "shadcn-solana"
copy_to_repo "_nothingdao" "kirby"
copy_to_repo "_nothingdao" "solana-dapp"
copy_to_repo "_nothingdao" "solana-rag"
copy_to_repo "_nothingdao" "solana-components"
copy_to_repo "_nothingdao" "earth-work"
copy_to_repo "_nothingdao" "gill-exploration"
copy_to_repo "_nothingdao" "groundwork"
copy_to_repo "_nothingdao" "saihss"

# _orthfx repos
copy_to_repo "_orthfx" "jpb"
copy_to_repo "_orthfx" "orthfx"
copy_to_repo "_orthfx" "orthodox-reader"
copy_to_repo "_orthfx" "orthobot"
copy_to_repo "_orthfx" "orthodox-nkjv"
copy_to_repo "_orthfx" "pledge"
copy_to_repo "_orthfx" "sites"
copy_to_repo "_orthfx" "orthofox-art"
copy_to_repo "_orthfx" "rocor-parishes"

# _archive repos (only local ones from CSV)
copy_to_repo "_archive" "api-monitor"
copy_to_repo "_archive" "swe-tax"
copy_to_repo "_archive" "travel"
copy_to_repo "_archive" "bore-research"
copy_to_repo "_archive" "bluejacket"
copy_to_repo "_archive" "chair"
copy_to_repo "_archive" "claude-on-solana"
copy_to_repo "_archive" "sing-his-peace"
copy_to_repo "_archive" "video-browser"
copy_to_repo "_archive" "sahil-lulla"

# Summary
echo ""
echo "=================================================="
echo "📊 Summary"
echo "=================================================="
if [ "$DRY_RUN" = true ]; then
  echo "🔍 Would copy: $COPIED"
else
  echo "✅ Copied: $COPIED"
fi
echo "⏭️  Skipped (already exists): $SKIPPED"
echo "❌ Errors: $ERRORS"

if [ "$DRY_RUN" = false ] && [ $COPIED -gt 0 ]; then
  echo ""
  echo "✨ Next Steps:"
  echo "1. Run: npm run social:scan"
  echo "2. Commit changes to each repo"
fi
