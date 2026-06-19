import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PortfolioGrid from './components/PortfolioGrid';
import ResumePage from './components/ResumePage';
import ContactPage from './components/ContactPage';
import './App.css';

export default function App() {
  const currentYear = new Date().getFullYear();
  const [currentHash, setCurrentHash] = useState(window.location.hash);
  const [showUpdateToast, setShowUpdateToast] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
      // Scroll to top on page switches
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update Dynamic SEO document titles based on navigation state
  useEffect(() => {
    if (currentHash === '#/resume') {
      document.title = "Rahul Jadhav | Professional Interactive Resume";
    } else if (currentHash === '#/contact') {
      document.title = "Rahul Jadhav | Project Planner & Onboarding";
    } else {
      document.title = "Rahul Jadhav | Web & Graphic Designer Portfolio";
    }
  }, [currentHash]);

  // Listen for PWA update notifications from service worker registration
  useEffect(() => {
    const handleSWUpdate = () => {
      setShowUpdateToast(true);
    };

    window.addEventListener('sw-update-available', handleSWUpdate);
    return () => window.removeEventListener('sw-update-available', handleSWUpdate);
  }, []);

  const isResumeView = currentHash === '#/resume';
  const isContactView = currentHash === '#/contact';

  return (
    <div className="app-layout">
      {isResumeView ? (
        // Separate Printable Resume view
        <ResumePage />
      ) : isContactView ? (
        // Separate Interactive Contact/Onboarding page
        <ContactPage />
      ) : (
        // Standard Portfolio Site views
        <>
          <Header />
          <main style={{ paddingTop: '80px' }}>
            <PortfolioGrid />
          </main>
          
          <footer className="footer-bar">
            <div className="container footer-container">
              <div className="footer-left">
                <span className="footer-logo">Rahul Jadhav<span className="logo-dot">.</span></span>
                <p className="footer-copy">
                  &copy; {currentYear} Rahul Jadhav. All rights reserved. Professional Creative Services.
                </p>
              </div>
              <div className="footer-right">
                <nav className="footer-nav">
                  <a href="#work">Portfolio</a>
                  <a href="#/resume">Resume</a>
                  <a href="#/contact">Contact</a>
                </nav>
              </div>
            </div>
          </footer>
        </>
      )}

      {showUpdateToast && (
        <div className="pwa-update-toast card fade-in">
          <div className="update-toast-content">
            <span className="update-toast-title">Update Available</span>
            <span className="update-toast-desc">A new version of the website is ready.</span>
          </div>
          <button 
            className="btn btn-primary toast-refresh-btn"
            onClick={() => window.location.reload()}
          >
            Refresh Now
          </button>
        </div>
      )}
    </div>
  );
}
