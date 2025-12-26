import { useState } from 'react'
import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi'
import { Wallet, ChevronDown, AlertCircle, CheckCircle2 } from 'lucide-react'

export function ConnectButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending, error } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const [showDropdown, setShowDropdown] = useState(false)

  // Check if MetaMask is installed
  const isMetaMaskInstalled = typeof window !== 'undefined' && window.ethereum?.isMetaMask

  if (isConnected && address) {
    return (
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
        <div className="flex items-center justify-center sm:justify-start space-x-2 px-3 py-2 glass rounded-lg">
          <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
          <div className="text-xs sm:text-sm text-gray-300 text-center sm:text-left">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
          {chainId !== 1337 && (
            <div className="flex items-center space-x-1 text-yellow-400 text-xs">
              <AlertCircle className="w-3 h-3" />
              <span className="hidden sm:inline">Sai network</span>
            </div>
          )}
        </div>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors touch-manipulation min-h-[44px] text-sm sm:text-base whitespace-nowrap"
        >
          Ngắt kết nối
        </button>
      </div>
    )
  }

  const handleConnect = (connector: any) => {
    connect({ connector })
    setShowDropdown(false)
  }

  return (
    <div className="relative w-full sm:w-auto">
      <button
        onClick={() => {
          if (!isMetaMaskInstalled && connectors.length === 0) {
            window.open('https://metamask.io/download/', '_blank')
            return
          }
          if (connectors.length === 1) {
            handleConnect(connectors[0])
          } else {
            setShowDropdown(!showDropdown)
          }
        }}
        disabled={isPending}
        className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[44px] text-sm sm:text-base font-semibold"
      >
        <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="whitespace-nowrap">{isPending ? 'Đang kết nối...' : 'Kết nối ví'}</span>
        {connectors.length > 1 && <ChevronDown className="w-4 h-4 hidden sm:block" />}
      </button>

      {/* Error message */}
      {error && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-red-600 text-white text-sm rounded-lg p-2 z-50">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error.message}</span>
          </div>
        </div>
      )}

      {/* Dropdown menu */}
      {showDropdown && connectors.length > 1 && (
        <div className="absolute top-full mt-2 right-0 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 min-w-[200px]">
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => handleConnect(connector)}
              className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors flex items-center space-x-2 first:rounded-t-lg last:rounded-b-lg"
            >
              <Wallet className="w-4 h-4" />
              <span className="text-white">{connector.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* MetaMask not installed message */}
      {!isMetaMaskInstalled && !isConnected && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-yellow-600 text-white text-sm rounded-lg p-2 z-50">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4" />
            <span>
              Chưa có MetaMask?{' '}
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold"
              >
                Tải về ngay
              </a>
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

