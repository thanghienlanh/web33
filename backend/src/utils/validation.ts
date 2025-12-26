/**
 * Validation & Security Utilities
 */

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate metadata
 */
export function validateMetadata(metadata: any): ValidationResult {
  const errors: string[] = [];

  // Required fields
  if (!metadata.name || typeof metadata.name !== "string") {
    errors.push("Name is required and must be a string");
  } else if (metadata.name.length < 1 || metadata.name.length > 200) {
    errors.push("Name must be between 1 and 200 characters");
  }

  if (!metadata.description || typeof metadata.description !== "string") {
    errors.push("Description is required and must be a string");
  } else if (
    metadata.description.length < 1 ||
    metadata.description.length > 2000
  ) {
    errors.push("Description must be between 1 and 2000 characters");
  }

  if (!metadata.modelType || typeof metadata.modelType !== "string") {
    errors.push("Model type is required");
  }

  // Validate royalty percentage
  if (metadata.royaltyPercentage !== undefined) {
    const royalty = Number(metadata.royaltyPercentage);
    if (isNaN(royalty) || royalty < 0 || royalty > 10000) {
      errors.push("Royalty percentage must be between 0 and 10000 (0-100%)");
    }
  }

  // Validate image URL if provided
  if (metadata.image) {
    const imageUrl = String(metadata.image);
    if (
      !imageUrl.startsWith("http://") &&
      !imageUrl.startsWith("https://") &&
      !imageUrl.startsWith("ipfs://") &&
      !imageUrl.startsWith("data:image")
    ) {
      errors.push("Image must be a valid URL, IPFS hash, or base64 data URI");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate file size and type
 */
export function validateFile(
  file: Express.Multer.File,
  maxSizeMB: number = 100
): ValidationResult {
  const errors: string[] = [];
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (!file) {
    errors.push("File is required");
    return { valid: false, errors };
  }

  // Check file size
  if (file.size > maxSizeBytes) {
    errors.push(`File size exceeds maximum allowed size of ${maxSizeMB}MB`);
  }

  // Check file type (model files)
  const allowedExtensions = [".pth", ".pt", ".h5", ".pb", ".onnx", ".pkl"];
  const fileExtension = file.originalname
    .toLowerCase()
    .substring(file.originalname.lastIndexOf("."));

  if (!allowedExtensions.includes(fileExtension)) {
    errors.push(
      `File type not allowed. Allowed types: ${allowedExtensions.join(", ")}`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate image file
 */
export function validateImageFile(
  file: Express.Multer.File,
  maxSizeMB: number = 10
): ValidationResult {
  const errors: string[] = [];
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (!file) {
    errors.push("Image file is required");
    return { valid: false, errors };
  }

  // Check file size
  if (file.size > maxSizeBytes) {
    errors.push(`Image size exceeds maximum allowed size of ${maxSizeMB}MB`);
  }

  // Check file type
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    errors.push(
      `Image type not allowed. Allowed types: ${allowedMimeTypes.join(", ")}`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Rate limiting check (simple in-memory implementation)
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minute
): ValidationResult {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetAt) {
    // Reset or create new record
    rateLimitMap.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { valid: true, errors: [] };
  }

  if (record.count >= maxRequests) {
    return {
      valid: false,
      errors: [
        `Rate limit exceeded. Maximum ${maxRequests} requests per ${
          windowMs / 1000
        } seconds.`,
      ],
    };
  }

  record.count++;
  return { valid: true, errors: [] };
}

/**
 * Clean up old rate limit records
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}, 60000); // Clean up every minute
