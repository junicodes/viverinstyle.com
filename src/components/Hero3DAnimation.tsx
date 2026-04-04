import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export function Hero3DAnimation() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
      {/* Floating furniture pieces - Reduced sizes and updated colors */}
      <motion.div
        className="absolute top-10 left-10 w-16 h-16 bg-gradient-to-br from-brand-charcoal/10 via-brand-copper/10 to-brand-gold/10 rounded-3xl backdrop-blur-sm"
        animate={{
          y: [0, -15, 0],
          rotateY: [0, 180, 360],
          x: mousePosition.x * 0.5,
        }}
        transition={{
          y: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          },
          rotateY: {
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          },
        }}
        style={{
          transform: `perspective(1000px) rotateX(${mousePosition.y * 0.5}deg)`,
        }}
      />

      <motion.div
        className="absolute top-1/4 right-20 w-12 h-12 bg-gradient-to-br from-brand-gold/10 to-brand-copper/10 rounded-2xl backdrop-blur-sm"
        animate={{
          y: [0, 20, 0],
          rotateZ: [0, 90, 180, 270, 360],
          x: -mousePosition.x * 0.5,
        }}
        transition={{
          y: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          },
          rotateZ: {
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      />

      <motion.div
        className="absolute bottom-20 left-1/4 w-20 h-20 bg-gradient-to-br from-brand-copper/10 to-brand-charcoal/10 rounded-full backdrop-blur-sm"
        animate={{
          y: [0, -25, 0],
          scale: [1, 1.15, 1],
          x: mousePosition.x * 0.3,
        }}
        transition={{
          y: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          },
          scale: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />

      <motion.div
        className="absolute top-1/2 right-1/4 w-14 h-14 bg-gradient-to-br from-brand-gold/10 to-brand-charcoal/10 rounded-xl backdrop-blur-sm"
        animate={{
          y: [0, 18, 0],
          rotateX: [0, 180, 360],
          x: -mousePosition.x * 0.3,
        }}
        transition={{
          y: {
            duration: 5.5,
            repeat: Infinity,
            ease: "easeInOut",
          },
          rotateX: {
            duration: 7,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      />

      {/* Ambient particles - Reduced count and updated colors */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 bg-brand-gold/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -80, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
