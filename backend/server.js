const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Import Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const messageRoutes = require('./routes/message.routes');
const quranRoutes = require('./routes/quran.routes');
const hadithRoutes = require('./routes/hadith.routes');
const quranSearchRoutes = require('./ml-search/routes/quran.routes');

let hadithSearchRoutes = null;
try {
  hadithSearchRoutes = require('./ml-search/routes/hadith.routes');
  console.log('✅ Hadith search routes loaded');
} catch (error) {
  console.error('❌ Error loading hadith search routes:', error.message);
  console.error(error.stack);
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
if (hadithSearchRoutes) {
  app.use('/api/hadith', hadithSearchRoutes); // Hadith semantic search - MUST be before basic hadith routes
}
app.use('/api/hadith', hadithRoutes);
app.use('/api/quran', quranSearchRoutes); // Quran semantic search - MUST be before basic quran routes
app.use('/api/quran', quranRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Islamic App API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Listen on all network interfaces

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Accessible at http://localhost:${PORT} and http://192.168.0.190:${PORT}`);
});
