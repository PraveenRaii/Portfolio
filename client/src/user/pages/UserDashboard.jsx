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
      color: 'text-brand-500',
      bg: 'bg-brand-500/10',
      link: '/user/saved-projects',
    },
    {
      title: 'Messages Sent',
      value: data?.stats?.messagesCount || 0,
      icon: FiMail,
      color: 'text-cyan-500',
      bg: 'bg-cyan-500/10',
      link: '/user/messages',
    },
    {
      title: 'Feedback Submitted',
      value: data?.stats?.testimonialsCount || 0,
      icon: FiMessageSquare,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      link: '/user/testimonials',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-500 text-white shadow-glow relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <span className="text-xs uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm">
            User Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {data?.welcomeMessage || 'Welcome back to your dashboard!'}
          </h1>
          <p className="text-brand-100 text-sm max-w-xl">
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
              className="p-6 rounded-2xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card hover:border-brand-500/50 transition-all hover:shadow-md flex items-center justify-between group"
            >
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {s.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {s.value}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Saved Projects Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Saved Projects Preview
          </h2>
          <Link
            to="/user/saved-projects"
            className="text-xs font-semibold text-brand-500 hover:underline flex items-center gap-1"
          >
            View All <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {data?.savedProjectsPreview?.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You haven't bookmarked any projects yet.
            </p>
            <Link
              to="/#projects"
              className="mt-3 inline-block text-xs font-semibold text-brand-500 hover:underline"
            >
              Explore Portfolio Projects &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data?.savedProjectsPreview?.map((proj) => (
              <div
                key={proj._id}
                className="rounded-2xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card p-4 space-y-3 shadow-sm hover:border-brand-500/40 transition-colors"
              >
                <img
                  src={proj.image?.url}
                  alt={proj.title}
                  className="w-full h-36 object-cover rounded-xl"
                />
                <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                  {proj.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                  {proj.description}
                </p>
                {proj.liveUrl && (
                  <a
                    href={proj.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-500 hover:underline pt-1"
                  >
                    <FiExternalLink className="w-3.5 h-3.5" />
                    Visit Live App
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
