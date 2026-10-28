import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiTrash2, FiStar, FiClock } from 'react-icons/fi';
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Testimonials & Endorsements
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Review user-submitted recommendations and approve which feedback appears on your public portfolio.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1.5 p-1 rounded-xl bg-gray-100 dark:bg-dark-surface border border-gray-200 dark:border-dark-border self-start">
          {['all', 'pending', 'approved', 'rejected'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                filter === tab
                  ? 'bg-white dark:bg-dark-card text-brand-500 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
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
        <div className="p-12 text-center rounded-3xl border border-dashed border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-xs text-gray-400">
          No testimonials found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((item) => (
            <div
              key={item._id}
              className="p-6 rounded-3xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: item.rating || 5 }).map((_, i) => (
                      <FiStar key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      item.status === 'approved'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : item.status === 'rejected'
                        ? 'bg-red-500/10 text-red-500'
                        : 'bg-amber-500/10 text-amber-500'
                    }`}
                  >
                    {item.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed italic">
                  "{item.content}"
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-dark-border flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-gray-400">
                    {item.roleOrCompany} • {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Status Action Buttons */}
                <div className="flex items-center gap-1.5">
                  {item.status !== 'approved' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(item._id, 'approved')}
                      className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors"
                      title="Approve for public showcase"
                    >
                      <FiCheck className="w-4 h-4" />
                    </button>
                  )}

                  {item.status !== 'rejected' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(item._id, 'rejected')}
                      className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white transition-colors"
                      title="Reject testimonial"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(item._id)}
                    className="p-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
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
