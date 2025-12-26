import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function VoiceWave({ isActive, bars = 5, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    red: 'bg-red-500'
  };

  return (
    <div className="flex items-center justify-center gap-1 h-8">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          animate={isActive ? {
            scaleY: [0.3, 1, 0.3],
            opacity: [0.5, 1, 0.5]
          } : {
            scaleY: 0.3,
            opacity: 0.3
          }}
          transition={{
            repeat: isActive ? Infinity : 0,
            duration: 0.5 + Math.random() * 0.5,
            delay: i * 0.1,
            ease: 'easeInOut'
          }}
          className={cn(
            "w-1 rounded-full origin-center",
            colorClasses[color]
          )}
          style={{
            height: `${12 + Math.random() * 16}px`
          }}
        />
      ))}
    </div>
  );
}