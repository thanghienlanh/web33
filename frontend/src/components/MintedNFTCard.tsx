import {
  ExternalLink,
  CheckCircle2,
  Copy,
  Image as ImageIcon,
} from "lucide-react";
import { useState } from "react";

interface MintedNFTCardProps {
  objectId: string;
  txDigest: string;
  name: string;
  description: string;
  image: string;
  modelType?: string;
  royaltyPercentage?: number;
  prompt?: string;
}

export function MintedNFTCard({
  objectId,
  txDigest,
  name,
  description,
  image,
  modelType,
  royaltyPercentage,
  prompt,
}: MintedNFTCardProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const getExplorerUrl = (id: string) => {
    const network = import.meta.env.VITE_SUI_NETWORK || "testnet";
    return `https://suiexplorer.com/${network}/object/${id}`;
  };

  return (
    <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-green-500/30 bg-green-900/10 animate-fadeIn">
      <div className="flex items-start space-x-4 mb-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-green-400 mb-1">
            NFT đã được mint thành công!
          </h3>
          <p className="text-gray-300 text-sm">
            NFT của bạn đã được tạo và transfer vào ví
          </p>
        </div>
      </div>

      {/* NFT Preview */}
      <div className="mb-6">
        <div className="relative rounded-xl overflow-hidden border border-white/10 bg-gray-900/50">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-48 sm:h-64 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                target.nextElementSibling?.classList.remove("hidden");
              }}
            />
          ) : null}
          <div
            className={`${
              image ? "hidden" : ""
            } w-full h-48 sm:h-64 flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-indigo-500/20`}
          >
            <ImageIcon className="w-16 h-16 text-gray-400" />
          </div>
        </div>
      </div>

      {/* NFT Info */}
      <div className="space-y-4 mb-6">
        <div>
          <h4 className="text-white font-semibold text-lg mb-1">{name}</h4>
          <p className="text-gray-300 text-sm line-clamp-2">{description}</p>
        </div>

        {prompt && (
          <div className="text-sm">
            <span className="text-gray-400">Prompt:</span>
            <p className="text-white mt-1 whitespace-pre-line break-words">
              {prompt}
            </p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          {modelType && (
            <div>
              <span className="text-gray-400">Loại mô hình:</span>
              <span className="text-white ml-2 capitalize">{modelType}</span>
            </div>
          )}
          {royaltyPercentage !== undefined && (
            <div>
              <span className="text-gray-400">Royalty:</span>
              <span className="text-white ml-2">{royaltyPercentage}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Object ID & Transaction */}
      <div className="space-y-3 border-t border-white/10 pt-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-medium">
              Object ID:
            </span>
            <button
              onClick={() => copyToClipboard(objectId, "objectId")}
              className="text-blue-400 hover:text-blue-300 transition-colors"
              title="Copy Object ID"
            >
              {copied === "objectId" ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <code className="flex-1 px-3 py-2 glass rounded-lg text-xs sm:text-sm text-white font-mono break-all">
              {objectId}
            </code>
            <a
              href={getExplorerUrl(objectId)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"
              title="Xem trên Sui Explorer"
            >
              <ExternalLink className="w-4 h-4 text-blue-400" />
            </a>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-medium">
              Transaction:
            </span>
            <button
              onClick={() => copyToClipboard(txDigest, "txDigest")}
              className="text-blue-400 hover:text-blue-300 transition-colors"
              title="Copy Transaction Digest"
            >
              {copied === "txDigest" ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <code className="flex-1 px-3 py-2 glass rounded-lg text-xs sm:text-sm text-white font-mono break-all">
              {txDigest}
            </code>
            <a
              href={`https://suiexplorer.com/${
                import.meta.env.VITE_SUI_NETWORK || "testnet"
              }/txblock/${txDigest}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"
              title="Xem transaction trên Sui Explorer"
            >
              <ExternalLink className="w-4 h-4 text-blue-400" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
