import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiAlertCircle } from 'react-icons/fi';
import Button from '../components/common/Button';
import ThemeToggle from '../components/common/ThemeToggle';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-dark-bg text-center relative overflow-hidden">
      <div className="hero-glow" />

      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="relative z-10 max-w-md space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto">
          <FiAlertCircle className="w-8 h-8" />
        </div>

        <h1 className="text-7xl font-extrabold font-mono text-brand-500">404</h1>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Page Not Found
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            The page you're trying to reach does not exist or has been relocated.
          </p>
        </div>

        <Link to="/" className="inline-block">
          <Button variant="primary" size="md" icon={FiHome}>
            Return to Portfolio
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
