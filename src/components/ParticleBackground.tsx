import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  alpha: number;
  decay: number;
  angle: number;
  velocity: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const maxParticles = 80;

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    handleResize();

    const colors = [
      'rgba(212, 163, 23, ', // Gold
      'rgba(238, 197, 71, ', // Light Gold
      'rgba(116, 73, 17, ',  // Dark Gold
      'rgba(220, 38, 38, ',  // Deep Crimson
    ];

    const createParticle = (x?: number, y?: number): Particle => {
      const px = x ?? Math.random() * canvas.width;
      const py = y ?? Math.random() * canvas.height;
      const isCrimson = Math.random() > 0.85;
      const colorBase = isCrimson ? colors[3] : colors[Math.floor(Math.random() * 3)];
      
      return {
        x: px,
        y: py,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4 - 0.1, // Drifts slightly upwards
        color: colorBase,
        alpha: Math.random() * 0.5 + 0.2,
        decay: Math.random() * 0.002 + 0.001,
        angle: Math.random() * Math.PI * 2,
        velocity: Math.random() * 0.02
      };
    };

    // Seed initial particles
    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle());
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render custom subtle grid lines with linear gold fades
      ctx.strokeStyle = 'rgba(212, 163, 23, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      particles.forEach((p, idx) => {
        // Apply drifting speed
        p.x += p.speedX + Math.sin(p.angle) * p.velocity;
        p.y += p.speedY;
        p.angle += 0.01;

        // Mouse attraction/repulsion logic
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            // Draw very soft connector line
            ctx.beginPath();
            ctx.strokeStyle = `rgba(212, 163, 23, ${(1 - dist / 180) * 0.05})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
            ctx.stroke();

            // Pull slightly towards mouse
            p.x += (dx / dist) * 0.3;
            p.y += (dy / dist) * 0.3;
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();

        // Bounce/Wrap boundary
        if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
          particles[idx] = createParticle(
            Math.random() * canvas.width,
            canvas.height // Re-enter from bottom
          );
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto block z-0"
    />
  );
}
