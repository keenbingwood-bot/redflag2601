'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 文本配置数组
const CAROUSEL_ITEMS = [
  {
    id: 1,
    headline: 'TL;DR for Job Descriptions.',
    subtitle: 'Skip the corporate jargon. Decode hidden risks in seconds.',
  },
  {
    id: 2,
    headline: 'See what HR isn\'t telling you.',
    subtitle: 'Reveal hidden risks in culture, pay, and workload before you apply.',
  },
  {
    id: 3,
    headline: 'Fluent in "Corporate Speak"',
    subtitle: 'Turn vague job descriptions into clear, actionable insights.',
  },
];

// 动画配置
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const transition = {
  duration: 0.5,
  ease: 'easeInOut' as const,
};

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 自动轮播
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % CAROUSEL_ITEMS.length);
    }, 7000); // 每7秒切换一次

    return () => clearInterval(interval);
  }, []);

  const currentItem = CAROUSEL_ITEMS[currentIndex];

  return (
    <div className="min-h-[120px] md:min-h-[140px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={fadeInUp}
          transition={transition}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2 leading-tight">
            {currentItem.headline}
          </h1>
          <p className="text-lg text-slate-600">
            {currentItem.subtitle}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}