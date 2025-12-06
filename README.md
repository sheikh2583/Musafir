# Musafir

Software Development Lab Project

Musafir is a basic mobile application built with React Native (Expo) for the frontend and Node.js with Express for the backend API.

## Project Structure

```
Musafir/
├── backend/           # Node.js Express API server
│   ├── index.js       # Main server file
│   └── package.json   # Backend dependencies
├── mobile/            # React Native Expo mobile app
│   ├── App.js         # Main app entry point
│   ├── app.json       # Expo configuration
│   ├── src/
│   │   ├── screens/   # Screen components
│   │   │   ├── HomeScreen.js
│   │   │   ├── DestinationsScreen.js
│   │   │   └── DestinationDetailScreen.js
│   │   └── services/  # API services
│   │       └── api.js
│   └── package.json   # Mobile app dependencies
└── README.md
```

## Features

- **Home Screen**: Welcome page with app features overview
- **Destinations List**: Browse travel destinations from API
- **Destination Details**: View detailed information about each destination
- **API Integration**: Connected to Node.js backend for data

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (for mobile development)
- Expo Go app on your mobile device (for testing)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

   The API will be available at `http://localhost:3000`

### API Endpoints

- `GET /` - Welcome message
- `GET /api/destinations` - List all destinations
- `GET /api/destinations/:id` - Get destination by ID
- `GET /api/health` - Health check

### Mobile App Setup

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npm start
   ```

4. Scan the QR code with Expo Go app on your mobile device

### Connecting Mobile App to Backend

Update the `API_BASE_URL` in `mobile/src/services/api.js` to point to your backend server. When testing on a physical device, use your computer's local network IP address instead of `localhost`.

## Technologies Used

### Frontend (Mobile)
- React Native
- Expo
- React Navigation

### Backend
- Node.js
- Express.js
- CORS

## License

ISC

