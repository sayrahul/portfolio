// ========================================
// PROVENTURE PORTFOLIO - CLEAN VERSION
// ========================================

// Ensure portfolioProjects is defined even if data/projects.js fails to load
window.portfolioProjects = window.portfolioProjects || [];

// ========== THEME TOGGLE ==========
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const mobileThemeToggleBtn = document.getElementById('mobileThemeToggleBtn');

// Check saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

function toggleTheme() {
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
}

themeToggle?.addEventListener('click', toggleTheme);
mobileThemeToggleBtn?.addEventListener('click', toggleTheme);

function updateThemeIcon(theme) {
  const iconClass = theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  if (themeToggle) {
    const icon = themeToggle.querySelector('i');
    if (icon) icon.className = iconClass;
  }
  if (mobileThemeToggleBtn) {
    const icon = mobileThemeToggleBtn.querySelector('i');
    if (icon) icon.className = iconClass;
  }
}

// ========== SEARCH FUNCTIONALITY ==========
const searchInput = document.getElementById('searchInput');
const mobileSearchInput = document.getElementById('mobileSearchInput');
const mobileSearchToggle = document.getElementById('mobileSearchToggle');
const mobileSearchExpand = document.getElementById('mobileSearchExpand');
const searchClearBtn = document.getElementById('searchClearBtn');
const mobileSearchClearBtn = document.getElementById('mobileSearchClearBtn');
const mobileSearchNavBtn = document.getElementById('mobileSearchNavBtn');
const mobileHomeBtn = document.getElementById('mobileHomeBtn');

let searchTimeout;
let currentSearchQuery = '';

function updateSearchQuery(query) {
  currentSearchQuery = query.toLowerCase().trim();
  
  // Sync desktop and mobile inputs
  if (searchInput && searchInput.value !== query) searchInput.value = query;
  if (mobileSearchInput && mobileSearchInput.value !== query) mobileSearchInput.value = query;

  // Toggle clear buttons visibility
  const showClear = query.length > 0;
  if (searchClearBtn) searchClearBtn.style.display = showClear ? 'flex' : 'none';
  if (mobileSearchClearBtn) mobileSearchClearBtn.style.display = showClear ? 'flex' : 'none';

  renderPortfolio();
}

function handleSearchInput(e) {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    updateSearchQuery(e.target.value);
  }, 150);
}

searchInput?.addEventListener('input', handleSearchInput);
mobileSearchInput?.addEventListener('input', handleSearchInput);

searchClearBtn?.addEventListener('click', () => updateSearchQuery(''));
mobileSearchClearBtn?.addEventListener('click', () => updateSearchQuery(''));

// Mobile Search Bar Toggle
mobileSearchToggle?.addEventListener('click', () => {
  if (mobileSearchExpand) {
    mobileSearchExpand.classList.toggle('active');
    if (mobileSearchExpand.classList.contains('active')) {
      mobileSearchInput?.focus();
    }
  }
});

// Mobile Bottom Nav Search Button
mobileSearchNavBtn?.addEventListener('click', () => {
  if (mobileSearchExpand) {
    mobileSearchExpand.classList.add('active');
    mobileSearchInput?.focus();
  }
  const grid = document.getElementById('portfolioGrid');
  if (grid) {
    grid.scrollIntoView({ behavior: 'smooth' });
  }
});

// Mobile Bottom Nav Home Button
mobileHomeBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

function getFilteredProjects() {
  return portfolioProjects.filter(p => {
    const matchCategory = currentFilter === 'all' || p.category === currentFilter;
    const title = p.title?.toLowerCase() || '';
    const desc = p.description?.toLowerCase() || '';
    const cat = p.category?.toLowerCase() || '';
    const matchSearch = !currentSearchQuery || 
                        title.includes(currentSearchQuery) || 
                        desc.includes(currentSearchQuery) || 
                        cat.includes(currentSearchQuery);
    return matchCategory && matchSearch;
  });
}

// ========== FILTER TABS ==========
const filterTabs = document.querySelectorAll('.filter-tab');
const portfolioGrid = document.getElementById('portfolioGrid');
let currentFilter = 'all';

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentFilter = tab.dataset.filter;
    
    // Auto scroll active tab into view on mobile
    tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    
    renderPortfolio();
  });
});

// ========== RENDER PORTFOLIO (AUTO-LOAD ALL MEDIA) ==========
function renderPortfolio() {
  const scrollLoader = document.getElementById('scrollLoader');
  portfolioGrid.innerHTML = '';
  
  let filteredProjects = getFilteredProjects();

  if (filteredProjects.length === 0) {
    if (scrollLoader) scrollLoader.classList.remove('active');
    portfolioGrid.innerHTML = `
      <div class="empty-status" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-secondary);">
        <p>No projects found in this section.</p>
      </div>
    `;
    return;
  }

  // Auto load ALL items immediately
  filteredProjects.forEach((project, index) => {
    const item = document.createElement('div');
    item.className = 'portfolio-item';
    item.dataset.index = index;
    item.dataset.title = project.title || '';
    item.dataset.desc = project.description || '';
    item.dataset.category = project.category || '';
    
    // Security: Safely construct DOM elements to prevent XSS
    let mediaNode;
    if (project.type === 'video') {
      mediaNode = document.createElement('video');
      mediaNode.src = project.url || '';
      mediaNode.muted = true;
      mediaNode.loop = true;
      mediaNode.playsInline = true;
    } else {
      mediaNode = document.createElement('img');
      mediaNode.src = project.url || '';
      mediaNode.alt = project.title || 'Project image';
      mediaNode.setAttribute('loading', 'lazy');
    }

    const overlay = document.createElement('div');
    overlay.className = 'portfolio-overlay';
    overlay.innerHTML = `
      <div class="overlay-stat"><i class="fa-solid fa-heart"></i><span>${Math.floor(Math.random() * 500) + 50}</span></div>
      <div class="overlay-stat"><i class="fa-solid fa-comment"></i><span>${Math.floor(Math.random() * 50) + 5}</span></div>
    `;

    item.appendChild(mediaNode);
    item.appendChild(overlay);

    if (project.type === 'video') {
      const badge = document.createElement('div');
      badge.className = 'portfolio-badge';
      badge.innerHTML = '<i class="fa-solid fa-play"></i> Video';
      item.appendChild(badge);
    }
    
    item.addEventListener('click', () => openLightbox(index, filteredProjects));
    
    if (project.type === 'video') {
      item.addEventListener('mouseenter', () => mediaNode.play().catch(() => {}));
      item.addEventListener('mouseleave', () => {
        mediaNode.pause();
        mediaNode.currentTime = 0;
      });
    }
    
    portfolioGrid.appendChild(item);
  });
  
  // Hide loading spinner once all photos/videos are rendered
  if (scrollLoader) {
    scrollLoader.classList.remove('active');
  }

  if (typeof observeElements === 'function') {
    observeElements();
  }
}

// ========== LIGHTBOX ==========
const lightbox = document.getElementById('lightbox');
const lightboxOverlay = document.getElementById('lightboxOverlay');
const lightboxMedia = document.getElementById('lightboxMedia');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxDesc = document.getElementById('lightboxDesc');
const lightboxCategory = document.getElementById('lightboxCategory');
const lightboxType = document.getElementById('lightboxType');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentLightboxIndex = 0;
let currentLightboxProjects = [];

function openLightbox(index, projects) {
  currentLightboxIndex = index;
  currentLightboxProjects = projects;
  updateLightbox();
  lightbox.classList.add('active');
  document.body.classList.add('no-scroll');
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.classList.remove('no-scroll');
  
  // Stop video if playing
  const video = lightboxMedia?.querySelector('video');
  if (video) {
    video.pause();
    video.currentTime = 0;
  }
}

// State persistence for Likes & Bookmarks
const getLikedProjects = () => JSON.parse(localStorage.getItem('liked_projects') || '[]');
const getBookmarkedProjects = () => JSON.parse(localStorage.getItem('bookmarked_projects') || '[]');

function updateLightbox() {
  const project = currentLightboxProjects[currentLightboxIndex];
  if (!project) return;

  lightboxMedia.innerHTML = '';
  if (project.type === 'video') {
    const video = document.createElement('video');
    video.src = project.url || '';
    video.controls = true;
    video.autoplay = true;
    video.loop = true;
    lightboxMedia.appendChild(video);
  } else {
    const img = document.createElement('img');
    img.src = project.url || '';
    img.alt = project.title || 'Project image';
    lightboxMedia.appendChild(img);
  }
  
  lightboxTitle.textContent = project.title || '';
  lightboxDesc.textContent = project.description || '';
  lightboxCategory.textContent = project.category || '';
  lightboxType.textContent = project.type || '';

  // Update Action Buttons States
  const likedProjects = getLikedProjects();
  const bookmarkedProjects = getBookmarkedProjects();
  const projectId = project.title + '_' + project.url;

  const likeBtn = lightbox?.querySelector('.action-btn:nth-child(1)');
  const bookmarkBtn = lightbox?.querySelector('.action-btn:nth-child(2)');

  if (likeBtn) {
    const isLiked = likedProjects.includes(projectId);
    likeBtn.innerHTML = isLiked ? '<i class="fa-solid fa-heart" style="color: #ef4444;"></i>' : '<i class="fa-regular fa-heart"></i>';
    likeBtn.onclick = () => toggleLike(projectId, likeBtn);
  }

  if (bookmarkBtn) {
    const isBookmarked = bookmarkedProjects.includes(projectId);
    bookmarkBtn.innerHTML = isBookmarked ? '<i class="fa-solid fa-bookmark" style="color: #00AEEF;"></i>' : '<i class="fa-regular fa-bookmark"></i>';
    bookmarkBtn.onclick = () => toggleBookmark(projectId, bookmarkBtn);
  }

  const shareBtn = lightbox?.querySelector('.action-btn:nth-child(3)');
  if (shareBtn) {
    shareBtn.onclick = () => handleShare(project);
  }
}

function toggleLike(projectId, btn) {
  let liked = getLikedProjects();
  if (liked.includes(projectId)) {
    liked = liked.filter(id => id !== projectId);
    btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
  } else {
    liked.push(projectId);
    btn.innerHTML = '<i class="fa-solid fa-heart" style="color: #ef4444;"></i>';
  }
  localStorage.setItem('liked_projects', JSON.stringify(liked));
}

function toggleBookmark(projectId, btn) {
  let bookmarked = getBookmarkedProjects();
  if (bookmarked.includes(projectId)) {
    bookmarked = bookmarked.filter(id => id !== projectId);
    btn.innerHTML = '<i class="fa-regular fa-bookmark"></i>';
  } else {
    bookmarked.push(projectId);
    btn.innerHTML = '<i class="fa-solid fa-bookmark" style="color: #00AEEF;"></i>';
  }
  localStorage.setItem('bookmarked_projects', JSON.stringify(bookmarked));
}

async function handleShare(project) {
  const shareData = {
    title: project.title || 'ProVenture Portfolio Project',
    text: project.description || 'Check out this work by ProVenture Digital Agency',
    url: window.location.href
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      console.log('Share canceled');
    }
  } else {
    try {
      await navigator.clipboard.writeText(shareData.url);
      alert('Link copied to clipboard!');
    } catch (err) {
      alert('Unable to copy link.');
    }
  }
}

function nextLightbox() {
  if (currentLightboxProjects.length === 0) return;
  currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxProjects.length;
  updateLightbox();
}

function prevLightbox() {
  if (currentLightboxProjects.length === 0) return;
  currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxProjects.length) % currentLightboxProjects.length;
  updateLightbox();
}

// Touch Swipe Navigation for Lightbox Modal
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

lightbox?.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

lightbox?.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  touchEndY = e.changedTouches[0].screenY;
  handleLightboxSwipe();
}, { passive: true });

function handleLightboxSwipe() {
  const diffX = touchEndX - touchStartX;
  const diffY = touchEndY - touchStartY;
  
  // Horizontal Swipe (min threshold 50px)
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
    if (diffX < 0) {
      nextLightbox(); // Swipe Left -> Next
    } else {
      prevLightbox(); // Swipe Right -> Prev
    }
  }
}

lightboxClose?.addEventListener('click', closeLightbox);
lightboxOverlay?.addEventListener('click', closeLightbox);
lightboxNext?.addEventListener('click', nextLightbox);
lightboxPrev?.addEventListener('click', prevLightbox);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!lightbox?.classList.contains('active')) return;
  
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') nextLightbox();
  if (e.key === 'ArrowLeft') prevLightbox();
});

// ========== LAZY LOADING ==========
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        imageObserver.unobserve(img);
      }
    });
  });

  window.observeElements = () => {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      imageObserver.observe(img);
    });
  };
}

// ========== INITIALIZE ==========
document.addEventListener('DOMContentLoaded', async () => {
  try {
    if (window.initGoogleSheets) {
      const sheetProjects = await initGoogleSheets();
      
      if (sheetProjects && sheetProjects.length > 0) {
        portfolioProjects.length = 0;
        portfolioProjects.push(...sheetProjects);
      }
    }
  } catch (err) {
    console.error('Initialization error:', err);
  } finally {
    renderPortfolio();
  }
});
