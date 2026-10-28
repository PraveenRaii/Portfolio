import React, { useState, useEffect } from 'react';
import { FiStar, FiSend, FiClock, FiCheckCircle, FiXCircle, FiMessageSquare } from 'react-icons/fi';
import { userService } from '../../services/userService';
import Button from '../../components/common/Button';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';

const UserTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    roleOrCompany: '',
    rating: 5,
    content: '',
  });

  const fetchMyTestimonials = async () => {
    try {
      setLoading(true);
      const res = await userService.getMyTestimonials();
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
    fetchMyTestimonials();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.content.trim()) {
      toast.error('Please write your review / endorsement text');
      return;
    }

    try {
      setSubmitting(true);
      const res = await userService.createTestimonial(formData);
      if (res.success) {
        toast.success(res.message);
        setFormData({ roleOrCompany: '', rating: 5, content: '' });
        fetchMyTestimonials();
      }
    } catch (err) {
      toast.error(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
            <FiCheckCircle className="w-3 h-3" />
            Approved &bull; Live
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500">
            <FiXCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500">
            <FiClock className="w-3 h-3" />
            Pending Review
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-card">
        <div className="flex items-center gap-2 text-indigo-500 font-mono text-xs uppercase tracking-widestTechnical font-semibold mb-1">
          <FiMessageSquare className="w-3.5 h-3.5" />
          COMMUNITY FEEDBACK
        </div>
        <h1 className="text-2xl font-heading font-extrabold text-theme-text">
          Write Feedback / Testimonial
        </h1>
        <p className="text-xs sm:text-sm text-theme-textMuted mt-0.5">
          Share your experience collaborating with Praveen. Submissions are reviewed before going live.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Submission Form */}
        <div className="lg:col-span-5">
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-7 rounded-3xl border border-theme-border bg-theme-surface shadow-card space-y-4"
          >
            <h3 className="text-base font-heading font-bold text-theme-text">
              New Testimonial
            </h3>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
                Your Role or College/Company
              </label>
              <input
                type="text"
                value={formData.roleOrCompany}
                onChange={(e) =>
                  setFormData({ ...formData, roleOrCompany: e.target.value })
                }
                placeholder="e.g. Peer Collaborator / Tech Club Lead"
                className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
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
                          : 'text-theme-border'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-mono font-bold text-theme-textMuted ml-2">
                  {formData.rating} / 5 Stars
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
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
                className="w-full px-4 py-3 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-sans"
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
          <h3 className="text-base font-heading font-bold text-theme-text">
            Submission History ({testimonials.length})
          </h3>

          {loading ? (
            <LoadingSkeleton count={2} />
          ) : testimonials.length === 0 ? (
            <div className="p-16 text-center rounded-3xl border border-dashed border-theme-border bg-theme-surface text-xs font-mono text-theme-textMuted shadow-card">
              You haven't submitted any testimonials yet. Fill out the form to share your feedback!
            </div>
          ) : (
            <div className="space-y-4">
              {testimonials.map((t) => (
                <div
                  key={t._id}
                  className="p-5 sm:p-6 rounded-3xl border border-theme-border bg-theme-surface shadow-card space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: t.rating || 5 }).map((_, i) => (
                        <FiStar key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    {getStatusBadge(t.status)}
                  </div>

                  <p className="text-xs sm:text-sm text-theme-text leading-relaxed italic">
                    "{t.content}"
                  </p>

                  <div className="text-[11px] font-mono text-theme-textMuted flex items-center justify-between pt-3 border-t border-theme-border">
                    <span>{t.roleOrCompany || 'Peer Review'}</span>
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
