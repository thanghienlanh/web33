# ✅ Đã sửa lỗi AI Service

## 🔧 Vấn đề đã gặp

1. **Lỗi Pillow 10.1.0 không tương thích với Python 3.13**
   - Error: `KeyError: '__version__'`
   - Nguyên nhân: Pillow 10.1.0 quá cũ, không hỗ trợ Python 3.13

2. **Lỗi thiếu FastAPI**
   - Error: `ModuleNotFoundError: No module named 'fastapi'`
   - Nguyên nhân: Dependencies chưa được cài đặt

---

## ✅ Giải pháp

### 1. Tạo file `requirements-minimal.txt`

File này chỉ chứa các package cần thiết, không bao gồm:
- `torch` (cần GPU và nhiều RAM)
- `diffusers` (cần torch)
- `transformers` (cần torch)

**Lệnh cài đặt:**
```bash
cd ai-service
pip install -r requirements-minimal.txt
```

### 2. Cập nhật `main.py`

- Xử lý graceful khi không có Stable Diffusion
- Chỉ dùng DALL-E nếu không có torch
- Thông báo rõ ràng về models available

---

## 🚀 Cách chạy AI Service

### Option 1: Chạy với DALL-E (khuyến nghị)

```bash
cd ai-service
pip install -r requirements-minimal.txt
python main.py
```

**Yêu cầu:**
- Có `OPENAI_API_KEY` trong `.env` (nếu dùng DALL-E)
- Không cần GPU
- Không cần nhiều RAM

### Option 2: Chạy với Stable Diffusion (cần GPU)

```bash
cd ai-service
pip install -r requirements.txt  # Cài đầy đủ
python main.py
```

**Yêu cầu:**
- GPU NVIDIA (khuyến nghị)
- Ít nhất 8GB RAM
- Cài đặt CUDA

---

## 📝 File đã tạo/cập nhật

1. ✅ `requirements-minimal.txt` - Dependencies tối thiểu
2. ✅ `requirements.txt` - Đã cập nhật Pillow >= 10.2.0
3. ✅ `main.py` - Xử lý lỗi tốt hơn

---

## 🎯 Sử dụng

### DALL-E (không cần GPU):

1. Tạo file `.env` trong `ai-service/`:
   ```env
   OPENAI_API_KEY=sk-...
   ```

2. Chạy service:
   ```bash
   python main.py
   ```

3. Service chạy tại: `http://localhost:8000`

### Stable Diffusion (cần GPU):

1. Cài đầy đủ dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Chạy service:
   ```bash
   python main.py
   ```

---

## ⚠️ Lưu ý

- **DALL-E**: Cần API key, trả phí theo usage
- **Stable Diffusion**: Miễn phí, nhưng cần GPU và nhiều RAM
- **Khuyến nghị**: Dùng DALL-E cho development, Stable Diffusion cho production (nếu có GPU)

---

## ✅ Trạng thái

- ✅ Dependencies đã cài đặt thành công
- ✅ AI Service đang chạy tại `http://localhost:8000`
- ✅ Có thể dùng DALL-E (cần API key)
- ⚠️ Stable Diffusion chưa có (cần cài torch)

---

## 🔗 API Endpoints

- `GET /` - Thông tin service và models available
- `GET /health` - Health check
- `POST /generate` - Tạo ảnh từ prompt
- `POST /generate-batch` - Tạo nhiều ảnh

---

**Chúc bạn code vui vẻ! 🚀**

