import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Upload, Trash2, Copy, Check, Settings, Sparkles, RefreshCw, AlertCircle, Pencil, X } from 'lucide-react';
import { PROJECTS } from '../data/projects';
import './AdminDashboard.css';

export default function AdminDashboard() {
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
  const [shortDesc, setShortDesc] = useState('');
  const [details, setDetails] = useState('');
  const [toolsInput, setToolsInput] = useState('');
  
  // Media States
  const [thumbnail, setThumbnail] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [beforeImage, setBeforeImage] = useState('');
  const [afterImage, setAfterImage] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [poster, setPoster] = useState('');

  // UI status
  const [uploadingField, setUploadingField] = useState(null); // 'thumbnail', 'beforeImage', etc.
  const [copiedCode, setCopiedCode] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

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
      alert("Direct upload failed. Make sure your upload preset is configured as 'Unsigned' in your Cloudinary Dashboard Settings.");
    } finally {
      setUploadingField(null);
    }
  };

  // Enter Edit Mode
  const handleEditClick = (project) => {
    setEditingProjectId(project.id);
    setTitle(project.title);
    setCategory(project.category);
    setSubcategory(project.subcategory);
    setShortDesc(project.shortDescription);
    setDetails(project.details || '');
    setToolsInput(project.tools ? project.tools.join(', ') : '');
    setThumbnail(project.thumbnail || '');
    
    // Set specific fields
    setLiveUrl(project.liveUrl || '');
    setBeforeImage(project.beforeImage || '');
    setAfterImage(project.afterImage || '');
    setVideoUrl(project.videoUrl || '');
    setPoster(project.poster || '');

    // Scroll form card into view
    const formElement = document.querySelector('.admin-form-card');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Cancel Editing
  const handleCancelEdit = () => {
    setEditingProjectId(null);
    setTitle('');
    setSubcategory('');
    setShortDesc('');
    setDetails('');
    setToolsInput('');
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
    if (!title || !subcategory || !shortDesc) {
      alert("Please fill out all required fields.");
      return;
    }

    let iconType = 'web';
    if (category === 'Graphic Design') iconType = 'design';
    else if (category === 'Video Editing') iconType = 'video';

    const projectData = {
      title,
      category,
      subcategory,
      shortDescription: shortDesc,
      details,
      tools: toolsInput.split(',').map(t => t.trim()).filter(t => t !== ''),
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
          // Keep the original id, replace other details
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
      setSuccessMsg('New project added to database!');
    }

    setProjectsList(updatedList);
    localStorage.setItem('portfolio_projects_db', JSON.stringify(updatedList));

    // Clear form fields
    setTitle('');
    setSubcategory('');
    setShortDesc('');
    setDetails('');
    setToolsInput('');
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
    if (window.confirm("Are you sure you want to restore the default projects? This will overwrite all custom updates, additions, and deletions.")) {
      setProjectsList(PROJECTS);
      localStorage.setItem('portfolio_projects_db', JSON.stringify(PROJECTS));
      handleCancelEdit();
      setSuccessMsg('System default projects restored!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  // Copy updated code to clipboard
  const handleCopyCode = () => {
    const generatedJs = `/**
 * Portfolio Projects Data Module
 * (Generated from Admin Dashboard)
 */

export const PROJECTS = ${JSON.stringify(projectsList, null, 2)};
`;
    navigator.clipboard.writeText(generatedJs);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const codePreviewContent = () => {
    return `export const PROJECTS = ${JSON.stringify(projectsList, null, 2)};`;
  };

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
          <button onClick={handleRestoreDefaults} className="btn btn-secondary btn-danger">
            Restore Defaults
          </button>
        </div>
      </div>

      <div className="admin-grid container">
        
        {/* Left Column: Forms */}
        <div className="admin-form-column">
          {successMsg && (
            <div className="alert alert-success fade-in">
              <Sparkles size={16} />
              <span>{successMsg}</span>
            </div>
          )}

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

              <div className="form-row grid-2">
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
                <div className="form-group">
                  <label className="form-label">Tools Used (comma separated) *</label>
                  <input 
                    type="text" 
                    value={toolsInput} 
                    onChange={e => setToolsInput(e.target.value)} 
                    placeholder="e.g. React, Photoshop, Figma"
                    className="form-input" 
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Short Description (Hover card overview) *</label>
                <input 
                  type="text" 
                  value={shortDesc} 
                  onChange={e => setShortDesc(e.target.value)} 
                  placeholder="Keep it concise for grid displays..."
                  className="form-input" 
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Details (Full modal story)</label>
                <textarea 
                  value={details} 
                  onChange={e => setDetails(e.target.value)} 
                  placeholder="Explain project details, requirements, challenges..."
                  rows="3"
                  className="form-input form-textarea"
                />
              </div>

              <div className="form-group">
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
        </div>

        {/* Right Column: Code Exporter & Database Management */}
        <div className="admin-sidebar-column">
          
          {/* Exporter Block */}
          <div className="admin-export-card card">
            <div className="export-header">
              <h3 className="admin-card-title" style={{ marginBottom: 0 }}>Export database</h3>
              <button 
                onClick={handleCopyCode} 
                className={`btn btn-secondary ${copiedCode ? 'active-copy' : ''}`}
                title="Copy Javascript file code"
              >
                {copiedCode ? <Check size={14} className="success-copy-icon" /> : <Copy size={14} />}
                <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
            <p className="admin-card-desc" style={{ marginTop: '8px' }}>
              Whenever you make changes, click this button to copy the generated data code. Paste it to overwrite your <strong>src/data/projects.js</strong> file and commit to GitHub to deploy permanently.
            </p>
            <div className="code-editor-pre">
              <pre><code>{codePreviewContent()}</code></pre>
            </div>
          </div>

          {/* Database Projects manager */}
          <div className="admin-manage-card card">
            <h3 className="admin-card-title">Database Projects ({projectsList.length})</h3>
            {projectsList.length === 0 ? (
              <div className="no-sandbox-msg">
                <AlertCircle size={28} className="placeholder-icon" />
                <p>All projects have been deleted. Restore defaults or add new projects.</p>
              </div>
            ) : (
              <div className="sandbox-items-list">
                {projectsList.map(proj => (
                  <div key={proj.id} className="sandbox-item-row">
                    <img src={proj.thumbnail} alt={proj.title} className="sandbox-item-thumb" />
                    <div className="sandbox-item-info">
                      <span className="sandbox-item-title">{proj.title}</span>
                      <span className="sandbox-item-cat">{proj.category} &bull; {proj.subcategory}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button 
                        onClick={() => handleEditClick(proj)} 
                        className="sandbox-delete-btn"
                        style={{ color: 'var(--text-secondary)' }}
                        title="Edit project"
                      >
                        <Pencil size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProject(proj.id)} 
                        className="sandbox-delete-btn"
                        title="Delete project"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
