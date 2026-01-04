# GitHub API Data Fetcher

Automatically fetch and update your portfolio CSV with live GitHub data.

## What It Does

The script fetches for each repo:
- ⭐ **Stars** - Stargazer count
- 🍴 **Forks** - Fork count
- 📝 **Description** - Repo description from GitHub
- 🏷️ **Topics** - GitHub topics/tags
- ⚖️ **License** - SPDX license identifier
- 📄 **Has Pages** - GitHub Pages enabled?
- 🌿 **Default Branch** - Usually `main` or `master`
- 🗓️ **Last Updated** - Latest activity timestamp
- 🌐 **Homepage** - Project website URL
- 💻 **Primary Language** - Main programming language
- 🔱 **Is Fork** - Whether it's a forked repo
- 📦 **Archived** - Archived status

## Prerequisites

**GitHub CLI must be installed and authenticated:**

```bash
# Install GitHub CLI
brew install gh

# Authenticate
gh auth login
```

## Usage

### Fetch data for all repos:

```bash
cd /Users/josh/Projects/portfolio
npm run github:fetch
```

Or directly:
```bash
python3 scripts/fetch-github-data.py
```

### Fetch data for a single repo:

You can limit the script to process only one repository for faster testing or updates:

```bash
# By repo name (matches any repo with this name)
python3 scripts/fetch-github-data.py --repo video-tiling

# By org/repo (matches specific repository)
python3 scripts/fetch-github-data.py --repo whaleen/video-tiling
```

This is useful for:
- Testing the script on a single repo
- Quickly updating data for one project
- Debugging API issues

### What happens:

1. **Backup created** - `projects.csv.backup` saved automatically
2. **Fetches data** - Calls GitHub API for each repo in CSV
3. **Updates CSV** - Adds new columns and updates existing data
4. **Shows progress** - Real-time feedback for each repo

### Output:

```
🚀 GitHub Data Fetcher

📋 Reading projects.csv...
💾 Backup created: projects.csv.backup

📊 Processing 247 repos...

whaleen/video-tiling
  📡 Fetching whaleen/video-tiling...
  ✅ Updated:
     Stars: 5
     Forks: 2
     Topics: Python,Video,Automation

nothingdao/earth
  📡 Fetching nothingdao/earth...
  ✅ Updated:
     Stars: 12
     Forks: 0
     Topics: Web3,Solana,Game,NFT

==================================================
📊 Summary
==================================================
✅ Updated: 247
⏭️  Skipped: 0
❌ Errors: 0

💾 CSV updated: src/data/projects.csv
💾 Backup: src/data/projects.csv.backup
```

## Rate Limits

- **Authenticated**: 5,000 requests/hour
- **247 repos** = 494 API calls (repo data + topics for each)
- Takes ~2-5 minutes to complete

## New CSV Fields

After running, your CSV will have these new columns:

| Field | Description | Example |
|-------|-------------|---------|
| `Stars` | GitHub stars | `42` |
| `Forks` | Fork count | `7` |
| `Description` | Repo description | `Web3 survival game` |
| `Topics` | Comma-separated topics | `Web3,Solana,Game` |
| `License` | SPDX license ID | `MIT` |
| `Has Pages` | GitHub Pages? | `yes`/`no` |
| `Default Branch` | Main branch name | `main` |

## Backup & Safety

- **Automatic backup** created before any changes
- Original CSV preserved as `.csv.backup`
- Safe to run multiple times (updates existing data)

## Troubleshooting

### "GitHub CLI not authenticated"
```bash
gh auth login
```

### "API error: rate limit exceeded"
Wait an hour or authenticate with a different account

### "gh: command not found"
```bash
brew install gh
```

## Updating TypeScript Types

After fetching new data, update your TypeScript interface:

```typescript
// src/types/project.ts
export interface Project {
  // ... existing fields ...
  Stars?: number;
  Forks?: number;
  Description?: string;
  Topics?: string;
  License?: string;
  "Has Pages"?: string;
  "Default Branch"?: string;
}
```

## Using in Portfolio

Display the new data in your components:

```tsx
// Show stars
{project.Stars > 0 && (
  <Badge>⭐ {project.Stars}</Badge>
)}

// Show topics from GitHub
{project.Topics && (
  <div className="flex gap-2">
    {project.Topics.split(',').map(topic => (
      <Badge key={topic}>{topic}</Badge>
    ))}
  </div>
)}
```

## Automation

Set up a cron job or GitHub Action to keep data fresh:

```bash
# Daily update at 2am
0 2 * * * cd /Users/josh/Projects/portfolio && npm run github:fetch
```
