/**
 * IPFS Upload Utilities
 * Upload files, images, and metadata to IPFS
 */

const IPFS_API_URL =
  import.meta.env.VITE_IPFS_API_URL || "http://localhost:3001/api/ipfs";

export interface IPFSUploadResult {
  hash: string;
  path?: string;
  url: string; // ipfs://hash
  httpUrl: string; // https://ipfs.io/ipfs/hash
}

/**
 * Upload file to IPFS
 */
export async function uploadFileToIPFS(file: File): Promise<IPFSUploadResult> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${IPFS_API_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Upload failed" }));
    throw new Error(error.error || "Failed to upload file to IPFS");
  }

  const data = await response.json();
  const hash = data.hash;

  return {
    hash,
    path: data.path,
    url: `ipfs://${hash}`,
    httpUrl: `https://ipfs.io/ipfs/${hash}`,
  };
}

/**
 * Upload base64 image to IPFS
 */
export async function uploadImageToIPFS(
  base64Image: string
): Promise<IPFSUploadResult> {
  // Convert base64 to blob
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
  const blob = await fetch(`data:image/png;base64,${base64Data}`).then((res) =>
    res.blob()
  );

  // Convert blob to File
  const file = new File([blob], "image.png", { type: "image/png" });

  return uploadFileToIPFS(file);
}

/**
 * Upload metadata JSON to IPFS
 */
export async function uploadMetadataToIPFS(
  metadata: Record<string, any>
): Promise<IPFSUploadResult> {
  const response = await fetch(`${IPFS_API_URL}/metadata`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(metadata),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Upload failed" }));
    // Check if IPFS is unavailable (not an actual error, just service not running)
    if (response.status === 503 && error.code === "IPFS_UNAVAILABLE") {
      const ipfsError = new Error(
        error.message || "IPFS service is not available"
      );
      (ipfsError as any).code = "IPFS_UNAVAILABLE";
      throw ipfsError;
    }
    throw new Error(error.error || "Failed to upload metadata to IPFS");
  }

  const data = await response.json();
  const hash = data.hash;

  return {
    hash,
    url: data.url || `ipfs://${hash}`,
    httpUrl: `https://ipfs.io/ipfs/${hash}`,
  };
}

/**
 * Check if IPFS service is available
 */
export async function checkIPFSAvailability(): Promise<boolean> {
  try {
    const response = await fetch(`${IPFS_API_URL}/health`, {
      method: "GET",
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Upload complete model metadata (including image and file) to IPFS
 * Returns metadata CID that can be stored in NFT
 */
export async function uploadModelToIPFS(params: {
  name: string;
  description: string;
  modelType: string;
  prompt?: string;
  image?: string; // base64 or URL
  file?: File;
  royaltyPercentage: number;
  creator?: string;
}): Promise<{
  imageCid?: string;
  fileCid?: string;
  metadataCid: string;
  metadataUrl: string;
}> {
  let imageCid: string | undefined;
  let fileCid: string | undefined;

  // 1. Upload image (if provided)
  if (params.image) {
    try {
      // Check if it's already a URL
      if (
        params.image.startsWith("http://") ||
        params.image.startsWith("https://")
      ) {
        // If it's a URL, we can use it directly or download and re-upload
        // For now, we'll use the URL directly in metadata
        console.log("Image is already a URL, using directly");
      } else if (params.image.startsWith("data:image")) {
        // Upload base64 image
        const imageResult = await uploadImageToIPFS(params.image);
        imageCid = imageResult.hash;
      }
    } catch (error) {
      console.error("Error uploading image to IPFS:", error);
      // Continue without image
    }
  }

  // 2. Upload model file (if provided)
  if (params.file) {
    try {
      const fileResult = await uploadFileToIPFS(params.file);
      fileCid = fileResult.hash;
    } catch (error) {
      console.error("Error uploading file to IPFS:", error);
      // Continue without file
    }
  }

  // 3. Create and upload metadata JSON
  const metadata = {
    name: params.name,
    description: params.description,
    modelType: params.modelType,
    prompt: params.prompt || "",
    image: imageCid ? `ipfs://${imageCid}` : params.image || "",
    file: fileCid ? `ipfs://${fileCid}` : "",
    royaltyPercentage: params.royaltyPercentage,
    creator: params.creator || "",
    createdAt: new Date().toISOString(),
    attributes: [
      { trait_type: "Model Type", value: params.modelType },
      { trait_type: "Royalty", value: `${params.royaltyPercentage}%` },
      ...(params.prompt
        ? [{ trait_type: "Prompt", value: params.prompt }]
        : []),
    ],
  };

  const metadataResult = await uploadMetadataToIPFS(metadata);

  return {
    imageCid,
    fileCid,
    metadataCid: metadataResult.hash,
    metadataUrl: metadataResult.url,
  };
}
