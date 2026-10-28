import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiBookOpen, FiAward, FiExternalLink } from 'react-icons/fi';
import { adminService } from '../../services/adminService';
import { publicService } from '../../services/publicService';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';

const AdminEducationCertificates = () => {
  const [activeTab, setActiveTab] = useState('education');
  const [educationList, setEducationList] = useState([]);
  const [certList, setCertList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Education modal
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

  // Certificate modal
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [editingCertId, setEditingCertId] = useState(null);
  const [certForm, setCertForm] = useState({
    title: '',
    issuer: '',
    issueDate: '',
    credentialUrl: '',
  });
  const [certFile, setCertFile] = useState(null);

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

  // Education Actions
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

  // Certificate Actions
  const openAddCert = () => {
    setEditingCertId(null);
    setCertForm({
      title: '',
      issuer: '',
      issueDate: '',
      credentialUrl: '',
    });
    setCertFile(null);
    setIsCertModalOpen(true);
  };

  const openEditCert = (item) => {
    setEditingCertId(item._id);
    setCertForm({
      title: item.title,
      issuer: item.issuer,
      issueDate: item.issueDate,
      credentialUrl: item.credentialUrl || '',
    });
    setCertFile(null);
    setIsCertModalOpen(true);
  };

  const handleCertSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const data = new FormData();
      data.append('title', certForm.title);
      data.append('issuer', certForm.issuer);
      data.append('issueDate', certForm.issueDate);
      data.append('credentialUrl', certForm.credentialUrl);
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
        toast.success(res.message);
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
    if (!window.confirm('Delete this certificate entry?')) return;
    try {
      const res = await adminService.deleteCertificate(id);
      if (res.success) {
        toast.success('Certificate deleted');
        setCertList((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-card">
        <div>
          <div className="flex items-center gap-2 text-indigo-500 font-mono text-xs uppercase tracking-widestTechnical font-semibold mb-1">
            <FiAward className="w-3.5 h-3.5" />
            ACADEMICS &amp; HONORS
          </div>
          <h1 className="text-2xl font-heading font-extrabold text-theme-text">
            Academics &amp; Certifications
          </h1>
          <p className="text-xs sm:text-sm text-theme-textMuted mt-0.5">
            Maintain your university degrees, bootcamps, and verified achievement credentials.
          </p>
        </div>

        <div>
          {activeTab === 'education' ? (
            <Button variant="primary" size="md" icon={FiPlus} onClick={openAddEdu}>
              Add Education
            </Button>
          ) : (
            <Button variant="primary" size="md" icon={FiPlus} onClick={openAddCert}>
              Add Certificate
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-theme-border pb-2">
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
          <span>Education ({educationList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('certificates')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all ${
            activeTab === 'certificates'
              ? 'bg-indigo-600 text-white shadow-glowSm'
              : 'text-theme-textMuted hover:text-theme-text hover:bg-theme-surfaceSecondary'
          }`}
        >
          <FiAward className="w-4 h-4" />
          <span>Certificates &amp; Awards ({certList.length})</span>
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} />
      ) : activeTab === 'education' ? (
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
                      {edu.grade}
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
      ) : (
        /* Certificates List */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certList.map((cert) => (
            <div
              key={cert._id}
              className="p-5 rounded-3xl border border-theme-border bg-theme-surface shadow-card hover:border-cyan-500/40 transition-all flex flex-col justify-between group overflow-hidden"
            >
              <div className="space-y-3">
                {cert.image?.url && (
                  <div className="h-32 w-full rounded-2xl overflow-hidden bg-theme-surfaceSecondary border border-theme-border">
                    <img
                      src={cert.image.url}
                      alt={cert.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                    <span>{cert.issuer}</span>
                    <span className="text-theme-textMuted">{cert.issueDate}</span>
                  </div>
                  <h3 className="font-heading font-bold text-sm text-theme-text group-hover:text-cyan-500 transition-colors mt-1">
                    {cert.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-theme-border">
                {cert.credentialUrl ? (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-600 dark:text-cyan-400 hover:underline"
                  >
                    <span>Verify Link</span>
                    <FiExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[11px] font-mono text-theme-textMuted">Local Upload</span>
                )}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEditCert(cert)}
                    className="p-2 rounded-xl bg-theme-surfaceSecondary text-theme-textMuted hover:text-indigo-500 border border-theme-border transition-colors"
                  >
                    <FiEdit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCertDelete(cert._id)}
                    className="p-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/20 transition-colors"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Education Modal */}
      <Modal
        isOpen={isEduModalOpen}
        onClose={() => setIsEduModalOpen(false)}
        title={editingEduId ? 'Edit Education Record' : 'Add Education Record'}
      >
        <form onSubmit={handleEduSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
              Degree / Program *
            </label>
            <input
              type="text"
              value={eduForm.degree}
              onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
              required
              placeholder="e.g. B.Tech Computer Science & Engineering (3rd Year)"
              className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
              Institution / University *
            </label>
            <input
              type="text"
              value={eduForm.institution}
              onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
              required
              placeholder="SRMU Lucknow (Powered by Sunstone)"
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
                End Year
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
              Grade / CGPA Details
            </label>
            <input
              type="text"
              value={eduForm.grade}
              onChange={(e) => setEduForm({ ...eduForm, grade: e.target.value })}
              placeholder="8.2 CGPA / Current 3rd Year"
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

      {/* Certificate Modal */}
      <Modal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        title={editingCertId ? 'Edit Certificate' : 'Add Certificate'}
      >
        <form onSubmit={handleCertSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
              Certificate Title *
            </label>
            <input
              type="text"
              value={certForm.title}
              onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
              required
              placeholder="e.g. Academic Excellence Award / MERN Stack Mastery"
              className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
                Issuer *
              </label>
              <input
                type="text"
                value={certForm.issuer}
                onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                required
                placeholder="SRMU / Sunstone / Meta"
                className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
                Issue Year *
              </label>
              <input
                type="text"
                value={certForm.issueDate}
                onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                required
                placeholder="2024"
                className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
              Credential Verification URL
            </label>
            <input
              type="url"
              value={certForm.credentialUrl}
              onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
              Certificate Image Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCertFile(e.target.files[0])}
              className="text-xs font-mono text-theme-textMuted"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-theme-border">
            <Button variant="secondary" size="md" onClick={() => setIsCertModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={submitting}>
              Save Certificate
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminEducationCertificates;
