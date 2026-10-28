import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiBookOpen, FiAward } from 'react-icons/fi';
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
        toast.success('Education record deleted');
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Academics & Certifications
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Maintain your university degrees, bootcamps, and professional credential badges.
          </p>
        </div>

        <div className="flex items-center gap-2">
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
      <div className="flex gap-2 border-b border-gray-200 dark:border-dark-border pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('education')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'education'
              ? 'bg-brand-500 text-white shadow-glowSm'
              : 'text-gray-600 dark:text-gray-400 hover:text-brand-500'
          }`}
        >
          <FiBookOpen className="w-4 h-4" />
          Education ({educationList.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('certificates')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'certificates'
              ? 'bg-brand-500 text-white shadow-glowSm'
              : 'text-gray-600 dark:text-gray-400 hover:text-brand-500'
          }`}
        >
          <FiAward className="w-4 h-4" />
          Certificates ({certList.length})
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
              className="p-5 rounded-2xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card shadow-sm flex items-center justify-between"
            >
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                  {edu.degree}
                </h3>
                <p className="text-xs font-semibold text-brand-500">
                  {edu.institution}
                </p>
                <p className="text-[11px] text-gray-400">
                  {edu.startDate} - {edu.endDate || 'Present'} {edu.grade && `• ${edu.grade}`}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openEditEdu(edu)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-dark-surface text-gray-600 dark:text-gray-300 hover:text-brand-500"
                >
                  <FiEdit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleEduDelete(edu._id)}
                  className="p-2 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Certificates List */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certList.map((cert) => (
            <div
              key={cert._id}
              className="p-5 rounded-2xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-brand-500">
                  {cert.issuer}
                </span>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                  {cert.title}
                </h3>
                <p className="text-xs text-gray-400">Year: {cert.issueDate}</p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100 dark:border-dark-border">
                <span className="text-[11px] text-gray-400 truncate max-w-[150px]">
                  {cert.credentialUrl ? 'URL linked' : 'No link'}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEditCert(cert)}
                    className="p-1.5 rounded-lg bg-gray-100 dark:bg-dark-surface text-gray-600 dark:text-gray-300 hover:text-brand-500"
                  >
                    <FiEdit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCertDelete(cert._id)}
                    className="p-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"
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
        title={editingEduId ? 'Edit Education' : 'Add Education'}
      >
        <form onSubmit={handleEduSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              Degree / Program *
            </label>
            <input
              type="text"
              value={eduForm.degree}
              onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
              required
              placeholder="e.g. B.Tech Computer Science & Engineering"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              Institution / University *
            </label>
            <input
              type="text"
              value={eduForm.institution}
              onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
              required
              placeholder="SRMU Lucknow (Powered by Sunstone)"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Start Year *
              </label>
              <input
                type="text"
                value={eduForm.startDate}
                onChange={(e) => setEduForm({ ...eduForm, startDate: e.target.value })}
                required
                placeholder="2022"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                End Year
              </label>
              <input
                type="text"
                value={eduForm.endDate}
                onChange={(e) => setEduForm({ ...eduForm, endDate: e.target.value })}
                placeholder="2026 or Present"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              Grade / CGPA
            </label>
            <input
              type="text"
              value={eduForm.grade}
              onChange={(e) => setEduForm({ ...eduForm, grade: e.target.value })}
              placeholder="8.2 CGPA"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-dark-border">
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              Certificate Title *
            </label>
            <input
              type="text"
              value={certForm.title}
              onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
              required
              placeholder="e.g. Full Stack MERN Specialization"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Issuer *
              </label>
              <input
                type="text"
                value={certForm.issuer}
                onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                required
                placeholder="Meta / MongoDB / Udemy"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Issue Year *
              </label>
              <input
                type="text"
                value={certForm.issueDate}
                onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                required
                placeholder="2024"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              Credential Verification URL
            </label>
            <input
              type="url"
              value={certForm.credentialUrl}
              onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })}
              placeholder="https://coursera.org/verify/..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              Certificate Image (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCertFile(e.target.files[0])}
              className="text-xs text-gray-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-dark-border">
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
