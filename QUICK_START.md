# Quick Start - Mint NFT trên Sui

Hướng dẫn nhanh để mint NFT trên Sui blockchain. Chỉ cần 4 bước!

## Yêu cầu tối thiểu

- ✅ Sui Move package (đã có trong `sui-contracts/`)
- ✅ PACKAGE_ID (sau khi deploy)
- ✅ Backend (đã có trong `backend/`)
- ✅ Frontend (đã có trong `frontend/`)

**Lưu ý:** IPFS và AI Service là **optional** - không bắt buộc để mint NFT.

---

## Bước 1: Deploy Sui Move Package

### 1.1. Cài đặt Sui CLI

```bash
# Windows (PowerShell)
irm https://get.sui.io | iex

# Mac/Linux
curl -fsSL https://get.sui.io | sh
```

### 1.2. Build Package

```bash
cd sui-contracts
sui move build
```

### 1.3. Cấu hình Network và Deploy lên Testnet

**Bước 1: Cấu hình Sui client cho Testnet (nếu chưa có)**

```bash
# Kiểm tra network hiện tại
sui client envs

# Nếu chưa có testnet, thêm mới:
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443

# Chuyển sang testnet
sui client switch --env testnet
```

**Bước 2: Deploy package**

```bash
# Đảm bảo bạn đang ở trong thư mục sui-contracts
cd sui-contracts

# Đảm bảo bạn đã có SUI trong wallet để trả gas fee
sui client publish --gas-budget 100000000
```

**Lưu ý:** Trong Sui CLI mới, flag `--network` đã bị loại bỏ. Bạn phải dùng `sui client switch --env <network>` để chuyển network trước khi publish.

**Lưu ý:** Phải chạy lệnh này trong thư mục `sui-contracts/` (nơi có file `Move.toml`)

### 1.4. Copy Package ID

Sau khi chạy lệnh `sui client publish`, bạn sẽ thấy output tương tự như sau:

```
Published Objects:
  ┌──
  │ PackageID: 0xabc123def456789...
  │ ...
```

**Cách lấy Package ID:**

1. Tìm dòng có `PackageID:` trong output
2. Copy toàn bộ giá trị sau `PackageID:` (ví dụ: `0xabc123def456789...`)
3. Đây chính là giá trị bạn cần cho `VITE_SUI_PACKAGE_ID`

**Ví dụ output thực tế:**

```
Published Objects:
  ┌──
  │ PackageID: 0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b
  │ ...
```

→ Package ID của bạn là: `0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b`

**Lưu ý:** Package ID là một chuỗi hex dài, bắt đầu bằng `0x`. Copy toàn bộ chuỗi này!

### (Optional) Verify Contract trên SuiScan

Sau khi deploy thành công, để contract hiển thị source code trên explorer:

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

**Hoặc manual:**

1. Vào https://testnet.suiscan.xyz/
2. Search Package ID của bạn
3. Click "Verify Contract"
4. Upload thư mục `sui-contracts/sources/`
5. Submit verification

---

## Bước 2: Cấu hình Frontend

### 2.1. Tạo file `.env.local`

**Cách 1: Copy từ file example (Khuyến nghị)**

```bash
cd frontend

# Windows (PowerShell)
copy .env.example .env.local

# Mac/Linux
# cp .env.example .env.local
```

**Cách 2: Tạo file mới thủ công**
Tạo file `frontend/.env.local` với nội dung:

```env
VITE_SUI_PACKAGE_ID=0x1234567890abcdef...
VITE_SUI_NETWORK=testnet
VITE_API_URL=http://localhost:3001/api
VITE_IPFS_API_URL=http://localhost:3001/api/ipfs
```

### 2.2. Cập nhật PACKAGE_ID

1. Mở file `frontend/.env.local` (vừa tạo ở bước 2.1)
2. Tìm dòng `VITE_SUI_PACKAGE_ID=0x...`
3. Thay thế giá trị bằng Package ID thực tế của bạn (đã copy từ bước 1.4)

**Ví dụ:**

- Nếu Package ID bạn copy được là: `0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b`
- Thì trong file `.env.local` bạn sẽ ghi:
  ```env
  VITE_SUI_PACKAGE_ID=0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b
  ```

**Ví dụ sau khi cập nhật:**

```env
VITE_SUI_PACKAGE_ID=0xabc123def456789...
VITE_SUI_NETWORK=testnet
VITE_API_URL=http://localhost:3001/api
```

**Lưu ý quan trọng:**

- Package ID phải bắt đầu bằng `0x`
- Không có khoảng trắng trước/sau dấu `=`
- Sau khi sửa file, **phải restart frontend dev server** để áp dụng thay đổi

---

## Bước 3: Chạy Backend

```bash
cd backend
npm install
npm run dev
```

Backend sẽ chạy tại: `http://localhost:3001`

---

## Bước 4: Chạy Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

---

## Sử dụng

1. Mở browser: `http://localhost:5173`
2. Kết nối Sui Wallet (cài extension nếu chưa có)
3. Vào trang **"Tạo mô hình"** (`/create`)
4. Điền thông tin:
   - Tên mô hình
   - Mô tả
   - Loại mô hình
   - Royalty (%)
5. Click **"Tạo và Mint NFT"**
6. Approve transaction trong wallet
7. ✅ NFT đã được mint!

---

## Về IPFS và AI Service

### IPFS (Optional)

- **Không bắt buộc** để mint NFT
- Nếu IPFS không chạy, bạn có thể chọn "Continue" khi mint
- NFT vẫn được mint thành công, chỉ không có IPFS metadata
- Để dùng IPFS: xem `SETUP_GUIDE.md` phần 1

### AI Service (Optional)

- **Không bắt buộc** để mint NFT
- Chỉ dùng để tạo ảnh preview bằng AI
- Có thể upload ảnh thủ công hoặc bỏ qua
- Để dùng AI: xem `SETUP_GUIDE.md` phần 5

---

## Troubleshooting

### Lỗi: "Chưa cấu hình PACKAGE_ID"

**Giải pháp:**

1. **Kiểm tra file có tồn tại:**

   ```bash
   # Windows
   dir frontend\.env.local

   # Mac/Linux
   ls frontend/.env.local
   ```

2. **Nếu file không tồn tại, tạo mới:**

   ```bash
   cd frontend
   copy .env.example .env.local
   # Hoặc tạo thủ công: tạo file .env.local với nội dung từ .env.example
   ```

3. **Kiểm tra format trong file `.env.local`:**

   - Phải có dòng: `VITE_SUI_PACKAGE_ID=0x...`
   - Package ID phải bắt đầu bằng `0x`
   - Không có khoảng trắng: `VITE_SUI_PACKAGE_ID=0x123...` (đúng) ✅
   - Không được: `VITE_SUI_PACKAGE_ID = 0x123...` (sai) ❌

4. **Sau khi sửa, restart frontend:**
   - Stop dev server (Ctrl+C)
   - Start lại: `npm run dev`

### Lỗi: "IPFS service unavailable"

**Giải pháp:**

- **Bỏ qua:** Chọn "Continue" khi mint NFT
- Hoặc cài IPFS: xem `SETUP_GUIDE.md`

### Lỗi: Sui Wallet không kết nối được

**Giải pháp:**

1. Cài Sui Wallet extension: https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil
2. Tạo wallet mới hoặc import wallet
3. Chuyển sang **Testnet** network
4. Refresh trang và thử lại

---

## Tóm tắt

**Để mint NFT, bạn chỉ cần:**

1. ✅ Deploy Sui Move package → Lấy PACKAGE_ID
2. ✅ Cấu hình PACKAGE_ID trong `frontend/.env.local`
3. ✅ Chạy backend: `cd backend && npm run dev`
4. ✅ Chạy frontend: `cd frontend && npm run dev`
5. ✅ Kết nối wallet và mint!

**IPFS và AI Service là optional - không cần thiết để mint NFT!**
