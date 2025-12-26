const FALLBACK_PACKAGE_ID =
  import.meta.env.VITE_SUI_PACKAGE_ID ||
  "0xf99a3935114025f05af9d34139e76326cb3de96569167cca6eb18041d0ed7358";

export const CONTRACT_ADDRESSES = {
  PACKAGE_ID: FALLBACK_PACKAGE_ID,
  TREASURY_ID:
    import.meta.env.VITE_TREASURY_ID ||
    "0xbe008780cd6765e2ad1ccf0f6dae2db07ee80877b6c218f56ff09c8fd41581d3",
  RANDOM_ID: import.meta.env.VITE_RANDOM_ID || "0x8",
} as const;

export const LOOTBOX_PRICE =
  Number(import.meta.env.VITE_LOOTBOX_PRICE) || 100_000_000; // Mist
export const LOOTBOX_PRICE_SUI =
  Number(import.meta.env.VITE_LOOTBOX_PRICE_SUI) || 0.1;

export const RARITY_NAMES = ["Common", "Uncommon", "Rare", "Epic"] as const;

export const RARITY_COLORS: Record<number, string> = {
  0: "#9ca3af",
  1: "#22c55e",
  2: "#3b82f6",
  3: "#a855f7",
};

export const RARITY_BG_COLORS: Record<number, string> = {
  0: "rgba(156, 163, 175, 0.15)",
  1: "rgba(34, 197, 94, 0.15)",
  2: "rgba(59, 130, 246, 0.15)",
  3: "rgba(168, 85, 247, 0.15)",
};

export const RARITY_BORDER_COLORS: Record<number, string> = {
  0: "#4b5563",
  1: "#15803d",
  2: "#1d4ed8",
  3: "#7e22ce",
};
