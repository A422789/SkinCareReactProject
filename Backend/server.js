const dotenv = require('dotenv');
// Load env vars
dotenv.config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const paymentTypeRoutes = require('./routes/paymentTypeRoutes');
const orderRoutes = require('./routes/orderRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const messageRoutes = require('./routes/messageRoutes');
const whatsappRoutes = require('./routes/whatsappRoutes');
const { initWhatsApp } = require('./utils/whatsapp');
const logger = require('./utils/logger');
const { globalLimiter, authLimiter } = require('./middleware/rateLimiter');
const crypto = require('crypto');
const { encryptSessionData, decryptSessionData } = require('./utils/sessionCrypto');

const { ForbiddenError } = require('./utils/customErrors');

// Connect to database, then initialize WhatsApp
connectDB().then(() => {
  initWhatsApp();
});

const app = express();

// Trust Railway's reverse proxy for correct IP detection (required for rate limiting)
app.set('trust proxy', 1);

const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.DASHBOARD_URL, process.env.WEBPAGE_URL].filter(Boolean)
  : ['http://localhost:5173', 'http://localhost:5174',];

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const localAllowed = ['http://localhost:5173', 'http://localhost:5174'];
    if (localAllowed.includes(origin) || origin === 'null') {
      return callback(null, true);
    }
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new ForbiddenError('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type, Authorization',
  exposedHeaders: 'Content-Length, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset',
  maxAge: 600, // Cache preflight requests for 10 minutes
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Global Rate Limiter
app.use(globalLimiter);

// Session Configuration using MongoStore
app.use(
  session({
    genid: (req) => crypto.randomUUID(),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',
      serialize: (sessionData) => {
        const dataStr = JSON.stringify(sessionData);
        const encrypted = encryptSessionData(dataStr, process.env.SESSION_SECRET);
        return { data: encrypted };
      },
      unserialize: (storedData) => {
        if (storedData && storedData.data) {
          const decrypted = decryptSessionData(storedData.data, process.env.SESSION_SECRET);
          return JSON.parse(decrypted);
        }
        return storedData;
      }
    }),
    cookie: {
      maxAge: 12 * 60 * 60 * 1000, // 12 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    },
  })
);

const analyticsRoutes = require('./routes/analyticsRoutes');

const notificationRoutes = require('./routes/notificationRoutes');

// Routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/payment-types', paymentTypeRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/whatsapp', whatsappRoutes);

// Base Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = app;
