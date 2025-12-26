import { useState } from "react";
import {
  useCurrentWallet,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

const FEE_AMOUNT_MIST = BigInt(100_000_000); // 0.1 SUI

/**
 * Gọi Move contract generation_fee::pay_fee để thu phí trước khi generate ảnh.
 * Yêu cầu:
 * - VITE_SUI_PACKAGE_ID: Package chứa module generation_fee
 * - VITE_FEE_CONFIG_ID: Object ID của FeeConfig (shared)
 */
export function usePayGenerationFee() {
  const { currentWallet } = useCurrentWallet();
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction();

  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const PACKAGE_ID = import.meta.env.VITE_SUI_PACKAGE_ID || "";
  const FEE_CONFIG_ID = import.meta.env.VITE_FEE_CONFIG_ID || "";

  const payGenerationFee = async (): Promise<string> => {
    // Nếu không có FEE_CONFIG_ID, bỏ qua payment (free mode)
    if (!FEE_CONFIG_ID) {
      console.log("Fee payment disabled - using free mode");
      return "free_mode";
    }

    if (!currentWallet) {
      throw new Error("Vui lòng kết nối ví Sui trước khi tạo ảnh.");
    }
    if (!PACKAGE_ID) {
      throw new Error("Thiếu cấu hình PACKAGE_ID. Hãy cập nhật .env.local.");
    }

    setIsPaying(true);
    setError(null);

    try {
      const txb = new Transaction();

      // Tạo coin 0.1 SUI từ gas coin
      const feeCoin = txb.splitCoins(txb.gas, [txb.pure(FEE_AMOUNT_MIST)]);

      txb.moveCall({
        target: `${PACKAGE_ID}::generation_fee::pay_fee`,
        arguments: [txb.object(FEE_CONFIG_ID), feeCoin],
      });

      const result = await signAndExecuteTransaction({
        transaction: txb,
      });

      setIsPaying(false);
      return result.digest;
    } catch (err: any) {
      const wrapped =
        err instanceof Error
          ? err
          : new Error("Thanh toán phí thất bại, vui lòng thử lại.");
      setError(wrapped);
      setIsPaying(false);
      throw wrapped;
    }
  };

  return { payGenerationFee, isPaying, error };
}
