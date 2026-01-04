# API Server

Simple Express server to run GitHub data fetch script from the frontend.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm run dev:server
```

Or run both frontend and server together:
```bash
npm run dev:all
```

## API Endpoints

### Update Single Repo
```bash
POST /api/github/update
Body: { "repo": "whaleen/astrds" }
```

### Update All Repos
```bash
POST /api/github/update-all
Body: {}
```

## Development

The server runs on `http://localhost:3001` by default. The Vite dev server proxies `/api` requests to this server automatically.

## Requirements

- Python 3 with `gh` CLI installed and authenticated
- Node.js with npm

