import React, { useState, useEffect, useRef } from 'react';
import { X, ExternalLink, Film, Paintbrush, Monitor, Eye, Search, Pencil, Trash2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import CustomPlayer from './CustomPlayer';
import { PROJECTS } from '../data/projects';
import { getOptimizedImageUrl } from '../utils/mediaOptimizer';
import Magnetic from './Magnetic';
import './PortfolioGrid.css';

const CATEGORIES = ["All", "Web Design", "Graphic Design", "Video Editing"];
const BATCH_SIZE = 6;

export default function PortfolioGrid() {
  const [projectsList, setProjectsList] = useState(() => {
    try {
      const db = localStorage.getItem('portfolio_projects_db');
      if (!db) {
        localStorage.setItem('portfolio_projects_db', JSON.stringify(PROJECTS));
        return PROJECTS;
      }
      return JSON.parse(db);
    } catch (e) {
      console.warn("Failed to load projects database from localStorage:", e);
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

  const [activeFilter, setActiveFilter] = useState("All");
  const [activeSubFilter, setActiveSubFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Sync admin state on mount
  useEffect(() => {
    const loggedIn = sessionStorage.getItem('portfolio_admin_logged_in') === 'true';
    setIsAdmin(loggedIn);
  }, []);

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
      // Search match (name, subcategory, tools)
      const matchesSearch = 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const observerTargetRef = useRef(null);

  // Intersection Observer for Infinite Scroll
  useEffect(() => {
    const target = observerTargetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount(prev => {
            if (prev < filteredProjects.length) {
              return prev + BATCH_SIZE;
            }
            return prev;
          });
        }
      },
      {
        root: null,
        rootMargin: '150px',
        threshold: 0.1
      }
    );

    observer.observe(target);
    return () => {
      if (target) observer.unobserve(target);
    };
  }, [filteredProjects.length]);

  // 2. Dynamic Count Calculations
  const getCategoryCount = (category) => {
    return projectsList.filter(project => {
      const matchesSearch = 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      p.subcategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tools.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
    ));
    
    const uniqueSubs = [...new Set(matches.map(p => p.subcategory))];
    return uniqueSubs.length > 0 ? ["All", ...uniqueSubs] : [];
  };

  const subCategories = getSubcategories();



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

  const handleDeleteProject = (id, e) => {
    if (e) e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this project?")) {
      const updated = projectsList.filter(p => p.id !== id);
      setProjectsList(updated);
      localStorage.setItem('portfolio_projects_db', JSON.stringify(updated));
    }
  };

  const handleEditProject = (id, e) => {
    if (e) e.stopPropagation();
    sessionStorage.setItem('portfolio_edit_project_id', id);
    window.location.hash = '#/admin';
  };

  const displayedProjects = filteredProjects.slice(0, visibleCount);

  return (
    <section id="work" className="portfolio-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Selected Work</h2>
          <p className="section-subtitle">
            Explore a curated selection of corporate web development, graphic assets, and video showreels.
          </p>
        </motion.div>

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
            <Magnetic key={category}>
              <button
                className={`filter-btn ${activeFilter === category ? 'active' : ''}`}
                onClick={() => setActiveFilter(category)}
              >
                {category} <span className="filter-count">({getCategoryCount(category)})</span>
              </button>
            </Magnetic>
          ))}
        </div>

        {/* Secondary Sub-category Pills */}
        {activeFilter !== "All" && subCategories.length > 1 && (
          <div className="sub-filter-tabs fade-in">
            {subCategories.map(subCat => (
              <Magnetic key={subCat}>
                <button
                  className={`sub-filter-pill ${activeSubFilter === subCat ? 'active' : ''}`}
                  onClick={() => setActiveSubFilter(subCat)}
                >
                  {subCat}
                </button>
              </Magnetic>
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
                  data-cursor={project.category === "Video Editing" ? "play" : "view"}
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

        {/* Infinite Scroll Sentinel element */}
        {filteredProjects.length > visibleCount && (
          <div ref={observerTargetRef} className="infinite-scroll-sentinel">
            <div className="infinite-scroll-loader">
              <Loader2 className="animate-spin" size={20} />
              <span>Loading more projects...</span>
            </div>
          </div>
        )}
      </div>

      {/* Premium Media Lightbox Modal */}
      {selectedProject && (
        <div className="modal-overlay media-lightbox-overlay" onClick={closeProject}>
          <button className="lightbox-close-btn" onClick={closeProject} aria-label="Close lightbox">
            <X size={24} />
          </button>

          <div className="lightbox-content-container" onClick={(e) => e.stopPropagation()}>
            {selectedProject.category === "Video Editing" && (
              <div className="lightbox-video-wrapper">
                <CustomPlayer
                  videoSrc={selectedProject.videoUrl}
                  posterSrc={selectedProject.poster}
                />
              </div>
            )}

            {selectedProject.category === "Graphic Design" && (
              <div className="lightbox-gallery-scroll">
                {Array.isArray(selectedProject.gallery) && selectedProject.gallery.length > 0 ? (
                  selectedProject.gallery.map((imgUrl, index) => (
                    <LazyLoadImage
                      key={index}
                      src={getOptimizedImageUrl(imgUrl, 1600)}
                      alt={`${selectedProject.title} - Full Preview ${index + 1}`}
                      className="lightbox-image"
                      effect="blur"
                    />
                  ))
                ) : (
                  <LazyLoadImage
                    src={getOptimizedImageUrl(selectedProject.mainImage || selectedProject.thumbnail, 1600)}
                    alt={selectedProject.title}
                    className="lightbox-image"
                    effect="blur"
                  />
                )}
              </div>
            )}

            {selectedProject.category === "Web Design" && (
              <div className="lightbox-single-scroll">
                <LazyLoadImage
                  src={getOptimizedImageUrl(selectedProject.mainImage || selectedProject.thumbnail, 1600)}
                  alt={selectedProject.title}
                  className="lightbox-image"
                  effect="blur"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
