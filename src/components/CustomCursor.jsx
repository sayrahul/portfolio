import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import './CustomCursor.css';

export default function CustomCursor() {
  const [cursorVariant, setCursorVariant] = useState('default');
  const [cursorText, setCursorText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  // Mouse coordinates (centered)
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Small dot coordinates (follows instantly)
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  // Spring animations for the outer ring (fluid lag)
  const springConfig = { damping: 30, stiffness: 300, mass: 0.6 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Detect mobile/tablet touch devices
    const detectTouch = () => {
      const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isTouch = coarsePointer || hasTouch;
      setIsTouchDevice(isTouch);
      if (!isTouch) {
        setIsVisible(true);
        // Add a class to body for custom cursor styles (like hiding default pointer)
        document.body.classList.add('custom-cursor-active');
      }
    };

    detectTouch();

    const handleMouseMove = (e) => {
      if (isTouchDevice) return;
      
      // Center coordinates based on cursor sizes
      // Ring is 36x36 (offset by 18)
      mouseX.set(e.clientX - 18);
      mouseY.set(e.clientY - 18);

      // Dot is 8x8 (offset by 4)
      dotX.set(e.clientX - 4);
      dotY.set(e.clientY - 4);
      
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => {
      if (!isTouchDevice) setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.body.classList.remove('custom-cursor-active');
    };
  }, [isTouchDevice, isVisible]);

  // Handle global hover states
  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseOver = (e) => {
      const target = e.target.closest('[data-cursor], a, button, .clickable, .filter-btn, .sub-filter-pill');
      if (!target) {
        setCursorVariant('default');
        setCursorText('');
        return;
      }

      const cursorType = target.getAttribute('data-cursor');
      if (cursorType) {
        setCursorVariant(cursorType);
        if (cursorType === 'view') {
          setCursorText('VIEW');
        } else if (cursorType === 'play') {
          setCursorText('PLAY');
        } else if (cursorType === 'explore') {
          setCursorText('EXPLORE');
        } else {
          setCursorText(cursorType.toUpperCase());
        }
      } else {
        setCursorVariant('hovered');
        setCursorText('');
      }
    };

    window.addEventListener('mouseover', handleMouseOver);
    return () => window.removeEventListener('mouseover', handleMouseOver);
  }, [isTouchDevice]);

  if (isTouchDevice || !isVisible) return null;

  // Variants for ring size/styles
  const ringVariants = {
    default: {
      width: 36,
      height: 36,
      backgroundColor: 'transparent',
      borderColor: 'var(--accent)',
      borderRadius: '50%',
    },
    hovered: {
      width: 56,
      height: 56,
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      borderColor: 'var(--accent)',
      borderRadius: '50%',
    },
    view: {
      width: 80,
      height: 80,
      backgroundColor: 'var(--accent)',
      borderColor: 'var(--accent)',
      borderRadius: '50%',
    },
    play: {
      width: 80,
      height: 80,
      backgroundColor: 'var(--accent)',
      borderColor: 'var(--accent)',
      borderRadius: '50%',
    },
    explore: {
      width: 80,
      height: 80,
      backgroundColor: 'var(--primary)',
      borderColor: 'var(--primary)',
      borderRadius: '50%',
    }
  };

  return (
    <>
      {/* Outer Follower Ring */}
      <motion.div
        className={`custom-cursor-ring ${cursorVariant !== 'default' ? 'morphing' : ''}`}
        style={{
          x: ringX,
          y: ringY,
        }}
        animate={cursorVariant}
        variants={ringVariants}
        transition={{ type: 'spring', stiffness: 250, damping: 25, mass: 0.2 }}
      >
        {cursorText && (
          <span className="cursor-text-label">{cursorText}</span>
        )}
      </motion.div>

      {/* Inner Dot */}
      <motion.div
        className="custom-cursor-dot"
        style={{
          x: dotX,
          y: dotY,
        }}
      />
    </>
  );
}
