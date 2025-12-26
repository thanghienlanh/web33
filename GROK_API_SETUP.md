# 🔧 Hướng dẫn Setup Grok API

## ✅ Đã cập nhật code để hỗ trợ Grok API!

---

## 📝 Lưu ý quan trọng

**Grok không có image generation trực tiếp!**

Grok là text model, không phải image generation model. Tuy nhiên, code đã được cập nhật để:
1. **Dùng Grok để enhance prompt** - Tạo prompt chi tiết và tối ưu hơn
2. **Sau đó dùng prompt đó với Stable Diffusion hoặc DALL-E** để generate ảnh

---

## 🚀 Cách setup

### Bước 1: Lấy Grok API Key

1. Truy cập: https://console.x.ai
2. Đăng nhập/Đăng ký tài khoản
3. Vào phần **API Keys**
4. Tạo API key mới
5. Copy API key

### Bước 2: Cấu hình trong dự án

Tạo file `ai-service/.env`:

```env
# Grok API Key (xAI)
XAI_API_KEY=xai-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Hoặc dùng tên này (cả 2 đều được)
GROK_API_KEY=xai-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional: Nếu muốn dùng DALL-E sau khi enhance prompt
OPENAI_API_KEY=sk-...
```

### Bước 3: Restart AI Service

```bash
cd ai-service
python main.py
```

---

## 🎯 Cách sử dụng

### Trong Frontend:

Khi tạo ảnh, chọn model type là **"grok"**:

```json
{
  "prompt": "a cat",
  "model_type": "grok",
  "width": 512,
  "height": 512
}
```

### Flow hoạt động:

```
User prompt: "a cat"
    ↓
Grok enhance: "a beautiful orange tabby cat sitting on a windowsill, 
               soft natural lighting, photorealistic, detailed fur texture, 
               bokeh background, 4k quality"
    ↓
Stable Diffusion hoặc DALL-E generate ảnh
    ↓
Return image
```

---

## 🔄 Fallback Logic

1. **Ưu tiên 1:** Stable Diffusion (nếu đã cài torch, diffusers)
2. **Ưu tiên 2:** DALL-E (nếu có OPENAI_API_KEY)
3. **Lỗi:** Nếu cả 2 đều không có

---

## 📊 So sánh

| Model | Image Generation | Cost | Quality |
|-------|------------------|------|---------|
| **Grok** | ❌ Không (chỉ enhance prompt) | Trả phí | Prompt tốt hơn |
| **Stable Diffusion** | ✅ Có | Miễn phí | Tốt |
| **DALL-E** | ✅ Có | Trả phí | Rất tốt |

---

## 💡 Tại sao dùng Grok?

- ✅ **Prompt tốt hơn:** Grok hiểu context và tạo prompt chi tiết hơn
- ✅ **Kết hợp tốt:** Grok enhance + Stable Diffusion = Ảnh đẹp hơn
- ✅ **Linh hoạt:** Có thể dùng với cả Stable Diffusion và DALL-E

---

## 🧪 Test API

### Test với curl:

```bash
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "a cat",
    "model_type": "grok",
    "width": 512,
    "height": 512
  }'
```

### Test trong Python:

```python
import requests

response = requests.post(
    "http://localhost:8000/generate",
    json={
        "prompt": "a beautiful sunset",
        "model_type": "grok",
        "width": 512,
        "height": 512
    }
)

result = response.json()
print(result)
```

---

## ⚠️ Troubleshooting

### Lỗi: "XAI_API_KEY not found"

**Giải pháp:**
1. Tạo file `ai-service/.env`
2. Thêm: `XAI_API_KEY=your_key_here`
3. Restart service

### Lỗi: "Grok API error: 401"

**Giải pháp:**
- API key không đúng hoặc đã hết hạn
- Kiểm tra lại key tại https://console.x.ai

### Lỗi: "Neither Stable Diffusion nor DALL-E is available"

**Giải pháp:**
- Cài Stable Diffusion: `pip install torch torchvision transformers diffusers`
- Hoặc thêm `OPENAI_API_KEY` để dùng DALL-E

---

## 📚 Tài liệu tham khảo

- **Grok API Docs:** https://docs.x.ai
- **xAI Console:** https://console.x.ai
- **API Pricing:** Xem tại console

---

## ✅ Checklist

- [ ] Đã tạo tài khoản xAI
- [ ] Đã lấy API key
- [ ] Đã tạo file `ai-service/.env`
- [ ] Đã thêm `XAI_API_KEY` vào `.env`
- [ ] Đã restart AI service
- [ ] Đã test với model_type="grok"

---

**Chúc bạn code vui vẻ! 🚀**

