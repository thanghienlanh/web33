import { createConfig, http } from 'wagmi'
import { defineChain } from 'viem'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

// Define localhost chain for Hardhat
const localhost = defineChain({
  id: 1337,
  name: 'Localhost',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: [import.meta.env.VITE_RPC_URL || 'http://127.0.0.1:8545'],
    },
  },
})

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || ''

export const config = createConfig({
  chains: [localhost],
  connectors: [
    injected(),
    metaMask(),
    ...(projectId ? [walletConnect({ projectId })] : []),
  ],
  transports: {
    [localhost.id]: http(import.meta.env.VITE_RPC_URL || 'http://127.0.0.1:8545'),
  },
})

