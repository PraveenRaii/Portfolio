import React from 'react';

const DeveloperMarquee = () => {
  const items = [
    'JAVA ENTERPRISE',
    'REACT ECOSYSTEM',
    'SPRING BOOT 3',
    'RESTFUL APIS',
    'MYSQL & MONGODB',
    'DATA STRUCTURES & ALGORITHMS',
    'CLOUD & SYSTEM ARCHITECTURE',
    'CLEAN CODE PRINCIPLES',
  ];

  return (
    <div className="w-full border-y border-theme-border bg-theme-surface/40 backdrop-blur-sm py-4 overflow-hidden select-none">
      <div className="animate-marquee flex items-center gap-10 whitespace-nowrap">
        {/* Render 2 passes for seamless infinite loop */}
        {[...items, ...items].map((tech, index) => (
          <div
            key={index}
            className="flex items-center gap-10 text-xs font-mono font-semibold tracking-widestTechnical text-theme-textMuted uppercase transition-colors"
          >
            <span className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
              {tech}
            </span>
            <span className="text-indigo-500/70 text-[8px] animate-pulse">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeveloperMarquee;
