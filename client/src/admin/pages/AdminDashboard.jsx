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
  FiPlus,
  FiAward,
  FiActivity,
  FiTrendingUp,
  FiShield,
  FiDatabase,
  FiServer,
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
      trend: '+24.5% all-time',
      desc: 'Unique IP & page hit records',
      icon: FiEye,
      color: 'text-indigo-500',
      borderGlow: 'hover:border-indigo-500/50',
      iconBg: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-500',
    },
    {
      title: 'Registered Users',
      value: counts.totalUsers || 0,
      trend: 'Active Accounts',
      desc: 'Authenticated community members',
      icon: FiUsers,
      color: 'text-cyan-500',
      borderGlow: 'hover:border-cyan-500/50',
      iconBg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-500',
    },
    {
      title: 'Projects Published',
      value: counts.totalProjects || 0,
      trend: 'Showcase Live',
      desc: 'Full-stack deployed web apps',
      icon: FiFolder,
      color: 'text-emerald-500',
      borderGlow: 'hover:border-emerald-500/50',
      iconBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-500',
    },
    {
      title: 'Inquiries & Feedback',
      value: counts.totalMessages || 0,
      trend: counts.unreadMessages ? `${counts.unreadMessages} Unread` : 'Inbox Clear',
      desc: 'Direct visitor contacts received',
      icon: FiMail,
      color: 'text-amber-500',
      borderGlow: 'hover:border-amber-500/50',
      iconBg: 'bg-amber-500/15 border-amber-500/30 text-amber-500',
      badge: counts.unreadMessages ? `${counts.unreadMessages} New` : null,
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900/20 via-theme-surface to-cyan-900/20 border border-theme-border shadow-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative space-y-1 z-10">
          <div className="flex items-center gap-2 text-indigo-500 font-mono text-xs uppercase tracking-widestTechnical font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            LIVE TELEMETRY &bull; SYSTEM ONLINE
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-theme-text tracking-tight">
            Admin Command Center
          </h1>
          <p className="text-xs sm:text-sm text-theme-textMuted max-w-xl">
            Real-time analytics, user access oversight, project interactions, and messaging inbox for Praveen Rai's portfolio platform.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/hackathons"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-500 text-white font-heading font-bold text-xs shadow-glowSm transition-all"
          >
            <FiAward className="w-4 h-4" />
            <span>Upload Hackathon Photo</span>
          </Link>
          <Link
            to="/admin/projects"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-heading font-bold text-xs shadow-glowSm transition-all"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add Project</span>
          </Link>
          <Link
            to="/admin/messages"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-theme-surface border border-theme-border hover:border-indigo-500 text-theme-text font-heading font-bold text-xs shadow-subtle transition-all"
          >
            <FiMail className="w-4 h-4 text-indigo-500" />
            <span>Review Inbox</span>
          </Link>
        </div>
      </div>

      {/* Dedicated Hackathon & Campus Photos Spotlight Card */}
      <div className="p-5 sm:p-6 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-theme-surface to-indigo-500/10 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-500 border border-amber-500/30 flex items-center justify-center shrink-0">
            <FiAward className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-extrabold text-base text-theme-text">
                Hackathons &amp; Campus Photo Showcase
              </h3>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 font-bold">
                Section 05 Live
              </span>
            </div>
            <p className="text-xs text-theme-textMuted mt-0.5">
              Upload hackathon sprint photos, college moments, and project presentations with instant smartphone photo compression and live public preview.
            </p>
          </div>
        </div>

        <Link
          to="/admin/hackathons"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-heading font-bold text-xs shadow-glowSm transition-all shrink-0 self-start sm:self-auto"
        >
          <FiPlus className="w-4 h-4" />
          <span>Upload Hackathon Photo</span>
        </Link>
      </div>

      {/* Counter Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-3xl border border-theme-border bg-theme-surface shadow-card transition-all duration-300 hover:shadow-glowSm ${c.borderGlow} flex flex-col justify-between space-y-4`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-theme-textMuted">
                  {c.title}
                </span>
                <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 ${c.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-heading font-extrabold text-theme-text tracking-tight">
                    {c.value.toLocaleString()}
                  </span>
                  {c.badge && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-500 border border-rose-500/30">
                      {c.badge}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-theme-border/60 text-[11px]">
                  <span className="text-theme-textMuted truncate">{c.desc}</span>
                  <span className={`font-mono font-semibold shrink-0 ${c.color}`}>
                    {c.trend}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics & Engagement Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visits in Last 7 Days */}
        <div className="lg:col-span-7 p-6 rounded-3xl border border-theme-border bg-theme-surface shadow-card space-y-5">
          <div className="flex items-center justify-between border-b border-theme-border pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                <FiActivity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-heading font-bold text-theme-text">
                  Traffic &amp; Daily Inbound Views
                </h3>
                <p className="text-[11px] text-theme-textMuted font-mono">
                  Aggregated telemetry over the past 7 days
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold">
              Active Logging
            </span>
          </div>

          {!data?.visitsLast7Days || data?.visitsLast7Days?.length === 0 ? (
            <div className="py-14 text-center text-xs text-theme-textMuted font-mono">
              No recorded visits yet. Traffic will graph here automatically as users visit the site.
            </div>
          ) : (
            <div className="space-y-4 pt-1">
              {data?.visitsLast7Days?.map((item) => {
                const max = Math.max(...data.visitsLast7Days.map((v) => v.count), 1);
                const percent = Math.min(Math.round((item.count / max) * 100), 100);

                return (
                  <div key={item._id} className="space-y-1.5 group">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-theme-text font-semibold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        {item._id}
                      </span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                        {item.count} {item.count === 1 ? 'visit' : 'visits'}
                      </span>
                    </div>
                    <div className="w-full bg-theme-surfaceSecondary rounded-full h-3 p-0.5 border border-theme-border overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 h-full rounded-full transition-all duration-700 shadow-glowSm"
                        style={{ width: `${Math.max(percent, 8)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Infrastructure Health Footer */}
          <div className="pt-4 border-t border-theme-border flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-theme-textMuted">
            <span className="flex items-center gap-1.5">
              <FiServer className="w-3.5 h-3.5 text-indigo-500" />
              Runtime: Node.js / Express
            </span>
            <span className="flex items-center gap-1.5">
              <FiDatabase className="w-3.5 h-3.5 text-emerald-500" />
              Database: MongoDB Atlas Connected
            </span>
          </div>
        </div>

        {/* Most Liked Projects Leaderboard */}
        <div className="lg:col-span-5 p-6 rounded-3xl border border-theme-border bg-theme-surface shadow-card space-y-5">
          <div className="flex items-center justify-between border-b border-theme-border pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                <FiHeart className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-heading font-bold text-theme-text">
                  Project Engagement
                </h3>
                <p className="text-[11px] text-theme-textMuted font-mono">
                  Ranked by visitor likes &amp; bookmarks
                </p>
              </div>
            </div>
            <Link
              to="/admin/projects"
              className="text-xs font-mono font-bold text-indigo-500 hover:underline flex items-center gap-1"
            >
              <span>Manage</span>
              <FiArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {(!data?.mostLikedProjects || data?.mostLikedProjects.length === 0) ? (
              <p className="text-xs text-theme-textMuted py-8 text-center font-mono">
                No project likes recorded yet.
              </p>
            ) : (
              data?.mostLikedProjects?.map((proj, idx) => (
                <div
                  key={proj._id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-theme-surfaceSecondary border border-theme-border hover:border-indigo-500/40 transition-colors"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span
                      className={`font-mono text-xs font-bold w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                        idx === 0
                          ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                          : idx === 1
                          ? 'bg-indigo-500/20 text-indigo-500 border border-indigo-500/30'
                          : 'bg-cyan-500/20 text-cyan-500 border border-cyan-500/30'
                      }`}
                    >
                      #{idx + 1}
                    </span>
                    <div className="overflow-hidden">
                      <p className="text-xs font-heading font-bold text-theme-text truncate max-w-[190px]">
                        {proj.title}
                      </p>
                      <span className="text-[10px] font-mono text-theme-textMuted">
                        Rank #{idx + 1}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-xl shrink-0">
                    <FiHeart className="w-3.5 h-3.5 fill-current" />
                    <span>{proj.likesCount || 0}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick shortcut to add another project */}
          <Link
            to="/admin/projects"
            className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl border border-dashed border-theme-border text-xs font-mono text-theme-textMuted hover:text-indigo-500 hover:border-indigo-500 transition-colors"
          >
            <FiPlus className="w-3.5 h-3.5" />
            <span>Create New Project Showcase</span>
          </Link>
        </div>
      </div>

      {/* Recent Contact Inquiries */}
      <div className="p-6 rounded-3xl border border-theme-border bg-theme-surface shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-theme-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
              <FiMail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-heading font-bold text-theme-text">
                Recent Contact Messages
              </h3>
              <p className="text-[11px] text-theme-textMuted font-mono">
                Inquiries sent through the portfolio contact form
              </p>
            </div>
          </div>
          <Link
            to="/admin/messages"
            className="text-xs font-mono font-bold text-indigo-500 hover:underline flex items-center gap-1"
          >
            <span>Open Complete Inbox</span>
            <FiArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {(!data?.recentMessages || data?.recentMessages.length === 0) ? (
          <div className="p-10 text-center font-mono text-xs text-theme-textMuted">
            No contact inquiries received yet. When visitors fill the Contact form, their messages will appear here.
          </div>
        ) : (
          <div className="divide-y divide-theme-border">
            {data?.recentMessages?.map((msg) => (
              <div
                key={msg._id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-heading font-bold text-theme-text text-sm">
                      {msg.name}
                    </span>
                    <span className="font-mono text-[11px] text-theme-textMuted">
                      &lt;{msg.email}&gt;
                    </span>
                    {!msg.isRead && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-500 border border-indigo-500/30">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-theme-textMuted line-clamp-1">
                    <strong className="text-theme-text font-medium">{msg.subject}:</strong> {msg.message}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-theme-textMuted font-mono text-[11px]">
                    {new Date(msg.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <Link
                    to="/admin/messages"
                    className="px-2.5 py-1 rounded-lg bg-theme-surfaceSecondary hover:bg-indigo-600 hover:text-white border border-theme-border text-xs font-mono font-semibold transition-colors"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
