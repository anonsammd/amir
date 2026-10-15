'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Camera, Film, Zap, ArrowDown } from 'lucide-react';

export function HeroSection() {
  const [imageError, setImageError] = useState(false);

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
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101010] border border-[#171717] mb-6 shadow-inner"
            >
              <span className="w-2 h-2 rounded-full bg-[#FF3030] animate-pulse" />
              <span className="text-xs font-mono font-medium tracking-widest text-[#B8B8B8] uppercase">
                PORTFOLIO · 2026
              </span>
            </motion.div>

            {/* Main Headline (Aamir Saifi) */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[1.05] text-white uppercase mb-4"
            >
              Aamir Saifi
            </motion.h1>

            {/* Role Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gradient-pure-red tracking-tight mb-6"
            >
              Brand Designer & Video Editor
            </motion.div>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-base sm:text-lg text-[#B8B8B8] font-normal leading-relaxed max-w-xl mb-8"
            >
              I help brands stand out with impactful video edits, eye-catching motion graphics, and visual identities that make their stories impossible to ignore
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-12"
            >
              <button
                type="button"
                onClick={scrollToReels}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#FF3030] hover:bg-[#A90F20] text-white font-bold text-sm tracking-wider uppercase transition-all duration-300 transform hover:scale-[1.03] shadow-[0_0_25px_rgba(255,48,48,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>View Selected Work</span>
              </button>

              <button
                type="button"
                onClick={scrollToContact}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#101010] hover:bg-[#171717] border border-[#262626] hover:border-[#FF3030]/60 text-white font-bold text-sm tracking-wider uppercase transition-all duration-300 transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3030] cursor-pointer"
              >
                <span>Let&apos;s Work Together</span>
                <ArrowRight className="w-4 h-4 text-[#FF3030]" />
              </button>
            </motion.div>

            {/* Key Editorial Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="grid grid-cols-3 gap-6 pt-6 border-t border-[#171717] w-full max-w-xl"
            >
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
            </motion.div>
          </motion.div>

          {/* Right Portrait & Video Editing Suite Monitor Column */}
          <motion.div
            className="lg:col-span-5 flex justify-center lg:justify-end relative"
            initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
          >
            {/* Red Backdrop Glow */}
            <div className="absolute inset-0 bg-red-radial rounded-3xl blur-2xl opacity-70 -z-10" />

            {/* Video Editing Program Monitor Window */}
            <div className="relative w-full max-w-sm sm:max-w-md aspect-[4/5] rounded-3xl overflow-hidden bg-[#101010] border border-[#262626] shadow-[0_0_50px_rgba(255,48,48,0.2)] p-3 group transform hover:scale-[1.01] transition-transform duration-500">
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#050505] flex flex-col justify-between border border-[#171717]">

                {/* Editor Program Monitor Top Toolbar */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#141414] border-b border-[#222222] text-[10px] font-mono text-[#B8B8B8] z-30">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF3030] animate-pulse" />
                    <span className="text-white font-bold tracking-wider">TIMELINE_V4 // MON_01</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#FF3030]">
                    <span className="px-1.5 py-0.5 rounded bg-[#FF3030]/20 font-bold">REC</span>
                    <span>TC 01:04:22:15</span>
                  </div>
                </div>

                {/* Hero Image Container */}
                <div className="absolute inset-x-0 top-11 bottom-12 overflow-hidden bg-[#0a0a0a] flex items-center justify-center">
                  {!imageError ? (
                    <Image
                      src="/new_amir_saifi.jpeg"
                      alt="Aamir Saifi - Brand Designer & Video Editor"
                      fill
                      priority
                      className="object-cover object-[center_10%] transition-transform duration-700 group-hover:scale-105"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    /* Fallback Portrait if new_amir_saifi.jpeg fails */
                    <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-8 bg-gradient-to-b from-[#171717] via-[#0d0d0d] to-[#050505]">
                      <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(#ff3030 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

                      <div className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-[#FF3030] to-[#A90F20] flex items-center justify-center p-1 mb-4 shadow-[0_0_35px_rgba(255,48,48,0.5)]">
                        <div className="w-full h-full rounded-full bg-[#050505] flex items-center justify-center text-white font-black text-3xl tracking-tighter">
                          AS
                        </div>
                      </div>

                      <div className="relative z-10 text-xl font-black text-white tracking-wider uppercase">
                        AAMIR SAIFI
                      </div>
                      <div className="relative z-10 text-xs font-mono text-[#FF3030] tracking-widest uppercase mt-1">
                        Brand Designer & Video Editor
                      </div>

                      <div className="relative z-10 mt-4 px-3 py-1.5 rounded-lg bg-[#1f1f1f] border border-[#333] text-[11px] font-mono text-[#B8B8B8] max-w-[240px]">
                        <Camera className="w-3.5 h-3.5 text-[#FF3030] inline mr-1.5" />
                        <span>Place your photo at <code className="text-white">public/new_amir_saifi.jpeg</code></span>
                      </div>
                    </div>
                  )}

                  {/* Cinematic Grading Vignette & Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-95 pointer-events-none" />
                </div>

                {/* Editor Timeline / Audio Waveform Bottom Toolbar */}
                <div className="relative z-30 mt-auto px-4 py-3 bg-[#121212] border-t border-[#222222] flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#B8B8B8]">
                    <div className="flex items-center gap-1 text-white">
                      <Film className="w-3 h-3 text-[#FF3030]" />
                      <span>A1 / V1 TIMELINE</span>
                    </div>
                    <div className="text-[#FF3030] font-bold tracking-widest">
                      [||||||||||||||||||||] -6.2dB
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#888] font-mono">
                    <span>COLOR: LOG-C3 TO REC.709</span>
                    <span className="text-white">FPS: 59.94</span>
                  </div>
                </div>

                {/* Floating Top-Right Badge */}
                <div className="absolute top-14 right-4 z-40">
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-[#FF3030]/40 text-[10px] font-mono text-white tracking-wider uppercase shadow-lg">
                    <Zap className="w-3 h-3 text-[#FF3030]" />
                    <span>DopexCreation</span>
                  </div>
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
            className="group flex flex-col items-center gap-2 text-[#B8B8B8] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3030] rounded-full p-2 cursor-pointer"
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
