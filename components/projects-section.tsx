'use client';

import { useState } from 'react';
import { Project } from '@/lib/types';
import { ProjectCard } from './project-card';
import { Film } from 'lucide-react';

interface ProjectsSectionProps {
  initialProjects: Project[];
}

export function ProjectsSection({ initialProjects }: ProjectsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Extract unique categories
  const categories = ['ALL', ...Array.from(new Set(initialProjects.map((p) => p.category.toUpperCase())))];

  const filteredProjects =
    selectedCategory === 'ALL'
      ? initialProjects
      : initialProjects.filter((p) => p.category.toUpperCase() === selectedCategory);

  return (
    <section id="reels" className="py-24 bg-[#050505] relative overflow-hidden border-t border-[#171717]" style={{ backgroundColor: '#050505', paddingTop: '6rem', paddingBottom: '6rem' }}>
      {/* Background Accent */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-red-radial rounded-full pointer-events-none blur-3xl opacity-30"
        style={{ position: 'absolute', pointerEvents: 'none' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" style={{ maxWidth: '80rem', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1rem', paddingRight: '1rem', position: 'relative', zIndex: 10 }}>
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: '48rem', marginLeft: 'auto', marginRight: 'auto', marginBottom: '3rem' }}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101010] border border-[#171717] mb-4" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.875rem', borderRadius: '9999px', backgroundColor: '#101010', border: '1px solid #171717', marginBottom: '1rem' }}>
            <Film className="w-3.5 h-3.5 text-[#FF3030]" style={{ width: '0.875rem', height: '0.875rem', color: '#FF3030' }} />
            <span className="text-xs font-mono font-medium tracking-widest text-[#B8B8B8] uppercase" style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#B8B8B8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              THE SHOWREEL COLLECTION
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mb-4" style={{ fontSize: '2.5rem', fontWeight: 900, color: '#FFFFFF', textTransform: 'uppercase', marginBottom: '1rem' }}>
            WORK THAT <span className="text-gradient-pure-red" style={{ color: '#FF3030' }}>SPEAKS.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#B8B8B8] font-normal leading-relaxed" style={{ fontSize: '1.125rem', color: '#B8B8B8', lineHeight: 1.625 }}>
            A selection of edits built to capture attention, create emotion, and tell better stories.
          </p>
        </div>

        {/* Category Filters */}
        {categories.length > 2 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '3rem' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-[#FF3030] text-white shadow-[0_0_15px_rgba(255,48,48,0.3)]'
                    : 'bg-[#101010] text-[#B8B8B8] hover:text-white border border-[#171717] hover:border-[#262626]'
                }`}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  backgroundColor: selectedCategory === cat ? '#FF3030' : '#101010',
                  color: selectedCategory === cat ? '#FFFFFF' : '#B8B8B8',
                  border: selectedCategory === cat ? '1px solid #FF3030' : '1px solid #171717',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
              justifyItems: 'center',
              width: '100%',
            }}
          >
            {filteredProjects.map((project, idx) => (
              <ProjectCard key={project.id} project={project} index={idx} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-[#101010] border border-[#171717] rounded-3xl max-w-lg mx-auto" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', backgroundColor: '#101010', border: '1px solid #171717', borderRadius: '1.5rem', padding: '5rem 1rem', maxWidth: '32rem', marginLeft: 'auto', marginRight: 'auto' }}>
            <div className="w-16 h-16 rounded-full bg-[#171717] flex items-center justify-center text-[#FF3030] mb-4" style={{ width: '4rem', height: '4rem', borderRadius: '9999px', backgroundColor: '#171717', color: '#FF3030', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Film className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#FFFFFF', marginBottom: '0.5rem' }}>
              No Showreel Edits Found
            </h3>
            <p className="text-sm text-[#B8B8B8]" style={{ fontSize: '0.875rem', color: '#B8B8B8' }}>
              There are currently no projects matching this category. Check back soon for fresh edits!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
