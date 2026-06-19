import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Upload, Trash2, Settings, Sparkles, RefreshCw, AlertCircle, Pencil, X, Lock, User, LogOut, CheckSquare, Square, Plus, FolderOpen } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('form'); // 'form' or 'catalog'

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
  const [customToolInput, setCustomToolInput] = useState('');
  
  // Media States
  const [thumbnail, setThumbnail] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [beforeImage, setBeforeImage] = useState('');
  const [afterImage, setAfterImage] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [poster, setPoster] = useState('');

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
    setSuccessMsg('Cloudinary settings saved!');
    setTimeout(() => setSuccessMsg(''), 3000);
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

    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      alert("Direct upload failed. Make sure your upload preset is configured as 'Unsigned' in your Cloudinary Settings.");
    } finally {
      setUploadingField(null);
    }
  };

  // Handle checking/unchecking a tool
  const handleToolToggle = (toolName) => {
    if (selectedTools.includes(toolName)) {
      setSelectedTools(prev => prev.filter(t => t !== toolName));
    } else {
      setSelectedTools(prev => [...prev, toolName]);
    }
  };

  // Add Custom Tool Checkbox
  const handleAddCustomTool = (e) => {
    e.preventDefault();
    const cleanTool = customToolInput.trim();
    if (cleanTool && !selectedTools.includes(cleanTool)) {
      setSelectedTools(prev => [...prev, cleanTool]);
      setCustomToolInput('');
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
        </div>
      </div>

      <div className="admin-grid container centered-admin-grid">
        
        {/* Centered Form Builder */}
        <div className="admin-form-column">
          {successMsg && (
            <div className="alert alert-success fade-in">
              <Sparkles size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          {activeTab === 'form' ? (
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

          {/* Cloudinary Settings Box */}
          {showSettings && (
            <div className="admin-settings-card card fade-in">
              <h3 className="admin-card-title"><Settings size={18} /> Cloudinary Config</h3>
              <p className="admin-card-desc">
                Setup unsigned uploads to upload files directly. Set this up in Cloudinary settings.
              </p>
              <form onSubmit={handleSaveSettings} className="admin-form">
                <div className="form-group">
                  <label className="form-label">Cloud Name</label>
                  <input 
                    type="text" 
                    value={cloudName} 
                    onChange={e => setCloudName(e.target.value)} 
                    placeholder="Enter your Cloud Name"
                    className="form-input" 
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Unsigned Upload Preset</label>
                  <input 
                    type="text" 
                    value={uploadPreset} 
                    onChange={e => setUploadPreset(e.target.value)} 
                    placeholder="e.g. preset_123"
                    className="form-input" 
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">Save Config</button>
              </form>
            </div>
          )}

          {/* Add/Edit Project Form */}
          <div className="admin-form-card card">
            <h2 className="admin-card-title">
              {editingProjectId ? 'Modify Project Details' : 'Add New Project'}
            </h2>
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



              {/* Tools Multi-Select Checkboxes Grid */}
              <div className="form-group border-top-form">
                <label className="form-label">Select Tools & Frameworks Used *</label>
                <div className="tools-checkbox-grid">
                  {COMMON_TOOLS.map(tool => {
                    const isChecked = selectedTools.includes(tool);
                    return (
                      <div 
                        key={tool} 
                        className={`tool-checkbox-item ${isChecked ? 'checked' : ''}`}
                        onClick={() => handleToolToggle(tool)}
                      >
                        {isChecked ? <CheckSquare size={16} className="checkbox-icon icon-checked" /> : <Square size={16} className="checkbox-icon" />}
                        <span className="checkbox-label">{tool}</span>
                      </div>
                    );
                  })}
                </div>
                
                {/* Custom Tool Adder */}
                <div className="custom-tool-adder-row">
                  <input 
                    type="text" 
                    value={customToolInput} 
                    onChange={e => setCustomToolInput(e.target.value)} 
                    placeholder="Other tool (e.g. Docker, Redux)"
                    className="form-input custom-tool-input-text" 
                  />
                  <button type="button" onClick={handleAddCustomTool} className="btn btn-secondary add-tool-btn" title="Add tool">
                    <Plus size={14} /> Add
                  </button>
                </div>
                
                {/* Selected Custom Tools Badges */}
                {selectedTools.filter(t => !COMMON_TOOLS.includes(t)).length > 0 && (
                  <div className="custom-tools-badges-row">
                    <span className="badge-label">Custom:</span>
                    {selectedTools.filter(t => !COMMON_TOOLS.includes(t)).map(tool => (
                      <span key={tool} className="tool-badge-pill">
                        {tool}
                        <button type="button" onClick={() => handleToolToggle(tool)} className="remove-badge-btn">
                          <X size={10} />
                        </button>
                      </span>
                    ))}
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
                <div className="form-group border-top-form">
                  <label className="form-label">Live Site URL</label>
                  <input 
                    type="url" 
                    value={liveUrl} 
                    onChange={e => setLiveUrl(e.target.value)} 
                    placeholder="https://example.com"
                    className="form-input" 
                  />
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
