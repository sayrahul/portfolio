import React from 'react';
import { Calendar, Briefcase, GraduationCap } from 'lucide-react';
import './About.css';

const SKILLS = {
  "Core Expertise": ["UI/UX Design", "Web Design", "Graphic & Visual Design", "Front-End Design", "Prototyping"],
  "Media & Marketing": ["Motion Graphics & After Effects", "Social Media Marketing"],
  "Creative Tools & Languages": ["Adobe Photoshop", "Adobe Illustrator", "Adobe After Effects", "Adobe Premiere Pro", "Figma", "HTML5 & CSS3", "JavaScript"]
};

const EXPERIENCE = [
  {
    role: "Graphic Designer",
    company: "OceanSphere Datacore Software Systems Pvt. Ltd.",
    period: "Sept 2025 - Present",
    location: "Aurangabad, MH",
    desc: "Designed brand and marketing visuals to support product promotion and digital presence."
  },
  {
    role: "Freelancer",
    company: "MGT-Commerce GmbH",
    period: "Oct 2024 - Aug 2025",
    location: "Remote",
    desc: "Designed brand-aligned web visuals and modernized design templates for an international e-commerce audience."
  },
  {
    role: "Freelance Consultant",
    company: "Virtual Tech Gurus Pvt. Ltd.",
    period: "Sept 2023 - Sept 2024",
    location: "Remote",
    desc: "Created high-impact digital assets and managed multiple design projects under tight deadlines."
  },
  {
    role: "Graphic Designer",
    company: "Info Edge (India) Ltd.",
    period: "Jun 2022 - Aug 2023",
    location: "Remote",
    desc: "Produced dynamic motion graphics and illustrations while maintaining strict brand consistency across product lines."
  },
  {
    role: "Sr. Graphic Designer",
    company: "SVA - Advertising and Entertainments",
    period: "Dec 2020 - Apr 2022",
    location: "Aurangabad, MH",
    desc: "Developed and refined compelling visual advertising campaigns from initial concept to final delivery."
  },
  {
    role: "Web Designer",
    company: "IPD Business Group",
    period: "Jul 2018 - Nov 2020",
    location: "Aurangabad, MH",
    desc: "Designed website graphics and managed SEO/SEM-optimized digital marketing campaigns to improve search visibility."
  },
  {
    role: "Web Designer",
    company: "Aspitek Solutions Pvt. Ltd.",
    period: "Aug 2016 - Jun 2018",
    location: "Pune, MH",
    desc: "Designed and tested responsive web pages, collaborating seamlessly with developers for cross-device implementation."
  }
];

const EDUCATION = [
  {
    degree: "Graduate in Electronics & Telecommunication Engineering",
    institution: "MGM's Jawaharlal Nehru Engineering College, Aurangabad",
    period: "2015",
    score: "69.70%"
  },
  {
    degree: "Diploma in Electronics & Telecommunication Engineering",
    institution: "Government Polytechnic, Aurangabad",
    period: "2012",
    score: "66.00%"
  },
  {
    degree: "Secondary School Certificate (S.S.C)",
    institution: "Maharashtra State Board, Aurangabad",
    period: "2008",
    score: "83.69%"
  }
];

export default function About() {
  return (
    <section id="about" className="about-section">
      <div className="container">
        <h2 className="section-title">About & Experience</h2>
        <p className="section-subtitle">
          With over 8 years of experience, bridging clean web aesthetics with compelling graphic design.
        </p>

        <div className="about-grid grid-2">
          {/* Left Column: Bio & Skills */}
          <div className="about-bio-container">
            <h3 className="about-subtitle">About Me</h3>
            <p className="about-bio-text">
              With over eight years of experience across freelance, agency, and corporate roles, I bring a well-rounded approach to UI/UX and digital design. I love combining intuitive web aesthetics with compelling graphic design to tell a brand's story.
            </p>
            <p className="about-bio-text">
              I am highly organized, comfortable juggling multiple projects, and always driven to deliver polished visuals that truly elevate a brand's online presence.
            </p>

            <div className="skills-container">
              <h3 className="about-subtitle">Professional Skills</h3>
              {Object.entries(SKILLS).map(([category, items]) => (
                <div key={category} className="skill-group">
                  <h4 className="skill-group-title">{category}</h4>
                  <div className="skill-badge-list">
                    {items.map(skill => (
                      <span key={skill} className="skill-badge">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Education Section under skills */}
            <div className="education-container" style={{ marginTop: '40px' }}>
              <h3 className="about-subtitle">Education History</h3>
              <div className="education-list">
                {EDUCATION.map((edu, idx) => (
                  <div key={idx} className="education-item card" style={{ padding: '16px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '600', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <GraduationCap size={16} /> {edu.period}
                      </span>
                      <span className="badge" style={{ fontSize: '0.75rem' }}>{edu.score}</span>
                    </div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '4px', color: 'var(--accent)' }}>{edu.degree}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{edu.institution}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Experience Timeline */}
          <div className="about-timeline-container">
            <h3 className="about-subtitle">Professional Experience</h3>
            <div className="timeline">
              {EXPERIENCE.map((exp, idx) => (
                <div key={idx} className="timeline-item">
                  <div className="timeline-marker">
                    <Briefcase size={16} />
                  </div>
                  <div className="timeline-content card">
                    <div className="timeline-header">
                      <h4 className="timeline-role">{exp.role}</h4>
                      <span className="timeline-period">
                        <Calendar size={14} /> {exp.period}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.85rem', fontWeight: '600' }}>
                      <span className="timeline-company">{exp.company}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{exp.location}</span>
                    </div>
                    <p className="timeline-desc">{exp.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
