# Musafir - Project Structure Guide

## 📁 Overview

```
Musafir/
├── backend/              # Node.js API Server
├── mobile-app/           # React Native Mobile App
├── docs/                 # Documentation
└── README.md             # Setup instructions
```

---

## 🔧 Backend (`/backend`)

**Purpose:** REST API server that handles authentication, data storage, and business logic.

### Structure

```
backend/
├── config/
│   └── db.js                    # MongoDB Atlas connection configuration
├── controllers/
│   ├── auth.controller.js       # Login & Register logic
│   └── user.controller.js       # User profile operations
├── middleware/
│   └── auth.middleware.js       # JWT token verification
├── models/
│   └── User.model.js            # MongoDB User schema
├── routes/
│   ├── auth.routes.js           # /api/auth endpoints
│   └── user.routes.js           # /api/user endpoints
├── .env                         # Environment variables (MongoDB URI, JWT secret)
├── server.js                    # Main entry point
└── package.json                 # Dependencies
```

### How It Works

1. **Server Startup** (`server.js`)
   - Loads environment variables from `.env`
   - Connects to MongoDB Atlas
   - Registers routes
   - Starts Express server on port 5000

2. **Database Connection** (`config/db.js`)
   - Uses Mongoose to connect to MongoDB Atlas
   - Connection string stored in `.env` file
   - Handles connection errors

3. **Authentication Flow**
   - **Register:** `POST /api/auth/register`
     - Receives: name, email, password, phoneNumber
     - Hashes password with bcrypt
     - Saves user to MongoDB
     - Returns JWT token
   
   - **Login:** `POST /api/auth/login`
     - Receives: email, password
     - Verifies password
     - Returns JWT token

4. **Protected Routes**
   - Uses `auth.middleware.js` to verify JWT tokens
   - Extracts user ID from token
   - Attaches user to request object

5. **User Operations**
   - `GET /api/user/me` - Get current user profile
   - Requires valid JWT token in header

### Key Files Explained

**`server.js`**
- Main application entry point
- Sets up Express middleware (CORS, JSON parsing)
- Connects to MongoDB
- Registers API routes
- Starts the server

**`models/User.model.js`**
- Defines user data structure (schema)
- Fields: name, email, password (hashed), phoneNumber
- Mongoose automatically adds _id, createdAt, updatedAt

**`controllers/auth.controller.js`**
- `register()` - Creates new user, hashes password, generates JWT
- `login()` - Validates credentials, generates JWT

**`middleware/auth.middleware.js`**
- Extracts JWT from Authorization header
- Verifies token validity
- Attaches user info to request

**`.env`**
```
MONGODB_URI=mongodb+srv://...    # MongoDB Atlas connection
JWT_SECRET=secret_key            # Token signing key
PORT=5000                        # Server port
```

---

## 📱 Mobile App (`/mobile-app`)

**Purpose:** React Native app that provides the user interface and communicates with the backend.

### Structure

```
mobile-app/
├── src/
│   ├── context/
│   │   └── AuthContext.js           # Global auth state management
│   ├── navigation/
│   │   └── AppNavigator.js          # Screen routing logic
│   ├── screens/
│   │   ├── WelcomeScreen.js         # First screen with Get Started button
│   │   ├── LoginScreen.js           # Email/password login form
│   │   ├── RegisterScreen.js        # Registration form
│   │   ├── HomeScreen.js            # Main app screen after login
│   │   └── ProfileScreen.js         # User profile and logout
│   └── services/
│       ├── api.js                   # Axios instance with JWT interceptor
│       └── authService.js           # API calls for auth operations
├── assets/                          # Images and icons
├── .env                             # API URL configuration
├── App.js                           # Root component
├── app.json                         # Expo configuration
└── package.json                     # Dependencies
```

### How It Works

1. **App Initialization** (`App.js`)
   - Wraps entire app with `AuthProvider`
   - Renders `AppNavigator`

2. **Authentication State** (`AuthContext.js`)
   - Manages global auth state (user, isAuthenticated, loading)
   - Provides login/register/logout functions
   - Stores JWT token in AsyncStorage (persistent)
   - Checks if user is logged in on app start

3. **Navigation Flow** (`AppNavigator.js`)
   - **Not Authenticated:** Shows AuthStack
     - Welcome → Login → Register
   - **Authenticated:** Shows MainTabs
     - Home (Tab 1)
     - Profile (Tab 2)

4. **API Communication** (`services/api.js`)
   - Creates Axios instance pointing to backend
   - Automatically adds JWT token to all requests
   - Base URL: `http://YOUR_IP:5000/api`

5. **Auth Service** (`services/authService.js`)
   - `login(email, password)` - Calls POST /api/auth/login
   - `register(...)` - Calls POST /api/auth/register
   - `getCurrentUser()` - Calls GET /api/user/me

### Screen Flow Explained

**WelcomeScreen**
- Entry point when not logged in
- Two buttons: "Get Started" (→ Register) or "Login"

**LoginScreen**
- Email + Password inputs
- Calls `login()` from AuthContext
- On success: JWT saved, navigates to Home
- On error: Shows alert

**RegisterScreen**
- Name, Email, Phone, Password inputs
- Calls `register()` from AuthContext
- On success: JWT saved, auto-logged in
- On error: Shows alert

**HomeScreen**
- Shows "As-salamu alaykum, Welcome [Name]"
- Placeholder cards for future features (Prayer Times, Quran, Duas)

**ProfileScreen**
- Shows user avatar (first letter of name)
- Displays name and email
- Logout button (clears token, returns to Welcome)

### Key Files Explained

**`AuthContext.js`**
- React Context for global auth state
- Functions:
  - `checkAuth()` - Runs on app start, checks for saved token
  - `login()` - Authenticates user, saves token
  - `register()` - Creates account, saves token
  - `logout()` - Removes token, resets state

**`AppNavigator.js`**
- Conditional rendering based on `isAuthenticated`
- Stack Navigator for auth flow (no back button between screens)
- Tab Navigator for main app (Home/Profile tabs)

**`api.js`**
- Axios interceptor automatically adds:
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- Base URL configured via `.env`

**`.env`**
```
API_URL=http://192.168.0.175:5000/api
```
(Replace with your computer's IP address)

---

## 🔄 How Everything Works Together

### Registration Flow (Complete Journey)

1. **User opens app** → WelcomeScreen shown
2. **Taps "Get Started"** → Navigates to RegisterScreen
3. **Fills form** → Name, Email, Phone, Password
4. **Taps "Register"**
   - RegisterScreen calls `register()` from AuthContext
5. **AuthContext.register()**
   - Calls `authService.register()`
6. **authService.register()**
   - Sends POST request to `http://YOUR_IP:5000/api/auth/register`
   - Request goes through `api.js` (Axios instance)
7. **Backend receives request** at `/api/auth/register` route
   - Routes to `auth.controller.js` → `register()` function
8. **Controller logic:**
   - Checks if email exists in MongoDB
   - Hashes password with bcrypt
   - Creates new User document
   - Saves to MongoDB Atlas
   - Generates JWT token
   - Returns `{ token, user }`
9. **Mobile app receives response**
   - `authService` returns data to `AuthContext`
   - `AuthContext` saves token to AsyncStorage
   - Sets `user` state and `isAuthenticated = true`
10. **AppNavigator re-renders**
    - Sees `isAuthenticated = true`
    - Switches from AuthStack to MainTabs
    - User now sees HomeScreen

### Login Flow

1. **User enters credentials** on LoginScreen
2. **Taps "Login"** → Calls `login()` from AuthContext
3. **API call:** POST `/api/auth/login`
4. **Backend verifies:**
   - Finds user by email in MongoDB
   - Compares hashed password with bcrypt
   - Generates JWT token
5. **Returns token** to mobile app
6. **Mobile app:**
   - Saves token to AsyncStorage
   - Updates auth state
   - Navigates to HomeScreen

### Protected API Calls

1. **User on HomeScreen** (already logged in)
2. **App needs user data**
   - Calls `authService.getCurrentUser()`
3. **API request:** GET `/api/user/me`
   - `api.js` interceptor automatically adds:
     ```
     Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```
4. **Backend receives request**
   - Route has `auth.middleware.js` protection
5. **Middleware verifies token:**
   - Decodes JWT
   - Extracts user ID
   - Finds user in MongoDB
   - Attaches to `req.user`
6. **Controller returns user data**
7. **Mobile app receives and displays**

---

## 🗄️ MongoDB Atlas Setup

**Database Structure:**
```
musafir_db (database)
└── users (collection)
    ├── _id (ObjectId)
    ├── name (String)
    ├── email (String, unique)
    ├── password (String, hashed)
    ├── phoneNumber (String, optional)
    ├── createdAt (Date)
    └── updatedAt (Date)
```

**Connection:**
- Backend connects using Mongoose
- Connection string in `backend/.env`
- IP whitelist required in Atlas dashboard

---

## 🔐 Security Features

1. **Password Hashing**
   - Uses bcrypt with salt rounds
   - Passwords never stored in plain text

2. **JWT Tokens**
   - Signed with secret key
   - Expire after 30 days
   - Verified on every protected request

3. **Protected Routes**
   - Middleware checks token validity
   - Unauthorized requests rejected

4. **CORS**
   - Backend configured to allow mobile app requests

---

## 📦 Dependencies

### Backend
- `express` - Web server framework
- `mongoose` - MongoDB object modeling
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT creation/verification
- `dotenv` - Environment variable management
- `cors` - Cross-origin requests
- `nodemon` - Auto-restart on code changes (dev)

### Mobile App
- `react-native` - Mobile UI framework
- `expo` - Development and build tools
- `@react-navigation/native` - Screen navigation
- `@react-navigation/stack` - Stack navigation
- `@react-navigation/bottom-tabs` - Tab navigation
- `axios` - HTTP requests
- `@react-native-async-storage/async-storage` - Local storage
- `react-native-screens` - Native screen primitives
- `react-native-safe-area-context` - Safe area handling

---

## 🚀 Deployment Considerations

### Current Setup (Development)
- Backend runs on localhost:5000
- Mobile app needs computer's IP address
- Both need to be on same WiFi network

### Production Setup (Future)
1. **Backend:**
   - Deploy to Render, Railway, or Heroku
   - Update `MONGODB_URI` with production connection
   - Set environment variables in hosting platform
   
2. **Mobile App:**
   - Update `API_URL` in `.env` to production backend URL
   - Build with `eas build` (Expo Application Services)
   - Submit to App Store / Play Store

---

## 🎯 Next Steps for Development

### Immediate Features to Add
1. **Prayer Times** (HomeScreen)
   - Integrate with Aladhan API
   - Get user location
   - Display 5 daily prayers

2. **Quran Reader**
   - New screen for Quran
   - Integrate Quran API
   - Arabic text + translation

3. **Profile Editing**
   - Allow users to update name, phone
   - Add profile picture upload

4. **Password Reset**
   - Forgot password flow
   - Email verification

### Code Organization Tips
- Keep components small and focused
- Add more screens in `src/screens/`
- Create reusable components in `src/components/`
- Add new API routes in backend as needed
- Use TypeScript for better type safety (optional)

---

## 🐛 Troubleshooting

**Backend won't start:**
- Check MongoDB Atlas IP whitelist
- Verify `.env` file exists
- Run `npm install` in backend folder

**Mobile app can't connect:**
- Update IP address in `mobile-app/.env`
- Ensure backend is running
- Check phone and computer on same WiFi
- Test backend with curl: `curl http://YOUR_IP:5000/api/health`

**Registration fails:**
- Check backend console for errors
- Verify MongoDB connection
- Ensure all required fields filled

---

## 📝 Summary

**Data Flow:**
```
Mobile App (React Native)
    ↓ HTTP Request
API Service (Axios)
    ↓ JWT Token attached
Backend Server (Express)
    ↓ Verify Token
MongoDB Atlas (Database)
    ↓ Return Data
Mobile App (Update UI)
```

**Authentication State:**
```
App Start → Check AsyncStorage for token
    ├── Token exists → Verify with backend → Show MainTabs
    └── No token → Show AuthStack (Welcome/Login/Register)
```

This is a clean, minimal, production-ready foundation. All core features work. Add new features incrementally by following the existing patterns.
