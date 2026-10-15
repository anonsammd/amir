'use client';

import { UserCheck, Sparkles, Clock, Target, Sliders } from 'lucide-react';

export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-[#050505] relative overflow-hidden border-t border-[#171717]">
      {/* Red Radial Background Accent */}
      <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-red-radial rounded-full pointer-events-none blur-3xl opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Creative Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden bg-[#101010] border border-[#262626] p-4 shadow-2xl">
              <div className="relative w-full h-full rounded-2xl bg-[#050505] border border-[#171717] p-8 flex flex-col justify-between overflow-hidden">
                {/* Background Grid Accent */}
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(#ff3030 1px, transparent 1px)`,
                    backgroundSize: '20px 20px',
                  }}
                />

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF3030]/10 border border-[#FF3030]/30 text-xs font-mono text-[#FF3030] uppercase mb-4">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Creative Editor</span>
                  </div>
                  <h3 className="text-3xl font-black text-white uppercase tracking-tight">AAMIR SAIFI</h3>
                  <p className="text-xs font-mono text-[#B8B8B8] uppercase tracking-widest mt-1">
                    FOUNDER @ DOPEXCREATION
                  </p>
                </div>

                <div className="relative z-10 py-8 border-y border-[#171717]">
                  <div className="text-4xl font-black text-[#FF3030]">4+ YEARS</div>
                  <div className="text-xs font-mono text-[#B8B8B8] uppercase tracking-wider mt-1">
                    PERFECTING THE TIMELINE
                  </div>
                </div>

                <div className="relative z-10 flex items-center justify-between text-xs font-mono text-[#B8B8B8]">
                  <span>PREMIERE PRO / AFTER EFFECTS</span>
                  <Sparkles className="w-4 h-4 text-[#FF3030]" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Bio Copy & Editorial Highlights */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101010] border border-[#171717] mb-4 self-start">
              <Sparkles className="w-3.5 h-3.5 text-[#FF3030]" />
              <span className="text-xs font-mono font-medium tracking-widest text-[#B8B8B8] uppercase">
                BEHIND THE TIMELINE
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mb-6">
              BEHIND EVERY <span className="text-gradient-pure-red">FRAME.</span>
            </h2>

            <div className="space-y-4 text-base sm:text-lg text-[#B8B8B8] leading-relaxed mb-10">
              <p>
                I&apos;m Aamir Saifi, a Brand Designer & Professional Video Editor behind DopexCreation.

                I create distinctive brand identities and compelling visual stories that bring ideas to life. From logo design and brand visuals to cinematic edits, event films, and engaging social media content, I combine creativity, precision, and storytelling to craft visuals that make a lasting impression.
              </p>
              <p>
                My approach is simple: build brands with purpose, create videos with impact, and make every visual count.

                Design with Purpose. Edit with Emotion. Create with Impact.
              </p>
            </div>

            {/* Three Editorial Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#171717]">
              <div className="bg-[#101010] border border-[#171717] rounded-xl p-4">
                <div className="w-8 h-8 rounded-lg bg-[#171717] flex items-center justify-center text-[#FF3030] mb-3">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-base font-bold text-white tracking-tight mb-1">4+ Years</div>
                <div className="text-xs text-[#B8B8B8]">Video editing experience across diverse projects.</div>
              </div>

              <div className="bg-[#101010] border border-[#171717] rounded-xl p-4">
                <div className="w-8 h-8 rounded-lg bg-[#171717] flex items-center justify-center text-[#FF3030] mb-3">
                  <Target className="w-4 h-4" />
                </div>
                <div className="text-base font-bold text-white tracking-tight mb-1">Story First</div>
                <div className="text-xs text-[#B8B8B8]">Every edit starts with the core message and narrative.</div>
              </div>

              <div className="bg-[#101010] border border-[#171717] rounded-xl p-4">
                <div className="w-8 h-8 rounded-lg bg-[#171717] flex items-center justify-center text-[#FF3030] mb-3">
                  <Sliders className="w-4 h-4" />
                </div>
                <div className="text-base font-bold text-white tracking-tight mb-1">Detail Driven</div>
                <div className="text-xs text-[#B8B8B8]">Timing, sound design, color, and transitions matter.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
