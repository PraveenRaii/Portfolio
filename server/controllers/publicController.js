const path = require('path');
const fs = require('fs');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Education = require('../models/Education');
const Certificate = require('../models/Certificate');
const Testimonial = require('../models/Testimonial');
const Message = require('../models/Message');
const Visit = require('../models/Visit');
const sendEmail = require('../utils/sendEmail');
const { normalizeAssetUrl } = require('../utils/urlHelper');

/**
 * @desc    Get all public portfolio data in a single optimized payload
 * @route   GET /api/public/data
 * @access  Public
 */
const getPublicData = async (req, res, next) => {
  try {
    const [profile, projects, skills, education, certificates, testimonials] =
      await Promise.all([
        Profile.findOne(),
        Project.find().sort({ order: 1, createdAt: -1 }),
        Skill.find().sort({ order: 1, proficiency: -1 }),
        Education.find().sort({ order: 1, startDate: -1 }),
        Certificate.find().sort({ order: 1, issueDate: -1 }),
        Testimonial.find({ status: 'approved' }).sort({ createdAt: -1 }),
      ]);

    let formattedProfile = profile ? profile.toObject() : {};
    if (formattedProfile.avatar?.url) {
      formattedProfile.avatar.url = normalizeAssetUrl(formattedProfile.avatar.url, req);
    }
    if (formattedProfile.resume?.url) {
      formattedProfile.resume.url = normalizeAssetUrl(formattedProfile.resume.url, req);
    }

    res.status(200).json({
      success: true,
      data: {
        profile: formattedProfile,
        projects: projects || [],
        skills: skills || [],
        education: education || [],
        certificates: certificates || [],
        testimonials: testimonials || [],
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Record a visitor visit
 * @route   POST /api/public/visit
 * @access  Public
 */
const recordVisit = async (req, res, next) => {
  try {
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.socket?.remoteAddress ||
      'Unknown';
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const path = req.body.path || '/';

    await Visit.create({
      ip,
      userAgent,
      path,
      visitedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Visit logged successfully',
    });
  } catch (error) {
    // Non-blocking error
    res.status(200).json({ success: false });
  }
};

/**
 * @desc    Submit contact message from public form
 * @route   POST /api/public/contact
 * @access  Public
 */
const submitContactMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    const newMessage = await Message.create({
      name,
      email,
      subject: subject || 'Portfolio Contact Inquiry',
      message,
      user: req.user ? req.user._id : null,
    });

    // Notify Praveen via email in background
    sendEmail({
      to: process.env.ADMIN_EMAIL || 'praveen1234202040@gmail.com',
      subject: `[Portfolio Reachout]: ${subject || 'New Contact Form Message'} from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #1e293b;">
          <h2 style="color: #6366f1;">New Message Received via Portfolio</h2>
          <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
          <p><strong>Subject:</strong> ${subject || 'Portfolio Reachout'}</p>
          <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p style="white-space: pre-wrap; margin: 0;">${message}</p>
          </div>
          <p style="font-size: 12px; color: #64748b;">You can reply to this message directly from your Admin Dashboard.</p>
        </div>
      `,
      text: `From: ${name} <${email}>\nSubject: ${subject}\n\nMessage:\n${message}`,
    }).catch((err) => console.error('[Contact Notification Email Error]:', err));

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Your message has been received and Praveen will get back to you shortly.',
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get latest resume URL or download link
 * @route   GET /api/public/resume
 * @access  Public
 */
const getResumeDownload = async (req, res, next) => {
  try {
    const profile = await Profile.findOne();
    const port = process.env.PORT || 5000;
    const defaultUrl = `${process.env.BACKEND_URL || `http://localhost:${port}`}/uploads/Praveen_Rai_Resume.pdf`;

    const rawUrl =
      profile && profile.resume && profile.resume.url
        ? profile.resume.url
        : defaultUrl;

    const resumeUrl = normalizeAssetUrl(rawUrl, req);

    const fileName =
      profile && profile.resume && profile.resume.fileName
        ? profile.resume.fileName
        : 'Praveen_Rai_Resume.pdf';

    res.status(200).json({
      success: true,
      url: resumeUrl,
      fileName,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Direct download/stream resume PDF
 * @route   GET /api/public/resume/file
 * @access  Public
 */
const downloadResumeFile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne();
    const defaultLocalPath = path.join(__dirname, '../uploads/Praveen_Rai_Resume.pdf');

    if (profile && profile.resume && profile.resume.url) {
      if (profile.resume.url.startsWith('http://') || profile.resume.url.startsWith('https://')) {
        return res.redirect(profile.resume.url);
      }
    }

    if (fs.existsSync(defaultLocalPath)) {
      return res.download(defaultLocalPath, 'Praveen_Rai_Resume.pdf');
    }

    res.redirect('/uploads/Praveen_Rai_Resume.pdf');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicData,
  recordVisit,
  submitContactMessage,
  getResumeDownload,
  downloadResumeFile,
};
