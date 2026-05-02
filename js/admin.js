/**
 * PROVENTURE ADMIN DASHBOARD LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
  const loginOverlay = document.getElementById('loginOverlay');
  const loginBtn = document.getElementById('loginBtn');
  const adminPassword = document.getElementById('adminPassword');
  const loginError = document.getElementById('loginError');
  const dashboardUI = document.getElementById('dashboardUI');
  const adminGrid = document.getElementById('adminGrid');
  const saveAllBtn = document.getElementById('saveAllBtn');
  const syncBtn = document.getElementById('syncBtn');
  
  const ADMIN_PASS = 'ProVenture2025'; // Default password

  // ========== AUTHENTICATION ==========
  
  function checkAuth() {
    if (localStorage.getItem('adminLoggedIn') === 'true') {
      loginOverlay.style.display = 'none';
      dashboardUI.style.display = 'flex';
      loadProjects();
    }
  }

  loginBtn.addEventListener('click', () => {
    if (adminPassword.value === ADMIN_PASS) {
      localStorage.setItem('adminLoggedIn', 'true');
      loginOverlay.style.display = 'none';
      dashboardUI.style.display = 'flex';
      showToast('Welcome back, Admin!');
      loadProjects();
    } else {
      loginError.textContent = 'Invalid password. Hint: Check README';
      adminPassword.style.borderColor = '#ef4444';
    }
  });

  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('adminLoggedIn');
    location.reload();
  });

  // ========== PROJECT MANAGEMENT ==========
  
  let currentProjects = [];

  async function loadProjects() {
    adminGrid.innerHTML = `
      <div class="loading-state">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <p>Loading your portfolio data...</p>
      </div>
    `;

    try {
      // Reuse the existing loader
      const projects = await loadFromGoogleSheets();
      
      if (projects && projects.length > 0) {
        currentProjects = projects;
        renderAdminGrid(projects);
      } else {
        adminGrid.innerHTML = '<div class="loading-state"><p>No projects found. Check your Google Sheet.</p></div>';
      }
    } catch (err) {
      console.error(err);
      adminGrid.innerHTML = `<div class="loading-state"><p>Error: ${err.message}</p></div>`;
    }
  }

  function renderAdminGrid(projects) {
    adminGrid.innerHTML = '';
    
    projects.forEach((project, index) => {
      const card = document.createElement('div');
      card.className = 'admin-card';
      card.dataset.index = index;
      
      const mediaType = project.type || 'image';
      const badgeClass = mediaType === 'video' ? 'badge-video' : 'badge-image';
      
      card.innerHTML = `
        <div class="card-image">
          <img src="${project.url || project.imageUrl}" alt="Preview" />
          <div class="card-badge ${badgeClass}">${mediaType.toUpperCase()}</div>
          <button class="delete-btn" title="Delete Project">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
        <div class="card-content">
          <div class="card-field">
            <div class="field-header">
              <label>Title</label>
              <label class="switch-label">
                <input type="checkbox" class="edit-hidden" ${project.hidden ? 'checked' : ''}>
                <span class="switch-text">Hide</span>
              </label>
            </div>
            <input type="text" value="${project.title || ''}" class="edit-title" placeholder="Enter title..." />
          </div>
          <div class="card-row">
            <div class="card-field flex-1">
              <label>Category</label>
              <select class="edit-category">
                <option value="branding" ${project.category === 'branding' ? 'selected' : ''}>Branding</option>
                <option value="video" ${project.category === 'video' ? 'selected' : ''}>Video</option>
                <option value="web" ${project.category === 'web' ? 'selected' : ''}>Web Design</option>
                <option value="photo" ${project.category === 'photo' ? 'selected' : ''}>Photography</option>
                <option value="social" ${project.category === 'social' ? 'selected' : ''}>Social Media</option>
              </select>
            </div>
            <div class="card-field flex-1">
              <label>Media Type</label>
              <select class="edit-type">
                <option value="image" ${mediaType === 'image' ? 'selected' : ''}>Image</option>
                <option value="video" ${mediaType === 'video' ? 'selected' : ''}>Video</option>
              </select>
            </div>
          </div>
          <div class="card-field">
            <label>Description</label>
            <textarea class="edit-desc" placeholder="Project description...">${project.description || ''}</textarea>
          </div>
        </div>
      `;
      
      // Update badge dynamically
      const typeSelect = card.querySelector('.edit-type');
      const badge = card.querySelector('.card-badge');
      typeSelect.addEventListener('change', (e) => {
        const newType = e.target.value;
        badge.textContent = newType.toUpperCase();
        badge.className = `card-badge ${newType === 'video' ? 'badge-video' : 'badge-image'}`;
      });

      // Handle Hide Toggle Visual
      const hiddenToggle = card.querySelector('.edit-hidden');
      if (project.hidden) card.classList.add('is-hidden');
      hiddenToggle.addEventListener('change', (e) => {
        if (e.target.checked) card.classList.add('is-hidden');
        else card.classList.remove('is-hidden');
      });

      // Handle Delete
      card.querySelector('.delete-btn').addEventListener('click', () => {
        if (confirm('Are you sure you want to remove this project from your dashboard?')) {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.8)';
          setTimeout(() => card.remove(), 300);
        }
      });
      
      adminGrid.appendChild(card);
    });
  }

  // ========== ACTIONS ==========

  saveAllBtn.addEventListener('click', async () => {
    const cards = document.querySelectorAll('.admin-card');
    const updatedData = Array.from(cards).map(card => {
      const index = card.dataset.index;
      return {
        id: index,
        title: card.querySelector('.edit-title').value,
        category: card.querySelector('.edit-category').value,
        type: card.querySelector('.edit-type').value,
        hidden: card.querySelector('.edit-hidden').checked,
        description: card.querySelector('.edit-desc').value,
        imageUrl: currentProjects[index].url || currentProjects[index].imageUrl
      };
    });

    saveAllBtn.disabled = true;
    saveAllBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

    try {
      // POST to Apps Script
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Apps Script requires no-cors for simple POST or it fails preflight
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateProjects',
          projects: updatedData
        })
      });

      showToast('Changes saved to Google Sheets! (Check your sheet to verify)');
    } catch (err) {
      console.error(err);
      showToast('Error saving changes. Check console.');
    } finally {
      saveAllBtn.disabled = false;
      saveAllBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Changes';
    }
  });

  syncBtn.addEventListener('click', loadProjects);

  // ========== UTILS ==========

  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('active');
    setTimeout(() => toast.classList.remove('active'), 3000);
  }

  // Check auth on load
  checkAuth();
});
