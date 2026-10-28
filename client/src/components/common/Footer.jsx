import React from 'react';
import { LuGithub, LuLinkedin, LuMail, LuArrowUp, LuHeart } from 'react-icons/lu';
import { Link } from 'react-router-dom';

const Footer = ({ profile }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();
  const email = profile?.email || 'praveen1234202040@gmail.com';
  const github = profile?.socialLinks?.github || 'https://github.com/PraveenRaii';
  const linkedin =
    profile?.socialLinks?.linkedin || 'https://www.linkedin.com/in/praveen-rai-9r13/';

  return (
    <footer className="border-t border-theme-border bg-theme-surface py-14 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="font-heading font-extrabold text-2xl tracking-tight text-theme-text">
                PR<span className="text-indigo-500">.</span>
              </span>
              <span className="font-mono text-xs text-theme-textMuted uppercase tracking-wider pl-2 border-l border-theme-border">
                Praveen Rai
              </span>
            </div>

            <p className="text-xs sm:text-sm text-theme-textMuted max-w-sm leading-relaxed">
              Full Stack Developer specializing in Java, Spring Boot, React, and scalable distributed web
              architectures. 3rd-year CSE student at SRMU Lucknow (Powered by Sunstone).
            </p>
          </div>

          {/* Quick Nav Anchors */}
          <div className="md:col-span-4 space-y-2.5">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-indigo-500">
              Navigation
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-theme-textMuted">
              <a href="#about" className="hover:text-indigo-500 transition-colors">
                01 / About
              </a>
              <a href="#projects" className="hover:text-indigo-500 transition-colors">
                02 / Work
              </a>
              <a href="#skills" className="hover:text-indigo-500 transition-colors">
                03 / Toolkit
              </a>
              <a href="#experience" className="hover:text-indigo-500 transition-colors">
                04 / Journey
              </a>
              <a href="#testimonials" className="hover:text-indigo-500 transition-colors">
                Endorsements
              </a>
              <a href="#contact" className="hover:text-indigo-500 transition-colors">
                05 / Say Hello
              </a>
            </div>
          </div>

          {/* Connect & Top */}
          <div className="md:col-span-3 space-y-3 md:text-right flex flex-col md:items-end justify-between">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-indigo-500">
              Connect
            </h4>
            <div className="flex items-center gap-3">
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="w-9 h-9 rounded-xl border border-theme-border bg-theme-bg flex items-center justify-center text-theme-text hover:border-indigo-500 hover:text-indigo-500 transition-colors"
              >
                <LuGithub className="w-4 h-4" />
              </a>
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="w-9 h-9 rounded-xl border border-theme-border bg-theme-bg flex items-center justify-center text-theme-text hover:border-indigo-500 hover:text-indigo-500 transition-colors"
              >
                <LuLinkedin className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${email}`}
                aria-label="Email Me"
                className="w-9 h-9 rounded-xl border border-theme-border bg-theme-bg flex items-center justify-center text-theme-text hover:border-indigo-500 hover:text-indigo-500 transition-colors"
              >
                <LuMail className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={scrollToTop}
                aria-label="Back to Top"
                className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-500 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-subtle"
                title="Scroll back to top"
              >
                <LuArrowUp className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded-lg border border-theme-border bg-theme-bg text-indigo-600 dark:text-indigo-400 hover:border-indigo-500 transition-colors font-semibold shadow-subtle"
              >
                <span>Admin &amp; User Login</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="pt-8 border-t border-theme-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-theme-textMuted">
          <div>
            &copy; {currentYear} Praveen Rai. All rights reserved.
          </div>
          <div className="flex items-center gap-2">
            <span>Crafted with</span>
            <span className="text-indigo-500 font-semibold">Electric Indigo</span>
            <span>&bull;</span>
            <span>Built with React, Vite &amp; Tailwind</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
