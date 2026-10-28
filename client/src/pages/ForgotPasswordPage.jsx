import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LuMail,
  LuKey,
  LuLock,
  LuArrowRight,
  LuArrowLeft,
  LuShieldCheck,
} from 'react-icons/lu';
import { authService } from '../services/authService';
import Button from '../components/common/Button';
import ThemeToggle from '../components/common/ThemeToggle';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Reset with OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your registered email address');
      return;
    }

    try {
      setLoading(true);
      const res = await authService.forgotPassword(email);
      toast.success(res.message || 'OTP has been dispatched to your email.');
      setStep(2);
    } catch (err) {
      toast.error(err.message || 'Failed to dispatch reset code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp.trim() || !newPassword.trim()) {
      toast.error('Please enter both OTP and your new password');
      return;
    }

    try {
      setLoading(true);
      const res = await authService.resetPassword({ email, otp, newPassword });
      toast.success(res.message || 'Password reset successfully! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.message || 'Password reset failed. Please check your OTP.');
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
          to="/login"
          className="inline-flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded-lg border border-theme-border bg-theme-surface text-theme-textMuted hover:text-theme-text hover:border-theme-accent transition-colors"
        >
          <LuArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
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
              SECURITY RECOVERY
            </span>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-theme-text tracking-tight">
            Reset Password
          </h2>
          <p className="text-xs font-mono text-theme-textMuted">
            {step === 1
              ? 'Receive a one-time verification code on your email'
              : 'Enter verification OTP and your new password'}
          </p>
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-8 rounded-3xl border border-theme-border bg-theme-surface shadow-card dark:shadow-cardDark space-y-6">
          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block font-mono text-xs text-theme-text font-medium">
                  Registered Email Address
                </label>
                <div className="relative">
                  <LuMail className="absolute left-3.5 top-3 text-theme-textMuted w-4 h-4" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="e.g. praveen1234202040@gmail.com"
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
                {loading ? 'Sending OTP...' : 'Send Recovery OTP'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block font-mono text-xs text-theme-text font-medium">
                  Verification OTP Code
                </label>
                <div className="relative">
                  <LuKey className="absolute left-3.5 top-3 text-theme-textMuted w-4 h-4" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-theme-border bg-theme-bg text-theme-text text-sm placeholder:text-theme-textMuted/50 focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition-colors font-mono tracking-widest text-center font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-xs text-theme-text font-medium">
                  New Password
                </label>
                <div className="relative">
                  <LuLock className="absolute left-3.5 top-3 text-theme-textMuted w-4 h-4" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                icon={LuShieldCheck}
                className="w-full mt-2 font-mono uppercase tracking-wider text-xs font-bold"
              >
                {loading ? 'Resetting Password...' : 'Confirm & Save Password'}
              </Button>
            </form>
          )}

          <div className="pt-4 border-t border-theme-border/60 text-center text-xs font-mono text-theme-textMuted">
            <Link to="/login" className="text-theme-accent font-semibold hover:underline">
              Return to Portal Login &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
