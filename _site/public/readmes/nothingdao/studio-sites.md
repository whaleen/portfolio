# Studio Sites - Jupiter Ecosystem Brand Builder

A proof-of-concept platform for Jupiter Studio token projects to create professional profile websites and establish their brand presence in the Solana ecosystem.

## Project Overview

Studio Sites is a speculative design for an additional product offering that Jupiter could provide to token project owners launched through Jupiter Studio (their launchpad similar to pump.fun). This platform enables Solana token projects to create customizable profile websites, giving them a broader foundation for establishing their brand in the ecosystem.

## Target Audience

**Primary**: Jupiter presentation and product strategy team
**Secondary**: Solana token project creators seeking professional web presence

## Key Features

- **Solana Wallet Authentication**: Projects connect using their Solana wallet (no traditional signup required)
- **Token-Centric Profiles**: Automatically fetch on-chain and off-chain token metadata from contract addresses
- **Professional Templates**: Clean, Twitter-like profile layouts optimized for token projects
- **Custom URLs**: Each project gets `jupiter-sites.ndao.computer/{username}` for their brand
- **Social Integration**: Support for X.com (Twitter), Discord, and Telegram links
- **One-Click Deployment**: Instant publishing to web with Netlify hosting

## Technical Architecture

- **Frontend**: React 19 + TypeScript + Vite
- **UI Framework**: shadcn/ui with Tailwind CSS
- **Solana Integration**: @jup-ag/api + Helius SDK for token data
- **Wallet Components**: shadcn-solana for authentication
- **Database**: Supabase PostgreSQL (custom auth, no Supabase Auth)
- **Deployment**: Netlify with path-based routing
- **Token Data**: Real-time on-chain data via Helius, off-chain metadata from IPFS

## Development Phases

### Phase 1: Core Infrastructure ✅
- Solana wallet integration
- Supabase database setup
- Local token storage session management
- Basic Twitter-like profile template

### Phase 2: Token Integration 🔄
- Contract address input and validation
- Helius SDK integration for on-chain data
- Off-chain metadata fetching (IPFS/Arweave)
- Token data display (name, symbol, supply, description)

### Phase 3: Profile Publishing 📋
- Username claiming system
- Path-based routing at `jupiter-sites.ndao.computer/{username}`
- Dynamic profile rendering
- Netlify Functions for CORS handling

### Phase 4: Social & SEO 📋
- Social platform integration (X, Discord, Telegram)
- Open Graph tags for social sharing
- Basic meta tags for SEO

## Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn
- Supabase account (for database)

### Installation

```bash
git clone https://github.com/nothingdao/studio-sites
cd studio-sites
npm install
npm run dev
```

### Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_HELIUS_API_KEY=your_helius_api_key
```

## Database Schema

- **users**: Wallet addresses and basic profile info
- **profiles**: Token contracts, usernames, customizations, publication status
- **templates**: Available profile templates and configurations

## Deployment

The application is deployed to Netlify with automatic builds from the main branch.

**Live Demo**: [Deployed URL when available]

## Value Proposition for Jupiter

1. **Revenue Stream**: Additional service offering for Jupiter Studio projects
2. **Ecosystem Growth**: Better brand presence = stronger token projects = healthier ecosystem  
3. **Network Effects**: More professional projects attract more creators to Jupiter Studio
4. **Data Insights**: Understanding project branding needs and success patterns