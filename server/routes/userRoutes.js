const express = require('express');
const router = express.Router();
const {
  getUserDashboard,
  toggleBookmarkProject,
  getSavedProjects,
  toggleLikeProject,
  submitTestimonial,
  getMyTestimonials,
  sendUserMessage,
  getMyMessages,
  updateUserProfile,
  deleteMyAccount,
} = require('../controllers/userController');
const { verifyToken, isUser } = require('../middleware/authMiddleware');
const { uploadImage } = require('../middleware/upload');
const { testimonialValidator } = require('../middleware/validators');

// All routes here require valid JWT token and active user role
router.use(verifyToken, isUser);

router.get('/dashboard', getUserDashboard);

// Saved and Liked projects
router.get('/projects/saved', getSavedProjects);
router.post('/projects/:id/bookmark', toggleBookmarkProject);
router.post('/projects/:id/like', toggleLikeProject);

// Testimonials
router.get('/testimonials', getMyTestimonials);
router.post('/testimonials', testimonialValidator, submitTestimonial);

// Messages
router.get('/messages', getMyMessages);
router.post('/messages', sendUserMessage);

// Profile & Account
router.put('/profile', uploadImage.single('avatar'), updateUserProfile);
router.delete('/account', deleteMyAccount);

module.exports = router;
