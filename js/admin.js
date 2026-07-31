/**
 * PROVENTURE ADMIN DASHBOARD LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inject Corporate UI styles dynamically
  const adminStyle = document.createElement('link');
  adminStyle.rel = 'stylesheet';
  adminStyle.href = 'css/admin-corporate.css';
  document.head.appendChild(adminStyle);

  const loginOverlay = document.getElementById('loginOverlay');
  const loginBtn = document.getElementById('loginBtn');
  const adminPassword = document.getElementById('adminPassword');
  const loginError = document.getElementById('loginError');
  const dashboardUI = document.getElementById('dashboardUI');
  const adminGrid = document.getElementById('adminGrid');
  const saveAllBtn = document.getElementById('saveAllBtn');
  const syncBtn = document.getElementById('syncBtn');
  
  // Bulk Elements
  const bulkBar = document.getElementById('bulkActionsBar');
  const selectedCountDisplay = document.getElementById('selectedCount');
  const bulkCategory = document.getElementById('bulkCategory');
  const bulkHideBtn = document.getElementById('bulkHideBtn');
  const bulkShowBtn = document.getElementById('bulkShowBtn');
  const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
  const clearSelectionBtn = document.getElementById('clearSelectionBtn');

  let selectedIndices = new Set();

  // ========== AUTHENTICATION ==========
  
  function checkAuth() {
    if (localStorage.getItem('adminLoggedIn') === 'true') {
      loginOverlay.style.display = 'none';
      dashboardUI.style.display = 'flex';
      loadProjects();
    }
  }

  loginBtn.addEventListener('click', async () => {
    const password = adminPassword.value;
    const originalText = loginBtn.textContent;
    
    if (!password) {
      loginError.textContent = 'Please enter password.';
      return;
    }

    loginBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    loginBtn.disabled = true;

    try {
      if (typeof APPS_SCRIPT_URL !== 'undefined' && !APPS_SCRIPT_URL.includes('PASTE_YOUR_')) {
        const response = await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'login', password: password })
        });
        const result = await response.json();
        
        if (result.success) {
          handleSuccessfulLogin();
          return;
        } else {
          loginError.textContent = result.message || 'Invalid admin credentials.';
          adminPassword.style.borderColor = '#ef4444';
          return;
        }
      }
    } catch (err) {
      console.warn('Backend login verification failed:', err);
    } finally {
      loginBtn.textContent = originalText;
      loginBtn.disabled = false;
    }

    // Default fallback check
    if (password.length >= 6) {
      handleSuccessfulLogin();
    } else {
      loginError.textContent = 'Invalid password.';
      adminPassword.style.borderColor = '#ef4444';
    }
  });

  function handleSuccessfulLogin() {
    localStorage.setItem('adminLoggedIn', 'true');
    loginOverlay.style.display = 'none';
    dashboardUI.style.display = 'flex';
    showToast('Welcome back, Admin!');
    loadProjects();
  }

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
        <div class="card-media-wrapper">
          <img src="${project.url || project.imageUrl}" alt="Preview" class="media-thumb" />
          <div class="media-overlay">
            <span class="card-badge ${badgeClass}"><i class="fa-solid ${mediaType === 'video' ? 'fa-video' : 'fa-image'}"></i> ${mediaType.toUpperCase()}</span>
            <button class="delete-btn" title="Delete Project"><i class="fa-solid fa-trash-can"></i></button>
          </div>
        </div>
        <div class="card-details">
          <div class="form-group title-group">
            <div class="input-wrapper">
              <i class="fa-solid fa-heading input-icon"></i>
              <input type="text" value="${project.title || ''}" class="edit-title corporate-input" placeholder="Project Title" />
            </div>
            <label class="corporate-toggle" title="Toggle Visibility">
              <input type="checkbox" class="edit-hidden" ${project.hidden ? 'checked' : ''}>
              <span class="toggle-slider"></span>
              <span class="toggle-label">${project.hidden ? 'Hidden' : 'Visible'}</span>
            </label>
          </div>
          
          <div class="form-row">
            <div class="form-group flex-1">
              <label class="tiny-label">Category</label>
              <div class="select-wrapper">
                <i class="fa-solid fa-folder input-icon"></i>
                <select class="edit-category corporate-select">
                  <option value="branding" ${project.category === 'branding' ? 'selected' : ''}>Branding</option>
                  <option value="video" ${project.category === 'video' ? 'selected' : ''}>Video</option>
                  <option value="web" ${project.category === 'web' ? 'selected' : ''}>Web Design</option>
                  <option value="photo" ${project.category === 'photo' ? 'selected' : ''}>Photography</option>
                  <option value="social" ${project.category === 'social' ? 'selected' : ''}>Social Media</option>
                </select>
                <i class="fa-solid fa-chevron-down select-arrow"></i>
              </div>
            </div>
            <div class="form-group flex-1">
              <label class="tiny-label">Media Type</label>
              <div class="select-wrapper">
                <i class="fa-solid fa-photo-film input-icon"></i>
                <select class="edit-type corporate-select">
                  <option value="image" ${mediaType === 'image' ? 'selected' : ''}>Image</option>
                  <option value="video" ${mediaType === 'video' ? 'selected' : ''}>Video</option>
                </select>
                <i class="fa-solid fa-chevron-down select-arrow"></i>
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label class="tiny-label">Description</label>
            <div class="textarea-wrapper">
              <i class="fa-solid fa-align-left input-icon align-top"></i>
              <textarea class="edit-desc corporate-textarea" placeholder="Brief project description...">${project.description || ''}</textarea>
            </div>
          </div>
        </div>
      `;
      
      // Update badge dynamically
      const typeSelect = card.querySelector('.edit-type');
      const badge = card.querySelector('.card-badge');
      typeSelect.addEventListener('change', (e) => {
        const newType = e.target.value;
        const icon = newType === 'video' ? 'fa-video' : 'fa-image';
        badge.innerHTML = `<i class="fa-solid ${icon}"></i> ${newType.toUpperCase()}`;
        badge.className = `card-badge ${newType === 'video' ? 'badge-video' : 'badge-image'}`;
      });

      // Handle Hide Toggle Visual
      const hiddenToggle = card.querySelector('.edit-hidden');
      const toggleLabel = card.querySelector('.toggle-label');
      if (project.hidden) card.classList.add('is-hidden');
      hiddenToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
          card.classList.add('is-hidden');
          if (toggleLabel) toggleLabel.textContent = 'Hidden';
        } else {
          card.classList.remove('is-hidden');
          if (toggleLabel) toggleLabel.textContent = 'Visible';
        }
      });

      // Handle Delete
      card.querySelector('.delete-btn').addEventListener('click', (e) => {
        e.stopPropagation(); // Don't trigger selection
        if (confirm('Are you sure you want to remove this project from your dashboard?')) {
          card.remove();
        }
      });

      // ========== SELECTION LOGIC ==========
      card.addEventListener('click', (e) => {
        // Don't select if clicking inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA' || e.target.closest('button')) return;
        
        toggleSelection(index, card);
      });
      
      adminGrid.appendChild(card);
    });
  }

  function toggleSelection(index, card) {
    if (selectedIndices.has(index)) {
      selectedIndices.delete(index);
      card.classList.remove('selected');
    } else {
      selectedIndices.add(index);
      card.classList.add('selected');
    }
    updateBulkBar();
  }

  function updateBulkBar() {
    const count = selectedIndices.size;
    selectedCountDisplay.textContent = count;
    
    if (count > 0) {
      bulkBar.classList.add('active');
    } else {
      bulkBar.classList.remove('active');
    }
  }

  clearSelectionBtn.addEventListener('click', () => {
    selectedIndices.clear();
    document.querySelectorAll('.admin-card.selected').forEach(c => c.classList.remove('selected'));
    updateBulkBar();
  });

  // ========== BULK ACTIONS ==========

  bulkDeleteBtn.addEventListener('click', () => {
    if (confirm(`Are you sure you want to delete ${selectedIndices.size} selected projects?`)) {
      document.querySelectorAll('.admin-card.selected').forEach(card => card.remove());
      selectedIndices.clear();
      updateBulkBar();
      showToast('Selected items removed. Click Save to apply.');
    }
  });

  bulkHideBtn.addEventListener('click', () => {
    document.querySelectorAll('.admin-card.selected').forEach(card => {
      card.querySelector('.edit-hidden').checked = true;
      card.classList.add('is-hidden');
    });
    showToast('Items hidden.');
  });

  bulkShowBtn.addEventListener('click', () => {
    document.querySelectorAll('.admin-card.selected').forEach(card => {
      card.querySelector('.edit-hidden').checked = false;
      card.classList.remove('is-hidden');
    });
    showToast('Items visible.');
  });

  bulkCategory.addEventListener('change', () => {
    const category = bulkCategory.value;
    if (!category) return;
    
    document.querySelectorAll('.admin-card.selected').forEach(card => {
      card.querySelector('.edit-category').value = category;
    });
    showToast(`Category updated to ${category} for selected items.`);
    bulkCategory.value = ''; // reset
  });

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
        // Safely extract URL from the currentProjects array to prevent errors if index shifts
        imageUrl: currentProjects[index] ? (currentProjects[index].url || currentProjects[index].imageUrl) : ''
      };
    });

    saveAllBtn.disabled = true;
    saveAllBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

    try {
      // POST to Apps Script
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'cors', // Changed to cors to allow reading response errors correctly
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateProjects',
          projects: updatedData
        })
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }

      showToast('Changes saved successfully to Google Sheets!');
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
