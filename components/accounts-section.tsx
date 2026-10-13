'use client';

import { SocialAccount } from '@/lib/types';
import { ExternalLink, Share2, Video } from 'lucide-react';
import { InstagramIcon, YouTubeIcon, TwitterIcon } from './brand-icons';

interface AccountsSectionProps {
  initialAccounts: SocialAccount[];
}

export function AccountsSection({ initialAccounts }: AccountsSectionProps) {
  const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('instagram')) return <InstagramIcon className="w-5 h-5 text-[#FF3030]" />;
    if (p.includes('youtube')) return <YouTubeIcon className="w-5 h-5 text-[#FF3030]" />;
    if (p.includes('twitter') || p.includes('x')) return <TwitterIcon className="w-5 h-5 text-[#FF3030]" />;
    if (p.includes('tiktok')) return <Video className="w-5 h-5 text-[#FF3030]" />;
    return <Share2 className="w-5 h-5 text-[#FF3030]" />;
  };

  return (
    <section id="accounts" className="py-24 bg-[#050505] relative overflow-hidden border-t border-[#171717]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101010] border border-[#171717] mb-4">
            <Share2 className="w-3.5 h-3.5 text-[#FF3030]" />
            <span className="text-xs font-mono font-medium tracking-widest text-[#B8B8B8] uppercase">
              FEATURED FEEDS & CHANNELS
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mb-4">
            BUILT FOR <span className="text-gradient-pure-red">THE FEED.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#B8B8B8] font-normal leading-relaxed">
            Editing designed for platforms where the first few seconds matter.
          </p>
        </div>

        {/* Accounts Grid */}
        {initialAccounts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {initialAccounts.map((account) => (
              <a
                key={account.id}
                href={account.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col justify-between bg-[#101010] border border-[#171717] hover:border-[#FF3030]/60 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,48,48,0.2)]"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#171717] flex items-center justify-center border border-[#262626] group-hover:border-[#FF3030]/40 transition-colors">
                      {getPlatformIcon(account.platform)}
                    </div>
                    <span className="p-2 rounded-lg bg-[#171717] text-[#B8B8B8] group-hover:text-white group-hover:bg-[#FF3030] transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-[#FF3030] transition-colors mb-1">
                    {account.name}
                  </h3>

                  {account.handle && (
                    <div className="text-xs font-mono text-[#FF3030] font-medium tracking-wider uppercase mb-3">
                      {account.handle}
                    </div>
                  )}

                  {account.description && (
                    <p className="text-xs text-[#B8B8B8] leading-relaxed font-sans line-clamp-3">
                      {account.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-[#171717] flex items-center justify-between text-[11px] font-mono text-[#B8B8B8] uppercase">
                  <span>Visit Channel / Feed</span>
                  <span className="text-[#FF3030] font-bold group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-sm text-[#B8B8B8]">
            No social channels listed at the moment.
          </div>
        )}
      </div>
    </section>
  );
}
