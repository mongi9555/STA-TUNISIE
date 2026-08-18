import React from 'react';

export interface BackgroundMediaProps {
  type?: 'image' | 'video' | 'default' | 'none';
  imageUrl?: string;
  videoUrl?: string;
  overlayOpacity?: number;
  blur?: boolean;
  defaultFallbackImage?: string;
  className?: string;
}

/**
 * Utility function to extract a 11-character YouTube video ID from various YouTube URL formats.
 */
export function extractYouTubeId(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = trimmed.match(regExp);
  if (match && match[2] && match[2].length === 11) {
    return match[2];
  }
  // Raw 11-character ID check
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  return null;
}

export const BackgroundMediaRender: React.FC<BackgroundMediaProps> = ({
  type = 'image',
  imageUrl,
  videoUrl,
  overlayOpacity = 0.85,
  blur = true,
  defaultFallbackImage,
  className = '',
}) => {
  if (type === 'none') {
    return null;
  }

  const effectiveImage = imageUrl || defaultFallbackImage;
  const youtubeId = extractYouTubeId(videoUrl);

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden select-none ${className}`}>
      {/* 1. MEDIA LAYER (Video or Image) */}
      {type === 'video' && videoUrl ? (
        youtubeId ? (
          // YouTube Video Embed Loop
          <div className="absolute inset-0 w-full h-full scale-135 sm:scale-125 transition-transform duration-700">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&playsinline=1&enablejsapi=1`}
              title="Chery Background Video"
              className="w-full h-full object-cover pointer-events-none border-0"
              allow="autoplay; encrypted-media; picture-in-picture"
              style={{ width: '100vw', height: '100vh', transform: 'scale(1.3)' }}
            />
          </div>
        ) : (
          // Direct HTML5 MP4 / WebM / DataURL Video Loop
          <video
            autoPlay
            loop
            muted
            playsInline
            className={`w-full h-full object-cover object-center filter brightness-105 contrast-100 transition-all duration-700 ${
              blur ? 'blur-md scale-110' : 'scale-105'
            }`}
          >
            <source src={videoUrl} />
          </video>
        )
      ) : (
        // Image Background
        effectiveImage && (
          <div
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 ${
              blur ? 'blur-md scale-105' : 'scale-100'
            }`}
            style={{ backgroundImage: `url(${effectiveImage})` }}
          />
        )
      )}

      {/* 2. HIGH-CONTRAST LIGHT OVERLAY FOR TEXT READABILITY */}
      <div
        className="absolute inset-0 bg-white/90 backdrop-blur-[2px] transition-opacity duration-500"
        style={{ opacity: Math.max(0.75, overlayOpacity) }}
      />
    </div>
  );
};
