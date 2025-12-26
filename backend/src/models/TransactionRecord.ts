/**
 * Transaction Record Interface
 * Lưu lịch sử transaction để track status
 */

export interface TransactionRecord {
  txId: string; // Unique transaction ID
  txHash: string; // Blockchain transaction hash
  chain: "ethereum" | "sui";
  network: "mainnet" | "testnet" | "devnet" | "local";
  type: "mint" | "transfer" | "list" | "buy" | "cancel";
  status: "pending" | "success" | "failed";
  from: string; // Sender address
  to?: string; // Receiver address
  modelId?: string; // Related model ID
  objectId?: string; // Sui object ID
  tokenId?: string; // Ethereum token ID
  error?: string; // Error message if failed
  blockNumber?: number;
  timestamp: number; // Unix timestamp
  createdAt: number;
  updatedAt: number;
}

export interface CreateTransactionRecordParams {
  txHash: string;
  chain: "ethereum" | "sui";
  network: "mainnet" | "testnet" | "devnet" | "local";
  type: "mint" | "transfer" | "list" | "buy" | "cancel";
  from: string;
  to?: string;
  modelId?: string;
  objectId?: string;
  tokenId?: string;
}
