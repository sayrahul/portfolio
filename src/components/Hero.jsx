import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Monitor, Paintbrush, Film, Sparkles } from 'lucide-react';
import Magnetic from './Magnetic';
import './SpotlightCard.css';
import './Hero.css';

// 1. Interactive canvas particles component
function InteractiveParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles = [];
    const particleCount = 45;
    const mouse = { x: null, y: null, radius: 130 };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseleave', handleMouseLeave);
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        color: i % 2 === 0 ? 'rgba(37, 99, 235, 0.22)' : 'rgba(147, 51, 234, 0.18)'
      });
    }

    const draw = () => {
      if (!canvas) return;
      ctx.clearRect(0, 0, width, height);

      // Update and draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Boundary checks
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse attraction/repulsion
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            p.x -= (dx / dist) * force * 1.8;
            p.y -= (dy / dist) * force * 1.8;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.14 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

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
    <canvas 
      ref={canvasRef} 
      className="interactive-particles-canvas"
    />
  );
}

// 2. Custom 3D Tilt Card wrapper with Spotlight Glow
function TiltCard({ children, className }) {
  const [tiltStyle, setTiltStyle] = useState({});
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    setCoords({ x, y });
    setIsHovered(true);

    const xOffset = e.clientX - box.left - box.width / 2;
    const yOffset = e.clientY - box.top - box.height / 2;
    
    // Normalize coordinates to a range of -8 to 8 degrees
    const rX = -(yOffset / (box.height / 2)) * 8;
    const rY = (xOffset / (box.width / 2)) * 8;
    
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg) scale3d(1.02, 1.02, 1.02)`,
      boxShadow: "0 20px 40px rgba(15, 23, 42, 0.12)",
      borderColor: "var(--accent-light)",
      '--mouse-x': `${x}px`,
      '--mouse-y': `${y}px`
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTiltStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.02)",
      borderColor: "rgba(226, 232, 240, 0.8)",
      '--mouse-x': '0px',
      '--mouse-y': '0px'
    });
  };

  return (
    <div 
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={tiltStyle}
    >
      <div className="spotlight-card-glow" style={{ opacity: isHovered ? 1 : 0 }} />
      <div className="spotlight-card-border" style={{ opacity: isHovered ? 1 : 0 }} />
      <div className="spotlight-card-content" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 'inherit' }}>
        {children}
      </div>
    </div>
  );
}

// 3. Stats animated counter component
function AnimatedCounter({ value, duration = 1.8 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const target = parseFloat(value);
    if (isNaN(target)) return;

    let start = 0;
    const end = target;
    const increment = end / (duration * 60);

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(counter);
      } else {
        setCount(Math.ceil(start));
      }
    }, 1000 / 60);

    return () => clearInterval(counter);
  }, [value, duration]);

  const suffix = value.includes('+') ? '+' : value.includes('%') ? '%' : '';

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export default function Hero() {
  const rotateWords = ["Stunning Visual Designs", "High-Fidelity Branding", "Cinematic Showreels", "Interactive Web Apps"];
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIdx((prev) => (prev + 1) % rotateWords.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  const handleExploreClick = (e) => {
    e.preventDefault();
    const workSection = document.getElementById('work');
    if (workSection) {
      workSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section">
      {/* Interactive canvas connecting dots */}
      <InteractiveParticles />

      <div className="hero-glow-1"></div>
      <div className="hero-glow-2"></div>
      
      <div className="container hero-container">
        <motion.div 
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="hero-badge">
            <Sparkles size={14} className="badge-sparkle-icon" />
            <span>Available for Freelance &amp; Contract</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="hero-title">
            Crafting High-Performance Websites &amp;{' '}
            <div className="word-rotator-container">
              <AnimatePresence mode="wait">
                <motion.span
                  key={rotateWords[wordIdx]}
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -24, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="gradient-text"
                >
                  {rotateWords[wordIdx]}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.h1>

          <motion.p variants={itemVariants} className="hero-description">
            Hi, I'm Rahul Jadhav. A multidisciplinary creator specializing in frontend web engineering, high-end graphic design, and cinematic video editing.
          </motion.p>

          <motion.div variants={itemVariants} className="hero-actions">
            <Magnetic>
              <a href="#work" onClick={handleExploreClick} className="btn btn-primary hero-btn-primary">
                Explore Selected Work <ArrowRight size={16} />
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#/contact" className="btn btn-secondary hero-btn-secondary">
                Let's Collaborate
              </a>
            </Magnetic>
          </motion.div>

          <motion.div variants={itemVariants} className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">
                <AnimatedCounter value="8+" />
              </span>
              <span className="stat-label">Years of Experience</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                <AnimatedCounter value="150+" />
              </span>
              <span className="stat-label">Projects Completed</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                <AnimatedCounter value="100%" />
              </span>
              <span className="stat-label">Client Satisfaction</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <div className="visual-mesh"></div>
          
          <div className="pillars-grid">
            <TiltCard className="pillar-card web-pillar">
              <div className="pillar-header">
                <div className="pillar-icon-box web-color">
                  <Monitor size={20} />
                </div>
                <h3>Web Design</h3>
              </div>
              <p>Responsive interfaces and modern layouts built with clean code.</p>
              <div className="pillar-tags">
                <span>React</span>
                <span>Tailwind</span>
                <span>Vanilla CSS</span>
              </div>
            </TiltCard>

            <TiltCard className="pillar-card graphic-pillar">
              <div className="pillar-header">
                <div className="pillar-icon-box graphic-color">
                  <Paintbrush size={20} />
                </div>
                <h3>Graphic Design</h3>
              </div>
              <p>Creative brand identities, logos, and high-fidelity graphics.</p>
              <div className="pillar-tags">
                <span>Photoshop</span>
                <span>Illustrator</span>
                <span>Lightroom</span>
              </div>
            </TiltCard>

            <TiltCard className="pillar-card video-pillar">
              <div className="pillar-header">
                <div className="pillar-icon-box video-color">
                  <Film size={20} />
                </div>
                <h3>Video Editing</h3>
              </div>
              <p>Cinematic editing, color grading, and dynamic motion sequences.</p>
              <div className="pillar-tags">
                <span>Premiere Pro</span>
                <span>After Effects</span>
                <span>DaVinci</span>
              </div>
            </TiltCard>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
