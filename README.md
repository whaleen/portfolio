# Portfolio

Personal portfolio site built with [Eleventy](https://www.11ty.dev/). Pulls project data from GitHub and generates static pages.

## Stack

- **11ty** — Static site generator
- **Nunjucks** — Templating
- **Tachyons** — Utility CSS
- **GitHub API** — Project data via `gh` CLI

## Development

```bash
npm start        # Dev server with hot reload
npm run build    # Production build → _site/
npm run sync     # Sync project data from GitHub
```

## Structure

```
_data/
  projects.json     Project metadata (synced from GitHub)
  colophon.json     Tool references
_includes/
  layouts/base.njk  Base HTML template (Vesper dark theme)
index.njk           Homepage — featured projects + categories
project.njk         Individual project pages (pagination)
colophon.njk        Colophon page
scripts/
  sync-projects.js  Fetches repos from whaleen, nothingdao, orthfx orgs
public/             Static assets (favicons, social images)
```

## Data

`npm run sync` pulls repos from GitHub and writes `_data/projects.json`. Projects tagged with the `portfolio` topic appear as featured on the homepage. Others are grouped by category.
