import { useQuery } from "@tanstack/react-query";
import { useSuiClient, useCurrentWallet } from "@mysten/dapp-kit";

/**
 * Interface cho Sui NFT Model
 */
export interface SuiNFTModel {
  objectId: string;
  name: string;
  description: string;
  modelType: string;
  metadataUri: string;
  imageUri: string;
  creator: string;
  royaltyPercentage: number;
  createdAt: number;
}

/**
 * Helper function để parse String field từ Sui object
 * String có thể là string trực tiếp hoặc object với field 'bytes'
 */
function parseStringField(field: any): string {
  if (typeof field === "string") {
    return field;
  }
  if (field && typeof field === "object") {
    // String type trong Sui có thể có structure { bytes: string }
    if ("bytes" in field && typeof field.bytes === "string") {
      return field.bytes;
    }
    // Hoặc có thể là object khác
    if ("value" in field && typeof field.value === "string") {
      return field.value;
    }
  }
  return "";
}

/**
 * Hook để fetch NFTs của owner từ Sui chain
 */
export function useSuiNFTs(ownerAddress?: string) {
  const client = useSuiClient();
  const { currentWallet } = useCurrentWallet();
  const address = ownerAddress || currentWallet?.accounts[0]?.address;

  const PACKAGE_ID = import.meta.env.VITE_SUI_PACKAGE_ID || "";

  return useQuery({
    queryKey: ["sui-nfts", address, PACKAGE_ID],
    queryFn: async (): Promise<SuiNFTModel[]> => {
      if (!address || !PACKAGE_ID) {
        return [];
      }

      try {
        // Object type: PackageID::module::StructName
        const objectType = `${PACKAGE_ID}::model_nft::ModelNFT`;

        // Fetch owned objects với filter theo type (có pagination)
        const nfts: SuiNFTModel[] = [];
        let cursor: string | null = null;
        let hasNextPage = true;

        while (hasNextPage) {
          const ownedObjects = await client.getOwnedObjects({
            owner: address,
            filter: {
              StructType: objectType,
            },
            options: {
              showContent: true,
              showType: true,
              showOwner: true,
            },
            cursor: cursor || undefined,
            limit: 50, // Fetch 50 objects mỗi lần
          });

          // Parse objects thành SuiNFTModel
          for (const obj of ownedObjects.data) {
            if (
              obj.data &&
              "content" in obj.data &&
              obj.data.content &&
              "fields" in obj.data.content
            ) {
              const fields = obj.data.content.fields as any;
              const objectId = obj.data.objectId;

              nfts.push({
                objectId,
                name: parseStringField(fields.name),
                description: parseStringField(fields.description),
                modelType: parseStringField(fields.model_type),
                metadataUri: parseStringField(fields.metadata_uri),
                imageUri: parseStringField(fields.image_uri),
                creator: fields.creator || "",
                royaltyPercentage: Number(fields.royalty_percentage || 0),
                createdAt: Number(fields.created_at || 0),
              });
            }
          }

          // Check if there are more pages
          hasNextPage = ownedObjects.hasNextPage;
          cursor = ownedObjects.nextCursor || null;

          // Limit to prevent infinite loop
          if (nfts.length > 1000) {
            break;
          }
        }

        // Sort theo created_at (mới nhất trước)
        nfts.sort((a, b) => b.createdAt - a.createdAt);

        return nfts;
      } catch (error) {
        console.error("Error fetching Sui NFTs:", error);
        return [];
      }
    },
    enabled: !!address && !!PACKAGE_ID,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

/**
 * Hook để fetch NFT details theo objectId
 */
export function useSuiNFTDetails(objectId: string | undefined) {
  const client = useSuiClient();

  return useQuery({
    queryKey: ["sui-nft-details", objectId],
    queryFn: async (): Promise<SuiNFTModel | null> => {
      if (!objectId) {
        return null;
      }

      try {
        const object = await client.getObject({
          id: objectId,
          options: {
            showContent: true,
            showType: true,
            showOwner: true,
          },
        });

        if (
          !object.data ||
          !("content" in object.data) ||
          !object.data.content ||
          !("fields" in object.data.content)
        ) {
          return null;
        }

        const fields = object.data.content.fields as any;

        return {
          objectId: object.data.objectId,
          name: parseStringField(fields.name),
          description: parseStringField(fields.description),
          modelType: parseStringField(fields.model_type),
          metadataUri: parseStringField(fields.metadata_uri),
          imageUri: parseStringField(fields.image_uri),
          creator: fields.creator || "",
          royaltyPercentage: Number(fields.royalty_percentage || 0),
          createdAt: Number(fields.created_at || 0),
        };
      } catch (error) {
        console.error("Error fetching Sui NFT details:", error);
        return null;
      }
    },
    enabled: !!objectId,
  });
}
