// src/shared/components/ui/LazyImage.tsx
import React, { useState, useRef, useEffect, memo } from "react";
import { useIntersectionObserver } from "@/shared/hooks/useIntersectionObserver";

export interface LazyImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const LazyImageComponent: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = "",
  width,
  height,
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f0f0f0"/%3E%3C/svg%3E',
  onLoad,
  onError,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState<string>(placeholder);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [ref, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "50px",
  });

  useEffect(() => {
    if (isIntersecting && !isLoaded && !hasError) {
      const img = new Image();

      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
        if (onLoad) onLoad();
      };

      img.onerror = () => {
        setHasError(true);
        setImageSrc(
          "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&auto=format&fit=crop&q=75"
        );
        if (onError) onError();
      };

      img.src = src;
    }
  }, [isIntersecting, src, isLoaded, hasError, onLoad, onError]);

  return (
    <div ref={ref} className="relative">
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={`transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-70"
        } ${className}`}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        {...props}
      />
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
    </div>
  );
};

export const LazyImage = memo(LazyImageComponent);
LazyImage.displayName = "LazyImage";

// 🔑 dual export (supports both `{ LazyImage }` and `default`)
export default LazyImage;
