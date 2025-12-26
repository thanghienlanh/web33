# Hướng dẫn implement Mint NFT trên Sui

## Hiện trạng

✅ **Đã có:**

- Hook `useMintNFT` với structure cơ bản
- Tích hợp vào `CreateModel` page
- UI với error handling và success messages
- Wallet connection check

❌ **Chưa có:**

- Sui Move package để mint NFT
- Logic mint NFT thực sự

## Cách implement

### Bước 1: Tạo Sui Move Package

Tạo Sui Move package với function mint NFT:

```move
module my_nft::model_nft {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use std::string::{String};

    struct ModelNFT has key, store {
        id: UID,
        name: String,
        description: String,
        image_url: String,
        model_type: String,
        creator: address,
    }

    public fun mint(
        name: vector<u8>,
        description: vector<u8>,
        image_url: vector<u8>,
        model_type: vector<u8>,
        ctx: &mut TxContext
    ): ModelNFT {
        ModelNFT {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            image_url: string::utf8(image_url),
            model_type: string::utf8(model_type),
            creator: tx_context::sender(ctx),
        }
    }
}
```

### Bước 2: Deploy Package

```bash
sui move build
sui client publish --gas-budget 100000000
```

Lưu lại `Package ID` được trả về.

### Bước 3: Cập nhật useMintNFT.ts

Trong file `src/hooks/useMintNFT.ts`, uncomment và cập nhật:

```typescript
const PACKAGE_ID = "0x{YOUR_PACKAGE_ID}"; // Thay bằng package ID thực tế

const mintNFT = async (metadata: NFTMetadata): Promise<string> => {
  // ...

  const txb = new Transaction();

  txb.moveCall({
    target: `${PACKAGE_ID}::model_nft::mint`,
    arguments: [
      txb.pure(metadata.name),
      txb.pure(metadata.description),
      txb.pure(metadata.image),
      txb.pure(metadata.modelType || ""),
    ],
  });

  return new Promise((resolve, reject) => {
    signAndExecuteTransactionBlock(
      { transactionBlock: txb },
      {
        onSuccess: (result) => {
          setTxDigest(result.digest);
          setIsMinting(false);
          resolve(result.digest);
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
  });
};
```

## Hoặc sử dụng Display Object (Đơn giản hơn)

Nếu không muốn tạo custom Move package, có thể sử dụng Display Object standard của Sui:

```typescript
import { Transaction } from "@mysten/sui/transactions";

const txb = new Transaction();

// Tạo object với Display metadata
txb.moveCall({
  target: "0x2::display::new_with_fields",
  arguments: [
    txb.pure({
      name: metadata.name,
      description: metadata.description,
      image_url: metadata.image,
      link: metadata.ipfsHash || "",
    }),
  ],
});

// Share object để có thể transfer
txb.moveCall({
  target: "0x2::transfer::public_share_object",
  arguments: [object],
});
```

## Testing

1. Deploy package lên Sui testnet
2. Cập nhật PACKAGE_ID trong code
3. Kết nối ví Sui
4. Tạo model và click "Tạo và Mint NFT"
5. Approve transaction trong wallet
6. Kiểm tra transaction trên Sui Explorer

## Lưu ý

- Cần có SUI để pay gas fee
- Test trên testnet trước khi deploy mainnet
- Có thể cần adjust gas budget tùy vào complexity của transaction
