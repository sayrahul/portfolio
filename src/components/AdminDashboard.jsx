import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Upload, Trash2, Copy, Check, Settings, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { PROJECTS } from '../data/projects';
import './AdminDashboard.css';

export default function AdminDashboard() {
  // Cloudinary Settings
  const [cloudName, setCloudName] = useState(() => localStorage.getItem('cloudinary_cloud_name') || 'dno3fddh9');
  const [uploadPreset, setUploadPreset] = useState(() => localStorage.getItem('cloudinary_upload_preset') || 'uzxyc123');
  const [showSettings, setShowSettings] = useState(false);

  // Custom Projects List
  const [customProjects, setCustomProjects] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('custom_portfolio_projects') || '[]');
    } catch (e) {
      return [];
    }
  });

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
    setSuccessMsg('Settings saved successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Direct Cloudinary Upload via API Fetch
  const handleUploadFile = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!cloudName || !uploadPreset) {
      alert("Please configure your Cloudinary Cloud Name and Upload Preset in the Settings panel first!");
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
        throw new Error("Upload failed. Verify settings and preset type.");
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
      alert("Direct upload failed. Make sure your upload preset is configured as 'Unsigned' in your Cloudinary Dashboard under Settings -> Upload.");
    } finally {
      setUploadingField(null);
    }
  };

  // Add Project
  const handleAddProject = (e) => {
    e.preventDefault();
    if (!title || !subcategory || !shortDesc) {
      alert("Please fill out all required fields.");
      return;
    }

    // Determine icon type based on category
    let iconType = 'web';
    if (category === 'Graphic Design') iconType = 'design';
    else if (category === 'Video Editing') iconType = 'video';

    const newProj = {
      id: `${category.toLowerCase().replace(' ', '-')}-${Date.now()}`,
      title,
      category,
      subcategory,
      shortDescription: shortDesc,
      details,
      tools: toolsInput.split(',').map(t => t.trim()).filter(t => t !== ''),
      iconType,
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800'
    };

    // Append category-specific parameters
    if (category === 'Web Design') {
      if (liveUrl) newProj.liveUrl = liveUrl;
    } else if (category === 'Graphic Design') {
      if (beforeImage) newProj.beforeImage = beforeImage;
      if (afterImage) newProj.afterImage = afterImage;
    } else if (category === 'Video Editing') {
      if (videoUrl) newProj.videoUrl = videoUrl;
      if (poster) newProj.poster = poster;
    }

    const updatedList = [...customProjects, newProj];
    setCustomProjects(updatedList);
    localStorage.setItem('custom_portfolio_projects', JSON.stringify(updatedList));

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

    setSuccessMsg('Project added to local sandbox!');
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  // Delete Custom Project
  const handleDeleteProject = (id) => {
    const updatedList = customProjects.filter(p => p.id !== id);
    setCustomProjects(updatedList);
    localStorage.setItem('custom_portfolio_projects', JSON.stringify(updatedList));
  };

  // Reset Sandbox
  const handleResetSandbox = () => {
    if (window.confirm("Are you sure you want to delete all custom sandbox projects? This cannot be undone.")) {
      setCustomProjects([]);
      localStorage.removeItem('custom_portfolio_projects');
    }
  };

  // Copy updated code to clipboard
  const handleCopyCode = () => {
    const allProjects = [...PROJECTS, ...customProjects];
    const generatedJs = `/**
 * Portfolio Projects Data Module
 * (Generated from Admin Dashboard)
 */

export const PROJECTS = ${JSON.stringify(allProjects, null, 2)};
`;
    navigator.clipboard.writeText(generatedJs);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const codePreviewContent = () => {
    const allProjects = [...PROJECTS, ...customProjects];
    return `export const PROJECTS = ${JSON.stringify(allProjects, null, 2)};`;
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
          {customProjects.length > 0 && (
            <button onClick={handleResetSandbox} className="btn btn-secondary btn-danger">
              Reset Sandbox
            </button>
          )}
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

          {/* Add Project Form */}
          <div className="admin-form-card card">
            <h2 className="admin-card-title">Add New Project</h2>
            <form onSubmit={handleAddProject} className="admin-form">
              
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

              <button type="submit" className="btn btn-primary form-submit-btn">
                Add Project to Sandbox <Save size={16} style={{ marginLeft: '6px' }} />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Code Exporter & Sandbox Management */}
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
              Whenever you're ready to deploy to production and GitHub permanently, copy this code and overwrite the entire contents of your <strong>src/data/projects.js</strong> file!
            </p>
            <div className="code-editor-pre">
              <pre><code>{codePreviewContent()}</code></pre>
            </div>
          </div>

          {/* Sandbox Custom Projects manager */}
          <div className="admin-manage-card card">
            <h3 className="admin-card-title">Sandbox Projects ({customProjects.length})</h3>
            {customProjects.length === 0 ? (
              <div className="no-sandbox-msg">
                <AlertCircle size={28} className="placeholder-icon" />
                <p>No sandbox projects added yet. Use the builder form to construct items.</p>
              </div>
            ) : (
              <div className="sandbox-items-list">
                {customProjects.map(proj => (
                  <div key={proj.id} className="sandbox-item-row">
                    <img src={proj.thumbnail} alt={proj.title} className="sandbox-item-thumb" />
                    <div className="sandbox-item-info">
                      <span className="sandbox-item-title">{proj.title}</span>
                      <span className="sandbox-item-cat">{proj.category} &bull; {proj.subcategory}</span>
                    </div>
                    <button 
                      onClick={() => handleDeleteProject(proj.id)} 
                      className="sandbox-delete-btn"
                      title="Delete project"
                    >
                      <Trash2 size={14} />
                    </button>
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
