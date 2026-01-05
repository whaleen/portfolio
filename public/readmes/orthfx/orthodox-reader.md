# Orthodox Reader

A minimal, mobile-first Bible reading application featuring continuous scroll, synchronized audio narration, and a distraction-free reading experience. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Progressive Web App**: Installable on mobile and desktop with offline support
- **Offline Reading**: Entire Bible text cached for reading without internet
- **Continuous Reading**: Infinite scroll from Genesis to Revelation - chapters load dynamically as you read
- **Audio Narration**: Synchronized audio playback with real-time verse highlighting and auto-scroll tracking
- **Smart Audio Controls**: Auto-scroll follows audio playback, with "Resume Tracking" button when you scroll away
- **Reading Position Tracking**: Automatically saves your place and offers "Continue Reading" on the home page
- **Smart Navigation**: Dropdown navigation from header with testament tabs, expandable book lists, and chapter grids
- **Font Options**: Choose from Serif, Modern Serif, Sans Serif, or Monospace (JetBrains Mono)
- **Dark/Light Mode**: System-aware theme switching with smooth transitions
- **Mobile-First Design**: Responsive layout optimized for all devices
- **Book Headings**: Visual separators between books with cover images and testament transitions
- **Clean Interface**: Minimal, distraction-free reading experience with fixed header

## Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **React Router v7** for navigation
- **Tailwind CSS v4** for styling
- **Radix UI** for accessible components
- **vite-plugin-pwa** for Progressive Web App support
- **Workbox** for service worker and caching strategies
- **Intersection Observer API** for scroll tracking
- **HTML5 Audio API** for synchronized narration

## Project Structure

```
ortho-bible/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── audio-player.tsx
│   │   ├── audio-toggle.tsx
│   │   ├── book-navigation.tsx
│   │   ├── font-toggle.tsx
│   │   ├── theme-toggle.tsx
│   │   └── logo.tsx
│   ├── data/            # Bible text and metadata
│   │   ├── new-testament/
│   │   ├── old-testament/
│   │   └── bibleBooks.ts
│   ├── pages/           # Route pages
│   │   ├── Home.tsx
│   │   └── ChapterView.tsx
│   └── lib/             # Utilities
├── public/
│   └── audio-timings/   # Audio synchronization data
└── scripts/
    └── parse-transcript.js  # YouTube transcript parser
```

## Data Format

### Chapter Text
Bible chapters are stored as MDX files with verses formatted as:

```
1. In the beginning God created the heavens and the earth.
2. The earth was without form, and void...
```

### Audio Timings
Audio synchronization data stored as JSON:

```json
{
  "audioFile": "titus.m4a",
  "chapters": {
    "1": {
      "verses": [
        { "number": 1, "start": 3 },
        { "number": 2, "start": 13 }
      ]
    }
  }
}
```

## How It Works

1. **Bible Data**: NKJV text organized by testament/book/chapter in `src/data/`
2. **Metadata**: `src/data/bibleBooks.ts` catalogs all 66 books with chapter counts
3. **Routing**: URLs follow pattern `/:testament/:book/:chapter` (e.g., `/new/john/3`)
4. **Infinite Scroll**: Intersection Observer tracks visibility and loads adjacent chapters dynamically (max 7 chapters in memory)
5. **URL Sync**: `history.replaceState()` updates URL as you scroll without reloading
6. **Audio Sync**: Timestamps map verses to audio playback position for real-time highlighting
7. **Reading Position**: localStorage saves last read chapter for "Continue Reading" feature
8. **Theme & Font**: Preferences persisted in localStorage and applied via CSS classes

## Development

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` to view the app. The PWA service worker is enabled in development mode.

## Building for Production

```bash
npm run build
npm run preview
```

The build process generates:
- Optimized static files in `dist/`
- Service worker with precaching for offline support
- Web app manifest for PWA installation
- Compressed assets with gzip analysis

## Current Status

- ✅ All 27 New Testament books available
- ✅ 41 Old Testament books available (including deuterocanonical)
- ✅ Continuous infinite scroll reading
- ✅ Audio narration with synchronized highlighting and auto-scroll tracking
- ✅ Reading position tracking and auto-resume
- ✅ Progressive Web App with offline support
- ✅ Installable on mobile and desktop devices
- ⏳ Some books show "Coming Soon" (data not yet added)
- 📖 Total: 1,202+ chapters available

## PWA Installation

### Mobile (iOS/Android)
1. Open the app in Safari (iOS) or Chrome (Android)
2. Tap the install prompt that appears at the bottom
3. Or use browser's "Add to Home Screen" option
4. App icon will appear on your home screen

### Desktop (Chrome/Edge)
1. Look for the install icon in the address bar
2. Click "Install" when prompted
3. App opens in its own window

### Offline Features
- **Bible Text**: Entire Bible cached automatically (CacheFirst strategy, 1 year)
- **Images**: App icons and images cached for 30 days
- **Audio Timings**: Synchronization data cached for 30 days
- **Audio Files**: Available online only (manual download per book - coming soon)

## Roadmap

### V2 Data Format
- [ ] Migrate from MDX to JSON format for verse-level addressing
- [ ] Enable direct verse linking (e.g., `/new/john/3#16`)
- [ ] Support for cross-references between verses
- [ ] Footnotes and study notes per verse
- [ ] Better structure for search functionality

### Features
- [ ] Manual audio download for offline listening
- [ ] Search across all books and chapters
- [ ] Multiple Bible translations (NKJV, KJV, ESV, etc.)
- [ ] Verse sharing with copy/link functionality
- [ ] Bookmarks and highlights with sync
- [ ] Reading plans and daily devotionals
- [ ] Audio narration for all books (currently limited availability)
- [ ] Adjustable audio playback speed
- [ ] Scripture memory/flashcards
- [ ] Reading statistics and streaks

### Technical Improvements
- [ ] Full test coverage
- [ ] Performance optimization for very long scroll sessions
- [ ] Better scroll position preservation during chapter unload
- [ ] Accessibility audit and improvements

## Notes

- Chapter keys use `::` separator to support books with numbers (e.g., `new::1-john::1`)
- Audio player appears at bottom of screen when audio is available for current book
- Audio auto-scroll can be toggled; "Resume Tracking" button appears when manually scrolling
- Reading position auto-saves as you scroll using Intersection Observer
- Home page shows minimal centered design with logo and "Continue Reading" button
- First-time users see feature highlights; returning users see continue reading
- PWA install prompt appears on first visit (can be dismissed)
- Service worker automatically updates app when new version is available
- Hebrews stored in `src/data/old-testament/` but displays in New Testament navigation

## Browser Support

- **Chrome/Edge**: Full PWA support with installation and offline features
- **Safari (iOS)**: Full PWA support with "Add to Home Screen"
- **Firefox**: Offline support, limited PWA installation UI
- **Modern browsers**: All core reading features work without installation
