import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  FiGrid,
  FiBookmark,
  FiMessageSquare,
  FiMail,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiExternalLink,
  FiActivity,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/common/ThemeToggle';

const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/user', icon: FiGrid, exact: true },
    { name: 'Saved Projects', path: '/user/saved-projects', icon: FiBookmark },
    { name: 'My Feedback', path: '/user/testimonials', icon: FiMessageSquare },
    { name: 'Messages & Replies', path: '/user/messages', icon: FiMail },
    { name: 'Account Settings', path: '/user/profile', icon: FiUser },
  ];

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text flex flex-col md:flex-row transition-colors duration-200">
      {/* Mobile Header Bar */}
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
            <span className="font-heading font-bold text-sm text-theme-text">User Portal</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <img
            src={user?.avatar?.url || 'http://localhost:5000/uploads/1793208526247_1hk7ux.jpg'}
            alt={user?.name}
            className="w-8 h-8 rounded-full object-cover border border-indigo-500/40"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'http://localhost:5000/uploads/1793208526247_1hk7ux.jpg';
            }}
          />
        </div>
      </div>

      {/* Backdrop for Mobile Drawer */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Desktop & Mobile Drawer) */}
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
                  Member Portal
                </span>
              </div>
            </Link>
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/30">
              User
            </span>
          </div>

          {/* User Profile Snippet */}
          <div className="p-3 rounded-2xl bg-theme-surfaceSecondary border border-theme-border flex items-center gap-3">
            <img
              src={user?.avatar?.url || 'http://localhost:5000/uploads/1793208526247_1hk7ux.jpg'}
              alt={user?.name}
              className="w-10 h-10 rounded-xl object-cover border border-indigo-500/30 shrink-0"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'http://localhost:5000/uploads/1793208526247_1hk7ux.jpg';
              }}
            />
            <div className="overflow-hidden">
              <p className="text-xs font-heading font-bold text-theme-text truncate">
                {user?.name}
              </p>
              <p className="text-[11px] font-mono text-theme-textMuted truncate">
                {user?.email}
              </p>
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
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white font-semibold shadow-glowSm'
                          : 'text-theme-textMuted hover:bg-theme-surfaceSecondary hover:text-theme-text'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
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

      {/* Main Content Body */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
