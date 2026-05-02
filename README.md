# 📸 ProVenture Portfolio - Instagram Style

**Clean, Simple, Instagram-like Portfolio Showcase**

---

## ✨ Features

✅ **Instagram-style grid layout**  
✅ **Light & Dark mode** (auto-saves preference)  
✅ **Search functionality**  
✅ **Category filters** (All, Branding, Video, Web, Photo, Social)  
✅ **Lightbox viewer** with keyboard navigation  
✅ **Mobile responsive** (works perfectly on phones)  
✅ **Video support** (auto-play on hover)  
✅ **Lazy loading** for fast performance  
✅ **Touch swipe** support on mobile  

---

## 🚀 Quick Setup (3 Steps)

### **Step 1: Add Your Logo**
1. Save your logo as `logo.png`
2. Put it in the `assets` folder

### **Step 2: Add Your Projects**
1. Open `data/projects.js`
2. Replace placeholder URLs with your Google Photos links
3. Update titles and descriptions

**Example:**
```javascript
{
  title: 'My Project',
  description: 'Project description',
  category: 'branding', // branding, video, web, photo, social
  type: 'image', // image or video
  url: 'YOUR_GOOGLE_PHOTOS_LINK'
}
```

### **Step 3: Deploy**
1. Push to GitHub
2. Deploy on Vercel
3. Set custom domain: `portfolio.proventure.in`

---

## 🎨 Customization

### **Update Profile Info:**
Open `index.html` → Find `<section class="profile">` → Edit:
- Stats (projects, clients, years)
- Bio text
- Social links

### **Change Colors:**
Open `css/style.css` → Find `:root` section:
```css
:root {
  --cyan: #00AEEF;    /* Your primary color */
  --navy: #1B3A5C;    /* Your secondary color */
}
```

---

## 🌓 Light/Dark Mode

- Click moon/sun icon in header
- Preference auto-saves in browser
- Works on all pages

---

## 📱 Mobile Optimized

- 3-column grid on mobile
- Touch swipe in lightbox
- Responsive design
- Fast loading

---

## 🎯 File Structure

```
proventure-portfolio/
├── index.html          ← Main file
├── css/
│   └── style.css       ← All styling
├── js/
│   └── main.js         ← All functionality
├── data/
│   └── projects.js     ← Your projects (EDIT THIS!)
└── assets/
    └── logo.png        ← Your logo
```

---

## 🔧 How to Add Google Photos

### **Method 1: Direct Link**
1. Upload to Google Photos
2. Open image → Share → Create link
3. Open link in browser
4. Right-click image → "Open image in new tab"
5. Copy that URL (starts with `https://lh3.googleusercontent.com/...`)
6. Use in `projects.js`

### **Method 2: YouTube (for videos)**
1. Upload to YouTube
2. Get video ID from URL
3. Use format: `https://www.youtube.com/embed/VIDEO_ID`

---

## ⌨️ Keyboard Shortcuts

When lightbox is open:
- `←` Previous image
- `→` Next image
- `Esc` Close lightbox

---

## 📊 Performance

- Lazy loading images
- Optimized CSS/JS
- Fast page load
- Smooth animations
- Mobile-first design

---

## 🐛 Troubleshooting

### **Logo not showing?**
- Check file is named exactly `logo.png`
- Check it's in `assets` folder
- Clear browser cache (Ctrl+F5)

### **Projects not loading?**
- Open browser console (F12)
- Check `data/projects.js` for syntax errors
- Verify image URLs are accessible

### **Dark mode not working?**
- Clear browser localStorage
- Hard refresh (Ctrl+Shift+R)

---

## 🚀 Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Deploy
5. Add custom domain: `portfolio.proventure.in`

**DNS Settings:**
- Type: CNAME
- Name: `portfolio`
- Value: `cname.vercel-dns.com`

---

## 💡 Tips

1. **Image Size:** Use 1080x1080px (square) for best results
2. **File Size:** Compress images before uploading (use tinypng.com)
3. **Videos:** Keep under 30 seconds for fast loading
4. **Categories:** Use consistent category names
5. **Update Regularly:** Add new projects monthly

---

## 📞 Support

If stuck:
1. Check browser console (F12) for errors
2. Verify all files are in correct folders
3. Test in different browser
4. Clear cache and reload

---

## 🎉 You're Done!

**Test it:**
1. Open `index.html` in browser
2. Try light/dark mode toggle
3. Click on projects
4. Test filters
5. Try search

**Deploy it:**
1. Push to GitHub
2. Deploy on Vercel
3. Share with world! 🌍

---

**Built for ProVenture Digital Agency**  
**Instagram-style portfolio showcase**
