import React, { useState, useEffect } from 'react';
import {
  FiSave,
  FiUploadCloud,
  FiDownload,
  FiFileText,
  FiCamera,
  FiGlobe,
  FiSettings,
} from 'react-icons/fi';
import { SiLeetcode } from 'react-icons/si';
import { adminService } from '../../services/adminService';
import Button from '../../components/common/Button';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Profile Form State
  const [formData, setFormData] = useState({
    name: 'Praveen Rai',
    roleTitle: 'Full Stack Developer',
    intro: '',
    aboutText: '',
    email: 'praveen1234202040@gmail.com',
    phone: '',
    location: 'Lucknow, Uttar Pradesh, India',
    linkedin: 'https://www.linkedin.com/in/praveen-rai-9r13/',
    github: 'https://github.com/PraveenRaii',
    twitter: '',
    leetcode: 'https://leetcode.com/u/Praveen_913/',
    instagram: '',
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Resume Upload State
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await adminService.getProfile();
      if (res.success && res.data) {
        const p = res.data;
        setProfile(p);
        setFormData({
          name: p.name || 'Praveen Rai',
          roleTitle: p.roleTitle || 'Full Stack Developer',
          intro: p.intro || '',
          aboutText: p.aboutText || '',
          email: p.email || 'praveen1234202040@gmail.com',
          phone: p.phone || '',
          location: p.location || 'Lucknow, Uttar Pradesh, India',
          linkedin: p.socialLinks?.linkedin || '',
          github: p.socialLinks?.github || '',
          twitter: p.socialLinks?.twitter || '',
          leetcode: p.socialLinks?.leetcode || 'https://leetcode.com/u/Praveen_913/',
          instagram: p.socialLinks?.instagram || '',
        });
        setAvatarPreview(p.avatar?.url || '');
      }
    } catch (err) {
      toast.error('Failed to load profile details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

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
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (avatarFile) {
        data.append('avatar', avatarFile);
      }

      const res = await adminService.updateProfile(data);
      if (res.success) {
        toast.success(res.message);
        fetchProfile();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      toast.error('Please select a PDF resume file to upload');
      return;
    }

    try {
      setUploadingResume(true);
      const data = new FormData();
      data.append('resume', resumeFile);

      const res = await adminService.uploadResume(data);
      if (res.success) {
        toast.success(res.message || 'Resume PDF published successfully!');
        setResumeFile(null);
        fetchProfile();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to upload resume PDF');
    } finally {
      setUploadingResume(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton count={4} />;
  }

  return (
    <div className="space-y-8 max-w-5xl animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-card">
        <div>
          <div className="flex items-center gap-2 text-indigo-500 font-mono text-xs uppercase tracking-widestTechnical font-semibold mb-1">
            <FiSettings className="w-3.5 h-3.5" />
            CORE CONFIGURATION
          </div>
          <h1 className="text-2xl font-heading font-extrabold text-theme-text">
            Portfolio Profile &amp; Resume Manager
          </h1>
          <p className="text-xs sm:text-sm text-theme-textMuted mt-0.5">
            Update public bio, social URLs, avatar picture, and upload latest PDF resume to Cloudinary.
          </p>
        </div>
      </div>

      {/* Resume Management Card */}
      <div className="p-6 sm:p-8 rounded-3xl border-2 border-indigo-500/30 bg-theme-surface shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-theme-border">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <FiFileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-heading font-bold text-theme-text">
                  Resume PDF Document
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                  Ready for Download
                </span>
              </div>
              <p className="text-xs text-theme-textMuted font-mono mt-0.5">
                Current File: <span className="font-semibold text-theme-text">{profile?.resume?.fileName || 'Praveen_Rai_Resume.pdf'}</span>
                {profile?.resume?.updatedAt &&
                  ` &bull; Last Published: ${new Date(profile.resume.updatedAt).toLocaleDateString()}`}
              </p>
            </div>
          </div>

          <a
            href={profile?.resume?.url || 'http://localhost:5000/uploads/Praveen_Rai_Resume.pdf'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold transition-all shadow-glowSm"
          >
            <FiDownload className="w-4 h-4" />
            Download / View Current PDF
          </a>
        </div>

        <div>
          <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-2">
            Upload &amp; Publish a New PDF Resume:
          </label>
          <form onSubmit={handleResumeUpload} className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setResumeFile(e.target.files[0])}
              className="w-full sm:w-auto text-xs font-mono text-theme-textMuted file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-mono file:font-semibold file:bg-indigo-500/10 file:text-indigo-500 hover:file:bg-indigo-500/20"
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={FiUploadCloud}
              isLoading={uploadingResume}
              disabled={!resumeFile}
              className="w-full sm:w-auto"
            >
              Upload &amp; Publish Resume
            </Button>
          </form>
          {resumeFile && (
            <p className="text-xs text-emerald-500 font-mono font-medium mt-2">
              Selected: {resumeFile.name} ({(resumeFile.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </div>
      </div>

      {/* Main Settings Form */}
      <form
        onSubmit={handleProfileSubmit}
        className="p-6 sm:p-8 rounded-3xl border border-theme-border bg-theme-surface shadow-card space-y-6"
      >
        <div className="flex items-center gap-3 pb-4 border-b border-theme-border">
          <FiGlobe className="w-5 h-5 text-indigo-500" />
          <h2 className="text-base font-heading font-bold text-theme-text">
            General Site Information
          </h2>
        </div>

        {/* Avatar Upload */}
        <div className="flex items-center gap-6">
          <div className="relative group">
            <img
              src={avatarPreview || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'}
              alt="Avatar"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500/40"
            />
            <label
              htmlFor="admin-avatar-upload"
              className="absolute inset-0 bg-black/60 text-white rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"
            >
              <FiCamera className="w-5 h-5" />
            </label>
            <input
              id="admin-avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <div>
            <p className="text-xs font-heading font-bold text-theme-text">Profile Avatar</p>
            <p className="text-[11px] font-mono text-theme-textMuted mt-0.5">
              Click photo to replace. Handled via Cloudinary asset storage or local uploads.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
              Full Name *
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
              Role Title *
            </label>
            <input
              type="text"
              value={formData.roleTitle}
              onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
            Hero Intro Hook
          </label>
          <textarea
            rows={2}
            value={formData.intro}
            onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-sans"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
            About Section Detailed Text
          </label>
          <textarea
            rows={4}
            value={formData.aboutText}
            onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-sans"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
              Phone
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91-..."
              className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="pt-2">
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-indigo-500 mb-3">
            Social &amp; Developer Links
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-theme-textMuted mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-theme-textMuted mb-1">GitHub URL</label>
              <input
                type="url"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-amber-500 font-semibold mb-1 flex items-center gap-1">
                <SiLeetcode className="w-3.5 h-3.5" />
                LeetCode Profile URL
              </label>
              <input
                type="url"
                value={formData.leetcode}
                onChange={(e) => setFormData({ ...formData, leetcode: e.target.value })}
                placeholder="https://leetcode.com/u/Praveen_913/"
                className="w-full px-4 py-2 rounded-xl border border-amber-500/40 bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-theme-border flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={FiSave}
            isLoading={updatingProfile}
          >
            Save All Profile Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
