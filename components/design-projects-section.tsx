'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { DesignProject } from '@/lib/types';
import { ExternalLink, Palette, Sparkles, Image as ImageIcon } from 'lucide-react';

interface DesignProjectsSectionProps {
  initialDesignProjects: DesignProject[];
}

export function DesignProjectsSection({ initialDesignProjects }: DesignProjectsSectionProps) {
  const [designProjects] = useState<DesignProject[]>(initialDesignProjects);

  if (!designProjects || designProjects.length === 0) {
    return null;
  }

  return (
    <section id="design-showcase" className="py-24 bg-[#050505] relative overflow-hidden border-t border-[#171717]">
      {/* Background Accent */}
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-red-radial rounded-full pointer-events-none blur-3xl opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101010] border border-[#171717] mb-4">
            <Palette className="w-3.5 h-3.5 text-[#FF3030]" />
            <span className="text-xs font-mono font-medium tracking-widest text-[#B8B8B8] uppercase">
              CREATIVE DIRECTION & BRAND DESIGN
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mb-4">
            DESIGN <span className="text-gradient-pure-red">SHOWCASE.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#B8B8B8] font-normal leading-relaxed">
            Explore curated branding projects, visual identity systems, and design portfolios. Click any project to view on Behance.
          </p>
        </div>

        {/* Design Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {designProjects.map((project, idx) => (
            <motion.a
              key={project.id}
              href={project.behanceLink}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="group flex flex-col bg-[#101010] border border-[#171717] hover:border-[#FF3030]/60 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-[0_10px_30px_rgba(255,48,48,0.2)] cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-[16/10] bg-[#171717] overflow-hidden">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-transparent to-transparent opacity-60" />

                {/* Floating Brand Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#FF3030]/40 text-[10px] font-mono text-white tracking-widest uppercase">
                    {project.brandName}
                  </span>
                </div>

                {/* External Link Indicator on Hover */}
                <div className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 backdrop-blur-md border border-[#FF3030]/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-4 h-4 text-[#FF3030]" />
                </div>
              </div>

              {/* Card Metadata */}
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-lg font-extrabold text-white uppercase tracking-tight group-hover:text-[#FF3030] transition-colors line-clamp-1 mb-2">
                    {project.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#171717] mt-4">
                  <span className="text-xs font-mono text-[#B8B8B8] uppercase">View on Behance</span>
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#FF3030] group-hover:translate-x-1 transition-transform">
                    <span>Explore Case</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
