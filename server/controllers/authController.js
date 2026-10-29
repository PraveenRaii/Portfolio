const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Profile = require('../models/Profile');
const sendEmail = require('../utils/sendEmail');
const { normalizeAssetUrl } = require('../utils/urlHelper');

// Helper to generate token and send httpOnly cookie
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  const cookieExpireDays = Number(process.env.COOKIE_EXPIRE) || 7;
  const cookieOptions = {
    expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      message,
      token, // Also returned for mobile or Bearer header fallback
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar?.url
          ? { ...user.avatar, url: normalizeAssetUrl(user.avatar.url, req) }
          : user.avatar,
        collegeOrCompany: user.collegeOrCompany,
        savedProjects: user.savedProjects || [],
      },
    });
};

/**
 * @desc    Register a new user (Self-registration, USER role only)
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, collegeOrCompany } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    // Role is strictly locked to 'user' for public registration
    const user = await User.create({
      name,
      email,
      password,
      role: 'user',
      collegeOrCompany: collegeOrCompany || '',
      isBlocked: false,
    });

    sendTokenResponse(user, 201, res, 'Registration successful! Welcome to the portfolio platform.');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login for both USER and ADMIN
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Explicitly select password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
    }

    // Check if account is blocked
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended by the administrator.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
    }

    sendTokenResponse(user, 200, res, `Login successful. Welcome back, ${user.name}!`);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged in user details
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('savedProjects');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Keep admin avatar synchronized with Profile avatar
    if (user.role === 'admin') {
      const profile = await Profile.findOne();
      if (profile && profile.avatar?.url) {
        const isDefault =
          !user.avatar?.url ||
          user.avatar.url.includes('photo-1534528741775-53994a69daeb') ||
          user.avatar.url.includes('default-avatar');
        if (isDefault || (profile.avatar.url && user.avatar.url !== profile.avatar.url)) {
          user.avatar = profile.avatar;
          await User.findByIdAndUpdate(user._id, { avatar: profile.avatar });
        }
      }
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar?.url
          ? { ...user.avatar, url: normalizeAssetUrl(user.avatar.url, req) }
          : user.avatar,
        collegeOrCompany: user.collegeOrCompany,
        savedProjects: user.savedProjects || [],
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user & clear cookie
 * @route   POST /api/auth/logout
 * @access  Public / Private
 */
const logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Forgot Password - Send 6-digit OTP
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account registered with that email address.',
      });
    }

    // Generate 6 digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP before storing
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    user.resetPasswordOTP = hashedOtp;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save({ validateBeforeSave: false });

    // Send Email
    await sendEmail({
      to: user.email,
      subject: 'Password Reset OTP - Praveen Rai Portfolio',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 25px; line-height: 1.6; color: #1e293b; max-width: 550px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #6366f1; margin-top: 0;">Password Reset Request</h2>
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>You requested a password reset for your portfolio account. Use the one-time code below to reset your password:</p>
          <div style="background: #f1f5f9; padding: 18px; border-radius: 8px; text-align: center; margin: 25px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #4338ca;">${otp}</span>
          </div>
          <p style="font-size: 13px; color: #64748b;">This OTP is valid for <strong>15 minutes</strong>. If you did not request this, please disregard this email.</p>
        </div>
      `,
      text: `Your password reset OTP code is: ${otp}. It expires in 15 minutes.`,
    });

    res.status(200).json({
      success: true,
      message: 'Password reset OTP has been sent to your email address.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset Password via OTP
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, OTP, and new password.',
      });
    }

    const hashedOtp = crypto.createHash('sha256').update(otp.trim()).digest('hex');

    const user = await User.findOne({
      email,
      resetPasswordOTP: hashedOtp,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP code. Please request a new code.',
      });
    }

    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res, 'Password has been reset successfully! You are now logged in.');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change password while logged in
 * @route   PUT /api/auth/update-password
 * @access  Private
 */
const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password does not match.',
      });
    }

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res, 'Password updated successfully.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
};
