import { useState } from "react";
import { useWallets } from "@mysten/dapp-kit";
import {
  Wallet,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { useWalletConnection } from "../lib/wallet";
import { BalanceCards } from "./BalanceCards";
import {
  SUPPORTED_WALLETS,
  getWalletDisplayName,
} from "../lib/supportedWallets";

/**
 * Component chính để kết nối Sui wallet và hiển thị balances
 */
export function SuiWalletConnect() {
  const {
    address,
    isConnected,
    connect,
    disconnect,
    isConnecting,
    isDisconnecting,
    connectError,
  } = useWalletConnection();
  const wallets = useWallets();
  const [showWalletList, setShowWalletList] = useState(false);

  // Nếu đã kết nối, hiển thị balance cards
  if (isConnected && address) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Connected Status */}
        <div className="bg-green-900/20 border border-green-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-green-400 font-semibold">Wallet Connected</p>
                <p className="text-gray-400 text-sm font-mono">
                  {address.slice(0, 10)}...{address.slice(-8)}
                </p>
              </div>
            </div>
            <button
              onClick={() => disconnect()}
              disabled={isDisconnecting}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isDisconnecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Disconnecting...</span>
                </>
              ) : (
                <span>Disconnect</span>
              )}
            </button>
          </div>
        </div>

        {/* Balance Cards */}
        <BalanceCards address={address} />
      </div>
    );
  }

  // Hiển thị nút connect
  // useWallets() đã trả về các wallet đã cài đặt
  const availableWallets = wallets;

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700 shadow-lg">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Connect Sui Wallet
          </h2>
          <p className="text-gray-400 text-sm">
            Connect your Sui wallet to view your SUI and stSUI balances
          </p>
        </div>

        <div className="space-y-3">
          {/* Button chính - luôn hiển thị */}
          <button
            onClick={() => {
              if (availableWallets.length === 0) {
                // Nếu không có ví, hiện danh sách download
                setShowWalletList(!showWalletList);
              } else if (availableWallets.length === 1) {
                // Nếu có 1 ví, connect luôn
                try {
                  connect({ wallet: availableWallets[0] });
                } catch (error) {
                  console.error("Error connecting wallet:", error);
                }
              } else {
                // Nếu có nhiều ví, hiện menu chọn
                setShowWalletList(!showWalletList);
              }
            }}
            disabled={isConnecting}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Đang kết nối...</span>
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5" />
                <span>Kết nối Sui Wallet</span>
              </>
            )}
          </button>

          {/* Dropdown menu - chỉ hiện khi click */}
          {showWalletList && (
            <div className="space-y-2 mt-2 animate-slideIn">
              {availableWallets.length === 0 ? (
                // Danh sách download nếu chưa có ví
                <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    <p className="text-yellow-400 text-sm font-semibold">
                      Chưa phát hiện ví Sui nào
                    </p>
                  </div>
                  <p className="text-gray-400 text-xs mb-3">
                    Vui lòng cài đặt một trong các ví sau:
                  </p>
                  <div className="space-y-2">
                    {SUPPORTED_WALLETS.map((wallet) => (
                      <a
                        key={wallet.name}
                        href={wallet.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors group"
                      >
                        <div className="flex items-center space-x-2">
                          <Wallet className="w-4 h-4 text-gray-400 group-hover:text-white" />
                          <span className="text-sm text-gray-300 group-hover:text-white">
                            {wallet.displayName}
                          </span>
                          {wallet.isOfficial && (
                            <span className="text-xs px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded">
                              Chính thức
                            </span>
                          )}
                        </div>
                        <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-gray-300" />
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                // Danh sách ví để chọn nếu có nhiều ví
                availableWallets.map((wallet) => {
                  const displayName = getWalletDisplayName(wallet.name);
                  const walletInfo = SUPPORTED_WALLETS.find(
                    (w) => w.name.toLowerCase() === wallet.name.toLowerCase()
                  );
                  return (
                    <button
                      key={wallet.name}
                      onClick={() => {
                        try {
                          connect({ wallet });
                          setShowWalletList(false);
                        } catch (error) {
                          console.error("Error connecting wallet:", error);
                        }
                      }}
                      disabled={isConnecting}
                      className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-between disabled:opacity-50"
                    >
                      <div className="flex items-center space-x-2">
                        <Wallet className="w-4 h-4" />
                        <span>{displayName}</span>
                        {walletInfo?.isOfficial && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-blue-600/20 text-blue-400 rounded">
                            ✓
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Error Message */}
        {connectError && (
          <div className="mt-4 bg-red-900/20 border border-red-700/50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-400 text-sm">
                {connectError.message || "Failed to connect wallet"}
              </p>
            </div>
          </div>
        )}

        {/* Network Info */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center">
            Network: <span className="text-gray-400 font-mono">Testnet</span>
          </p>
        </div>
      </div>
    </div>
  );
}
