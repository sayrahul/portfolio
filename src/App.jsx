import React, { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import PortfolioGrid from './components/PortfolioGrid';
import ResumePage from './components/ResumePage';
import ContactPage from './components/ContactPage';
import AdminDashboard, { CATEGORY_SUBCATEGORIES } from './components/AdminDashboard';
import CustomCursor from './components/CustomCursor';
import { Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import './App.css';

export default function App() {
  const currentYear = new Date().getFullYear();
  const [currentHash, setCurrentHash] = useState(window.location.hash);
  const [showUpdateToast, setShowUpdateToast] = useState(false);
  const { scrollYProgress } = useScroll();

  // Lifted Bulk AI Importer States
  const [bulkQueue, setBulkQueue] = useState([]);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [hasCelebrated, setHasCelebrated] = useState(false);

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
    } else if (currentHash === '#/admin') {
      document.title = "Rahul Jadhav | Portfolio Admin Console";
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

  // --- Lifted Bulk Importer Helpers & Handlers ---
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve({
          base64,
          mimeType: file.type
        });
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const updateItemStatus = (id, updates) => {
    setBulkQueue(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const processNextQueueItem = async () => {
    const idleItem = bulkQueue.find(item => item.status === 'idle');
    if (!idleItem) return;

    setIsBulkProcessing(true);
    const itemId = idleItem.id;
    const file = idleItem.file;

    const cloudName = localStorage.getItem('cloudinary_cloud_name') || import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dno3fddh9';
    const uploadPreset = localStorage.getItem('cloudinary_upload_preset') || import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'uzxyc123';
    const geminiApiKey = localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';

    updateItemStatus(itemId, { status: 'uploading', progress: 20 });
    let secureUrl = '';
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error("Upload failed. Check Cloudinary settings.");
      }

      const data = await response.json();
      secureUrl = data.secure_url;
      updateItemStatus(itemId, { url: secureUrl, progress: 50 });
    } catch (err) {
      updateItemStatus(itemId, { status: 'failed', error: `Upload error: ${err.message}`, progress: 0 });
      setIsBulkProcessing(false);
      return;
    }

    updateItemStatus(itemId, { status: 'analyzing', progress: 75 });
    try {
      const base64Data = await fileToBase64(file);
      if (!base64Data) {
        throw new Error("Base64 conversion failed.");
      }

      let promptText = "Analyze this project image and generate appropriate portfolio metadata. " +
                       "Determine a suitable creative title, primary category, sub-category, and tools/technologies used.\n\n" +
                       "Respond with ONLY a valid JSON object. Do not include markdown code blocks, backticks, or any other wrapper text.\n" +
                       "Schema:\n" +
                       "{\n" +
                       "  \"title\": \"A short, clean, creative project title (max 45 characters)\",\n" +
                       "  \"category\": \"Must be exactly one of: 'Web Design', 'Graphic Design', or 'Video Editing'\",\n" +
                       "  \"subcategory\": \"A single short sub-category tag chosen from the relevant category:\n" +
                       "     - For Web Design: SaaS Systems, Landing Pages, E-Commerce, Portfolio Sites, Corporate Websites, Web Applications\n" +
                       "     - For Graphic Design: Retouching, Packaging & Print, Branding, Social Media Creatives, Logo Design, Illustrations\n" +
                       "     - For Video Editing: Promos & Reels, Social Content, YouTube Videos, Cinematic Videos, Corporate Promos\",\n" +
                       "  \"tools\": [\"Array of tools used, chosen or inferred from: Figma, Adobe Photoshop, Adobe Illustrator, Adobe After Effects, Adobe Premiere Pro, DaVinci Resolve, Lightroom, Adobe InDesign, React, Tailwind CSS, HTML/CSS, Vanilla CSS, UI/UX Design, Sound Design\"]\n" +
                       "}";

      const parts = [
        { text: promptText },
        {
          inlineData: {
            mimeType: base64Data.mimeType,
            data: base64Data.base64
          }
        }
      ];

      const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts }] })
      });

      if (!aiResponse.ok) {
        throw new Error("Gemini AI API call failed.");
      }

      const aiData = await aiResponse.json();
      const textResponse = aiData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textResponse) {
        throw new Error("Empty response from AI model.");
      }

      const cleanJsonStr = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const result = JSON.parse(cleanJsonStr);

      const validCategories = ["Web Design", "Graphic Design", "Video Editing"];
      const resolvedCategory = validCategories.includes(result.category) ? result.category : "Graphic Design";
      const resolvedTitle = result.title || "AI Implemented Piece";
      const predefinedSub = CATEGORY_SUBCATEGORIES[resolvedCategory] || [];
      const resolvedSubcategory = result.subcategory || predefinedSub[0] || "General";
      const resolvedTools = Array.isArray(result.tools) ? result.tools : [];

      let iconType = 'web';
      if (resolvedCategory === 'Graphic Design') iconType = 'design';
      else if (resolvedCategory === 'Video Editing') iconType = 'video';

      const projectData = {
        id: `${resolvedCategory.toLowerCase().replace(' ', '-')}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        title: resolvedTitle,
        category: resolvedCategory,
        subcategory: resolvedSubcategory,
        tools: resolvedTools,
        iconType,
        thumbnail: secureUrl,
        mainImage: secureUrl
      };

      // Read current DB, append, and save
      let currentDb = [];
      try {
        const storedDb = localStorage.getItem('portfolio_projects_db');
        if (storedDb) {
          currentDb = JSON.parse(storedDb);
        }
      } catch (e) {
        console.error("Failed to parse projects db:", e);
      }
      const updatedDb = [...currentDb, projectData];
      localStorage.setItem('portfolio_projects_db', JSON.stringify(updatedDb));
      
      // Dispatch database update event so other components sync automatically
      window.dispatchEvent(new Event('portfolio_db_updated'));

      updateItemStatus(itemId, {
        status: 'completed',
        progress: 100,
        title: resolvedTitle,
        category: resolvedCategory,
        subcategory: resolvedSubcategory,
        tools: resolvedTools
      });

    } catch (err) {
      updateItemStatus(itemId, { status: 'failed', error: `AI error: ${err.message}`, progress: 0 });
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleBulkImportFiles = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const cloudName = localStorage.getItem('cloudinary_cloud_name') || import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dno3fddh9';
    const uploadPreset = localStorage.getItem('cloudinary_upload_preset') || import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'uzxyc123';
    const geminiApiKey = localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';

    if (!cloudName || !uploadPreset || !geminiApiKey) {
      alert("Please configure your Cloudinary settings and Gemini API Key in the configurations first!");
      return;
    }

    const newItems = files.map((file, idx) => ({
      id: `bulk-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      name: file.name,
      status: 'idle',
      progress: 0,
      title: '',
      category: '',
      subcategory: '',
      tools: [],
      url: '',
      error: ''
    }));

    setHasCelebrated(false); // Reset celebration flag for new batch
    setBulkQueue(prev => [...prev, ...newItems]);
    e.target.value = '';
  };

  const handleClearBulkQueue = () => {
    setBulkQueue([]);
    setHasCelebrated(false);
  };

  // Queue runner observer
  useEffect(() => {
    const idleItem = bulkQueue.find(item => item.status === 'idle');
    if (idleItem && !isBulkProcessing) {
      processNextQueueItem();
    }
  }, [bulkQueue, isBulkProcessing]);

  // Confetti celebrations observer
  useEffect(() => {
    const totalItems = bulkQueue.length;
    if (totalItems === 0) return;

    const completedItems = bulkQueue.filter(item => item.status === 'completed').length;
    const failedItems = bulkQueue.filter(item => item.status === 'failed').length;
    const isFinished = completedItems + failedItems === totalItems;

    if (isFinished && !hasCelebrated) {
      if (completedItems > 0) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
      setHasCelebrated(true);
    }
  }, [bulkQueue, hasCelebrated]);

  const isResumeView = currentHash === '#/resume';
  const isContactView = currentHash === '#/contact';
  const isAdminView = currentHash === '#/admin';

  return (
    <div className="app-layout">
      <CustomCursor />
      <motion.div 
        className="scroll-progress-bar" 
        style={{ scaleX: scrollYProgress }} 
      />
      {isResumeView ? (
        // Separate Printable Resume view
        <ResumePage />
      ) : isContactView ? (
        // Separate Interactive Contact/Onboarding page
        <ContactPage />
      ) : isAdminView ? (
        // Cloudinary Admin Upload Dashboard
        <AdminDashboard 
          bulkQueue={bulkQueue}
          setBulkQueue={setBulkQueue}
          isBulkProcessing={isBulkProcessing}
          handleBulkImportFiles={handleBulkImportFiles}
          handleClearBulkQueue={handleClearBulkQueue}
        />
      ) : (
        // Standard Portfolio Site views
        <>
          <Header />
          <main style={{ paddingTop: '80px' }}>
            <Hero />
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

      {/* Global Background AI Importer Progress HUD Overlay */}
      {bulkQueue.length > 0 && (
        <div className="global-import-progress-card card fade-in">
          <div className="progress-hud-header">
            <div className="progress-hud-title-group">
              <Sparkles size={16} className={isBulkProcessing ? "spin-icon purple-glow" : "purple-glow"} />
              <span className="progress-hud-title">
                {isBulkProcessing ? "AI Background Importing..." : "Batch Import Complete"}
              </span>
            </div>
            <button 
              className="progress-hud-close-btn" 
              onClick={handleClearBulkQueue}
              disabled={isBulkProcessing}
              title="Dismiss HUD"
            >
              <X size={14} />
            </button>
          </div>
          
          <div className="progress-hud-body">
            <div className="progress-hud-info">
              <span className="hud-processed-text">
                {bulkQueue.filter(item => ['completed', 'failed'].includes(item.status)).length} of {bulkQueue.length} processed
              </span>
              {bulkQueue.filter(item => item.status === 'failed').length > 0 && (
                <span className="hud-failed-text">
                  ({bulkQueue.filter(item => item.status === 'failed').length} failed)
                </span>
              )}
            </div>

            <div className="hud-progress-bar-bg">
              <div 
                className="hud-progress-bar-fill"
                style={{ 
                  width: `${(bulkQueue.filter(item => ['completed', 'failed'].includes(item.status)).length / bulkQueue.length) * 100}%` 
                }}
              />
            </div>

            {/* Show current item info if active */}
            {isBulkProcessing && (
              <div className="hud-current-item">
                <span className="hud-current-label">Processing:</span>
                <span className="hud-current-name">
                  {bulkQueue.find(item => ['uploading', 'analyzing'].includes(item.status))?.name || "Initializing..."}
                </span>
              </div>
            )}
          </div>
        </div>
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
