import { Router } from "express";
import axios from "axios";
import {
  createModel,
  getModelById,
  getModelByObjectId,
  getModelByTokenId,
  getModelsByOwner,
  getModelsByCreator,
  getAllModels,
  updateModel,
} from "../services/ModelService.js";

const router = Router();

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

/**
 * Get all models
 */
router.get("/", async (req, res) => {
  try {
    const { owner, creator, chain, network } = req.query;

    let models;
    if (owner) {
      models = getModelsByOwner(owner as string);
    } else if (creator) {
      models = getModelsByCreator(creator as string);
    } else {
      models = getAllModels();
    }

    // Filter by chain/network if provided
    if (chain) {
      models = models.filter((m) => m.chain === chain);
    }
    if (network) {
      models = models.filter((m) => m.network === network);
    }

    res.json({ models, count: models.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get model by ID
 */
router.get("/id/:modelId", async (req, res) => {
  try {
    const { modelId } = req.params;
    const model = getModelById(modelId);

    if (!model) {
      return res.status(404).json({ error: "Model not found" });
    }

    res.json({ model });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get model by token ID (Ethereum)
 */
router.get("/token/:tokenId", async (req, res) => {
  try {
    const { tokenId } = req.params;
    const model = getModelByTokenId(tokenId);

    if (!model) {
      return res.status(404).json({ error: "Model not found" });
    }

    res.json({ model });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get model by object ID (Sui)
 */
router.get("/object/:objectId", async (req, res) => {
  try {
    const { objectId } = req.params;
    const model = getModelByObjectId(objectId);

    if (!model) {
      return res.status(404).json({ error: "Model not found" });
    }

    res.json({ model });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Create new model record
 */
router.post("/", async (req, res) => {
  try {
    const {
      objectId,
      tokenId,
      txHash,
      owner,
      creator,
      chain,
      network,
      name,
      description,
      modelType,
      prompt,
      ipfsMetadataCid,
      ipfsImageCid,
      ipfsFileCid,
      royaltyPercentage,
      price,
    } = req.body;

    // Validate required fields
    if (!owner || !creator || !chain || !name || !description) {
      return res.status(400).json({
        error:
          "Missing required fields: owner, creator, chain, name, description",
      });
    }

    const model = await createModel({
      objectId,
      tokenId,
      txHash,
      owner,
      creator,
      chain,
      network: network || "testnet",
      name,
      description,
      modelType: modelType || "other",
      prompt,
      ipfsMetadataCid,
      ipfsImageCid,
      ipfsFileCid,
      royaltyPercentage: royaltyPercentage || 0,
      price,
    });

    res.status(201).json({ model });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Update model
 */
router.put("/:modelId", async (req, res) => {
  try {
    const { modelId } = req.params;
    const updates = req.body;

    const updated = await updateModel(modelId, updates);

    if (!updated) {
      return res.status(404).json({ error: "Model not found" });
    }

    res.json({ model: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Validate AI model
 */
router.post("/validate", async (req, res) => {
  try {
    const { modelHash, modelType } = req.body;

    // TODO: Implement model validation logic
    // This could check model format, size, etc.

    res.json({
      valid: true,
      message: "Model is valid",
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Generate image using AI service
 */
router.post("/generate-image", async (req, res) => {
  try {
    const {
      prompt,
      modelType,
      width,
      height,
      numInferenceSteps,
      guidanceScale,
      seed,
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Call Python AI service
    const response = await axios.post(`${AI_SERVICE_URL}/generate`, {
      prompt,
      model_type: modelType || "stable-diffusion",
      width: width || 512,
      height: height || 512,
      num_inference_steps: numInferenceSteps || 50,
      guidance_scale: guidanceScale || 7.5,
      seed: seed || null,
    });

    res.json(response.data);
  } catch (error: any) {
    console.error("AI service error:", error.message);
    res.status(500).json({
      error: error.message,
      message: "Failed to generate image. Make sure AI service is running.",
    });
  }
});

export { router as modelRouter };
