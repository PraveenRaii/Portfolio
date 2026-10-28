import React from 'react';
import { motion } from 'framer-motion';
import { LuSun, LuMoon } from 'react-icons/lu';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      whileHover={{ scale: 1.04 }}
      onClick={toggleTheme}
      type="button"
      className={`relative inline-flex items-center justify-center p-2 rounded-lg border border-theme-border bg-theme-surface text-theme-text hover:text-theme-accent transition-colors focus:outline-none focus:ring-1 focus:ring-theme-accent ${className}`}
      aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} theme`}
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} theme`}
    >
      <div className="relative w-4 h-4">
        {theme === 'dark' ? (
          <LuSun className="w-4 h-4 text-theme-accent" />
        ) : (
          <LuMoon className="w-4 h-4 text-theme-accent" />
        )}
      </div>
    </motion.button>
  );
};

export default ThemeToggle;
