const User = require('../models/User');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Education = require('../models/Education');
const Certificate = require('../models/Certificate');
const Testimonial = require('../models/Testimonial');
const Message = require('../models/Message');
const Profile = require('../models/Profile');
const Visit = require('../models/Visit');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');
const sendEmail = require('../utils/sendEmail');

// ==========================================
// 1. DASHBOARD & ANALYTICS
// ==========================================

const getAdminDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalProjects, totalMessages, totalVisits, unreadMessages, pendingTestimonials] =
      await Promise.all([
        User.countDocuments({ role: 'user' }),
        Project.countDocuments(),
        Message.countDocuments(),
        Visit.countDocuments(),
        Message.countDocuments({ isRead: false }),
        Testimonial.countDocuments({ status: 'pending' }),
      ]);

    // Last 7 days visit analytics
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const visitsLast7Days = await Visit.aggregate([
      {
        $match: {
          visitedAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$visitedAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Most liked projects (Top 5)
    const mostLikedProjects = await Project.aggregate([
      {
        $project: {
          title: 1,
          likesCount: { $size: '$likes' },
          image: 1,
          isFeatured: 1,
        },
      },
      { $sort: { likesCount: -1 } },
      { $limit: 5 },
    ]);

    // Recent 5 messages
    const recentMessages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        counts: {
          totalUsers,
          totalProjects,
          totalMessages,
          totalVisits,
          unreadMessages,
          pendingTestimonials,
        },
        visitsLast7Days,
        mostLikedProjects,
        recentMessages,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 2. PROJECTS MANAGEMENT
// ==========================================

const getAllAdminProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
};

const createProject = async (req, res, next) => {
  try {
    const { title, description, longDescription, tags, liveUrl, githubUrl, order, isFeatured } = req.body;

    let imageData = {
      url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60',
      public_id: '',
    };

    if (req.file) {
      const uploadRes = await uploadToCloudinary(req.file.buffer, {
        folder: 'portfolio/projects',
      });
      imageData = {
        url: uploadRes.secure_url,
        public_id: uploadRes.public_id,
      };
    }

    const tagsArray = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
      ? tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const project = await Project.create({
      title,
      description,
      longDescription,
      image: imageData,
      tags: tagsArray,
      liveUrl,
      githubUrl,
      order: Number(order) || 0,
      isFeatured: isFeatured === 'true' || isFeatured === true,
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const { title, description, longDescription, tags, liveUrl, githubUrl, order, isFeatured } = req.body;

    if (title) project.title = title;
    if (description) project.description = description;
    if (longDescription !== undefined) project.longDescription = longDescription;
    if (liveUrl !== undefined) project.liveUrl = liveUrl;
    if (githubUrl !== undefined) project.githubUrl = githubUrl;
    if (order !== undefined) project.order = Number(order);
    if (isFeatured !== undefined) project.isFeatured = isFeatured === 'true' || isFeatured === true;

    if (tags !== undefined) {
      project.tags = Array.isArray(tags)
        ? tags
        : typeof tags === 'string'
        ? tags.split(',').map((t) => t.trim()).filter(Boolean)
        : project.tags;
    }

    if (req.file) {
      if (project.image?.public_id) {
        await deleteFromCloudinary(project.image.public_id, 'image');
      }
      const uploadRes = await uploadToCloudinary(req.file.buffer, {
        folder: 'portfolio/projects',
      });
      project.image = {
        url: uploadRes.secure_url,
        public_id: uploadRes.public_id,
      };
    }

    await project.save();

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.image?.public_id) {
      await deleteFromCloudinary(project.image.public_id, 'image');
    }

    // Pull from savedProjects in users
    await User.updateMany(
      { savedProjects: project._id },
      { $pull: { savedProjects: project._id } }
    );

    await Project.findByIdAndDelete(project._id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const reorderProjects = async (req, res, next) => {
  try {
    const { orders } = req.body; // Array of { id: string, order: number }
    if (!Array.isArray(orders)) {
      return res.status(400).json({ success: false, message: 'Invalid orders array' });
    }

    const updates = orders.map((item) =>
      Project.findByIdAndUpdate(item.id, { order: item.order })
    );
    await Promise.all(updates);

    res.status(200).json({
      success: true,
      message: 'Projects reordered successfully',
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 3. SKILLS MANAGEMENT
// ==========================================

const getAdminSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find().sort({ order: 1, proficiency: -1 });
    res.status(200).json({ success: true, count: skills.length, data: skills });
  } catch (error) {
    next(error);
  }
};

const createSkill = async (req, res, next) => {
  try {
    const { name, category, level, proficiency, icon, order } = req.body;
    const skill = await Skill.create({
      name,
      category,
      level,
      proficiency: Number(proficiency) || 80,
      icon: icon || 'SiCode',
      order: Number(order) || 0,
    });
    res.status(201).json({ success: true, message: 'Skill created successfully', data: skill });
  } catch (error) {
    next(error);
  }
};

const updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });
    res.status(200).json({ success: true, message: 'Skill updated successfully', data: skill });
  } catch (error) {
    next(error);
  }
};

const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });
    res.status(200).json({ success: true, message: 'Skill deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 4. EDUCATION & CERTIFICATES MANAGEMENT
// ==========================================

const createEducation = async (req, res, next) => {
  try {
    const education = await Education.create(req.body);
    res.status(201).json({ success: true, message: 'Education added successfully', data: education });
  } catch (error) {
    next(error);
  }
};

const updateEducation = async (req, res, next) => {
  try {
    const education = await Education.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!education) return res.status(404).json({ success: false, message: 'Education record not found' });
    res.status(200).json({ success: true, message: 'Education updated successfully', data: education });
  } catch (error) {
    next(error);
  }
};

const deleteEducation = async (req, res, next) => {
  try {
    const education = await Education.findByIdAndDelete(req.params.id);
    if (!education) return res.status(404).json({ success: false, message: 'Education record not found' });
    res.status(200).json({ success: true, message: 'Education record deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const createCertificate = async (req, res, next) => {
  try {
    const { title, issuer, issueDate, credentialUrl, order } = req.body;
    let imageData = {
      url: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&auto=format&fit=crop&q=60',
      public_id: '',
    };

    if (req.file) {
      const uploadRes = await uploadToCloudinary(req.file.buffer, {
        folder: 'portfolio/certificates',
      });
      imageData = {
        url: uploadRes.secure_url,
        public_id: uploadRes.public_id,
      };
    }

    const certificate = await Certificate.create({
      title,
      issuer,
      issueDate,
      credentialUrl,
      image: imageData,
      order: Number(order) || 0,
    });

    res.status(201).json({ success: true, message: 'Certificate created successfully', data: certificate });
  } catch (error) {
    next(error);
  }
};

const updateCertificate = async (req, res, next) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found' });

    const { title, issuer, issueDate, credentialUrl, order } = req.body;
    if (title) cert.title = title;
    if (issuer) cert.issuer = issuer;
    if (issueDate) cert.issueDate = issueDate;
    if (credentialUrl !== undefined) cert.credentialUrl = credentialUrl;
    if (order !== undefined) cert.order = Number(order);

    if (req.file) {
      if (cert.image?.public_id) {
        await deleteFromCloudinary(cert.image.public_id, 'image');
      }
      const uploadRes = await uploadToCloudinary(req.file.buffer, {
        folder: 'portfolio/certificates',
      });
      cert.image = {
        url: uploadRes.secure_url,
        public_id: uploadRes.public_id,
      };
    }

    await cert.save();
    res.status(200).json({ success: true, message: 'Certificate updated successfully', data: cert });
  } catch (error) {
    next(error);
  }
};

const deleteCertificate = async (req, res, next) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found' });

    if (cert.image?.public_id) {
      await deleteFromCloudinary(cert.image.public_id, 'image');
    }
    await Certificate.findByIdAndDelete(cert._id);
    res.status(200).json({ success: true, message: 'Certificate deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 5. USERS MANAGEMENT
// ==========================================

const getAllUsers = async (req, res, next) => {
  try {
    const search = req.query.search || '';
    const query = {
      role: 'user',
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { collegeOrCompany: { $regex: search, $options: 'i' } },
      ],
    };

    const users = await User.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

const toggleBlockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Admin accounts cannot be blocked.' });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      success: true,
      message: user.isBlocked ? 'User has been blocked' : 'User has been unblocked',
      isBlocked: user.isBlocked,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUserByAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Admin accounts cannot be deleted.' });
    }

    if (user.avatar?.public_id) {
      await deleteFromCloudinary(user.avatar.public_id, 'image');
    }

    await Project.updateMany({ likes: user._id }, { $pull: { likes: user._id } });
    await User.findByIdAndDelete(user._id);

    res.status(200).json({ success: true, message: 'User deleted successfully by Admin' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 6. TESTIMONIALS MANAGEMENT
// ==========================================

const getAllAdminTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find()
      .populate('user', 'name email avatar')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
  } catch (error) {
    next(error);
  }
};

const updateTestimonialStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found' });

    res.status(200).json({
      success: true,
      message: `Testimonial status updated to ${status}`,
      data: testimonial,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    res.status(200).json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 7. MESSAGES INBOX & EMAIL REPLIES
// ==========================================

const getAllAdminMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    next(error);
  }
};

const markMessageAsRead = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    res.status(200).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};

const replyToMessage = async (req, res, next) => {
  try {
    const { replyText } = req.body;
    if (!replyText || !replyText.trim()) {
      return res.status(400).json({ success: false, message: 'Reply text cannot be empty' });
    }

    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });

    // Push reply into message record
    message.replies.push({
      replyText,
      repliedAt: new Date(),
      repliedBy: req.user.name || 'Praveen Rai',
    });
    message.isRead = true;
    await message.save();

    // Dispatch email to sender using Nodemailer
    await sendEmail({
      to: message.email,
      subject: `Re: ${message.subject} - Praveen Rai`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #1e293b;">
          <h2 style="color: #6366f1;">Reply from Praveen Rai</h2>
          <p>Hi <strong>${message.name}</strong>,</p>
          <div style="background: #f8fafc; border-left: 4px solid #6366f1; padding: 15px; margin: 15px 0;">
            <p style="margin: 0; white-space: pre-wrap;">${replyText}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 13px; color: #64748b;"><strong>Your original message:</strong></p>
          <blockquote style="font-size: 13px; color: #64748b; margin: 0; padding-left: 10px; border-left: 2px solid #cbd5e1;">
            ${message.message}
          </blockquote>
          <br />
          <p style="font-size: 13px; color: #334155;">Best regards,<br /><strong>Praveen Rai</strong><br />Full Stack Developer</p>
        </div>
      `,
      text: `Hi ${message.name},\n\n${replyText}\n\nOriginal message:\n${message.message}\n\nBest regards,\nPraveen Rai`,
    });

    res.status(200).json({
      success: true,
      message: 'Reply sent successfully and emailed to the recipient',
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    res.status(200).json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 8. PROFILE & SITE SETTINGS
// ==========================================

const getAdminProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({});
    }
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

const updateAdminProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile({});
    }

    const {
      name,
      roleTitle,
      intro,
      aboutText,
      email,
      phone,
      location,
      linkedin,
      github,
      twitter,
      leetcode,
      instagram,
    } = req.body;

    if (name) profile.name = name;
    if (roleTitle) profile.roleTitle = roleTitle;
    if (intro) profile.intro = intro;
    if (aboutText) profile.aboutText = aboutText;
    if (email) profile.email = email;
    if (phone !== undefined) profile.phone = phone;
    if (location) profile.location = location;

    profile.socialLinks = {
      linkedin: linkedin || profile.socialLinks?.linkedin || '',
      github: github || profile.socialLinks?.github || '',
      twitter: twitter || profile.socialLinks?.twitter || '',
      leetcode: leetcode || profile.socialLinks?.leetcode || '',
      instagram: instagram || profile.socialLinks?.instagram || '',
    };

    if (req.file) {
      if (profile.avatar?.public_id) {
        await deleteFromCloudinary(profile.avatar.public_id, 'image');
      }
      const uploadRes = await uploadToCloudinary(req.file.buffer, {
        folder: 'portfolio/profile',
      });
      profile.avatar = {
        url: uploadRes.secure_url,
        public_id: uploadRes.public_id,
      };
      if (req.user) {
        await User.findByIdAndUpdate(req.user._id, { avatar: profile.avatar });
      }
    } else if (req.body.avatarUrl && req.body.avatarUrl.trim() !== '') {
      profile.avatar = {
        url: req.body.avatarUrl.trim(),
        public_id: '',
      };
      if (req.user) {
        await User.findByIdAndUpdate(req.user._id, { avatar: profile.avatar });
      }
    }

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Profile settings updated successfully',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 9. RESUME MANAGER
// ==========================================

const uploadResumePDF = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF file' });
    }

    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({});
    }

    // Delete old resume if present in Cloudinary
    if (profile.resume?.public_id) {
      await deleteFromCloudinary(profile.resume.public_id, 'raw');
    }

    // Upload new resume as raw PDF to Cloudinary
    const uploadRes = await uploadToCloudinary(req.file.buffer, {
      folder: 'portfolio/resumes',
      resource_type: 'raw',
    });

    profile.resume = {
      url: uploadRes.secure_url,
      public_id: uploadRes.public_id,
      fileName: req.file.originalname || 'Praveen_Rai_Resume.pdf',
      updatedAt: new Date(),
    };

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Resume PDF uploaded and published successfully!',
      data: profile.resume,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
