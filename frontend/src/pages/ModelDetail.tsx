import { useParams, Link } from "react-router-dom";
import { ShoppingCart, ExternalLink, Loader2, ArrowLeft } from "lucide-react";
import { useSuiNFTDetails } from "../hooks/useSuiNFTs";
import { useWalletConnection } from "../lib/wallet";
import { ImageWithFallback } from "../components/ImageWithFallback";

export function ModelDetail() {
  const { tokenId } = useParams();
  const { data: model, isLoading, error } = useSuiNFTDetails(tokenId);
  const { address } = useWalletConnection();

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">Đang tải thông tin mô hình...</p>
      </div>
    );
  }

  if (error || !model) {
    return (
      <div className="text-center py-16">
        <p className="text-red-400 text-lg mb-4">
          {error instanceof Error ? error.message : "Không tìm thấy mô hình"}
        </p>
        <Link
          to="/my-models"
          className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all"
        >
          Quay lại
        </Link>
      </div>
    );
  }

  const isOwner = address?.toLowerCase() === model.creator.toLowerCase();
  const createdDate = new Date(model.createdAt).toLocaleDateString("vi-VN");
  const network = import.meta.env.VITE_SUI_NETWORK || "testnet";

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn px-4">
      {/* Back button */}
      <Link
        to="/my-models"
        className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại</span>
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image/Preview */}
        <div className="glass rounded-xl overflow-hidden border border-white/10">
          <div className="w-full aspect-square bg-gradient-to-br from-blue-600/20 to-purple-600/20">
            <ImageWithFallback
              src={model.imageUri}
              alt={model.name}
              className="w-full h-full object-cover"
              showLoader={true}
            />
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{model.name}</h1>
            <p className="text-gray-400 capitalize">
              Loại: {model.modelType || "N/A"}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Mô tả</h2>
            <p className="text-gray-300">
              {model.description || "Không có mô tả"}
            </p>
          </div>

          <div className="glass rounded-lg p-4 space-y-3 border border-white/10">
            <div className="flex justify-between">
              <span className="text-gray-400">Royalty:</span>
              <span className="text-white font-semibold">
                {model.royaltyPercentage / 100}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Người tạo:</span>
              <span className="text-white font-mono text-sm">
                {model.creator.slice(0, 6)}...{model.creator.slice(-4)}
              </span>
            </div>
            {isOwner && (
              <div className="pt-2 border-t border-white/10">
                <span className="text-green-400 text-sm font-semibold">
                  ✓ Bạn là chủ sở hữu
                </span>
              </div>
            )}
          </div>

          <div className="flex space-x-4">
            {!isOwner && (
              <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all flex items-center justify-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <span>Mua ngay</span>
              </button>
            )}
            {model.metadataUri && (
              <a
                href={model.metadataUri}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 glass hover:bg-white/10 text-white rounded-lg transition-colors flex items-center space-x-2 border border-white/10"
              >
                <ExternalLink className="w-5 h-5" />
                <span>Xem metadata</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="glass rounded-xl p-6 border border-white/10">
        <h2 className="text-xl font-semibold text-white mb-4">
          Thông tin kỹ thuật
        </h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Object ID:</span>
            <div className="flex items-center space-x-2 mt-1">
              <code className="text-white font-mono text-xs break-all">
                {model.objectId}
              </code>
              <a
                href={`https://suiexplorer.com/${network}/object/${model.objectId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div>
            <span className="text-gray-400">Metadata URI:</span>
            <div className="flex items-center space-x-2 mt-1">
              <code className="text-white font-mono text-xs break-all">
                {model.metadataUri || "N/A"}
              </code>
              {model.metadataUri && (
                <a
                  href={model.metadataUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
          <div>
            <span className="text-gray-400">Ngày tạo:</span>
            <span className="text-white ml-2">{createdDate}</span>
          </div>
          <div>
            <span className="text-gray-400">Creator:</span>
            <div className="flex items-center space-x-2 mt-1">
              <code className="text-white font-mono text-xs">
                {model.creator}
              </code>
              <a
                href={`https://suiexplorer.com/${network}/address/${model.creator}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
