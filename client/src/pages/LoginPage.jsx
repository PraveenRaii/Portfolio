import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LuMail,
  LuLock,
  LuEye,
  LuEyeOff,
  LuArrowRight,
  LuShield,
  LuUser,
  LuSparkles,
  LuArrowLeft,
  LuCheck,
} from 'react-icons/lu';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import ThemeToggle from '../components/common/ThemeToggle';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('admin'); // 'admin' | 'user'
  const [formData, setFormData] = useState({
    email: 'praveen1234202040@gmail.com',
    password: 'AdminPraveen@2026',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabChange = (role) => {
    setActiveTab(role);
    if (role === 'admin') {
      setFormData({
        email: 'praveen1234202040@gmail.com',
        password: 'AdminPraveen@2026',
      });
    } else {
      setFormData({
        email: 'rohan.sharma@example.com',
        password: 'UserDemo@123',
      });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) {
      toast.error('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      const user = await login(formData);
      toast.success(`Authenticated as ${user.role.toUpperCase()}: Welcome ${user.name}!`);

      // Redirect based on returned authenticated role
      const destination =
        location.state?.from?.pathname ||
        (user.role === 'admin' ? '/admin' : '/user');
      navigate(destination, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Invalid credentials. Please verify email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-theme-bg text-theme-text relative overflow-hidden transition-colors selection:bg-theme-accent selection:text-white">
      {/* Subtle Background Glow Mesh */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-theme-accent/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header Controls */}
      <div className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between max-w-5xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded-lg border border-theme-border bg-theme-surface text-theme-textMuted hover:text-theme-text hover:border-theme-accent transition-colors"
        >
          <LuArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Portfolio</span>
        </Link>

        <ThemeToggle />
      </div>

      <div className="w-full max-w-md relative z-10 pt-12 pb-6">
        
        {/* Brand Header */}
        <div className="text-center mb-8 space-y-2">
          <Link
            to="/"
            className="inline-flex items-center font-mono text-2xl font-bold tracking-tight text-theme-text transition-colors"
          >
            <span>PR</span>
            <span className="text-theme-accent">.</span>
            <span className="text-xs font-mono text-theme-textMuted font-normal ml-2 px-2 py-0.5 rounded border border-theme-border bg-theme-surface">
              PORTAL LOGIN
            </span>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-theme-text tracking-tight">
            Single Secure Sign In
          </h2>
          <p className="text-xs font-mono text-theme-textMuted">
            Authenticate to access either the Admin Dashboard or User Portal
          </p>
        </div>

        {/* Card Container */}
        <div className="p-6 sm:p-8 rounded-3xl border border-theme-border bg-theme-surface shadow-card dark:shadow-cardDark space-y-6">
          
          {/* Role Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-theme-bg border border-theme-border">
            <button
              type="button"
              onClick={() => handleTabChange('admin')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                activeTab === 'admin'
                  ? 'bg-theme-accent text-white shadow-sm'
                  : 'text-theme-textMuted hover:text-theme-text'
              }`}
            >
              <LuShield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('user')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                activeTab === 'user'
                  ? 'bg-theme-accent text-white shadow-sm'
                  : 'text-theme-textMuted hover:text-theme-text'
              }`}
            >
              <LuUser className="w-3.5 h-3.5" />
              <span>User Portal</span>
            </button>
          </div>

          {/* Role Guidance Banner */}
          <div className="p-3.5 rounded-xl border border-theme-border bg-theme-code/50 text-xs font-mono flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="text-theme-accent font-bold uppercase tracking-wider text-[10px] block">
                {activeTab === 'admin' ? '🛡️ Administrator Access' : '👤 Registered User Access'}
              </span>
              <p className="text-theme-textMuted text-[11px] leading-relaxed">
                {activeTab === 'admin'
                  ? 'Manage projects, respond to inquiries, view real-time traffic & update settings.'
                  : 'Save favorite projects, submit public feedback, and message Praveen.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleTabChange(activeTab)}
              className="shrink-0 text-[10px] px-2 py-1 rounded bg-theme-surface border border-theme-border text-theme-accent hover:border-theme-accent font-semibold flex items-center gap-1 transition-colors"
              title="Auto-fill credentials"
            >
              <LuSparkles className="w-3 h-3" />
              <span>Quick Fill</span>
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block font-mono text-xs text-theme-text font-medium">
                Email Address
              </label>
              <div className="relative">
                <LuMail className="absolute left-3.5 top-3 text-theme-textMuted w-4 h-4" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder={
                    activeTab === 'admin'
                      ? 'praveen1234202040@gmail.com'
                      : 'rohan.sharma@example.com'
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-theme-border bg-theme-bg text-theme-text text-sm placeholder:text-theme-textMuted/50 focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition-colors font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block font-mono text-xs text-theme-text font-medium">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="font-mono text-[11px] text-theme-accent hover:text-theme-accentHover transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <LuLock className="absolute left-3.5 top-3 text-theme-textMuted w-4 h-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-theme-border bg-theme-bg text-theme-text text-sm placeholder:text-theme-textMuted/50 focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-theme-textMuted hover:text-theme-text focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <LuEyeOff className="w-4 h-4" />
                  ) : (
                    <LuEye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              disabled={loading}
              icon={LuArrowRight}
              className="w-full mt-2 font-mono uppercase tracking-wider text-xs font-bold"
            >
              {loading ? 'Authenticating...' : `Sign In to ${activeTab === 'admin' ? 'Admin Portal' : 'User Portal'}`}
            </Button>
          </form>

          {/* Quick Credential Reference for Convenience */}
          <div className="pt-4 border-t border-theme-border/60 text-[11px] font-mono text-theme-textMuted space-y-1">
            <div className="flex items-center justify-between text-theme-text">
              <span className="font-semibold text-theme-accent">Default Admin:</span>
              <span>praveen1234202040@gmail.com</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Admin Pass:</span>
              <span className="text-theme-text">AdminPraveen@2026</span>
            </div>
          </div>

          {/* Registration link for user role */}
          {activeTab === 'user' && (
            <div className="pt-2 text-center text-xs font-mono text-theme-textMuted">
              <span>Don't have an account yet? </span>
              <Link
                to="/register"
                className="text-theme-accent hover:underline font-semibold"
              >
                Register as User &rarr;
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
