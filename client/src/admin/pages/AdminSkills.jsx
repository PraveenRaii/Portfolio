import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { adminService } from '../../services/adminService';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend',
    level: 'Intermediate',
    proficiency: 80,
    icon: 'SiCode',
    order: 0,
  });

  const categories = ['Frontend', 'Backend', 'Database', 'Tools & DevOps', 'Languages', 'Other'];
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await adminService.getSkills();
      if (res.success) {
        setSkills(res.data);
      }
    } catch (err) {
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: 'Frontend',
      level: 'Intermediate',
      proficiency: 80,
      icon: 'SiCode',
      order: skills.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingId(skill._id);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      proficiency: skill.proficiency || 80,
      icon: skill.icon || 'SiCode',
      order: skill.order || 0,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      let res;
      if (editingId) {
        res = await adminService.updateSkill(editingId, formData);
      } else {
        res = await adminService.createSkill(formData);
      }

      if (res.success) {
        toast.success(res.message);
        setIsModalOpen(false);
        fetchSkills();
      }
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      const res = await adminService.deleteSkill(id);
      if (res.success) {
        toast.success('Skill deleted successfully');
        setSkills((prev) => prev.filter((s) => s._id !== id));
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete skill');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Skills & Technologies
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Manage your technical skill inventory, proficiency bars, and categories displayed on the public portfolio.
          </p>
        </div>
        <Button variant="primary" size="md" icon={FiPlus} onClick={openAddModal}>
          Add Skill
        </Button>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} />
      ) : skills.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-xs text-gray-400">
          No skills found. Click "Add Skill" above to list your capabilities.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <div
              key={skill._id}
              className="p-5 rounded-2xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card shadow-sm flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                    {skill.name}
                  </h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-500">
                    {skill.level}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  {skill.category} • {skill.proficiency}%
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openEditModal(skill)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-dark-surface text-gray-600 dark:text-gray-300 hover:text-brand-500 transition-colors"
                >
                  <FiEdit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(skill._id)}
                  className="p-2 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Skill' : 'Add New Skill'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              Skill Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g. React.js, Node.js, Docker"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Proficiency Level
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {levels.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              <span>Proficiency Percentage</span>
              <span className="font-mono text-brand-500">{formData.proficiency}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={formData.proficiency}
              onChange={(e) => setFormData({ ...formData, proficiency: Number(e.target.value) })}
              className="w-full accent-brand-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-dark-border">
            <Button variant="secondary" size="md" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={submitting}>
              {editingId ? 'Update Skill' : 'Create Skill'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminSkills;
