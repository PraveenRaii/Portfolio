const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema(
  {
    degree: {
      type: String,
      required: [true, 'Please provide degree or certificate name'],
      trim: true,
    },
    institution: {
      type: String,
      required: [true, 'Please provide institution or university name'],
      trim: true,
    },
    fieldOfStudy: {
      type: String,
      trim: true,
      default: '',
    },
    startDate: {
      type: String,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: String,
      default: 'Present',
    },
    current: {
      type: Boolean,
      default: false,
    },
    grade: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
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

module.exports = mongoose.model('Education', educationSchema);
