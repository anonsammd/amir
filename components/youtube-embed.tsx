'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play, AlertCircle, Loader2 } from 'lucide-react';
import { getYouTubeEmbedUrl, getYouTubeThumbnailUrl } from '@/lib/youtube';

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  customThumbnail?: string;
  autoPlayOnClick?: boolean;
}

export function YouTubeEmbed({ videoId, title, customThumbnail, autoPlayOnClick = true }: YouTubeEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [thumbSrc, setThumbSrc] = useState<string>(
    customThumbnail || getYouTubeThumbnailUrl(videoId, 'hq')
  );

  const handlePlay = () => {
    setIsLoading(true);
    setIsPlaying(true);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    if (!thumbSrc.includes('hqdefault')) {
      setThumbSrc(getYouTubeThumbnailUrl(videoId, 'hq'));
    }
  };

  return (
    <div
      className="relative w-full bg-[#050505] rounded-xl overflow-hidden border border-[#262626] group"
      style={{ position: 'relative', aspectRatio: '9/16' }}
    >
      {!isPlaying ? (
        <div
          onClick={handlePlay}
          className="relative w-full h-full cursor-pointer flex items-center justify-center overflow-hidden"
          style={{ position: 'relative', width: '100%', height: '100%' }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handlePlay();
            }
          }}
          aria-label={`Play video: ${title}`}
        >
          {/* Thumbnail Image */}
          <Image
            src={thumbSrc}
            alt={title}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={handleImageError}
            priority={false}
          />

          {/* Dark Overlay with Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

          {/* Red Play Button */}
          <div className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FF3030] group-hover:bg-[#A90F20] text-white flex items-center justify-center shadow-[0_0_25px_rgba(255,48,48,0.5)] transform group-hover:scale-110 transition-all duration-300">
            <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current ml-1" />
          </div>

          {/* Hover Subtle Border Glow */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#FF3030]/60 rounded-xl transition-colors pointer-events-none" />
        </div>
      ) : (
        <div className="relative w-full h-full bg-black" style={{ position: 'relative', width: '100%', height: '100%' }}>
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#101010] z-10 text-[#B8B8B8]">
              <Loader2 className="w-8 h-8 text-[#FF3030] animate-spin mb-2" />
              <span className="text-xs font-mono uppercase tracking-wider">Loading Player...</span>
            </div>
          )}

          {hasError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-[#101010] z-20">
              <AlertCircle className="w-10 h-10 text-[#FF3030] mb-2" />
              <p className="text-xs text-white font-bold mb-1">Video Player Unavailable</p>
              <p className="text-[11px] text-[#B8B8B8] mb-3">
                This video may be private, restricted, or unavailable for external embed.
              </p>
              <a
                href={`https://www.youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-md bg-[#262626] hover:bg-[#FF3030] text-white text-xs font-mono tracking-wider transition-colors"
              >
                Watch on YouTube
              </a>
            </div>
          ) : (
            <iframe
              src={getYouTubeEmbedUrl(videoId, autoPlayOnClick)}
              title={title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onLoad={handleIframeLoad}
              onError={() => setHasError(true)}
            />
          )}
        </div>
      )}
    </div>
  );
}
