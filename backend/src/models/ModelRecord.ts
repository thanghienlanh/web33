/**
 * Model Record Interface
 * Lưu mapping: modelId ↔ tokenId/objectId ↔ owner ↔ chain
 */

export interface ModelRecord {
  // Internal ID
  modelId: string;

  // Blockchain identifiers
  tokenId?: string; // Ethereum token ID
  objectId?: string; // Sui object ID
  txHash?: string; // Transaction hash

  // Owner information
  owner: string; // Owner address
  creator: string; // Creator address

  // Chain information
  chain: "ethereum" | "sui";
  network: "mainnet" | "testnet" | "devnet" | "local";

  // Model metadata
  name: string;
  description: string;
  modelType: string;
  prompt?: string;

  // IPFS information
  ipfsMetadataCid?: string; // ipfs://CID của metadata JSON
  ipfsImageCid?: string; // ipfs://CID của image
  ipfsFileCid?: string; // ipfs://CID của model file

  // Additional metadata
  royaltyPercentage: number;
  price?: number;
  isListed: boolean;

  // Timestamps
  createdAt: number; // Unix timestamp
  updatedAt: number; // Unix timestamp
}

export interface CreateModelRecordParams {
  objectId?: string;
  tokenId?: string;
  txHash?: string;
  owner: string;
  creator: string;
  chain: "ethereum" | "sui";
  network: "mainnet" | "testnet" | "devnet" | "local";
  name: string;
  description: string;
  modelType: string;
  prompt?: string;
  ipfsMetadataCid?: string;
  ipfsImageCid?: string;
  ipfsFileCid?: string;
  royaltyPercentage: number;
  price?: number;
}
