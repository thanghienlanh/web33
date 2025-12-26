import { useAccount, useBalance, useChainId } from "wagmi";
import { formatEther } from "viem";

/**
 * Custom hook để quản lý wallet state
 */
export function useWallet() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({
    address,
    query: {
      enabled: isConnected,
    },
  });

  const isCorrectNetwork = chainId === 1337;
  const balanceFormatted = balance ? formatEther(balance.value) : "0";

  return {
    address,
    isConnected,
    isCorrectNetwork,
    balance: balanceFormatted,
    chainId,
  };
}
