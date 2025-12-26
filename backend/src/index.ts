import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ipfsRouter } from "./routes/ipfs.js";
import { modelRouter } from "./routes/model.js";
import { transactionRouter } from "./routes/transactions.js";
import { loadModels } from "./services/ModelService.js";
import { loadTransactions } from "./services/TransactionService.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize storage
loadModels().catch(console.error);
loadTransactions().catch(console.error);

// Routes
app.use("/api/ipfs", ipfsRouter);
app.use("/api/models", modelRouter);
app.use("/api/transactions", transactionRouter);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "TríTuệMarket API is running",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Model storage: ./data/models.json`);
});
