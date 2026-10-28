import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBookmark, FiMessageSquare, FiMail, FiExternalLink, FiArrowRight } from 'react-icons/fi';
import { userService } from '../../services/userService';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';

const UserDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await userService.getDashboard();
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <LoadingSkeleton type="dashboard" />;
  }

  const stats = [
    {
      title: 'Saved Projects',
      value: data?.stats?.savedProjectsCount || 0,
      icon: FiBookmark,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/15 text-indigo-500 border-indigo-500/30',
      link: '/user/saved-projects',
    },
    {
      title: 'Messages Sent',
      value: data?.stats?.messagesCount || 0,
      icon: FiMail,
      color: 'text-cyan-500',
      bg: 'bg-cyan-500/15 text-cyan-500 border-cyan-500/30',
      link: '/user/messages',
    },
    {
      title: 'Feedback Submitted',
      value: data?.stats?.testimonialsCount || 0,
      icon: FiMessageSquare,
      color: 'text-amber-500',
      bg: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
      link: '/user/testimonials',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900/30 via-theme-surface to-cyan-900/30 border border-theme-border shadow-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-500 border border-indigo-500/30">
            User Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-theme-text tracking-tight">
            {data?.welcomeMessage || 'Welcome back to your dashboard!'}
          </h1>
          <p className="text-xs sm:text-sm text-theme-textMuted max-w-xl">
            Track your bookmarked portfolio projects, manage endorsements, and stay connected with Praveen Rai.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <Link
              key={idx}
              to={s.link}
              className="p-6 rounded-3xl border border-theme-border bg-theme-surface hover:border-indigo-500/40 transition-all shadow-card hover:shadow-glowSm flex items-center justify-between group"
            >
              <div>
                <p className="text-xs font-mono font-bold text-theme-textMuted uppercase tracking-wider">
                  {s.title}
                </p>
                <p className="text-3xl font-heading font-extrabold text-theme-text mt-1">
                  {s.value}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center group-hover:scale-110 transition-transform ${s.bg}`}>
                <Icon className="w-6 h-6" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Showcase Link */}
      <div className="p-6 rounded-3xl border border-theme-border bg-theme-surface shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading font-bold text-base text-theme-text">
            Explore Portfolio Projects
          </h3>
          <p className="text-xs text-theme-textMuted mt-0.5">
            Discover full-stack web applications built with React, Spring Boot, and Node.js.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition-all shadow-glowSm"
        >
          <span>View Public Projects</span>
          <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default UserDashboard;
