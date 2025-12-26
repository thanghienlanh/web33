import { useState } from "react";
import {
  useCurrentWallet,
  useWallets,
  useConnectWallet,
  useDisconnectWallet,
} from "@mysten/dapp-kit";
import type { WalletWithRequiredFeatures } from "@mysten/wallet-standard";
import {
  Wallet,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import {
  SUPPORTED_WALLETS,
  getWalletDisplayName,
} from "../lib/supportedWallets";

export function SuiConnectButton() {
  const { currentWallet, isConnected, connectionStatus } = useCurrentWallet();
  const wallets = useWallets();
  const { mutate: connect, isPending, error } = useConnectWallet();
  const { mutate: disconnect } = useDisconnectWallet();
  const [showDropdown, setShowDropdown] = useState(false);

  // Check if Sui wallet is available
  // useWallets() already returns only available wallets
  const suiWallets = wallets;
  const hasSuiWallet = suiWallets.length > 0;

  if (isConnected && currentWallet) {
    return (
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
        <div className="flex items-center justify-center sm:justify-start space-x-2 px-3 py-2 glass rounded-lg">
          <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
          <div className="text-xs sm:text-sm text-gray-300 text-center sm:text-left">
            {currentWallet.accounts[0]?.address.slice(0, 6)}...
            {currentWallet.accounts[0]?.address.slice(-4)}
          </div>
        </div>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors touch-manipulation min-h-[44px] text-sm sm:text-base whitespace-nowrap"
        >
          Ngắt kết nối
        </button>
      </div>
    );
  }

  const handleConnect = (wallet: WalletWithRequiredFeatures) => {
    try {
      connect({ wallet });
      setShowDropdown(false);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  return (
    <div className="relative w-full sm:w-auto">
      <button
        onClick={() => {
          if (!hasSuiWallet) {
            window.open(
              "https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil",
              "_blank"
            );
            return;
          }
          if (suiWallets.length === 1) {
            handleConnect(suiWallets[0]);
          } else {
            setShowDropdown(!showDropdown);
          }
        }}
        disabled={isPending || connectionStatus === "connecting"}
        className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[44px] text-sm sm:text-base font-semibold"
      >
        <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="whitespace-nowrap">
          {isPending || connectionStatus === "connecting"
            ? "Đang kết nối..."
            : "Kết nối Sui Wallet"}
        </span>
        {suiWallets.length > 1 && (
          <ChevronDown className="w-4 h-4 hidden sm:block" />
        )}
      </button>

      {/* Error message */}
      {error && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-red-600 text-white text-sm rounded-lg p-2 z-50">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error.message || "Lỗi kết nối ví"}</span>
          </div>
        </div>
      )}

      {/* Dropdown menu */}
      {showDropdown && suiWallets.length > 1 && (
        <div className="absolute top-full mt-2 right-0 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 min-w-[200px]">
          {suiWallets.map((wallet: WalletWithRequiredFeatures) => {
            const displayName = getWalletDisplayName(wallet.name);
            const walletInfo = SUPPORTED_WALLETS.find(
              (w) => w.name.toLowerCase() === wallet.name.toLowerCase()
            );
            return (
              <button
                key={wallet.name}
                onClick={() => handleConnect(wallet)}
                className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors flex items-center space-x-2 first:rounded-t-lg last:rounded-b-lg"
              >
                <Wallet className="w-4 h-4" />
                <div className="flex items-center space-x-2 flex-1">
                  <span className="text-white">{displayName}</span>
                  {walletInfo?.isOfficial && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-blue-600/20 text-blue-400 rounded">
                      Chính thức
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Sui wallet not installed message */}
      {!hasSuiWallet && !isConnected && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 p-4 min-w-[300px]">
          <div className="flex items-center space-x-2 mb-3">
            <AlertCircle className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 text-sm font-semibold">
              Chưa phát hiện ví Sui
            </span>
          </div>
          <p className="text-gray-400 text-xs mb-3">Các ví được hỗ trợ:</p>
          <div className="space-y-1.5">
            {SUPPORTED_WALLETS.map((wallet) => (
              <a
                key={wallet.name}
                href={wallet.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-2 py-1.5 bg-gray-700/50 hover:bg-gray-700 rounded text-xs group"
              >
                <div className="flex items-center space-x-2">
                  <Wallet className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-300 group-hover:text-white">
                    {wallet.displayName}
                  </span>
                  {wallet.isOfficial && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-blue-600/20 text-blue-400 rounded">
                      ✓
                    </span>
                  )}
                </div>
                <ExternalLink className="w-3 h-3 text-gray-500" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
