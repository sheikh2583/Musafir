# Musafir React Frontend

A modern, responsive React Native mobile application for the Islamic community platform.

## Features

- 🔐 **Authentication**: Secure login and registration
- 🏠 **Home Dashboard**: Quick access to Islamic resources
- 🔍 **Explore**: Discover Islamic content, articles, and videos
- 👥 **Community**: Connect with fellow Muslims through discussions, groups, and events
- 👤 **Profile**: Personalized user experience and settings
- 📱 **Fully Responsive**: Optimized for all screen sizes
- 🎨 **Modern UI**: Beautiful, intuitive interface with smooth animations

## Tech Stack

- **React Native** with Expo
- **React Navigation** for routing
- **Axios** for API calls
- **AsyncStorage** for local data persistence
- **Expo Linear Gradient** for beautiful gradients
- **Ionicons** for icons

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (optional)

### Installation

1. Navigate to the react-frontend directory:
   ```bash
   cd react-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Update `.env` file with your backend API URL

### Running the App

Start the development server:
```bash
npm start
```

Or use specific platforms:
```bash
npm run android  # Run on Android
npm run ios      # Run on iOS
npm run web      # Run on Web
```

### Running with Backend

Make sure the backend server is running:
```bash
cd ../backend
npm start
```

The backend should be running on `http://localhost:5000`

## Project Structure

```
react-frontend/
├── src/
│   ├── context/           # React Context (Auth, etc.)
│   ├── navigation/        # Navigation configuration
│   ├── screens/          # App screens
│   │   ├── WelcomeScreen.js
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── HomeScreen.js
│   │   ├── ExploreScreen.js
│   │   ├── CommunityScreen.js
│   │   └── ProfileScreen.js
│   ├── services/         # API services
│   └── theme/           # Styling and theme
├── App.js               # Main app component
├── index.js            # App entry point
├── package.json
└── README.md
```

## Screens

### Authentication Flow
- **Welcome**: Onboarding screen with app introduction
- **Login**: User authentication
- **Register**: New user registration

### Main App
- **Home**: Dashboard with quick access and featured content
- **Explore**: Browse Islamic content and resources
- **Community**: Discussions, groups, and events
- **Profile**: User profile and settings

## API Integration

The app connects to the backend API at the URL specified in `.env`:
- Authentication endpoints
- User management
- Content retrieval
- Community features

## Customization

### Theme
Modify colors, typography, and spacing in `src/theme/index.js`

### API Configuration
Update API URL in `.env` file

## Development Notes

- This frontend is completely independent from the `mobile-app` folder
- Can run simultaneously with the existing mobile app
- Uses the same backend API
- Fully responsive design adapts to all screen sizes

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

Private - All rights reserved
