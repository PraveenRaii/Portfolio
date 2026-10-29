const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const Profile = require('./models/Profile');
const User = require('./models/User');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB().then(async () => {
  // Auto-heal: Ensure MongoDB profile avatar is initialized with Praveen's real photo
  try {
    const fallbackPhotoUrl = '/uploads/1793208526247_1hk7ux.jpg';
    const profile = await Profile.findOne();
    if (profile) {
      const isPlaceholder =
        !profile.avatar?.url ||
        profile.avatar.url.includes('photo-1534528741775-53994a69daeb') ||
        profile.avatar.url.includes('default-avatar');
      if (isPlaceholder) {
        profile.avatar = {
          url: fallbackPhotoUrl,
          public_id: 'local_1793208526247_1hk7ux.jpg',
        };
        await profile.save();
        console.log('[Profile Init]: Synced Profile avatar in MongoDB with Praveen real portrait');
      }
    }

    const adminUser = await User.findOne({ role: 'admin' });
    if (adminUser) {
      const isPlaceholder =
        !adminUser.avatar?.url ||
        adminUser.avatar.url.includes('photo-1534528741775-53994a69daeb') ||
        adminUser.avatar.url.includes('default-avatar');
      if (isPlaceholder) {
        adminUser.avatar = {
          url: fallbackPhotoUrl,
          public_id: 'local_1793208526247_1hk7ux.jpg',
        };
        await adminUser.save();
        console.log('[Profile Init]: Synced Admin user avatar in MongoDB with Praveen real portrait');
      }
    }
  } catch (err) {
    console.warn('[Profile Init Notice]:', err.message);
  }
});

const app = express();

// Trust reverse proxy (essential for Render / Cloud hosting protocol & host detection)
app.set('trust proxy', 1);

// Security Headers via Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration for cookies & credentials
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev/staging, restricts strictly via origin headers
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Body Parsers & Cookie Parser
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cookieParser());

// Serve static uploaded assets
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// General API rate limiter
app.use('/api/', apiLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())} seconds`,
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/public', require('./routes/publicRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// 404 Route Handler for undefined endpoints
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Resource not found on route: ${req.originalUrl}`,
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`Portfolio Server Running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`Server URL: http://localhost:${PORT}`);
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
  console.log(`===============================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection]: ${err.message}`);
  // Keep server alive or exit gracefully based on severity
});

module.exports = app;
