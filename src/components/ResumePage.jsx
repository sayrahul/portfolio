import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Phone, Globe, ArrowLeft, Printer, Check, Copy, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import './ResumePage.css';

// Custom Brand SVGs
const BehanceIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M8.228 12.01c0-1.077-.406-1.574-1.285-1.574H4.598v3.13h2.327c.895 0 1.303-.497 1.303-1.556m-.303-4.22c0-.91-.351-1.325-1.09-1.325H4.598v2.664h2.219c.756 0 1.108-.415 1.108-1.339M12 11.597c0-3.957-2.61-4.707-5.176-4.707H1.5v13.682h5.45c3.087 0 5.05-1.42 5.05-4.887 0-1.89-.963-3.132-2.127-3.693 1.54-.42 2.127-1.748 2.127-3.693v-3.702zm9.124 1.767c-.053-1.636-1.228-2.584-2.883-2.584-1.75 0-3.003 1.258-3.003 3.328 0 2.036 1.225 3.32 3.09 3.32 1.492 0 2.585-.813 2.793-2.158H18.72c-.105.626-.642.996-1.36.996-.795 0-1.272-.51-1.353-1.316h4.993v-.586zm-2.853-1.688c.706 0 1.135.405 1.206 1.092H16.5c.08-.687.509-1.092 1.206-1.092zm.543-3.676h-3.414v1.104H18.81V8z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.8v8.37h2.8v-4.67c0-.25.02-.5.1-.68a1.14 1.14 0 0 1 1-.77c.76 0 .97.58.97 1.42v4.7zM6.5 8.37a1.37 1.37 0 1 0 0-2.75 1.37 1.37 0 0 0 0 2.75zM8 18.5V10.13H5v8.37z"/>
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511a3.002 3.002 0 0 0-2.11 2.107C0 8.053 0 12 0 12s0 3.947.502 5.837a3.003 3.003 0 0 0 2.11 2.107c1.883.511 9.388.511 9.388.511s7.505 0 9.388-.511a3.002 3.002 0 0 0 2.11-2.107C24 15.947 24 12 24 12s0-3.947-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const RESUME_SKILLS = [
  { name: "UI/UX Design", level: 85, rating: "Expert", usedAt: ["OceanSphere", "MGT-Commerce", "Virtual Tech Gurus", "Aspitek"] },
  { name: "Prototyping", level: 80, rating: "Advanced", usedAt: ["OceanSphere", "MGT-Commerce", "Virtual Tech Gurus"] },
  { name: "Graphic & Visual Design", level: 90, rating: "Expert", usedAt: ["OceanSphere", "MGT-Commerce", "Virtual Tech Gurus", "Info Edge", "SVA"] },
  { name: "Motion Graphics & After Effects", level: 75, rating: "Advanced", usedAt: ["Info Edge", "SVA"] },
  { name: "Web Design", level: 88, rating: "Expert", usedAt: ["MGT-Commerce", "IPD Business", "Aspitek"] },
  { name: "Social Media Marketing", level: 70, rating: "Intermediate", usedAt: ["IPD Business"] },
  { name: "Adobe Creative Suite", level: 92, rating: "Expert", usedAt: ["OceanSphere", "Info Edge", "SVA", "IPD Business"] },
  { name: "Front-End Design", level: 82, rating: "Advanced", usedAt: ["MGT-Commerce", "Aspitek"] }
];

const RESUME_EXPERIENCE = [
  {
    id: "OceanSphere",
    role: "Graphic Designer",
    company: "OceanSphere Datacore Software Systems Pvt. Ltd.",
    period: "SEPT 2025 - PRESENT",
    location: "AURANGABAD, MH",
    desc: "Designed brand and marketing visuals to support product promotion and digital presence.",
    bullets: [
      "Crafted high-fidelity brand visual assets for corporate product releases.",
      "Collaborated with product teams to design web graphics and presentation decks.",
      "Maintained cohesive branding consistency across all public marketing and digital profiles."
    ]
  },
  {
    id: "MGT-Commerce",
    role: "Freelancer",
    company: "MGT-Commerce GmbH",
    period: "OCT 2024 - AUG 2025",
    location: "REMOTE",
    desc: "Designed brand-aligned web visuals and modernized design templates for an international e-commerce audience.",
    bullets: [
      "Redesigned key marketing layout grids and web graphics for international clients.",
      "Created highly responsive e-commerce web templates in collaboration with developers.",
      "Established typography rules and wireframes for brand identity overhauls."
    ]
  },
  {
    id: "Virtual Tech Gurus",
    role: "Freelance Consultant",
    company: "Virtual Tech Gurus Pvt. Ltd.",
    period: "SEPT 2023 - SEPT 2024",
    location: "REMOTE",
    desc: "Created high-impact digital assets and managed multiple design projects under tight deadlines.",
    bullets: [
      "Delivered brand visuals, brochures, and sales graphics within strict customer schedules.",
      "Organized wireframing and interactive design audits for client digital portfolios.",
      "Juggled multiple client assignments in parallel, ensuring consistent high-quality outputs."
    ]
  },
  {
    id: "Info Edge",
    role: "Graphic Designer",
    company: "Info Edge (India) Ltd.",
    period: "JUN 2022 - AUG 2023",
    location: "REMOTE",
    desc: "Produced dynamic motion graphics and illustrations while maintaining strict brand consistency across product lines.",
    bullets: [
      "Created motion graphics layouts and video assets for social campaigns.",
      "Illustrated marketing iconography libraries to establish consistent layout systems.",
      "Collaborated with design managers to update core product brand elements."
    ]
  },
  {
    id: "SVA",
    role: "Sr. Graphic Designer",
    company: "SVA - Advertising and Entertainments",
    period: "DEC 2020 - APR 2022",
    location: "AURANGABAD, MH",
    desc: "Developed and refined compelling visual advertising campaigns from initial concept to final delivery.",
    bullets: [
      "Directed the creation of full-scale marketing visuals and billboard media layouts.",
      "Mentored junior graphic designers in vector illustration and retouching methods.",
      "Consulted with clients directly to align initial campaign briefs with physical assets."
    ]
  },
  {
    id: "IPD Business",
    role: "Web Designer",
    company: "IPD Business Group",
    period: "JUL 2018 - NOV 2020",
    location: "AURANGABAD, MH",
    desc: "Designed website graphics and managed SEO/SEM-optimized digital marketing campaigns to improve search visibility.",
    bullets: [
      "Coordinated full visual mockups and asset delivery for corporate website redesigns.",
      "Designed landing pages optimizing customer journeys for search queries (SEO/SEM).",
      "Drafted digital marketing banners and newsletters for lead generation."
    ]
  },
  {
    id: "Aspitek",
    role: "Web Designer",
    company: "Aspitek Solutions Pvt. Ltd.",
    period: "AUG 2016 - JUN 2018",
    location: "PUNE, MH",
    desc: "Designed and tested responsive web pages, collaborating seamlessly with developers for cross-device implementation.",
    bullets: [
      "Coded clean, structured front-end layouts using responsive design frameworks.",
      "Performed cross-browser layout audits to align designs with functional web environments.",
      "Mapped visual designs from Figma into production code blocks."
    ]
  }
];

const RESUME_EDUCATION = [
  {
    period: "2015",
    score: "69.70%",
    degree: "Graduate in Electronics & Telecommunication Engineering",
    institution: "MGM's Jawaharlal Nehru Engineering College, Aurangabad."
  },
  {
    period: "2012",
    score: "66.00%",
    degree: "Diploma in Electronics & Telecommunication Engineering",
    institution: "Government Polytechnic, Aurangabad."
  },
  {
    period: "2008",
    score: "83.69%",
    degree: "Secondary School Certificate (S.S.C)",
    institution: "Maharashtra State Board, Aurangabad."
  }
];

const FOCUS_SKILLS_MAP = {
  web: ["UI/UX Design", "Prototyping", "Web Design", "Front-End Design"],
  graphic: ["UI/UX Design", "Prototyping", "Graphic & Visual Design", "Adobe Creative Suite"],
  video: ["Motion Graphics & After Effects", "Adobe Creative Suite", "Graphic & Visual Design"]
};

const FOCUS_EXPERIENCE_MAP = {
  web: ["MGT-Commerce", "IPD Business", "Aspitek"],
  graphic: ["OceanSphere", "Virtual Tech Gurus", "SVA", "Info Edge"],
  video: ["Info Edge", "SVA"]
};

const FOCUS_DETAILS = {
  all: {
    subtitle: "Web & Graphic Designer",
    bio: "With over eight years of experience across freelance, agency, and corporate roles, I bring a well-rounded approach to UI/UX and digital design. I love combining intuitive web aesthetics with compelling graphic design to tell a brand's story."
  },
  web: {
    subtitle: "Frontend Web Designer & Engineer",
    bio: "A detail-oriented frontend designer focusing on crafting clean, responsive, and high-performance React web interfaces. Experienced in translating wireframes into semantic code, designing modular layout systems, and building custom components."
  },
  graphic: {
    subtitle: "Senior Graphic & Brand Visual Designer",
    bio: "A creative visual designer specializing in brand identity systems, high-fidelity graphics, vector assets, and marketing layouts. Over 8 years of experience designing billboard layouts, corporate pitch decks, and digital collateral."
  },
  video: {
    subtitle: "Cinematic Video Editor & Motion Designer",
    bio: "A creative motion designer and editor delivering high-engagement video assets. Expert in color grading, sound design, and building custom After Effects motion graphics for social campaigns, commercials, and brand promotion."
  }
};

export default function ResumePage() {
  const [viewMode, setViewMode] = useState('creative'); // 'creative' or 'print'
  const [resumeFocus, setResumeFocus] = useState('all'); // 'all', 'web', 'graphic', 'video'
  const [copiedField, setCopiedField] = useState(null);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [expandedExperience, setExpandedExperience] = useState({});
  const [skillsAnimated, setSkillsAnimated] = useState(false);

  // Trigger skills loading animation on creative mode mount
  useEffect(() => {
    if (viewMode === 'creative') {
      const timer = setTimeout(() => setSkillsAnimated(true), 100);
      return () => clearTimeout(timer);
    } else {
      setSkillsAnimated(false);
    }
  }, [viewMode]);

  // Handle focus auto-expansion
  useEffect(() => {
    if (resumeFocus === 'all') {
      setExpandedExperience({});
    } else {
      const expIds = FOCUS_EXPERIENCE_MAP[resumeFocus] || [];
      const expanded = {};
      expIds.forEach(id => {
        expanded[id] = true;
      });
      setExpandedExperience(expanded);
    }
  }, [resumeFocus]);

  const handlePrint = () => {
    setViewMode('print');
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const toggleExpandExperience = (id) => {
    setExpandedExperience(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className={`resume-page-wrapper mode-${viewMode}`}>
      {/* Interactive Control Header */}
      <div className="resume-action-bar no-print">
        <a href="#work" className="btn btn-secondary action-btn-back">
          <ArrowLeft size={16} /> Back to Portfolio
        </a>

        {/* View Mode Toggle Slider */}
        <div className="view-mode-toggle-container">
          <button 
            className={`toggle-mode-btn ${viewMode === 'creative' ? 'active' : ''}`}
            onClick={() => setViewMode('creative')}
          >
            <Sparkles size={14} style={{ marginRight: '6px' }} /> Interactive Web
          </button>
          <button 
            className={`toggle-mode-btn ${viewMode === 'print' ? 'active' : ''}`}
            onClick={() => setViewMode('print')}
          >
            PDF Print Sheet
          </button>
        </div>

        <button onClick={handlePrint} className="btn btn-primary action-btn-print">
          <Printer size={16} /> Print / Save PDF
        </button>
      </div>

      {viewMode === 'creative' ? (
        /* ==================== INTERACTIVE CREATIVE VIEW ==================== */
        <div className="creative-resume-dashboard container fade-in">
          
          {/* 1. Unified Full-Width Interactive Profile Header Banner */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="dashboard-banner-header card"
          >
            <div className="banner-header-left">
              <div className="banner-profile-info">
                <div className="avatar-initials-large">RJ</div>
                <div className="banner-name-section">
                  <h1 className="banner-fullname-text">Rahul Jadhav</h1>
                  <h2 className="banner-subtitle-tag">{FOCUS_DETAILS[resumeFocus].subtitle}</h2>
                  <div className="banner-social-row">
                    <a href="https://behance.net/sayrahul" target="_blank" rel="noopener noreferrer" className="social-icon-link" title="Behance"><BehanceIcon /></a>
                    <a href="https://linkedin.com/in/rahuljadhav44" target="_blank" rel="noopener noreferrer" className="social-icon-link" title="LinkedIn"><LinkedinIcon /></a>
                    <a href="https://github.com/sayrahul" target="_blank" rel="noopener noreferrer" className="social-icon-link" title="GitHub"><GithubIcon /></a>
                    <a href="https://youtube.com/@Say_Rahul" target="_blank" rel="noopener noreferrer" className="social-icon-link" title="YouTube"><YoutubeIcon /></a>
                  </div>
                </div>
              </div>

              {/* Dynamic Contact Bar */}
              <div className="banner-contacts-container">
                <div className="banner-contact-pill" onClick={() => handleCopy("+919595997711", "phone")} title="Click to copy phone">
                  <Phone size={13} />
                  <span>+91 9595997711</span>
                  <div className="pill-copy-indicator">
                    {copiedField === 'phone' ? <Check size={11} className="check-icon" /> : <Copy size={10} />}
                  </div>
                </div>
                <div className="banner-contact-pill" onClick={() => handleCopy("rahuljadhav44@gmail.com", "email")} title="Click to copy email">
                  <Mail size={13} />
                  <span>rahuljadhav44@gmail.com</span>
                  <div className="pill-copy-indicator">
                    {copiedField === 'email' ? <Check size={11} className="check-icon" /> : <Copy size={10} />}
                  </div>
                </div>
                <div className="banner-contact-pill" onClick={() => handleCopy("https://sayrahul.github.io/sayrahul/", "website")} title="Click to copy website">
                  <Globe size={13} />
                  <span>sayrahul.github.io/sayrahul/</span>
                  <div className="pill-copy-indicator">
                    {copiedField === 'website' ? <Check size={11} className="check-icon" /> : <Copy size={10} />}
                  </div>
                </div>
                <div className="banner-contact-pill no-copy">
                  <MapPin size={13} />
                  <span>Sambhajinagar, MH</span>
                </div>
              </div>
            </div>

            <div className="banner-header-right">
              {/* Dynamic Bio */}
              <div className="banner-bio-section">
                <p className="banner-bio-text">
                  {FOCUS_DETAILS[resumeFocus].bio}
                </p>
              </div>
            </div>
          </motion.div>

          {/* 2. Main Two-Column Grid Content */}
          <div className="dashboard-grid">
            
            {/* Left Column: Interactive Skills Grid */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="dashboard-main-card card"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 className="dashboard-section-header" style={{ marginBottom: 0 }}>Interactive Skills Grid</h3>
                {resumeFocus === 'all' && (
                  <span className="badge" style={{ textTransform: 'none' }}>Hover skill to find jobs</span>
                )}
              </div>
              <p className="skills-intro-paragraph" style={{ marginBottom: '24px' }}>
                {resumeFocus === 'all' 
                  ? "Hovering over any skill highlights the specific companies on your timeline where you applied this competency."
                  : `Currently highlighting technical competencies related to ${FOCUS_DETAILS[resumeFocus].subtitle}.`}
              </p>
              
              <div className="dashboard-skills-grid">
                {RESUME_SKILLS.map((skill, idx) => {
                  const isHighlightedByFocus = resumeFocus !== 'all' && FOCUS_SKILLS_MAP[resumeFocus]?.includes(skill.name);
                  const isDimmedByFocus = resumeFocus !== 'all' && !isHighlightedByFocus;
                  const isHovered = hoveredSkill === skill.name;

                  return (
                    <div 
                      key={idx} 
                      className={`dashboard-skill-card ${isHovered || isHighlightedByFocus ? 'focused' : ''} ${isDimmedByFocus ? 'dimmed-skill' : ''}`}
                      onMouseEnter={() => resumeFocus === 'all' && setHoveredSkill(skill.name)}
                      onMouseLeave={() => resumeFocus === 'all' && setHoveredSkill(null)}
                    >
                      <div className="skill-card-meta">
                        <span className="skill-card-name">{skill.name}</span>
                        <span className="skill-card-rating">{skill.rating} ({skill.level}%)</span>
                      </div>
                      <div className="skill-card-meter">
                        <div 
                          className="skill-card-meter-fill"
                          style={{ width: skillsAnimated ? `${skill.level}%` : '0%' }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Right Column: Timeline Experience & Education */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="dashboard-content-area"
            >
              {/* Experience Timeline */}
              <div className="dashboard-main-card card">
                <h3 className="dashboard-section-header">Professional Experience</h3>
                <p className="skills-intro-paragraph" style={{ marginBottom: '24px' }}>
                  Click on any experience card to expand its bullet achievements and detailed outputs.
                </p>
                <div className="experience-dashboard-timeline">
                  {RESUME_EXPERIENCE.map((exp, idx) => {
                    // Hover highlight in All-Rounder mode
                    const isHoverHighlighted = hoveredSkill && RESUME_SKILLS.find(s => s.name === hoveredSkill)?.usedAt.includes(exp.id);
                    // Focus highlight in themed modes
                    const isFocusHighlighted = resumeFocus !== 'all' && FOCUS_EXPERIENCE_MAP[resumeFocus]?.includes(exp.id);
                    
                    const isHighlighted = isHoverHighlighted || isFocusHighlighted;
                    
                    const isDimmed = (hoveredSkill && !isHoverHighlighted) || (resumeFocus !== 'all' && !isFocusHighlighted);
                    const isExpanded = !!expandedExperience[exp.id];

                    return (
                      <div 
                        key={exp.id}
                        className={`exp-dash-card card ${isHighlighted ? 'highlighted-job' : ''} ${isDimmed ? 'dimmed-job' : ''} ${isExpanded ? 'expanded-job' : ''}`}
                        onClick={() => toggleExpandExperience(exp.id)}
                      >
                        <div className="exp-dash-header">
                          <div className="exp-header-main">
                            <h4 className="exp-dash-role">{exp.role}</h4>
                            <span className="exp-dash-company">{exp.company}</span>
                          </div>
                          <div className="exp-header-meta">
                            <span className="exp-dash-period">{exp.period}</span>
                            <span className="exp-dash-arrow">
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </span>
                          </div>
                        </div>

                        {/* Collapsible content */}
                        <div className={`exp-dash-collapsible ${isExpanded ? 'open' : ''}`}>
                          <div className="exp-dash-body">
                            <p className="exp-desc-main">{exp.desc}</p>
                            <ul className="exp-bullets-list">
                              {exp.bullets.map((bullet, bIdx) => (
                                <li key={bIdx}>{bullet}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Education Grid Card */}
              <div className="dashboard-main-card card">
                <h3 className="dashboard-section-header">Education History</h3>
                <div className="education-dashboard-grid">
                  {RESUME_EDUCATION.map((edu, idx) => (
                    <div key={idx} className="edu-dashboard-card card">
                      <div className="edu-dash-header-row">
                        <span className="edu-dash-year">{edu.period}</span>
                        <span className="badge edu-dash-score">{edu.score}</span>
                      </div>
                      <h4 className="edu-dash-degree">{edu.degree}</h4>
                      <p className="edu-dash-inst">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      ) : (
        /* ==================== A4 CLEAN PRINT SHEET VIEW ==================== */
        <div className="resume-container-sheet fade-in">
          {/* Top Header Row */}
          <div className="resume-header-row">
            {/* Top-Left Banner */}
            <div className="header-banner-left">
              <h1 className="resume-fullname">RAHUL JADHAV</h1>
              <h2 className="resume-subtitle-text">{FOCUS_DETAILS[resumeFocus].subtitle.toUpperCase()}</h2>
            </div>
            {/* Top-Right Profile Bio */}
            <div className="header-profile-right">
              <h3 className="resume-section-title dark-title">ABOUT ME</h3>
              <p className="resume-about-text">
                {FOCUS_DETAILS[resumeFocus].bio}
              </p>
            </div>
          </div>

          {/* Content Body Grid */}
          <div className="resume-body-grid">
            
            {/* Sidebar Column (Dark background) */}
            <div className="resume-sidebar-col">
              
              {/* Contact Details */}
              <div className="sidebar-section">
                <h3 className="sidebar-title">CONTACT</h3>
                <div className="sidebar-list">
                  <div className="sidebar-list-item">
                    <span className="sidebar-item-label">Mobile</span>
                    <a href="tel:+919595997711" className="sidebar-item-link">+91 9595997711</a>
                  </div>
                  <div className="sidebar-list-item">
                    <span className="sidebar-item-label">Email</span>
                    <a href="mailto:rahuljadhav44@gmail.com" className="sidebar-item-link">rahuljadhav44@gmail.com</a>
                  </div>
                  <div className="sidebar-list-item">
                    <span className="sidebar-item-label">Website</span>
                    <a href="https://sayrahul.github.io/sayrahul/" target="_blank" rel="noopener noreferrer" className="sidebar-item-link">sayrahul.github.io/sayrahul/</a>
                  </div>
                  <div className="sidebar-list-item">
                    <span className="sidebar-item-label">Address</span>
                    <span className="sidebar-item-text">Chh. Sambhajinagar (Aurangabad) 430001.</span>
                  </div>
                </div>
              </div>

              {/* Profiles */}
              <div className="sidebar-section">
                <h3 className="sidebar-title">PROFILES</h3>
                <div className="profiles-grid">
                  <a href="https://behance.net/sayrahul" target="_blank" rel="noopener noreferrer" className="profile-badge-link">
                    <div className="profile-icon-box behance-color">
                      <BehanceIcon />
                    </div>
                    <div className="profile-text-box">
                      <span className="profile-name">Behance</span>
                      <span className="profile-handle">behance.net/sayrahul</span>
                    </div>
                  </a>

                  <a href="https://linkedin.com/in/rahuljadhav44" target="_blank" rel="noopener noreferrer" className="profile-badge-link">
                    <div className="profile-icon-box linkedin-color">
                      <LinkedinIcon />
                    </div>
                    <div className="profile-text-box">
                      <span className="profile-name">LinkedIn</span>
                      <span className="profile-handle">linkedin.com/in/rahuljadhav44</span>
                    </div>
                  </a>

                  <a href="https://github.com/sayrahul" target="_blank" rel="noopener noreferrer" className="profile-badge-link">
                    <div className="profile-icon-box github-color">
                      <GithubIcon />
                    </div>
                    <div className="profile-text-box">
                      <span className="profile-name">GitHub</span>
                      <span className="profile-handle">github.com/sayrahul</span>
                    </div>
                  </a>

                  <a href="https://youtube.com/@Say_Rahul" target="_blank" rel="noopener noreferrer" className="profile-badge-link">
                    <div className="profile-icon-box youtube-color">
                      <YoutubeIcon />
                    </div>
                    <div className="profile-text-box">
                      <span className="profile-name">YouTube</span>
                      <span className="profile-handle">youtube.com/@Say_Rahul</span>
                    </div>
                  </a>
                </div>
              </div>

              {/* Education */}
              <div className="sidebar-section">
                <h3 className="sidebar-title">EDUCATION</h3>
                <div className="education-timeline-vertical">
                  {RESUME_EDUCATION.map((edu, idx) => (
                    <div key={idx} className="education-timeline-node">
                      <div className="edu-year-box">
                        <span className="edu-year">{edu.period}</span>
                        <span className="edu-score-badge">{edu.score}</span>
                      </div>
                      <div className="edu-content-box">
                        <h4 className="edu-degree-text">{edu.degree}</h4>
                        <p className="edu-institution-text">{edu.institution}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Main Body Column (White background) */}
            <div className="resume-main-col">
              
              {/* Professional Skills */}
              <div className="main-resume-section">
                <h3 className="resume-section-title">PROFESSIONAL SKILLS</h3>
                <p className="skills-intro-paragraph">
                  {resumeFocus === 'all'
                    ? "Turning creative ideas into polished realities requires a robust technical toolkit. I continually refine my mastery of industry-standard software and modern design principles to ensure my output is both visually engaging and highly functional."
                    : `Highlighting technical competencies related to ${FOCUS_DETAILS[resumeFocus].subtitle}.`}
                </p>
                <div className="resume-skills-grid">
                  {RESUME_SKILLS.map((skill, idx) => {
                    const isHighlighted = resumeFocus === 'all' || FOCUS_SKILLS_MAP[resumeFocus]?.includes(skill.name);
                    return (
                      <div key={idx} className={`resume-skill-item ${isHighlighted ? 'print-highlight' : 'print-dimmed'}`}>
                        <div className="skill-meta">
                          <span className="resume-skill-name">{skill.name}</span>
                        </div>
                        <div className="skill-meter-container">
                          <div className="skill-meter-bar" style={{ width: `${skill.level}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Work Experience */}
              <div className="main-resume-section">
                <h3 className="resume-section-title">WORK EXPERIENCE</h3>
                <div className="experience-list-resume">
                  {RESUME_EXPERIENCE.map((exp, idx) => {
                    const isHighlighted = resumeFocus === 'all' || FOCUS_EXPERIENCE_MAP[resumeFocus]?.includes(exp.id);
                    return (
                      <div key={idx} className={`experience-item-resume ${isHighlighted ? 'print-highlight' : 'print-dimmed'}`}>
                        <div className="experience-title-row">
                          <h4 className="experience-role-text">{exp.role} | <span className="experience-company-text">{exp.company}</span></h4>
                        </div>
                        <div className="experience-meta-row">
                          <span className="experience-period-text">({exp.period})</span>
                          <span className="experience-location-text">{exp.location}</span>
                        </div>
                        <p className="experience-desc-text">{exp.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
