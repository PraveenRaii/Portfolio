import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LuMenu, LuX, LuDownload, LuArrowUpRight, LuUser, LuShield } from 'react-icons/lu';
import { useAuth } from '../../context/AuthContext';
import { publicService } from '../../services/publicService';
import ThemeToggle from './ThemeToggle';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [downloading, setDownloading] = useState(false);

  const { role, isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Simple active section detection
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
    { name: 'Experience', href: '#experience', id: 'experience' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  const handleDownloadResume = async () => {
    try {
      setDownloading(true);
      const res = await publicService.getResumeDownload();
      if (res && res.url) {
        window.open(res.url, '_blank', 'noopener,noreferrer');
        toast.success('Resume PDF opened');
      } else {
        window.open('http://localhost:5000/uploads/Praveen_Rai_Resume.pdf', '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      window.open('http://localhost:5000/uploads/Praveen_Rai_Resume.pdf', '_blank', 'noopener,noreferrer');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-theme-surface/90 backdrop-blur-md border-b border-theme-border py-3 shadow-subtle'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left: PR. Typographic Monogram & Status */}
          <div className="flex items-center gap-3">
            <a
              href="#home"
              className="group flex items-center font-mono text-xl font-bold tracking-tight text-theme-text transition-colors"
            >
              <span>PR</span>
              <span className="text-theme-accent">.</span>
            </a>

            <div className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-theme-border bg-theme-surface text-[10px] font-mono tracking-wider uppercase text-theme-textMuted">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Available
            </div>
          </div>

          {/* Center: Clean Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-xs font-mono uppercase tracking-wider transition-colors relative py-1 ${
                    isActive
                      ? 'text-theme-accent font-semibold'
                      : 'text-theme-textMuted hover:text-theme-text'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-theme-accent rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Resume Action */}
            <button
              type="button"
              onClick={handleDownloadResume}
              disabled={downloading}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-medium px-3.5 py-1.5 rounded-lg border border-theme-border bg-theme-surface text-theme-text hover:border-theme-accent hover:text-theme-accent transition-colors"
              title="Download Praveen Rai's Resume"
            >
              <LuDownload className="w-3.5 h-3.5 text-theme-accent" />
              <span>Resume</span>
              <LuArrowUpRight className="w-3 h-3 text-theme-textMuted" />
            </button>

            {/* Dark/Light Toggle */}
            <ThemeToggle />

            {/* Admin / Portal Login Action */}
            {isAuthenticated ? (
              <Link
                to={role === 'admin' ? '/admin' : '/user'}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-3.5 py-1.5 rounded-lg bg-theme-accent text-white hover:bg-theme-accentHover shadow-subtle transition-all"
                title={role === 'admin' ? 'Admin Portal Dashboard' : 'User Dashboard'}
              >
                {role === 'admin' ? (
                  <LuShield className="w-3.5 h-3.5" />
                ) : (
                  <LuUser className="w-3.5 h-3.5" />
                )}
                <span>{role === 'admin' ? 'Admin Portal' : 'User Portal'}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-3.5 py-1.5 rounded-lg border border-theme-accent/80 text-theme-accent hover:bg-theme-accent hover:text-white shadow-subtle transition-all"
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
              className="p-2 rounded-lg border border-theme-border bg-theme-surface text-theme-text hover:text-theme-accent focus:outline-none"
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
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-mono uppercase tracking-wider text-theme-text hover:text-theme-accent py-1.5 transition-colors flex items-center justify-between"
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
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-theme-accent text-white font-mono text-xs uppercase tracking-wider font-semibold"
            >
              <LuDownload className="w-4 h-4" />
              Download Resume PDF
            </button>

            {isAuthenticated ? (
              <Link
                to={role === 'admin' ? '/admin' : '/user'}
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-theme-accent text-white text-xs font-mono uppercase tracking-wider font-semibold"
              >
                {role === 'admin' ? <LuShield className="w-4 h-4" /> : <LuUser className="w-4 h-4" />}
                <span>{role === 'admin' ? 'Open Admin Portal' : 'Open My Dashboard'}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-theme-accent text-theme-accent hover:bg-theme-accent hover:text-white text-xs font-mono uppercase tracking-wider font-semibold transition-colors"
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
