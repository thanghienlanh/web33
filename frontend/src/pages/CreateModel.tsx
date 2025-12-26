import { useState } from "react";
import {
  Upload,
  Loader2,
  Wand2,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import { useWalletConnection } from "../lib/wallet";
import { uploadModelToIPFS } from "../lib/ipfs";
import { createModelRecord } from "../lib/modelApi";
import { usePayGenerationFee } from "../hooks/usePayGenerationFee";

export function CreateModel() {
  const { isConnected, address } = useWalletConnection();
  const { payGenerationFee, isPaying } = usePayGenerationFee();

  const [formData, setFormData] = useState({
    modelName: "",
    description: "",
    modelType: "image-generation",
    price: "",
    royaltyPercentage: "10",
  });
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [aiModelType, setAiModelType] = useState<string>("pollinations"); // Default to free option

  const generateImage = async () => {
    if (!prompt.trim()) return;
    if (!isConnected || !address) {
      alert("Vui lòng kết nối ví Sui trước khi tạo ảnh.");
      return;
    }
    if (!formData.modelName.trim() || !formData.description.trim()) {
      alert("Vui lòng nhập Tên mô hình và Mô tả trước khi tạo ảnh.");
      return;
    }

    // Kiểm tra AI service URL
    const aiServiceUrl = import.meta.env.VITE_AI_SERVICE_URL;
    if (!aiServiceUrl) {
      alert("AI service chưa được cấu hình. Vui lòng thêm VITE_AI_SERVICE_URL vào .env.local hoặc upload ảnh thủ công.");
      return;
    }

    setIsGenerating(true);
    try {
      // Thu phí 0.1 SUI trước khi generate (nếu có fee config)
      await payGenerationFee();

      const response = await fetch(
        `${aiServiceUrl}/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            modelType: aiModelType, // Use selected AI model type
            width: 512,
            height: 512,
          }),
        }
      );

      const data = await response.json();
      if (data.success && data.image_base64) {
        const base64 = `data:image/png;base64,${data.image_base64}`;
        setGeneratedImage(base64);

        // Upload ảnh + metadata lên IPFS và lưu record backend để hiển thị công khai
        try {
          setIsUploading(true);
          setUploadProgress("Đang lưu metadata & ảnh lên IPFS...");
          const ipfsResult = await uploadModelToIPFS({
            name: formData.modelName,
            description: formData.description,
            modelType: formData.modelType,
            prompt: prompt || "",
            image: base64,
            royaltyPercentage: parseInt(formData.royaltyPercentage),
            creator: address,
          });

          setUploadProgress("Đang lưu record mô hình...");
          await createModelRecord({
            owner: address,
            creator: address,
            chain: "sui",
            network: (import.meta.env.VITE_SUI_NETWORK as any) || "testnet",
            name: formData.modelName,
            description: formData.description,
            modelType: formData.modelType,
            prompt: prompt || "",
            ipfsMetadataCid: ipfsResult.metadataCid,
            ipfsImageCid: ipfsResult.imageCid,
            royaltyPercentage: parseInt(formData.royaltyPercentage),
          });
          setUploadProgress("Đã lưu ảnh và metadata công khai.");
        } catch (saveErr) {
          console.error("Lỗi lưu IPFS/record:", saveErr);
          setUploadProgress(
            "Không thể lưu IPFS/record, nhưng ảnh vẫn tạo thành công."
          );
        }
        setIsUploading(false);
      }
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Lỗi khi tạo ảnh. Đảm bảo AI service đang chạy.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn px-4 sm:px-6">
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-full glass mb-4">
          <Wand2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
          <span className="text-xs sm:text-sm text-gray-300">
            Tạo mô hình AI mới
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4">
          <span className="gradient-text-blue block">Tạo & Bán</span>
          <span className="text-white block">Mô hình AI của bạn</span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base lg:text-lg">
          Sử dụng AI để tạo ảnh hoặc upload mô hình của bạn
        </p>
      </div>

      {/* AI Image Generation Section */}
      <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-white/10">
        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
              Tạo ảnh bằng AI
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm">
              Nhập mô tả để AI tạo ảnh cho bạn
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && generateImage()}
              className="flex-1 px-4 py-3 glass rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10 text-sm sm:text-base"
              placeholder="VD: a beautiful sunset over mountains..."
            />
            <select
              value={aiModelType}
              onChange={(e) => setAiModelType(e.target.value)}
              className="px-4 py-3 glass rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10 text-sm sm:text-base hover:bg-white/10 transition-colors"
              title="Chọn AI model để tạo ảnh"
            >
              <option value="pollinations">Pollinations (FREE) ⭐</option>
            </select>
            <button
              type="button"
              onClick={generateImage}
              disabled={isGenerating || isPaying || !prompt.trim()}
              className="px-4 sm:px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm sm:text-base whitespace-nowrap"
            >
              {isGenerating || isPaying ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  <span className="hidden sm:inline">
                    {isPaying ? "Đang thu phí..." : "Đang tạo..."}
                  </span>
                  <span className="sm:hidden">
                    {isPaying ? "Thu phí..." : "Tạo..."}
                  </span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Tạo ảnh (0.1 SUI)</span>
                </>
              )}
            </button>
          </div>

          {generatedImage && (
            <div className="mt-4 glass rounded-xl p-4 border border-white/10">
              <div className="flex items-center space-x-2 mb-3">
                <ImageIcon className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-semibold">
                  Ảnh đã tạo thành công!
                </span>
              </div>
              <img
                src={generatedImage}
                alt="Generated"
                className="w-full rounded-lg shadow-lg hover:scale-105 transition-transform cursor-pointer"
                onClick={() => window.open(generatedImage, "_blank")}
              />
            </div>
          )}

          {isUploading && uploadProgress && (
            <div className="bg-blue-900/20 border border-blue-700/50 rounded-xl p-4">
              <div className="flex items-start space-x-2">
                <Loader2 className="w-5 h-5 text-blue-400 animate-spin flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-blue-400 text-sm font-semibold">
                    Đang lưu dữ liệu...
                  </p>
                  <p className="text-blue-300 text-xs mt-1 whitespace-pre-line">
                    {uploadProgress}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Thông tin mô hình */}
      <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10 space-y-6">
        <h3 className="text-lg sm:text-xl font-bold text-white">
          Thông tin mô hình
        </h3>

        <div className="space-y-6">
          <div>
            <label className="block text-white mb-2 font-medium">
              Tên mô hình
            </label>
            <input
              type="text"
              required
              value={formData.modelName}
              onChange={(e) =>
                setFormData({ ...formData, modelName: e.target.value })
              }
              className="w-full px-4 py-3 glass rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10"
              placeholder="VD: Stable Diffusion v2.1"
            />
          </div>

          <div>
            <label className="block text-white mb-2 font-medium">Mô tả</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-3 glass rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10 resize-none"
              placeholder="Mô tả chi tiết về mô hình AI của bạn..."
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-white mb-2 font-medium">
                Loại mô hình
              </label>
              <select
                value={formData.modelType}
                onChange={(e) =>
                  setFormData({ ...formData, modelType: e.target.value })
                }
                className="w-full px-4 py-3 glass rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10"
              >
                <option value="image-generation">Image Generation</option>
                <option value="text-classification">Text Classification</option>
                <option value="object-detection">Object Detection</option>
                <option value="nlp">Natural Language Processing</option>
                <option value="other">Khác</option>
              </select>
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">
                Tiền bản quyền (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.royaltyPercentage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    royaltyPercentage: e.target.value,
                  })
                }
                className="w-full px-4 py-3 glass rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10"
                placeholder="10"
              />
              <p className="text-gray-400 text-xs mt-2">
                Phần trăm nhận được khi mô hình được giao dịch lại.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload mô hình tùy chọn */}
      <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10 space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-white">
          Upload mô hình (tuỳ chọn)
        </h3>
        <div className="border-2 border-dashed border-white/20 rounded-xl p-6 sm:p-8 lg:p-12 text-center hover:border-purple-500/50 transition-all cursor-pointer group">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 group-hover:text-purple-400 transition-colors" />
          </div>
          <input
            type="file"
            accept=".pth,.pt,.h5,.pb,.onnx,.pkl"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer block">
            {file ? (
              <div className="space-y-2">
                <p className="text-white font-semibold">{file.name}</p>
                <p className="text-gray-400 text-sm">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <>
                <p className="text-white font-semibold mb-2">
                  Chọn tệp mô hình AI
                </p>
                <p className="text-gray-400 text-sm">
                  Hỗ trợ: .pth, .pt, .h5, .pb, .onnx, .pkl
                </p>
              </>
            )}
          </label>
        </div>
      </div>

      {/* Đã bỏ form Tạo & Mint NFT tại đây vì đã có chỗ khác xử lý */}
    </div>
  );
}
