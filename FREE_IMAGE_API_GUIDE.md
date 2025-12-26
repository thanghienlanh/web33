# 🆓 Hướng dẫn sử dụng API tạo ảnh MIỄN PHÍ

## ✅ Đã tích hợp các API miễn phí!

Dự án hiện hỗ trợ **2 API hoàn toàn miễn phí** để tạo ảnh:

---

## 🎯 Option 1: Pollinations.ai (100% FREE - Khuyến nghị!)

### ✨ Đặc điểm:
- ✅ **Hoàn toàn miễn phí** - Không cần API key
- ✅ **Không giới hạn** - Tạo bao nhiêu ảnh cũng được
- ✅ **Chất lượng tốt** - Dùng Stable Diffusion
- ✅ **Không cần đăng ký** - Dùng ngay
- ✅ **Nhanh** - API response nhanh

### 🚀 Cách sử dụng:

**Trong Frontend:**
- Chọn model type: **"pollinations"** (hoặc để mặc định)
- Nhập prompt và tạo ảnh

**Trong API:**
```json
{
  "prompt": "a beautiful sunset",
  "model_type": "pollinations",
  "width": 512,
  "height": 512
}
```

### 📝 Ví dụ:
```
Prompt: "a cat sitting on a windowsill"
→ Tạo ảnh miễn phí ngay lập tức!
```

---

## 🎯 Option 2: Hugging Face Inference API (FREE tier)

### ✨ Đặc điểm:
- ✅ **Free tier** - 1000 requests/tháng miễn phí
- ✅ **Chất lượng cao** - Dùng Stable Diffusion 2.1
- ✅ **Ổn định** - Từ Hugging Face
- ⚠️ **Cần API key** - Nhưng lấy miễn phí

### 🚀 Cách setup:

**Bước 1: Lấy API key miễn phí**
1. Truy cập: https://huggingface.co/settings/tokens
2. Đăng ký/Đăng nhập (miễn phí)
3. Tạo token mới (chọn "Read" permission)
4. Copy token

**Bước 2: Thêm vào `.env`**
```env
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Bước 3: Sử dụng**
- Chọn model type: **"huggingface"**
- Nhập prompt và tạo ảnh

### 📊 Giới hạn Free tier:
- **1000 requests/tháng** miễn phí
- Sau đó: $0.002/request (rất rẻ!)

---

## 📊 So sánh các API

| API | Cost | API Key | Quality | Speed | Limit |
|-----|------|---------|---------|-------|-------|
| **Pollinations** | 🆓 FREE | ❌ Không cần | ⭐⭐⭐⭐ | ⚡⚡⚡ | Unlimited |
| **Hugging Face** | 🆓 FREE tier | ✅ Cần (free) | ⭐⭐⭐⭐⭐ | ⚡⚡ | 1000/month |
| **Stable Diffusion** | 🆓 FREE | ❌ Không cần | ⭐⭐⭐⭐ | ⚡ | Cần GPU |
| **DALL-E** | 💰 Paid | ✅ Cần | ⭐⭐⭐⭐⭐ | ⚡⚡⚡ | Paid |
| **Grok** | 💰 Paid | ✅ Cần | ⭐⭐⭐⭐ | ⚡⚡ | Paid |

---

## 🎯 Khuyến nghị

### Cho Development/Testing:
👉 **Dùng Pollinations.ai** - Không cần setup gì, dùng ngay!

### Cho Production:
👉 **Dùng Hugging Face** - Ổn định hơn, có free tier tốt

### Cho chất lượng cao nhất:
👉 **Dùng Stable Diffusion local** (nếu có GPU) hoặc **DALL-E** (nếu có budget)

---

## 🚀 Cách test

### Test Pollinations (Không cần API key):

```bash
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "a beautiful sunset over mountains",
    "model_type": "pollinations",
    "width": 512,
    "height": 512
  }'
```

### Test Hugging Face (Cần API key):

1. Thêm `HUGGINGFACE_API_KEY` vào `.env`
2. Restart AI service
3. Test:
```bash
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "a beautiful sunset over mountains",
    "model_type": "huggingface",
    "width": 512,
    "height": 512
  }'
```

---

## 💻 Code Example

### Python:
```python
import requests

# Pollinations (FREE, no API key)
response = requests.post(
    "http://localhost:8000/generate",
    json={
        "prompt": "a cat",
        "model_type": "pollinations",
        "width": 512,
        "height": 512
    }
)

result = response.json()
print(result)
```

### JavaScript:
```javascript
const response = await fetch('http://localhost:8000/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'a cat',
    model_type: 'pollinations',
    width: 512,
    height: 512
  })
});

const result = await response.json();
console.log(result);
```

---

## 🔧 Cấu hình Frontend

Frontend đã được cập nhật để hỗ trợ các model mới:

1. Mở trang "Tạo mô hình"
2. Dropdown sẽ có:
   - **Pollinations (FREE)** ← Khuyến nghị!
   - **Hugging Face (FREE)**
   - Grok (Khuyến nghị) - Cần API key
   - Stable Diffusion
   - DALL-E

---

## ⚠️ Lưu ý

### Pollinations.ai:
- ✅ Hoàn toàn miễn phí
- ✅ Không cần API key
- ⚠️ Có thể chậm nếu server đông
- ⚠️ Có watermark nhỏ (có thể tắt bằng `nologo=true`)

### Hugging Face:
- ✅ Free tier tốt (1000 requests/tháng)
- ✅ Chất lượng cao
- ⚠️ Cần đăng ký và lấy API key
- ⚠️ Có thể phải đợi model load lần đầu (cold start)

---

## 📚 Tài liệu tham khảo

- **Pollinations.ai**: https://pollinations.ai
- **Hugging Face**: https://huggingface.co/docs/api-inference
- **Hugging Face Tokens**: https://huggingface.co/settings/tokens

---

## ✅ Checklist

- [x] Pollinations.ai đã tích hợp (100% FREE)
- [x] Hugging Face API đã tích hợp (FREE tier)
- [x] Frontend đã cập nhật
- [x] Tài liệu đã tạo
- [ ] Test với Pollinations
- [ ] Test với Hugging Face (nếu có API key)

---

## 🎉 Kết luận

Bây giờ bạn có **2 lựa chọn miễn phí** để tạo ảnh:

1. **Pollinations.ai** - Dùng ngay, không cần setup gì! 🚀
2. **Hugging Face** - Chất lượng cao, cần API key (free)

**Khuyến nghị:** Dùng **Pollinations** cho development và testing! 🎯

---

**Chúc bạn code vui vẻ! 🚀**

