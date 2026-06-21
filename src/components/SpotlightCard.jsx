import React, { useRef, useState } from 'react';
import './SpotlightCard.css';

export default function SpotlightCard({ children, className = '', ...props }) {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });
  };

  return (
    <div
      ref={cardRef}
      className={`spotlight-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        '--mouse-x': `${coords.x}px`,
        '--mouse-y': `${coords.y}px`,
      }}
      {...props}
    >
      <div className="spotlight-card-border" style={{ opacity: isHovered ? 1 : 0 }} />
      <div className="spotlight-card-glow" style={{ opacity: isHovered ? 1 : 0 }} />
      <div className="spotlight-card-content">
        {children}
      </div>
    </div>
  );
}
