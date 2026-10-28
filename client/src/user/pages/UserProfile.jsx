import React, { useState } from 'react';
import { FiUser, FiCamera, FiLock, FiTrash2, FiSave } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { authService } from '../../services/authService';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    collegeOrCompany: user?.collegeOrCompany || '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar?.url || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdatingProfile(true);
      const data = new FormData();
      data.append('name', formData.name);
      data.append('collegeOrCompany', formData.collegeOrCompany);
      if (avatarFile) {
        data.append('avatar', avatarFile);
      }

      const res = await userService.updateProfile(data);
      if (res.success && res.user) {
        setUser((prev) => ({ ...prev, ...res.user }));
        toast.success(res.message || 'Profile updated successfully!');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      setUpdatingPassword(true);
      const res = await authService.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      if (res.success) {
        toast.success('Password updated successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);
      const res = await userService.deleteAccount();
      if (res.success) {
        toast.success('Your account has been deleted.');
        logout();
        navigate('/login');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete account');
    } finally {
      setDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl animate-fadeIn">
      <div className="p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-card">
        <div className="flex items-center gap-2 text-indigo-500 font-mono text-xs uppercase tracking-widestTechnical font-semibold mb-1">
          <FiUser className="w-3.5 h-3.5" />
          ACCOUNT PREFERENCES
        </div>
        <h1 className="text-2xl font-heading font-extrabold text-theme-text">
          Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-theme-textMuted mt-0.5">
          Manage your personal details, profile picture, security credentials, and account settings.
        </p>
      </div>

      {/* Edit Profile Details */}
      <div className="p-6 sm:p-8 rounded-3xl border border-theme-border bg-theme-surface shadow-card space-y-6">
        <h2 className="text-base sm:text-lg font-heading font-bold text-theme-text flex items-center gap-2 pb-4 border-b border-theme-border">
          <FiUser className="text-indigo-500" />
          Personal Details &amp; Avatar
        </h2>

        <form onSubmit={handleProfileSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex items-center gap-6">
            <div className="relative group">
              <img
                src={avatarPreview || 'http://localhost:5000/uploads/1793208526247_1hk7ux.jpg'}
                alt={user?.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500/40"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 bg-black/60 text-white rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"
              >
                <FiCamera className="w-5 h-5" />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div>
              <p className="text-xs font-heading font-bold text-theme-text">Profile Photo</p>
              <p className="text-[11px] font-mono text-theme-textMuted mt-0.5">
                PNG, JPG or WEBP. Uploaded securely to Cloudinary asset storage.
              </p>
              <label
                htmlFor="avatar-upload"
                className="inline-block mt-2 text-xs font-mono font-semibold text-indigo-500 hover:underline cursor-pointer"
              >
                Choose new photo
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
                Email Address (Read-only)
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary/50 text-theme-textMuted text-xs font-mono cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
              College or Company
            </label>
            <input
              type="text"
              value={formData.collegeOrCompany}
              onChange={(e) =>
                setFormData({ ...formData, collegeOrCompany: e.target.value })
              }
              placeholder="e.g. SRMU Lucknow / Tech Innovators"
              className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={FiSave}
            isLoading={updatingProfile}
          >
            Save Profile Changes
          </Button>
        </form>
      </div>

      {/* Change Password */}
      <div className="p-6 sm:p-8 rounded-3xl border border-theme-border bg-theme-surface shadow-card space-y-6">
        <h2 className="text-base sm:text-lg font-heading font-bold text-theme-text flex items-center gap-2 pb-4 border-b border-theme-border">
          <FiLock className="text-cyan-500" />
          Update Security Password
        </h2>

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, currentPassword: e.target.value })
              }
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
                New Password
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                required
                placeholder="Min 6 characters"
                className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                required
                placeholder="Repeat new password"
                className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="secondary"
            size="md"
            isLoading={updatingPassword}
          >
            Update Password
          </Button>
        </form>
      </div>

      {/* Danger Zone: Delete Account */}
      <div className="p-6 rounded-3xl border border-rose-500/30 bg-rose-500/5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-heading font-bold text-rose-500">
            Delete Account Permanently
          </h3>
          <p className="text-xs text-theme-textMuted mt-0.5">
            Once deleted, all your saved projects, messages and account records will be permanently erased.
          </p>
        </div>
        <Button
          variant="danger"
          size="sm"
          icon={FiTrash2}
          onClick={() => setIsDeleteModalOpen(true)}
        >
          Delete Account
        </Button>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Account Deletion"
      >
        <div className="space-y-4">
          <p className="text-sm text-theme-text leading-relaxed">
            Are you sure you want to permanently delete your account? This action is irreversible.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={deleting}
              onClick={handleDeleteAccount}
            >
              Yes, Delete Permanently
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserProfile;
