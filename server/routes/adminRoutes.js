const express = require('express');
const router = express.Router();
const {
  getAdminDashboardStats,
  getAllAdminProjects,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
  getAdminSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  createEducation,
  updateEducation,
  deleteEducation,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  getAllUsers,
  toggleBlockUser,
  deleteUserByAdmin,
  getAllAdminTestimonials,
  updateTestimonialStatus,
  deleteTestimonial,
  getAllAdminMessages,
  markMessageAsRead,
  replyToMessage,
  deleteMessage,
  getAdminProfile,
  updateAdminProfile,
  uploadResumePDF,
} = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const { uploadImage, uploadResume } = require('../middleware/upload');
const { projectValidator, skillValidator } = require('../middleware/validators');

// All routes here strictly require Admin role
router.use(verifyToken, isAdmin);

// 1. Dashboard
router.get('/dashboard', getAdminDashboardStats);

// 2. Projects
router.get('/projects', getAllAdminProjects);
router.post('/projects', uploadImage.single('image'), projectValidator, createProject);
router.put('/projects/:id', uploadImage.single('image'), updateProject);
router.delete('/projects/:id', deleteProject);
router.put('/projects-reorder', reorderProjects);

// 3. Skills
router.get('/skills', getAdminSkills);
router.post('/skills', skillValidator, createSkill);
router.put('/skills/:id', updateSkill);
router.delete('/skills/:id', deleteSkill);

// 4. Education
router.post('/education', createEducation);
router.put('/education/:id', updateEducation);
router.delete('/education/:id', deleteEducation);

// 5. Certificates
router.post('/certificates', uploadImage.single('image'), createCertificate);
router.put('/certificates/:id', uploadImage.single('image'), updateCertificate);
router.delete('/certificates/:id', deleteCertificate);

// 6. Users
router.get('/users', getAllUsers);
router.patch('/users/:id/block', toggleBlockUser);
router.delete('/users/:id', deleteUserByAdmin);

// 7. Testimonials
router.get('/testimonials', getAllAdminTestimonials);
router.patch('/testimonials/:id/status', updateTestimonialStatus);
router.delete('/testimonials/:id', deleteTestimonial);

// 8. Messages
router.get('/messages', getAllAdminMessages);
router.patch('/messages/:id/read', markMessageAsRead);
router.post('/messages/:id/reply', replyToMessage);
router.delete('/messages/:id', deleteMessage);

// 9. Profile & Resume
router.get('/profile', getAdminProfile);
router.put('/profile', uploadImage.single('avatar'), updateAdminProfile);
router.post('/resume', uploadResume.single('resume'), uploadResumePDF);

module.exports = router;
