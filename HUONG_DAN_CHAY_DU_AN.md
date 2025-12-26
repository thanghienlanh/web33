# 🚀 Hướng dẫn Chạy Dự án TríTuệMarket

## 📋 Tổng quan

Dự án có 3 phần chính:
1. **Backend** (Node.js) - Port 3001
2. **Frontend** (Vite + React) - Port 5173
3. **AI Service** (Python - Optional) - Port 8000

---

## ⚡ Cách 1: Chạy nhanh bằng Batch Script (Windows)

### Option A: Chạy đầy đủ (Backend + Frontend)

```bash
# Double-click file này hoặc chạy trong terminal:
start.bat
```

Hoặc:

```bash
start-simple.bat
```

### Option B: Chạy với Cloudflare Tunnel

```bash
start-with-tunnel.bat
```

---

## 🔧 Cách 2: Chạy thủ công (Tất cả hệ điều hành)

### Bước 1: Cài đặt dependencies (nếu chưa cài)

```bash
# Cài đặt dependencies cho backend
cd backend
npm install

# Cài đặt dependencies cho frontend
cd ../frontend
npm install
```

### Bước 2: Chạy Backend

Mở terminal thứ 1:

```bash
cd backend
npm run dev
```

Backend sẽ chạy tại: **http://localhost:3001**

### Bước 3: Chạy Frontend

Mở terminal thứ 2:

```bash
cd frontend
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:5173**

---

## 🎨 Chạy AI Service (Optional - để tạo ảnh bằng AI)

### Cài đặt Python dependencies:

```bash
cd ai-service
pip install -r requirements.txt
```

### Chạy AI Service:

**Windows:**
```bash
cd ai-service
python main.py
```

Hoặc double-click: `ai-service/start.bat`

**Mac/Linux:**
```bash
cd ai-service
python3 main.py
```

AI Service sẽ chạy tại: **http://localhost:8000**

---

## 📝 Cấu hình môi trường

### Frontend (.env.local)

Tạo file `frontend/.env.local`:

```env
# Sui Blockchain
VITE_SUI_PACKAGE_ID=0x1234567890abcdef...
VITE_SUI_NETWORK=testnet

# API
VITE_API_URL=http://localhost:3001/api
VITE_IPFS_API_URL=http://localhost:3001/api/ipfs
```

**Lưu ý:** Cần deploy Sui Move package trước để lấy `VITE_SUI_PACKAGE_ID`. Xem `QUICK_START.md` để biết cách deploy.

### Backend (.env)

Tạo file `backend/.env`:

```env
PORT=3001
IPFS_API_URL=http://localhost:5001
AI_SERVICE_URL=http://localhost:8000
```

---

## 🎯 Lệnh nhanh theo từng phần

### Chỉ chạy Frontend:

```bash
cd frontend
npm run dev
```

### Chỉ chạy Backend:

```bash
cd backend
npm run dev
```

### Chỉ chạy AI Service:

```bash
cd ai-service
python main.py
```

---

## 🌐 Truy cập ứng dụng

Sau khi chạy:

1. **Frontend**: Mở browser → `http://localhost:5173`
2. **Backend API**: `http://localhost:3001/api`
3. **AI Service**: `http://localhost:8000` (nếu chạy)

---

## 📱 Chạy với Cloudflare Tunnel (để truy cập từ xa)

### Bước 1: Cài Cloudflare Tunnel

```bash
# Windows (PowerShell)
winget install --id Cloudflare.cloudflared

# Hoặc download từ: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
```

### Bước 2: Chạy Tunnel

```bash
# Chạy tunnel cho frontend
cloudflared tunnel --url http://localhost:5173
```

Hoặc double-click: `tunnel.bat`

Bạn sẽ nhận được URL dạng: `https://xxxxx.trycloudflare.com`

---

## ⚠️ Lưu ý quan trọng

### 1. Thứ tự chạy:

**Tối thiểu:**
1. Backend (bắt buộc)
2. Frontend (bắt buộc)

**Đầy đủ:**
1. Backend
2. Frontend
3. AI Service (optional)
4. IPFS (optional)

### 2. Port đang sử dụng:

- **Frontend**: 5173 (Vite default)
- **Backend**: 3001
- **AI Service**: 8000
- **IPFS**: 5001 (nếu dùng local)

### 3. Nếu port bị chiếm:

**Frontend:**
```bash
# Sửa trong frontend/vite.config.ts
server: {
  port: 5174, // Đổi port khác
}
```

**Backend:**
```bash
# Sửa trong backend/.env
PORT=3002
```

---

## 🐛 Xử lý lỗi thường gặp

### Lỗi: "Port already in use"

**Giải pháp:**
- Tắt ứng dụng đang dùng port đó
- Hoặc đổi port trong config

### Lỗi: "Cannot find module"

**Giải pháp:**
```bash
# Cài lại dependencies
cd backend
npm install

cd ../frontend
npm install
```

### Lỗi: "Chưa cấu hình PACKAGE_ID"

**Giải pháp:**
1. Deploy Sui Move package (xem `QUICK_START.md`)
2. Copy Package ID
3. Thêm vào `frontend/.env.local`:
   ```env
   VITE_SUI_PACKAGE_ID=0x...
   ```
4. Restart frontend

### Lỗi: "Backend không kết nối được"

**Giải pháp:**
1. Kiểm tra backend đang chạy: `http://localhost:3001`
2. Kiểm tra CORS trong `backend/src/index.ts`
3. Kiểm tra `VITE_API_URL` trong `frontend/.env.local`

---

## 📊 Tóm tắt lệnh

### Chạy nhanh nhất (Windows):

```bash
# Double-click hoặc chạy:
start.bat
```

### Chạy thủ công:

**Terminal 1:**
```bash
cd backend && npm run dev
```

**Terminal 2:**
```bash
cd frontend && npm run dev
```

**Terminal 3 (Optional):**
```bash
cd ai-service && python main.py
```

---

## ✅ Checklist trước khi chạy

- [ ] Đã cài Node.js (v18+)
- [ ] Đã cài npm
- [ ] Đã chạy `npm install` trong `backend/` và `frontend/`
- [ ] Đã tạo `frontend/.env.local` với `VITE_SUI_PACKAGE_ID`
- [ ] Đã deploy Sui Move package (nếu dùng Sui)
- [ ] Port 3001 và 5173 chưa bị chiếm

---

## 🎉 Sau khi chạy thành công

1. Mở browser: `http://localhost:5173`
2. Kết nối Sui Wallet
3. Vào trang **"Tạo mô hình"** để mint NFT
4. Vào **"Thị trường"** để xem các mô hình

---

## 📚 Tài liệu liên quan

- **QUICK_START.md** - Hướng dẫn mint NFT nhanh
- **SETUP_GUIDE.md** - Hướng dẫn setup đầy đủ
- **CHUC_NANG_DU_AN.md** - Danh sách chức năng

---

## 💡 Tips

1. **Dùng nhiều terminal**: Mỗi service chạy trong 1 terminal riêng
2. **Kiểm tra logs**: Xem terminal để biết lỗi
3. **Hot reload**: Frontend tự động reload khi sửa code
4. **API testing**: Dùng Postman hoặc browser để test API

---

**Chúc bạn code vui vẻ! 🚀**

