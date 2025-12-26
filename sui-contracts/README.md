# Sui Move Package - AI Model NFT

Package Sui Move để mint NFT đại diện cho mô hình AI.

## Cấu trúc

```
sui-contracts/
├── Move.toml          # Package configuration
├── sources/
│   ├── model_nft.move      # NFT contract
│   └── generation_fee.move # Hợp đồng thu phí generate
└── README.md
```

## Chức năng

### `mint_and_transfer`

Mint NFT mới và transfer cho người gọi.

**Parameters:**

- `name`: Tên mô hình AI (vector<u8>)
- `description`: Mô tả mô hình (vector<u8>)
- `model_type`: Loại mô hình (vector<u8>)
- `metadata_uri`: URI metadata - IPFS hash hoặc URL (vector<u8>)
- `image_uri`: URI hình ảnh - IPFS hash hoặc URL (vector<u8>)
- `royalty_percentage`: Royalty percentage (basis points, 1000 = 10%)

**Example:**

```move
model_nft::mint_and_transfer(
    b"Stable Diffusion v2.1",
    b"AI model for image generation",
    b"image-generation",
    b"ipfs://QmXXX...",
    b"ipfs://QmYYY...",
    1000, // 10% royalty
    ctx
);
```

### `generation_fee::init`

Khởi tạo cấu hình phí (gọi một lần, tạo shared FeeConfig):

```move
generation_fee::init(
    @beneficiary_address, // địa chỉ nhận phí
    10_000_000,           // phí (MIST). 1 SUI = 1_000_000_000 MIST
    ctx,
);
```

### `generation_fee::pay_fee`

Trả phí mỗi lần generate ảnh bằng shared FeeConfig đã init:

```move
generation_fee::pay_fee(
    <fee_config_object>, // ID của FeeConfig (shared object)
    fee_coin,            // Coin<SUI> đủ số dư
    ctx,
);
```

Kết quả:
- Trích đúng `fee_amount` gửi tới `beneficiary`, trả lại tiền thừa cho payer.
- Mint `FeeTicket` cho người trả phí (có thể lưu/đối soát).
- Emit event `FeePaid`.

## Build & Deploy

### 1. Build Package

```bash
cd sui-contracts
sui move build
```

### 2. Test (Optional)

```bash
sui move test
```

### 3. Deploy lên Testnet

**Bước 1: Cấu hình network (nếu chưa có)**

```bash
# Kiểm tra network hiện tại
sui client envs

# Nếu chưa có testnet, thêm mới:
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443

# Chuyển sang testnet
sui client switch --env testnet
```

**Bước 2: Deploy**

```bash
# Phải chạy trong thư mục sui-contracts (nơi có Move.toml)
cd sui-contracts
sui client publish --gas-budget 100000000
```

**Lưu ý:** Sui CLI mới không còn hỗ trợ flag `--network`. Phải dùng `sui client switch --env` trước.

**Output sẽ có dạng:**

```
Published Objects:
  ┌──
  │ PackageID: 0xabc123def456789...
  │ ...
```

**Lưu lại Package ID:**

1. Tìm dòng `PackageID:` trong output
2. Copy toàn bộ giá trị (ví dụ: `0xabc123def456789...`)
3. Đây là giá trị bạn cần cho `VITE_SUI_PACKAGE_ID` trong `frontend/.env.local`

**Ví dụ:**

- Nếu Package ID là: `0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b`
- Thì trong `frontend/.env.local` bạn sẽ ghi:
  ```
  VITE_SUI_PACKAGE_ID=0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b
  ```

### 4. Deploy lên Mainnet

```bash
# Phải chạy trong thư mục sui-contracts
cd sui-contracts
sui client publish --gas-budget 100000000 --network mainnet
```

## Sử dụng trong Frontend

Sau khi deploy, cập nhật `PACKAGE_ID` trong `frontend/src/hooks/useMintNFT.ts`:

```typescript
const PACKAGE_ID = "0x{YOUR_PACKAGE_ID}";

txb.moveCall({
  target: `${PACKAGE_ID}::model_nft::mint_and_transfer`,
  arguments: [
    txb.pure(metadata.name),
    txb.pure(metadata.description),
    txb.pure(metadata.modelType || ""),
    txb.pure(metadata.ipfsHash || ""),
    txb.pure(metadata.image),
    txb.pure(metadata.royaltyPercentage || 0),
  ],
});
```

## Metadata Format

NFT lưu các thông tin:

- `name`: Tên mô hình
- `description`: Mô tả
- `model_type`: Loại mô hình
- `metadata_uri`: URI metadata (IPFS/URL)
- `image_uri`: URI hình ảnh (IPFS/URL)
- `creator`: Địa chỉ người tạo
- `royalty_percentage`: Royalty (basis points)
- `created_at`: Timestamp

## Verify Contract trên SuiScan

Sau khi deploy, để contract hiển thị source code và có thể interact trên SuiScan:

### Testnet

**Windows:**
```cmd
# Chạy script verify
verify-contract.bat
```

**Linux/Mac:**
```bash
# Chạy script verify
./verify-contract.bat
```

Hoặc manual:

```bash
# Switch to testnet
sui client switch --env testnet

# Verify source
sui client verify-source --verify-deps
```

### Mainnet

**Windows:**
```cmd
# Chạy script verify mainnet
verify-contract-mainnet.bat
```

**Linux/Mac:**
```bash
# Chạy script verify mainnet
./verify-contract-mainnet.bat
```

### Submit lên SuiScan

1. Truy cập: https://testnet.suiscan.xyz/ (testnet) hoặc https://suiscan.xyz/ (mainnet)
2. Search Package ID của bạn
3. Click "Verify Contract" hoặc "Verify Source Code"
4. Upload thư mục `sui-contracts/sources/`
5. Fill thông tin:
   - Contract Name: AI Model NFT
   - Compiler Version: Move 2024
   - Optimization: Yes
6. Submit

## Lưu ý

- Royalty percentage không được vượt quá 10000 (100%)
- NFT được transfer cho người mint
- Object có `key` và `store` abilities để có thể transfer và lưu trữ
- Metadata URI nên là IPFS hash để đảm bảo decentralization
