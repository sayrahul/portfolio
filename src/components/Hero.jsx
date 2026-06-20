import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Monitor, Paintbrush, Film, Sparkles } from 'lucide-react';
import './Hero.css';

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  const cardHover = {
    hover: {
      y: -8,
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(37, 99, 235, 0.15)",
      borderColor: "rgba(37, 99, 235, 0.4)",
      transition: { type: "spring", stiffness: 300, damping: 20 }
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
            <span>Available for Freelance & Contract</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="hero-title">
            Crafting High-Performance Websites &amp; <span className="gradient-text">Stunning Visual Designs</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="hero-description">
            Hi, I'm Rahul Jadhav. A multidisciplinary creator specializing in frontend web engineering, high-end graphic design, and cinematic video editing.
          </motion.p>

          <motion.div variants={itemVariants} className="hero-actions">
            <a href="#work" onClick={handleExploreClick} className="btn btn-primary hero-btn-primary">
              Explore Selected Work <ArrowRight size={16} />
            </a>
            <a href="#/contact" className="btn btn-secondary hero-btn-secondary">
              Let's Collaborate
            </a>
          </motion.div>

          <motion.div variants={itemVariants} className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">8+</span>
              <span className="stat-label">Years of Experience</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">150+</span>
              <span className="stat-label">Projects Completed</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Client Satisfaction</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <div className="visual-mesh"></div>
          
          <div className="pillars-grid">
            <motion.div 
              className="pillar-card web-pillar"
              variants={cardHover}
              whileHover="hover"
            >
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
            </motion.div>

            <motion.div 
              className="pillar-card graphic-pillar"
              variants={cardHover}
              whileHover="hover"
            >
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
            </motion.div>

            <motion.div 
              className="pillar-card video-pillar"
              variants={cardHover}
              whileHover="hover"
            >
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
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
