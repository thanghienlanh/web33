import { SuiWalletConnect } from "../components/SuiWalletConnect";

/**
 * Demo page cho Sui Wallet integration
 */
export function SuiWalletDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Sui Wallet Demo
          </h1>
          <p className="text-gray-400">
            Connect your Sui wallet to view SUI and stSUI balances
          </p>
        </div>
        <SuiWalletConnect />
      </div>
    </div>
  );
}
