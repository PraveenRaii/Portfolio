const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide skill name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please specify skill category'],
      enum: ['Frontend', 'Backend', 'Database', 'Tools & DevOps', 'Languages', 'Other'],
      default: 'Frontend',
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Intermediate',
    },
    proficiency: {
      type: Number,
      min: 0,
      max: 100,
      default: 80,
    },
    icon: {
      type: String,
      default: 'SiCode',
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

module.exports = mongoose.model('Skill', skillSchema);
