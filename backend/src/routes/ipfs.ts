import { Router } from "express";
import { create } from "ipfs-http-client";
import multer from "multer";
import {
  validateFile,
  validateImageFile,
  validateMetadata,
  checkRateLimit,
} from "../utils/validation.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Initialize IPFS client
// Note: If IPFS node is not running, you can use a public gateway like:
// - https://ipfs.infura.io:5001 (requires API key)
// - Or use a local IPFS node: http://localhost:5001
let ipfs: ReturnType<typeof create> | null = null;
let ipfsUnavailableLogged = false; // Track if we've already logged IPFS unavailable

try {
  ipfs = create({
    url: process.env.IPFS_API_URL || "http://localhost:5001",
  });
  console.log(
    `✅ IPFS client initialized: ${
      process.env.IPFS_API_URL || "http://localhost:5001"
    }`
  );
} catch (error) {
  console.warn(
    "⚠️ IPFS client initialization failed. IPFS features will not work."
  );
  console.warn("To fix: Start IPFS node or configure IPFS_API_URL in .env");
  console.warn("Note: IPFS is optional - you can still mint NFTs without it.");
}

/**
 * Upload file to IPFS
 */
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!ipfs) {
      return res.status(503).json({
        error: "IPFS service unavailable",
        message:
          "IPFS node is not running. Please start IPFS node or configure IPFS_API_URL.",
      });
    }

    // Rate limiting
    const clientId = req.ip || req.headers["x-forwarded-for"] || "unknown";
    const rateLimitCheck = checkRateLimit(`upload_${clientId}`, 5, 60000);
    if (!rateLimitCheck.valid) {
      return res.status(429).json({ error: rateLimitCheck.errors[0] });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    // Validate file
    const validation = validateFile(req.file, 100);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.errors.join(", ") });
    }

    const file = await ipfs.add({
      content: req.file.buffer,
      path: req.file.originalname,
    });

    res.json({
      hash: file.cid.toString(),
      path: file.path,
    });
  } catch (error: any) {
    // Check if it's a connection error
    if (
      error.code === "ECONNREFUSED" ||
      error.message?.includes("fetch failed")
    ) {
      if (!ipfsUnavailableLogged) {
        console.warn("⚠️ IPFS node is not running. IPFS features disabled.");
        console.warn(
          "   (This is OK - IPFS is optional. NFTs can still be minted without it.)"
        );
        ipfsUnavailableLogged = true;
      }
      return res.status(503).json({
        error: "IPFS service unavailable",
        message:
          "IPFS node is not running. Please start IPFS node or configure IPFS_API_URL.",
        code: "IPFS_UNAVAILABLE",
      });
    }
    console.error("IPFS upload error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get file from IPFS
 */
router.get("/:hash", async (req, res) => {
  try {
    if (!ipfs) {
      return res.status(503).json({
        error: "IPFS service unavailable",
        message:
          "IPFS node is not running. Please start IPFS node or configure IPFS_API_URL.",
      });
    }

    const { hash } = req.params;
    const chunks = [];

    for await (const chunk of ipfs.cat(hash)) {
      chunks.push(chunk);
    }

    const fileBuffer = Buffer.concat(chunks);
    res.setHeader("Content-Type", "application/octet-stream");
    res.send(fileBuffer);
  } catch (error: any) {
    // Check if it's a connection error
    if (
      error.code === "ECONNREFUSED" ||
      error.message?.includes("fetch failed")
    ) {
      if (!ipfsUnavailableLogged) {
        console.warn("⚠️ IPFS node is not running. IPFS features disabled.");
        console.warn(
          "   (This is OK - IPFS is optional. NFTs can still be minted without it.)"
        );
        ipfsUnavailableLogged = true;
      }
      return res.status(503).json({
        error: "IPFS service unavailable",
        message:
          "IPFS node is not running. Please start IPFS node or configure IPFS_API_URL.",
        code: "IPFS_UNAVAILABLE",
      });
    }
    console.error("IPFS get error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Upload JSON metadata to IPFS
 */
router.post("/metadata", async (req, res) => {
  try {
    if (!ipfs) {
      return res.status(503).json({
        error: "IPFS service unavailable",
        message:
          "IPFS node is not running. Please start IPFS node or configure IPFS_API_URL.",
      });
    }

    // Rate limiting
    const clientId = req.ip || req.headers["x-forwarded-for"] || "unknown";
    const rateLimitCheck = checkRateLimit(`metadata_${clientId}`, 10, 60000);
    if (!rateLimitCheck.valid) {
      return res.status(429).json({ error: rateLimitCheck.errors[0] });
    }

    const metadata = req.body;

    // Validate metadata
    const validation = validateMetadata(metadata);
    if (!validation.valid) {
      return res.status(400).json({
        error: "Invalid metadata",
        errors: validation.errors,
      });
    }

    const file = await ipfs.add({
      content: JSON.stringify(metadata),
    });

    res.json({
      hash: file.cid.toString(),
      url: `ipfs://${file.cid.toString()}`,
    });
  } catch (error: any) {
    // Check if it's a connection error
    if (
      error.code === "ECONNREFUSED" ||
      error.message?.includes("fetch failed")
    ) {
      if (!ipfsUnavailableLogged) {
        console.warn("⚠️ IPFS node is not running. IPFS features disabled.");
        console.warn(
          "   (This is OK - IPFS is optional. NFTs can still be minted without it.)"
        );
        ipfsUnavailableLogged = true;
      }
      return res.status(503).json({
        error: "IPFS service unavailable",
        message:
          "IPFS node is not running. Please start IPFS node or configure IPFS_API_URL.",
        code: "IPFS_UNAVAILABLE",
      });
    }
    console.error("IPFS metadata upload error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Upload base64 image to IPFS
 */
router.post("/image", upload.single("image"), async (req, res) => {
  try {
    if (!ipfs) {
      return res.status(503).json({
        error: "IPFS service unavailable",
        message:
          "IPFS node is not running. Please start IPFS node or configure IPFS_API_URL.",
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No image provided" });
    }

    const file = await ipfs.add({
      content: req.file.buffer,
      path: req.file.originalname || "image.png",
    });

    res.json({
      hash: file.cid.toString(),
      path: file.path,
      url: `ipfs://${file.cid.toString()}`,
    });
  } catch (error: any) {
    // Check if it's a connection error
    if (
      error.code === "ECONNREFUSED" ||
      error.message?.includes("fetch failed")
    ) {
      if (!ipfsUnavailableLogged) {
        console.warn("⚠️ IPFS node is not running. IPFS features disabled.");
        console.warn(
          "   (This is OK - IPFS is optional. NFTs can still be minted without it.)"
        );
        ipfsUnavailableLogged = true;
      }
      return res.status(503).json({
        error: "IPFS service unavailable",
        message:
          "IPFS node is not running. Please start IPFS node or configure IPFS_API_URL.",
        code: "IPFS_UNAVAILABLE",
      });
    }
    console.error("IPFS image upload error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Upload base64 image (from JSON body)
 */
router.post("/image-base64", async (req, res) => {
  try {
    if (!ipfs) {
      return res.status(503).json({
        error: "IPFS service unavailable",
        message:
          "IPFS node is not running. Please start IPFS node or configure IPFS_API_URL.",
      });
    }

    // Rate limiting
    const clientId = req.ip || req.headers["x-forwarded-for"] || "unknown";
    const rateLimitCheck = checkRateLimit(`image_${clientId}`, 10, 60000);
    if (!rateLimitCheck.valid) {
      return res.status(429).json({ error: rateLimitCheck.errors[0] });
    }

    const { base64, filename = "image.png" } = req.body;

    if (!base64) {
      return res.status(400).json({ error: "No base64 image provided" });
    }

    // Remove data URL prefix if present
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Validate image size (max 10MB)
    if (buffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({ error: "Image size exceeds 10MB limit" });
    }

    const file = await ipfs.add({
      content: buffer,
      path: filename,
    });

    res.json({
      hash: file.cid.toString(),
      path: file.path,
      url: `ipfs://${file.cid.toString()}`,
    });
  } catch (error: any) {
    // Check if it's a connection error
    if (
      error.code === "ECONNREFUSED" ||
      error.message?.includes("fetch failed")
    ) {
      if (!ipfsUnavailableLogged) {
        console.warn("⚠️ IPFS node is not running. IPFS features disabled.");
        console.warn(
          "   (This is OK - IPFS is optional. NFTs can still be minted without it.)"
        );
        ipfsUnavailableLogged = true;
      }
      return res.status(503).json({
        error: "IPFS service unavailable",
        message:
          "IPFS node is not running. Please start IPFS node or configure IPFS_API_URL.",
        code: "IPFS_UNAVAILABLE",
      });
    }
    console.error("IPFS base64 image upload error:", error);
    res.status(500).json({ error: error.message });
  }
});

export { router as ipfsRouter };
