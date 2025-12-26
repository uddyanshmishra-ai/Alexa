import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function WaveformBackground({ isActive, intensity = 0.5 }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      timeRef.current += 0.01;
      const { width, height } = canvas;
      
      // Clear with fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, width, height);

      // Draw waves
      const waves = 3;
      for (let w = 0; w < waves; w++) {
        ctx.beginPath();
        const waveIntensity = isActive ? intensity : 0.2;
        const amplitude = (30 + w * 20) * waveIntensity;
        const frequency = 0.002 - w * 0.0005;
        const speed = timeRef.current * (0.5 + w * 0.2);
        
        for (let x = 0; x <= width; x += 5) {
          const y = height / 2 + 
            Math.sin(x * frequency + speed) * amplitude +
            Math.sin(x * frequency * 2 + speed * 1.5) * (amplitude * 0.5);
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        const alpha = (0.1 - w * 0.02) * (isActive ? 1.5 : 1);
        gradient.addColorStop(0, `rgba(59, 130, 246, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(139, 92, 246, ${alpha})`);
        gradient.addColorStop(1, `rgba(59, 130, 246, ${alpha})`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2 - w * 0.5;
        ctx.stroke();
      }

      // Draw floating particles
      if (isActive) {
        for (let i = 0; i < 20; i++) {
          const x = (Math.sin(timeRef.current + i) * 0.5 + 0.5) * width;
          const y = (Math.cos(timeRef.current * 0.7 + i * 0.5) * 0.5 + 0.5) * height;
          const size = Math.sin(timeRef.current + i) * 2 + 3;
          
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(139, 92, 246, ${0.1 + Math.sin(timeRef.current + i) * 0.05})`;
          ctx.fill();
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, intensity]);

  return (
    <motion.canvas
      ref={canvasRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}