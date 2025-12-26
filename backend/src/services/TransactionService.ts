/**
 * Transaction Management Service
 * Track transaction status & history
 */

import {
  TransactionRecord,
  CreateTransactionRecordParams,
} from "../models/TransactionRecord.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory storage
let transactions: Map<string, TransactionRecord> = new Map();

// File storage path
const STORAGE_FILE = path.join(__dirname, "../../data/transactions.json");

/**
 * Load transactions from file
 */
export async function loadTransactions(): Promise<void> {
  try {
    const dataDir = path.dirname(STORAGE_FILE);
    await fs.mkdir(dataDir, { recursive: true });

    const data = await fs.readFile(STORAGE_FILE, "utf-8");
    const txArray = JSON.parse(data) as TransactionRecord[];
    transactions = new Map(txArray.map((t) => [t.txId, t]));
    console.log(`Loaded ${transactions.size} transactions from storage`);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      transactions = new Map();
    } else {
      console.error("Error loading transactions:", error);
      throw error;
    }
  }
}

/**
 * Save transactions to file
 */
async function saveTransactions(): Promise<void> {
  try {
    const txArray = Array.from(transactions.values());
    await fs.writeFile(STORAGE_FILE, JSON.stringify(txArray, null, 2));
  } catch (error) {
    console.error("Error saving transactions:", error);
    throw error;
  }
}

/**
 * Generate unique transaction ID
 */
function generateTxId(): string {
  return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a new transaction record
 */
export async function createTransaction(
  params: CreateTransactionRecordParams
): Promise<TransactionRecord> {
  const now = Date.now();

  const tx: TransactionRecord = {
    txId: generateTxId(),
    txHash: params.txHash,
    chain: params.chain,
    network: params.network,
    type: params.type,
    status: "pending",
    from: params.from,
    to: params.to,
    modelId: params.modelId,
    objectId: params.objectId,
    tokenId: params.tokenId,
    timestamp: now,
    createdAt: now,
    updatedAt: now,
  };

  transactions.set(tx.txId, tx);
  await saveTransactions();

  return tx;
}

/**
 * Update transaction status
 */
export async function updateTransactionStatus(
  txId: string,
  status: "pending" | "success" | "failed",
  error?: string,
  blockNumber?: number
): Promise<TransactionRecord | null> {
  const tx = transactions.get(txId);
  if (!tx) {
    return null;
  }

  const updated: TransactionRecord = {
    ...tx,
    status,
    error,
    blockNumber,
    updatedAt: Date.now(),
  };

  transactions.set(txId, updated);
  await saveTransactions();

  return updated;
}

/**
 * Get transaction by ID
 */
export function getTransactionById(txId: string): TransactionRecord | null {
  return transactions.get(txId) || null;
}

/**
 * Get transaction by hash
 */
export function getTransactionByHash(txHash: string): TransactionRecord | null {
  for (const tx of transactions.values()) {
    if (tx.txHash === txHash) {
      return tx;
    }
  }
  return null;
}

/**
 * Get transactions by address
 */
export function getTransactionsByAddress(address: string): TransactionRecord[] {
  return Array.from(transactions.values()).filter(
    (tx) =>
      tx.from.toLowerCase() === address.toLowerCase() ||
      (tx.to && tx.to.toLowerCase() === address.toLowerCase())
  );
}

/**
 * Get transactions by model
 */
export function getTransactionsByModel(modelId: string): TransactionRecord[] {
  return Array.from(transactions.values()).filter(
    (tx) => tx.modelId === modelId
  );
}

/**
 * Get all transactions
 */
export function getAllTransactions(): TransactionRecord[] {
  return Array.from(transactions.values()).sort(
    (a, b) => b.timestamp - a.timestamp
  );
}

// Initialize on module load
loadTransactions().catch(console.error);
