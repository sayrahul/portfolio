import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Upload, Trash2, Settings, Sparkles, RefreshCw, AlertCircle, Pencil, X, Lock, User, LogOut, CheckSquare, Square, Plus, FolderOpen, BarChart2, Download } from 'lucide-react';
import { PROJECTS } from '../data/projects';
import './AdminDashboard.css';

const COMMON_TOOLS = [
  "Figma", 
  "Adobe Photoshop", 
  "Adobe Illustrator", 
  "Adobe After Effects", 
  "Adobe Premiere Pro", 
  "DaVinci Resolve", 
  "Lightroom", 
  "Adobe InDesign", 
  "React", 
  "Vanilla CSS", 
  "Tailwind CSS", 
  "HTML/CSS", 
  "UI/UX Design", 
  "Responsive Layout", 
  "Sound Design"
];

export const CATEGORY_SUBCATEGORIES = {
  "Web Design": [
    "SaaS Systems",
    "Landing Pages",
    "E-Commerce",
    "Portfolio Sites",
    "Corporate Websites",
    "Web Applications"
  ],
  "Graphic Design": [
    "Retouching",
    "Packaging & Print",
    "Branding",
    "Social Media Creatives",
    "Logo Design",
    "Illustrations"
  ],
  "Video Editing": [
    "Promos & Reels",
    "Social Content",
    "YouTube Videos",
    "Cinematic Videos",
    "Corporate Promos"
  ]
};

// Robust helper to retrieve configuration values, handling empty, null, or undefined strings (which can occur in CI/CD builds or localStorage state)
const getSafeSetting = (localKey, envVal, fallback) => {
  const local = localStorage.getItem(localKey);
  if (local && local !== 'null' && local !== 'undefined' && local.trim() !== '') {
    return local;
  }
  if (envVal && envVal !== 'null' && envVal !== 'undefined' && envVal.trim() !== '') {
    return envVal;
  }
  return fallback;
};

export default function AdminDashboard({
  bulkQueue = [],
  setBulkQueue,
  isBulkProcessing = false,
  handleBulkImportFiles,
  handleClearBulkQueue
}) {
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem('portfolio_admin_logged_in') === 'true');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('form'); // 'form', 'catalog', or 'analytics'
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // Cloudinary Settings
  const [cloudName, setCloudName] = useState(() => getSafeSetting('cloudinary_cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME, 'dno3fddh9'));
  const [uploadPreset, setUploadPreset] = useState(() => getSafeSetting('cloudinary_upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET, 'uzxyc123'));
  const [showSettings, setShowSettings] = useState(false);

  // Projects Database List (unified database, default + custom)
  const [projectsList, setProjectsList] = useState(() => {
    try {
      const db = localStorage.getItem('portfolio_projects_db');
      if (!db) {
        localStorage.setItem('portfolio_projects_db', JSON.stringify(PROJECTS));
        return PROJECTS;
      }
      return JSON.parse(db);
    } catch (e) {
      console.warn("Failed to load projects from localStorage:", e);
      return PROJECTS;
    }
  });

  // Listen for database updates from other parts of the app (like the background importer)
  useEffect(() => {
    const handleDbUpdate = () => {
      try {
        const db = localStorage.getItem('portfolio_projects_db');
        if (db) {
          setProjectsList(JSON.parse(db));
        }
      } catch (e) {
        console.warn("Failed to reload projects database from localStorage:", e);
      }
    };
    window.addEventListener('portfolio_db_updated', handleDbUpdate);
    return () => window.removeEventListener('portfolio_db_updated', handleDbUpdate);
  }, []);

  // Edit Mode States
  const [editingProjectId, setEditingProjectId] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Web Design');
  const [subcategory, setSubcategory] = useState('SaaS Systems');
  const [selectedTools, setSelectedTools] = useState([]);
  const [toolSearchQuery, setToolSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Media States
  const [thumbnail, setThumbnail] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [gallery, setGallery] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [poster, setPoster] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState(() => getSafeSetting('gemini_api_key', import.meta.env.VITE_GEMINI_API_KEY, ''));
  const [isAiLoading, setIsAiLoading] = useState(false);

  // UI status
  const [uploadingField, setUploadingField] = useState(null); // 'thumbnail', 'beforeImage', etc.
  const [successMsg, setSuccessMsg] = useState('');

  // Login Handler
  const handleLogin = (e) => {
    e.preventDefault();
    const adminUser = (import.meta.env.VITE_ADMIN_USERNAME || 'admin').trim().toLowerCase();
    const adminPass = import.meta.env.VITE_ADMIN_PASSWORD || 'rahul@123';
    if (username.trim().toLowerCase() === adminUser && password === adminPass) {
      setIsLoggedIn(true);
      sessionStorage.setItem('portfolio_admin_logged_in', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid admin username or password.');
    }
  };

  // Logout Handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('portfolio_admin_logged_in');
  };

  // Save Settings to LocalStorage
  const handleSaveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('cloudinary_cloud_name', cloudName);
    localStorage.setItem('cloudinary_upload_preset', uploadPreset);
    localStorage.setItem('gemini_api_key', geminiApiKey);
    setSuccessMsg('Settings saved successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };


  const imageUrlToBase64 = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result.split(',')[1];
          resolve({
            base64,
            mimeType: blob.type
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.error("Failed to convert image to base64:", err);
      return null;
    }
  };

  const generateMetadataWithAI = async () => {
    if (!geminiApiKey) {
      alert("Please configure your Gemini API Key in the settings first!");
      setShowSettings(true);
      return;
    }

    const imageUrls = [];
    if (thumbnail) imageUrls.push(thumbnail);
    if (mainImage) imageUrls.push(mainImage);
    if (gallery && gallery.length > 0) imageUrls.push(...gallery);
    if (poster) imageUrls.push(poster);

    const hasAssets = imageUrls.length > 0 || liveUrl || videoUrl || title;
    if (!hasAssets) {
      alert("Please enter or upload at least one project asset (Thumbnail, Screenshot, Before/After image, Poster, Live URL, or Video URL) first so the AI can analyze it!");
      return;
    }

    setIsAiLoading(true);
    setSuccessMsg('AI is analyzing project assets...');

    try {
      let promptText = "Analyze the provided project assets (images, URLs, etc.) and generate portfolio metadata. ";
      
      const details = [];
      if (liveUrl) details.push(`- Live website URL: ${liveUrl}`);
      if (videoUrl) details.push(`- Video URL: ${videoUrl}`);
      if (title) details.push(`- Current title (draft): ${title}`);
      
      if (details.length > 0) {
        promptText += "\nHere are the non-image details provided:\n" + details.join("\n") + "\n";
      }
      
      promptText += "\nDetermine the most appropriate category, a clean creative project title, a specific sub-category/tag, and the tools/technologies used.\n\n" +
                    "Respond with ONLY a valid JSON object. Do not include markdown code blocks, backticks, or any other wrapper text.\n" +
                    "Schema:\n" +
                    "{\n" +
                    "  \"category\": \"Must be exactly one of: 'Web Design', 'Graphic Design', or 'Video Editing'\",\n" +
                    "  \"title\": \"A short, clean, creative project title (max 45 characters)\",\n" +
                    "  \"subcategory\": \"A single short sub-category/genre tag (e.g. 'SaaS Landing Page', 'E-commerce', 'Photo Retouching', 'Double Exposure', 'YouTube Thumbnail', 'Cinematic B-Roll', 'Promo Video')\",\n" +
                    "  \"tools\": [\"Array of tools used, chosen or inferred from: Figma, Adobe Photoshop, Adobe Illustrator, Adobe After Effects, Adobe Premiere Pro, DaVinci Resolve, Lightroom, Adobe InDesign, React, Tailwind CSS, HTML/CSS, Vanilla CSS, UI/UX Design, Sound Design\"]\n" +
                    "}";

      const parts = [
        { text: promptText }
      ];

      for (const url of imageUrls) {
        const base64Data = await imageUrlToBase64(url);
        if (base64Data) {
          parts.push({
            inlineData: {
              mimeType: base64Data.mimeType,
              data: base64Data.base64
            }
          });
        }
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{ parts }]
        })
      });

      if (!response.ok) {
        throw new Error("Gemini API call failed.");
      }

      const data = await response.json();
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textResponse) {
        throw new Error("Empty response from AI model.");
      }

      const cleanJsonStr = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const result = JSON.parse(cleanJsonStr);

      if (result.category && ["Web Design", "Graphic Design", "Video Editing"].includes(result.category)) {
        setCategory(result.category);
      }
      if (result.title) setTitle(result.title);
      if (result.subcategory) setSubcategory(result.subcategory);
      if (result.tools && Array.isArray(result.tools)) {
        setSelectedTools(result.tools);
      }

      setSuccessMsg('Metadata automatically filled by Gemini AI!');
      setTimeout(() => setSuccessMsg(''), 4000);

    } catch (err) {
      console.error("AI Generation failed:", err);
      alert("AI Generation failed. Make sure your Gemini API Key is valid and images/assets are accessible.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Direct Cloudinary Upload via API Fetch (handles both images and videos)
  const handleUploadFile = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!cloudName || !uploadPreset) {
      alert("Please configure your Cloudinary Cloud Name and Upload Preset in settings first!");
      return;
    }

    setUploadingField(field);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      // Determine correct Cloudinary endpoint (image vs video) based on file MIME type or extension
      const isVideoType = file.type ? file.type.startsWith('video/') : false;
      const isVideoExtension = /\.(mp4|webm|ogg|mov|avi|mkv|wmv|flv|m4v)$/i.test(file.name);
      const isVideo = isVideoType || isVideoExtension;
      const resourceType = isVideo ? 'video' : 'image';

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || "Upload failed. Verify Cloudinary credentials.");
      }
      
      const data = await response.json();
      const secureUrl = data.secure_url;

      // Update corresponding form field
      if (field === 'thumbnail') setThumbnail(secureUrl);
      else if (field === 'mainImage') setMainImage(secureUrl);
      else if (field === 'poster') setPoster(secureUrl);
      else if (field === 'videoUrl') setVideoUrl(secureUrl);

    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      alert(`Direct upload failed: ${err.message}\n\nMake sure your Cloudinary settings are correct.`);
    } finally {
      setUploadingField(null);
    }
  };

  const handleUploadGalleryFiles = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (!cloudName || !uploadPreset) {
      alert("Please configure your Cloudinary Cloud Name and Upload Preset in settings first!");
      return;
    }

    setUploadingField('gallery');

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData?.error?.message || "Verify Cloudinary credentials.");
        }

        const data = await response.json();
        return data.secure_url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setGallery(prev => [...prev, ...uploadedUrls]);
    } catch (err) {
      console.error("Gallery upload failed:", err);
      alert(`Gallery upload failed: ${err.message}`);
    } finally {
      setUploadingField(null);
    }
  };

  // Handle adding tool from search/autocomplete
  const handleAddTool = (toolName) => {
    const cleanTool = toolName.trim();
    if (cleanTool && !selectedTools.includes(cleanTool)) {
      setSelectedTools(prev => [...prev, cleanTool]);
    }
    setToolSearchQuery('');
    setShowSuggestions(false);
  };

  // Remove tool badge
  const handleRemoveTool = (toolName) => {
    setSelectedTools(prev => prev.filter(t => t !== toolName));
  };

  // Handle enter key or backspace in tool selector
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = toolSearchQuery.trim();
      if (query) {
        handleAddTool(query);
      }
    } else if (e.key === 'Backspace' && !toolSearchQuery && selectedTools.length > 0) {
      handleRemoveTool(selectedTools[selectedTools.length - 1]);
    }
  };

  // Enter Edit Mode
  const handleEditClick = (project) => {
    setEditingProjectId(project.id);
    setTitle(project.title);
    setCategory(project.category);
    setSubcategory(project.subcategory);
    setSelectedTools(project.tools || []);
    setThumbnail(project.thumbnail || '');
    
    // Set specific fields
    setLiveUrl(project.liveUrl || '');
    setMainImage(project.mainImage || '');
    setGallery(project.gallery || []);
    setVideoUrl(project.videoUrl || '');
    setPoster(project.poster || '');

    setActiveTab('form'); // Switch to Form tab when editing
    
    // Scroll form card into view
    const formElement = document.querySelector('.admin-form-card');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Auto-edit project when redirected from main page Edit click
  useEffect(() => {
    if (!isLoggedIn) return;
    
    const editId = sessionStorage.getItem('portfolio_edit_project_id');
    if (editId) {
      const projectToEdit = projectsList.find(p => p.id === editId);
      if (projectToEdit) {
        setTimeout(() => {
          handleEditClick(projectToEdit);
        }, 100);
      }
      sessionStorage.removeItem('portfolio_edit_project_id');
    }
  }, [isLoggedIn, projectsList]);

  // Cancel Editing
  const handleCancelEdit = () => {
    setEditingProjectId(null);
    setTitle('');
    setSubcategory(CATEGORY_SUBCATEGORIES[category]?.[0] || '');
    setSelectedTools([]);
    setThumbnail('');
    setLiveUrl('');
    setMainImage('');
    setGallery([]);
    setVideoUrl('');
    setPoster('');
  };

  // Add or Update Project
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!title || !subcategory) {
      alert("Please fill out all required fields.");
      return;
    }

    let iconType = 'web';
    if (category === 'Graphic Design') iconType = 'design';
    else if (category === 'Video Editing') iconType = 'video';

    // Map unified properties
    const projectData = {
      title,
      category,
      subcategory,
      tools: selectedTools,
      iconType,
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800'
    };

    // Append category parameters
    if (category === 'Web Design') {
      if (liveUrl) projectData.liveUrl = liveUrl;
      if (mainImage) projectData.mainImage = mainImage;
    } else if (category === 'Graphic Design') {
      if (mainImage) projectData.mainImage = mainImage;
      if (gallery && gallery.length > 0) projectData.gallery = gallery;
    } else if (category === 'Video Editing') {
      if (videoUrl) projectData.videoUrl = videoUrl;
      if (poster) projectData.poster = poster;
    }

    let updatedList;
    if (editingProjectId) {
      // Edit mode: find and update
      updatedList = projectsList.map(proj => {
        if (proj.id === editingProjectId) {
          return {
            ...proj,
            ...projectData
          };
        }
        return proj;
      });
      setSuccessMsg('Project updated successfully!');
      setEditingProjectId(null);
    } else {
      // Add mode: create new
      const newProj = {
        id: `${category.toLowerCase().replace(' ', '-')}-${Date.now()}`,
        ...projectData
      };
      updatedList = [newProj, ...projectsList];
      setSuccessMsg('New project added successfully!');
    }

    setProjectsList(updatedList);
    localStorage.setItem('portfolio_projects_db', JSON.stringify(updatedList));
    window.dispatchEvent(new Event('portfolio_db_updated'));

    // Clear form fields
    setTitle('');
    setSubcategory(CATEGORY_SUBCATEGORIES[category]?.[0] || '');
    setSelectedTools([]);
    setThumbnail('');
    setLiveUrl('');
    setMainImage('');
    setGallery([]);
    setVideoUrl('');
    setPoster('');

    setTimeout(() => setSuccessMsg(''), 3500);
  };

  // Delete Project
  const handleDeleteProject = (id) => {
    if (window.confirm("Are you sure you want to delete this project? This will remove it from the database.")) {
      const updatedList = projectsList.filter(p => p.id !== id);
      setProjectsList(updatedList);
      localStorage.setItem('portfolio_projects_db', JSON.stringify(updatedList));
      window.dispatchEvent(new Event('portfolio_db_updated'));
      if (editingProjectId === id) {
        handleCancelEdit();
      }
    }
  };

  // Restore System Defaults
  const handleRestoreDefaults = () => {
    if (window.confirm("Are you sure you want to restore default template projects? This will overwrite your current list.")) {
      setProjectsList(PROJECTS);
      localStorage.setItem('portfolio_projects_db', JSON.stringify(PROJECTS));
      window.dispatchEvent(new Event('portfolio_db_updated'));
      handleCancelEdit();
      setSuccessMsg('Defaults restored successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  // Export Database to JSON
  const handleExportDatabase = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projectsList, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "projects.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      // Also copy to clipboard for convenience
      navigator.clipboard.writeText(JSON.stringify(projectsList, null, 2));
      alert("Database exported successfully!\n\n1. projects.json has been downloaded.\n2. The JSON data has been copied to your clipboard.\n\nTo make these uploads permanent for all visitors on your live website:\nReplace the contents of 'src/data/projects.js' with this exported data, commit, and deploy your site.");
    } catch (err) {
      console.error("Failed to export database:", err);
      alert("Failed to export database: " + err.message);
    }
  };

  // Calculate analytics stats
  const totalProjects = projectsList.length;
  const webDesignCount = projectsList.filter(p => p.category === 'Web Design').length;
  const graphicDesignCount = projectsList.filter(p => p.category === 'Graphic Design').length;
  const videoEditingCount = projectsList.filter(p => p.category === 'Video Editing').length;
  
  // Unique tools
  const allTools = projectsList.flatMap(p => p.tools || []);
  const uniqueTools = Array.from(new Set(allTools));
  const totalUniqueTools = uniqueTools.length;

  // Tool frequency for top tools bar chart
  const toolFrequencies = {};
  allTools.forEach(tool => {
    toolFrequencies[tool] = (toolFrequencies[tool] || 0) + 1;
  });
  
  // Sort tools by frequency
  const sortedTools = Object.entries(toolFrequencies)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // top 5 tools

  const webPct = totalProjects > 0 ? (webDesignCount / totalProjects) : 0;
  const graphicPct = totalProjects > 0 ? (graphicDesignCount / totalProjects) : 0;
  const videoPct = totalProjects > 0 ? (videoEditingCount / totalProjects) : 0;

  const radius = 50;
  const circumference = 2 * Math.PI * radius; // ~314.159
  
  const webDashOffset = circumference * (1 - webPct);
  const graphicDashOffset = circumference * (1 - graphicPct);
  const videoDashOffset = circumference * (1 - videoPct);

  /* ==================== LOGIN LOCK SCREEN ==================== */
  if (!isLoggedIn) {
    return (
      <div className="admin-lock-screen-wrapper">
        <div className="glowing-orb orb-1"></div>
        <div className="glowing-orb orb-2"></div>
        <a href="#work" className="lock-back-link">
          <ArrowLeft size={14} /> Back to Site
        </a>
        <div className="lock-card card fade-in">
          <div className="lock-header">
            <div className="lock-icon-circle">
              <Lock size={24} />
            </div>
            <h1 className="lock-title">Rahul Jadhav</h1>
            <p className="lock-subtitle">Security Console Authentication</p>
          </div>

          {loginError && (
            <div className="login-error-box alert alert-danger fade-in">
              <AlertCircle size={16} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="lock-form">
            <div className="form-group relative-input">
              <User size={16} className="input-inner-icon" />
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Username" 
                className="form-input authenticated-input"
                required
              />
            </div>

            <div className="form-group relative-input">
              <Lock size={16} className="input-inner-icon" />
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password" 
                className="form-input authenticated-input"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary lock-submit-btn">
              Authenticate
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ==================== MAIN ADMIN CONTROL DASHBOARD ==================== */
  return (
    <div className="admin-page-wrapper">
      {/* Unified Premium Admin Header */}
      <header className="admin-dashboard-header">
        <div className="admin-header-brand-group">
          <span className="admin-brand-title">Admin Console</span>
          <a href="#work" className="admin-btn-back" title="Return to Portfolio Site">
            <ArrowLeft size={14} /> <span>Return to Site</span>
          </a>
        </div>

        <nav className="admin-header-nav-tabs">
          <button 
            type="button"
            className={`admin-nav-tab-btn ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => setActiveTab('form')}
          >
            {editingProjectId ? <Pencil size={14} /> : <Plus size={14} />}
            <span>{editingProjectId ? 'Modify' : 'Upload'}</span>
          </button>
          <button 
            type="button"
            className={`admin-nav-tab-btn ${activeTab === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveTab('catalog')}
          >
            <FolderOpen size={14} />
            <span>Catalog ({projectsList.length})</span>
          </button>
          <button 
            type="button"
            className={`admin-nav-tab-btn ${activeTab === 'bulk-import' ? 'active' : ''}`}
            onClick={() => setActiveTab('bulk-import')}
          >
            <Sparkles size={14} />
            <span>AI Importer</span>
          </button>
          <button 
            type="button"
            className={`admin-nav-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart2 size={14} />
            <span>Analytics</span>
          </button>
        </nav>

        <div className="admin-header-action-group">
          <button 
            onClick={() => setShowSettings(!showSettings)} 
            className={`admin-action-icon-btn ${showSettings ? 'active' : ''}`}
            title="Cloudinary & Gemini Settings"
          >
            <Settings size={16} />
            <span className="btn-label-desktop">Settings</span>
          </button>
          <button 
            onClick={handleRestoreDefaults} 
            className="admin-action-icon-btn"
            title="Restore Defaults"
          >
            <RefreshCw size={16} />
            <span className="btn-label-desktop">Restore Defaults</span>
          </button>
          <button 
            onClick={handleExportDatabase} 
            className="admin-action-icon-btn"
            title="Export Database JSON"
          >
            <Download size={16} />
            <span className="btn-label-desktop">Export DB</span>
          </button>
          <button 
            onClick={handleLogout} 
            className="admin-action-icon-btn logout" 
            title="Log Out"
          >
            <LogOut size={16} />
            <span className="btn-label-desktop">Logout</span>
          </button>
        </div>
      </header>

      <div className={`admin-grid container ${activeTab === 'analytics' ? 'wide-admin-grid' : 'centered-admin-grid'}`}>
        
        {/* Centered Form Builder */}
        <div className="admin-form-column">
          {successMsg && (
            <div className="alert alert-success fade-in">
              <Sparkles size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          {activeTab === 'analytics' ? (
            <div className="admin-analytics-dashboard fade-in">
              <div className="analytics-header">
                <h2 className="admin-card-title"><BarChart2 size={20} /> Analytics & Performance</h2>
                <p className="admin-card-desc">Real-time statistics of your portfolio database categories and tool tag distributions.</p>
              </div>
              
              {/* Stats Cards Row */}
              <div className="analytics-stats-grid">
                <div className="analytics-stat-card card">
                  <div className="stat-icon-wrapper blue">
                    <FolderOpen size={20} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-num">{totalProjects}</span>
                    <span className="stat-label">Total Projects</span>
                  </div>
                </div>

                <div className="analytics-stat-card card">
                  <div className="stat-icon-wrapper indigo">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  </div>
                  <div className="stat-info">
                    <span className="stat-num">{webDesignCount}</span>
                    <span className="stat-label">Web Design</span>
                  </div>
                </div>

                <div className="analytics-stat-card card">
                  <div className="stat-icon-wrapper pink">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                  </div>
                  <div className="stat-info">
                    <span className="stat-num">{graphicDesignCount}</span>
                    <span className="stat-label">Graphic Design</span>
                  </div>
                </div>

                <div className="analytics-stat-card card">
                  <div className="stat-icon-wrapper purple">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                  </div>
                  <div className="stat-info">
                    <span className="stat-num">{videoEditingCount}</span>
                    <span className="stat-label">Video Editing</span>
                  </div>
                </div>

                <div className="analytics-stat-card card">
                  <div className="stat-icon-wrapper orange">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>
                  </div>
                  <div className="stat-info">
                    <span className="stat-num">{totalUniqueTools}</span>
                    <span className="stat-label">Tools Registered</span>
                  </div>
                </div>
              </div>

              {/* Main Analytics Content Row */}
              <div className="analytics-content-layout">
                {/* Donut Chart Widget */}
                <div className="analytics-widget-card card">
                  <h3 className="widget-title">Category Distribution</h3>
                  
                  <div className="donut-chart-container">
                    <div className="donut-chart-wrapper">
                      <svg viewBox="0 0 160 160" className="donut-svg">
                        <circle 
                          cx="80" 
                          cy="80" 
                          r="50" 
                          className="donut-bg-track" 
                        />
                        
                        {totalProjects > 0 ? (
                          <>
                            {webDesignCount > 0 && (
                              <circle 
                                cx="80" 
                                cy="80" 
                                r="50" 
                                className={`donut-segment web-segment ${hoveredCategory === 'Web Design' ? 'active' : ''}`}
                                strokeDasharray={`${circumference}`}
                                strokeDashoffset={webDashOffset}
                                transform="rotate(-90 80 80)"
                                onMouseEnter={() => setHoveredCategory('Web Design')}
                                onMouseLeave={() => setHoveredCategory(null)}
                              />
                            )}
                            
                            {graphicDesignCount > 0 && (
                              <circle 
                                cx="80" 
                                cy="80" 
                                r="50" 
                                className={`donut-segment graphic-segment ${hoveredCategory === 'Graphic Design' ? 'active' : ''}`}
                                strokeDasharray={`${circumference}`}
                                strokeDashoffset={graphicDashOffset}
                                transform={`rotate(${-90 + (webPct * 360)} 80 80)`}
                                onMouseEnter={() => setHoveredCategory('Graphic Design')}
                                onMouseLeave={() => setHoveredCategory(null)}
                              />
                            )}
                            
                            {videoEditingCount > 0 && (
                              <circle 
                                cx="80" 
                                cy="80" 
                                r="50" 
                                className={`donut-segment video-segment ${hoveredCategory === 'Video Editing' ? 'active' : ''}`}
                                strokeDasharray={`${circumference}`}
                                strokeDashoffset={videoDashOffset}
                                transform={`rotate(${-90 + ((webPct + graphicPct) * 360)} 80 80)`}
                                onMouseEnter={() => setHoveredCategory('Video Editing')}
                                onMouseLeave={() => setHoveredCategory(null)}
                              />
                            )}
                          </>
                        ) : (
                          <circle 
                            cx="80" 
                            cy="80" 
                            r="50" 
                            className="donut-segment empty-segment"
                            strokeDasharray={`${circumference}`}
                            strokeDashoffset={circumference}
                            transform="rotate(-90 80 80)"
                          />
                        )}
                      </svg>
                      
                      <div className="donut-center-label">
                        <span className="center-value">
                          {hoveredCategory === 'Web Design' && webDesignCount}
                          {hoveredCategory === 'Graphic Design' && graphicDesignCount}
                          {hoveredCategory === 'Video Editing' && videoEditingCount}
                          {!hoveredCategory && totalProjects}
                        </span>
                        <span className="center-text">
                          {hoveredCategory ? `${hoveredCategory}` : 'Projects'}
                        </span>
                        {hoveredCategory && (
                          <span className="center-pct">
                            {hoveredCategory === 'Web Design' && `${Math.round(webPct * 100)}%`}
                            {hoveredCategory === 'Graphic Design' && `${Math.round(graphicPct * 100)}%`}
                            {hoveredCategory === 'Video Editing' && `${Math.round(videoPct * 100)}%`}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Interactive Custom Chart Legend */}
                    <div className="donut-legend">
                      <div 
                        className={`legend-item ${hoveredCategory === 'Web Design' ? 'highlighted' : ''}`}
                        onMouseEnter={() => setHoveredCategory('Web Design')}
                        onMouseLeave={() => setHoveredCategory(null)}
                      >
                        <span className="legend-dot web"></span>
                        <div className="legend-info">
                          <span className="legend-name">Web Design</span>
                          <span className="legend-count">{webDesignCount} ({Math.round(webPct * 100)}%)</span>
                        </div>
                      </div>
                      <div 
                        className={`legend-item ${hoveredCategory === 'Graphic Design' ? 'highlighted' : ''}`}
                        onMouseEnter={() => setHoveredCategory('Graphic Design')}
                        onMouseLeave={() => setHoveredCategory(null)}
                      >
                        <span className="legend-dot graphic"></span>
                        <div className="legend-info">
                          <span className="legend-name">Graphic Design</span>
                          <span className="legend-count">{graphicDesignCount} ({Math.round(graphicPct * 100)}%)</span>
                        </div>
                      </div>
                      <div 
                        className={`legend-item ${hoveredCategory === 'Video Editing' ? 'highlighted' : ''}`}
                        onMouseEnter={() => setHoveredCategory('Video Editing')}
                        onMouseLeave={() => setHoveredCategory(null)}
                      >
                        <span className="legend-dot video"></span>
                        <div className="legend-info">
                          <span className="legend-name">Video Editing</span>
                          <span className="legend-count">{videoEditingCount} ({Math.round(videoPct * 100)}%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Popular Tools Bar Chart Widget */}
                <div className="analytics-widget-card card">
                  <h3 className="widget-title">Popular Tools & Frameworks</h3>
                  <p className="widget-subtitle">Top 5 most frequently used tools across projects</p>
                  
                  {sortedTools.length === 0 ? (
                    <div className="empty-tools-msg">
                      <p>Add tools to your projects to see statistics here.</p>
                    </div>
                  ) : (
                    <div className="tools-bar-list">
                      {sortedTools.map((tool, idx) => {
                        const maxCount = sortedTools[0].count; // highest frequency for percentage base
                        const toolPct = maxCount > 0 ? (tool.count / maxCount) * 100 : 0;
                        return (
                          <div key={idx} className="tool-bar-row">
                            <div className="tool-bar-label-group">
                              <span className="tool-bar-name">{tool.name}</span>
                              <span className="tool-bar-count">{tool.count} {tool.count === 1 ? 'project' : 'projects'}</span>
                            </div>
                            <div className="tool-progress-bg">
                              <div 
                                className="tool-progress-fill" 
                                style={{ width: `${toolPct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : activeTab === 'bulk-import' ? (
            <div className="admin-form-card card fade-in">
              <h2 className="admin-card-title"><Sparkles size={18} /> Bulk AI Portfolio Importer</h2>
              <p className="admin-card-desc">
                Select multiple image files. The system will upload them to Cloudinary and use Gemini 2.5 Flash to automatically detect category, sub-category, title, and tools used for each image, saving them to your portfolio database in real time.
              </p>
              
              {(!cloudName || !uploadPreset || !geminiApiKey) && (
                <div className="login-error-box alert alert-danger fade-in" style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  <AlertCircle size={16} />
                  <span>
                    <strong>Configuration Missing:</strong> Please check and save your Cloudinary settings and Gemini API key in the configurations tab first.
                  </span>
                </div>
              )}
              
              <div className="bulk-dropzone-wrapper" style={{ border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '40px 20px', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s ease', backgroundColor: 'var(--bg-secondary)' }}>
                <label className="bulk-dropzone-label" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', width: '100%' }}>
                  <Upload size={32} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
                  <span className="dropzone-title" style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--primary)' }}>Select Images to Import</span>
                  <span className="dropzone-subtitle" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Supported formats: JPG, PNG, WEBP. You can upload multiple files at once.</span>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handleBulkImportFiles}
                    className="bulk-file-input"
                    disabled={!cloudName || !uploadPreset || !geminiApiKey}
                    style={{ display: 'none' }}
                  />
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const input = document.querySelector('.bulk-file-input');
                      if (input) input.click();
                    }}
                    disabled={!cloudName || !uploadPreset || !geminiApiKey}
                    style={{ marginTop: '16px' }}
                  >
                    Browse Files
                  </button>
                </label>
              </div>
              
              {bulkQueue.length > 0 && (
                <div className="bulk-queue-section" style={{ marginTop: '32px' }}>
                  <div className="queue-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Import Queue ({bulkQueue.filter(item => item.status === 'completed').length}/{bulkQueue.length} processed)</h3>
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={handleClearBulkQueue}
                      disabled={isBulkProcessing}
                      style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    >
                      Clear Queue
                    </button>
                  </div>
                  
                  <div className="bulk-queue-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {bulkQueue.map((item) => (
                      <div key={item.id} className={`bulk-queue-item card status-${item.status}`} style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-secondary)', textAlign: 'left' }}>
                        <div className="bulk-queue-item-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                          <span className="file-name" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary)' }}>{item.name}</span>
                          <span className={`status-badge badge-${item.status}`} style={{ fontSize: '0.7rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '100px', backgroundColor: item.status === 'completed' ? 'rgba(34, 197, 94, 0.15)' : item.status === 'failed' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(37, 99, 235, 0.15)', color: item.status === 'completed' ? '#22c55e' : item.status === 'failed' ? '#ef4444' : '#2563eb' }}>
                            {item.status.toUpperCase()}
                          </span>
                        </div>
                        
                        {['uploading', 'analyzing'].includes(item.status) && (
                          <div className="item-progress-bar-bg" style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden', marginTop: '8px' }}>
                            <div className="item-progress-bar-fill" style={{ height: '100%', width: `${item.progress}%`, backgroundColor: 'var(--accent)', transition: 'width 0.4s ease' }}></div>
                          </div>
                        )}
                        
                        {item.status === 'failed' && (
                          <p className="item-error-msg" style={{ fontSize: '0.78rem', color: '#ef4444', marginTop: '6px', margin: 0 }}>{item.error}</p>
                        )}
                        
                        {item.status === 'completed' && (
                          <div className="item-details-preview" style={{ display: 'flex', gap: '12px', marginTop: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '12px', flexWrap: 'wrap' }}>
                            <div className="details-thumb-container" style={{ flexShrink: 0 }}>
                              <img src={item.url} alt={item.title} className="details-thumb" style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                            </div>
                            <div className="details-info" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                              <strong>Title:</strong> {item.title} <br/>
                              <strong>Category:</strong> {item.category} &bull; <strong>Sub-category:</strong> {item.subcategory} <br/>
                              <strong>Tools:</strong> {item.tools.join(', ')}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === 'form' ? (
            <>
              {/* Edit Mode Alert Bar */}
              {editingProjectId && (
            <div className="alert alert-warning fade-in">
              <Pencil size={16} />
              <span>Editing Project Mode: Changes will update the existing project.</span>
              <button onClick={handleCancelEdit} className="cancel-edit-x-btn" title="Cancel edit mode">
                <X size={14} />
              </button>
            </div>
          )}

          {/* Settings Box */}
          {showSettings && (
            <div className="admin-settings-card card fade-in">
              <h3 className="admin-card-title"><Settings size={18} /> Configurations & Integrations</h3>
              <p className="admin-card-desc">
                Configure Cloudinary unsigned uploads and Gemini API settings.
              </p>
              <form onSubmit={handleSaveSettings} className="admin-form">
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label">Cloudinary Cloud Name</label>
                    <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: cloudName === 'dno3fddh9' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: cloudName === 'dno3fddh9' ? '#3b82f6' : '#10b981', fontWeight: '500' }}>
                      {cloudName === 'dno3fddh9' ? 'Default Account' : 'Custom'}
                    </span>
                  </div>
                  <input 
                    type="text" 
                    value={cloudName} 
                    onChange={e => setCloudName(e.target.value)} 
                    placeholder="Enter your Cloud Name"
                    className="form-input" 
                  />
                </div>
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label">Cloudinary Unsigned Upload Preset</label>
                    <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: uploadPreset === 'uzxyc123' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: uploadPreset === 'uzxyc123' ? '#3b82f6' : '#10b981', fontWeight: '500' }}>
                      {uploadPreset === 'uzxyc123' ? 'Default Preset' : 'Custom'}
                    </span>
                  </div>
                  <input 
                    type="text" 
                    value={uploadPreset} 
                    onChange={e => setUploadPreset(e.target.value)} 
                    placeholder="e.g. preset_123"
                    className="form-input" 
                  />
                </div>
                <div className="form-group border-top-form" style={{ paddingTop: '16px', marginTop: '8px' }}>
                  <label className="form-label">Gemini API Key</label>
                  <input 
                    type="password" 
                    value={geminiApiKey} 
                    onChange={e => setGeminiApiKey(e.target.value)} 
                    placeholder="AI auto-fill key (e.g. AIzaSy...)"
                    className="form-input" 
                  />
                  <p className="form-input-help" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Required for the AI Auto-fill features. You can get a free key from Google AI Studio.
                  </p>
                </div>
                <button type="submit" className="btn btn-primary">Save Settings</button>
              </form>
            </div>
          )}

          {/* Add/Edit Project Form */}
          <div className="admin-form-card card">
            <div className="form-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h2 className="admin-card-title" style={{ marginBottom: 0 }}>
                {editingProjectId ? 'Modify Project Details' : 'Add New Project'}
              </h2>
              {(thumbnail || mainImage || (gallery && gallery.length > 0) || poster || liveUrl || videoUrl || title) && (
                <button
                  type="button"
                  onClick={generateMetadataWithAI}
                  disabled={isAiLoading}
                  className="btn btn-secondary ai-autofill-btn"
                  style={{ 
                    border: '1px solid rgba(147, 51, 234, 0.3)',
                    background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.05) 0%, rgba(79, 70, 229, 0.05) 100%)',
                    color: '#9333ea',
                    fontSize: '0.82rem',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  {isAiLoading ? (
                    <>
                      <RefreshCw size={14} className="spin-icon" style={{ color: '#9333ea', marginRight: '6px' }} />
                      <span>Analyzing Assets...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} style={{ marginRight: '6px' }} />
                      <span>Auto-fill Metadata via AI</span>
                    </>
                  )}
                </button>
              )}
            </div>
            <form onSubmit={handleFormSubmit} className="admin-form">
              
              <div className="form-row grid-2">
                <div className="form-group">
                  <label className="form-label">Project Title *</label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    placeholder="e.g. Modern Landing Page"
                    className="form-input" 
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Primary Category *</label>
                  <select 
                    value={category} 
                    onChange={e => {
                      const newCat = e.target.value;
                      setCategory(newCat);
                      const subcats = CATEGORY_SUBCATEGORIES[newCat] || [];
                      if (subcats.length > 0) {
                        setSubcategory(subcats[0]);
                      }
                    }} 
                    className="form-input select-input"
                  >
                    <option value="Web Design">Web Design</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Video Editing">Video Editing</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Sub-category (Tag) *</label>
                <select
                  value={subcategory}
                  onChange={e => setSubcategory(e.target.value)}
                  className="form-input select-input"
                  required
                >
                  {(() => {
                    const predefined = CATEGORY_SUBCATEGORIES[category] || [];
                    const options = [...predefined];
                    if (subcategory && !options.includes(subcategory)) {
                      options.push(subcategory);
                    }
                    return options.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ));
                  })()}
                </select>
              </div>



              {/* Autocomplete Search Tool Tag Input */}
              <div className="form-group border-top-form relative-input-group">
                <label className="form-label">Select Tools & Frameworks Used *</label>
                <div 
                  className={`tag-input-container ${showSuggestions ? 'focused' : ''}`}
                  onClick={() => {
                    const inputElement = document.querySelector('.tag-text-input');
                    if (inputElement) inputElement.focus();
                  }}
                >
                  {selectedTools.map(tool => (
                    <span key={tool} className="selected-tag-badge">
                      {tool}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveTool(tool)} 
                        className="remove-tag-btn"
                        title={`Remove ${tool}`}
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                  <input 
                    type="text" 
                    value={toolSearchQuery}
                    onChange={e => {
                      setToolSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => {
                      // Small delay so click on suggestion dropdown registers before blur
                      setTimeout(() => setShowSuggestions(false), 200);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={selectedTools.length === 0 ? "Type or choose tools (e.g. React, Photoshop)..." : ""}
                    className="tag-text-input" 
                  />
                </div>

                {/* Suggestions Dropdown list */}
                {showSuggestions && (
                  <div className="suggestions-dropdown card fade-in">
                    {COMMON_TOOLS
                      .filter(tool => 
                        tool.toLowerCase().includes(toolSearchQuery.toLowerCase()) && 
                        !selectedTools.includes(tool)
                      )
                      .map(tool => (
                        <div 
                          key={tool} 
                          className="suggestion-item"
                          onMouseDown={() => handleAddTool(tool)}
                        >
                          {tool}
                        </div>
                      ))
                    }
                    {toolSearchQuery.trim() && !COMMON_TOOLS.some(t => t.toLowerCase() === toolSearchQuery.trim().toLowerCase()) && !selectedTools.includes(toolSearchQuery.trim()) && (
                      <div 
                        className="suggestion-item custom-suggestion"
                        onMouseDown={() => handleAddTool(toolSearchQuery.trim())}
                      >
                        Add Custom: <strong>"{toolSearchQuery.trim()}"</strong>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="form-group border-top-form">
                <label className="form-label">Main Card Thumbnail *</label>
                <div className="upload-input-group">
                  <input 
                    type="text" 
                    value={thumbnail} 
                    onChange={e => setThumbnail(e.target.value)} 
                    placeholder="Paste secure image URL or upload file"
                    className="form-input text-url-input" 
                  />
                  <label className="upload-file-btn">
                    {uploadingField === 'thumbnail' ? <RefreshCw size={14} className="spin-icon" /> : <Upload size={14} />} 
                    <span>Upload file</span>
                    <input 
                      type="file" 
                      onChange={e => handleUploadFile(e, 'thumbnail')} 
                      style={{ display: 'none' }}
                      accept="image/*"
                    />
                  </label>
                </div>
                {thumbnail && <img src={thumbnail} alt="thumbnail-preview" className="thumbnail-preview" />}
              </div>

              {/* Dynamic Context Fields */}
              {category === 'Web Design' && (
                <div className="form-row grid-2 border-top-form">
                  <div className="form-group">
                    <label className="form-label">Live Site URL</label>
                    <input 
                      type="url" 
                      value={liveUrl} 
                      onChange={e => setLiveUrl(e.target.value)} 
                      placeholder="https://example.com"
                      className="form-input" 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Main Project Image</label>
                    <div className="upload-input-group">
                      <input 
                        type="text" 
                        value={mainImage} 
                        onChange={e => setMainImage(e.target.value)} 
                        placeholder="Paste image URL or upload file"
                        className="form-input text-url-input" 
                      />
                      <label className="upload-file-btn">
                        {uploadingField === 'mainImage' ? <RefreshCw size={14} className="spin-icon" /> : <Upload size={14} />} 
                        <span>Upload</span>
                        <input 
                          type="file" 
                          onChange={e => handleUploadFile(e, 'mainImage')} 
                          style={{ display: 'none' }}
                          accept="image/*"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {category === 'Graphic Design' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="form-group border-top-form">
                    <label className="form-label">Main Project Image</label>
                    <div className="upload-input-group">
                      <input 
                        type="text" 
                        value={mainImage} 
                        onChange={e => setMainImage(e.target.value)} 
                        placeholder="Paste image URL or upload file"
                        className="form-input text-url-input" 
                      />
                      <label className="upload-file-btn">
                        {uploadingField === 'mainImage' ? <RefreshCw size={14} className="spin-icon" /> : <Upload size={14} />} 
                        <span>Upload file</span>
                        <input 
                          type="file" 
                          onChange={e => handleUploadFile(e, 'mainImage')} 
                          style={{ display: 'none' }}
                          accept="image/*"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="form-group border-top-form">
                    <label className="form-label">Project Gallery (Upload multiple images, displayed one below another)</label>
                    <div className="upload-input-group" style={{ marginBottom: '12px' }}>
                      <input 
                        type="text" 
                        id="gallery-url-input"
                        placeholder="Paste image URL and press Enter or click Add"
                        className="form-input text-url-input" 
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const url = e.target.value.trim();
                            if (url) {
                              setGallery(prev => [...prev, url]);
                              e.target.value = '';
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          const input = document.getElementById('gallery-url-input');
                          if (input && input.value.trim()) {
                            setGallery(prev => [...prev, input.value.trim()]);
                            input.value = '';
                          }
                        }}
                        style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                      >
                        Add
                      </button>
                      <label className="upload-file-btn">
                        {uploadingField === 'gallery' ? <RefreshCw size={14} className="spin-icon" /> : <Upload size={14} />} 
                        <span>Upload Multiple</span>
                        <input 
                          type="file" 
                          onChange={e => handleUploadGalleryFiles(e)} 
                          style={{ display: 'none' }}
                          accept="image/*"
                          multiple
                        />
                      </label>
                    </div>

                    {gallery.length > 0 && (
                      <div className="gallery-preview-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {gallery.map((img, idx) => (
                          <div key={idx} className="gallery-item-row" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-secondary)' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', width: '20px' }}>{idx + 1}</span>
                            <img src={img} alt={`gallery-thumb-${idx}`} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                            <span style={{ flex: 1, fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>{img}</span>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => {
                                  const updated = [...gallery];
                                  const temp = updated[idx];
                                  updated[idx] = updated[idx - 1];
                                  updated[idx - 1] = temp;
                                  setGallery(updated);
                                }}
                                className="admin-card-btn"
                                style={{ width: '24px', height: '24px', padding: 0 }}
                                title="Move Up"
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                disabled={idx === gallery.length - 1}
                                onClick={() => {
                                  const updated = [...gallery];
                                  const temp = updated[idx];
                                  updated[idx] = updated[idx + 1];
                                  updated[idx + 1] = temp;
                                  setGallery(updated);
                                }}
                                className="admin-card-btn"
                                style={{ width: '24px', height: '24px', padding: 0 }}
                                title="Move Down"
                              >
                                ↓
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setGallery(prev => prev.filter((_, i) => i !== idx));
                                }}
                                className="admin-card-btn delete-btn"
                                style={{ width: '24px', height: '24px', padding: 0 }}
                                title="Delete"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {category === 'Video Editing' && (
                <div className="form-row grid-2 border-top-form">
                  <div className="form-group">
                    <label className="form-label">Video File URL (Direct .mp4)</label>
                    <div className="upload-input-group">
                      <input 
                        type="url" 
                        value={videoUrl} 
                        onChange={e => setVideoUrl(e.target.value)} 
                        placeholder="e.g. paste video URL or upload file"
                        className="form-input text-url-input" 
                      />
                      <label className="upload-file-btn">
                        {uploadingField === 'videoUrl' ? <RefreshCw size={14} className="spin-icon" /> : <Upload size={14} />} 
                        <input 
                          type="file" 
                          onChange={e => handleUploadFile(e, 'videoUrl')} 
                          style={{ display: 'none' }}
                          accept="video/*"
                        />
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Video Cover Poster</label>
                    <div className="upload-input-group">
                      <input 
                        type="text" 
                        value={poster} 
                        onChange={e => setPoster(e.target.value)} 
                        placeholder="Poster image URL or upload"
                        className="form-input text-url-input" 
                      />
                      <label className="upload-file-btn">
                        {uploadingField === 'poster' ? <RefreshCw size={14} className="spin-icon" /> : <Upload size={14} />} 
                        <input 
                          type="file" 
                          onChange={e => handleUploadFile(e, 'poster')} 
                          style={{ display: 'none' }}
                          accept="image/*"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn btn-primary form-submit-btn" style={{ flex: 1 }}>
                  {editingProjectId ? 'Save Project Changes' : 'Add Project to Database'} <Save size={16} style={{ marginLeft: '6px' }} />
                </button>
                {editingProjectId && (
                  <button 
                    type="button" 
                    onClick={handleCancelEdit} 
                    className="btn btn-secondary form-submit-btn"
                    style={{ background: '#f1f5f9', border: '1px solid #cbd5e1' }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
          </>
          ) : (
            /* Portfolio Catalog Manager */
            <div className="admin-catalog-card card">
            <h3 className="admin-card-title">Manage Portfolio Catalog ({projectsList.length})</h3>
            <p className="admin-card-desc">
              Edit tags, update visual assets, or delete projects directly from the portfolio database.
            </p>
            {projectsList.length === 0 ? (
              <div className="empty-catalog-msg">
                <AlertCircle size={28} className="placeholder-icon" />
                <p>No projects found. Use the form above to add a new project.</p>
              </div>
            ) : (
              <div className="catalog-items-list">
                {projectsList.map(proj => (
                  <div key={proj.id} className="catalog-item-row">
                    <img src={proj.thumbnail} alt={proj.title} className="catalog-item-thumb" />
                    <div className="catalog-item-info">
                      <h4 className="catalog-item-title">{proj.title}</h4>
                      <p className="catalog-item-meta">
                        <span className="cat-pill">{proj.category}</span>
                        <span className="subcat-pill">{proj.subcategory}</span>
                      </p>
                      {proj.tools && proj.tools.length > 0 && (
                        <div className="catalog-item-tools">
                          {proj.tools.map((t, i) => (
                            <span key={i} className="catalog-tool-tag">{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="catalog-item-actions">
                      <button 
                        type="button"
                        onClick={() => handleEditClick(proj)} 
                        className="catalog-btn edit"
                        title="Edit Project"
                      >
                        <Pencil size={14} />
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleDeleteProject(proj.id)} 
                        className="catalog-btn delete"
                        title="Delete Project"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          )}

        </div>
      </div>
    </div>
  );
}
