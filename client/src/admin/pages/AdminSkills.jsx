import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiCpu } from 'react-icons/fi';
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
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-card">
        <div>
          <div className="flex items-center gap-2 text-indigo-500 font-mono text-xs uppercase tracking-widestTechnical font-semibold mb-1">
            <FiCpu className="w-3.5 h-3.5" />
            TECHNICAL CAPABILITIES
          </div>
          <h1 className="text-2xl font-heading font-extrabold text-theme-text">
            Skills &amp; Technologies
          </h1>
          <p className="text-xs sm:text-sm text-theme-textMuted mt-0.5">
            Manage your technical skill inventory, proficiency markers, and toolkit categories.
          </p>
        </div>
        <Button variant="primary" size="md" icon={FiPlus} onClick={openAddModal}>
          Add Skill
        </Button>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} />
      ) : skills.length === 0 ? (
        <div className="p-16 text-center rounded-3xl border border-dashed border-theme-border bg-theme-surface text-xs font-mono text-theme-textMuted">
          No skills found. Click "Add Skill" above to list your capabilities.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <div
              key={skill._id}
              className="p-5 rounded-3xl border border-theme-border bg-theme-surface shadow-card hover:border-indigo-500/40 transition-all flex items-center justify-between group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-bold text-sm text-theme-text group-hover:text-indigo-500 transition-colors">
                    {skill.name}
                  </h3>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                    {skill.level}
                  </span>
                </div>
                <p className="text-xs font-mono text-theme-textMuted">
                  {skill.category} &bull; {skill.proficiency}%
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openEditModal(skill)}
                  className="p-2 rounded-xl bg-theme-surfaceSecondary text-theme-textMuted hover:text-indigo-500 border border-theme-border transition-colors"
                  title="Edit"
                >
                  <FiEdit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(skill._id)}
                  className="p-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/20 transition-colors"
                  title="Delete"
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
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
              Skill Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g. React.js, Spring Boot, MySQL"
              className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
                Proficiency Level
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
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
            <div className="flex justify-between text-xs font-mono font-semibold text-theme-text mb-1.5">
              <span>Proficiency Depth</span>
              <span className="text-indigo-500">{formData.proficiency}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={formData.proficiency}
              onChange={(e) => setFormData({ ...formData, proficiency: Number(e.target.value) })}
              className="w-full accent-indigo-600"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-theme-border">
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
