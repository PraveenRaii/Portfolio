const rateLimit = require('express-rate-limit');

// General API Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Generous limit for normal portfolio navigation
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again in a few minutes',
  },
});

// High-performance limiter for Auth routes (Login / Register / Forgot Password)
// skipSuccessfulRequests: true ensures legitimate users are never throttled or delayed
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60, // Accommodates multi-user Wi-Fi / cellular shared IPs
  skipSuccessfulRequests: true, // Only failed password attempts count against the limit
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many failed authentication attempts. Please try again in 5 minutes.',
  },
});

// Stricter limiter for Contact form messages
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many messages sent. Please wait before submitting another inquiry.',
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
  contactLimiter,
};
