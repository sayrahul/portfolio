import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function Magnetic({ children }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();
    
    // Relative coordinates from center of the element
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    
    // 0.35 factor provides a soft, satisfying magnetic draw
    setPosition({ x: x * 0.35, y: y * 0.35 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 180, damping: 12, mass: 0.1 }}
      style={{ display: 'inline-block' }}
      className="magnetic-wrapper"
    >
      {children}
    </motion.div>
  );
}
