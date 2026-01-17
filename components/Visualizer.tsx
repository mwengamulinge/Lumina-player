
import React, { useEffect, useRef } from 'react';

interface VisualizerProps {
  isPlaying: boolean;
  colors: string[];
}

const Visualizer: React.FC<VisualizerProps> = ({ isPlaying, colors }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Fixed: Added initial value 0 to useRef to satisfy argument requirements (1-based line 11 error).
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const particles: any[] = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 5 + 2,
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 2 - 1,
        color: colors[i % colors.length]
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.1)';
      ctx.fillRect(0, 0, width, height);

      particles.forEach(p => {
        if (isPlaying) {
          p.x += p.speedX;
          p.y += p.speedY;

          if (p.x < 0 || p.x > width) p.speedX *= -1;
          if (p.y < 0 || p.y > height) p.speedY *= -1;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.6;
        ctx.fill();
        
        // Add glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = p.color;
      });

      // Draw bars
      const barCount = 64;
      const barWidth = width / barCount;
      for (let i = 0; i < barCount; i++) {
        const barHeight = isPlaying 
          ? Math.random() * 40 + 10 
          : 5;
        
        const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(1, colors[1] || colors[0]);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, colors]);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
};

export default Visualizer;
