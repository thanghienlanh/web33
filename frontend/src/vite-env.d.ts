/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RPC_URL?: string;
  readonly VITE_WALLET_CONNECT_PROJECT_ID?: string;
  readonly VITE_SUI_NETWORK?: "testnet" | "mainnet" | "devnet";
  readonly VITE_SUI_PACKAGE_ID?: string; // Sui Move package ID cho NFT
  readonly VITE_TREASURY_ID?: string;
  readonly VITE_RANDOM_ID?: string;
  readonly VITE_LOOTBOX_PRICE?: string;
  readonly VITE_LOOTBOX_PRICE_SUI?: string;
  readonly VITE_AI_SERVICE_URL?: string;
  readonly VITE_IPFS_API_URL?: string; // IPFS API URL (default: http://localhost:3001/api/ipfs)
  readonly VITE_API_URL?: string; // Backend API URL (default: http://localhost:3001/api)
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
