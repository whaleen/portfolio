# Token Scanner App

A React-based application for monitoring and analyzing tokens on the Solana blockchain, integrating with DexScreener, Helius, and wallet services.

## Features

- Real-time token profile monitoring
- Token holder analysis with visualization
- Trading pair information and statistics
- Wallet integration via Phantom
- Theme switching (Light/Dark/System)
- User settings management with Helius API key storage

## Tech Stack

- **Frontend**: React with Vite
- **Styling**: TailwindCSS + DaisyUI
- **State Management**: React Context
- **Charts**: Recharts
- **Database**: PostgreSQL (via Neon)
- **Deployment**: Netlify with Serverless Functions
- **APIs**:
  - DexScreener API
  - Helius RPC API
  - Solana Web3.js

## Project Structure

```
├── src/
│   ├── components/        # React components
│   │   ├── shared/       # Reusable components
│   │   ├── token-details/# Token detail views
│   │   └── token-profiles/# Token profile components
│   ├── contexts/         # React context providers
│   ├── hooks/           # Custom React hooks
│   │   ├── api/         # API integration hooks
│   │   └── features/    # Feature-specific hooks
│   ├── services/        # API services
│   └── utils/           # Utility functions
├── backend/             # Backend API routes
└── netlify/             # Netlify serverless functions
```

## Setup and Development

### Prerequisites

1. Node.js and npm installed
2. Netlify CLI installed globally:
   ```bash
   npm install -g netlify-cli
   ```
3. A Neon PostgreSQL database
4. A Helius API key (for token data)

### Initial Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env`:
   ```
   DATABASE_URL=your_neon_db_url
   ```
4. Link to your Netlify project (if not already linked):
   ```bash
   netlify link
   ```

### Local Development

To run the application locally, you need to use Netlify Dev to ensure the serverless functions work properly:

1. Start the Netlify development server:

   ```bash
   netlify dev
   ```

   This will:

   - Start the Vite development server
   - Serve the Netlify functions locally
   - Handle API redirects
   - Make the app available at `http://localhost:8888`

2. If you need to run the development server with specific environment variables:
   ```bash
   netlify dev --env .env.local
   ```

### Database Setup

1. Initialize the database with the schema:
   ```sql
   psql -d your_database_name -f backend/init.sql
   ```

The schema creates:

- `users`: Stores wallet addresses and login timestamps
- `user_settings`: Stores user preferences and API keys

## API Integration

### DexScreener API

- Token profiles fetching
- Trading pair information
- Order tracking

### Helius API

- Token metadata retrieval
- Token holder analysis
- Account information

### Netlify Functions

Located in `netlify/functions/`:

- `settings.js`: Handles user settings and Helius API key management
- API endpoints accessible via `/.netlify/functions/` or `/api/` routes

## Deployment

1. Ensure your Netlify site is configured:

   ```bash
   netlify init
   ```

2. Deploy to Netlify:
   ```bash
   netlify deploy
   ```

For production deployment:

```bash
netlify deploy --prod
```

## Architecture

- **Frontend**: Single-page application with component-based architecture
- **Backend**: Serverless functions for API endpoints and database operations
- **State Management**: Combination of React Context and local component state
- **Data Flow**: Services → Hooks → Components

## Security Considerations

- Helius API keys are stored securely in the database
- Wallet connections use Phantom's secure protocol
- Database SSL encryption enabled
- CORS policies implemented for API endpoints

## Development Guidelines

1. Use `antd` components with DaisyUI styling
2. Implement proper error handling and loading states
3. Follow the existing file structure
4. Use TypeScript for new components when possible

## Available Scripts

- `netlify dev`: Start local development environment (recommended)
- `npm run dev`: Start Vite development server only (limited functionality)
- `npm run build`: Build for production
- `npm run preview`: Preview production build

## Troubleshooting

Common issues:

1. **Settings not working locally**: Ensure you're running `netlify dev` instead of `npm run dev`
2. **Database connection issues**: Verify your DATABASE_URL in environment variables
3. **API 404 errors**: Check that Netlify function redirects are properly configured

## Contributing

1. Create a feature branch
2. Make changes
3. Test with `netlify dev`
4. Submit a pull request with detailed description

## License

MIT License

---

new shit

# DEX Screener Companion

A real-time Solana token analytics dashboard that integrates with DEX Screener and Helius APIs to provide comprehensive token data and market insights.

## Features

- Real-time token profile monitoring
- Market statistics and trading pair analysis
- Token holder distribution analytics
- Integration with multiple data sources (DEX Screener, Helius)
- Wallet connection support
- Dark/Light theme switching
- Responsive design

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- DaisyUI
- Vite
- Netlify Functions
- Neon Database
- Solana Web3.js

## Prerequisites

- Node.js 16+
- npm or yarn
- Helius API key
- PostgreSQL database

## Environment Variables

```bash
DATABASE_URL=your_neon_db_url
```

## Development

1. Install dependencies:

```bash
npm install
```

2. Run development server:

```bash
npm run dev
```

3. Run Netlify Functions locally:

```bash
netlify dev
```

## Project Structure

```
├── backend/          # Express backend (optional)
├── netlify/          # Serverless functions
├── public/           # Static assets
└── src/
    ├── components/   # React components
    ├── contexts/     # React contexts
    ├── hooks/        # Custom hooks
    ├── services/     # API services
    ├── types/        # TypeScript types
    └── utils/        # Utility functions
```

## Build & Deployment

```bash
npm run build
```

Deployment is handled automatically through Netlify CI/CD.

## File Extensions

- React components use `.tsx`
- Configuration files use `.cjs` for CommonJS modules
- Utility files use `.ts`
- Style files use `.css`

## API Integration

The app integrates with:

- DEX Screener API for market data
- Helius API for on-chain data
- Neon Database for user settings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

MIT
