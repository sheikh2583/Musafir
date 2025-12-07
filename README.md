# Musafir - Islamic Mobile App 🕌

React Native mobile app with Node.js backend and MongoDB Atlas.

---

## 🚀 Setup Guide for Team Members

### 📦 Prerequisites (Install These First)
1. **Node.js v16+** - Download: https://nodejs.org/
2. **Git** - Download: https://git-scm.com/
3. **Expo Go app** - Install on your phone:
   - iOS: App Store
   - Android: Play Store

---

### Step 1: Clone Repository
```bash
git clone https://github.com/sheikh2583/Musafir.git
cd Musafir
```

---

### Step 2: Backend Setup
```bash
cd backend
npm install
npm run dev
```

**Expected output:**
```
🚀 Server is running on port 5000
📱 Environment: development
```

✅ Backend is ready! MongoDB is already configured - no setup needed.

---

### Step 3: Mobile App Setup

**Open a NEW terminal:**

```bash
cd mobile-app
npm install
```

**⚠️ IMPORTANT - Update IP Address:**

1. Find YOUR computer's IP address:
   - **Windows**: Open PowerShell, run `ipconfig`, look for "IPv4 Address"
   - **Mac**: Open Terminal, run `ifconfig | grep inet`
   - **Example**: `192.168.1.105`

2. Edit `mobile-app/src/services/api.js` (line 5):
   ```javascript
   const API_URL = 'http://YOUR_IP_HERE:5000/api';
   ```
   Replace `YOUR_IP_HERE` with your actual IP

3. Also update `mobile-app/.env`:
   ```env
   API_URL=http://YOUR_IP_HERE:5000/api
   ```

**Start the app:**
```bash
npm start
```

**Run on phone:**
- Scan QR code with Expo Go app
- Make sure phone is on SAME WiFi as computer

---

## ✅ Configuration Summary

### What's Already Configured (No Action Needed):
- ✅ MongoDB Atlas connection (shared database)
- ✅ JWT secret keys
- ✅ Backend environment variables

### What You MUST Configure:
- ⚠️ Your computer's IP address in `mobile-app/src/services/api.js`
- ⚠️ Your computer's IP address in `mobile-app/.env`

### What You MUST Install:
- Node.js v16+
- Git
- Expo Go app on phone
- Dependencies: `npm install` (in both backend and mobile-app folders)

---

## 🔧 Daily Workflow

**Every time you code:**

1. Pull latest changes:
   ```bash
   git pull origin master
   ```

2. Start backend (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```

3. Start mobile app (Terminal 2):
   ```bash
   cd mobile-app
   npm start
   ```

4. Test on phone with Expo Go

---

## 🐛 Troubleshooting

**Backend won't start:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Mobile app can't connect to backend:**
- ✅ Backend running? Check Terminal 1
- ✅ Same WiFi? Phone and computer must be on same network
- ✅ Correct IP? Update `mobile-app/src/services/api.js` with YOUR IP
- ✅ Firewall? Temporarily disable to test

**"Module not found" error:**
```bash
npm install
```

---

## 📝 Git Workflow

```bash
# Before starting work
git pull origin master

# Create feature branch
git checkout -b feature/your-feature-name

# After coding
git add .
git commit -m "Your clear message"
git push origin feature/your-feature-name

# Create Pull Request on GitHub
```

---

**That's it! You're ready to code! 🚀**

---

## 🔄 Git Workflow

```bash
git pull origin master
git checkout -b feature/your-feature
# code...
git add .
git commit -m "message"
git push origin feature/your-feature
```

---

## 🐛 Troubleshooting

**Backend:**
```bash
cd backend
rm -rf node_modules
npm install
```

**Mobile:**
- Backend running?
- Same WiFi?
- Correct IP in api.js?
---
