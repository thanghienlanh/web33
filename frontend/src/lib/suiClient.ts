import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";

/**
 * Sui Client Configuration
 * Mặc định sử dụng testnet
 */
export const SUI_NETWORK = "testnet" as const;

/**
 * Tạo Sui client instance
 * @param network - Network name (testnet/mainnet/devnet)
 */
export function createSuiClient(network: string = SUI_NETWORK): SuiClient {
  return new SuiClient({
    url: getFullnodeUrl(network as "testnet" | "mainnet" | "devnet"),
  });
}

/**
 * Default Sui client instance
 */
export const suiClient = createSuiClient(SUI_NETWORK);
