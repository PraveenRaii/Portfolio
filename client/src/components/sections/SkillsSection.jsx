import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LuCode,
  LuLayoutGrid,
  LuServer,
  LuDatabase,
  LuCpu,
  LuCheck,
  LuLayers,
} from 'react-icons/lu';

const defaultSkillCategories = [
  {
    id: 'languages',
    title: 'Languages',
    icon: LuCode,
    color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    description: 'Core programming languages used for systems, scripting, and enterprise web applications.',
    skills: [
      { name: 'Java', role: 'Core Backend & Enterprise OOP', tag: 'Primary' },
      { name: 'JavaScript (ES6+)', role: 'Full Stack & Modern Web', tag: 'Daily Driver' },
      { name: 'SQL', role: 'Relational Queries & DDL', tag: 'Proficient' },
      { name: 'HTML5 & CSS3', role: 'Semantic & Responsive Markup', tag: 'Core' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend & APIs',
    icon: LuServer,
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    description: 'Server architecture, RESTful web services, middleware, and secure transaction layers.',
    skills: [
      { name: 'Spring Boot', role: 'Enterprise Java Framework', tag: 'Primary' },
      { name: 'Node.js', role: 'Event-Driven Async Runtime', tag: 'Daily Driver' },
      { name: 'Express.js', role: 'REST API & Middleware Layers', tag: 'Daily Driver' },
      { name: 'RESTful APIs', role: 'Stateless Endpoint Design & Auth', tag: 'Core' },
      { name: 'MVC Architecture', role: 'Modular Software Patterns', tag: 'Core' },
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend Ecosystem',
    icon: LuLayoutGrid,
    color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
    description: 'Component architecture, responsive UI design systems, state flow, and performance.',
    skills: [
      { name: 'React', role: 'Component-Based Architecture', tag: 'Primary' },
      { name: 'Tailwind CSS', role: 'Utility-First Styling System', tag: 'Daily Driver' },
      { name: 'Vite', role: 'Modern Frontend Tooling & Bundling', tag: 'Daily Driver' },
      { name: 'State Management', role: 'Context API & React Hooks', tag: 'Proficient' },
      { name: 'Responsive Design', role: 'Mobile-First Accessibility & UX', tag: 'Core' },
    ],
  },
  {
    id: 'database-tools',
    title: 'Databases & Tools',
    icon: LuDatabase,
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    description: 'Persistence engines, version control, API testing, and developer productivity tooling.',
    skills: [
      { name: 'MySQL', role: 'Relational Schema & Indexing', tag: 'Primary' },
      { name: 'MongoDB', role: 'Document Database & Aggregations', tag: 'Daily Driver' },
      { name: 'Git & GitHub', role: 'Version Control & Collaborative Flow', tag: 'Daily Driver' },
      { name: 'Postman', role: 'API Testing & Documentation', tag: 'Daily Driver' },
      { name: 'IntelliJ & VS Code', role: 'Primary Development Environments', tag: 'Daily Driver' },
    ],
  },
  {
    id: 'core-concepts',
    title: 'Core Engineering',
    icon: LuCpu,
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    description: 'Foundational computer science principles applied in analytical problem solving.',
    skills: [
      { name: 'Data Structures & Algorithms', role: 'Arrays, Trees, Graphs, Sorting', tag: 'Continuous' },
      { name: 'Object-Oriented Programming', role: 'Encapsulation, Polymorphism, Design', tag: 'Core' },
      { name: 'Problem Solving', role: 'Analytical Breakdown & Edge Cases', tag: 'Core' },
      { name: 'Clean Code Principles', role: 'Readability, Modularity & SOLID', tag: 'Practiced' },
    ],
  },
];

const SkillsSection = ({ skills = [] }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const categories = defaultSkillCategories;

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
              A disciplined, production-ready stack centered on Java, React, Spring Boot, and modern
              web engineering. No vanity bars — just verified engineering competence.
            </p>
          </div>

          {/* Category Filter Pills */}
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
        </div>

        {/* Categories Grid */}
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
                      {category.skills.length} tools
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

        {/* Dynamic Skills Notice if extra skills exist from backend */}
        {skills.length > 0 && (
          <div className="mt-8 p-4 rounded-2xl border border-theme-border bg-theme-surface flex flex-wrap items-center gap-2 text-xs shadow-subtle">
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-[11px] uppercase mr-2">
              Database Sync:
            </span>
            {skills.map((s) => (
              <span
                key={s._id || s.name}
                className="px-2.5 py-1 rounded-lg bg-theme-bg border border-theme-border font-mono text-[11px] text-theme-text"
              >
                {s.name} <span className="text-theme-textMuted">({s.level})</span>
              </span>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default SkillsSection;
