import { Link } from "react-router-dom";
import { Loader2, Image as ImageIcon } from "lucide-react";
import { useWalletConnection } from "../lib/wallet";
import { useSuiNFTs } from "../hooks/useSuiNFTs";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { Skeleton } from "../components/Skeleton";

export function MyModels() {
  const { isConnected, address } = useWalletConnection();
  const { data: models = [], isLoading, error } = useSuiNFTs();

  if (!isConnected) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-lg mb-4">
          Vui lòng kết nối ví Sui để xem mô hình của bạn
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">Đang tải mô hình...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-400 text-lg mb-4">
          Lỗi khi tải mô hình:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Mô hình của tôi</h1>
        <Link
          to="/create"
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all"
        >
          Tạo mô hình mới
        </Link>
      </div>

      {models.length === 0 ? (
        <div className="text-center py-16 glass rounded-xl p-8 border border-white/10">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-4">Bạn chưa có mô hình nào</p>
          <Link
            to="/create"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all"
          >
            Tạo mô hình đầu tiên
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {models.map((model) => (
            <Link
              key={model.objectId}
              to={`/model/${model.objectId}`}
              className="glass rounded-xl overflow-hidden border border-white/10 hover:border-blue-500 transition-all hover:scale-105"
            >
              <div className="aspect-square relative bg-gradient-to-br from-blue-600/20 to-purple-600/20 overflow-hidden rounded-t-xl">
                <ImageWithFallback
                  src={model.imageUri}
                  alt={model.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  showLoader={true}
                />
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold mb-2 line-clamp-1">
                  {model.name}
                </h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                  {model.description}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 capitalize">
                    {model.modelType || "N/A"}
                  </span>
                  <span className="text-blue-400">
                    {model.royaltyPercentage / 100}% royalty
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
