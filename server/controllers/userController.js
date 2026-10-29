const User = require('../models/User');
const Project = require('../models/Project');
const Testimonial = require('../models/Testimonial');
const Message = require('../models/Message');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');
const { normalizeAssetUrl } = require('../utils/urlHelper');

/**
 * @desc    Get user dashboard stats and overview
 * @route   GET /api/user/dashboard
 * @access  Private (User)
 */
const getUserDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [user, myMessagesCount, myTestimonialsCount] = await Promise.all([
      User.findById(userId).populate('savedProjects'),
      Message.countDocuments({ user: userId }),
      Testimonial.countDocuments({ user: userId }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        welcomeMessage: `Welcome back, ${user.name}!`,
        stats: {
          savedProjectsCount: user.savedProjects ? user.savedProjects.length : 0,
          messagesCount: myMessagesCount,
          testimonialsCount: myTestimonialsCount,
        },
        savedProjectsPreview: user.savedProjects ? user.savedProjects.slice(0, 3) : [],
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle project bookmark (save/unsave)
 * @route   POST /api/user/projects/:id/bookmark
 * @access  Private (User)
 */
const toggleBookmarkProject = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const user = await User.findById(req.user._id);
    const isBookmarked = user.savedProjects.some(
      (id) => id.toString() === projectId
    );

    if (isBookmarked) {
      user.savedProjects = user.savedProjects.filter(
        (id) => id.toString() !== projectId
      );
    } else {
      user.savedProjects.push(projectId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      isBookmarked: !isBookmarked,
      message: !isBookmarked
        ? 'Project added to your saved list'
        : 'Project removed from your saved list',
      savedProjects: user.savedProjects,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's saved projects
 * @route   GET /api/user/projects/saved
 * @access  Private (User)
 */
const getSavedProjects = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('savedProjects');
    res.status(200).json({
      success: true,
      count: user.savedProjects.length,
      data: user.savedProjects,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle project like
 * @route   POST /api/user/projects/:id/like
 * @access  Private (User/Admin)
 */
const toggleLikeProject = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const userId = req.user._id;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const isLiked = project.likes.some(
      (likeId) => likeId.toString() === userId.toString()
    );

    if (isLiked) {
      project.likes = project.likes.filter(
        (likeId) => likeId.toString() !== userId.toString()
      );
    } else {
      project.likes.push(userId);
    }

    await project.save();

    res.status(200).json({
      success: true,
      isLiked: !isLiked,
      likesCount: project.likes.length,
      message: !isLiked ? 'Project liked!' : 'Project unliked',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit a testimonial (pending admin approval)
 * @route   POST /api/user/testimonials
 * @access  Private (User)
 */
const submitTestimonial = async (req, res, next) => {
  try {
    const { content, rating, roleOrCompany } = req.body;
    const user = await User.findById(req.user._id);

    const testimonial = await Testimonial.create({
      user: user._id,
      name: user.name,
      roleOrCompany: roleOrCompany || user.collegeOrCompany || 'Developer',
      avatar: user.avatar?.url || '',
      content,
      rating: Number(rating) || 5,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Testimonial submitted successfully! It will appear publicly once approved by Praveen.',
      data: testimonial,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user's submitted testimonials
 * @route   GET /api/user/testimonials
 * @access  Private (User)
 */
const getMyTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Send a message to Praveen from user account
 * @route   POST /api/user/messages
 * @access  Private (User)
 */
const sendUserMessage = async (req, res, next) => {
  try {
    const { subject, message } = req.body;
    const user = await User.findById(req.user._id);

    const newMessage = await Message.create({
      name: user.name,
      email: user.email,
      subject: subject || 'User Inquiry',
      message,
      user: user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully! You can track replies in your Messages tab.',
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's message history and admin replies
 * @route   GET /api/user/messages
 * @access  Private (User)
 */
const getMyMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({
      $or: [{ user: req.user._id }, { email: req.user.email }],
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile details
 * @route   PUT /api/user/profile
 * @access  Private (User)
 */
const updateUserProfile = async (req, res, next) => {
  try {
    const { name, collegeOrCompany } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (collegeOrCompany !== undefined) user.collegeOrCompany = collegeOrCompany;

    if (req.file) {
      if (user.avatar?.public_id) {
        await deleteFromCloudinary(user.avatar.public_id, 'image');
      }
      const uploadRes = await uploadToCloudinary(req.file.buffer, {
        folder: 'portfolio/avatars',
        transformation: [{ width: 300, height: 300, crop: 'fill', gravity: 'face' }],
      });
      user.avatar = {
        url: uploadRes.secure_url,
        public_id: uploadRes.public_id,
      };
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar?.url
          ? { ...user.avatar, url: normalizeAssetUrl(user.avatar.url, req) }
          : user.avatar,
        collegeOrCompany: user.collegeOrCompany,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete current user account
 * @route   DELETE /api/user/account
 * @access  Private (User)
 */
const deleteMyAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin account cannot be deleted via user endpoint.',
      });
    }

    if (user.avatar?.public_id) {
      await deleteFromCloudinary(user.avatar.public_id, 'image');
    }

    // Pull user likes from projects
    await Project.updateMany(
      { likes: user._id },
      { $pull: { likes: user._id } }
    );

    // Remove user
    await User.findByIdAndDelete(user._id);

    // Clear authentication cookie
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: 'Your account has been permanently deleted.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
