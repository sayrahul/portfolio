// ========================================
// GOOGLE APPS SCRIPT LOADER
// Fetch portfolio data from Google Sheets
// ========================================

// YOUR APPS SCRIPT WEB APP URL
// Get this from Step 5 of SETUP-GUIDE.md
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzrWVebG5mhEnoSqHckLOAHvcUJsu9fY3SzRbCZ0Ik8Q7DuO8Cb9HOzkB5F0InajJJ1/exec';

// Fetch projects from Google Sheets via Apps Script
async function loadFromGoogleSheets() {
  const grid = document.getElementById('portfolioGrid');
  if (grid) grid.innerHTML = '<div class="loading-status">🔄 Connecting to Google Photos...</div>';

  try {
    console.log('🔄 Fetching from Apps Script:', APPS_SCRIPT_URL);

    // Check if URL is still placeholder
    if (APPS_SCRIPT_URL.includes('PASTE_YOUR_')) {
      console.warn('⚠️ Apps Script URL not configured!');
      return null;
    }

    // Fetch with timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(APPS_SCRIPT_URL, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Permission Denied (403). Make sure access is set to "Anyone" in Google Apps Script deployment settings.');
      }
      throw new Error(`Server responded with ${response.status}`);
    }

    const data = await response.json();
    console.log('📦 Data received:', data);

    if (data.error) {
      throw new Error(data.error);
    }

    if (data.projects && data.projects.length > 0) {
      console.log(`✅ Success: Loaded ${data.projects.length} projects`);
      return data.projects;
    } else {
      console.warn('⚠️ No projects found in the response');
      if (data.message) console.info('Message from server:', data.message);
      return null;
    }

  } catch (error) {
    console.error('❌ Apps Script Error:', error.message);
    if (grid) {
      grid.innerHTML = `
        <div class="error-status">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <p>Unable to load your photos</p>
          <small>${error.message}</small>
        </div>
      `;
    }
    return null;
  }
}

// Convert Google Sheets data to portfolio format
function formatSheetProjects(sheetProjects) {
  return sheetProjects.map(project => ({
    title: project.title || 'Untitled Project',
    description: project.description || 'ProVenture creative work',
    category: project.category || 'branding',
    type: project.type || 'image',
    url: project.imageUrl || project.url || ''
  })).filter(project => project.url); // Only include projects with URLs
}

// Initialize and load from Google Sheets
async function initGoogleSheets() {
  const sheetProjects = await loadFromGoogleSheets();

  if (sheetProjects) {
    return formatSheetProjects(sheetProjects);
  }

  return null;
}

// Export
window.initGoogleSheets = initGoogleSheets;
window.loadFromGoogleSheets = loadFromGoogleSheets;
