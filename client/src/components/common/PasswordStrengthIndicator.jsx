import React from 'react';
import { LuCheck, LuX, LuShieldAlert, LuShieldCheck } from 'react-icons/lu';

/**
 * Utility to calculate password strength score and criteria
 */
export const calculatePasswordStrength = (password = '') => {
  if (!password) {
    return {
      score: 0,
      label: '',
      color: '',
      barColor: '',
      checks: {
        length: false,
        lowercase: false,
        uppercase: false,
        number: false,
        special: false,
      },
    };
  }

  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const passedCount = Object.values(checks).filter(Boolean).length;

  let score = 0;
  let label = 'Weak';
  let color = 'text-rose-500';
  let barColor = 'bg-rose-500';

  if (password.length < 6) {
    score = 1;
    label = 'Too Weak (Min 6 chars)';
    color = 'text-rose-500';
    barColor = 'bg-rose-500';
  } else if (passedCount <= 2) {
    score = 1;
    label = 'Weak';
    color = 'text-rose-500';
    barColor = 'bg-rose-500';
  } else if (passedCount <= 4) {
    score = 2;
    label = 'Medium';
    color = 'text-amber-500';
    barColor = 'bg-amber-500';
  } else {
    score = 3;
    label = 'Strong';
    color = 'text-emerald-500';
    barColor = 'bg-emerald-500';
  }

  return { score, label, color, barColor, checks };
};

const PasswordStrengthIndicator = ({ password = '', showRequirements = true }) => {
  if (!password) return null;

  const { score, label, color, barColor, checks } = calculatePasswordStrength(password);

  const criteriaList = [
    { label: '8+ chars', met: checks.length },
    { label: 'A-Z', met: checks.uppercase },
    { label: '0-9', met: checks.number },
    { label: 'Special (!@#)', met: checks.special },
  ];

  return (
    <div className="space-y-2 mt-2 pt-1 font-mono transition-all">
      {/* Visual meter bar + text label */}
      <div className="flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5">
          {score >= 3 ? (
            <LuShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <LuShieldAlert className={`w-3.5 h-3.5 ${color}`} />
          )}
          <span className="text-theme-textMuted">Password Strength:</span>
          <span className={`font-semibold ${color}`}>{label}</span>
        </div>
        <span className="text-[10px] text-theme-textMuted/70">{password.length} chars</span>
      </div>

      {/* 3-segment progress meter */}
      <div className="grid grid-cols-3 gap-1.5 h-1.5 w-full">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            score >= 1 ? barColor : 'bg-theme-border/60'
          }`}
        />
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            score >= 2 ? barColor : 'bg-theme-border/60'
          }`}
        />
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            score >= 3 ? barColor : 'bg-theme-border/60'
          }`}
        />
      </div>

      {/* Checklist criteria badges */}
      {showRequirements && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {criteriaList.map((item, idx) => (
            <span
              key={idx}
              className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md border transition-colors ${
                item.met
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium'
                  : 'border-theme-border bg-theme-bg/60 text-theme-textMuted/60'
              }`}
            >
              {item.met ? (
                <LuCheck className="w-2.5 h-2.5 text-emerald-500 stroke-[3]" />
              ) : (
                <LuX className="w-2.5 h-2.5 opacity-40" />
              )}
              <span>{item.label}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
