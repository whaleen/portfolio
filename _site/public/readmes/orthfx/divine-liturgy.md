# Divine Liturgy of St. John Chrysostom Reader

A responsive web application for reading the Divine Liturgy of St. John Chrysostom with Church Slavonic text, English translation, and transliteration.

## Features

- **Parallel Text Display**: Side-by-side Church Slavonic and English text on desktop
- **Transliteration**: Automatic transliteration of Church Slavonic using scientific notation
- **Responsive Design**: Optimized layouts for both desktop (two-column) and mobile (stacked)
- **Dark/Light Mode**: Theme toggle with system preference support
- **Beautiful Typography**: Noto Serif for Slavonic and Crimson Pro for English
- **Speaker Attribution**: Color-coded roles (Priest, Deacon, Choir, People, Reader)
- **Liturgical Rubrics**: Ceremonial instructions displayed inline

## Technology Stack

- **Vite** - Fast build tool and dev server
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first styling
- **shadcn/ui** - High-quality UI components
- **next-themes** - Dark mode support

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/                      # shadcn/ui base components
│   ├── layout/                  # Layout and theme components
│   │   ├── Header.tsx
│   │   ├── Layout.tsx
│   │   └── ThemeProvider.tsx
│   └── liturgy/                 # Liturgy-specific components
│       ├── ParallelTextBlock.tsx
│       └── LiturgySection.tsx
├── data/
│   ├── liturgy/
│   │   ├── types.ts             # TypeScript interfaces
│   │   ├── sections/            # Liturgy content files
│   │   └── index.ts
│   └── transliteration/
│       ├── mapping.ts           # Cyrillic → Latin mapping
│       └── transliterate.ts     # Conversion function
├── lib/
│   └── utils.ts                 # Utility functions
├── App.tsx                      # Main application
└── index.css                    # Global styles and theme

```

## Adding Content

To add more liturgical content:

1. Create a new file in `src/data/liturgy/sections/`
2. Follow the `LiturgySection` interface defined in `types.ts`
3. Import and add to the `liturgySections` array in `src/data/liturgy/index.ts`

Example structure:

```typescript
export const mySection: LiturgySection = {
  id: 'unique-id',
  order: 1,
  title: {
    slavonic: 'Славянский текст',
    english: 'English Translation',
  },
  subsections: [
    {
      id: 'subsection-id',
      title: { slavonic: '...', english: '...' },
      blocks: [
        {
          id: 'block-id',
          speaker: 'priest',
          content: {
            slavonic: '...',
            english: '...',
          },
        },
      ],
    },
  ],
}
```

## Transliteration System

The app uses scientific transliteration (ISO 9 based) with special characters:

- ѣ → ě (yat)
- ѫ → ǫ (big yus)
- ѳ → th (fita)
- ж → ž, ч → č, ш → š, щ → šč

## Responsive Breakpoints

- **Desktop (≥1024px)**: Two-column parallel text
- **Mobile (<1024px)**: Stacked layout (Slavonic → Transliteration → English)

## License

This project is for educational and liturgical use.

## Sources for Liturgical Texts

- Holy Trinity Orthodox Mission (holytrinity.org)
- Orthodox Church in America (oca.org)
- Greek Orthodox Archdiocese of America
- Antiochian Orthodox Christian Archdiocerate
