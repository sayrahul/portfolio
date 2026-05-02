# 🚀 Complete Setup Guide - Google Apps Script + Sheets

## **STEP 1: Create Google Sheet** (2 minutes)

1. Go to [sheets.google.com](https://sheets.google.com)
2. Click **"+ Blank"** to create new sheet
3. Name it: **"ProVenture Portfolio"**

4. **Create these columns** in Row 1:
   ```
   A1: title
   B1: description
   C1: category
   D1: type
   E1: imageUrl
   ```

5. **Add sample data** (Row 2):
   ```
   A2: Brand Identity Design
   B2: Complete brand identity package
   C2: branding
   D2: image
   E2: https://i.imgur.com/SAMPLE.jpg
   ```

6. **Keep this sheet open** - you'll need it!

---

## **STEP 2: Get Image URLs from Google Photos** (10 minutes)

### **Method A: Manual (Simple)**

For each image in your album:

1. Open: https://photos.app.goo.gl/PKbE1PDMfGqYrhsw8
2. Click on an image
3. Click the **3 dots (⋮)** → **"Download"**
4. Upload to [imgur.com](https://imgur.com)
5. Right-click uploaded image → **"Copy image address"**
6. Paste URL in column E of your Google Sheet

**Repeat for 20-30 best images**

---

### **Method B: Batch Download (Faster)**

1. Open your Google Photos album
2. Click **3 dots (⋮)** at top → **"Download all"**
3. Extract the ZIP file
4. Go to [imgur.com](https://imgur.com)
5. Click **"New post"**
6. **Drag all images** at once
7. Upload
8. Right-click each image → Copy URL → Paste in Sheet

---

## **STEP 3: Fill Google Sheet** (5 minutes)

Add your projects to the sheet:

| title | description | category | type | imageUrl |
|-------|-------------|----------|------|----------|
| Logo Design | Modern logo for tech startup | branding | image | https://i.imgur.com/ABC123.jpg |
| Website Design | E-commerce website | web | image | https://i.imgur.com/XYZ789.jpg |
| Product Photo | Professional product photography | photo | image | https://i.imgur.com/DEF456.jpg |
| Social Media Post | Instagram campaign | social | image | https://i.imgur.com/GHI012.jpg |
| Corporate Video | Company overview video | video | video | https://www.youtube.com/embed/VIDEO_ID |

**Categories:** branding, web, photo, social, video  
**Types:** image, video

---

## **STEP 4: Create Apps Script** (3 minutes)

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any existing code
3. **Paste this code:**

```javascript
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  // Skip header row
  const headers = data[0];
  const rows = data.slice(1);
  
  // Convert to JSON
  const projects = rows.map(row => {
    const project = {};
    headers.forEach((header, index) => {
      project[header] = row[index];
    });
    return project;
  }).filter(project => project.imageUrl); // Only include rows with images
  
  // Return JSON
  return ContentService
    .createTextOutput(JSON.stringify({ projects: projects }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Click **"Save"** (💾 icon)
5. Name it: **"Portfolio API"**

---

## **STEP 5: Deploy Apps Script** (2 minutes)

1. Click **"Deploy"** → **"New deployment"**
2. Click the **gear icon** ⚙️ → Select **"Web app"**
3. Fill in:
   - **Description:** Portfolio API
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **"Deploy"**
5. Click **"Authorize access"**
6. Choose your Google account
7. Click **"Advanced"** → **"Go to Portfolio API (unsafe)"**
8. Click **"Allow"**
9. **COPY THE WEB APP URL** (looks like: `https://script.google.com/macros/s/ABC.../exec`)

---

## **STEP 6: Update Your Portfolio Code** (1 minute)

1. Open `proventure-portfolio/js/apps-script-loader.js`
2. Find this line:
   ```javascript
   const APPS_SCRIPT_URL = 'PASTE_YOUR_URL_HERE';
   ```
3. Replace with your Apps Script URL:
   ```javascript
   const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_ID/exec';
   ```
4. **Save the file**

---

## **STEP 7: Test It!** (1 minute)

1. Open `proventure-portfolio/index.html` in browser
2. Press **F12** to open console
3. Look for: `"✅ Loaded X projects from Google Sheets"`
4. **Your images should appear!** 🎉

---

## **STEP 8: Add More Projects** (Anytime)

Just add more rows to your Google Sheet!

1. Open your Google Sheet
2. Add new row with project info
3. Refresh your portfolio website
4. New project appears automatically! ✨

**No code changes needed!**

---

## 🎯 **Summary:**

✅ Google Sheet = Your database  
✅ Apps Script = Your API  
✅ Portfolio = Fetches from API  
✅ Update sheet = Updates website automatically!  

---

## 🐛 **Troubleshooting:**

### **"Script not authorized"**
- Go back to Apps Script
- Click "Deploy" → "Manage deployments"
- Make sure "Who has access" = "Anyone"

### **"No projects loading"**
- Check Apps Script URL is correct
- Test URL in browser - should show JSON
- Check console (F12) for errors

### **"Images not showing"**
- Make sure imageUrl column has valid URLs
- URLs should start with `https://`
- Test URL in browser - image should load

---

## 📞 **Need Help?**

Tell me which step you're stuck on:
- Step 1: Creating sheet?
- Step 2: Getting image URLs?
- Step 3: Filling sheet?
- Step 4: Apps Script code?
- Step 5: Deploying?
- Step 6: Updating code?
- Step 7: Testing?

**I'll help you through it!** 🚀
