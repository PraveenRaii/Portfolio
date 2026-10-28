const { body, validationResult } = require('express-validator');

const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    return res.status(400).json({
      success: false,
      message: formattedErrors[0]?.message || 'Validation error',
      errors: formattedErrors,
    });
  }
  next();
};

const registerValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 60 })
    .withMessage('Name cannot exceed 60 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  validateResult,
];

const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validateResult,
];

const contactValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Valid email is required'),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ min: 5 }).withMessage('Message must be at least 5 characters long'),
  validateResult,
];

const testimonialValidator = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Testimonial content is required')
    .isLength({ min: 10, max: 600 })
    .withMessage('Testimonial must be between 10 and 600 characters'),
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
  validateResult,
];

const projectValidator = [
  body('title').trim().notEmpty().withMessage('Project title is required'),
  body('description').trim().notEmpty().withMessage('Short description is required'),
  validateResult,
];

const skillValidator = [
  body('name').trim().notEmpty().withMessage('Skill name is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  validateResult,
];

module.exports = {
  validateResult,
  registerValidator,
  loginValidator,
  contactValidator,
  testimonialValidator,
  projectValidator,
  skillValidator,
};
