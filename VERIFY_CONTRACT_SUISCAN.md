# Hướng dẫn Verify Contract trên SuiScan

Sau khi deploy Sui Move package, để contract hiển thị source code và có thể interact trên SuiScan explorer.

## 🎯 Tại sao cần verify contract?

- ✅ Xem source code Move trên explorer
- ✅ Interact với contract functions trực tiếp
- ✅ Xem transactions và events
- ✅ Debug và monitor contract hoạt động
- ✅ Tăng tính transparency và trust

## 📋 Chuẩn bị

### 1. Đã deploy contract thành công
- Có Package ID từ output deployment
- Contract đã publish lên testnet/mainnet

### 2. Cài đặt Sui CLI
```bash
# Đã có sẵn trong dự án
sui --version
```

### 3. Source code
- Thư mục `sui-contracts/sources/` chứa source code Move

## 🚀 Các cách verify

### Cách 1: Sử dụng Script (Khuyến nghị)

#### Testnet
**Windows:**
```cmd
cd sui-contracts
verify-contract.bat
```

**Linux/Mac:**
```bash
cd sui-contracts
./verify-contract.bat
```

#### Mainnet
**Windows:**
```cmd
cd sui-contracts
verify-contract-mainnet.bat
```

**Linux/Mac:**
```bash
cd sui-contracts
./verify-contract-mainnet.bat
```

#### Deploy + Verify cùng lúc
**Windows:**
```cmd
cd sui-contracts
deploy-and-verify.bat
```

**Linux/Mac:**
```bash
cd sui-contracts
./deploy-and-verify.bat
```

### Cách 2: Manual với Sui CLI

#### Bước 1: Switch network
```bash
# Testnet
sui client switch --env testnet

# Mainnet
sui client switch --env mainnet
```

#### Bước 2: Verify source code
```bash
cd sui-contracts
sui client verify-source --verify-deps
```

### Cách 3: Submit trực tiếp trên SuiScan

#### Bước 1: Truy cập SuiScan
- **Testnet:** https://testnet.suiscan.xyz/
- **Mainnet:** https://suiscan.xyz/

#### Bước 2: Tìm contract
1. Paste Package ID vào search box
2. Nhấn Enter hoặc click search

#### Bước 3: Verify contract
1. Trên trang contract detail, click **"Verify Contract"**
2. Upload source code:
   - Chọn **"Upload Files"**
   - Upload toàn bộ thư mục `sui-contracts/sources/`
3. Fill thông tin:
   ```
   Contract Name: AI Model NFT
   Compiler Version: Move 2024 (or latest)
   Optimization: Yes
   ```
4. Click **"Verify"**

## 🔍 Kiểm tra kết quả

Sau khi verify thành công:

### ✅ Contract hiển thị
- Source code Move hiển thị trên explorer
- Có thể click vào từng function để xem code
- Transactions tab hiển thị lịch sử

### ✅ Interact với contract
- "Write Contract" tab: Gọi functions
- "Read Contract" tab: Query data
- Events tab: Xem events emitted

### ✅ Debug & Monitor
- View all transactions của contract
- Track NFT minting events
- Monitor contract usage

## 🛠️ Troubleshooting

### Lỗi: "Verification Failed"

**Nguyên nhân:**
- Source code không match với on-chain bytecode
- Sai compiler version
- Missing dependencies

**Giải pháp:**
```bash
# Clean rebuild
cd sui-contracts
sui move build --force

# Re-deploy
sui client publish --gas-budget 100000000
```

### Lỗi: "Package not found"

**Nguyên nhân:**
- Sai network (testnet vs mainnet)
- Package chưa deploy thành công

**Giải pháp:**
```bash
# Kiểm tra network
sui client envs

# Switch đúng network
sui client switch --env testnet
```

### Lỗi: "Source code mismatch"

**Nguyên nhân:**
- Source code local khác với deployed version
- Dependencies version khác

**Giải pháp:**
- Đảm bảo build và deploy từ cùng source code
- Check `sui-contracts/Move.lock` file

## 📊 Contract Information

Sau khi verify thành công, contract sẽ hiển thị:

```
📦 Package: ai_model_nft
📋 Modules: model_nft, generation_fee
🔗 Address: 0x{your_package_id}
🌐 Network: testnet/mainnet
📅 Deployed: [timestamp]
```

### Functions có thể gọi:

**model_nft module:**
- `mint_and_transfer()` - Mint NFT
- `get_name()` - Get NFT name
- `get_creator()` - Get creator address

**generation_fee module:**
- `pay_fee()` - Pay generation fee
- `update_config()` - Update fee config

## 🎉 Kết luận

Verify contract trên SuiScan giúp:
- Tăng transparency cho project
- Dễ dàng debug và monitor
- Cho phép users interact trực tiếp
- Build trust với community

**Khuyến nghị:** Luôn verify contract sau khi deploy để tối ưu trải nghiệm!
