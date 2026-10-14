'use client';

import { motion, useScroll } from 'framer-motion';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#FF3030] via-[#ff5252] to-[#ff8080] z-50 origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
