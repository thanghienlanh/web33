import { useEffect, useState } from 'react'
import { Wallet, Sparkles } from 'lucide-react'

interface SplashScreenProps {
  onFinish: () => void
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 2
      })
    }, 30)

    // Finish after 2 seconds
    const timer = setTimeout(() => {
      setFadeOut(true)
      setTimeout(() => {
        onFinish()
      }, 500)
    }, 2000)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [onFinish])

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center space-y-8 animate-fadeIn">
        {/* Logo Animation */}
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl glow-purple animate-pulse-slow">
            <Wallet className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 animate-bounce">
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold">
            <span className="gradient-text-blue">TríTuệMarket</span>
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl">AI Model Marketplace</p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 sm:w-80 mx-auto">
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full transition-all duration-300 relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-2">{progress}%</p>
        </div>

        {/* Loading Text */}
        <div className="flex items-center justify-center space-x-2 text-gray-400">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  )
}

