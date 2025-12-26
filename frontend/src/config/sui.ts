import { getFullnodeUrl } from "@mysten/sui/client";
import { SuiClient } from "@mysten/sui/client";

// Sui Network Configuration
export const SUI_NETWORKS = {
  testnet: {
    name: "Sui Testnet",
    url: getFullnodeUrl("testnet"),
  },
  mainnet: {
    name: "Sui Mainnet",
    url: getFullnodeUrl("mainnet"),
  },
  devnet: {
    name: "Sui Devnet",
    url: getFullnodeUrl("devnet"),
  },
} as const;

// Default network (có thể thay đổi qua env variable)
const network =
  (import.meta.env.VITE_SUI_NETWORK as keyof typeof SUI_NETWORKS) || "testnet";

export const suiConfig = {
  networks: SUI_NETWORKS,
  defaultNetwork: network,
  features: ["sui:signAndExecuteTransactionBlock"],
};

// Create Sui client
export const getSuiClient = (
  networkName: keyof typeof SUI_NETWORKS = network
) => {
  return new SuiClient({ url: SUI_NETWORKS[networkName].url });
};

