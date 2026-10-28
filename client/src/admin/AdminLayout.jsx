import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  FiGrid,
  FiFolder,
  FiCpu,
  FiBookOpen,
  FiUsers,
  FiCheckSquare,
  FiMail,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiHome,
  FiShield,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/common/ThemeToggle';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: FiGrid, exact: true },
    { name: 'Projects', path: '/admin/projects', icon: FiFolder },
    { name: 'Skills & Tech', path: '/admin/skills', icon: FiCpu },
    { name: 'Academics & Certs', path: '/admin/experience', icon: FiBookOpen },
    { name: 'Users Manager', path: '/admin/users', icon: FiUsers },
    { name: 'Testimonials', path: '/admin/testimonials', icon: FiCheckSquare },
    { name: 'Messages Inbox', path: '/admin/messages', icon: FiMail },
    { name: 'Site & Resume', path: '/admin/settings', icon: FiSettings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-gray-100 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 glass-panel border-b border-gray-200 dark:border-dark-border sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface"
          >
            {sidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
          <span className="font-mono font-bold text-sm text-brand-500">Admin Control</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <img
            src={user?.avatar?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'}
            alt="Admin"
            className="w-8 h-8 rounded-full object-cover border border-brand-500/30"
          />
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white dark:bg-dark-card border-r border-gray-200 dark:border-dark-border p-6 flex flex-col justify-between z-40 transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-dark-border">
            <Link to="/" className="font-mono text-lg font-bold text-gray-900 dark:text-white">
              <span className="text-brand-500">&lt;</span>
              Praveen
              <span className="text-brand-500"> /&gt;</span>
            </Link>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-500 text-white shadow-sm flex items-center gap-1">
              <FiShield className="w-2.5 h-2.5" />
              Admin
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-dark-surface border border-gray-100 dark:border-dark-border flex items-center gap-3">
            <img
              src={user?.avatar?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'}
              alt="Admin"
              className="w-10 h-10 rounded-full object-cover border border-brand-500/30 shrink-0"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                {user?.name || 'Praveen Rai'}
              </p>
              <p className="text-[11px] text-brand-500 font-semibold truncate">
                Super Administrator
              </p>
            </div>
          </div>

          {/* Navigation Items */}
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
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-500 text-white shadow-glowSm font-semibold'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface hover:text-gray-900 dark:hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-gray-100 dark:border-dark-border space-y-2">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Theme</span>
            <ThemeToggle />
          </div>

          <Link
            to="/"
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-brand-500"
          >
            <FiHome className="w-4 h-4" />
            Live Portfolio View
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <FiLogOut className="w-4 h-4" />
            Log Out Admin
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
