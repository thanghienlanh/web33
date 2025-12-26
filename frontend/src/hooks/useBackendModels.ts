import { useQuery } from "@tanstack/react-query";

export interface BackendModel {
  modelId: string;
  objectId?: string;
  tokenId?: string;
  txHash?: string;
  owner: string;
  creator: string;
  chain: string;
  network: string;
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

/**
 * Fetch tất cả model records từ backend để hiển thị trong “Khám phá mô hình”.
 */
export function useBackendModels() {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

  return useQuery({
    queryKey: ["backend-models"],
    queryFn: async (): Promise<BackendModel[]> => {
      const res = await fetch(`${API_URL}/models`);
      if (!res.ok) {
        throw new Error("Không thể tải danh sách mô hình từ backend");
      }
      const data = await res.json();
      return data.models || [];
    },
    refetchInterval: 30000,
  });
}
