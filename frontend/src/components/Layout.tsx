import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SuiConnectButton } from "./SuiConnectButton";
import {
  Wallet,
  Home,
  ShoppingBag,
  Plus,
  Package,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <header className="glass-strong border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg glow">
                <Wallet className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold gradient-text-blue block">
                  TríTuệMarket
                </span>
                <span className="text-xs text-gray-400">
                  AI Model Marketplace
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              <Link
                to="/"
                className={`px-5 py-2.5 rounded-xl transition-all flex items-center space-x-2 font-medium ${
                  isActive("/")
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg glow"
                    : "text-gray-300 hover:glass hover:text-white"
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Trang chủ</span>
              </Link>
              <Link
                to="/marketplace"
                className={`px-5 py-2.5 rounded-xl transition-all flex items-center space-x-2 font-medium ${
                  isActive("/marketplace")
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg glow"
                    : "text-gray-300 hover:glass hover:text-white"
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Thị trường</span>
              </Link>
              <Link
                to="/create"
                className={`px-5 py-2.5 rounded-xl transition-all flex items-center space-x-2 font-medium ${
                  isActive("/create")
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg glow"
                    : "text-gray-300 hover:glass hover:text-white"
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Tạo mô hình</span>
              </Link>
              <Link
                to="/my-models"
                className={`px-5 py-2.5 rounded-xl transition-all flex items-center space-x-2 font-medium ${
                  isActive("/my-models")
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg glow"
                    : "text-gray-300 hover:glass hover:text-white"
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Mô hình của tôi</span>
              </Link>
            </nav>

            {/* Mobile Menu Button & Connect Wallet */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-2">
                <SuiConnectButton />
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 glass rounded-lg text-white hover:glass-strong transition-all"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 animate-slideIn">
              <nav className="flex flex-col space-y-2">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl transition-all flex items-center space-x-3 font-medium ${
                    isActive("/")
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "glass text-gray-300 hover:glass-strong hover:text-white"
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span>Trang chủ</span>
                </Link>
                <Link
                  to="/marketplace"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl transition-all flex items-center space-x-3 font-medium ${
                    isActive("/marketplace")
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "glass text-gray-300 hover:glass-strong hover:text-white"
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Thị trường</span>
                </Link>
                <Link
                  to="/create"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl transition-all flex items-center space-x-3 font-medium ${
                    isActive("/create")
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "glass text-gray-300 hover:glass-strong hover:text-white"
                  }`}
                >
                  <Plus className="w-5 h-5" />
                  <span>Tạo mô hình</span>
                </Link>
                <Link
                  to="/my-models"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl transition-all flex items-center space-x-3 font-medium ${
                    isActive("/my-models")
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "glass text-gray-300 hover:glass-strong hover:text-white"
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span>Mô hình của tôi</span>
                </Link>
                <div className="pt-2">
                  <SuiConnectButton />
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="glass-strong border-t border-white/10 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text-blue">
                TríTuệMarket
              </span>
            </div>
            <p className="text-gray-400 mb-2">
              © 2026 TríTuệMarket - Decentralized AI Model Marketplace
            </p>
            <p className="text-sm text-gray-500">Powered by Blockchain & AI</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
