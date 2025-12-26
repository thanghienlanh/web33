# Hướng dẫn chạy Scripts trên Windows

## 🚀 Cách chạy Scripts đúng trên Windows

### ❌ SAI: PowerShell
```powershell
# KHÔNG dùng PowerShell để chạy .bat files
./deploy-and-verify.bat  # Sẽ lỗi
```

### ✅ ĐÚNG: Command Prompt (cmd)

#### Cách 1: Mở cmd và chạy
```cmd
# Mở Command Prompt
# Chuyển đến thư mục dự án
cd D:\Web33\sui-contracts

# Chạy script
deploy-and-verify.bat
```

#### Cách 2: Chạy trực tiếp từ Explorer
```
1. Mở File Explorer
2. Vào thư mục D:\Web33\sui-contracts
3. Double-click file deploy-and-verify.bat
```

#### Cách 3: Từ VS Code Terminal
```bash
# Trong VS Code, mở terminal (Ctrl + `)
# Đảm bảo đang dùng Command Prompt, không phải PowerShell

# Chuyển đến thư mục
cd sui-contracts

# Chạy script
deploy-and-verify.bat
```

## 🔧 Kiểm tra Terminal Type

### Trong VS Code:
1. Mở Command Palette: `Ctrl + Shift + P`
2. Gõ: `Terminal: Select Default Profile`
3. Chọn: `Command Prompt` thay vì `PowerShell`

### Hoặc trong terminal, kiểm tra:
```cmd
# Nếu thấy C:\Users\...> thì là Command Prompt ✅
# Nếu thấy PS C:\...> thì là PowerShell ❌
```

## 📋 Các Scripts có sẵn:

### Deploy + Verify
```cmd
cd sui-contracts
deploy-and-verify.bat
```

### Chỉ Verify (đã deploy)
```cmd
cd sui-contracts
verify-contract.bat          # Testnet
verify-contract-mainnet.bat  # Mainnet
```

### Build và Deploy
```cmd
cd sui-contracts
scripts\deploy.bat
```

## 🎯 Troubleshooting

### Lỗi: "'deploy-and-verify.bat' is not recognized"
**Giải pháp:**
- Đảm bảo đang dùng Command Prompt, không phải PowerShell
- Chuyển đến thư mục đúng: `cd sui-contracts`
- File phải tồn tại: `dir deploy-and-verify.bat`

### Lỗi: "sui command not found"
**Giải pháp:**
- Đảm bảo Sui CLI đã cài đặt
- Restart Command Prompt
- Hoặc thêm Sui vào PATH

### Lỗi: "Build failed"
**Giải pháp:**
- Kiểm tra Move.toml
- Đảm bảo dependencies đã cài
- Chạy: `sui move build` riêng để debug

## 💡 Tips

- **Luôn dùng Command Prompt** cho .bat files
- **PowerShell** chỉ dành cho .ps1 scripts
- **Double-click** file .bat từ Explorer cũng được
- **VS Code**: Thay đổi default terminal thành Command Prompt
