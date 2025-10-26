# 🚀 Quick Start Guide - NGO Portal

## ⚡ Fast Setup (3 Steps)

### Step 1: Verify Installation ✅
Dependencies are already installed! You should see:
```
✅ 394 packages installed
✅ 0 vulnerabilities
```

### Step 2: Start the Server 🖥️
```bash
cd "c:\Users\beras\OneDrive\Desktop\celoo\NovaAid\FRONTEND\ngo-portal"
npm run dev
```

### Step 3: Open Browser 🌐
Navigate to: **http://localhost:3001**

---

## 🎯 Complete Flow Test

### Test the NGO Redirect:

1. **Start NGO Portal** (Terminal 1):
   ```bash
   cd ngo-portal
   npm run dev
   ```
   ✅ Running on http://localhost:3001

2. **Start Main App** (Terminal 2):
   ```bash
   cd novaaid-app
   npm run dev
   ```
   ✅ Running on http://localhost:3000

3. **Test the Flow**:
   - Open http://localhost:3000/role-select
   - Click the **NGO** button
   - You'll be redirected to http://localhost:3001
   - See the BackgroundPaths homepage! 🎉

---

## 🎨 What You'll See

### Homepage Features:
- ✨ **36 animated SVG paths** flowing in the background
- 🔤 **Letter-by-letter text animation** spelling "NGO Excellence Portal"
- 🎨 **Gradient text** with smooth color transitions
- 🔘 **Glassmorphic button** with hover effects
- 🌙 **Dark mode support** (respects system preferences)

---

## 📁 File Locations

### Main Files:
```
ngo-portal/
├── app/page.tsx                      # 👈 Homepage (change title here)
├── components/ui/background-paths.tsx # 👈 Main component
└── components/ui/button.tsx          # 👈 Button styles
```

### Customization:
Edit `app/page.tsx`:
```tsx
<BackgroundPaths title="Your Custom Title" />
```

---

## 🔧 Common Commands

```bash
# Development (with hot reload)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

---

## 🎭 Easy Launcher Scripts

### Windows Users:
Double-click these batch files from `FRONTEND/` folder:

- **`start-both-apps.bat`** - Starts both apps automatically
- **`start-ngo-portal.bat`** - NGO portal only
- **`start-main-app.bat`** - Main app only

---

## 🐛 Troubleshooting

### Port 3001 in use?
Kill the process or change port in `package.json`:
```json
"dev": "next dev -p 3002"  // Change 3001 to 3002
```

### Module not found errors?
Reinstall dependencies:
```bash
npm install
```

### Page not loading?
1. Check both servers are running
2. Clear browser cache (Ctrl + Shift + R)
3. Check console for errors (F12)

---

## 📚 Documentation

- **README.md** - Full project documentation
- **FEATURES.md** - Detailed component features
- **NGO_PORTAL_SETUP.md** - Complete setup guide

---

## ✨ Next Steps

1. ✅ Test the redirect flow
2. 🎨 Customize the title and button text
3. 📄 Add more pages (dashboard, services, etc.)
4. 🎯 Add navigation menu
5. 🔐 Implement authentication if needed

---

**You're all set! Enjoy building with the NGO Portal! 🎉**
