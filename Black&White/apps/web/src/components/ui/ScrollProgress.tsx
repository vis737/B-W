// apps/web/src/components/ui/ScrollProgress.tsx
import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 z-[100] origin-left shadow-[0_0_8px_rgba(245,158,11,0.8)]"
      aria-hidden="true"
    />
  );
};
