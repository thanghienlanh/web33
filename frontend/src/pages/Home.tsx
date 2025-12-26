import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Shield, Zap, Wand2, TrendingUp, Users } from 'lucide-react'

export function Home() {
  return (
    <div className="space-y-20 animate-fadeIn">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-16 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass mb-6 animate-slideIn">
            <Wand2 className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-300">Powered by AI & Blockchain</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold mb-4 sm:mb-6 animate-fadeIn px-4">
            <span className="text-white block">Thị trường</span>
            <span className="gradient-text-blue block">Mô hình AI</span>
            <span className="text-white block">Phi tập trung</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 animate-fadeIn px-4" style={{ animationDelay: '0.2s' }}>
            Mua, bán và trao đổi mô hình AI trên blockchain. 
            <span className="text-purple-400 font-semibold"> Sở hữu, kiếm tiền</span> và phát triển với công nghệ Web3.
          </p>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 px-4 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <Link
              to="/marketplace"
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-500 hover:via-purple-500 hover:to-indigo-500 text-white rounded-xl transition-all flex items-center space-x-2 shadow-lg glow hover:glow-purple hover-lift font-semibold text-lg"
            >
              <span>Khám phá thị trường</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/create"
              className="px-8 py-4 glass hover:glass-strong text-white rounded-xl transition-all hover-lift font-semibold text-lg border border-white/10"
            >
              Tạo mô hình mới
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-0">
        <div className="glass rounded-2xl p-8 hover-lift group border border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg glow">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Mô hình AI đa dạng</h3>
            <p className="text-gray-300 leading-relaxed">
              Từ image generation đến text classification, tìm mọi loại mô hình AI bạn cần
            </p>
          </div>
        </div>

        <div className="glass rounded-2xl p-8 hover-lift group border border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg glow-purple">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">An toàn & Minh bạch</h3>
            <p className="text-gray-300 leading-relaxed">
              Smart contracts đảm bảo giao dịch an toàn, minh bạch và không thể thay đổi
            </p>
          </div>
        </div>

        <div className="glass rounded-2xl p-8 hover-lift group border border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Kiếm tiền từ AI</h3>
            <p className="text-gray-300 leading-relaxed">
              Bán mô hình AI của bạn và nhận royalty tự động cho mỗi lần bán lại
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="glass-strong rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-white/20 relative overflow-hidden mx-4 sm:mx-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5"></div>
        <div className="relative z-10">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Thống kê nền tảng</h2>
            <p className="text-gray-400 text-sm sm:text-base">Theo dõi sự phát triển của thị trường</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="text-center group">
              <div className="text-5xl font-extrabold gradient-text-blue mb-3 group-hover:scale-110 transition-transform">0</div>
              <div className="flex items-center justify-center space-x-2 text-gray-300">
                <Sparkles className="w-5 h-5" />
                <span>Mô hình AI</span>
              </div>
            </div>
            <div className="text-center group">
              <div className="text-5xl font-extrabold gradient-text mb-3 group-hover:scale-110 transition-transform">0</div>
              <div className="flex items-center justify-center space-x-2 text-gray-300">
                <Users className="w-5 h-5" />
                <span>Người dùng</span>
              </div>
            </div>
            <div className="text-center group">
              <div className="text-5xl font-extrabold text-green-400 mb-3 group-hover:scale-110 transition-transform">0</div>
              <div className="text-sm text-gray-400 mb-1">ETH</div>
              <div className="flex items-center justify-center space-x-2 text-gray-300">
                <TrendingUp className="w-5 h-5" />
                <span>Tổng giao dịch</span>
              </div>
            </div>
            <div className="text-center group">
              <div className="text-5xl font-extrabold text-yellow-400 mb-3 group-hover:scale-110 transition-transform">0</div>
              <div className="flex items-center justify-center space-x-2 text-gray-300">
                <Zap className="w-5 h-5" />
                <span>Giao dịch</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

