import React from 'react';
import { motion } from 'framer-motion';
import { LuServer, LuLayoutGrid, LuTerminal, LuUsers, LuGraduationCap } from 'react-icons/lu';

const AboutSection = ({ profile }) => {
  const focusAreas = [
    {
      icon: LuServer,
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
      title: 'Backend Engineering',
      desc: 'Architecting resilient, transactional REST APIs with Spring Boot, Java, and Node.js with secure relational & document database layers.',
    },
    {
      icon: LuLayoutGrid,
      color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
      title: 'Frontend Experiences',
      desc: 'Crafting responsive, accessible user interfaces using React, modern Tailwind CSS, and fluid interactive animations.',
    },
    {
      icon: LuTerminal,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
      title: 'Problem Solving & DSA',
      desc: 'Disciplined practice in algorithmic optimization, data structures, and core object-oriented software engineering principles.',
    },
    {
      icon: LuUsers,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      title: 'Collaborative Building',
      desc: 'Active hackathon team contributor, clean Git versioning workflows, and delivering solutions with measurable real-world utility.',
    },
  ];

  return (
    <section id="about" className="py-24 border-b border-theme-border relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-14 space-y-2">
          <div className="text-indigo-600 dark:text-indigo-400 font-mono text-xs tracking-widestTechnical uppercase font-semibold">
            01 / ABOUT ME
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-theme-text tracking-tight">
            Curious by nature. Developer by choice.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Editorial Narrative & Philosophy */}
          <div className="lg:col-span-7 space-y-6">
            <p className="text-base sm:text-lg text-theme-text leading-relaxed font-normal">
              I am a 3rd-year Computer Science &amp; Engineering student at{' '}
              <strong className="font-semibold text-theme-text underline decoration-indigo-500/30">
                Shri Ramswaroop Memorial University (SRMU), Lucknow (Powered by Sunstone)
              </strong>
              . My focus centers on full stack development — bridging solid Java &amp; Spring Boot
              backend architectures with responsive, component-driven React frontends.
            </p>

            <p className="text-sm sm:text-base text-theme-textMuted leading-relaxed">
              Whether building a citizen grievance portal or an enterprise asset tracker, I approach
              each challenge with a balance of engineering rigor and human-centered design. I enjoy
              dissecting complex system requirements into modular, maintainable codebases.
            </p>

            {/* Aesthetic Philosophy Callout */}
            <blockquote className="p-5 rounded-2xl border-l-4 border-indigo-500 bg-theme-surface border border-theme-border my-4 shadow-card">
              <p className="text-sm font-medium text-theme-text italic leading-relaxed">
                "Software engineering is about eliminating friction. When clean backend architecture
                meets deliberate frontend clarity, digital tools become effortless."
              </p>
              <cite className="block text-xs font-mono text-indigo-600 dark:text-indigo-400 not-italic mt-2 font-semibold">
                — Praveen Rai
              </cite>
            </blockquote>

            {/* University & Degree Details */}
            <div className="p-4 rounded-2xl border border-theme-border bg-theme-surface shadow-subtle flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shrink-0">
                <LuGraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-theme-text">
                  Academic Focus &bull; SRMU Lucknow
                </h4>
                <p className="text-xs text-theme-textMuted mt-0.5">
                  Bachelor of Technology (B.Tech) in Computer Science &amp; Engineering (3rd Year, 2022–2026).
                </p>
              </div>
            </div>
          </div>

          {/* Right: Modern Focus Area Cards */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {focusAreas.map((area, idx) => {
              const Icon = area.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.08 }}
                  className="p-5 rounded-2xl border border-theme-border bg-theme-surface hover:border-indigo-500/40 transition-colors shadow-subtle space-y-3 group"
                >
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${area.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-heading font-bold text-sm text-theme-text group-hover:text-indigo-500 transition-colors">
                    {area.title}
                  </h3>
                  <p className="text-xs text-theme-textMuted leading-relaxed">
                    {area.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
