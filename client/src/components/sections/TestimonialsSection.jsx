import React from 'react';
import { motion } from 'framer-motion';
import { LuStar, LuMessageSquare, LuQuote, LuCheck } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const TestimonialsSection = ({ testimonials = [] }) => {
  const { isAuthenticated, role } = useAuth();

  return (
    <section id="testimonials" className="py-24 border-b border-theme-border relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="space-y-2">
            <div className="text-theme-accent font-mono text-xs tracking-widestTechnical uppercase font-semibold">
              ENDORSEMENTS
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-theme-text tracking-tight">
              Peer feedback &amp; recommendations.
            </h2>
            <p className="text-sm sm:text-base text-theme-textMuted max-w-xl">
              Collaborative thoughts and feedback from peers, project teammates, and mentors on
              code quality, problem-solving discipline, and work ethic.
            </p>
          </div>

          <div className="self-start">
            <Link
              to={
                isAuthenticated
                  ? role === 'admin'
                    ? '/admin/testimonials'
                    : '/user/testimonials'
                  : '/login'
              }
            >
              <Button variant="outline" size="sm" icon={LuMessageSquare}>
                {isAuthenticated ? 'Submit Feedback' : 'Sign in to Recommend'}
              </Button>
            </Link>
          </div>
        </div>

        {/* Content Grid */}
        {testimonials.length === 0 ? (
          <div className="p-8 rounded-2xl border border-theme-border bg-theme-surface text-center max-w-xl mx-auto space-y-3">
            <div className="w-10 h-10 rounded-xl bg-theme-accent/10 text-theme-accent flex items-center justify-center mx-auto">
              <LuMessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-semibold text-sm text-theme-text">
              No public testimonials yet
            </h3>
            <p className="text-xs text-theme-textMuted">
              Have we collaborated on a project or hackathon? Your feedback is always valued and appreciated.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((item, idx) => (
              <motion.div
                key={item._id || idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className="p-6 rounded-2xl border border-theme-border bg-theme-surface flex flex-col justify-between hover:border-theme-accent/40 transition-colors shadow-subtle group"
              >
                <div className="space-y-4">
                  {/* Rating Stars & Quote Icon */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-theme-accent">
                      {Array.from({ length: 5 }).map((_, sIdx) => (
                        <LuStar
                          key={sIdx}
                          className={`w-3.5 h-3.5 ${
                            sIdx < (item.rating || 5)
                              ? 'fill-current text-theme-accent'
                              : 'text-theme-border'
                          }`}
                        />
                      ))}
                    </div>
                    <LuQuote className="w-5 h-5 text-theme-textMuted/40 group-hover:text-theme-accent/40 transition-colors" />
                  </div>

                  <p className="text-xs sm:text-sm text-theme-text leading-relaxed italic">
                    "{item.content}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-5 mt-5 border-t border-theme-border/60">
                  <img
                    src={
                      item.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'
                    }
                    alt={item.name}
                    className="w-9 h-9 rounded-full object-cover border border-theme-border"
                  />
                  <div className="min-w-0">
                    <h4 className="font-heading font-bold text-xs text-theme-text truncate">
                      {item.name}
                    </h4>
                    <p className="font-mono text-[11px] text-theme-textMuted truncate">
                      {item.roleOrCompany}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default TestimonialsSection;
