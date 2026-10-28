const multer = require('multer');
const path = require('path');

// Store files in memory buffer before streaming to Cloudinary
const storage = multer.memoryStorage();

// File filter for images (avatar, project cover, certificate)
const imageFileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext) || file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type! Only JPG, JPEG, PNG, WEBP, and SVG image files are allowed.'), false);
  }
};

// File filter for resume (PDF only)
const resumeFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.pdf' || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type! Only PDF files are allowed for resume upload.'), false);
  }
};

const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: imageFileFilter,
});

const uploadResume = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: resumeFileFilter,
});

module.exports = {
  uploadImage,
  uploadResume,
};
