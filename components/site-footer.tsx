'use client';

import Link from 'next/link';
import { Film, ArrowUp, Lock } from 'lucide-react';

export function SiteFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050505] border-t border-[#171717] py-12 text-[#B8B8B8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-[#171717]">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-[#FF3030] flex items-center justify-center text-black font-black text-sm">
              <Film className="w-4 h-4 text-black stroke-[2.5]" />
            </div>
            <span className="text-white tracking-tighter text-lg font-black uppercase">
              DOPEX<span className="text-[#FF3030]">CREATION</span>
            </span>
          </div>

          {/* Nav Quick Links */}
          <div className="flex flex-wrap justify-center gap-6 text-xs font-mono uppercase tracking-wider">
            <a href="#home" className="hover:text-white transition-colors">Home</a>
            <a href="#reels" className="hover:text-white transition-colors">Reels</a>
            <a href="#accounts" className="hover:text-white transition-colors">Accounts</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>

          {/* Back to Top */}
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#101010] border border-[#171717] hover:border-[#FF3030] text-xs font-mono uppercase text-white transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#FF3030]" />
          </button>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div>
            © {new Date().getFullYear()} DopexCreation · Amir Saifi. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-[#B8B8B8] hover:text-[#FF3030] transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
