import React from 'react';

const DeveloperMarquee = () => {
  const items = [
    'JAVA DEVELOPMENT',
    'REACT',
    'SPRING BOOT',
    'REST APIS',
    'MYSQL',
    'PROBLEM SOLVING',
    'FULL STACK ARCHITECTURE',
    'DATA STRUCTURES & ALGORITHMS',
  ];

  return (
    <div className="w-full border-y border-theme-border bg-theme-surface/50 py-3.5 overflow-hidden select-none">
      <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
        {/* Render 2 passes for infinite loop */}
        {[...items, ...items].map((tech, index) => (
          <div
            key={index}
            className="flex items-center gap-8 text-xs font-mono font-medium tracking-widestTechnical text-theme-textMuted uppercase"
          >
            <span className="hover:text-theme-accent transition-colors">{tech}</span>
            <span className="text-theme-accent text-[9px] opacity-70">◆</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeveloperMarquee;
