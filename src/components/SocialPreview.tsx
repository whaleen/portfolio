import { useState } from "react";
import { getSocialPreviewUrl, hasSocialPreview } from "@/lib/socialPreview";

interface SocialPreviewProps {
  org: string;
  repo: string;
  className?: string;
  fallback?: React.ReactNode;
}

export const SocialPreview = ({
  org,
  repo,
  className = "",
  fallback,
}: SocialPreviewProps) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Don't even attempt to load if we know it doesn't have a preview
  if (!hasSocialPreview(org, repo)) {
    return fallback ? <>{fallback}</> : null;
  }

  // If image failed to load, show fallback
  if (hasError) {
    return fallback ? <>{fallback}</> : null;
  }

  const imageUrl = getSocialPreviewUrl(org, repo);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      <img
        src={imageUrl}
        alt={`${repo} social preview`}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        loading="lazy"
      />
    </div>
  );
};
