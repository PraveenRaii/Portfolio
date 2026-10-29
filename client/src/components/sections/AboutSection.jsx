import React from 'react';
import { motion } from 'framer-motion';
import {
  LuServer,
  LuLayoutGrid,
  LuTerminal,
  LuUsers,
  LuGraduationCap,
  LuMapPin,
  LuArrowUpRight,
  LuSparkles,
} from 'react-icons/lu';
import { SiLeetcode } from 'react-icons/si';
import { getAssetUrl, DEFAULT_AVATAR, FALLBACK_AVATAR_DATA_URI } from '../../utils/imageUrl';

const AboutSection = ({ profile }) => {
  const avatarSrc = getAssetUrl(profile?.avatar?.url);

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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left: Magazine-Grade Editorial Developer Portrait Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-4"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-500 rounded-3xl blur-md opacity-40 group-hover:opacity-70 transition duration-500" />
              
              <div className="relative rounded-3xl border border-theme-border bg-theme-surface p-3 sm:p-3.5 shadow-card overflow-hidden">
                <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-theme-surfaceSecondary">
                  <img
                    src={avatarSrc}
                    alt={profile?.name || 'Praveen Rai'}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      if (e.target.src !== DEFAULT_AVATAR && !e.target.src.includes('profile.jpg')) {
                        e.target.src = DEFAULT_AVATAR;
                      } else {
                        e.target.src = FALLBACK_AVATAR_DATA_URI;
                      }
                    }}
                  />
                  {/* Subtle Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                  {/* Top Live Status Pill */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/65 backdrop-blur-md border border-white/15 text-[10px] font-mono text-white flex items-center gap-1.5 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Open to Internships</span>
                  </div>

                  {/* Bottom Portrait Meta Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 p-3.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-white">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <h3 className="font-heading font-black text-sm tracking-tight text-white truncate">
                          {profile?.name || 'Praveen Rai'}
                        </h3>
                        <p className="text-[11px] font-mono text-gray-300 truncate">
                          {profile?.roleTitle || 'Full Stack Developer'} &bull; SRMU
                        </p>
                      </div>
                      <span className="shrink-0 px-2 py-1 rounded bg-indigo-500/30 border border-indigo-400/40 text-[10px] font-mono font-bold text-indigo-300">
                        B.Tech '26
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sub-Card Highlights Under Photo */}
                <div className="p-2.5 pt-3 grid grid-cols-2 gap-2 text-center text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-theme-surfaceSecondary border border-theme-border flex flex-col items-center justify-center">
                    <div className="text-[10px] text-theme-textMuted uppercase flex items-center gap-1">
                      <LuMapPin className="w-3 h-3 text-theme-accent" />
                      Location
                    </div>
                    <div className="font-bold text-theme-text text-[11px] truncate mt-0.5">
                      {profile?.location || 'Lucknow, India'}
                    </div>
                  </div>

                  <a
                    href={profile?.socialLinks?.leetcode || 'https://leetcode.com/u/Praveen_913/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:border-amber-500 transition-colors flex flex-col items-center justify-center group/lc"
                  >
                    <div className="text-[10px] text-amber-600 dark:text-amber-400 uppercase font-semibold flex items-center gap-1">
                      <SiLeetcode className="w-3 h-3 text-amber-500" />
                      LeetCode
                      <LuArrowUpRight className="w-2.5 h-2.5 opacity-70 group-hover/lc:translate-x-0.5 transition-transform" />
                    </div>
                    <div className="font-bold text-amber-600 dark:text-amber-400 text-[11px] truncate mt-0.5">
                      @Praveen_913
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Narrative, Philosophy & Focus Cards */}
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

            {/* Focus Area Cards (2x2 Grid) */}
            <div className="pt-2">
              <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">
                Core Engineering Pillars
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {focusAreas.map((area, idx) => {
                  const Icon = area.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: idx * 0.08 }}
                      className="p-4 rounded-2xl border border-theme-border bg-theme-surface hover:border-indigo-500/40 transition-colors shadow-subtle space-y-2 group"
                    >
                      <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${area.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-heading font-bold text-xs text-theme-text group-hover:text-indigo-500 transition-colors">
                        {area.title}
                      </h3>
                      <p className="text-[11px] text-theme-textMuted leading-relaxed">
                        {area.desc}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
