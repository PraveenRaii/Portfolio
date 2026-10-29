import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LuMenu, LuX, LuDownload, LuArrowUpRight, LuUser, LuShield } from 'react-icons/lu';
import { useAuth } from '../../context/AuthContext';
import { publicService } from '../../services/publicService';
import ThemeToggle from './ThemeToggle';
import toast from 'react-hot-toast';
import { getAssetUrl, DEFAULT_AVATAR, DEFAULT_RESUME } from '../../utils/imageUrl';

const Navbar = ({ profile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [downloading, setDownloading] = useState(false);

  const { role, isAuthenticated } = useAuth();
  const location = useLocation();

  const avatarSrc = getAssetUrl(profile?.avatar?.url);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ['home', 'about', 'projects', 'skills', 'experience', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Projects', href: '#projects', id: 'projects' },
    { name: 'Skills', href: '#skills', id: 'skills' },
    { name: 'Journey', href: '#experience', id: 'experience' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  const handleDownloadResume = async () => {
    try {
      setDownloading(true);
      const res = await publicService.getResumeDownload();
      const resumeUrl = getAssetUrl(res?.url || profile?.resume?.url) || DEFAULT_RESUME;
      window.open(resumeUrl, '_blank', 'noopener,noreferrer');
      toast.success('Resume PDF opened');
    } catch (err) {
      const fallbackUrl = getAssetUrl(profile?.resume?.url) || DEFAULT_RESUME;
      window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-theme-surface/85 backdrop-blur-md border-b border-theme-border py-3 shadow-subtle'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Left: PR. Typographic Monogram & Avatar & Status */}
          <div className="flex items-center gap-3">
            <a
              href="#home"
              className="group flex items-center gap-2.5 font-heading text-2xl font-black tracking-tight text-theme-text transition-colors"
            >
              <div className="relative shrink-0">
                <img
                  src={avatarSrc}
                  alt={profile?.name || 'Praveen Rai'}
                  className="w-8 h-8 rounded-xl object-cover border border-theme-border group-hover:border-indigo-500 transition-colors shadow-subtle"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_AVATAR;
                  }}
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-theme-surface" />
              </div>

              <div className="flex items-center">
                <span>PR</span>
                <span className="text-indigo-500">.</span>
              </div>
            </a>

            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-[10px] font-mono tracking-wider uppercase text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Available
            </div>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-full border border-theme-border bg-theme-surface/60 backdrop-blur-md shadow-subtle">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-xs font-mono tracking-wider transition-all px-3 py-1.5 rounded-full relative ${
                    isActive
                      ? 'bg-indigo-600 text-white font-semibold shadow-glowSm'
                      : 'text-theme-textMuted hover:text-theme-text hover:bg-theme-bg'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Right: Theme Toggle, Resume & Portal Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            <ThemeToggle />

            <button
              type="button"
              onClick={handleDownloadResume}
              disabled={downloading}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-1.5 rounded-lg border border-theme-border bg-theme-surface hover:border-indigo-500 text-theme-text transition-all shadow-subtle"
              title="Download Praveen Rai's Latest Resume PDF"
            >
              <LuDownload className="w-3.5 h-3.5 text-indigo-500" />
              <span>{downloading ? 'Loading...' : 'Resume'}</span>
            </button>

            {isAuthenticated ? (
              <Link
                to={role === 'admin' ? '/admin' : '/user'}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-glowSm transition-all"
              >
                {role === 'admin' ? <LuShield className="w-3.5 h-3.5" /> : <LuUser className="w-3.5 h-3.5" />}
                <span>{role === 'admin' ? 'Admin' : 'Dashboard'}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-3.5 py-1.5 rounded-lg border border-indigo-500/40 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white shadow-subtle transition-all"
                title="Sign in as Administrator or User"
              >
                <LuShield className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Actions & Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg border border-theme-border bg-theme-surface text-theme-text hover:text-indigo-500 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <LuX className="w-5 h-5" /> : <LuMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-theme-border bg-theme-surface/98 backdrop-blur-xl px-6 py-6 mt-3 space-y-4 shadow-card">
          {/* Mobile Profile Header */}
          <div className="pb-4 border-b border-theme-border flex items-center gap-3">
            <img
              src={avatarSrc}
              alt={profile?.name || 'Praveen Rai'}
              className="w-10 h-10 rounded-xl object-cover border border-indigo-500/40"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = DEFAULT_AVATAR;
              }}
            />
            <div className="min-w-0">
              <div className="font-heading font-bold text-sm text-theme-text truncate">
                {profile?.name || 'Praveen Rai'}
              </div>
              <div className="font-mono text-xs text-indigo-500 truncate">
                {profile?.roleTitle || 'Full Stack Developer'}
              </div>
            </div>
          </div>

          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-mono tracking-wider text-theme-text hover:text-indigo-500 py-1.5 transition-colors flex items-center justify-between"
              >
                <span>{link.name}</span>
                <span className="text-theme-textMuted text-xs font-normal">→</span>
              </a>
            ))}
          </nav>

          <div className="pt-4 border-t border-theme-border flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                handleDownloadResume();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-indigo-600 text-white font-mono text-xs uppercase tracking-wider font-semibold shadow-glowSm"
            >
              <LuDownload className="w-4 h-4" />
              Download Resume PDF
            </button>

            {isAuthenticated ? (
              <Link
                to={role === 'admin' ? '/admin' : '/user'}
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-indigo-600 text-white text-xs font-mono uppercase tracking-wider font-semibold"
              >
                {role === 'admin' ? <LuShield className="w-4 h-4" /> : <LuUser className="w-4 h-4" />}
                <span>{role === 'admin' ? 'Open Admin Portal' : 'Open My Dashboard'}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-indigo-500/40 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white text-xs font-mono uppercase tracking-wider font-semibold transition-colors"
              >
                <LuShield className="w-4 h-4" />
                <span>Admin &amp; User Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
