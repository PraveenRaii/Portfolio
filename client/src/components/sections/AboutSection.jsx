import React from 'react';
import { motion } from 'framer-motion';
import { LuServer, LuLayoutGrid, LuTerminal, LuUsers, LuGraduationCap } from 'react-icons/lu';

const AboutSection = ({ profile }) => {
  const focusAreas = [
    {
      icon: LuServer,
      title: 'Backend Engineering',
      desc: 'Developing resilient REST APIs with Spring Boot, Java, and Node.js with secure transactional database layers.',
    },
    {
      icon: LuLayoutGrid,
      title: 'Frontend Experiences',
      desc: 'Crafting responsive, accessible user interfaces using React, Tailwind CSS, and lightweight animations.',
    },
    {
      icon: LuTerminal,
      title: 'Problem Solving & DSA',
      desc: 'Strong algorithmic fundamentals, object-oriented principles, and continuous practice in core Java and SQL.',
    },
    {
      icon: LuUsers,
      title: 'Collaborative Building',
      desc: 'Active hackathon participant, disciplined Git workflows, and building solutions with practical real-world impact.',
    },
  ];

  return (
    <section id="about" className="py-24 border-b border-theme-border relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-14 space-y-2">
          <div className="text-theme-accent font-mono text-xs tracking-widestTechnical uppercase font-semibold">
            01 / ABOUT ME
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-theme-text tracking-tight">
            Curious by nature. Developer by choice.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Editorial Narrative & Philosophy */}
          <div className="lg:col-span-7 space-y-6">
            <p className="text-base sm:text-lg text-theme-text leading-relaxed font-normal">
              I am a 3rd-year Computer Science &amp; Engineering student at{' '}
              <strong className="font-semibold text-theme-text">
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

            {/* Editorial Philosophy Callout */}
            <blockquote className="p-5 rounded-xl border-l-2 border-theme-accent bg-theme-surface border-y border-r border-theme-border my-4">
              <p className="text-sm font-medium text-theme-text italic leading-relaxed">
                "Software engineering is about eliminating friction. When clean backend architecture
                meets deliberate frontend clarity, digital tools become effortless."
              </p>
              <cite className="block text-xs font-mono text-theme-accent not-italic mt-2">
                — Praveen Rai
              </cite>
            </blockquote>

            {/* University & Degree Details */}
            <div className="p-4 rounded-xl border border-theme-border bg-theme-surface flex items-start gap-3">
              <LuGraduationCap className="w-5 h-5 text-theme-accent shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-theme-text">
                  Academic Focus
                </h4>
                <p className="text-xs text-theme-textMuted mt-0.5">
                  B.Tech CSE (3rd Year, 2022–2026) • Database Management Systems, Operating Systems,
                  Object-Oriented Programming &amp; Cloud Concepts.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Compact Focus Areas Grid */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {focusAreas.map((area, idx) => {
              const Icon = area.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="p-5 rounded-xl border border-theme-border bg-theme-surface hover:border-theme-accent transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-theme-code flex items-center justify-center text-theme-accent border border-theme-codeBorder">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-theme-text">
                      {area.title}
                    </h3>
                  </div>
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
