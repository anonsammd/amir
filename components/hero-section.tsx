'use client';

import { motion } from 'framer-motion';
import { Play, Sparkles, ArrowDown, Award, Zap } from 'lucide-react';

export function HeroSection() {
  const scrollToReels = () => {
    document.getElementById('reels')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden bg-[#050505]"
    >
      {/* Background Red Glow Accent */}
      <div className="absolute top-1/4 right-10 w-[500px] h-[500px] bg-red-radial rounded-full pointer-events-none blur-3xl opacity-60" />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-red-radial rounded-full pointer-events-none blur-3xl opacity-40" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <motion.div
            className="lg:col-span-7 flex flex-col items-start"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101010] border border-[#171717] mb-6">
              <span className="w-2 h-2 rounded-full bg-[#FF3030] animate-pulse" />
              <span className="text-xs font-mono font-medium tracking-wider text-[#B8B8B8] uppercase">
                INDEPENDENT VIDEO EDITOR · 4+ YEARS EXPERIENCE
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] text-white uppercase mb-6">
              YOUR VISION. <br />
              <span className="text-gradient-pure-red">MY EDIT.</span> <br />
              PURE IMPACT.
            </h1>

            {/* Supporting Text */}
            <p className="text-lg sm:text-xl text-[#B8B8B8] font-normal leading-relaxed max-w-2xl mb-8">
              I turn raw footage into cinematic stories, scroll-stopping reels, and visuals people remember.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-12">
              <button
                type="button"
                onClick={scrollToReels}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#FF3030] hover:bg-[#A90F20] text-white font-bold text-sm tracking-wider uppercase transition-all duration-200 transform hover:scale-[1.02] shadow-[0_0_20px_rgba(255,48,48,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Explore My Work</span>
              </button>

              <button
                type="button"
                onClick={scrollToContact}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#101010] hover:bg-[#171717] border border-[#262626] hover:border-[#FF3030]/50 text-white font-bold text-sm tracking-wider uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3030]"
              >
                <Sparkles className="w-4 h-4 text-[#FF3030]" />
                <span>Let&apos;s Collaborate</span>
              </button>
            </div>

            {/* Key Editorial Badges */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#171717] w-full max-w-xl">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white">4+</div>
                <div className="text-xs text-[#B8B8B8] font-medium uppercase tracking-wider mt-0.5">Years Craft</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white">100%</div>
                <div className="text-xs text-[#B8B8B8] font-medium uppercase tracking-wider mt-0.5">Custom Edits</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-[#FF3030]">9:16</div>
                <div className="text-xs text-[#B8B8B8] font-medium uppercase tracking-wider mt-0.5">Reel Specialist</div>
              </div>
            </div>
          </motion.div>

          {/* Right Portrait & Visual Composition Column */}
          <motion.div
            className="lg:col-span-5 flex justify-center lg:justify-end relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            {/* Red Backdrop Glow */}
            <div className="absolute inset-0 bg-red-radial rounded-3xl blur-2xl opacity-70 -z-10" />

            {/* Creative Card / Portrait Display Container */}
            <div className="relative w-full max-w-sm sm:max-w-md aspect-[4/5] rounded-3xl overflow-hidden bg-[#101010] border border-[#262626] shadow-2xl p-3 group">
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#050505] flex flex-col justify-between p-6 border border-[#171717]">
                {/* Background Editorial Graphic Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent z-10" />

                {/* Simulated Portrait Image / Creative Showcase */}
                <div className="absolute inset-0 flex items-center justify-center bg-[#101010]">
                  <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-8 bg-gradient-to-b from-[#171717] to-[#050505]">
                    {/* Creative Abstract Visual Representation of Amir Saifi */}
                    <div className="w-28 h-28 sm:w-32 sm:32 rounded-full bg-gradient-to-br from-[#FF3030] to-[#A90F20] flex items-center justify-center p-1 mb-4 shadow-[0_0_30px_rgba(255,48,48,0.4)]">
                      <div className="w-full h-full rounded-full bg-[#050505] flex items-center justify-center text-white font-black text-2xl tracking-tighter">
                        AS
                      </div>
                    </div>
                    <div className="text-xl font-bold text-white tracking-wider uppercase">AMIR SAIFI</div>
                    <div className="text-xs font-mono text-[#FF3030] tracking-widest uppercase mt-1">
                      Lead Video Editor & Designer
                    </div>
                  </div>
                </div>

                {/* Floating Top Badge */}
                <div className="relative z-20 self-end">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#050505]/80 backdrop-blur-md border border-[#FF3030]/40 text-[10px] font-mono text-white tracking-wider uppercase">
                    <Zap className="w-3 h-3 text-[#FF3030]" />
                    <span>DopexCreation Studio</span>
                  </div>
                </div>

                {/* Bottom Overlay Info */}
                <div className="relative z-20 space-y-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#FF3030]" />
                    <span className="text-xs font-mono uppercase tracking-widest text-white font-bold">
                      Cinematic Quality
                    </span>
                  </div>
                  <p className="text-xs text-[#B8B8B8] leading-normal font-sans">
                    Specialized in high-converting reels, event recap films, and storytelling motion design.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-16 flex justify-center">
          <button
            type="button"
            onClick={scrollToReels}
            className="group flex flex-col items-center gap-2 text-[#B8B8B8] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3030] rounded-full p-2"
            aria-label="Scroll to portfolio reels"
          >
            <span className="text-[10px] font-mono tracking-widest uppercase">SCROLL</span>
            <ArrowDown className="w-4 h-4 text-[#FF3030] group-hover:translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
