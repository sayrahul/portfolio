import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import './Header.css';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('portfolio_theme') === 'dark';
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('portfolio_theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('portfolio_theme', 'light');
    }
  }, [isDark]);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <a href="#work" className="logo">
          Rahul Jadhav<span className="logo-dot">.</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="nav-desktop">
          <a href="#work">Portfolio</a>
          <a href="#/resume">Resume</a>
          <a href="#/contact" className="btn btn-primary nav-btn">Get In Touch</a>
          <button 
            type="button"
            onClick={() => setIsDark(!isDark)} 
            className="theme-toggle-btn"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </nav>

        {/* Mobile Navigation Toggle */}
        <button className="nav-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="nav-mobile fade-in">
          <a href="#work" onClick={toggleMenu}>Portfolio</a>
          <a href="#/resume" onClick={toggleMenu}>Resume</a>
          <a href="#/contact" onClick={toggleMenu} className="btn btn-primary">Get In Touch</a>
          <button 
            type="button"
            onClick={() => {
              setIsDark(!isDark);
              toggleMenu();
            }} 
            className="theme-toggle-btn mobile-theme-btn"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />} <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      )}
    </header>
  );
}
