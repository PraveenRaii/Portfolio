import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiExternalLink, FiGithub, FiCheck, FiFolder, FiStar } from 'react-icons/fi';
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
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-card">
        <div>
          <div className="flex items-center gap-2 text-indigo-500 font-mono text-xs uppercase tracking-widestTechnical font-semibold mb-1">
            <FiFolder className="w-3.5 h-3.5" />
            SHOWCASE REPOSITORY
          </div>
          <h1 className="text-2xl font-heading font-extrabold text-theme-text">
            Projects Manager
          </h1>
          <p className="text-xs sm:text-sm text-theme-textMuted mt-0.5">
            Manage showcase entries, tech stack badges, live deployments, and repository links.
          </p>
        </div>
        <Button variant="primary" size="md" icon={FiPlus} onClick={openAddModal}>
          Add Project
        </Button>
      </div>

      {loading ? (
        <LoadingSkeleton type="project" count={3} />
      ) : projects.length === 0 ? (
        <div className="p-16 text-center rounded-3xl border border-dashed border-theme-border bg-theme-surface text-xs font-mono text-theme-textMuted">
          No projects found. Click "Add Project" above to create your first portfolio project!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj._id}
              className="rounded-3xl border border-theme-border bg-theme-surface overflow-hidden shadow-card hover:border-indigo-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-44 w-full bg-theme-surfaceSecondary overflow-hidden">
                  <img
                    src={proj.image?.url}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {proj.isFeatured && (
                    <span className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-black shadow-md flex items-center gap-1">
                      <FiStar className="w-3 h-3 fill-current" />
                      Featured
                    </span>
                  )}
                </div>

                <div className="p-5 space-y-2.5">
                  <h3 className="font-heading font-bold text-base text-theme-text group-hover:text-indigo-500 transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-theme-textMuted line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {proj.tags?.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-theme-surfaceSecondary text-theme-textMuted border border-theme-border"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-theme-border mt-3 pt-3">
                <span className="text-[11px] text-theme-textMuted font-mono">
                  Order: #{proj.order}
                </span>

                <div className="flex items-center gap-2">
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-theme-surfaceSecondary text-theme-textMuted hover:text-indigo-500 border border-theme-border transition-colors"
                      title="Open Live App"
                    >
                      <FiExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-theme-surfaceSecondary text-theme-textMuted hover:text-theme-text border border-theme-border transition-colors"
                      title="GitHub Repository"
                    >
                      <FiGithub className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => openEditModal(proj)}
                    className="p-2 rounded-xl bg-theme-surfaceSecondary text-theme-text hover:text-indigo-500 border border-theme-border transition-colors"
                    title="Edit"
                  >
                    <FiEdit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(proj._id)}
                    className="p-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/20 transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
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
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
                Project Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
                Tech Stack Tags (Comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="React, Spring Boot, MySQL, REST APIs"
                className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
              Concise Overview *
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
              Extended Architecture &amp; Problem Solved
            </label>
            <textarea
              rows={3}
              value={formData.longDescription}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
                Live URL
              </label>
              <input
                type="url"
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
              />
            </div>

            <div className="pt-4">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span className="text-xs font-heading font-bold text-theme-text">
                  Feature on Public Portfolio
                </span>
              </label>
            </div>
          </div>

          {/* Project Image */}
          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
              Project Preview Cover (Cloudinary / Local)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-xs text-theme-textMuted font-mono"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-3 h-32 w-auto rounded-2xl object-cover border border-theme-border"
              />
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-theme-border">
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
