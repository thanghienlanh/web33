# Hướng dẫn Setup Dự án TríTuệMarket

> **📌 Quick Start:** Nếu bạn chỉ muốn mint NFT nhanh, xem file `QUICK_START.md` - chỉ cần Sui Move + PACKAGE_ID + Backend + Frontend!

---

## ⚠️ Lưu ý quan trọng

- **Tối thiểu để mint NFT:** Sui Move package + PACKAGE_ID + Backend + Frontend
- **IPFS và AI Service là OPTIONAL** - không bắt buộc để mint NFT
- Nếu IPFS không chạy, bạn có thể bỏ qua và vẫn mint NFT thành công

---

## 1. Cài đặt IPFS (Optional - nếu muốn upload lên IPFS)

### Option A: Sử dụng IPFS Local Node

1. **Cài đặt IPFS:**

   ```bash
   # Download từ https://dist.ipfs.tech/#go-ipfs
   # Hoặc dùng package manager:
   # Windows: choco install ipfs
   # Mac: brew install ipfs
   # Linux: apt-get install ipfs
   ```

2. **Khởi động IPFS:**

   ```bash
   ipfs init
   ipfs daemon
   ```

3. **Cấu hình trong backend/.env:**
   ```env
   IPFS_API_URL=http://localhost:5001
   ```

### Option B: Sử dụng IPFS Gateway (Không cần local node)

1. **Sử dụng public gateway (có giới hạn):**

   - Infura IPFS (cần API key): https://ipfs.infura.io:5001
   - Pinata (cần API key): https://api.pinata.cloud

2. **Cấu hình trong backend/.env:**
   ```env
   IPFS_API_URL=https://ipfs.infura.io:5001
   IPFS_PROJECT_ID=your_project_id
   IPFS_PROJECT_SECRET=your_project_secret
   ```

### Option C: Bỏ qua IPFS (Development)

Nếu không muốn dùng IPFS trong development, bạn có thể:

- Bỏ qua bước upload IPFS khi mint NFT
- Hoặc comment out phần IPFS upload trong code

## 2. Deploy Sui Move Package

### Bước 1: Cài đặt Sui CLI

```bash
# Windows (PowerShell)
irm https://get.sui.io | iex

# Mac/Linux
curl -fsSL https://get.sui.io | sh
```

### Bước 2: Build Package

```bash
cd sui-contracts
sui move build
```

### Bước 3: Deploy lên Testnet

```bash
# Đảm bảo bạn đang ở trong thư mục sui-contracts
cd sui-contracts

# Đảm bảo bạn đã có SUI trong wallet để trả gas fee
sui client publish --gas-budget 100000000 --network testnet
```

**Lưu ý:** Phải chạy lệnh này trong thư mục `sui-contracts/` (nơi có file `Move.toml`)

**Output sẽ có dạng:**

```
Published Objects:
  ┌──
  │ PackageID: 0x1234567890abcdef...
  │ ...
```

### Bước 4: Copy Package ID

Copy `PackageID` từ output (ví dụ: `0x1234567890abcdef...`)

### Bước 5: Cấu hình Frontend

Tạo file `frontend/.env.local`:

```env
VITE_SUI_PACKAGE_ID=0x1234567890abcdef...
VITE_SUI_NETWORK=testnet
VITE_API_URL=http://localhost:3001/api
```

### Bước 6: Restart Frontend

```bash
cd frontend
npm run dev
```

## 3. Chạy Backend

```bash
cd backend
npm install
npm run dev
```

Backend sẽ chạy tại: `http://localhost:3001`

## 4. Chạy Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173` (hoặc port khác nếu 5173 đã được dùng)

## 5. Chạy AI Service (Optional)

```bash
cd ai-service
pip install -r requirements.txt
python main.py
```

AI Service sẽ chạy tại: `http://localhost:8000`

## Troubleshooting

### Lỗi IPFS Connection

**Error:** `ECONNREFUSED` hoặc `fetch failed`

**Giải pháp:**

1. Kiểm tra IPFS node có đang chạy không:

   ```bash
   ipfs daemon
   ```

2. Hoặc cấu hình IPFS gateway trong `backend/.env`:

   ```env
   IPFS_API_URL=https://ipfs.infura.io:5001
   ```

3. Hoặc bỏ qua IPFS trong development (sẽ không upload lên IPFS)

### Lỗi PACKAGE_ID chưa cấu hình

**Error:** `Chưa cấu hình PACKAGE_ID`

**Giải pháp:**

1. Deploy Sui Move package (xem mục 2 ở trên)
2. Copy Package ID
3. Thêm vào `frontend/.env.local`:
   ```env
   VITE_SUI_PACKAGE_ID=0x{your_package_id}
   ```
4. Restart frontend dev server

### Lỗi Sui Wallet Connection

**Giải pháp:**

1. Cài đặt Sui Wallet extension: https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil
2. Tạo wallet mới hoặc import existing wallet
3. Chuyển sang Testnet network trong wallet
4. Refresh trang và thử kết nối lại

## Environment Variables

### Backend (.env)

```env
PORT=3001
IPFS_API_URL=http://localhost:5001
AI_SERVICE_URL=http://localhost:8000
```

### Frontend (.env.local)

```env
VITE_SUI_PACKAGE_ID=0x...
VITE_SUI_NETWORK=testnet
VITE_API_URL=http://localhost:3001/api
VITE_IPFS_API_URL=http://localhost:3001/api/ipfs
```

## Quick Start (Không cần IPFS)

**Xem file `QUICK_START.md` để có hướng dẫn đầy đủ và đơn giản hơn!**

Tóm tắt nhanh:

1. Deploy Sui Move package → Lấy PACKAGE_ID
2. Cấu hình PACKAGE_ID trong `frontend/.env.local`
3. Chạy backend: `cd backend && npm run dev`
4. Chạy frontend: `cd frontend && npm run dev`
5. Kết nối wallet và mint NFT!

**IPFS và AI Service là optional - không cần thiết!**
