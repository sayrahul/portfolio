import React, { useState, useRef } from 'react';
import { getOptimizedImageUrl } from '../utils/mediaOptimizer';
import './BeforeAfterSlider.css';

export default function BeforeAfterSlider({ 
  beforeImage, 
  afterImage, 
  beforeLabel = "Original", 
  afterLabel = "Retouched",
  aspectRatio = "16/9"
}) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef(null);

  const handleSliderChange = (e) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <div 
      className="slider-wrapper" 
      ref={containerRef} 
      style={{ aspectRatio: aspectRatio }}
    >
      {/* Before Image (Background) */}
      <img 
        src={getOptimizedImageUrl(beforeImage, 1000)} 
        alt={beforeLabel} 
        className="slider-image before-image" 
      />
      <div className="slider-label label-before">{beforeLabel}</div>

      {/* After Image (Overlay with Clip-Path) */}
      <img 
        src={getOptimizedImageUrl(afterImage, 1000)} 
        alt={afterLabel} 
        className="slider-image after-image" 
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      />
      <div 
        className="slider-label label-after"
        style={{ opacity: sliderPosition < 10 ? 0 : 1 }}
      >
        {afterLabel}
      </div>

      {/* Handle Line & Thumb */}
      <div 
        className="slider-handle" 
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="slider-handle-line"></div>
        <div className="slider-handle-button">
          <span className="slider-arrow arrow-left">‹</span>
          <span className="slider-arrow arrow-right">›</span>
        </div>
      </div>

      {/* Native Range Input (Transparent Overlay for Control) */}
      <input 
        type="range" 
        min="0" 
        max="100" 
        value={sliderPosition} 
        onChange={handleSliderChange} 
        className="slider-range-input"
        aria-label="Before after image comparison slider"
      />
    </div>
  );
}
