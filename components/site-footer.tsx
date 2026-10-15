'use client';

import Image from 'next/image';
import { ArrowUp } from 'lucide-react';

export function SiteFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050505] border-t border-[#171717] py-12 text-[#B8B8B8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-[#171717]">
          {/* Brand Logo Only */}
          <div className="flex items-center gap-2.5">
            <div className="w-12 h-10 relative">
              <Image src="/new_logo_dopexcreation.png" alt="DopexCreation Logo" fill className="object-contain" />
            </div>
            <span className="text-white tracking-tighter text-sm font-bold uppercase">
              DOPEX<span className="text-[#FF3030]">CREATION</span>
            </span>
          </div>

          {/* Nav Quick Links */}
          <div className="flex flex-wrap justify-center gap-6 text-xs font-mono uppercase tracking-wider">
            <a href="#home" className="hover:text-white transition-colors">Home</a>
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#reels" className="hover:text-white transition-colors">Work</a>
            <a href="#accounts" className="hover:text-white transition-colors">Accounts</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>

          {/* Back to Top */}
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#101010] border border-[#171717] hover:border-[#FF3030] text-xs font-mono uppercase text-white transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#FF3030]" />
          </button>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div>
            © {new Date().getFullYear()} DopexCreation · Aamir Saifi. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
