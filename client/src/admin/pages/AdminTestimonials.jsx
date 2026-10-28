import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiTrash2, FiStar, FiClock, FiCheckSquare } from 'react-icons/fi';
import { adminService } from '../../services/adminService';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await adminService.getTestimonials();
      if (res.success) {
        setTestimonials(res.data);
      }
    } catch (err) {
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const res = await adminService.updateTestimonialStatus(id, status);
      if (res.success) {
        toast.success(`Testimonial marked as ${status}`);
        setTestimonials((prev) =>
          prev.map((t) => (t._id === id ? { ...t, status } : t))
        );
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial permanently?')) return;
    try {
      const res = await adminService.deleteTestimonial(id);
      if (res.success) {
        toast.success('Testimonial deleted');
        setTestimonials((prev) => prev.filter((t) => t._id !== id));
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  const filtered =
    filter === 'all'
      ? testimonials
      : testimonials.filter((t) => t.status === filter);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-card">
        <div>
          <div className="flex items-center gap-2 text-indigo-500 font-mono text-xs uppercase tracking-widestTechnical font-semibold mb-1">
            <FiCheckSquare className="w-3.5 h-3.5" />
            PEER REVIEWS &amp; RECOMMENDATIONS
          </div>
          <h1 className="text-2xl font-heading font-extrabold text-theme-text">
            Testimonials &amp; Endorsements
          </h1>
          <p className="text-xs sm:text-sm text-theme-textMuted mt-0.5">
            Review user-submitted recommendations and approve which feedback appears on your public portfolio.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1.5 p-1 rounded-2xl bg-theme-surfaceSecondary border border-theme-border self-start">
          {['all', 'pending', 'approved', 'rejected'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold capitalize transition-all ${
                filter === tab
                  ? 'bg-indigo-600 text-white shadow-glowSm'
                  : 'text-theme-textMuted hover:text-theme-text'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} />
      ) : filtered.length === 0 ? (
        <div className="p-16 text-center rounded-3xl border border-dashed border-theme-border bg-theme-surface text-xs font-mono text-theme-textMuted">
          No testimonials found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((item) => (
            <div
              key={item._id}
              className="p-6 rounded-3xl border border-theme-border bg-theme-surface shadow-card hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: item.rating || 5 }).map((_, i) => (
                      <FiStar key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                      item.status === 'approved'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                        : item.status === 'rejected'
                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                        : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                    }`}
                  >
                    {item.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-theme-text leading-relaxed italic">
                  "{item.content}"
                </p>
              </div>

              <div className="pt-4 border-t border-theme-border flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-heading font-bold text-theme-text">
                    {item.name}
                  </h4>
                  <p className="text-[11px] font-mono text-theme-textMuted">
                    {item.roleOrCompany} &bull; {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Status Action Buttons */}
                <div className="flex items-center gap-1.5">
                  {item.status !== 'approved' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(item._id, 'approved')}
                      className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors"
                      title="Approve for public showcase"
                    >
                      <FiCheck className="w-4 h-4" />
                    </button>
                  )}

                  {item.status !== 'rejected' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(item._id, 'rejected')}
                      className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-white transition-colors"
                      title="Reject testimonial"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(item._id)}
                    className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
                    title="Delete permanently"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;
