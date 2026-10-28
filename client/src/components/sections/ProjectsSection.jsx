import React from 'react';
import { motion } from 'framer-motion';
import {
  LuExternalLink,
  LuGithub,
  LuCircleCheck,
  LuLayers,
  LuMapPin,
  LuClock,
  LuActivity,
  LuCpu,
  LuTerminal,
} from 'react-icons/lu';

const ProjectsSection = () => {
  const projects = [
    {
      id: 'fixmyarea',
      title: 'FixMyArea',
      tagline: 'Civic Grievance Reporting & Municipal Tracking Platform',
      description:
        'A civic-tech web platform designed to empower citizens to report local infrastructure issues, monitor complaint workflows in real time, and verify municipal resolution.',
      problemSolved:
        'Eliminates public administrative opacity and lost complaint tickets by establishing a direct, accountable tracking lifecycle between residents and maintenance teams.',
      tags: ['React', 'Spring Boot', 'Java', 'MySQL', 'REST APIs', 'Tailwind CSS'],
      githubUrl: 'https://github.com/PraveenRaii',
      liveUrl: 'https://github.com/PraveenRaii',
      featured: true,
      accentBorder: 'border-l-theme-accent',
      preview: (
        <div className="w-full h-full p-5 bg-gradient-to-br from-theme-code/90 to-theme-surfaceSecondary/60 flex flex-col justify-between font-mono text-xs select-none">
          {/* Mock Browser Header */}
          <div className="flex items-center justify-between pb-3 border-b border-theme-border">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-theme-surface border border-theme-border text-theme-accent font-semibold">
              MUNICIPAL ISSUE #FMA-2024-89
            </span>
          </div>

          {/* Interactive Status Flow */}
          <div className="space-y-3 py-4">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-theme-text flex items-center gap-1">
                <LuMapPin className="w-3.5 h-3.5 text-theme-accent" />
                Sector 6, Gomti Nagar, Lucknow
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/20">
                IN PROGRESS
              </span>
            </div>

            {/* Stepper Progress */}
            <div className="grid grid-cols-4 gap-1 text-[9px] text-center font-semibold pt-1">
              <div className="p-1 rounded bg-theme-accent text-white">Submitted</div>
              <div className="p-1 rounded bg-theme-accent text-white">Triaged</div>
              <div className="p-1 rounded bg-theme-accent/80 text-white animate-pulse">Dispatched</div>
              <div className="p-1 rounded bg-theme-surface text-theme-textMuted border border-theme-border">Resolved</div>
            </div>

            {/* API Response Snippet */}
            <div className="p-2.5 rounded-lg bg-theme-bg border border-theme-border text-[10px] space-y-1">
              <p className="text-theme-accent font-bold">GET /api/v1/grievance/89/timeline</p>
              <p className="text-emerald-600 dark:text-emerald-400 font-medium">✓ Assigned to: PWD Field Unit #4</p>
              <p className="text-theme-textMuted font-normal">SLA Target: 24h &bull; Current: 6h elapsed</p>
            </div>
          </div>

          {/* Footer Stack Info */}
          <div className="flex items-center justify-between pt-2 border-t border-theme-border text-[10px] text-theme-textMuted">
            <span>Spring Boot + MySQL</span>
            <span className="text-theme-accent font-semibold">Active Rest API</span>
          </div>
        </div>
      ),
    },
    {
      id: 'assetflow',
      title: 'AssetFlow',
      tagline: 'Enterprise Resource Allocation & Maintenance Hub',
      description:
        'A comprehensive asset and resource management system designed to track institutional equipment, monitor team allocations, schedule servicing, and verify asset availability.',
      problemSolved:
        'Prevents equipment hoarding, scheduling conflicts, and maintenance oversights across departments with an automated reservation and inspection audit trail.',
      tags: ['Node.js', 'Express', 'MongoDB', 'EJS', 'REST APIs', 'Cloudinary'],
      githubUrl: 'https://github.com/PraveenRaii',
      liveUrl: 'https://github.com/PraveenRaii',
      featured: true,
      accentBorder: 'border-l-cyan-500',
      preview: (
        <div className="w-full h-full p-5 bg-gradient-to-br from-theme-code/90 to-theme-surfaceSecondary/60 flex flex-col justify-between font-mono text-xs select-none">
          <div className="flex items-center justify-between pb-3 border-b border-theme-border">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-semibold">
              ASSET ID: SRMU-LAB-042
            </span>
          </div>

          <div className="space-y-3 py-4">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-theme-text flex items-center gap-1">
                <LuLayers className="w-3.5 h-3.5 text-cyan-500" />
                Robotics Hardware Kit v2
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                CHECKED OUT
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-theme-bg border border-theme-border text-[10px] space-y-1">
              <p className="text-theme-text"><strong className="text-cyan-500">Holder:</strong> CS Dept / AI Research Team</p>
              <p className="text-theme-textMuted">Return Due: Tomorrow, 17:00 IST</p>
              <p className="text-emerald-600 dark:text-emerald-400 font-medium">✓ Maintenance check passed (28 Oct)</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="p-2 rounded bg-theme-surface border border-theme-border">
                <span className="text-theme-textMuted block text-[9px]">TOTAL USAGE</span>
                <span className="font-bold text-theme-text">142 Hours</span>
              </div>
              <div className="p-2 rounded bg-theme-surface border border-theme-border">
                <span className="text-theme-textMuted block text-[9px]">HEALTH SCORE</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">98 / 100</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-theme-border text-[10px] text-theme-textMuted">
            <span>Node.js + MongoDB</span>
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold">Audit Logging ON</span>
          </div>
        </div>
      ),
    },
    {
      id: 'ai-education',
      title: 'AI Education Hub',
      tagline: 'Adaptive Learning & Automated Code Assessment Platform',
      description:
        'An intelligent educational environment providing automated code evaluation, real-time algorithmic complexity feedback, and tailored curriculum guidance for student developers.',
      problemSolved:
        'Replaces manual assignment grading and generic tutorials with instantaneous execution analysis, automated edge-case testing, and personalized learning milestones.',
      tags: ['React', 'FastAPI', 'Python', 'Tailwind CSS', 'Docker Sandbox', 'REST APIs'],
      githubUrl: 'https://github.com/PraveenRaii',
      liveUrl: 'https://github.com/PraveenRaii',
      featured: false,
      accentBorder: 'border-l-indigo-500',
      preview: (
        <div className="w-full h-full p-5 bg-gradient-to-br from-theme-code/90 to-theme-surfaceSecondary/60 flex flex-col justify-between font-mono text-xs select-none">
          <div className="flex items-center justify-between pb-3 border-b border-theme-border">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-semibold">
              SANDBOX EVALUATOR
            </span>
          </div>

          <div className="space-y-3 py-4">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-theme-text flex items-center gap-1">
                <LuTerminal className="w-3.5 h-3.5 text-indigo-500" />
                Problem: Binary Tree Maximum Path
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                12/12 PASSED
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-theme-bg border border-theme-border text-[10px] space-y-1">
              <p className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ Test Cases: 100% Correct</p>
              <p className="text-theme-text">Time Complexity: <strong className="text-theme-accent">O(N)</strong> (Optimal)</p>
              <p className="text-theme-text">Space Complexity: <strong className="text-theme-accent">O(H)</strong> (Stack Frame)</p>
            </div>

            <div className="p-2 rounded bg-theme-surface border border-theme-border text-[10px] text-theme-textMuted">
              <span className="text-indigo-500 font-semibold">AI Recommendation:</span> Practice Graph BFS / DFS next.
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-theme-border text-[10px] text-theme-textMuted">
            <span>FastAPI + Python Sandbox</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Zero-Sandbox Isolation</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="projects" className="py-24 border-b border-theme-border relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-14 space-y-2">
          <div className="text-theme-accent font-mono text-xs tracking-widestTechnical uppercase font-semibold">
            02 / SELECTED WORK
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-theme-text tracking-tight">
            Things I've built. Problems I've solved.
          </h2>
          <p className="text-sm sm:text-base text-theme-textMuted max-w-xl">
            Real-world full stack applications built with robust backend architectures, clean relational
            and document schemas, and production-tested React frontends.
          </p>
        </div>

        {/* Project Showcase List (Asymmetric Editorial Cards) */}
        <div className="space-y-12">
          {projects.map((project, idx) => {
            const isReversed = idx % 2 === 1;

            return (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="rounded-3xl border border-theme-border bg-theme-surface overflow-hidden shadow-card dark:shadow-cardDark hover:border-theme-accent/70 transition-all grid grid-cols-1 lg:grid-cols-12 group"
              >
                {/* Visual Preview Half */}
                <div
                  className={`lg:col-span-5 min-h-[260px] lg:min-h-full border-b lg:border-b-0 ${
                    isReversed ? 'lg:order-2 lg:border-l' : 'lg:border-r'
                  } border-theme-border bg-theme-code/30`}
                >
                  {project.preview}
                </div>

                {/* Content Half */}
                <div
                  className={`lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6 ${
                    isReversed ? 'lg:order-1' : ''
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono tracking-widestTechnical text-theme-accent uppercase font-semibold">
                        0{idx + 1} // CASE STUDY
                      </span>

                      {project.featured && (
                        <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-0.5 rounded bg-theme-accent/10 text-theme-accent border border-theme-accent/20">
                          Featured Build
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-2xl font-heading font-bold text-theme-text tracking-tight group-hover:text-theme-accent transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs font-mono text-theme-textMuted mt-0.5">
                        {project.tagline}
                      </p>
                    </div>

                    <p className="text-sm text-theme-textMuted leading-relaxed">
                      {project.description}
                    </p>

                    {/* Problem Solved Callout */}
                    <div className="p-3.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary/50 flex items-start gap-2.5">
                      <LuCircleCheck className="w-4 h-4 text-theme-accent shrink-0 mt-0.5" />
                      <p className="text-xs text-theme-text leading-relaxed">
                        <strong className="font-semibold text-theme-text">Problem Solved:</strong>{' '}
                        {project.problemSolved}
                      </p>
                    </div>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[11px] font-mono px-2.5 py-1 rounded-md border border-theme-border bg-theme-code text-theme-text font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-theme-border flex items-center gap-5">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-theme-accent hover:text-theme-accentHover transition-colors"
                    >
                      <LuExternalLink className="w-3.5 h-3.5" />
                      <span>Live Demo &amp; Overview</span>
                    </a>

                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-theme-textMuted hover:text-theme-text transition-colors"
                    >
                      <LuGithub className="w-3.5 h-3.5" />
                      <span>GitHub Repository</span>
                    </a>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ProjectsSection;
