import React, { useState, useEffect } from 'react';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiBookOpen,
  FiAward,
  FiExternalLink,
  FiUploadCloud,
  FiImage,
  FiEye,
  FiCheckCircle,
} from 'react-icons/fi';
import { adminService } from '../../services/adminService';
import { publicService } from '../../services/publicService';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';
import { getAssetUrl, compressImageFile } from '../../utils/imageUrl';

const achievementTypes = [
  'Hackathon Attended',
  'College Life & Campus',
  'Hackathon Award',
  'Academic Honor',
  'Official Achievement Award',
  'Professional Certification',
  'Coding Competition',
  'Special Recognition',
];

const AdminEducationCertificates = () => {
  const [activeTab, setActiveTab] = useState('achievements');
  const [educationList, setEducationList] = useState([]);
  const [certList, setCertList] = useState([]);
  const [selectedAdminFilter, setSelectedAdminFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Education modal state
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [editingEduId, setEditingEduId] = useState(null);
  const [eduForm, setEduForm] = useState({
    degree: '',
    institution: '',
    startDate: '',
    endDate: 'Present',
    current: true,
    grade: '',
    description: '',
  });

  // Achievement / Certificate modal state
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [editingCertId, setEditingCertId] = useState(null);
  const [certForm, setCertForm] = useState({
    title: '',
    issuer: '',
    issueDate: '',
    type: 'Official Achievement Award',
    description: '',
    skills: '',
    credentialUrl: '',
    imageUrl: '',
  });
  const [certFile, setCertFile] = useState(null);
  const [certPreview, setCertPreview] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await publicService.getPortfolioData();
      if (res.success && res.data) {
        setEducationList(res.data.education || []);
        setCertList(res.data.certificates || []);
      }
    } catch (err) {
      toast.error('Failed to load records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Education Handlers
  const openAddEdu = () => {
    setEditingEduId(null);
    setEduForm({
      degree: '',
      institution: '',
      startDate: '',
      endDate: 'Present',
      current: true,
      grade: '',
      description: '',
    });
    setIsEduModalOpen(true);
  };

  const openEditEdu = (item) => {
    setEditingEduId(item._id);
    setEduForm({
      degree: item.degree,
      institution: item.institution,
      startDate: item.startDate,
      endDate: item.endDate || 'Present',
      current: item.current || false,
      grade: item.grade || '',
      description: item.description || '',
    });
    setIsEduModalOpen(true);
  };

  const handleEduSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      let res;
      if (editingEduId) {
        res = await adminService.updateEducation(editingEduId, eduForm);
      } else {
        res = await adminService.createEducation(eduForm);
      }
      if (res.success) {
        toast.success(res.message);
        setIsEduModalOpen(false);
        fetchData();
      }
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEduDelete = async (id) => {
    if (!window.confirm('Delete this education entry?')) return;
    try {
      const res = await adminService.deleteEducation(id);
      if (res.success) {
        toast.success('Education record removed');
        setEducationList((prev) => prev.filter((e) => e._id !== id));
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  // Achievement / Certificate Handlers
  const openAddCert = () => {
    setEditingCertId(null);
    setCertForm({
      title: '',
      issuer: 'SRMU Lucknow / Sunstone',
      issueDate: '2024',
      type: 'Official Achievement Award',
      description: '',
      skills: '',
      credentialUrl: '',
      imageUrl: '',
    });
    setCertFile(null);
    setCertPreview('');
    setIsCertModalOpen(true);
  };

  const openEditCert = (item) => {
    setEditingCertId(item._id);
    setCertForm({
      title: item.title || '',
      issuer: item.issuer || '',
      issueDate: item.issueDate || '',
      type: item.type || 'Official Achievement Award',
      description: item.description || '',
      skills: Array.isArray(item.skills) ? item.skills.join(', ') : item.skills || '',
      credentialUrl: item.credentialUrl || '',
      imageUrl: item.image?.url || '',
    });
    setCertFile(null);
    setCertPreview(getAssetUrl(item.image?.url) || '');
    setIsCertModalOpen(true);
  };

  const handleCertFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file, { maxWidth: 1600, quality: 0.85 });
        setCertFile(compressed);
        setCertPreview(URL.createObjectURL(compressed));
        toast.success(`Photo compressed (${(compressed.size / 1024).toFixed(0)} KB)`);
      } catch (err) {
        setCertFile(file);
        setCertPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleCertSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const data = new FormData();
      data.append('title', certForm.title);
      data.append('issuer', certForm.issuer);
      data.append('issueDate', certForm.issueDate);
      data.append('type', certForm.type);
      data.append('description', certForm.description);
      data.append('skills', certForm.skills);
      data.append('credentialUrl', certForm.credentialUrl);
      if (certForm.imageUrl) {
        data.append('imageUrl', certForm.imageUrl);
      }
      if (certFile) {
        data.append('image', certFile);
      }

      let res;
      if (editingCertId) {
        res = await adminService.updateCertificate(editingCertId, data);
      } else {
        res = await adminService.createCertificate(data);
      }
      if (res.success) {
        toast.success(res.message || 'Achievement saved successfully');
        setIsCertModalOpen(false);
        fetchData();
      }
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCertDelete = async (id) => {
    if (!window.confirm('Delete this achievement entry?')) return;
    try {
      const res = await adminService.deleteCertificate(id);
      if (res.success) {
        toast.success('Achievement deleted');
        setCertList((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-card">
        <div>
          <div className="flex items-center gap-2 text-indigo-500 font-mono text-xs uppercase tracking-widestTechnical font-semibold mb-1">
            <FiAward className="w-3.5 h-3.5" />
            ACHIEVEMENT &amp; ACADEMICS MANAGER
          </div>
          <h1 className="text-2xl font-heading font-extrabold text-theme-text">
            Achievements, Photos &amp; Academics
          </h1>
          <p className="text-xs sm:text-sm text-theme-textMuted mt-0.5">
            Add achievement photos, hackathon trophies, and university degree milestones.
            All photos immediately appear on the public homepage.
          </p>
        </div>

        <div>
          {activeTab === 'achievements' ? (
            <Button variant="primary" size="md" icon={FiPlus} onClick={openAddCert}>
              Add Achievement Photo
            </Button>
          ) : (
            <Button variant="primary" size="md" icon={FiPlus} onClick={openAddEdu}>
              Add Education
            </Button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-theme-border pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('achievements')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all ${
            activeTab === 'achievements'
              ? 'bg-indigo-600 text-white shadow-glowSm'
              : 'text-theme-textMuted hover:text-theme-text hover:bg-theme-surfaceSecondary'
          }`}
        >
          <FiAward className="w-4 h-4" />
          <span>Achievements &amp; Photos ({certList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('education')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all ${
            activeTab === 'education'
              ? 'bg-indigo-600 text-white shadow-glowSm'
              : 'text-theme-textMuted hover:text-theme-text hover:bg-theme-surfaceSecondary'
          }`}
        >
          <FiBookOpen className="w-4 h-4" />
          <span>Academic Background ({educationList.length})</span>
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} />
      ) : activeTab === 'achievements' ? (
        /* Achievements & Photos Grid */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-theme-textMuted px-1">
            <span>
              Showing {certList.length} total credentials &bull; Photos appear in <strong>Section 04 (Journey)</strong> and <strong>Section 05 (Hackathons)</strong>
            </span>

            {/* Quick Filter Chips */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-theme-surface border border-theme-border self-start sm:self-auto">
              {['All', 'Hackathons', 'College Life', 'Awards', 'Certificates'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedAdminFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold transition-all ${
                    selectedAdminFilter === cat
                      ? 'bg-indigo-600 text-white shadow-glowSm'
                      : 'text-theme-textMuted hover:text-theme-text'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {certList
              .filter((cert) => {
                if (selectedAdminFilter === 'All') return true;
                const t = (cert.type || '').toLowerCase();
                if (selectedAdminFilter === 'Hackathons') {
                  return t.includes('hackathon') || t.includes('competition');
                }
                if (selectedAdminFilter === 'College Life') {
                  return (
                    t.includes('college') ||
                    t.includes('campus') ||
                    t.includes('academic') ||
                    t.includes('workshop')
                  );
                }
                if (selectedAdminFilter === 'Awards') {
                  return t.includes('award') || t.includes('honor') || t.includes('recognition');
                }
                if (selectedAdminFilter === 'Certificates') {
                  return t.includes('cert');
                }
                return true;
              })
              .map((cert) => (
              <div
                key={cert._id}
                className="rounded-3xl border border-theme-border bg-theme-surface shadow-card hover:border-cyan-500/50 transition-all flex flex-col justify-between group overflow-hidden"
              >
                <div className="space-y-3">
                  {/* Photo Preview Thumbnail */}
                  <div className="relative h-44 w-full overflow-hidden bg-theme-surfaceSecondary border-b border-theme-border group/img">
                    <img
                      src={
                        getAssetUrl(cert.image?.url) ||
                        '/achievements/achievement_cert.png'
                      }
                      alt={cert.title}
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/achievements/achievement_cert.png';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-between p-3.5">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-white px-2.5 py-0.5 rounded-md bg-black/60 backdrop-blur-sm border border-white/20">
                        {cert.type || 'Achievement'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/80 text-white font-mono text-[10px] font-semibold">
                        {cert.issueDate}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2">
                    <p className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider">
                      {cert.issuer}
                    </p>
                    <h3 className="font-heading font-bold text-sm text-theme-text group-hover:text-cyan-500 transition-colors leading-snug">
                      {cert.title}
                    </h3>
                    {cert.description && (
                      <p className="text-xs text-theme-textMuted line-clamp-2 leading-relaxed">
                        {cert.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 pt-3 border-t border-theme-border flex items-center justify-between text-xs font-mono">
                  {cert.credentialUrl ? (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline font-semibold"
                    >
                      <span>Verify Link</span>
                      <FiExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                      <FiCheckCircle className="w-3 h-3" />
                      <span>Verified Photo</span>
                    </span>
                  )}

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditCert(cert)}
                      className="p-2 rounded-xl bg-theme-surfaceSecondary text-theme-textMuted hover:text-indigo-500 border border-theme-border transition-colors"
                      title="Edit Achievement"
                    >
                      <FiEdit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCertDelete(cert._id)}
                      className="p-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/20 transition-colors"
                      title="Delete Achievement"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Education List */
        <div className="space-y-4">
          {educationList.map((edu) => (
            <div
              key={edu._id}
              className="p-6 rounded-3xl border border-theme-border bg-theme-surface shadow-card hover:border-indigo-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-500 font-bold border border-indigo-500/20">
                    {edu.startDate} – {edu.endDate || 'Present'}
                  </span>
                  {edu.grade && (
                    <span className="font-mono text-xs text-theme-textMuted">
                      Grade: {edu.grade}
                    </span>
                  )}
                </div>
                <h3 className="font-heading font-bold text-base text-theme-text group-hover:text-indigo-500 transition-colors">
                  {edu.degree}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  {edu.institution}
                </p>
                {edu.description && (
                  <p className="text-xs text-theme-textMuted leading-relaxed pt-1">
                    {edu.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => openEditEdu(edu)}
                  className="p-2.5 rounded-xl bg-theme-surfaceSecondary text-theme-textMuted hover:text-indigo-500 border border-theme-border transition-colors"
                  title="Edit"
                >
                  <FiEdit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleEduDelete(edu._id)}
                  className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/20 transition-colors"
                  title="Delete"
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Education Modal */}
      <Modal
        isOpen={isEduModalOpen}
        onClose={() => setIsEduModalOpen(false)}
        title={editingEduId ? 'Edit Academic Background' : 'Add Academic Background'}
      >
        <form onSubmit={handleEduSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
              Degree / Program Name *
            </label>
            <input
              type="text"
              value={eduForm.degree}
              onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
              required
              placeholder="e.g. Bachelor of Technology (B.Tech) in CSE"
              className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
              University / Institution *
            </label>
            <input
              type="text"
              value={eduForm.institution}
              onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
              required
              placeholder="Shri Ramswaroop Memorial University (SRMU), Lucknow"
              className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
                Start Year *
              </label>
              <input
                type="text"
                value={eduForm.startDate}
                onChange={(e) => setEduForm({ ...eduForm, startDate: e.target.value })}
                required
                placeholder="2022"
                className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
                End Year / Status
              </label>
              <input
                type="text"
                value={eduForm.endDate}
                onChange={(e) => setEduForm({ ...eduForm, endDate: e.target.value })}
                placeholder="2026 or Present"
                className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
              Grade / Percentage / CGPA (Optional)
            </label>
            <input
              type="text"
              value={eduForm.grade}
              onChange={(e) => setEduForm({ ...eduForm, grade: e.target.value })}
              placeholder="e.g. 8.5 CGPA / 85%"
              className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
              Description &amp; Highlights
            </label>
            <textarea
              rows={3}
              value={eduForm.description}
              onChange={(e) => setEduForm({ ...eduForm, description: e.target.value })}
              placeholder="Core focus areas, relevant projects, coursework..."
              className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-theme-border">
            <Button variant="secondary" size="md" onClick={() => setIsEduModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={submitting}>
              Save Education
            </Button>
          </div>
        </form>
      </Modal>

      {/* Achievement & Photo Modal */}
      <Modal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        title={editingCertId ? 'Edit Achievement Photo & Details' : 'Add Achievement Photo & Credential'}
      >
        <form onSubmit={handleCertSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
              Achievement Title *
            </label>
            <input
              type="text"
              value={certForm.title}
              onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
              required
              placeholder="e.g. Academic Excellence Award / Hackathon 1st Place / MERN Certification"
              className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
                Awarding Body / Organization *
              </label>
              <input
                type="text"
                value={certForm.issuer}
                onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                required
                placeholder="SRMU Lucknow / Sunstone / Oracle"
                className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
                Category / Type
              </label>
              <select
                value={certForm.type}
                onChange={(e) => setCertForm({ ...certForm, type: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
              >
                {achievementTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
                Issue Year / Date *
              </label>
              <input
                type="text"
                value={certForm.issueDate}
                onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                required
                placeholder="2024 or Nov 2024"
                className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
                Credential Verification Link (Optional)
              </label>
              <input
                type="url"
                value={certForm.credentialUrl}
                onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
              />
            </div>
          </div>

          {/* Achievement Photo Upload & Live Preview */}
          <div className="p-4 rounded-2xl border border-theme-border bg-theme-surfaceSecondary space-y-3">
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text">
              Achievement Photo Upload
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-28 h-20 rounded-xl overflow-hidden border-2 border-indigo-500/30 bg-theme-surface shrink-0 shadow-sm flex items-center justify-center">
                {certPreview ? (
                  <img
                    src={certPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/achievements/achievement_cert.png';
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-theme-textMuted text-[10px] font-mono">
                    <FiImage className="w-6 h-6 mb-1 opacity-60" />
                    <span>No Photo</span>
                  </div>
                )}
              </div>

              <div className="w-full space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCertFileChange}
                  className="w-full text-xs font-mono text-theme-textMuted file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-mono file:bg-indigo-500/10 file:text-indigo-500 hover:file:bg-indigo-500/20 cursor-pointer"
                />
                <input
                  type="url"
                  placeholder="Or paste direct Image URL (https://...)"
                  value={certForm.imageUrl || ''}
                  onChange={(e) => {
                    const url = e.target.value;
                    setCertForm({ ...certForm, imageUrl: url });
                    if (!certFile && url) {
                      setCertPreview(url);
                    }
                  }}
                  className="w-full px-3 py-1.5 rounded-lg border border-theme-border bg-theme-surface text-theme-text text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
              Description &amp; Key Highlights
            </label>
            <textarea
              rows={2}
              value={certForm.description}
              onChange={(e) => setCertForm({ ...certForm, description: e.target.value })}
              placeholder="e.g. Secured 1st place in 24-hr university hackathon / Scored highest in semester examinations"
              className="w-full px-4 py-2 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-theme-border">
            <Button variant="secondary" size="md" onClick={() => setIsCertModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={submitting}>
              Save Achievement Photo
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminEducationCertificates;
