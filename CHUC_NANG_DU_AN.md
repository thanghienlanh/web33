# 📋 Danh sách Chức năng Dự án TríTuệMarket

## 🎯 Tổng quan

**TríTuệMarket** - Nền tảng thị trường phi tập trung cho mua bán và trao đổi mô hình AI trên blockchain.

---

## ✨ Chức năng chính

### 1. 🎨 **Tạo ảnh bằng AI**

**Mô tả:** Sử dụng AI để tạo ảnh từ text prompt

**Tính năng:**

- ✅ Nhập prompt mô tả ảnh
- ✅ Chọn model AI (Stable Diffusion hoặc DALL-E)
- ✅ Tùy chỉnh kích thước (width, height)
- ✅ Tùy chỉnh số bước inference
- ✅ Tùy chỉnh guidance scale
- ✅ Set seed để tái tạo ảnh
- ✅ Xem preview ảnh đã tạo
- ✅ Download ảnh

**Công nghệ:**

- Stable Diffusion v1.5 (miễn phí, local)
- DALL-E 3 (trả phí, API)
- Python FastAPI service

**Vị trí:** `frontend/src/pages/CreateModel.tsx`

---

### 2. 🪙 **Mint NFT cho mô hình AI**

**Mô tả:** Token hóa mô hình AI thành NFT trên blockchain

**Tính năng:**

- ✅ Upload mô hình AI (file .pth, .pt, .h5, .pb, .onnx, .pkl)
- ✅ Hoặc sử dụng ảnh đã tạo bằng AI
- ✅ Nhập thông tin mô hình (tên, mô tả, loại)
- ✅ Đặt giá bán (ETH hoặc SUI)
- ✅ Đặt royalty percentage
- ✅ Upload metadata lên IPFS
- ✅ Mint NFT trên blockchain
- ✅ Hỗ trợ cả Ethereum và Sui blockchain

**Blockchain:**

- **Ethereum**: Smart contract (AIModelNFT.sol)
- **Sui**: Move contract (model_nft.move)

**Vị trí:**

- Frontend: `frontend/src/pages/CreateModel.tsx`
- Ethereum: `contracts/contracts/AIModelNFT.sol`
- Sui: `sui-contracts/sources/model_nft.move`

---

### 3. 🏪 **Marketplace - Mua/Bán mô hình AI**

**Mô tả:** Thị trường để mua và bán mô hình AI dưới dạng NFT

**Tính năng:**

- ✅ Xem tất cả mô hình AI đang bán
- ✅ Tìm kiếm mô hình (theo tên, mô tả)
- ✅ Lọc theo loại mô hình
- ✅ Lọc theo blockchain (Ethereum/Sui)
- ✅ Sắp xếp (mới nhất, cũ nhất, tên A-Z)
- ✅ Xem chi tiết mô hình
- ✅ Mua mô hình bằng ETH/SUI
- ✅ Tự động phân phối royalty
- ✅ Marketplace fee (2.5%)

**Smart Contract:**

- Ethereum: `contracts/contracts/Marketplace.sol`
- Tự động xử lý thanh toán và transfer NFT

**Vị trí:** `frontend/src/pages/Marketplace.tsx`

---

### 4. 📦 **Quản lý mô hình của tôi**

**Mô tả:** Xem và quản lý các mô hình AI bạn đã tạo

**Tính năng:**

- ✅ Xem danh sách mô hình đã mint
- ✅ Xem trạng thái (đang bán/chưa bán)
- ✅ List mô hình để bán
- ✅ Delist mô hình
- ✅ Xem lịch sử giao dịch
- ✅ Xem số lượng NFT đã mint

**Vị trí:** `frontend/src/pages/MyModels.tsx`

---

### 5. 🔗 **Kết nối ví (Wallet Connection)**

**Mô tả:** Kết nối ví để tương tác với blockchain

**Tính năng:**

- ✅ Kết nối MetaMask (Ethereum)
- ✅ Kết nối Sui Wallet (Sui blockchain)
- ✅ Kết nối WalletConnect (mobile wallets)
- ✅ Hiển thị địa chỉ ví
- ✅ Kiểm tra network đúng
- ✅ Hiển thị balance
- ✅ Ngắt kết nối
- ✅ Xử lý lỗi kết nối

**Hỗ trợ Wallets:**

- MetaMask
- Sui Wallet (Slush, Sui Wallet)
- WalletConnect
- Injected wallets

**Vị trí:**

- `frontend/src/components/ConnectButton.tsx`
- `frontend/src/components/SuiConnectButton.tsx`

---

### 6. 📤 **Upload lên IPFS**

**Mô tả:** Lưu trữ mô hình AI và metadata trên IPFS

**Tính năng:**

- ✅ Upload file mô hình lên IPFS
- ✅ Upload metadata JSON lên IPFS
- ✅ Upload ảnh lên IPFS
- ✅ Lấy IPFS hash
- ✅ Truy cập file qua IPFS gateway

**Backend API:**

- `POST /api/ipfs/upload` - Upload file
- `POST /api/ipfs/metadata` - Upload metadata
- `GET /api/ipfs/:hash` - Lấy file

**Vị trí:** `backend/src/routes/ipfs.ts`

---

### 7. 💎 **Hệ thống Royalty**

**Mô tả:** Tự động phân phối royalty cho creator khi bán lại

**Tính năng:**

- ✅ Đặt royalty percentage khi mint
- ✅ Tự động tính royalty khi bán
- ✅ Tự động transfer royalty cho creator
- ✅ Marketplace fee riêng biệt
- ✅ Seller nhận phần còn lại

**Smart Contract Logic:**

```solidity
royalty = (price * royaltyPercentage) / 10000
marketplaceFee = (price * marketplaceFeePercentage) / 10000
sellerAmount = price - royalty - marketplaceFee
```

**Vị trí:** `contracts/contracts/Marketplace.sol`

---

### 8. 🔍 **Tìm kiếm & Lọc**

**Mô tả:** Tìm kiếm và lọc mô hình AI trên marketplace

**Tính năng:**

- ✅ Tìm kiếm theo tên
- ✅ Tìm kiếm theo mô tả
- ✅ Lọc theo loại mô hình
- ✅ Lọc theo blockchain
- ✅ Sắp xếp (mới nhất, cũ nhất, tên)
- ✅ Xóa bộ lọc
- ✅ Hiển thị số kết quả

**Vị trí:** `frontend/src/pages/Marketplace.tsx`

---

### 9. 📊 **Xem chi tiết mô hình**

**Mô tả:** Trang chi tiết của từng mô hình AI

**Tính năng:**

- ✅ Hiển thị thông tin mô hình
- ✅ Hiển thị ảnh preview
- ✅ Hiển thị giá
- ✅ Hiển thị royalty percentage
- ✅ Hiển thị người tạo
- ✅ Hiển thị token ID
- ✅ Hiển thị IPFS hash
- ✅ Nút mua ngay
- ✅ Link xem trên IPFS

**Vị trí:** `frontend/src/pages/ModelDetail.tsx`

---

### 10. 💰 **Thanh toán bằng Token**

**Mô tả:** Thanh toán khi mua mô hình bằng crypto

**Tính năng:**

- ✅ Thanh toán bằng ETH (Ethereum)
- ✅ Thanh toán bằng SUI (Sui blockchain)
- ✅ Tự động approve transaction
- ✅ Hiển thị transaction status
- ✅ Xử lý lỗi thanh toán
- ✅ Refund nếu overpay

**Vị trí:**

- Ethereum: `contracts/contracts/Marketplace.sol`
- Frontend: `frontend/src/pages/ModelDetail.tsx`

---

### 11. 📱 **Responsive Design**

**Mô tả:** Giao diện tối ưu cho mọi thiết bị

**Tính năng:**

- ✅ Mobile-friendly
- ✅ Tablet-friendly
- ✅ Desktop-optimized
- ✅ Mobile menu (hamburger)
- ✅ Touch-friendly buttons
- ✅ Responsive grid layout
- ✅ Adaptive typography

**Vị trí:** Tất cả components và pages

---

### 12. 🎬 **Splash Screen**

**Mô tả:** Màn hình khởi động với animation

**Tính năng:**

- ✅ Animated logo
- ✅ Progress bar
- ✅ Loading animation
- ✅ Fade in/out effects
- ✅ Chỉ hiện 1 lần mỗi session

**Vị trí:** `frontend/src/components/SplashScreen.tsx`

---

### 13. 📈 **Thống kê nền tảng**

**Mô tả:** Hiển thị thống kê về marketplace

**Tính năng:**

- ✅ Tổng số mô hình AI
- ✅ Tổng số người dùng
- ✅ Tổng giá trị giao dịch (ETH)
- ✅ Tổng số giao dịch

**Vị trí:** `frontend/src/pages/Home.tsx`

---

### 14. 🔐 **Bảo mật & Validation**

**Mô tả:** Kiểm tra và validate dữ liệu

**Tính năng:**

- ✅ Validate form input
- ✅ Kiểm tra wallet connection
- ✅ Kiểm tra network đúng
- ✅ Kiểm tra balance đủ
- ✅ ReentrancyGuard trong smart contracts
- ✅ Input sanitization

**Vị trí:**

- Smart Contracts: `contracts/contracts/`
- Backend: `backend/src/utils/validation.ts`

---

### 15. 🌐 **Multi-chain Support**

**Mô tả:** Hỗ trợ nhiều blockchain

**Tính năng:**

- ✅ Ethereum (Hardhat local, Sepolia)
- ✅ Sui (Testnet, Mainnet)
- ✅ Chuyển đổi giữa các chain
- ✅ Hiển thị chain hiện tại

**Vị trí:**

- Ethereum: `frontend/src/config/wagmi.ts`
- Sui: `frontend/src/config/sui.ts`

---

## 📂 Cấu trúc chức năng theo module

### Frontend (`frontend/src/`)

1. **Pages:**

   - `Home.tsx` - Trang chủ với hero và stats
   - `Marketplace.tsx` - Thị trường mô hình
   - `CreateModel.tsx` - Tạo mô hình và mint NFT
   - `MyModels.tsx` - Quản lý mô hình của tôi
   - `ModelDetail.tsx` - Chi tiết mô hình
   - `SuiWalletDemo.tsx` - Demo Sui wallet

2. **Components:**

   - `Layout.tsx` - Layout chính với navigation
   - `ConnectButton.tsx` - Kết nối ví Ethereum
   - `SuiConnectButton.tsx` - Kết nối ví Sui
   - `SplashScreen.tsx` - Màn hình khởi động
   - `MintedNFTCard.tsx` - Card hiển thị NFT
   - `BalanceCards.tsx` - Hiển thị balance
   - `TransactionStatus.tsx` - Trạng thái transaction

3. **Hooks:**
   - `useWallet.ts` - Quản lý wallet Ethereum
   - `useSuiWallet.ts` - Quản lý wallet Sui
   - `useMintNFT.ts` - Mint NFT
   - `useSuiNFTs.ts` - Lấy danh sách NFT Sui

### Backend (`backend/src/`)

1. **Routes:**

   - `/api/models/generate-image` - Tạo ảnh bằng AI
   - `/api/models/validate` - Validate mô hình
   - `/api/ipfs/upload` - Upload lên IPFS
   - `/api/ipfs/metadata` - Upload metadata
   - `/api/transactions` - Quản lý transactions

2. **Services:**
   - `ModelService.ts` - Business logic cho models
   - `TransactionService.ts` - Quản lý transactions

### Smart Contracts

1. **Ethereum:**

   - `AIModelNFT.sol` - NFT contract
   - `Marketplace.sol` - Marketplace contract

2. **Sui:**
   - `model_nft.move` - NFT contract trên Sui

### AI Service (`ai-service/`)

1. **Endpoints:**
   - `POST /generate` - Tạo ảnh
   - `POST /generate-batch` - Tạo nhiều ảnh
   - `GET /health` - Health check

---

## 🎯 Workflow chính

### 1. Tạo và bán mô hình AI:

```
User nhập prompt
    ↓
AI tạo ảnh (Stable Diffusion)
    ↓
User nhập thông tin mô hình
    ↓
Upload lên IPFS
    ↓
Mint NFT trên blockchain
    ↓
List trên marketplace
    ↓
Người khác có thể mua
```

### 2. Mua mô hình AI:

```
User duyệt marketplace
    ↓
Tìm kiếm/lọc mô hình
    ↓
Xem chi tiết
    ↓
Click "Mua ngay"
    ↓
Approve transaction
    ↓
Thanh toán ETH/SUI
    ↓
Nhận NFT
    ↓
Royalty tự động chuyển cho creator
```

---

## 📊 Tổng kết

### Đã implement:

- ✅ 15 chức năng chính
- ✅ Multi-chain (Ethereum + Sui)
- ✅ AI Image Generation
- ✅ NFT Minting
- ✅ Marketplace
- ✅ IPFS Storage
- ✅ Royalty System
- ✅ Wallet Integration
- ✅ Responsive UI

### Đang phát triển:

- ⏳ Rating & Review system
- ⏳ Advanced filtering
- ⏳ Analytics dashboard
- ⏳ Notification system

---

## 🔗 Liên kết nhanh

- **Frontend**: `frontend/src/`
- **Backend**: `backend/src/`
- **Smart Contracts**: `contracts/contracts/`
- **Sui Contracts**: `sui-contracts/sources/`
- **AI Service**: `ai-service/main.py`
