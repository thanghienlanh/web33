/**
 * Coin Type Configuration
 *
 * COIN_TYPE_STSUI: Địa chỉ coin type cho stSUI token
 *
 * LƯU Ý: Cần thay đổi giá trị này theo token stSUI thực tế trên Sui network
 *
 * Cách tìm COIN_TYPE_STSUI:
 * 1. Kiểm tra trên Sui Explorer: https://suiexplorer.com/
 * 2. Tìm package address của stSUI token
 * 3. Format: `{package_address}::stSUI::stSUI`
 *
 * Ví dụ format:
 * - Native SUI: "0x2::sui::SUI"
 * - stSUI: "0x{package_address}::stSUI::stSUI"
 */

// Native SUI coin type
export const COIN_TYPE_SUI = "0x2::sui::SUI";

/**
 * stSUI Coin Type
 *
 * TODO: Thay đổi giá trị này theo stSUI token thực tế
 *
 * Để tìm đúng coin type:
 * 1. Vào Sui Explorer (https://suiexplorer.com/)
 * 2. Tìm token stSUI trên testnet/mainnet
 * 3. Copy coin type từ token metadata
 *
 * Hoặc có thể tìm trong documentation của stSUI protocol
 */
export const COIN_TYPE_STSUI =
  "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93b6::stSUI::stSUI";

/**
 * Helper để format coin type
 */
export function formatCoinType(
  packageAddress: string,
  module: string,
  struct: string
): string {
  return `${packageAddress}::${module}::${struct}`;
}
