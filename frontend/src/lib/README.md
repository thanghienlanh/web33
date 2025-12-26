# Sui Wallet Integration - Documentation

## Cấu trúc Files

### `suiClient.ts`

- Cấu hình Sui client
- Mặc định sử dụng testnet
- Export `suiClient` instance để sử dụng

### `wallet.ts`

- Hook `useWalletConnection()` để quản lý kết nối wallet
- Cung cấp: connect, disconnect, address, connection status

### `coinTypes.ts`

- **QUAN TRỌNG**: File này chứa COIN_TYPE cho các tokens
- `COIN_TYPE_SUI`: Native SUI token (0x2::sui::SUI)
- `COIN_TYPE_STSUI`: stSUI token - **CẦN THAY ĐỔI** theo token thực tế

## Cách tìm COIN_TYPE_STSUI

1. **Sui Explorer:**

   - Vào https://suiexplorer.com/
   - Tìm token stSUI trên network bạn đang dùng (testnet/mainnet)
   - Xem coin type trong token metadata

2. **Sui CLI:**

   ```bash
   sui client objects --address <your_address>
   ```

3. **Từ Contract:**

   - Tìm package address của stSUI contract
   - Format: `{package_address}::stSUI::stSUI`

4. **Documentation:**
   - Kiểm tra documentation của stSUI protocol
   - Thường có trong whitepaper hoặc GitHub repo

## Ví dụ COIN_TYPE

```typescript
// Native SUI
"0x2::sui::SUI";

// Custom token (ví dụ)
"0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93b6::stSUI::stSUI";
```

## Lưu ý

- COIN_TYPE phải chính xác, nếu sai sẽ không lấy được balance
- Mỗi network (testnet/mainnet) có thể có COIN_TYPE khác nhau
- Nếu token không tồn tại, balance sẽ trả về 0
