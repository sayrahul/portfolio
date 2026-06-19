import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import './Header.css';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
          <a href="#/admin" className="nav-admin-link">Admin</a>
          <a href="#/contact" className="btn btn-primary nav-btn">Get In Touch</a>
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
          <a href="#/admin" onClick={toggleMenu}>Admin Panel</a>
          <a href="#/contact" onClick={toggleMenu} className="btn btn-primary">Get In Touch</a>
        </div>
      )}
    </header>
  );
}
