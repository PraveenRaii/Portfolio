import React, { useState, useEffect } from 'react';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiAward,
  FiExternalLink,
  FiUploadCloud,
  FiImage,
  FiEye,
  FiCheckCircle,
  FiCalendar,
  FiMapPin,
  FiTag,
  FiX,
  FiCode,
  FiUsers,
  FiZap,
} from 'react-icons/fi';
import { adminService } from '../../services/adminService';
import { publicService } from '../../services/publicService';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';
import { getAssetUrl, compressImageFile } from '../../utils/imageUrl';

const CATEGORY_OPTIONS = [
  'Hackathon Attended',
  'College Life & Campus',
  'Hackathon Award',
  'Academic Honor',
  'Coding Competition',
  'Special Recognition',
];

const AdminHackathons = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    issuer: 'SRMU Lucknow / Sunstone',
    issueDate: '2024',
    type: 'Hackathon Attended',
    description: '',
    skills: 'React, Node.js, Rapid Prototyping, Team Lead',
    credentialUrl: '',
    imageUrl: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Lightbox Preview Modal
  const [lightboxImage, setLightboxImage] = useState(null);

  const fetchHackathons = async () => {
    try {
      setLoading(true);
      const res = await publicService.getPortfolioData();
      if (res.success && res.data) {
        setItems(res.data.certificates || []);
      }
    } catch (err) {
      toast.error('Failed to load records from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHackathons();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      title: '',
      issuer: 'SRMU Lucknow / Sunstone',
      issueDate: '2024',
      type: 'Hackathon Attended',
      description: '',
      skills: 'React, Node.js, Rapid Prototyping, Team Lead',
      credentialUrl: '',
      imageUrl: '',
    });
    setSelectedFile(null);
    setPreviewUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item._id);
    setForm({
      title: item.title || '',
      issuer: item.issuer || '',
      issueDate: item.issueDate || '2024',
      type: item.type || 'Hackathon Attended',
      description: item.description || '',
      skills: Array.isArray(item.skills) ? item.skills.join(', ') : item.skills || '',
      credentialUrl: item.credentialUrl || '',
      imageUrl: item.image?.url || '',
    });
    setSelectedFile(null);
    setPreviewUrl(getAssetUrl(item.image?.url) || '');
    setIsModalOpen(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file, 1600, 1600, 0.85);
        setSelectedFile(compressed);
        setPreviewUrl(URL.createObjectURL(compressed));
        toast.success(`Photo ready (${(compressed.size / 1024).toFixed(0)} KB)`);
      } catch (err) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      return toast.error('Please enter a title for the hackathon or event');
    }
    if (!form.issuer.trim()) {
      return toast.error('Please enter the organizer / college / venue name');
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append('title', form.title.trim());
      data.append('issuer', form.issuer.trim());
      data.append('issueDate', form.issueDate.trim());
      data.append('type', form.type);
      data.append('description', form.description.trim());
      data.append('skills', form.skills.trim());
      data.append('credentialUrl', form.credentialUrl.trim());

      if (form.imageUrl && form.imageUrl.trim() !== '') {
        data.append('imageUrl', form.imageUrl.trim());
      }
      if (selectedFile) {
        data.append('image', selectedFile);
      }

      let res;
      if (editingId) {
        res = await adminService.updateCertificate(editingId, data);
        toast.success('Hackathon photo updated permanently!');
      } else {
        res = await adminService.createCertificate(data);
        toast.success('Hackathon photo published! Visible live in Section 05.');
      }

      if (res && res.success) {
        setIsModalOpen(false);
        fetchHackathons();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to save photo');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await adminService.deleteCertificate(id);
      if (res && res.success) {
        toast.success('Photo removed');
        setItems((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    if (selectedFilter === 'All') return true;
    const typeLower = (item.type || '').toLowerCase();
    if (selectedFilter === 'Hackathons') {
      return typeLower.includes('hackathon') || typeLower.includes('competition');
    }
    if (selectedFilter === 'Campus') {
      return (
        typeLower.includes('college') ||
        typeLower.includes('campus') ||
        typeLower.includes('academic') ||
        typeLower.includes('workshop')
      );
    }
    if (selectedFilter === 'Awards') {
      return (
        typeLower.includes('award') ||
        typeLower.includes('cert') ||
        typeLower.includes('honor')
      );
    }
    return true;
  });

  const hackathonCount = items.filter((i) =>
    (i.type || '').toLowerCase().includes('hackathon')
  ).length;
  const campusCount = items.filter(
    (i) =>
      (i.type || '').toLowerCase().includes('college') ||
      (i.type || '').toLowerCase().includes('campus')
  ).length;
  const awardCount = items.filter((i) =>
    (i.type || '').toLowerCase().includes('award')
  ).length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-900/20 via-theme-surface to-indigo-900/20 border border-theme-border shadow-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative space-y-1.5 z-10">
          <div className="flex items-center gap-2 text-amber-500 font-mono text-xs uppercase tracking-widestTechnical font-semibold">
            <FiZap className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>PORTFOLIO SECTION 05 SHOWCASE</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-emerald-500 font-bold">PERMANENT STORAGE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-theme-text tracking-tight">
            Hackathons &amp; Campus Photos
          </h1>
          <p className="text-xs sm:text-sm text-theme-textMuted max-w-xl">
            Upload photos of hackathons you attended, coding competitions, awards, and memorable college moments. Uploaded photos are permanently saved in database and immediately visible to visitors on Section 05 (<span className="text-indigo-400 font-mono">#hackathons</span>).
          </p>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          <a
            href="/#hackathons"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-theme-surfaceSecondary border border-theme-border hover:border-indigo-500 text-theme-text font-heading font-bold text-xs shadow-subtle transition-all"
          >
            <FiExternalLink className="w-4 h-4 text-indigo-400" />
            <span>View Section 05 Live</span>
          </a>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-500 text-white font-heading font-bold text-xs shadow-glowSm hover:shadow-glow transition-all"
          >
            <FiPlus className="w-4 h-4" />
            <span>Upload Hackathon Photo</span>
          </button>
        </div>
      </div>

      {/* Analytics Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
            <FiAward className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-mono uppercase text-theme-textMuted">Total Records</p>
            <p className="text-xl font-heading font-extrabold text-theme-text">{items.length}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-500 flex items-center justify-center shrink-0">
            <FiZap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-mono uppercase text-theme-textMuted">Hackathons</p>
            <p className="text-xl font-heading font-extrabold text-theme-text">{hackathonCount}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center shrink-0">
            <FiUsers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-mono uppercase text-theme-textMuted">Campus Life</p>
            <p className="text-xl font-heading font-extrabold text-theme-text">{campusCount}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
            <FiCheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-mono uppercase text-theme-textMuted">Awards &amp; Honors</p>
            <p className="text-xl font-heading font-extrabold text-theme-text">{awardCount}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-theme-border pb-3">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-theme-surfaceSecondary border border-theme-border">
          {[
            { id: 'All', label: 'All Photos', count: items.length },
            { id: 'Hackathons', label: 'Hackathons', count: hackathonCount },
            { id: 'Campus', label: 'Campus & College', count: campusCount },
            { id: 'Awards', label: 'Awards & Honors', count: awardCount },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold transition-all flex items-center gap-1.5 ${
                selectedFilter === tab.id
                  ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-sm'
                  : 'text-theme-textMuted hover:text-theme-text'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedFilter === tab.id ? 'bg-white/20 text-white' : 'bg-theme-surface text-theme-textMuted'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-theme-textMuted">
          Showing {filteredItems.length} of {items.length} moments
        </span>
      </div>

      {/* Records Content */}
      {loading ? (
        <LoadingSkeleton type="cards" count={4} />
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-theme-border bg-theme-surfaceSecondary/50">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
            <FiUploadCloud className="w-8 h-8" />
          </div>
          <h3 className="text-base font-heading font-bold text-theme-text mb-1">
            No photos found in this category
          </h3>
          <p className="text-xs text-theme-textMuted max-w-md mx-auto mb-6">
            Upload your first hackathon or college moment photograph. Photos will be saved permanently and displayed in Section 05.
          </p>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-500 text-white font-heading font-bold text-xs shadow-glowSm"
          >
            <FiPlus className="w-4 h-4" />
            <span>Upload Hackathon Photo Now</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const displayImg = getAssetUrl(item.image?.url);
            return (
              <div
                key={item._id}
                className="group rounded-3xl bg-theme-surface border border-theme-border hover:border-amber-500/50 shadow-card hover:shadow-cardHover transition-all flex flex-col overflow-hidden"
              >
                {/* Photo Header */}
                <div className="relative aspect-[16/10] overflow-hidden bg-theme-surfaceSecondary border-b border-theme-border">
                  {displayImg ? (
                    <img
                      src={displayImg}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                      onClick={() => setLightboxImage(displayImg)}
                      onError={(e) => {
                        e.target.src =
                          'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-theme-textMuted">
                      <FiImage className="w-12 h-12 stroke-[1.2]" />
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30">
                      {item.type || 'Hackathon Attended'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setLightboxImage(displayImg)}
                    className="absolute bottom-3 right-3 p-2 rounded-xl bg-slate-950/80 backdrop-blur-md text-white/90 hover:text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="View Full Photo"
                  >
                    <FiEye className="w-4 h-4" />
                  </button>
                </div>

                {/* Details Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-theme-textMuted">
                      <span className="flex items-center gap-1">
                        <FiCalendar className="w-3 h-3 text-indigo-400" />
                        {item.issueDate || '2024'}
                      </span>
                      <span className="text-emerald-500 font-bold flex items-center gap-1">
                        <FiCheckCircle className="w-3 h-3" />
                        Live on Site
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-base text-theme-text group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-xs font-mono text-indigo-500 dark:text-indigo-400">
                      {item.issuer}
                    </p>

                    {item.description && (
                      <p className="text-xs text-theme-textMuted line-clamp-3 leading-relaxed">
                        {item.description}
                      </p>
                    )}

                    {/* Skill chips */}
                    {item.skills && item.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {item.skills.slice(0, 4).map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-theme-surfaceSecondary border border-theme-border text-theme-textMuted"
                          >
                            {skill}
                          </span>
                        ))}
                        {item.skills.length > 4 && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-theme-surfaceSecondary text-theme-textMuted">
                            +{item.skills.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-theme-border">
                    {item.credentialUrl ? (
                      <a
                        href={item.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-heading font-semibold text-indigo-500 hover:text-indigo-400 inline-flex items-center gap-1"
                      >
                        <span>Project Link</span>
                        <FiExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[11px] font-mono text-theme-textMuted">Section 05</span>
                    )}

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        className="p-2 rounded-xl text-theme-textMuted hover:text-indigo-500 hover:bg-theme-surfaceSecondary transition-colors"
                        title="Edit Details"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item._id, item.title)}
                        className="p-2 rounded-xl text-theme-textMuted hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title="Delete Record"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload & Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Hackathon Photo & Details' : 'Upload New Hackathon / Campus Photo'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-theme-textMuted mb-1.5 font-semibold">
              Hackathon or Event Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. SRMU Tech Summit Hackathon — Civic Grievance Tracker"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surfaceSecondary border border-theme-border focus:border-amber-500 focus:outline-none text-theme-text text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase text-theme-textMuted mb-1.5 font-semibold">
                College / Organizer / Venue *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. SRMU Lucknow / Sunstone"
                value={form.issuer}
                onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surfaceSecondary border border-theme-border focus:border-amber-500 focus:outline-none text-theme-text text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-theme-textMuted mb-1.5 font-semibold">
                Year / Date *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 2024 or Nov 2024"
                value={form.issueDate}
                onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surfaceSecondary border border-theme-border focus:border-amber-500 focus:outline-none text-theme-text text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase text-theme-textMuted mb-1.5 font-semibold">
                Category *
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surfaceSecondary border border-theme-border focus:border-amber-500 focus:outline-none text-theme-text text-xs"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-theme-textMuted mb-1.5 font-semibold">
                Project Link / Github (Optional)
              </label>
              <input
                type="url"
                placeholder="https://github.com/PraveenRaii/project"
                value={form.credentialUrl}
                onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surfaceSecondary border border-theme-border focus:border-amber-500 focus:outline-none text-theme-text text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-theme-textMuted mb-1.5 font-semibold">
              Tech Stack &amp; Skills (Comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. React, Spring Boot, MySQL, Team Lead"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surfaceSecondary border border-theme-border focus:border-amber-500 focus:outline-none text-theme-text text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-theme-textMuted mb-1.5 font-semibold">
              Description &amp; Highlights
            </label>
            <textarea
              rows={3}
              placeholder="Describe what you built during the hackathon, your role, team contributions, and project outcome..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surfaceSecondary border border-theme-border focus:border-amber-500 focus:outline-none text-theme-text text-xs resize-none"
            />
          </div>

          {/* Photo Upload Area */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/5 via-theme-surfaceSecondary to-indigo-500/5 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-heading font-bold text-theme-text flex items-center gap-1.5">
                <FiImage className="w-4 h-4 text-amber-500" />
                <span>Hackathon Photo Upload (Permanent)</span>
              </label>
              <span className="text-[10px] font-mono text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Resilient Persistence
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {previewUrl ? (
                <div className="relative w-28 h-20 rounded-xl overflow-hidden border-2 border-amber-500/40 shrink-0 shadow-md">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl('');
                      setForm({ ...form, imageUrl: '' });
                    }}
                    className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-28 h-20 rounded-xl border-2 border-dashed border-theme-border flex flex-col items-center justify-center text-theme-textMuted shrink-0">
                  <FiUploadCloud className="w-6 h-6 text-amber-500 mb-1" />
                  <span className="text-[10px] font-mono">No Image</span>
                </div>
              )}

              <div className="flex-1 w-full space-y-2">
                <input
                  type="file"
                  id="hackathonPhotoFile"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="hackathonPhotoFile"
                  className="inline-flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-theme-surface border border-theme-border hover:border-amber-500 text-theme-text text-xs font-heading font-bold cursor-pointer transition-all shadow-subtle"
                >
                  <FiUploadCloud className="w-4 h-4 text-amber-500" />
                  <span>{selectedFile ? 'Change Photo from Device' : 'Choose Photo from Phone/PC'}</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-theme-textMuted uppercase shrink-0">or URL:</span>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={form.imageUrl}
                    onChange={(e) => {
                      setForm({ ...form, imageUrl: e.target.value });
                      if (e.target.value && !selectedFile) {
                        setPreviewUrl(e.target.value);
                      }
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-theme-surface border border-theme-border text-theme-text text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
            <p className="text-[11px] text-theme-textMuted leading-relaxed">
              Camera photos from mobile are automatically compressed to ensure instant uploads. All photos are stored securely and permanently so they never disappear across server restarts.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-theme-border">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-500 text-white font-heading font-bold text-xs shadow-glowSm disabled:opacity-50 transition-all"
            >
              {submitting ? (
                <span>Saving Permanently...</span>
              ) : (
                <>
                  <FiCheckCircle className="w-4 h-4" />
                  <span>{editingId ? 'Update Record' : 'Publish to Section 05'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Fullscreen Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/20 shadow-2xl">
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/80 text-white hover:bg-rose-600 transition-colors z-10"
            >
              <FiX className="w-5 h-5" />
            </button>
            <img
              src={lightboxImage}
              alt="Enlarged Hackathon View"
              className="w-full h-full object-contain max-h-[85vh] rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHackathons;