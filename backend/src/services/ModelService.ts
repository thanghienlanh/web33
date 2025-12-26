/**
 * Model Management Service
 * Quản lý mapping modelId ↔ tokenId/objectId ↔ owner ↔ chain
 */

import { ModelRecord, CreateModelRecordParams } from "../models/ModelRecord.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory storage
let models: Map<string, ModelRecord> = new Map();

// File storage path
const STORAGE_FILE = path.join(__dirname, "../../data/models.json");

/**
 * Load models from file
 */
export async function loadModels(): Promise<void> {
  try {
    // Ensure data directory exists
    const dataDir = path.dirname(STORAGE_FILE);
    await fs.mkdir(dataDir, { recursive: true });

    const data = await fs.readFile(STORAGE_FILE, "utf-8");
    const modelsArray = JSON.parse(data) as ModelRecord[];
    models = new Map(modelsArray.map((m) => [m.modelId, m]));
    console.log(`Loaded ${models.size} models from storage`);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      // File doesn't exist, start with empty storage
      console.log("No existing models file, starting fresh");
      models = new Map();
    } else {
      console.error("Error loading models:", error);
      throw error;
    }
  }
}

/**
 * Save models to file
 */
async function saveModels(): Promise<void> {
  try {
    const modelsArray = Array.from(models.values());
    await fs.writeFile(STORAGE_FILE, JSON.stringify(modelsArray, null, 2));
  } catch (error) {
    console.error("Error saving models:", error);
    throw error;
  }
}

/**
 * Generate unique model ID
 */
function generateModelId(): string {
  return `model_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a new model record
 */
export async function createModel(
  params: CreateModelRecordParams
): Promise<ModelRecord> {
  const now = Date.now();

  const model: ModelRecord = {
    modelId: generateModelId(),
    tokenId: params.tokenId,
    objectId: params.objectId,
    txHash: params.txHash,
    owner: params.owner,
    creator: params.creator,
    chain: params.chain,
    network: params.network,
    name: params.name,
    description: params.description,
    modelType: params.modelType,
    prompt: params.prompt,
    ipfsMetadataCid: params.ipfsMetadataCid,
    ipfsImageCid: params.ipfsImageCid,
    ipfsFileCid: params.ipfsFileCid,
    royaltyPercentage: params.royaltyPercentage,
    price: params.price,
    isListed: false,
    createdAt: now,
    updatedAt: now,
  };

  models.set(model.modelId, model);
  await saveModels();

  return model;
}

/**
 * Get model by ID
 */
export function getModelById(modelId: string): ModelRecord | null {
  return models.get(modelId) || null;
}

/**
 * Get model by objectId (Sui)
 */
export function getModelByObjectId(objectId: string): ModelRecord | null {
  for (const model of models.values()) {
    if (model.objectId === objectId) {
      return model;
    }
  }
  return null;
}

/**
 * Get model by tokenId (Ethereum)
 */
export function getModelByTokenId(tokenId: string): ModelRecord | null {
  for (const model of models.values()) {
    if (model.tokenId === tokenId) {
      return model;
    }
  }
  return null;
}

/**
 * Get models by owner
 */
export function getModelsByOwner(owner: string): ModelRecord[] {
  return Array.from(models.values()).filter(
    (m) => m.owner.toLowerCase() === owner.toLowerCase()
  );
}

/**
 * Get models by creator
 */
export function getModelsByCreator(creator: string): ModelRecord[] {
  return Array.from(models.values()).filter(
    (m) => m.creator.toLowerCase() === creator.toLowerCase()
  );
}

/**
 * Get all models
 */
export function getAllModels(): ModelRecord[] {
  return Array.from(models.values());
}

/**
 * Update model
 */
export async function updateModel(
  modelId: string,
  updates: Partial<ModelRecord>
): Promise<ModelRecord | null> {
  const model = models.get(modelId);
  if (!model) {
    return null;
  }

  const updated: ModelRecord = {
    ...model,
    ...updates,
    updatedAt: Date.now(),
  };

  models.set(modelId, updated);
  await saveModels();

  return updated;
}

/**
 * Delete model
 */
export async function deleteModel(modelId: string): Promise<boolean> {
  const deleted = models.delete(modelId);
  if (deleted) {
    await saveModels();
  }
  return deleted;
}

// Initialize on module load
loadModels().catch(console.error);
