import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiUsers,
  FiFolder,
  FiMail,
  FiEye,
  FiClock,
  FiHeart,
  FiArrowRight,
  FiCheckCircle,
} from 'react-icons/fi';
import { adminService } from '../../services/adminService';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await adminService.getDashboardStats();
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        toast.error('Failed to load admin analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSkeleton type="dashboard" />;
  }

  const counts = data?.counts || {};
  const cards = [
    {
      title: 'Total Visits',
      value: counts.totalVisits || 0,
      icon: FiEye,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10',
    },
    {
      title: 'Registered Users',
      value: counts.totalUsers || 0,
      icon: FiUsers,
      color: 'text-cyan-500',
      bg: 'bg-cyan-500/10',
    },
    {
      title: 'Projects Published',
      value: counts.totalProjects || 0,
      icon: FiFolder,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'Total Inquiries',
      value: counts.totalMessages || 0,
      icon: FiMail,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      badge: counts.unreadMessages ? `${counts.unreadMessages} Unread` : null,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          Admin Dashboard & Analytics
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Real-time monitoring of website visits, audience engagement, inquiries, and moderation queues.
        </p>
      </div>

      {/* Counter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card shadow-sm flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {c.title}
                </p>
                <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
                  {c.value}
                </p>
                {c.badge && (
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 mt-1.5">
                    {c.badge}
                  </span>
                )}
              </div>
              <div className={`w-12 h-12 rounded-2xl ${c.bg} ${c.color} flex items-center justify-center shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts & Rankings Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Visits in Last 7 Days */}
        <div className="lg:col-span-7 p-6 rounded-3xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-dark-border pb-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Visits in Last 7 Days
            </h3>
            <span className="text-xs text-gray-500">Live Traffic Logs</span>
          </div>

          {data?.visitsLast7Days?.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-400">
              No recorded visits in the last 7 days.
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              {data?.visitsLast7Days?.map((item) => {
                const max = Math.max(...data.visitsLast7Days.map((v) => v.count), 1);
                const percent = Math.min(Math.round((item.count / max) * 100), 100);

                return (
                  <div key={item._id} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-gray-600 dark:text-gray-300 font-mono">
                        {item._id}
                      </span>
                      <span className="text-brand-500 font-bold">
                        {item.count} {item.count === 1 ? 'visit' : 'visits'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-dark-surface rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-brand-500 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Most Liked Projects Leaderboard */}
        <div className="lg:col-span-5 p-6 rounded-3xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-dark-border pb-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FiHeart className="text-red-500" />
              Most Liked Projects
            </h3>
            <Link
              to="/admin/projects"
              className="text-xs font-semibold text-brand-500 hover:underline"
            >
              Manage
            </Link>
          </div>

          <div className="space-y-3">
            {data?.mostLikedProjects?.map((proj, idx) => (
              <div
                key={proj._id}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-dark-surface border border-gray-100 dark:border-dark-border"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-gray-400 w-4">
                    #{idx + 1}
                  </span>
                  <p className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[180px]">
                    {proj.title}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 dark:bg-red-500/10 px-2.5 py-1 rounded-lg">
                  <FiHeart className="w-3.5 h-3.5 fill-current" />
                  <span>{proj.likesCount || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Messages Queue */}
      <div className="p-6 rounded-3xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-dark-border pb-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Recent Contact Inquiries
          </h3>
          <Link
            to="/admin/messages"
            className="text-xs font-semibold text-brand-500 hover:underline flex items-center gap-1"
          >
            Open Inbox <FiArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {data?.recentMessages?.length === 0 ? (
          <p className="text-xs text-gray-400 py-6 text-center">No messages received yet.</p>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-dark-border">
            {data?.recentMessages?.map((msg) => (
              <div
                key={msg._id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 dark:text-white">
                      {msg.name}
                    </span>
                    <span className="text-gray-400">({msg.email})</span>
                    {!msg.isRead && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500 text-white">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 line-clamp-1">
                    {msg.subject}: {msg.message}
                  </p>
                </div>
                <span className="text-gray-400 text-[11px] shrink-0">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
