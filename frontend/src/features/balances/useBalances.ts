import { useQuery } from "@tanstack/react-query";
import { useSuiClient } from "@mysten/dapp-kit";
import { COIN_TYPE_SUI, COIN_TYPE_STSUI } from "../../lib/coinTypes";

/**
 * Balance data structure
 */
export interface BalanceData {
  sui: string; // Balance in SUI (formatted)
  stSui: string; // Balance in stSUI (formatted)
  suiRaw: bigint; // Raw balance in MIST
  stSuiRaw: bigint; // Raw balance in MIST
}

/**
 * Hook để lấy balances (SUI và stSUI)
 * @param address - Wallet address
 */
export function useBalances(address: string | undefined) {
  const client = useSuiClient();

  const { data, isLoading, error, refetch } = useQuery<BalanceData>({
    queryKey: ["balances", address],
    queryFn: async () => {
      if (!address) {
        throw new Error("Address is required");
      }

      // Lấy SUI balance
      const suiBalance = await client.getBalance({
        owner: address,
        coinType: COIN_TYPE_SUI,
      });

      // Lấy stSUI balance
      // Lưu ý: Nếu token không tồn tại, sẽ trả về balance = 0
      let stSuiBalance;
      try {
        stSuiBalance = await client.getBalance({
          owner: address,
          coinType: COIN_TYPE_STSUI,
        });
      } catch (error) {
        // Nếu coin type không hợp lệ, trả về balance = 0
        console.warn("Failed to fetch stSUI balance:", error);
        stSuiBalance = { totalBalance: "0" };
      }

      // Convert từ MIST sang SUI (1 SUI = 10^9 MIST)
      const suiAmount = BigInt(suiBalance.totalBalance);
      const stSuiAmount = BigInt(stSuiBalance.totalBalance);

      const suiFormatted = formatBalance(suiAmount);
      const stSuiFormatted = formatBalance(stSuiAmount);

      return {
        sui: suiFormatted,
        stSui: stSuiFormatted,
        suiRaw: suiAmount,
        stSuiRaw: stSuiAmount,
      };
    },
    enabled: !!address,
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Format balance từ MIST sang SUI
 * @param balance - Balance in MIST (bigint)
 * @param decimals - Number of decimals (default: 9 for SUI)
 */
function formatBalance(balance: bigint, decimals: number = 9): string {
  const divisor = BigInt(10 ** decimals);
  const whole = balance / divisor;
  const remainder = balance % divisor;

  if (remainder === BigInt(0)) {
    return whole.toString();
  }

  // Format với 4 chữ số thập phân
  const remainderStr = remainder.toString().padStart(decimals, "0");
  const decimalPart = remainderStr.slice(0, 4).replace(/0+$/, "");

  return decimalPart ? `${whole}.${decimalPart}` : whole.toString();
}
