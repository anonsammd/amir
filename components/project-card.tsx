'use client';

import { Project } from '@/lib/types';
import { YouTubeEmbed } from './youtube-embed';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const formattedIndex = (index + 1).toString().padStart(2, '0');

  return (
    <article
      className="w-full max-w-[300px] sm:max-w-[320px] mx-auto flex flex-col bg-[#101010] border border-[#171717] hover:border-[#FF3030]/50 rounded-2xl p-3 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,48,48,0.15)] group"
      style={{
        position: 'relative',
        backgroundColor: '#101010',
        borderRadius: '1rem',
        border: '1px solid #171717',
        padding: '0.75rem',
        maxWidth: '320px',
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 9:16 Vertical Embed Container */}
      <div className="w-full mb-3" style={{ width: '100%', marginBottom: '0.75rem' }}>
        <YouTubeEmbed
          videoId={project.youtubeId}
          title={project.title}
          customThumbnail={project.customThumbnail}
        />
      </div>

      {/* Card Metadata */}
      <div
        className="flex flex-col px-1 pb-1 flex-1 justify-between"
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingLeft: '0.25rem', paddingRight: '0.25rem', paddingBottom: '0.25rem', flex: '1 1 0%' }}
      >
        <div>
          {/* Number & Category Header */}
          <div
            className="flex items-center justify-between gap-2 mb-1.5"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.375rem' }}
          >
            <span
              className="text-[11px] font-mono font-bold text-[#FF3030] tracking-wider"
              style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 'bold', color: '#FF3030', letterSpacing: '0.05em' }}
            >
              {formattedIndex} / {project.category.toUpperCase()}
            </span>
            {project.featured && (
              <span
                className="px-2 py-0.5 rounded-full bg-[#FF3030]/10 border border-[#FF3030]/30 text-[9px] font-mono font-medium text-[#FF3030] tracking-wider uppercase"
                style={{
                  paddingLeft: '0.5rem',
                  paddingRight: '0.5rem',
                  paddingTop: '0.125rem',
                  paddingBottom: '0.125rem',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(255, 48, 48, 0.1)',
                  border: '1px solid rgba(255, 48, 48, 0.3)',
                  fontSize: '9px',
                  fontFamily: 'monospace',
                  fontWeight: 500,
                  color: '#FF3030',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                FEATURED
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            className="text-base sm:text-lg font-extrabold text-white tracking-tight group-hover:text-[#FF3030] transition-colors line-clamp-1 mb-1"
            style={{ fontSize: '1.125rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.25rem' }}
          >
            {project.title}
          </h3>

          {/* Description */}
          {project.description && (
            <p
              className="text-xs text-[#B8B8B8] font-normal leading-relaxed line-clamp-2"
              style={{ fontSize: '0.75rem', color: '#B8B8B8', lineHeight: 1.625 }}
            >
              {project.description}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
