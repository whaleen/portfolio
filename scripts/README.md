# Portfolio Scripts

Utility scripts for managing portfolio data and GitHub integrations.

## sync-social-previews.js

Syncs social preview images from local repos to GitHub.

### Prerequisites

- Node.js 18+ (ES modules support)
- GitHub CLI (`gh`) installed and authenticated
- Local repos in the standard directory structure

### Social Preview Image Standards

Store social preview images in your repos at one of these locations:
- `.github/social-preview.png` (recommended)
- `.github/og-image.png`
- `docs/social-preview.png`

**Recommended dimensions:** 1280x640px (2:1 aspect ratio)

### Usage

```bash
# See all options
node scripts/sync-social-previews.js --help

# Dry run - see what would happen
node scripts/sync-social-previews.js --dry-run

# Process specific repo
node scripts/sync-social-previews.js --repo=whaleen/video-tiling

# Process all repos
node scripts/sync-social-previews.js
```

### GitHub API Limitation

**Important:** GitHub's API does not currently support programmatic upload of social preview images (Open Graph images). This script will:

1. ✅ Scan local repos for social preview images
2. ✅ Generate a report of which repos have images
3. ⚠️  Provide manual upload URLs for GitHub Settings
4. 💡 Show raw.githubusercontent.com URLs for use in your portfolio

### Workflow

1. **Create social preview images** in your repos at `.github/social-preview.png`
2. **Run the script** to generate a report:
   ```bash
   node scripts/sync-social-previews.js --dry-run
   ```
3. **Manual upload** to GitHub (one-time per repo):
   - Go to repo Settings → Social preview → Upload an image
   - Or use the URLs provided by the script
4. **Use in portfolio** via raw GitHub URLs:
   ```
   https://raw.githubusercontent.com/whaleen/video-tiling/main/.github/social-preview.png
   ```

### Adding to package.json

You can add convenience scripts to `package.json`:

```json
{
  "scripts": {
    "preview:scan": "node scripts/sync-social-previews.js --dry-run",
    "preview:sync": "node scripts/sync-social-previews.js"
  }
}
```

Then run with:
```bash
npm run preview:scan
```

## Future Scripts

- `generate-readme.js` - Auto-generate README.md files for repos
- `update-csv.js` - Update projects.csv from GitHub API
- `validate-data.js` - Validate CSV data integrity
