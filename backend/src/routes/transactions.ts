/**
 * Transaction Routes
 * Track transaction status & history
 */

import { Router } from "express";
import {
  createTransaction,
  getTransactionById,
  getTransactionByHash,
  getTransactionsByAddress,
  getTransactionsByModel,
  getAllTransactions,
  updateTransactionStatus,
} from "../services/TransactionService.js";

const router = Router();

/**
 * Get all transactions
 */
router.get("/", async (req, res) => {
  try {
    const { address, modelId, status, chain, network } = req.query;

    let transactions;
    if (address) {
      transactions = getTransactionsByAddress(address as string);
    } else if (modelId) {
      transactions = getTransactionsByModel(modelId as string);
    } else {
      transactions = getAllTransactions();
    }

    // Filter by status
    if (status) {
      transactions = transactions.filter((tx) => tx.status === status);
    }

    // Filter by chain
    if (chain) {
      transactions = transactions.filter((tx) => tx.chain === chain);
    }

    // Filter by network
    if (network) {
      transactions = transactions.filter((tx) => tx.network === network);
    }

    res.json({ transactions, count: transactions.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get transaction by ID
 */
router.get("/:txId", async (req, res) => {
  try {
    const { txId } = req.params;
    const tx = getTransactionById(txId);

    if (!tx) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json({ transaction: tx });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get transaction by hash
 */
router.get("/hash/:txHash", async (req, res) => {
  try {
    const { txHash } = req.params;
    const tx = getTransactionByHash(txHash);

    if (!tx) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json({ transaction: tx });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Create new transaction record
 */
router.post("/", async (req, res) => {
  try {
    const {
      txHash,
      chain,
      network,
      type,
      from,
      to,
      modelId,
      objectId,
      tokenId,
    } = req.body;

    if (!txHash || !chain || !type || !from) {
      return res.status(400).json({
        error: "Missing required fields: txHash, chain, type, from",
      });
    }

    const tx = await createTransaction({
      txHash,
      chain,
      network: network || "testnet",
      type,
      from,
      to,
      modelId,
      objectId,
      tokenId,
    });

    res.status(201).json({ transaction: tx });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Update transaction status
 */
router.put("/:txId/status", async (req, res) => {
  try {
    const { txId } = req.params;
    const { status, error, blockNumber } = req.body;

    if (!status || !["pending", "success", "failed"].includes(status)) {
      return res.status(400).json({
        error: "Invalid status. Must be: pending, success, or failed",
      });
    }

    const updated = await updateTransactionStatus(
      txId,
      status,
      error,
      blockNumber
    );

    if (!updated) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json({ transaction: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export { router as transactionRouter };
