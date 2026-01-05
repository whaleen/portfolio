# Bump GUI

A web interface for managing automated token bumping on Solana using pump.fun. This project provides a user-friendly dashboard for creating and managing bump operations, monitoring transactions, and collaborating with other users.

![Static Badge](https://img.shields.io/badge/solana-mainnet-success)
![GitHub License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-in%20development-orange)

## Features

- 🔐 Wallet authentication (Phantom, Solflare, etc..)
- 📊 Token analytics and price tracking
- 🤖 Automated bump creation and management
- 👥 Multi-user contribution system
- 📈 Transaction history and analytics
- 🌓 Light/dark mode support
- 💻 Responsive design

## Development Setup

### Prerequisites

- Node.js >= 18
- PostgreSQL database
- Solana RPC endpoint (Helius, QuickNode, etc.)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/bump-gui.git
cd bump-gui
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/bump_gui"
VITE_RPC_URL="your-solana-rpc-url"
```

4. Set up the database:

```bash
npx prisma db push
```

5. Start the development server:

```bash
npm run dev
```

## Project Structure

```
src/
├── components/              # React components
│   ├── bump/               # Bump-related components
│   ├── token/              # Token-related components
│   ├── dashboard/          # Dashboard components
│   └── shared/             # Shared/common components
├── hooks/                  # Custom React hooks
├── services/              # API and service functions
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## Implementation Status

### ✅ Completed

#### Authentication & Setup

- [x] Wallet connection
- [x] Basic routing structure
- [x] Theme switching
- [x] Responsive layout

#### Components

- [x] TokenProfile
- [x] BumpProfile
- [x] BumpManagement
- [x] UserDashboard
- [x] Transaction History
- [x] CreateBump form

### 🚧 In Progress

#### Backend Integration

- [ ] Database schema implementation
- [ ] API endpoints
- [ ] Prisma client setup

#### Frontend Features

- [ ] Real-time transaction updates
- [ ] Token price charts
- [ ] Contribution flow
- [ ] Error boundaries

### 📋 Planned

#### Features

- [ ] Email notifications
- [ ] Advanced bump strategies
- [ ] Bulk operations
- [ ] Analytics dashboard
- [ ] Activity logs
- [ ] User preferences

#### Technical

- [ ] Unit tests
- [ ] E2E tests
- [ ] CI/CD setup
- [ ] Documentation
- [ ] Performance optimization

## Deployment

### Prerequisites

- Vercel account or similar hosting
- PostgreSQL database (production)
- Solana RPC endpoint (production)

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables:
   - `DATABASE_URL`
   - `VITE_RPC_URL`
4. Deploy

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[MIT License](LICENSE)

## Acknowledgments

- [pump.fun](https://pump.fun) - Core functionality
- [DaisyUI](https://daisyui.com/) - UI components
- [@solana/web3.js](https://solana-labs.github.io/solana-web3.js/) - Solana integration

## Support

For support, join our [Discord community](https://discord.gg/nothingdao) or open an issue.
