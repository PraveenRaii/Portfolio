const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide certificate or achievement title'],
      trim: true,
    },
    issuer: {
      type: String,
      required: [true, 'Please provide issuing organization or event'],
      trim: true,
    },
    issueDate: {
      type: String,
      required: [true, 'Issue date or year is required'],
      trim: true,
    },
    type: {
      type: String,
      default: 'Achievement Award',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    credentialUrl: {
      type: String,
      trim: true,
      default: '',
    },
    image: {
      url: {
        type: String,
        default: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&auto=format&fit=crop&q=60',
      },
      public_id: {
        type: String,
        default: '',
      },
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Certificate', certificateSchema);
