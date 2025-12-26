import { Transaction } from "@mysten/sui/transactions";

/**
 * NFT Metadata structure for Sui
 */
export interface NFTMetadata {
  name: string;
  description: string;
  model_type: string;
  metadata_uri: string; // IPFS hash
  image_uri: string; // IPFS hash
  royalty_percentage: number; // basis points (1000 = 10%)
}

/**
 * Mint NFT trên Sui blockchain sử dụng Move contract
 *
 * @param metadata - NFT metadata
 * @returns Transaction result
 */
export async function mintSuiNFT(metadata: NFTMetadata) {
  // Get package ID from environment
  const packageId = import.meta.env.VITE_SUI_PACKAGE_ID;

  if (!packageId) {
    throw new Error("VITE_SUI_PACKAGE_ID không được cấu hình trong .env.local");
  }

  // Validate required fields
  if (!metadata.name || !metadata.description || !metadata.model_type) {
    throw new Error("Thiếu thông tin bắt buộc: name, description, model_type");
  }

  if (!metadata.metadata_uri || !metadata.image_uri) {
    throw new Error(
      "Thiếu URI metadata và image. Vui lòng upload lên IPFS trước."
    );
  }

  // Validate royalty percentage (max 100% = 10000 basis points)
  if (metadata.royalty_percentage < 0 || metadata.royalty_percentage > 10000) {
    throw new Error("Royalty percentage phải từ 0 đến 10000 (basis points)");
  }

  try {
    // Create transaction block
    const txb = new Transaction();

    // Call mint_and_transfer function from Move contract
    txb.moveCall({
      target: `${packageId}::model_nft::mint_and_transfer`,
      arguments: [
        // Convert strings to vector<u8> for Move
        txb.pure.vector(
          "u8",
          Array.from(new TextEncoder().encode(metadata.name))
        ),
        txb.pure.vector(
          "u8",
          Array.from(new TextEncoder().encode(metadata.description))
        ),
        txb.pure.vector(
          "u8",
          Array.from(new TextEncoder().encode(metadata.model_type))
        ),
        txb.pure.vector(
          "u8",
          Array.from(new TextEncoder().encode(metadata.metadata_uri))
        ),
        txb.pure.vector(
          "u8",
          Array.from(new TextEncoder().encode(metadata.image_uri))
        ),
        txb.pure.u64(metadata.royalty_percentage),
      ],
    });

    return txb;
  } catch (error) {
    console.error("Lỗi khi tạo transaction mint NFT:", error);
    throw new Error(
      `Không thể tạo transaction mint NFT: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

/**
 * Upload metadata lên IPFS và mint NFT
 * @param metadata - NFT metadata (chưa có IPFS URIs)
 * @returns Transaction object để mint NFT
 */
export async function uploadMetadataAndMint(metadata: NFTMetadata) {
  // Validate input
  if (!metadata.name || !metadata.description || !metadata.model_type) {
    throw new Error("Thiếu thông tin bắt buộc: name, description, model_type");
  }

  // TODO: Upload metadata JSON lên IPFS để lấy metadata_uri
  // TODO: Upload image lên IPFS để lấy image_uri

  // For now, assume metadata_uri and image_uri are already provided
  if (!metadata.metadata_uri || !metadata.image_uri) {
    throw new Error(
      "metadata_uri và image_uri là bắt buộc. Vui lòng upload lên IPFS trước."
    );
  }

  // Mint NFT with provided URIs
  return await mintSuiNFT(metadata);
}
