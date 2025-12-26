import {
  ExternalLink,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { useState, useEffect } from "react";

interface TransactionStatusProps {
  txHash: string;
  chain: "ethereum" | "sui";
  network?: "mainnet" | "testnet" | "devnet" | "local";
  status?: "pending" | "success" | "failed";
  onStatusChange?: (status: "pending" | "success" | "failed") => void;
}

export function TransactionStatus({
  txHash,
  chain,
  network = "testnet",
  status: initialStatus = "pending",
  onStatusChange,
}: TransactionStatusProps) {
  const [status, setStatus] = useState<"pending" | "success" | "failed">(
    initialStatus
  );

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  const getExplorerUrl = () => {
    if (chain === "sui") {
      return `https://suiexplorer.com/${network}/txblock/${txHash}`;
    } else {
      // Ethereum
      const explorer =
        network === "mainnet"
          ? "https://etherscan.io"
          : `https://${network}.etherscan.io`;
      return `${explorer}/tx/${txHash}`;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "pending":
        return <Loader2 className="w-5 h-5 animate-spin text-yellow-400" />;
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-400" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "pending":
        return "Đang xử lý...";
      case "success":
        return "Thành công";
      case "failed":
        return "Thất bại";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return "border-yellow-500/30 bg-yellow-900/10";
      case "success":
        return "border-green-500/30 bg-green-900/10";
      case "failed":
        return "border-red-500/30 bg-red-900/10";
    }
  };

  return (
    <div
      className={`glass rounded-xl p-4 border ${getStatusColor()} transition-all`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <p className="text-white font-semibold text-sm">
              {getStatusText()}
            </p>
            <p className="text-gray-400 text-xs font-mono break-all">
              {txHash.slice(0, 10)}...{txHash.slice(-8)}
            </p>
          </div>
        </div>
        <a
          href={getExplorerUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 transition-colors"
          title="Xem trên Explorer"
        >
          <ExternalLink className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}
