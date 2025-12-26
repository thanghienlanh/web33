import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  X,
  ArrowUpDown,
  Image as ImageIcon,
} from "lucide-react";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { useBackendModels, BackendModel } from "../hooks/useBackendModels";

type SortOption = "newest" | "oldest" | "name-asc" | "name-desc";
type FilterOption = {
  modelType?: string;
  chain?: "ethereum" | "sui" | "all";
  minPrice?: number;
  maxPrice?: number;
  owner?: string;
};

export function Marketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filters, setFilters] = useState<FilterOption>({
    chain: "all",
  });

  // Fetch all NFTs (in a real app, you'd fetch from all owners or a marketplace contract)
  // For now, we'll use empty array and show placeholder
  const { data: allNFTs = [], isLoading } = useBackendModels();

  // Filter and sort models
  const filteredAndSortedModels = useMemo(() => {
    let filtered: BackendModel[] = [...allNFTs];

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (model) =>
          model.name.toLowerCase().includes(searchLower) ||
          model.description.toLowerCase().includes(searchLower) ||
          model.modelType.toLowerCase().includes(searchLower) ||
          (model.prompt || "").toLowerCase().includes(searchLower)
      );
    }

    // Model type filter
    if (filters.modelType) {
      filtered = filtered.filter(
        (model) => model.modelType === filters.modelType
      );
    }

    // Chain filter (all NFTs from useSuiNFTs are Sui, but we keep the filter for future)
    if (filters.chain && filters.chain !== "all") {
      // For now, all are Sui, so we skip this filter
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.createdAt - a.createdAt;
        case "oldest":
          return a.createdAt - b.createdAt;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [allNFTs, searchTerm, filters, sortBy]);

  const modelTypes = Array.from(
    new Set(allNFTs.map((m) => m.modelType).filter(Boolean))
  );

  const clearFilters = () => {
    setFilters({ chain: "all" });
    setSearchTerm("");
  };

  const hasActiveFilters =
    filters.modelType || filters.chain !== "all" || searchTerm;

  const getImageUrl = (model: BackendModel) => {
    if (model.ipfsImageCid) {
      return `https://ipfs.io/ipfs/${model.ipfsImageCid}`;
    }
    if (model.ipfsMetadataCid) {
      return `https://ipfs.io/ipfs/${model.ipfsMetadataCid}`;
    }
    return "";
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Thị trường mô hình AI
        </h1>
        <div className="text-sm text-gray-400">
          {filteredAndSortedModels.length} mô hình
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm mô hình AI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 glass rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10 text-sm sm:text-base"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-4 py-3 glass border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="name-asc">Tên A-Z</option>
            <option value="name-desc">Tên Z-A</option>
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-3 glass hover:glass-strong border border-white/10 rounded-xl text-white flex items-center justify-center space-x-2 touch-manipulation min-h-[44px]"
          >
            <Filter className="w-5 h-5" />
            <span className="text-sm sm:text-base hidden sm:inline">Lọc</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="glass rounded-xl p-4 sm:p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Bộ lọc</h3>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Xóa bộ lọc
                </button>
              )}
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Model Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Loại mô hình
              </label>
              <select
                value={filters.modelType || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    modelType: e.target.value || undefined,
                  })
                }
                className="w-full px-3 py-2 glass border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Tất cả</option>
                {modelTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Chain Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Blockchain
              </label>
              <select
                value={filters.chain || "all"}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    chain: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 glass border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">Tất cả</option>
                <option value="sui">Sui</option>
                <option value="ethereum">Ethereum</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Models Grid */}
      {isLoading ? (
        <div className="text-center py-12 sm:py-16">
          <p className="text-gray-400 text-base sm:text-lg">Đang tải...</p>
        </div>
      ) : filteredAndSortedModels.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <p className="text-gray-400 text-base sm:text-lg mb-4 px-4">
            {hasActiveFilters
              ? "Không tìm thấy mô hình nào phù hợp với bộ lọc"
              : "Chưa có mô hình nào trên thị trường"}
          </p>
          {hasActiveFilters ? (
            <button
              onClick={clearFilters}
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all touch-manipulation text-sm sm:text-base"
            >
              Xóa bộ lọc
            </button>
          ) : (
            <Link
              to="/create"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all touch-manipulation text-sm sm:text-base"
            >
              Tạo mô hình đầu tiên
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredAndSortedModels.map((model) => {
            const imageUrl = getImageUrl(model);
            const priceLabel =
              model.price !== undefined && model.price !== null
                ? `${model.price} SUI`
                : "Chưa niêm yết";
            return (
            <Link
              key={model.objectId}
              to={`/model/${model.objectId || model.modelId}`}
              className="glass rounded-xl overflow-hidden border border-white/10 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105"
            >
              <div className="aspect-square relative bg-gradient-to-br from-blue-600/20 to-purple-600/20 overflow-hidden rounded-t-xl">
                <ImageWithFallback
                  src={imageUrl}
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
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-400 capitalize">
                    {model.modelType || "N/A"}
                  </span>
                  <span className="text-blue-400">
                    {model.royaltyPercentage / 100}% royalty
                  </span>
                </div>
                {model.prompt && (
                  <p className="text-gray-500 text-xs line-clamp-2">
                    Prompt: {model.prompt}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs mt-2">
                  <span className="text-gray-300 font-semibold">
                    {priceLabel}
                  </span>
                  <span className="text-gray-400">
                    Tác giả: {model.creator.slice(0, 6)}...
                  </span>
                </div>
              </div>
            </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
