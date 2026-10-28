import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LuUser,
  LuMail,
  LuLock,
  LuBuilding2,
  LuArrowRight,
  LuArrowLeft,
  LuShieldCheck,
} from 'react-icons/lu';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import ThemeToggle from '../components/common/ThemeToggle';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    collegeOrCompany: '',
  });
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      toast.error('Please enter your name, email, and password.');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      await register(formData);
      navigate('/user', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-theme-bg text-theme-text relative overflow-hidden transition-colors selection:bg-theme-accent selection:text-white">
      {/* Background Radial Glow */}
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
              USER SIGN UP
            </span>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-theme-text tracking-tight">
            Create User Account
          </h2>
          <p className="text-xs font-mono text-theme-textMuted">
            Join to save favorite projects, submit feedback &amp; interact
          </p>
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-8 rounded-3xl border border-theme-border bg-theme-surface shadow-card dark:shadow-cardDark space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="block font-mono text-xs text-theme-text font-medium">
                Full Name <span className="text-theme-accent">*</span>
              </label>
              <div className="relative">
                <LuUser className="absolute left-3.5 top-3 text-theme-textMuted w-4 h-4" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Rohan Sharma"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-theme-border bg-theme-bg text-theme-text text-sm placeholder:text-theme-textMuted/50 focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition-colors font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-xs text-theme-text font-medium">
                Email Address <span className="text-theme-accent">*</span>
              </label>
              <div className="relative">
                <LuMail className="absolute left-3.5 top-3 text-theme-textMuted w-4 h-4" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="rohan@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-theme-border bg-theme-bg text-theme-text text-sm placeholder:text-theme-textMuted/50 focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition-colors font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-xs text-theme-text font-medium">
                College / Organization (Optional)
              </label>
              <div className="relative">
                <LuBuilding2 className="absolute left-3.5 top-3 text-theme-textMuted w-4 h-4" />
                <input
                  type="text"
                  name="collegeOrCompany"
                  value={formData.collegeOrCompany}
                  onChange={handleChange}
                  placeholder="e.g. SRMU Lucknow / Tech Innovators"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-theme-border bg-theme-bg text-theme-text text-sm placeholder:text-theme-textMuted/50 focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition-colors font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-xs text-theme-text font-medium">
                Password <span className="text-theme-accent">*</span>
              </label>
              <div className="relative">
                <LuLock className="absolute left-3.5 top-3 text-theme-textMuted w-4 h-4" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Minimum 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-theme-border bg-theme-bg text-theme-text text-sm placeholder:text-theme-textMuted/50 focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition-colors font-mono"
                />
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
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </Button>
          </form>

          <div className="pt-4 border-t border-theme-border/60 text-center text-xs font-mono text-theme-textMuted">
            <span>Already have an account? </span>
            <Link to="/login" className="text-theme-accent font-semibold hover:underline">
              Sign In to Portal &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
