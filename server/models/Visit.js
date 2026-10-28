const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema(
  {
    ip: {
      type: String,
      default: 'Unknown',
    },
    userAgent: {
      type: String,
      default: 'Unknown',
    },
    path: {
      type: String,
      default: '/',
    },
    country: {
      type: String,
      default: 'Unknown',
    },
    visitedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Visit', visitSchema);
