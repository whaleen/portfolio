# shadcn-solana

Solana components built with [shadcn/ui](https://ui.shadcn.com/) primitives.

## Installation

```bash
npx shadcn-solana add wallet-connect
```

## Available Components

- `wallet-connect` - Complete wallet connection with modal and balance display
- `network-selector` - Solana network selector (Mainnet, Testnet, Devnet)
- `settings-sheet` - Solana settings panel for RPC, API keys, and connection preferences

## Requirements

- A project with [shadcn/ui](https://ui.shadcn.com/) already set up
- React 18+
- Next.js 13+ or Vite

## Components

### Wallet Connect

Complete wallet connection system with multi-wallet support and balance display.

#### Installation

```bash
npx shadcn-solana add wallet-connect
```

#### Basic Usage

```tsx
import { SolanaWalletProvider } from '@/components/wallet-provider'
import { WalletConnectButton } from '@/components/wallet-connect-button'

export default function App() {
  return (
    <SolanaWalletProvider>
      <WalletConnectButton />
    </SolanaWalletProvider>
  )
}
```

#### Advanced Usage

```tsx
import { SolanaWalletProvider } from '@/components/wallet-provider'
import { WalletConnectButton } from '@/components/wallet-connect-button'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'

export default function App() {
  return (
    <SolanaWalletProvider
      network={WalletAdapterNetwork.Mainnet}
      autoConnect={true}
    >
      <div className='flex items-center gap-4'>
        <h1>My Solana App</h1>
        <WalletConnectButton className='ml-auto' />
      </div>
    </SolanaWalletProvider>
  )
}
```

### Network Selector

Switch between Solana networks (Mainnet, Testnet, Devnet) with a clean dropdown interface.

#### Installation

```bash
npx shadcn-solana add network-selector
```

#### Basic Usage

```tsx
import { NetworkSelector } from '@/components/network-selector'

export default function App() {
  return <NetworkSelector />
}
```

#### With State Management

```tsx
import { NetworkSelector, useNetwork } from '@/components/network-selector'
import { SolanaWalletProvider } from '@/components/wallet-provider'

export default function App() {
  const { network, setNetwork, endpoint } = useNetwork()

  return (
    <SolanaWalletProvider
      network={network}
      endpoint={endpoint}
    >
      <div className='flex items-center gap-4'>
        <NetworkSelector
          value={network}
          onValueChange={setNetwork}
        />
        <WalletConnectButton />
      </div>
    </SolanaWalletProvider>
  )
}
```

#### Props

- `value` - Current network (controlled)
- `onValueChange` - Network change callback
- `className` - Additional CSS classes
- `showBadge` - Show network badge (default: true)

### Settings Sheet

Configuration panel for RPC endpoints, API keys, and connection preferences.

#### Installation

```bash
npx shadcn-solana add settings-sheet
```

#### Basic Usage

```tsx
import { SettingsSheet } from '@/components/settings-sheet'

export default function App() {
  return <SettingsSheet />
}
```

#### With State Management

```tsx
import { SettingsSheet, useSolanaSettings } from '@/components/settings-sheet'
import { SolanaWalletProvider } from '@/components/wallet-provider'

export default function App() {
  const settings = useSolanaSettings()

  return (
    <SolanaWalletProvider
      endpoint={settings.rpcUrl}
      autoConnect={settings.autoConnect}
    >
      <div className='flex items-center gap-4'>
        <h1>My App</h1>
        <SettingsSheet {...settings} />
        <WalletConnectButton />
      </div>
    </SolanaWalletProvider>
  )
}
```

#### Advanced Usage (Custom Storage)

```tsx
import { SettingsSheet } from '@/components/settings-sheet'

export default function App() {
  const [rpcUrl, setRpcUrl] = useState(myCustomRpc)
  const [apiKey, setApiKey] = useState('')

  return (
    <SettingsSheet
      rpcUrl={rpcUrl}
      onRpcUrlChange={(url) => {
        setRpcUrl(url)
        // Update your connection provider
      }}
      heliusApiKey={apiKey}
      onHeliusApiKeyChange={(key) => {
        setApiKey(key)
        // Store securely (not in localStorage)
      }}
    />
  )
}
```

#### Props

- `rpcUrl` - Current RPC endpoint
- `onRpcUrlChange` - RPC URL change callback
- `heliusApiKey` - Helius API key
- `onHeliusApiKeyChange` - API key change callback
- `autoConnect` - Auto-connect wallet setting
- `onAutoConnectChange` - Auto-connect change callback
- `commitment` - Transaction commitment level
- `onCommitmentChange` - Commitment change callback

## Usage Commands

```bash
# Add specific component
npx shadcn-solana add wallet-connect
npx shadcn-solana add network-selector
npx shadcn-solana add settings-sheet

# List all available components
npx shadcn-solana list
```

## Complete Example

Here's a complete example using all three components together:

```tsx
// app/layout.tsx
import { SolanaWalletProvider } from '@/components/wallet-provider'
import { useSolanaSettings } from '@/components/settings-sheet'

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <AppWithProviders>{children}</AppWithProviders>
      </body>
    </html>
  )
}

function AppWithProviders({ children }) {
  const settings = useSolanaSettings()

  return (
    <SolanaWalletProvider
      endpoint={settings.rpcUrl}
      autoConnect={settings.autoConnect}
    >
      {children}
    </SolanaWalletProvider>
  )
}
```

```tsx
// app/page.tsx
import { WalletConnectButton } from '@/components/wallet-connect-button'
import { NetworkSelector, useNetwork } from '@/components/network-selector'
import { SettingsSheet, useSolanaSettings } from '@/components/settings-sheet'

export default function Home() {
  const { network, setNetwork } = useNetwork()
  const settings = useSolanaSettings()

  return (
    <main className='container mx-auto p-8'>
      <div className='flex items-center justify-between mb-8'>
        <h1 className='text-2xl font-bold'>My Solana App</h1>
        <div className='flex items-center gap-4'>
          <NetworkSelector
            value={network}
            onValueChange={setNetwork}
          />
          <SettingsSheet {...settings} />
          <WalletConnectButton />
        </div>
      </div>

      {/* Your app content */}
    </main>
  )
}
```

## License

MIT
