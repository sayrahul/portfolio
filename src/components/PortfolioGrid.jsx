import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Film, Paintbrush, Monitor, Eye, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import CustomPlayer from './CustomPlayer';
import BeforeAfterSlider from './BeforeAfterSlider';
import { PROJECTS } from '../data/projects';
import { getOptimizedImageUrl } from '../utils/mediaOptimizer';
import './PortfolioGrid.css';

const CATEGORIES = ["All", "Web Design", "Graphic Design", "Video Editing"];
const BATCH_SIZE = 6;

export default function PortfolioGrid() {
  const [projectsList, setProjectsList] = useState(() => {
    try {
      const localProjects = JSON.parse(localStorage.getItem('custom_portfolio_projects') || '[]');
      return [...PROJECTS, ...localProjects];
    } catch (e) {
      console.warn("Failed to load custom projects from localStorage:", e);
      return PROJECTS;
    }
  });

  const [activeFilter, setActiveFilter] = useState("All");
  const [activeSubFilter, setActiveSubFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [selectedProject, setSelectedProject] = useState(null);

  // Reset pagination count and sub-filters when major filters or search changes
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [activeFilter, activeSubFilter, searchTerm]);

  useEffect(() => {
    setActiveSubFilter("All");
  }, [activeFilter]);

  const getIcon = (type) => {
    switch (type) {
      case "web": return <Monitor size={16} />;
      case "design": return <Paintbrush size={16} />;
      case "video": return <Film size={16} />;
      default: return <Monitor size={16} />;
    }
  };

  // 1. Get dynamically filtered list of projects
  const getFilteredProjects = () => {
    return projectsList.filter(project => {
      // Search match
      const matchesSearch = 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.subcategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tools.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

      // Major Category match
      const matchesCategory = activeFilter === "All" || project.category === activeFilter;

      // Sub-category match
      const matchesSubCategory = activeSubFilter === "All" || project.subcategory === activeSubFilter;

      return matchesSearch && matchesCategory && matchesSubCategory;
    });
  };

  const filteredProjects = getFilteredProjects();

  // 2. Dynamic Count Calculations
  const getCategoryCount = (category) => {
    return projectsList.filter(project => {
      const matchesSearch = 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.subcategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tools.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = category === "All" || project.category === category;
      return matchesSearch && matchesCategory;
    }).length;
  };

  // 3. Dynamic Sub-categories list
  const getSubcategories = () => {
    if (activeFilter === "All") return [];
    
    const matches = projectsList.filter(p => p.category === activeFilter && (
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tools.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
    ));
    
    const uniqueSubs = [...new Set(matches.map(p => p.subcategory))];
    return uniqueSubs.length > 0 ? ["All", ...uniqueSubs] : [];
  };

  const subCategories = getSubcategories();

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + BATCH_SIZE);
  };

  const openProject = (project) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden';
  };

  const closeProject = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'unset';
  };

  const handleTagClick = (tag, e) => {
    if (e) e.stopPropagation();
    setSearchTerm(tag);
    closeProject();
  };

  const displayedProjects = filteredProjects.slice(0, visibleCount);

  return (
    <section id="work" className="portfolio-section">
      <div className="container">
        <h2 className="section-title">Selected Work</h2>
        <p className="section-subtitle">
          Explore a curated selection of corporate web development, graphic assets, and video showreels.
        </p>

        {/* Interactive Search Console */}
        <div className="search-bar-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="portfolio-search-input"
            placeholder="Search projects by name, description, or tools used (e.g. Figma, React, Photoshop)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search-btn" onClick={() => setSearchTerm("")}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Major Category Filters */}
        <div className="filter-tabs">
          {CATEGORIES.map(category => (
            <button
              key={category}
              className={`filter-btn ${activeFilter === category ? 'active' : ''}`}
              onClick={() => setActiveFilter(category)}
            >
              {category} <span className="filter-count">({getCategoryCount(category)})</span>
            </button>
          ))}
        </div>

        {/* Secondary Sub-category Pills */}
        {activeFilter !== "All" && subCategories.length > 1 && (
          <div className="sub-filter-tabs fade-in">
            {subCategories.map(subCat => (
              <button
                key={subCat}
                className={`sub-filter-pill ${activeSubFilter === subCat ? 'active' : ''}`}
                onClick={() => setActiveSubFilter(subCat)}
              >
                {subCat}
              </button>
            ))}
          </div>
        )}

        {/* Search Results Summary */}
        {searchTerm && (
          <div className="search-results-summary fade-in">
            Found {filteredProjects.length} matching project{filteredProjects.length === 1 ? '' : 's'} for "{searchTerm}"
          </div>
        )}

        {/* Projects Grid with Framer Motion Layout animations */}
        {displayedProjects.length > 0 ? (
          <motion.div layout className="projects-grid grid-3">
            <AnimatePresence mode="popLayout">
              {displayedProjects.map(project => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  key={project.id}
                  className="project-card card"
                  onClick={() => openProject(project)}
                >
                  <div className="project-thumbnail-wrapper">
                    {/* Lazy Loaded Image with blur effect */}
                    <div style={{ width: '100%', height: '100%', display: 'block' }}>
                      <LazyLoadImage
                        src={getOptimizedImageUrl(project.thumbnail, 600)}
                        alt={project.title}
                        className="project-thumbnail-img"
                        effect="blur"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    
                    {/* Category Badge overlay */}
                    <div className="project-category-badge">
                      {getIcon(project.iconType)}
                      <span>{project.subcategory}</span>
                    </div>

                    {/* INTERACTIVE HOVER OVERLAY */}
                    <div className="project-card-overlay">
                      <div className="overlay-content">
                        <p className="overlay-desc">{project.shortDescription}</p>
                        <div className="overlay-tools-list">
                          {project.tools.slice(0, 3).map((tool, index) => (
                            <span 
                              key={index} 
                              className="overlay-tool-tag clickable"
                              onClick={(e) => handleTagClick(tool, e)}
                            >
                              {tool}
                            </span>
                          ))}
                          {project.tools.length > 3 && <span className="overlay-tool-tag">+{project.tools.length - 3} more</span>}
                        </div>
                        <span className="btn btn-primary overlay-btn">
                          View Project <Eye size={14} style={{ marginLeft: '4px' }} />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Minimalist Title Banner below Card */}
                  <div className="project-title-banner">
                    <h3 className="project-title-text">{project.title}</h3>
                    <span className="project-category-text">{project.category} &bull; {project.subcategory}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Empty State */
          <div className="portfolio-empty-state card fade-in">
            <h3>No Projects Found</h3>
            <p>We couldn't find any projects matching your current filter or search query. Try clearing filters or search terms.</p>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setSearchTerm("");
                setActiveFilter("All");
              }}
            >
              Reset Search & Filters
            </button>
          </div>
        )}

        {/* Pagination Trigger (Load More) */}
        {filteredProjects.length > visibleCount && (
          <div className="load-more-container fade-in">
            <button className="btn btn-secondary load-more-btn" onClick={handleLoadMore}>
              Load More Projects ({filteredProjects.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>

      {/* Modal Detailed Overlay */}
      {selectedProject && (
        <div className="modal-overlay" onClick={closeProject}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeProject} aria-label="Close modal">
              <X size={20} />
            </button>

            <div className="modal-body-layout">
              {/* Media Section */}
              <div className="modal-media-container">
                {selectedProject.category === "Video Editing" && (
                  <CustomPlayer
                    videoSrc={selectedProject.videoUrl}
                    posterSrc={selectedProject.poster}
                  />
                )}

                {selectedProject.category === "Graphic Design" && (
                  <div className="modal-slider-box">
                    <BeforeAfterSlider
                      beforeImage={selectedProject.beforeImage}
                      afterImage={selectedProject.afterImage}
                      beforeLabel="Original RAW"
                      afterLabel="Color Graded & Edited"
                    />
                    <p className="slider-instructions">Drag the divider to compare the original and retouched assets.</p>
                  </div>
                )}

                {selectedProject.category === "Web Design" && (
                  <div className="modal-browser-preview">
                    <div className="preview-browser-bar">
                      <span className="preview-dot dot-red"></span>
                      <span className="preview-dot dot-yellow"></span>
                      <span className="preview-dot dot-green"></span>
                    </div>
                    <LazyLoadImage
                      src={getOptimizedImageUrl(selectedProject.thumbnail, 1200)}
                      alt={selectedProject.title}
                      className="browser-preview-img"
                      effect="blur"
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                  </div>
                )}
              </div>

              {/* Text Information Section */}
              <div className="modal-info-container">
                <span className="badge modal-badge">{selectedProject.subcategory}</span>
                <h2 className="modal-project-title">{selectedProject.title}</h2>
                <p className="modal-project-details">{selectedProject.details}</p>

                <div className="modal-tools-section">
                  <h4 className="tools-title">Tools & Frameworks</h4>
                  <div className="tools-list">
                    {selectedProject.tools.map((tool, idx) => (
                      <span 
                        key={idx} 
                        className="tool-tag clickable"
                        onClick={(e) => handleTagClick(tool, e)}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary modal-action-btn"
                  >
                    Launch Live Site <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
