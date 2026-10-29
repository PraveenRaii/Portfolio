import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  FiGrid,
  FiFolder,
  FiCpu,
  FiAward,
  FiBookOpen,
  FiUsers,
  FiCheckSquare,
  FiMail,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiExternalLink,
  FiShield,
  FiActivity,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/adminService';
import ThemeToggle from '../components/common/ThemeToggle';
import { getAssetUrl, DEFAULT_AVATAR, FALLBACK_AVATAR_DATA_URI } from '../utils/imageUrl';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [sidebarImgError, setSidebarImgError] = useState(false);
  const [mobileImgError, setMobileImgError] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const res = await adminService.getProfile();
        if (res && res.success && res.data) {
          setProfile(res.data);
        }
      } catch (err) {
        // silent
      }
    };
    fetchAdminProfile();
  }, []);

  const isDefaultUnsplash = (url) =>
    !url ||
    url.includes('photo-1534528741775-53994a69daeb') ||
    url.includes('default-avatar');

  const avatarSrc = getAssetUrl(
    (!isDefaultUnsplash(profile?.avatar?.url) && profile?.avatar?.url) ||
    (!isDefaultUnsplash(user?.avatar?.url) && user?.avatar?.url) ||
    DEFAULT_AVATAR
  );

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: FiGrid, exact: true, tag: 'Live' },
    { name: 'Projects', path: '/admin/projects', icon: FiFolder },
    { name: 'Skills & Tech', path: '/admin/skills', icon: FiCpu },
    { name: 'Achievements & Photos', path: '/admin/experience', icon: FiAward },
    { name: 'Users Manager', path: '/admin/users', icon: FiUsers },
    { name: 'Testimonials', path: '/admin/testimonials', icon: FiCheckSquare },
    { name: 'Messages Inbox', path: '/admin/messages', icon: FiMail },
    { name: 'Site & Resume', path: '/admin/settings', icon: FiSettings },
  ];

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text flex flex-col md:flex-row transition-colors duration-200">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-theme-surface border-b border-theme-border sticky top-0 z-30 shadow-subtle">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl text-theme-textMuted hover:text-theme-text hover:bg-theme-surfaceSecondary transition-colors"
          >
            {sidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-mono font-extrabold text-xs">
              PR
            </span>
            <span className="font-heading font-bold text-sm text-theme-text">Admin Panel</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {!mobileImgError ? (
            <img
              src={avatarSrc}
              alt={user?.name || 'Admin'}
              className="w-8 h-8 rounded-full object-cover border border-indigo-500/40 shrink-0 bg-theme-surface"
              onError={(e) => {
                if (e.target.src !== DEFAULT_AVATAR && !e.target.src.includes('profile.jpg')) {
                  e.target.src = DEFAULT_AVATAR;
                } else if (e.target.src !== FALLBACK_AVATAR_DATA_URI) {
                  e.target.src = FALLBACK_AVATAR_DATA_URI;
                } else {
                  setMobileImgError(true);
                }
              }}
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center font-mono font-bold text-xs border border-indigo-500/40 shrink-0">
              PR
            </div>
          )}
        </div>
      </div>

      {/* Backdrop for Mobile Drawer */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-theme-surface border-r border-theme-border p-5 flex flex-col justify-between z-40 transition-transform duration-200 shadow-card ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-4 border-b border-theme-border">
            <Link to="/" className="flex items-center gap-2.5 group">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center font-mono font-bold text-sm shadow-glowSm group-hover:scale-105 transition-transform">
                PR
              </span>
              <div>
                <span className="font-heading font-extrabold text-base text-theme-text tracking-tight">
                  Praveen Rai
                </span>
                <span className="block text-[10px] font-mono text-theme-textMuted uppercase tracking-wider">
                  Admin Console
                </span>
              </div>
            </Link>
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/30 flex items-center gap-1">
              <FiShield className="w-2.5 h-2.5" />
              Master
            </span>
          </div>

          {/* User Profile Card */}
          <div className="p-3 rounded-2xl bg-theme-surfaceSecondary border border-theme-border flex items-center gap-3">
            <div className="relative shrink-0">
              {!sidebarImgError ? (
                <img
                  src={avatarSrc}
                  alt={user?.name || 'Praveen Rai'}
                  className="w-10 h-10 rounded-xl object-cover border border-indigo-500/30 shrink-0 bg-theme-surface shadow-subtle"
                  onError={(e) => {
                    if (e.target.src !== DEFAULT_AVATAR && !e.target.src.includes('profile.jpg')) {
                      e.target.src = DEFAULT_AVATAR;
                    } else if (e.target.src !== FALLBACK_AVATAR_DATA_URI) {
                      e.target.src = FALLBACK_AVATAR_DATA_URI;
                    } else {
                      setSidebarImgError(true);
                    }
                  }}
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center font-heading font-black text-sm shadow-glowSm border border-indigo-500/40 shrink-0">
                  PR
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-theme-surface" />
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-heading font-bold text-theme-text truncate">
                {user?.name || 'Praveen Rai'}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-theme-textMuted font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="truncate">Super Administrator</span>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="space-y-1">
            <p className="text-[10px] font-mono uppercase tracking-widestTechnical text-theme-textMuted px-3 mb-2 font-semibold">
              NAVIGATION
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.exact}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white font-semibold shadow-glowSm'
                          : 'text-theme-textMuted hover:bg-theme-surfaceSecondary hover:text-theme-text'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </div>
                    {item.tag && (
                      <span className="text-[9.5px] font-mono uppercase px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                        {item.tag}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-theme-border space-y-2">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-theme-surfaceSecondary border border-theme-border text-xs">
            <span className="font-medium text-theme-textMuted">Interface Theme</span>
            <ThemeToggle />
          </div>

          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-theme-textMuted hover:text-indigo-500 hover:bg-theme-surfaceSecondary transition-colors"
          >
            <span className="flex items-center gap-2">
              <FiActivity className="w-4 h-4 text-indigo-500" />
              Live Portfolio View
            </span>
            <FiExternalLink className="w-3.5 h-3.5 opacity-60" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
