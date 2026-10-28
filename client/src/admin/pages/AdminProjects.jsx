import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiExternalLink, FiGithub, FiCheck } from 'react-icons/fi';
import { adminService } from '../../services/adminService';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    longDescription: '',
    tags: '',
    liveUrl: '',
    githubUrl: '',
    order: 0,
    isFeatured: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await adminService.getProjects();
      if (res.success) {
        setProjects(res.data);
      }
    } catch (err) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      longDescription: '',
      tags: '',
      liveUrl: '',
      githubUrl: '',
      order: projects.length + 1,
      isFeatured: false,
    });
    setImageFile(null);
    setImagePreview('');
    setIsModalOpen(true);
  };

  const openEditModal = (proj) => {
    setEditingId(proj._id);
    setFormData({
      title: proj.title,
      description: proj.description,
      longDescription: proj.longDescription || '',
      tags: Array.isArray(proj.tags) ? proj.tags.join(', ') : proj.tags,
      liveUrl: proj.liveUrl || '',
      githubUrl: proj.githubUrl || '',
      order: proj.order || 0,
      isFeatured: proj.isFeatured || false,
    });
    setImageFile(null);
    setImagePreview(proj.image?.url || '');
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('longDescription', formData.longDescription);
      data.append('tags', formData.tags);
      data.append('liveUrl', formData.liveUrl);
      data.append('githubUrl', formData.githubUrl);
      data.append('order', formData.order);
      data.append('isFeatured', formData.isFeatured);
      if (imageFile) {
        data.append('image', imageFile);
      }

      let res;
      if (editingId) {
        res = await adminService.updateProject(editingId, data);
      } else {
        res = await adminService.createProject(data);
      }

      if (res.success) {
        toast.success(res.message);
        setIsModalOpen(false);
        fetchProjects();
      }
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await adminService.deleteProject(id);
      if (res.success) {
        toast.success('Project deleted successfully');
        setProjects((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete project');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Projects Manager
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Add, update, or remove portfolio showcase projects with Cloudinary image hosting.
          </p>
        </div>
        <Button variant="primary" size="md" icon={FiPlus} onClick={openAddModal}>
          Add Project
        </Button>
      </div>

      {loading ? (
        <LoadingSkeleton type="project" count={3} />
      ) : projects.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-xs text-gray-400">
          No projects found. Click "Add Project" above to create your first portfolio project!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj._id}
              className="rounded-3xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div>
                <img
                  src={proj.image?.url}
                  alt={proj.title}
                  className="w-full h-44 object-cover"
                />
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-gray-900 dark:text-white">
                      {proj.title}
                    </h3>
                    {proj.isFeatured && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500 text-white">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {proj.description}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-2">
                    {proj.tags?.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-gray-100 dark:bg-dark-surface text-gray-600 dark:text-gray-400 font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-100 dark:border-dark-border mt-3">
                <span className="text-[11px] text-gray-400 font-mono">
                  Order: #{proj.order}
                </span>

                <div className="flex items-center gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => openEditModal(proj)}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-dark-surface text-gray-700 dark:text-gray-300 hover:text-brand-500 transition-colors"
                    title="Edit"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(proj._id)}
                    className="p-2 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Project' : 'Add New Project'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Project Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Tech Stack Tags (Comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="React, Node.js, Express, MongoDB"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              Short Description *
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              Extended Architecture Description
            </label>
            <textarea
              rows={3}
              value={formData.longDescription}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Live URL
              </label>
              <input
                type="url"
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded text-brand-500 focus:ring-brand-500"
                />
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                  Feature on Public Portfolio
                </span>
              </label>
            </div>
          </div>

          {/* Project Image */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              Project Preview Cover (Cloudinary)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-xs text-gray-500"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 h-32 w-auto rounded-xl object-cover border border-gray-200 dark:border-dark-border"
              />
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-dark-border">
            <Button variant="secondary" size="md" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={submitting}>
              {editingId ? 'Update Project' : 'Create Project'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminProjects;
