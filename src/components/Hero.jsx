import React from 'react';
import { ArrowRight, Download } from 'lucide-react';
import './Hero.css';

export default function Hero() {
  return (
    <section id="home" className="hero-section">
      <div className="container hero-grid">
        <div className="hero-content">
          <div className="hero-badge badge">Available for Projects</div>
          <h1 className="hero-title">
            Designing intuitive web interfaces & creative graphic assets.
          </h1>
          <p className="hero-description">
            Hi, I'm Rahul Jadhav. I'm a professional Web & Graphic Designer. I combine clean web aesthetics with compelling graphic layouts to build memorable brand experiences and user interfaces.
          </p>
          <div className="hero-actions">
            <a href="#work" className="btn btn-primary">
              View My Work <ArrowRight size={18} />
            </a>
            <a href="#contact" className="btn btn-secondary">
              Contact Me
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-card">
            <div className="card-browser-bar">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
            </div>
            <div className="visual-content">
              {/* Modern layout graphic with subtle slate colors representing design wireframes/editor */}
              <div className="visual-block visual-header">
                <div className="visual-line line-sm"></div>
                <div className="visual-line line-md"></div>
              </div>
              <div className="visual-body">
                <div className="visual-col col-left">
                  <div className="visual-box box-lg"></div>
                  <div className="visual-line line-lg"></div>
                  <div className="visual-line line-md"></div>
                </div>
                <div className="visual-col col-right">
                  <div className="visual-box box-sm"></div>
                  <div className="visual-box box-sm"></div>
                  <div className="visual-box box-sm"></div>
                </div>
              </div>
            </div>
          </div>
          {/* Subtle decorations */}
          <div className="decor-circle circle-1"></div>
          <div className="decor-circle circle-2"></div>
        </div>
      </div>
    </section>
  );
}
