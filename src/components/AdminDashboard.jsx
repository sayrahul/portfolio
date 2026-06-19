import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Upload, Trash2, Settings, Sparkles, RefreshCw, AlertCircle, Pencil, X, Lock, User, LogOut, CheckSquare, Square, Plus, FolderOpen, BarChart2 } from 'lucide-react';
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

export default function AdminDashboard() {
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem('portfolio_admin_logged_in') === 'true');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('form'); // 'form', 'catalog', or 'analytics'
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // Cloudinary Settings
  const [cloudName, setCloudName] = useState(() => localStorage.getItem('cloudinary_cloud_name') || 'dno3fddh9');
  const [uploadPreset, setUploadPreset] = useState(() => localStorage.getItem('cloudinary_upload_preset') || 'uzxyc123');
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

  // Edit Mode States
  const [editingProjectId, setEditingProjectId] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Web Design');
  const [subcategory, setSubcategory] = useState('');
  const [selectedTools, setSelectedTools] = useState([]);
  const [toolSearchQuery, setToolSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Media States
  const [thumbnail, setThumbnail] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [beforeImage, setBeforeImage] = useState('');
  const [afterImage, setAfterImage] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [poster, setPoster] = useState('');
  const [webScreenshot, setWebScreenshot] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // UI status
  const [uploadingField, setUploadingField] = useState(null); // 'thumbnail', 'beforeImage', etc.
  const [successMsg, setSuccessMsg] = useState('');

  // Login Handler
  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim().toLowerCase() === 'admin' && password === 'rahul@123') {
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
    if (category === 'Graphic Design') {
      if (beforeImage) imageUrls.push(beforeImage);
      if (afterImage) imageUrls.push(afterImage);
    }
    if (imageUrls.length === 0 && thumbnail) {
      imageUrls.push(thumbnail);
    }

    if (imageUrls.length === 0) {
      alert("Please upload or enter at least one image URL (Before, After, or Thumbnail) first so the AI can analyze it!");
      return;
    }

    setIsAiLoading(true);
    setSuccessMsg('AI is analyzing images...');

    try {
      const parts = [
        {
          text: "Analyze these graphic design image(s) and generate portfolio metadata as a JSON object. " +
                "Respond with ONLY a valid JSON object. Do not include markdown code blocks, backticks, or any other wrapper text. " +
                "Schema:\n" +
                "{\n" +
                "  \"title\": \"A short creative project name (max 45 chars)\",\n" +
                "  \"subcategory\": \"A single short sub-category/genre tag (e.g. Retouching, Photo Editing, Digital Art, Logo Design, Branding, Flyer Design)\",\n" +
                "  \"tools\": [\"Array of tools used, chosen from: Figma, Adobe Photoshop, Adobe Illustrator, Adobe After Effects, Adobe Premiere Pro, DaVinci Resolve, Lightroom, Adobe InDesign\"]\n" +
                "}"
        }
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

      if (result.title) setTitle(result.title);
      if (result.subcategory) setSubcategory(result.subcategory);
      if (result.tools && Array.isArray(result.tools)) {
        setSelectedTools(result.tools);
      }

      setSuccessMsg('Metadata automatically filled by Gemini AI!');
      setTimeout(() => setSuccessMsg(''), 4000);

    } catch (err) {
      console.error("AI Generation failed:", err);
      alert("AI Generation failed. Make sure your Gemini API Key is valid and images are accessible.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Direct Cloudinary Upload via API Fetch
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
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error("Upload failed. Verify Cloudinary credentials.");
      }
      
      const data = await response.json();
      const secureUrl = data.secure_url;

      // Update corresponding form field
      if (field === 'thumbnail') setThumbnail(secureUrl);
      else if (field === 'beforeImage') setBeforeImage(secureUrl);
      else if (field === 'afterImage') setAfterImage(secureUrl);
      else if (field === 'poster') setPoster(secureUrl);
      else if (field === 'webScreenshot') setWebScreenshot(secureUrl);

    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      alert("Direct upload failed. Make sure your upload preset is configured as 'Unsigned' in your Cloudinary Settings.");
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
    setBeforeImage(project.beforeImage || '');
    setAfterImage(project.afterImage || '');
    setVideoUrl(project.videoUrl || '');
    setPoster(project.poster || '');
    setWebScreenshot(project.webScreenshot || '');

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
    setSubcategory('');
    setSelectedTools([]);
    setThumbnail('');
    setLiveUrl('');
    setBeforeImage('');
    setAfterImage('');
    setVideoUrl('');
    setPoster('');
    setWebScreenshot('');
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
      if (webScreenshot) projectData.webScreenshot = webScreenshot;
    } else if (category === 'Graphic Design') {
      if (beforeImage) projectData.beforeImage = beforeImage;
      if (afterImage) projectData.afterImage = afterImage;
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
      updatedList = [...projectsList, newProj];
      setSuccessMsg('New project added successfully!');
    }

    setProjectsList(updatedList);
    localStorage.setItem('portfolio_projects_db', JSON.stringify(updatedList));

    // Clear form fields
    setTitle('');
    setSubcategory('');
    setSelectedTools([]);
    setThumbnail('');
    setLiveUrl('');
    setBeforeImage('');
    setAfterImage('');
    setVideoUrl('');
    setPoster('');
    setWebScreenshot('');

    setTimeout(() => setSuccessMsg(''), 3500);
  };

  // Delete Project
  const handleDeleteProject = (id) => {
    if (window.confirm("Are you sure you want to delete this project? This will remove it from the database.")) {
      const updatedList = projectsList.filter(p => p.id !== id);
      setProjectsList(updatedList);
      localStorage.setItem('portfolio_projects_db', JSON.stringify(updatedList));
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
      handleCancelEdit();
      setSuccessMsg('Defaults restored successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
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
      {/* Header bar */}
      <div className="admin-action-bar">
        <a href="#work" className="btn btn-secondary action-btn-back">
          <ArrowLeft size={16} /> Return to Site
        </a>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setShowSettings(!showSettings)} 
            className={`btn btn-secondary ${showSettings ? 'active-tab' : ''}`}
            title="Cloudinary Settings"
          >
            <Settings size={16} /> Cloudinary Settings
          </button>
          <button onClick={handleRestoreDefaults} className="btn btn-secondary">
            Restore Defaults
          </button>
          <button onClick={handleLogout} className="btn btn-secondary btn-logout" title="Log Out">
            <LogOut size={16} /> <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Segmented Sub-navigation Tabs */}
      <div className="admin-sub-nav-container">
        <div className="admin-sub-nav">
          <button 
            type="button"
            className={`sub-nav-btn ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => setActiveTab('form')}
          >
            {editingProjectId ? <Pencil size={15} /> : <Plus size={15} />}
            <span>{editingProjectId ? 'Modify Project' : 'Upload New Project'}</span>
          </button>
          <button 
            type="button"
            className={`sub-nav-btn ${activeTab === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveTab('catalog')}
          >
            <FolderOpen size={15} />
            <span>Manage Catalog ({projectsList.length})</span>
          </button>
          <button 
            type="button"
            className={`sub-nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart2 size={15} />
            <span>Analytics Dashboard</span>
          </button>
        </div>
      </div>

      <div className={`admin-grid container ${activeTab !== 'analytics' ? 'centered-admin-grid' : 'wide-admin-grid'}`}>
        
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
                  <label className="form-label">Cloudinary Cloud Name</label>
                  <input 
                    type="text" 
                    value={cloudName} 
                    onChange={e => setCloudName(e.target.value)} 
                    placeholder="Enter your Cloud Name"
                    className="form-input" 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Cloudinary Unsigned Upload Preset</label>
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
              {category === 'Graphic Design' && (beforeImage || afterImage || thumbnail) && (
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
                      <span>Analyzing Images...</span>
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
                    onChange={e => setCategory(e.target.value)} 
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
                <input 
                  type="text" 
                  value={subcategory} 
                  onChange={e => setSubcategory(e.target.value)} 
                  placeholder="e.g. SaaS / Retouching / Reels"
                  className="form-input" 
                  required
                />
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
                    <label className="form-label">Actual Website Screenshot</label>
                    <div className="upload-input-group">
                      <input 
                        type="text" 
                        value={webScreenshot} 
                        onChange={e => setWebScreenshot(e.target.value)} 
                        placeholder="Paste image URL or upload file"
                        className="form-input text-url-input" 
                      />
                      <label className="upload-file-btn">
                        {uploadingField === 'webScreenshot' ? <RefreshCw size={14} className="spin-icon" /> : <Upload size={14} />} 
                        <span>Upload</span>
                        <input 
                          type="file" 
                          onChange={e => handleUploadFile(e, 'webScreenshot')} 
                          style={{ display: 'none' }}
                          accept="image/*"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {category === 'Graphic Design' && (
                <div className="form-row grid-2 border-top-form">
                  <div className="form-group">
                    <label className="form-label">Before Retouched Image</label>
                    <div className="upload-input-group">
                      <input 
                        type="text" 
                        value={beforeImage} 
                        onChange={e => setBeforeImage(e.target.value)} 
                        placeholder="Image URL or upload"
                        className="form-input text-url-input" 
                      />
                      <label className="upload-file-btn">
                        {uploadingField === 'beforeImage' ? <RefreshCw size={14} className="spin-icon" /> : <Upload size={14} />} 
                        <input 
                          type="file" 
                          onChange={e => handleUploadFile(e, 'beforeImage')} 
                          style={{ display: 'none' }}
                          accept="image/*"
                        />
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">After Retouched Image</label>
                    <div className="upload-input-group">
                      <input 
                        type="text" 
                        value={afterImage} 
                        onChange={e => setAfterImage(e.target.value)} 
                        placeholder="Image URL or upload"
                        className="form-input text-url-input" 
                      />
                      <label className="upload-file-btn">
                        {uploadingField === 'afterImage' ? <RefreshCw size={14} className="spin-icon" /> : <Upload size={14} />} 
                        <input 
                          type="file" 
                          onChange={e => handleUploadFile(e, 'afterImage')} 
                          style={{ display: 'none' }}
                          accept="image/*"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {category === 'Video Editing' && (
                <div className="form-row grid-2 border-top-form">
                  <div className="form-group">
                    <label className="form-label">Video File URL (Direct .mp4)</label>
                    <input 
                      type="url" 
                      value={videoUrl} 
                      onChange={e => setVideoUrl(e.target.value)} 
                      placeholder="e.g. GCS/S3 video source link"
                      className="form-input" 
                    />
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
