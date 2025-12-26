/**
 * Danh sách các ví Sui được hỗ trợ
 */
export interface SupportedWallet {
  name: string;
  displayName: string;
  downloadUrl: string;
  isOfficial?: boolean;
}

/**
 * Các ví Sui được hỗ trợ trong ứng dụng
 */
export const SUPPORTED_WALLETS: SupportedWallet[] = [
  {
    name: "Sui Wallet",
    displayName: "Sui Wallet (Chính thức)",
    downloadUrl:
      "https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil",
    isOfficial: true,
  },
];

/**
 * Lấy thông tin ví theo tên
 */
export function getWalletInfo(walletName: string): SupportedWallet | undefined {
  return SUPPORTED_WALLETS.find(
    (wallet) => wallet.name.toLowerCase() === walletName.toLowerCase()
  );
}

/**
 * Lấy display name đẹp cho ví
 * Nếu không tìm thấy trong danh sách, trả về tên gốc
 */
export function getWalletDisplayName(walletName: string): string {
  const walletInfo = getWalletInfo(walletName);
  return walletInfo?.displayName || walletName;
}
