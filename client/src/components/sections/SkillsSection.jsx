import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LuCode,
  LuLayoutGrid,
  LuServer,
  LuDatabase,
  LuCpu,
  LuCheck,
  LuWrench,
  LuTerminal,
} from 'react-icons/lu';

const categoryMeta = {
  languages: {
    id: 'languages',
    title: 'Languages',
    icon: LuCode,
    color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    description: 'Core programming languages used for systems, scripting, and web applications.',
  },
  backend: {
    id: 'backend',
    title: 'Backend & APIs',
    icon: LuServer,
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    description: 'Server architecture, RESTful web services, middleware, and database transaction layers.',
  },
  frontend: {
    id: 'frontend',
    title: 'Frontend Ecosystem',
    icon: LuLayoutGrid,
    color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
    description: 'Component architecture, responsive UI design systems, state flow, and modern web tooling.',
  },
  database: {
    id: 'database',
    title: 'Databases & Cloud',
    icon: LuDatabase,
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    description: 'Persistence engines, relational/document stores, and cloud media storage.',
  },
  tools: {
    id: 'tools',
    title: 'Tools & DevOps',
    icon: LuWrench,
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    description: 'Version control, API testing, continuous integration, and development environments.',
  },
  general: {
    id: 'general',
    title: 'Core Engineering',
    icon: LuCpu,
    color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    description: 'Foundational computer science principles applied in analytical problem solving.',
  },
};

const SkillsSection = ({ skills = [] }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  // ONLY show real skills from database, grouped dynamically
  const categories = useMemo(() => {
    if (!skills || skills.length === 0) return [];

    const groups = {};

    skills.forEach((s) => {
      const rawCat = s.category || 'General';
      const cLower = rawCat.toLowerCase();
      let key = 'general';

      if (cLower.includes('lang')) key = 'languages';
      else if (cLower.includes('back') || cLower.includes('api')) key = 'backend';
      else if (cLower.includes('front') || cLower.includes('ui')) key = 'frontend';
      else if (cLower.includes('data')) key = 'database';
      else if (cLower.includes('tool') || cLower.includes('devops') || cLower.includes('git')) key = 'tools';

      if (!groups[key]) {
        const meta = categoryMeta[key] || categoryMeta.general;
        groups[key] = {
          ...meta,
          skills: [],
        };
      }

      groups[key].skills.push({
        name: s.name,
        role: `${rawCat} (${s.proficiency || 85}%)`,
        tag: s.level || 'Active',
      });
    });

    return Object.values(groups);
  }, [skills]);

  const filteredCategories =
    selectedFilter === 'all'
      ? categories
      : categories.filter((c) => c.id === selectedFilter);

  return (
    <section id="skills" className="py-24 border-b border-theme-border relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="space-y-2">
            <div className="text-indigo-600 dark:text-indigo-400 font-mono text-xs tracking-widestTechnical uppercase font-semibold">
              03 / TOOLKIT
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-theme-text tracking-tight">
              The tools behind the work.
            </h2>
            <p className="text-sm sm:text-base text-theme-textMuted max-w-xl">
              A disciplined, production-tested stack managed live by Praveen. Verified engineering competence and active technical proficiencies.
            </p>
          </div>

          {/* Category Filter Pills */}
          {categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-theme-surface border border-theme-border self-start shadow-subtle">
              <button
                type="button"
                onClick={() => setSelectedFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  selectedFilter === 'all'
                    ? 'bg-indigo-600 text-white font-semibold shadow-glowSm'
                    : 'text-theme-textMuted hover:text-theme-text'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    selectedFilter === cat.id
                      ? 'bg-indigo-600 text-white font-semibold shadow-glowSm'
                      : 'text-theme-textMuted hover:text-theme-text'
                  }`}
                >
                  {cat.title.split(' ')[0]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <div className="p-12 rounded-3xl border border-dashed border-theme-border bg-theme-surface/50 text-center max-w-xl mx-auto space-y-3 shadow-subtle">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto border border-indigo-500/20">
              <LuTerminal className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-base text-theme-text">
              Technical Toolkit
            </h3>
            <p className="text-xs text-theme-textMuted max-w-md mx-auto leading-relaxed">
              Technical stack proficiencies are being synchronized from the Admin Console.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category, catIdx) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: catIdx * 0.08 }}
                  className="rounded-3xl border border-theme-border bg-theme-surface p-6 flex flex-col justify-between hover:border-indigo-500/40 transition-colors shadow-subtle group"
                >
                  <div>
                    {/* Category Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-theme-border mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${category.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <h3 className="font-heading font-bold text-base text-theme-text group-hover:text-indigo-500 transition-colors">
                          {category.title}
                        </h3>
                      </div>
                      <span className="font-mono text-[10px] text-theme-textMuted uppercase tracking-wider">
                        {category.skills.length} skills
                      </span>
                    </div>

                    <p className="text-xs text-theme-textMuted mb-5 leading-relaxed">
                      {category.description}
                    </p>

                    {/* Skills List */}
                    <div className="space-y-2.5">
                      {category.skills.map((skill) => (
                        <div
                          key={skill.name}
                          className="p-2.5 rounded-xl border border-theme-border/70 bg-theme-bg/60 hover:bg-theme-bg transition-colors flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <p className="font-semibold text-xs text-theme-text truncate group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                              {skill.name}
                            </p>
                            <p className="text-[11px] text-theme-textMuted truncate">
                              {skill.role}
                            </p>
                          </div>
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-indigo-500/20 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 shrink-0 font-medium">
                            {skill.tag}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom detail */}
                  <div className="pt-5 mt-5 border-t border-theme-border/50 flex items-center justify-between text-[11px] font-mono text-theme-textMuted">
                    <span>verified in production</span>
                    <LuCheck className="w-3.5 h-3.5 text-indigo-500" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};

export default SkillsSection;