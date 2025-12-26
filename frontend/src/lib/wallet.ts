import {
  useCurrentWallet,
  useConnectWallet,
  useDisconnectWallet,
} from "@mysten/dapp-kit";

/**
 * Wallet utilities và hooks
 */

/**
 * Hook để quản lý wallet connection
 */
export function useWalletConnection() {
  const { currentWallet, isConnected, connectionStatus } = useCurrentWallet();
  const {
    mutate: connect,
    isPending: isConnecting,
    error: connectError,
  } = useConnectWallet();
  const { mutate: disconnect, isPending: isDisconnecting } =
    useDisconnectWallet();

  const address = currentWallet?.accounts[0]?.address;

  return {
    address,
    isConnected,
    connectionStatus,
    connect,
    disconnect,
    isConnecting,
    isDisconnecting,
    connectError,
  };
}
