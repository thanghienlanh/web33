import { Wallet, Coins, Loader2, AlertCircle } from "lucide-react";
import { useBalances } from "../features/balances/useBalances";

interface BalanceCardsProps {
  address: string;
}

/**
 * Component hiển thị balance cards
 */
export function BalanceCards({ address }: BalanceCardsProps) {
  const { data, isLoading, error } = useBalances(address);

  // Format address để hiển thị
  const formattedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="space-y-4">
      {/* Address Card */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-lg">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm text-gray-400">Wallet Address</h3>
            <p className="text-lg font-mono text-white">{formattedAddress}</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 font-mono mt-2 break-all">
          {address}
        </p>
      </div>

      {/* SUI Balance Card */}
      <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 rounded-xl p-6 border border-blue-700/50 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Coins className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm text-gray-400">SUI Balance</h3>
              {isLoading ? (
                <div className="flex items-center space-x-2 mt-1">
                  <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                  <span className="text-gray-400 text-sm">Loading...</span>
                </div>
              ) : error ? (
                <div className="flex items-center space-x-2 mt-1">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 text-sm">
                    Error loading balance
                  </span>
                </div>
              ) : (
                <p className="text-2xl font-bold text-white mt-1">
                  {data?.sui || "0"}{" "}
                  <span className="text-sm text-gray-400">SUI</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* stSUI Balance Card */}
      <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 rounded-xl p-6 border border-purple-700/50 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Coins className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm text-gray-400">stSUI Balance</h3>
              {isLoading ? (
                <div className="flex items-center space-x-2 mt-1">
                  <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                  <span className="text-gray-400 text-sm">Loading...</span>
                </div>
              ) : error ? (
                <div className="flex items-center space-x-2 mt-1">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 text-sm">
                    Error loading balance
                  </span>
                </div>
              ) : (
                <p className="text-2xl font-bold text-white mt-1">
                  {data?.stSui || "0"}{" "}
                  <span className="text-sm text-gray-400">stSUI</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-400 text-sm">
              {error instanceof Error
                ? error.message
                : "Failed to load balances"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
