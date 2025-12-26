import { useState } from "react";
import { Image as ImageIcon, Loader2 } from "lucide-react";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  showLoader?: boolean;
}

export function ImageWithFallback({
  src,
  alt,
  className = "w-full h-full object-cover",
  fallbackClassName = "w-16 h-16 text-gray-400",
  showLoader = true,
}: ImageWithFallbackProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    setRetryCount(prev => prev + 1);
  };

  if (!src || hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-lg">
        <div className="text-center">
          <ImageIcon className={fallbackClassName} />
          {hasError && retryCount < 2 && (
            <button
              onClick={handleRetry}
              className="mt-2 text-xs text-blue-400 hover:text-blue-300"
            >
              Thử lại
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {showLoader && isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-lg">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        </div>
      )}
      <img
        src={`${src}?retry=${retryCount}`}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
}

