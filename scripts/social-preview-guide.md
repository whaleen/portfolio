# Social Preview Image Guide

Guide for creating and managing social preview images for your GitHub repos.

## What Are Social Preview Images?

Social preview images (also called Open Graph images) appear when you share a GitHub repo on:
- Twitter/X
- LinkedIn
- Slack
- Discord
- Facebook
- Any platform that uses Open Graph meta tags

## Image Specifications

- **Dimensions:** 1280x640px (2:1 aspect ratio)
- **Format:** PNG (recommended) or JPG
- **Max size:** 1MB (GitHub limit)
- **Location:** `.github/social-preview.png` in your repo

## Creating Social Preview Images

### Design Tips

1. **Keep it simple** - Readable at small sizes
2. **High contrast** - Shows well on any background
3. **Branded** - Use consistent colors/fonts across repos
4. **Include:**
   - Project name/logo
   - Brief tagline (3-7 words)
   - Tech stack badges (optional)
   - Your GitHub handle or org

### Design Tools

- **Figma** - Professional design tool (free tier available)
- **Canva** - Easy templates (1280x640 custom size)
- **Pixelmator** - macOS native app
- **Photoshop** - Industry standard
- **Code-based:**
  - [og-image.vercel.app](https://og-image.vercel.app/) - Generate from HTML/CSS
  - [Satori](https://github.com/vercel/satori) - React/JSX to PNG

### Template Structure

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  PROJECT NAME                                   │
│  Brief tagline about what this project does    │
│                                                 │
│  [Tech Badge] [Tech Badge] [Tech Badge]       │
│                                              @user│
└─────────────────────────────────────────────────┘
```

## Adding to Your Repo

### 1. Create the image

Save as `.github/social-preview.png` in your repo:

```bash
cd /path/to/your/repo
mkdir -p .github
# Add your image to .github/social-preview.png
```

### 2. Commit to repo

```bash
git add .github/social-preview.png
git commit -m "Add social preview image"
git push
```

### 3. Upload to GitHub

⚠️ **Important:** The image in your repo is for version control and portfolio use. You must also upload it to GitHub:

1. Go to your repo on GitHub
2. Settings → Social preview
3. Upload an image
4. Click "Upload an image" and select `.github/social-preview.png`

## Using in Your Portfolio

Once the image is in your repo, you can reference it directly:

```tsx
const socialPreviewUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/.github/social-preview.png`;

<img src={socialPreviewUrl} alt={`${repo} preview`} />
```

## Automation

Use the portfolio sync script to check all repos:

```bash
# Check which repos have social preview images
npm run social:scan

# Specific repo
node scripts/sync-social-previews.js --repo=whaleen/video-tiling
```

## Batch Creating Images

For multiple repos, consider:

1. **Create a Figma/Canva template** with your branding
2. **Duplicate for each project**
3. **Update project name and tagline**
4. **Export all as PNG**
5. **Add to respective repos**

### Programmatic Generation

You can also generate images programmatically:

```javascript
// Example using @vercel/og or Satori
import { ImageResponse } from '@vercel/og';

const image = new ImageResponse(
  <div style={{ /* your styles */ }}>
    <h1>{projectName}</h1>
    <p>{tagline}</p>
  </div>,
  { width: 1280, height: 640 }
);
```

## Example Repos with Good Social Previews

- [Vercel/Next.js](https://github.com/vercel/next.js)
- [shadcn/ui](https://github.com/shadcn/ui)
- [TanStack/Query](https://github.com/TanStack/query)

## Checklist

- [ ] Image is 1280x640px
- [ ] File size under 1MB
- [ ] Saved as `.github/social-preview.png`
- [ ] Committed to repo
- [ ] Uploaded to GitHub Settings
- [ ] Tested by sharing repo link on Twitter/Slack
- [ ] Added to portfolio CSV data if tracking

## Resources

- [GitHub Social Preview Docs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
