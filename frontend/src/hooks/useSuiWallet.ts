import { useCurrentWallet, useSuiClient } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";

/**
 * Custom hook để quản lý Sui wallet state
 */
export function useSuiWallet() {
  const { currentWallet, isConnected, connectionStatus } = useCurrentWallet();
  const client = useSuiClient();
  const address = currentWallet?.accounts[0]?.address;

  // Get balance
  const { data: balance } = useQuery({
    queryKey: ["sui-balance", address],
    queryFn: async () => {
      if (!address) return null;
      const balance = await client.getBalance({
        owner: address,
      });
      return balance;
    },
    enabled: !!address && isConnected,
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  const balanceFormatted = balance
    ? (Number(balance.totalBalance) / 1e9).toFixed(4)
    : "0";

  return {
    address,
    isConnected,
    balance: balanceFormatted,
    wallet: currentWallet,
    connectionStatus,
    client,
  };
}

