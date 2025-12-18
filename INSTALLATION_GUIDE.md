# 🚀 Installation & Setup Guide

## Quick Installation

### Step 1: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend  
cd mobile-app
npm install
```

### Step 2: Download Data Files

#### Option A: Using JSON Files (Recommended - Faster & More Reliable)

**Quran Data:**
1. Visit: https://github.com/risan/quran-json
2. Download the complete JSON file
3. Save as: `backend/data/quran.json`

**Hadith Data:**
1. Visit: https://github.com/A-H4NU/kalem-data
2. Download all 6 collections:
   - Sahih Bukhari → `backend/data/hadith/bukhari.json`
   - Sahih Muslim → `backend/data/hadith/muslim.json`
   - Sunan Abu Dawood → `backend/data/hadith/abudawud.json`
   - Jami' at-Tirmidhi → `backend/data/hadith/tirmidhi.json`
   - Sunan an-Nasa'i → `backend/data/hadith/nasai.json`
   - Sunan Ibn Majah → `backend/data/hadith/ibnmajah.json`

#### Option B: Using API (Fallback - Requires Internet)

The import scripts will automatically fetch from APIs if JSON files are not found.

### Step 3: Import Data

```bash
cd backend

# Import all data (Quran + Hadith)
npm run import:all

# OR import separately:
npm run import:quran
npm run import:hadith
```

**Expected Output:**
```
✅ Connected to MongoDB
📚 Importing surah metadata...
✅ Successfully imported metadata for 114 surahs
📖 Importing Quran from local JSON file...
✅ Successfully imported 6236 ayahs from JSON
📊 Import Summary:
   Total Ayahs: 6236 / 6236 expected
   Total Surahs: 114 / 114 expected
✅ Import complete and verified!
```

### Step 4: Start Backend

```bash
cd backend
npm start
```

Server will start at: `http://localhost:5000`

### Step 5: Configure Frontend

Update API URL in `mobile-app/src/services/api.js`:

```javascript
// For local network (recommended for mobile testing)
const API_URL = 'http://YOUR_IP_ADDRESS:5000/api';

// Example:
// const API_URL = 'http://192.168.1.100:5000/api';

// For localhost (emulator only)
// const API_URL = 'http://localhost:5000/api';
```

**Find Your IP:**
- **Windows:** Open CMD → type `ipconfig` → look for IPv4 Address
- **Mac:** Open Terminal → type `ifconfig` → look for inet
- **Linux:** Open Terminal → type `ip addr` → look for inet

### Step 6: Start Mobile App

```bash
cd mobile-app
npm start
# or
expo start
```

Scan QR code with Expo Go app or run on emulator.

### Step 7: Test the Features

1. Login/Register to your account
2. Navigate to **Quran** tab (book icon)
3. Browse 114 surahs
4. Tap any surah to read
5. Navigate to **Hadith** tab (library icon)
6. Browse 6 collections
7. Tap any collection to read hadiths

---

## Verification

### Backend Verification

Test endpoints:

```bash
# Check if server is running
curl http://localhost:5000/api/health

# Check Quran stats
curl http://localhost:5000/api/quran/stats

# Check Hadith stats
curl http://localhost:5000/api/hadith/collections

# Get Surah Al-Fatiha
curl http://localhost:5000/api/quran/surah/1
```

Expected responses:
- Health check: `{ "status": "OK" }`
- Quran stats: `{ "totalAyahs": 6236, "totalSurahs": 114, "isComplete": true }`
- Hadith collections: 6 collections with counts

### Database Verification

Check MongoDB:

```bash
# Using MongoDB Compass or CLI
# Connect to your MongoDB Atlas/local instance

# Check collections exist:
- quran (6,236 documents)
- surah_metadata (114 documents)
- hadith (~30,000+ documents)
```

### Frontend Verification

In mobile app:
- [ ] Quran tab appears in navigation
- [ ] Hadith tab appears in navigation
- [ ] Can see 114 surahs in Quran screen
- [ ] Can see 6 collections in Hadith screen
- [ ] Arabic text displays correctly (right-to-left)
- [ ] Can toggle translations
- [ ] No console errors in terminal

---

## Troubleshooting

### Issue: "Cannot connect to backend"

**Solutions:**
1. Verify backend is running: `npm start` in backend folder
2. Check API_URL in `mobile-app/src/services/api.js`
3. Ensure firewall allows port 5000
4. Try pinging your IP from mobile device
5. Ensure devices are on same network

### Issue: "Import script fails"

**Solutions:**
1. Check MongoDB connection string in `.env`
2. Verify `MONGODB_URI` is correct
3. Ensure MongoDB is running (Atlas or local)
4. Check internet connection (for API import)
5. Verify JSON file paths are correct

### Issue: "Arabic text shows as boxes"

**Solutions:**
1. Update Expo to latest version
2. Clear app cache
3. Restart Metro bundler
4. Test on physical device (not emulator)

### Issue: "Data import incomplete"

**Solutions:**
1. Check import logs for errors
2. Verify JSON file format matches expected structure
3. Re-download JSON files
4. Try API import method instead
5. Check MongoDB storage space

### Issue: "App crashes when opening Quran"

**Solutions:**
1. Check backend logs for errors
2. Verify data was imported successfully
3. Check API endpoint responses
4. Clear app cache and restart
5. Check for JavaScript errors in console

---

## NPM Scripts Reference

### Backend Scripts

```bash
# Start server (production)
npm start

# Start server with auto-reload (development)
npm run dev

# Import Quran data
npm run import:quran

# Import Hadith data
npm run import:hadith

# Import all data
npm run import:all
```

### Frontend Scripts

```bash
# Start Expo development server
npm start

# Start with clearing cache
npm start --clear

# Run on Android emulator
npm run android

# Run on iOS simulator (Mac only)
npm run ios

# Run on web browser
npm run web
```

---

## Environment Variables

Create `.env` file in `backend/` folder:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/islamic-app

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret (for authentication)
JWT_SECRET=your_jwt_secret_key_here

# Optional: Sunnah.com API Key (for API import)
SUNNAH_API_KEY=your_api_key_here
```

---

## Data Sources

### Recommended (JSON Files)

**Quran:**
- Primary: https://github.com/risan/quran-json
- Alternative: https://github.com/islamic-network/quran.json

**Hadith:**
- Primary: https://github.com/A-H4NU/kalem-data
- Alternative: https://github.com/islamic-network/hadith-api-data

### API Sources (Fallback)

**Quran:**
- quran.com API: https://api.quran.com/api/v4/

**Hadith:**
- sunnah.com API: https://sunnah.api-docs.io/

---

## File Checklist

Before starting, ensure these exist:

### Backend
- [x] `backend/package.json` (with axios dependency)
- [x] `backend/.env` (with MongoDB URI)
- [x] `backend/data/` directory created
- [x] `backend/data/hadith/` directory created
- [ ] `backend/data/quran.json` downloaded
- [ ] `backend/data/hadith/*.json` downloaded (6 files)

### Frontend
- [x] `mobile-app/package.json`
- [x] `mobile-app/src/services/api.js` (with correct API_URL)

---

## Post-Installation

After successful installation:

1. **Test all features** thoroughly
2. **Document any issues** encountered
3. **Plan future enhancements** from TODO list
4. **Get user feedback** from community
5. **Consider scholar review** for accuracy

---

## Development Workflow

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd mobile-app
npm start

# Terminal 3: Import data (one time)
cd backend
npm run import:all
```

---

## Production Deployment

Before deploying to production:

1. **Data Verification**
   - [ ] All 6,236 Quran ayahs imported
   - [ ] All 114 surah metadata imported
   - [ ] All 6 hadith collections imported
   - [ ] Arabic text verified with authentic sources

2. **Testing**
   - [ ] Tested on iOS devices
   - [ ] Tested on Android devices
   - [ ] Tested offline functionality
   - [ ] Performance tested with large datasets
   - [ ] Error handling tested

3. **Security**
   - [ ] Environment variables secured
   - [ ] API endpoints secured
   - [ ] Database access restricted
   - [ ] HTTPS enabled

4. **Optimization**
   - [ ] Database indexes verified
   - [ ] API response times optimized
   - [ ] App bundle size optimized
   - [ ] Images/assets optimized

---

## Next Steps

1. ✅ Complete installation (follow steps above)
2. ✅ Import data successfully
3. ✅ Test all features
4. ✅ Review documentation
5. 🎯 Plan Phase 1 enhancements (see TODO file)

---

## Support Resources

- 📖 **Full Documentation:** `docs/QURAN_HADITH_IMPLEMENTATION.md`
- 🚀 **Quick Start:** `docs/QUICK_START_QURAN_HADITH.md`
- ✅ **Summary:** `IMPLEMENTATION_SUMMARY.md`
- 🔮 **Roadmap:** `docs/TODO_FUTURE_ENHANCEMENTS.md`
- 📂 **Data Guide:** `backend/data/README.md`

---

## Success Criteria

Installation is successful when:

✅ Backend starts without errors  
✅ Frontend connects to backend  
✅ 6,236 ayahs in database  
✅ 114 surahs in database  
✅ ~30,000+ hadiths in database  
✅ Can browse and read Quran  
✅ Can browse and read Hadith  
✅ Arabic text displays correctly  
✅ No console errors  
✅ App works smoothly  

---

**Happy Coding! May Allah bless this work! 🤲**
