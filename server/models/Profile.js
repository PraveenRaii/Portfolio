const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Praveen Rai',
      trim: true,
    },
    roleTitle: {
      type: String,
      default: 'Full Stack Developer',
      trim: true,
    },
    intro: {
      type: String,
      default:
        'Passionate MERN stack developer from Lucknow, building full-stack projects with authentication, role-based access and real-world features. Actively looking for internship and placement opportunities.',
    },
    aboutText: {
      type: String,
      default:
        'I am a 3rd-year B.Tech student at Shri Ramswaroop Memorial University (SRMU), Lucknow (Powered by Sunstone). I specialize in JavaScript/TypeScript ecosystem with React, Node.js, Express, and MongoDB. I focus on clean architecture, scalable APIs, responsive UI design, and production security.',
    },
    email: {
      type: String,
      default: 'praveen1234202040@gmail.com',
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      default: '+91-XXXXXXXXXX',
      trim: true,
    },
    location: {
      type: String,
      default: 'Lucknow, Uttar Pradesh, India',
      trim: true,
    },
    avatar: {
      url: {
        type: String,
        default: '/uploads/1793208526247_1hk7ux.jpg',
      },
      public_id: {
        type: String,
        default: 'local_1793208526247_1hk7ux.jpg',
      },
    },
    resume: {
      url: {
        type: String,
        default: '/uploads/Praveen_Rai_Resume.pdf',
      },
      public_id: {
        type: String,
        default: 'local_Praveen_Rai_Resume.pdf',
      },
      fileName: {
        type: String,
        default: 'Praveen_Rai_Resume.pdf',
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
    socialLinks: {
      linkedin: {
        type: String,
        default: 'https://www.linkedin.com/in/praveen-rai-9r13/',
      },
      github: {
        type: String,
        default: 'https://github.com/PraveenRaii',
      },
      twitter: {
        type: String,
        default: 'https://twitter.com/',
      },
      leetcode: {
        type: String,
        default: 'https://leetcode.com/u/Praveen_913/',
      },
      instagram: {
        type: String,
        default: 'https://instagram.com/',
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Profile', profileSchema);
