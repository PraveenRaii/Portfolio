import React, { useState, useEffect } from 'react';
import { FiStar, FiSend, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { userService } from '../../services/userService';
import Button from '../../components/common/Button';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';

const UserTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    content: '',
    rating: 5,
    roleOrCompany: '',
  });

  const fetchMyTestimonials = async () => {
    try {
      setLoading(true);
      const res = await userService.getMyTestimonials();
      if (res.success) {
        setTestimonials(res.data);
      }
    } catch (err) {
      toast.error('Failed to load your testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTestimonials();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.content || formData.content.length < 10) {
      toast.error('Testimonial content must be at least 10 characters long.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await userService.submitTestimonial(formData);
      if (res.success) {
        toast.success(res.message);
        setFormData({ content: '', rating: 5, roleOrCompany: '' });
        fetchMyTestimonials();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit testimonial');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500">
            <FiCheckCircle className="w-3.5 h-3.5" />
            Approved & Live
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-red-500/10 text-red-500">
            <FiXCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500">
            <FiClock className="w-3.5 h-3.5" />
            Pending Review
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          Write Feedback / Testimonial
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Share your experience collaborating with Praveen. Submissions are reviewed by Praveen before going live.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Submission Form */}
        <div className="lg:col-span-5">
          <form
            onSubmit={handleSubmit}
            className="p-6 rounded-3xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card shadow-sm space-y-4"
          >
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              New Testimonial
            </h3>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Your Role or College/Company
              </label>
              <input
                type="text"
                value={formData.roleOrCompany}
                onChange={(e) =>
                  setFormData({ ...formData, roleOrCompany: e.target.value })
                }
                placeholder="e.g. Peer Collaborator, Tech Club Lead"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="p-1 text-amber-400 focus:outline-none"
                  >
                    <FiStar
                      className={`w-6 h-6 ${
                        star <= formData.rating
                          ? 'fill-current text-amber-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-gray-500 ml-2">
                  {formData.rating} / 5 Stars
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Your Review / Endorsement *
              </label>
              <textarea
                rows={4}
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                required
                placeholder="Describe Praveen's problem solving, coding skills, and sprint dedication..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={FiSend}
              isLoading={submitting}
              className="w-full"
            >
              Submit for Approval
            </Button>
          </form>
        </div>

        {/* Previous Submissions List */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Submission History
          </h3>

          {loading ? (
            <LoadingSkeleton count={2} />
          ) : testimonials.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-xs text-gray-500">
              You haven't submitted any testimonials yet. Fill out the form to share your feedback!
            </div>
          ) : (
            <div className="space-y-4">
              {testimonials.map((t) => (
                <div
                  key={t._id}
                  className="p-5 rounded-2xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: t.rating || 5 }).map((_, i) => (
                        <FiStar key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    {getStatusBadge(t.status)}
                  </div>

                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed italic">
                    "{t.content}"
                  </p>

                  <div className="text-[11px] text-gray-400 flex items-center justify-between pt-2 border-t border-gray-100 dark:border-dark-border">
                    <span>Role: {t.roleOrCompany || 'Developer'}</span>
                    <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserTestimonials;
