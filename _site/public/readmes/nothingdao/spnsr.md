# spnsr

Donation badges for Solana projects. Embeddable React component and static badges for accepting SOL donations.

**Live**: [spnsr.ndao.computer](https://spnsr.ndao.computer)

## Install

```bash
npm install spnsr
```

## Usage

### React Component

```jsx
import { Spnsr } from 'spnsr'
;<Spnsr projectId='your-project-id' />
```

### Static Badge

```markdown
[![Support](https://spnsr.ndao.computer/.netlify/functions/badge/your-project-id)](https://spnsr.ndao.computer/project/your-project-id)
```

## Component Props

```jsx
<Spnsr
  projectId='abc123' // Required
  theme='default' // 'default' | 'dark' | 'minimal'
  size='md' // 'sm' | 'md' | 'lg'
  showAmount={true} // Show raised amount
  showGoal={false} // Show progress bar
  className='custom-class' // Additional CSS
/>
```

## Getting Project ID

1. Go to [spnsr.ndao.computer](https://spnsr.ndao.computer)
2. Connect Solana wallet
3. Create project
4. Copy project ID from dashboard

## How It Works

- Click badge to open donation interface
- Connects to Phantom, Solflare, and other Solana wallets
- Donations sent directly to your wallet address
- Badge updates automatically with new totals

## Development

See [DEVELOPMENT.md](./DEVELOPMENT.md) for setup instructions.

## Tech Stack

- Frontend: React + TypeScript + Vite
- Backend: Netlify Functions
- Database: PostgreSQL + Prisma
- Blockchain: Solana Web3.js
- Hosting: Netlify

## Repository

- **GitHub**: [github.com/nothingdao/spnsr](https://github.com/nothingdao/spnsr)
- **NPM**: [npmjs.com/package/spnsr](https://npmjs.com/package/spnsr)

## License

MIT
