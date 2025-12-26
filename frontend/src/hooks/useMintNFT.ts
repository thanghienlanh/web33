import { useState } from "react";
import {
  useSuiClient,
  useCurrentWallet,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

/**
 * NFT Metadata structure
 */
export interface NFTMetadata {
  name: string;
  description: string;
  image: string; // IPFS URL, base64, or URL
  modelType?: string;
  ipfsHash?: string;
  royaltyPercentage?: number;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

/**
 * Hook để mint NFT trên Sui
 *
 * LƯU Ý: Cần có Sui Move package để mint NFT thực sự.
 * Hiện tại đây là template, cần implement theo package cụ thể của bạn.
 */
export function useMintNFT() {
  const client = useSuiClient();
  const { currentWallet } = useCurrentWallet();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [txDigest, setTxDigest] = useState<string | null>(null);
  const [mintedObjectId, setMintedObjectId] = useState<string | null>(null);

  // Package ID - CẦN CẬP NHẬT sau khi deploy Sui Move package
  // Lấy từ: sui client publish
  const PACKAGE_ID = import.meta.env.VITE_SUI_PACKAGE_ID || "";

  const mintNFT = async (
    metadata: NFTMetadata
  ): Promise<{
    txDigest: string;
    objectId: string;
  }> => {
    if (!currentWallet) {
      throw new Error("Wallet not connected");
    }

    setIsMinting(true);
    setError(null);
    setTxDigest(null);
    setMintedObjectId(null);

    return new Promise((resolve, reject) => {
      try {
        // Kiểm tra Package ID
        if (!PACKAGE_ID) {
          const error = new Error(
            "Chưa cấu hình PACKAGE_ID.\n\n" +
              "Cách khắc phục:\n" +
              "1. Deploy Sui Move package:\n" +
              "   cd sui-contracts\n" +
              "   sui move build\n" +
              "   sui client publish --gas-budget 100000000\n" +
              "2. Copy Package ID từ kết quả\n" +
              "3. Thêm vào frontend/.env.local:\n" +
              "   VITE_SUI_PACKAGE_ID=0x{package_id}\n" +
              "4. Restart dev server"
          );
          setError(error);
          setIsMinting(false);
          reject(error);
          return;
        }

        // Tạo Transaction
        const txb = new Transaction();

        // Gọi function mint_and_transfer từ Sui Move package
        // Module: ai_model_nft::model_nft
        // Function: mint_and_transfer
        txb.moveCall({
          target: `${PACKAGE_ID}::model_nft::mint_and_transfer`,
          arguments: [
            txb.pure(metadata.name), // name: vector<u8>
            txb.pure(metadata.description), // description: vector<u8>
            txb.pure(metadata.modelType || ""), // model_type: vector<u8>
            txb.pure(metadata.ipfsHash || metadata.image), // metadata_uri: vector<u8>
            txb.pure(metadata.image), // image_uri: vector<u8>
            txb.pure(metadata.royaltyPercentage || 0), // royalty_percentage: u64 (basis points)
          ],
        });

        // Execute transaction
        signAndExecuteTransaction(
          { transaction: txb },
          {
            onSuccess: async (result) => {
              setTxDigest(result.digest);

              // Lấy objectId từ transaction result
              // Tìm object được created và transferred về cho sender
              let objectId: string | null = null;

              try {
                // Lấy transaction details để xem objectChanges
                const txDetails = await client.getTransactionBlock({
                  digest: result.digest,
                  options: {
                    showObjectChanges: true,
                    showEffects: true,
                  },
                });

                // Tìm object được created và transferred về cho sender
                const sender = currentWallet.accounts[0]?.address;

                if (txDetails.objectChanges) {
                  for (const change of txDetails.objectChanges) {
                    // Tìm object được created với type ModelNFT
                    if (
                      change.type === "created" &&
                      change.objectType &&
                      (change.objectType.includes("ModelNFT") ||
                        change.objectType.includes("model_nft"))
                    ) {
                      objectId = change.objectId;
                      break;
                    }
                    // Hoặc tìm object được transferred về cho sender
                    if (
                      change.type === "transferred" &&
                      change.objectType &&
                      (change.objectType.includes("ModelNFT") ||
                        change.objectType.includes("model_nft"))
                    ) {
                      // Kiểm tra recipient
                      if (
                        (change.recipient &&
                          typeof change.recipient === "object" &&
                          "Address" in change.recipient &&
                          change.recipient.Address === sender) ||
                        (typeof change.recipient === "string" &&
                          change.recipient === sender)
                      ) {
                        objectId = change.objectId;
                        break;
                      }
                    }
                  }
                }

                // Nếu không tìm thấy trong objectChanges, thử tìm trong effects.created
                if (!objectId && txDetails.effects?.created) {
                  const created = txDetails.effects.created;
                  if (created && created.length > 0) {
                    // Lấy object đầu tiên được created (thường là NFT)
                    objectId =
                      typeof created[0] === "string"
                        ? created[0]
                        : created[0].reference?.objectId || null;
                  }
                }
              } catch (err) {
                console.warn("Failed to get objectId from transaction:", err);
                // Vẫn tiếp tục với txDigest
              }

              setMintedObjectId(objectId);
              setIsMinting(false);
              resolve({
                txDigest: result.digest,
                objectId: objectId || "",
              });
            },
            onError: (err) => {
              const error =
                err instanceof Error ? err : new Error("Failed to mint NFT");
              setError(error);
              setIsMinting(false);
              reject(error);
            },
          }
        );
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to mint NFT");
        setError(error);
        setIsMinting(false);
        reject(error);
      }
    });
  };

  return {
    mintNFT,
    isMinting,
    error,
    txDigest,
    mintedObjectId,
  };
}
