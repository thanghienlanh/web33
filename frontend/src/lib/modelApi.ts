/**
 * Model API Client
 * Giao tiếp với backend để quản lý models
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export interface ModelRecord {
  modelId: string;
  tokenId?: string;
  objectId?: string;
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
  isListed: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface CreateModelParams {
  objectId?: string;
  tokenId?: string;
  txHash?: string;
  owner: string;
  creator: string;
  chain: "ethereum" | "sui";
  network?: "mainnet" | "testnet" | "devnet" | "local";
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

/**
 * Create model record in backend
 */
export async function createModelRecord(
  params: CreateModelParams
): Promise<ModelRecord> {
  const response = await fetch(`${API_URL}/models`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || "Failed to create model record");
  }

  const data = await response.json();
  return data.model;
}

/**
 * Get model by ID
 */
export async function getModelById(
  modelId: string
): Promise<ModelRecord | null> {
  try {
    const response = await fetch(`${API_URL}/models/id/${modelId}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data.model;
  } catch (error) {
    console.error("Error fetching model:", error);
    return null;
  }
}

/**
 * Get model by objectId (Sui)
 */
export async function getModelByObjectId(
  objectId: string
): Promise<ModelRecord | null> {
  try {
    const response = await fetch(`${API_URL}/models/object/${objectId}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data.model;
  } catch (error) {
    console.error("Error fetching model by objectId:", error);
    return null;
  }
}

/**
 * Get models by owner
 */
export async function getModelsByOwner(owner: string): Promise<ModelRecord[]> {
  try {
    const response = await fetch(`${API_URL}/models?owner=${owner}`);
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    return data.models || [];
  } catch (error) {
    console.error("Error fetching models by owner:", error);
    return [];
  }
}

/**
 * Update model
 */
export async function updateModelRecord(
  modelId: string,
  updates: Partial<ModelRecord>
): Promise<ModelRecord | null> {
  try {
    const response = await fetch(`${API_URL}/models/${modelId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.model;
  } catch (error) {
    console.error("Error updating model:", error);
    return null;
  }
}
