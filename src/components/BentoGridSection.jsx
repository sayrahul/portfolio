import React, { useState, useEffect, useRef } from 'react';
import { Mail, Sparkles, Moon, Sun, ArrowRight } from 'lucide-react';
import { LinkedinIcon, GithubIcon } from './icons/BrandIcons';
import SpotlightCard from './SpotlightCard';
import Magnetic from './Magnetic';
import './BentoGridSection.css';

// 1. Tag Physics Canvas Component
function TechPhysicsPlayground() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const tags = [
      { text: "React", r: 35, color: "#2563eb", fill: "rgba(37, 99, 235, 0.08)" },
      { text: "Figma", r: 32, color: "#a855f7", fill: "rgba(168, 85, 247, 0.08)" },
      { text: "Photoshop", r: 42, color: "#3b82f6", fill: "rgba(59, 130, 246, 0.08)" },
      { text: "DaVinci", r: 36, color: "#f97316", fill: "rgba(249, 115, 22, 0.08)" },
      { text: "Premiere", r: 40, color: "#ec4899", fill: "rgba(236, 72, 153, 0.08)" },
      { text: "Illustrator", r: 42, color: "#eab308", fill: "rgba(234, 179, 8, 0.08)" },
      { text: "CSS", r: 28, color: "#06b6d4", fill: "rgba(6, 182, 212, 0.08)" },
      { text: "Vite", r: 28, color: "#8b5cf6", fill: "rgba(139, 92, 246, 0.08)" },
      { text: "Node", r: 30, color: "#22c55e", fill: "rgba(34, 197, 94, 0.08)" }
    ];

    const bubbles = tags.map((t) => ({
      ...t,
      x: Math.random() * (width - t.r * 2) + t.r,
      y: Math.random() * (height - t.r * 2) + t.r,
      vx: (Math.random() - 0.5) * 1.0,
      vy: (Math.random() - 0.5) * 1.0
    }));

    const mouse = { x: null, y: null, radius: 90 };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const parent = containerRef.current;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseleave', handleMouseLeave);
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const draw = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, width, height);

      const isDark = document.body.classList.contains('dark-theme');

      // Physics update and drawing
      bubbles.forEach((b) => {
        // Move
        b.x += b.vx;
        b.y += b.vy;

        // Dampen velocity back to cruising speed if kicked hard
        b.vx *= 0.98;
        b.vy *= 0.98;
        
        const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        if (speed < 0.6) {
          b.vx = (b.vx / speed || 0) * 0.6 + (Math.random() - 0.5) * 0.1;
          b.vy = (b.vy / speed || 0) * 0.6 + (Math.random() - 0.5) * 0.1;
        }

        // Bounding check (edges)
        if (b.x - b.r < 0) {
          b.x = b.r;
          b.vx = Math.abs(b.vx);
        } else if (b.x + b.r > width) {
          b.x = width - b.r;
          b.vx = -Math.abs(b.vx);
        }

        if (b.y - b.r < 0) {
          b.y = b.r;
          b.vy = Math.abs(b.vy);
        } else if (b.y + b.r > height) {
          b.y = height - b.r;
          b.vy = -Math.abs(b.vy);
        }

        // Mouse interaction (push away)
        if (mouse.x !== null && mouse.y !== null) {
          const dx = b.x - mouse.x;
          const dy = b.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius + b.r) {
            const force = (mouse.radius + b.r - dist) / (mouse.radius + b.r);
            const angle = Math.atan2(dy, dx);
            // push bubble in direction away from mouse
            b.vx += Math.cos(angle) * force * 1.6;
            b.vy += Math.sin(angle) * force * 1.6;
          }
        }

        // Elastic collisions between bubbles
        for (let i = 0; i < bubbles.length; i++) {
          const other = bubbles[i];
          if (other === b) continue;
          const dx = other.x - b.x;
          const dy = other.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = b.r + other.r;

          if (dist < minDist) {
            // resolve overlap
            const overlap = minDist - dist;
            const angle = Math.atan2(dy, dx);
            b.x -= Math.cos(angle) * overlap * 0.5;
            b.y -= Math.sin(angle) * overlap * 0.5;
            other.x += Math.cos(angle) * overlap * 0.5;
            other.y += Math.sin(angle) * overlap * 0.5;

            // bounce velocity
            const normalX = dx / dist;
            const normalY = dy / dist;
            
            const kx = b.vx - other.vx;
            const ky = b.vy - other.vy;
            const p = 2 * (normalX * kx + normalY * ky) / 2; // assume equal mass

            b.vx -= p * normalX;
            b.vy -= p * normalY;
            other.vx += p * normalX;
            other.vy += p * normalY;
          }
        }

        // Draw bubble
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? b.fill.replace('0.08', '0.14') : b.fill;
        ctx.strokeStyle = b.color;
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();

        // Draw text
        ctx.font = '600 11px var(--font-body), system-ui';
        ctx.fillStyle = isDark ? '#f1f5f9' : '#1e293b';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(b.text, b.x, b.y);
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="tech-physics-container">
      <canvas ref={canvasRef} className="tech-physics-canvas" />
    </div>
  );
}

// 2. Waveform Visualizer Canvas Component
function WaveformVisualizer() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const isHovered = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    let phase = 0;
    let targetExcitement = 0;
    let currentExcitement = 0;

    const handleMouseEnter = () => {
      isHovered.current = true;
      targetExcitement = 1.0;
    };
    
    const handleMouseLeave = () => {
      isHovered.current = false;
      targetExcitement = 0.0;
    };

    const parent = containerRef.current;
    if (parent) {
      parent.addEventListener('mouseenter', handleMouseEnter);
      parent.addEventListener('mouseleave', handleMouseLeave);
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const draw = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Lerp excitement for soft expansion/acceleration ripples
      currentExcitement += (targetExcitement - currentExcitement) * 0.08;

      const isDark = document.body.classList.contains('dark-theme');

      // 3 Layers of organic sine waves
      const waves = [
        { 
          amplitude: 12, 
          frequency: 0.015, 
          speed: 0.04, 
          color: isDark ? 'rgba(59, 130, 246, 0.45)' : 'rgba(37, 99, 235, 0.35)' 
        },
        { 
          amplitude: 20, 
          frequency: 0.009, 
          speed: 0.025, 
          color: isDark ? 'rgba(168, 85, 247, 0.35)' : 'rgba(147, 51, 234, 0.28)' 
        },
        { 
          amplitude: 8, 
          frequency: 0.022, 
          speed: 0.05, 
          color: isDark ? 'rgba(20, 184, 166, 0.45)' : 'rgba(13, 148, 136, 0.35)' 
        }
      ];

      waves.forEach((w) => {
        ctx.beginPath();
        const amp = w.amplitude * (1 + currentExcitement * 1.6);
        const freq = w.frequency * (1 + currentExcitement * 0.5);
        const spd = w.speed * (1 + currentExcitement * 1.5);

        for (let x = 0; x < width; x++) {
          const y = height / 2 + Math.sin(x * freq + phase * spd) * amp;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.strokeStyle = w.color;
        ctx.lineWidth = 1.8 + currentExcitement * 1.4;
        ctx.stroke();
      });

      phase += 0.5;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (parent) {
        parent.removeEventListener('mouseenter', handleMouseEnter);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="waveform-visualizer-container">
      <canvas ref={canvasRef} className="waveform-visualizer-canvas" />
    </div>
  );
}

export default function BentoGridSection() {
  const [timeString, setTimeString] = useState('');
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      // Fetch Kolkata (IST) timezone specifically for Rahul
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      
      try {
        const timeFmt = new Intl.DateTimeFormat('en-US', options);
        const parts = timeFmt.formatToParts(new Date());
        
        // Construct string
        const hPart = parts.find(p => p.type === 'hour').value;
        const mPart = parts.find(p => p.type === 'minute').value;
        const sPart = parts.find(p => p.type === 'second').value;
        const ampmPart = parts.find(p => p.type === 'dayPeriod').value;
        
        setTimeString(`${hPart}:${mPart}:${sPart} ${ampmPart}`);

        // Rotate Dial
        // 12-hour basis: sun and moon are opposites on a 360 deg dial.
        // H: 0-23
        const kolkataTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
        const h = kolkataTime.getHours();
        const m = kolkataTime.getMinutes();
        const s = kolkataTime.getSeconds();
        const totalHours = h + m / 60 + s / 3600;
        
        // 360deg / 24 hours = 15deg per hour
        // Offset by 180 so Sun is top at 12:00 PM and Moon is top at 12:00 AM
        setRotation((totalHours * 15) - 180);
      } catch (err) {
        // Fallback
        setTimeString(new Date().toLocaleTimeString());
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="sandbox" className="bento-section">
      <div className="container">
        <div className="bento-header">
          <div className="hero-badge bento-badge">
            <Sparkles size={14} className="badge-sparkle-icon" />
            <span>Rahul's Sandbox</span>
          </div>
          <h2 className="section-title bento-title">Ecosystem &amp; Flow</h2>
          <p className="section-subtitle bento-subtitle">
            Exploring the overlap of real-time design widgets, physics-driven canvases, and responsive layouts.
          </p>
        </div>

        <div className="bento-grid">
          {/* Card 1: Time, Celestial Orbit & Status */}
          <SpotlightCard className="bento-card clock-card">
            <div className="card-top-accent color-web"></div>
            <div className="bento-card-inner">
              <span className="bento-label">Current Pulse</span>
              
              <div className="celestial-clock-wrapper">
                <div className="celestial-orbit" style={{ transform: `rotate(${rotation}deg)` }}>
                  <div className="celestial-body sun-body" title="Sun (Day Dial)">
                    <Sun size={18} />
                  </div>
                  <div className="celestial-body moon-body" title="Moon (Night Dial)">
                    <Moon size={16} />
                  </div>
                </div>
                <div className="digital-time">{timeString}</div>
                <div className="timezone-tag">India Standard Time (IST)</div>
              </div>

              <div className="availability-indicator">
                <span className="pulse-dot"></span>
                <p>Accepting new project planners &amp; contract designs</p>
              </div>
            </div>
          </SpotlightCard>

          {/* Card 2: Interactive Tag Physics */}
          <SpotlightCard className="bento-card physics-card">
            <div className="card-top-accent color-graphic"></div>
            <div className="bento-card-inner">
              <div className="bento-label-row">
                <span className="bento-label">Tech Playground</span>
                <span className="interaction-badge">SWIPE CURSOR</span>
              </div>
              
              <TechPhysicsPlayground />

              <div className="physics-footer">
                <h3>Visual Tech Grid</h3>
                <p>Interactive tool stack particles running in a real-time vector collision sandbox.</p>
              </div>
            </div>
          </SpotlightCard>

          {/* Card 3: Creative Philosophy & Audio-style Waveform */}
          <SpotlightCard className="bento-card philosophy-card">
            <div className="card-top-accent color-video"></div>
            <div className="bento-card-inner">
              <div className="bento-label-row">
                <span className="bento-label">Creative Amplitude</span>
                <span className="interaction-badge">HOVER CARD</span>
              </div>
              
              <WaveformVisualizer />

              <div className="philosophy-quote">
                <blockquote>
                  "Design is not just what it looks like and feels like. Design is how it works."
                </blockquote>
                <cite>&mdash; Interactive Philosophy</cite>
              </div>
            </div>
          </SpotlightCard>

          {/* Card 4: Quick Links & Magnetic Connect */}
          <SpotlightCard className="bento-card connect-card">
            <div className="card-top-accent color-all"></div>
            <div className="bento-card-inner">
              <span className="bento-label">Digital Connections</span>
              
              <div className="connect-intro">
                <h3>Let's build something unique.</h3>
                <p>Reach out to discuss branding designs, video edits, or full-stack web applications.</p>
              </div>

              <div className="connect-links-grid">
                <Magnetic>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="connect-circle-link linkedin-link" title="LinkedIn">
                    <LinkedinIcon size={20} />
                  </a>
                </Magnetic>

                <Magnetic>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="connect-circle-link github-link" title="GitHub">
                    <GithubIcon size={20} />
                  </a>
                </Magnetic>

                <Magnetic>
                  <a href="#/contact" className="connect-circle-link email-link" title="Contact Form">
                    <Mail size={20} />
                  </a>
                </Magnetic>
              </div>

              <div className="connect-footer">
                <a href="#/contact" className="connect-cta-btn btn">
                  Open Project Planner <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}
