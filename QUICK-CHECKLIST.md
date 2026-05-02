# ✅ Quick Setup Checklist

## **Before You Start:**
- [ ] I have a Google account
- [ ] I can access Google Sheets
- [ ] I can access Google Photos album
- [ ] I have 15-20 minutes

---

## **STEP 1: Google Sheet** (2 min)
- [ ] Created new Google Sheet
- [ ] Named it "ProVenture Portfolio"
- [ ] Added column headers: title, description, category, type, imageUrl
- [ ] Sheet is ready

---

## **STEP 2: Get Image URLs** (10 min)

### **Option A: Quick Test (Use placeholders first)**
- [ ] Skip this step for now
- [ ] Use placeholder images to test
- [ ] Add real images later

### **Option B: Upload to Imgur**
- [ ] Downloaded images from Google Photos
- [ ] Went to imgur.com
- [ ] Uploaded images
- [ ] Copied image URLs
- [ ] Pasted URLs in Google Sheet

---

## **STEP 3: Fill Google Sheet** (5 min)
- [ ] Added at least 5 projects
- [ ] Each row has: title, description, category, type, imageUrl
- [ ] Categories are: branding, web, photo, social, or video
- [ ] Types are: image or video
- [ ] Saved sheet

---

## **STEP 4: Apps Script** (3 min)
- [ ] Clicked Extensions → Apps Script
- [ ] Pasted the code from SETUP-GUIDE.md
- [ ] Saved script
- [ ] Named it "Portfolio API"

---

## **STEP 5: Deploy** (2 min)
- [ ] Clicked Deploy → New deployment
- [ ] Selected "Web app"
- [ ] Set "Execute as" = Me
- [ ] Set "Who has access" = Anyone
- [ ] Clicked Deploy
- [ ] Authorized access
- [ ] **COPIED THE WEB APP URL** ← IMPORTANT!

---

## **STEP 6: Update Code** (1 min)
- [ ] Opened `js/apps-script-loader.js`
- [ ] Found line: `const APPS_SCRIPT_URL = 'PASTE_YOUR_APPS_SCRIPT_URL_HERE';`
- [ ] Replaced with my Apps Script URL
- [ ] Saved file

---

## **STEP 7: Test** (1 min)
- [ ] Opened `index.html` in browser
- [ ] Pressed F12 to open console
- [ ] Saw: "✅ Loaded X projects from Google Sheets"
- [ ] Images are showing!
- [ ] **IT WORKS!** 🎉

---

## **STEP 8: Deploy to Vercel** (10 min)
- [ ] Pushed code to GitHub
- [ ] Deployed on Vercel
- [ ] Setup custom domain: portfolio.proventure.in
- [ ] **LIVE!** 🚀

---

## 🐛 **If Something's Not Working:**

### **Stuck on Step 1-3?**
→ Read `GOOGLE-SHEET-TEMPLATE.md`

### **Stuck on Step 4-5?**
→ Read `SETUP-GUIDE.md` Step 4-5 carefully

### **Stuck on Step 6?**
→ Make sure you copied the FULL URL (starts with `https://script.google.com/`)

### **Stuck on Step 7?**
→ Check console (F12) for error messages
→ Test Apps Script URL in browser - should show JSON

---

## 📞 **Need Help?**

Tell me:
1. Which step you're on
2. What error you're seeing (if any)
3. What you see in console (F12)

**I'll help you fix it!** 🚀

---

## 🎯 **Current Status:**

**Completed:** _____ / 8 steps

**Next step:** _____________

**Stuck on:** _____________

---

**Let's get your portfolio live!** 💪
