/**
 * YouTube Utility Functions
 * Handles URL parsing, video ID normalization, embed URL generation, and thumbnails.
 */

export interface ParsedYouTubeInfo {
  videoId: string | null;
  isValid: boolean;
  error?: string;
}

/**
 * Extracts an 11-character YouTube Video ID from various URL formats.
 */
export function parseYouTubeVideoId(input: string): ParsedYouTubeInfo {
  if (!input || typeof input !== 'string') {
    return { videoId: null, isValid: false, error: 'Input is required.' };
  }

  const trimmed = input.trim();

  // If input is already an 11-character alphanumeric/hyphen/underscore string
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return { videoId: trimmed, isValid: true };
  }

  try {
    let urlString = trimmed;
    if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
      urlString = 'https://' + urlString;
    }

    const url = new URL(urlString);

    // youtu.be/VIDEO_ID
    if (url.hostname.includes('youtu.be')) {
      const pathname = url.pathname.slice(1);
      const idMatch = pathname.match(/^([a-zA-Z0-9_-]{11})/);
      if (idMatch) {
        return { videoId: idMatch[1], isValid: true };
      }
    }

    // youtube.com/...
    if (url.hostname.includes('youtube.com') || url.hostname.includes('youtube-nocookie.com')) {
      // ?v=VIDEO_ID
      const vParam = url.searchParams.get('v');
      if (vParam && /^[a-zA-Z0-9_-]{11}$/.test(vParam)) {
        return { videoId: vParam, isValid: true };
      }

      // /shorts/VIDEO_ID
      if (url.pathname.startsWith('/shorts/')) {
        const parts = url.pathname.split('/');
        const candidate = parts[2];
        if (candidate && /^[a-zA-Z0-9_-]{11}$/.test(candidate)) {
          return { videoId: candidate, isValid: true };
        }
      }

      // /embed/VIDEO_ID
      if (url.pathname.startsWith('/embed/')) {
        const parts = url.pathname.split('/');
        const candidate = parts[2];
        if (candidate && /^[a-zA-Z0-9_-]{11}$/.test(candidate)) {
          return { videoId: candidate, isValid: true };
        }
      }
    }
  } catch {
    // URL parsing fallback
  }

  // Regex fallback
  const regexMatch = trimmed.match(/(?:v=|shorts\/|embed\/|youtu\.be\/|\/v\/|^)([a-zA-Z0-9_-]{11})/);
  if (regexMatch && regexMatch[1]) {
    return { videoId: regexMatch[1], isValid: true };
  }

  return { videoId: null, isValid: false, error: 'Invalid YouTube URL or Video ID.' };
}

/**
 * Returns privacy-enhanced YouTube embed URL for a given video ID.
 */
export function getYouTubeEmbedUrl(videoId: string, autoplay: boolean = true): string {
  const autoPlayParam = autoplay ? '1' : '0';
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${autoPlayParam}&rel=0&modestbranding=1&playsinline=1`;
}

/**
 * Returns standard YouTube thumbnail URLs.
 * Defaults to 'hq' (hqdefault.jpg) as it is guaranteed to exist for 100% of YouTube videos and Shorts.
 */
export function getYouTubeThumbnailUrl(videoId: string, quality: 'maxres' | 'hq' | 'default' = 'hq'): string {
  if (quality === 'maxres') {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  if (quality === 'default') {
    return `https://img.youtube.com/vi/${videoId}/default.jpg`;
  }
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
