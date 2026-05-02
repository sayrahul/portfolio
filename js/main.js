// ========================================
// PROVENTURE PORTFOLIO - PREMIUM VERSION
// ========================================

// ========== SMOOTH SCROLL (LENIS) ==========
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// ========== THEME TOGGLE ==========
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  const icon = themeToggle.querySelector('i');
  icon.className = theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
}

// ========== SEARCH FUNCTIONALITY ==========
const searchInput = document.getElementById('searchInput');
let searchTimeout;

searchInput?.addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    const query = e.target.value.toLowerCase().trim();
    filterBySearch(query);
  }, 300);
});

function filterBySearch(query) {
  const items = document.querySelectorAll('.portfolio-item');
  
  items.forEach(item => {
    const title = item.dataset.title?.toLowerCase() || '';
    const desc = item.dataset.desc?.toLowerCase() || '';
    const category = item.dataset.category?.toLowerCase() || '';
    
    const matches = title.includes(query) || desc.includes(query) || category.includes(query);
    
    if (query === '' || matches) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}

// ========== FILTER TABS ==========
const filterTabs = document.querySelectorAll('.filter-tab');
const portfolioGrid = document.getElementById('portfolioGrid');
let currentFilter = 'all';
let displayedItems = 12;

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentFilter = tab.dataset.filter;
    displayedItems = 12;
    renderPortfolio();
  });
});

// ========== RENDER PORTFOLIO ==========
function renderPortfolio() {
  portfolioGrid.innerHTML = '';
  
  let filteredProjects = currentFilter === 'all' 
    ? portfolioProjects 
    : portfolioProjects.filter(p => p.category === currentFilter);
  
  const itemsToShow = filteredProjects.slice(0, displayedItems);
  
  itemsToShow.forEach((project, index) => {
    const item = document.createElement('div');
    item.className = 'portfolio-item';
    item.dataset.index = index;
    item.dataset.title = project.title;
    item.dataset.desc = project.description;
    item.dataset.category = project.category;
    
    const mediaElement = project.type === 'video' 
      ? `<video src="${project.url}" muted loop playsinline></video>`
      : `<img src="${project.url}" alt="${project.title}" loading="lazy" />`;
    
    const typeIcon = project.type === 'video' 
      ? '<i class="fa-solid fa-play"></i>' 
      : '';
    
    item.innerHTML = `
      ${mediaElement}
      <div class="portfolio-overlay">
        <div class="overlay-stat">
          <i class="fa-solid fa-heart"></i>
          <span>${Math.floor(Math.random() * 500) + 50}</span>
        </div>
        <div class="overlay-stat">
          <i class="fa-solid fa-comment"></i>
          <span>${Math.floor(Math.random() * 50) + 5}</span>
        </div>
      </div>
      ${project.type === 'video' ? `<div class="portfolio-badge">${typeIcon} Video</div>` : ''}
    `;
    
    item.addEventListener('click', () => openLightbox(index, filteredProjects));
    
    // Hover play video
    if (project.type === 'video') {
      const video = item.querySelector('video');
      item.addEventListener('mouseenter', () => video.play());
      item.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
      });
    }
    
    portfolioGrid.appendChild(item);
  });
  
  // Show/hide load more button
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) {
    if (displayedItems >= filteredProjects.length) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'inline-flex';
    }
  }

  // RE-INITIALIZE ANIMATIONS AND LAZY LOADING
  if (typeof observeElements === 'function') {
    observeElements();
  }
}

// ========== LOAD MORE ==========
document.getElementById('loadMoreBtn').addEventListener('click', () => {
  displayedItems += 12;
  renderPortfolio();
  
  // Smooth scroll to new items
  setTimeout(() => {
    const items = document.querySelectorAll('.portfolio-item');
    if (items.length > 12) {
      items[items.length - 12].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 100);
});

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
  const video = lightboxMedia.querySelector('video');
  if (video) {
    video.pause();
    video.currentTime = 0;
  }
}

function updateLightbox() {
  const project = currentLightboxProjects[currentLightboxIndex];
  
  const mediaElement = project.type === 'video'
    ? `<video src="${project.url}" controls autoplay loop></video>`
    : `<img src="${project.url}" alt="${project.title}" />`;
  
  lightboxMedia.innerHTML = mediaElement;
  lightboxTitle.textContent = project.title;
  lightboxDesc.textContent = project.description;
  lightboxCategory.textContent = project.category;
  lightboxType.textContent = project.type;
}

function nextLightbox() {
  currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxProjects.length;
  updateLightbox();
}

function prevLightbox() {
  currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxProjects.length) % currentLightboxProjects.length;
  updateLightbox();
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxOverlay.addEventListener('click', closeLightbox);
lightboxNext.addEventListener('click', nextLightbox);
lightboxPrev.addEventListener('click', prevLightbox);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') nextLightbox();
  if (e.key === 'ArrowLeft') prevLightbox();
});

// Touch swipe for mobile
let touchStartX = 0;
let touchEndX = 0;

lightboxMedia.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

lightboxMedia.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  if (touchEndX < touchStartX - 50) nextLightbox();
  if (touchEndX > touchStartX + 50) prevLightbox();
}

// ========== PREMIUM ANIMATIONS ==========

// 0. Custom Cursor
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
  const posX = e.clientX;
  const posY = e.clientY;

  cursorDot.style.left = `${posX}px`;
  cursorDot.style.top = `${posY}px`;

  // Outline with slight lag
  cursorOutline.animate({
    left: `${posX}px`,
    top: `${posY}px`
  }, { duration: 500, fill: "forwards" });
});

// Cursor Hover Effects
const hoverables = document.querySelectorAll('a, button, .portfolio-item, .category-btn');
hoverables.forEach(el => {
  el.addEventListener('mouseenter', () => cursorOutline.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => cursorOutline.classList.remove('cursor-hover'));
});

// 1. Magnetic Buttons
const magneticElements = document.querySelectorAll('.magnetic');

magneticElements.forEach((el) => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  });
  
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'translate(0px, 0px)';
  });
});

// 2. Parallax Logo & Grid Tilt
const parallaxLogo = document.getElementById('parallaxLogo');

document.addEventListener('mousemove', (e) => {
  const x = (window.innerWidth / 2 - e.pageX) / 30;
  const y = (window.innerHeight / 2 - e.pageY) / 30;
  
  if (parallaxLogo) {
    parallaxLogo.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  }
  
  // Subtle tilt for grid items near cursor
  const items = document.querySelectorAll('.portfolio-item:hover');
  items.forEach(item => {
    const rect = item.getBoundingClientRect();
    const ix = (rect.left + rect.width / 2 - e.clientX) / 10;
    const iy = (rect.top + rect.height / 2 - e.clientY) / 10;
    item.querySelector('.item-overlay').style.background = `radial-gradient(circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(255,255,255,0.1) 0%, transparent 80%)`;
    item.style.transform = `perspective(1000px) rotateY(${-ix}deg) rotateX(${iy}deg) scale(1.02)`;
  });
});

// 3. Scroll Reveal Observer
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, { threshold: 0.1 });

// ========== LAZY LOADING & REVEAL ==========

// Define observeElements globally so renderPortfolio can call it
function observeElements() {
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

  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    imageObserver.observe(img);
  });
  
  document.querySelectorAll('.portfolio-item').forEach(item => {
    revealObserver.observe(item);
  });
}

if ('IntersectionObserver' in window) {
  // Initial call
  setTimeout(observeElements, 100);
}

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ========== INITIALIZE ==========
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 App starting...');
  
  try {
    // Try to load from Google Sheets first
    if (window.initGoogleSheets) {
      console.log('🔄 Loading backend data...');
      const sheetProjects = await initGoogleSheets();
      
      if (sheetProjects && sheetProjects.length > 0) {
        // Replace portfolioProjects with Google Sheets data
        portfolioProjects.length = 0;
        portfolioProjects.push(...sheetProjects);
        console.log(`✅ Portfolio updated: ${sheetProjects.length} items`);
      } else {
        console.log('📦 Using fallback local data');
      }
    }
  } catch (err) {
    console.error('⚠️ Initialization error:', err);
  } finally {
    console.log('🖼️ Rendering grid...');
    renderPortfolio();
  }
  
  // Add animation delay to items
  setTimeout(() => {
    const items = document.querySelectorAll('.portfolio-item');
    items.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.05}s`;
    });
  }, 100);
});

// ========== PERFORMANCE: Debounce Resize ==========
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Recalculate if needed
  }, 250);
});
