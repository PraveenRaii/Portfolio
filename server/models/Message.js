const mongoose = require('mongoose');

const messageReplySchema = new mongoose.Schema(
  {
    replyText: {
      type: String,
      required: true,
      trim: true,
    },
    repliedAt: {
      type: Date,
      default: Date.now,
    },
    repliedBy: {
      type: String,
      default: 'Praveen Rai',
    },
  },
  { _id: true }
);

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      trim: true,
      lowercase: true,
    },
    subject: {
      type: String,
      default: 'General Inquiry / Portfolio Reachout',
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please enter your message'],
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    replies: [messageReplySchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Message', messageSchema);
