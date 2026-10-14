'use client';

import { motion } from 'framer-motion';
import { Palette, Video, CheckCircle2, Sparkles, ArrowUpRight } from 'lucide-react';

export function ServicesSection() {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const services = [
    {
      title: 'Branding & Designing',
      subtitle: 'Visual identity systems that leave a lasting impression',
      icon: Palette,
      description: 'We craft distinctive brand aesthetics, graphic assets, and visual systems that align with your voice and elevate your market presence.',
      bulletPoints: [
        'Comprehensive Visual Identity & Logo Systems',
        'Custom Typography, Palettes & Brand Guidelines',
        'High-Impact Social Media Graphics & Banners',
        'Pitch Decks, Marketing Collateral & Print Assets',
      ],
    },
    {
      title: 'Video & Motion',
      subtitle: 'Cinematic storytelling and scroll-stopping motion design',
      icon: Video,
      description: 'Transforming raw footage into engaging visual stories. Specialized in pacing, rhythm, color grading, and dynamic motion graphics.',
      bulletPoints: [
        'Cinematic Event Films & Brand Promos',
        'Scroll-Stopping Short-Form Reels & TikToks (9:16)',
        'Motion Graphics, VFX & Kinetic Typography',
        'Professional Audio Editing, Sound Design & Color Grading',
      ],
    },
  ];

  return (
    <section id="services" className="py-24 bg-[#050505] relative overflow-hidden border-t border-[#171717]">
      {/* Background Red Glow Accent */}
      <div className="absolute top-1/2 left-10 w-[500px] h-[500px] bg-red-radial rounded-full pointer-events-none blur-3xl opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101010] border border-[#171717] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#FF3030]" />
            <span className="text-xs font-mono font-medium tracking-widest text-[#B8B8B8] uppercase">
              PROFESSIONAL EXPERTISE
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mb-4">
            WHAT WE <span className="text-gradient-pure-red">DELIVER.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#B8B8B8] font-normal leading-relaxed">
            End-to-end creative direction tailored to build authority, capture attention, and drive results.
          </p>
        </div>

        {/* Services Grid (2 Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="bg-[#101010] border border-[#171717] hover:border-[#FF3030]/50 rounded-3xl p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,48,48,0.15)] group"
              >
                <div>
                  {/* Icon & Badge Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#FF3030]/10 border border-[#FF3030]/30 text-[#FF3030] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-mono text-[#B8B8B8] uppercase tracking-wider px-3 py-1 rounded-full bg-[#171717] border border-[#262626]">
                      0{idx + 1} / SERVICE
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-[#FF3030] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs font-mono text-[#FF3030] uppercase tracking-widest mb-6">
                    {service.subtitle}
                  </p>

                  <p className="text-sm sm:text-base text-[#B8B8B8] leading-relaxed mb-8">
                    {service.description}
                  </p>

                  {/* Bullet Points */}
                  <div className="space-y-3.5 mb-10 pt-6 border-t border-[#171717]">
                    {service.bulletPoints.map((point) => (
                      <div key={point} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#FF3030] shrink-0 mt-0.5" />
                        <span className="text-sm text-white font-medium">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  type="button"
                  onClick={scrollToContact}
                  className="w-full py-4 rounded-2xl bg-[#171717] hover:bg-[#FF3030] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(255,48,48,0.3)] cursor-pointer"
                >
                  <span>Inquire About {service.title}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
