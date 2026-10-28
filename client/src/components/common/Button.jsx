import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const isBusy = isLoading || loading;
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-theme-accent disabled:opacity-50 disabled:cursor-not-allowed select-none tracking-tight';

  const variants = {
    primary:
      'bg-theme-accent hover:bg-theme-accentHover text-white shadow-subtle active:scale-[0.98]',
    secondary:
      'bg-theme-surface hover:bg-theme-surfaceSecondary text-theme-text border border-theme-border hover:border-theme-accent active:scale-[0.98]',
    outline:
      'border border-theme-accent text-theme-accent hover:bg-theme-accent hover:text-white active:scale-[0.98]',
    ghost:
      'text-theme-textMuted hover:text-theme-text hover:bg-theme-surfaceSecondary',
    danger:
      'bg-red-600 hover:bg-red-700 text-white',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-sm md:text-base gap-2.5 font-semibold',
  };

  return (
    <motion.button
      whileTap={{ scale: disabled || isBusy ? 1 : 0.98 }}
      type={type}
      disabled={disabled || isBusy}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isBusy ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        Icon && <Icon className="w-4 h-4 shrink-0" />
      )}
      {children}
    </motion.button>
  );
};

export default Button;
