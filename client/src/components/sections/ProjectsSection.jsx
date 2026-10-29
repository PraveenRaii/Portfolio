import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LuExternalLink,
  LuGithub,
  LuCircleCheck,
  LuLayers,
  LuMapPin,
  LuTerminal,
  LuHeart,
  LuBookmark,
  LuSparkles,
} from 'react-icons/lu';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import toast from 'react-hot-toast';

// Rich fallback previews for initial demonstration builds
const previewFixMyArea = (
  <div className="w-full h-full p-5 bg-gradient-to-br from-theme-code/90 to-theme-surfaceSecondary/60 flex flex-col justify-between font-mono text-xs select-none">
    <div className="flex items-center justify-between pb-3 border-b border-theme-border">
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-red-400"></span>
        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
      </div>
      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-theme-surface border border-theme-border text-indigo-500 font-semibold">
        MUNICIPAL ISSUE #FMA-2024-89
      </span>
    </div>

    <div className="space-y-3 py-4">
      <div className="flex items-center justify-between text-[11px]">
        <span className="font-semibold text-theme-text flex items-center gap-1">
          <LuMapPin className="w-3.5 h-3.5 text-indigo-500" />
          Sector 6, Gomti Nagar, Lucknow
        </span>
        <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/20">
          IN PROGRESS
        </span>
      </div>

      <div className="grid grid-cols-4 gap-1 text-[9px] text-center font-semibold pt-1">
        <div className="p-1 rounded bg-indigo-600 text-white">Submitted</div>
        <div className="p-1 rounded bg-indigo-600 text-white">Triaged</div>
        <div className="p-1 rounded bg-indigo-600/80 text-white animate-pulse">Dispatched</div>
        <div className="p-1 rounded bg-theme-surface text-theme-textMuted border border-theme-border">Resolved</div>
      </div>

      <div className="p-2.5 rounded-lg bg-theme-bg border border-theme-border text-[10px] space-y-1">
        <p className="text-indigo-500 font-bold">GET /api/v1/grievance/89/timeline</p>
        <p className="text-emerald-600 dark:text-emerald-400 font-medium">✓ Assigned to: PWD Field Unit #4</p>
        <p className="text-theme-textMuted font-normal">SLA Target: 24h &bull; Current: 6h elapsed</p>
      </div>
    </div>

    <div className="flex items-center justify-between pt-2 border-t border-theme-border text-[10px] text-theme-textMuted">
      <span>Spring Boot + MySQL</span>
      <span className="text-indigo-500 font-semibold">Active REST API</span>
    </div>
  </div>
);

const previewAssetFlow = (
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
        <p className="text-emerald-600 dark:text-emerald-400 font-medium">✓ Maintenance check passed</p>
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
);

const previewAiEducation = (
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
        <p className="text-theme-text">Time Complexity: <strong className="text-indigo-500">O(N)</strong> (Optimal)</p>
        <p className="text-theme-text">Space Complexity: <strong className="text-indigo-500">O(H)</strong> (Stack Frame)</p>
      </div>

      <div className="p-2 rounded bg-theme-surface border border-theme-border text-[10px] text-theme-textMuted">
        <span className="text-indigo-500 font-semibold">Recommendation:</span> Dynamic Programming practice next.
      </div>
    </div>

    <div className="flex items-center justify-between pt-2 border-t border-theme-border text-[10px] text-theme-textMuted">
      <span>React + Node.js API</span>
      <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Real-Time Evaluation</span>
    </div>
  </div>
);

const fallbackProjects = [
  {
    id: 'fixmyarea',
    title: 'FixMyArea',
    description:
      'A civic-tech web platform designed to empower citizens to report local infrastructure issues, monitor complaint workflows in real time, and verify municipal resolution.',
    problemSolved:
      'Eliminates public administrative opacity and lost complaint tickets by establishing a direct, accountable tracking lifecycle between residents and maintenance teams.',
    tags: ['React', 'Spring Boot', 'Java', 'MySQL', 'REST APIs', 'Tailwind CSS'],
    githubUrl: 'https://github.com/PraveenRaii',
    liveUrl: 'https://github.com/PraveenRaii',
    isFeatured: true,
    preview: previewFixMyArea,
  },
  {
    id: 'assetflow',
    title: 'AssetFlow',
    description:
      'A comprehensive asset and resource management system designed to track institutional equipment, monitor team allocations, schedule servicing, and verify asset availability.',
    problemSolved:
      'Prevents equipment hoarding, scheduling conflicts, and maintenance oversights across departments with an automated reservation and inspection audit trail.',
    tags: ['Node.js', 'Express', 'MongoDB', 'EJS', 'REST APIs', 'Cloudinary'],
    githubUrl: 'https://github.com/PraveenRaii',
    liveUrl: 'https://github.com/PraveenRaii',
    isFeatured: true,
    preview: previewAssetFlow,
  },
  {
    id: 'ai-education',
    title: 'AI Education Hub',
    description:
      'An intelligent educational environment providing automated code evaluation, real-time algorithmic complexity feedback, and tailored curriculum guidance for student developers.',
    problemSolved:
      'Replaces manual assignment grading and generic tutorials with instantaneous execution analysis, automated edge-case testing, and personalized learning milestones.',
    tags: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS', 'Docker Sandbox', 'REST APIs'],
    githubUrl: 'https://github.com/PraveenRaii',
    liveUrl: 'https://github.com/PraveenRaii',
    isFeatured: false,
    preview: previewAiEducation,
  },
];

const ProjectsSection = ({ projects = [] }) => {
  const { user } = useAuth();
  const [likesMap, setLikesMap] = useState({});
  const [bookmarkMap, setBookmarkMap] = useState({});

  // Normalize incoming projects from database or use fallback
  const displayProjects =
    projects && projects.length > 0
      ? projects.map((p) => {
          let previewContent = null;
          const normalizedTitle = (p.title || '').toLowerCase().trim();

          // Check if custom preview matches built-in or if image exists
          if (p.image?.url && !p.image.url.includes('photo-1555066931-4365d14bab8c')) {
            previewContent = (
              <div className="relative w-full h-full min-h-[260px] overflow-hidden group/img">
                <img
                  src={p.image.url}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                  <span className="font-mono text-[10px] uppercase font-bold text-white px-2.5 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-white/20">
                    {Array.isArray(p.tags) && p.tags[0] ? p.tags[0] : 'Full Stack'}
                  </span>
                </div>
              </div>
            );
          } else if (normalizedTitle.includes('fixmyarea')) {
            previewContent = previewFixMyArea;
          } else if (normalizedTitle.includes('assetflow')) {
            previewContent = previewAssetFlow;
          } else if (normalizedTitle.includes('ai education') || normalizedTitle.includes('education')) {
            previewContent = previewAiEducation;
          } else {
            // General dynamic visual preview for any user-added project
            previewContent = (
              <div className="w-full h-full p-6 bg-gradient-to-br from-indigo-950/40 via-theme-surface to-cyan-950/40 flex flex-col justify-between font-mono text-xs select-none">
                <div className="flex items-center justify-between pb-3 border-b border-theme-border">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-400"></span>
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 font-bold">
                    VERIFIED PRODUCTION BUILD
                  </span>
                </div>

                <div className="space-y-3 py-4">
                  <div className="p-3 rounded-xl bg-theme-bg/80 border border-theme-border space-y-1">
                    <p className="text-indigo-500 font-bold">{p.title}</p>
                    <p className="text-theme-textMuted line-clamp-2 text-[11px] font-sans">
                      {p.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-theme-textMuted pt-1">
                    <span>Architecture: Modern Full-Stack</span>
                    <span className="text-emerald-500 font-semibold">Active &bull; Live</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-theme-border text-[10px] text-theme-textMuted">
                  <span>Praveen Rai Portfolio</span>
                  <span className="text-indigo-500 font-semibold">Direct Deployment</span>
                </div>
              </div>
            );
          }

          return {
            id: p._id || p.id,
            title: p.title,
            description: p.description,
            problemSolved:
              p.longDescription ||
              p.problemSolved ||
              'Engineered with clean architectural patterns to solve specific real-world workflow challenges.',
            tags: Array.isArray(p.tags)
              ? p.tags
              : typeof p.tags === 'string'
              ? p.tags.split(',').map((t) => t.trim())
              : ['Full Stack'],
            githubUrl: p.githubUrl || 'https://github.com/PraveenRaii',
            liveUrl: p.liveUrl || 'https://github.com/PraveenRaii',
            isFeatured: Boolean(p.isFeatured),
            likesCount: p.likes?.length || 0,
            preview: previewContent,
          };
        })
      : [];

  const handleToggleLike = async (projectId) => {
    if (!user) {
      toast.error('Please log in to like portfolio projects!');
      return;
    }
    try {
      const res = await userService.toggleLike(projectId);
      if (res.success) {
        setLikesMap((prev) => ({
          ...prev,
          [projectId]: res.likesCount,
        }));
        toast.success(res.isLiked ? 'Project liked!' : 'Project unliked');
      }
    } catch (err) {
      toast.error('Failed to update like status');
    }
  };

  const handleToggleBookmark = async (projectId) => {
    if (!user) {
      toast.error('Please log in to bookmark projects to your workspace!');
      return;
    }
    try {
      const res = await userService.toggleBookmark(projectId);
      if (res.success) {
        setBookmarkMap((prev) => ({
          ...prev,
          [projectId]: res.isBookmarked,
        }));
        toast.success(res.message);
      }
    } catch (err) {
      toast.error('Failed to update bookmark');
    }
  };

  return (
    <section id="projects" className="py-24 border-b border-theme-border relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-14 space-y-2">
          <div className="text-indigo-600 dark:text-indigo-400 font-mono text-xs tracking-widestTechnical uppercase font-semibold">
            02 / SELECTED WORK &bull; ({displayProjects.length} PROJECTS)
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-theme-text tracking-tight">
            Things I've built. Problems I've solved.
          </h2>
          <p className="text-sm sm:text-base text-theme-textMuted max-w-xl">
            Real-world full-stack applications built with robust backend architectures, clean relational
            and document schemas, and production-tested React frontends.
          </p>
        </div>

        {/* Project Showcase List */}
        {displayProjects.length === 0 ? (
          <div className="p-12 rounded-3xl border border-dashed border-theme-border bg-theme-surface/50 text-center max-w-xl mx-auto space-y-4 shadow-subtle">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto border border-indigo-500/20">
              <LuGithub className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-extrabold text-base text-theme-text">
                Full-Stack Projects Showcase
              </h3>
              <p className="text-xs text-theme-textMuted max-w-md mx-auto leading-relaxed">
                Praveen is currently updating production deployments. Live verified projects added via the Admin Console will appear here. In the meantime, explore codebases directly on GitHub.
              </p>
            </div>
            <a
              href="https://github.com/PraveenRaii"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-heading font-bold text-xs transition-all shadow-glowSm"
            >
              <LuGithub className="w-4 h-4" />
              <span>Explore GitHub Repositories</span>
              <LuExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : (
          <div className="space-y-12">
            {displayProjects.map((project, idx) => {
            const isReversed = idx % 2 === 1;
            const currentLikes =
              likesMap[project.id] !== undefined ? likesMap[project.id] : project.likesCount || 0;
            const isBookmarked = bookmarkMap[project.id];

            return (
              <motion.article
                key={project.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="rounded-3xl border border-theme-border bg-theme-surface overflow-hidden shadow-card dark:shadow-cardDark hover:border-indigo-500/50 transition-all grid grid-cols-1 lg:grid-cols-12 group"
              >
                {/* Visual Preview Half */}
                <div
                  className={`lg:col-span-5 min-h-[260px] lg:min-h-full border-b lg:border-b-0 ${
                    isReversed ? 'lg:order-2 lg:border-l' : 'lg:border-r'
                  } border-theme-border bg-theme-surfaceSecondary/40 flex items-center justify-center overflow-hidden`}
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
                      <span className="text-[11px] font-mono tracking-widestTechnical text-indigo-600 dark:text-indigo-400 uppercase font-semibold">
                        0{idx + 1} // CASE STUDY
                      </span>

                      <div className="flex items-center gap-2">
                        {project.isFeatured && (
                          <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                            Featured Build
                          </span>
                        )}

                        {/* Interactive Like & Bookmark Actions */}
                        <button
                          type="button"
                          onClick={() => handleToggleLike(project.id)}
                          className="p-1.5 rounded-lg border border-theme-border hover:border-rose-500/50 bg-theme-bg text-theme-textMuted hover:text-rose-500 flex items-center gap-1 text-[11px] font-mono transition-colors"
                          title="Like Project"
                        >
                          <LuHeart className="w-3.5 h-3.5 fill-rose-500/20 text-rose-500" />
                          <span>{currentLikes}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleBookmark(project.id)}
                          className={`p-1.5 rounded-lg border border-theme-border hover:border-indigo-500/50 bg-theme-bg transition-colors ${
                            isBookmarked ? 'text-indigo-500' : 'text-theme-textMuted hover:text-indigo-500'
                          }`}
                          title="Bookmark to Workspace"
                        >
                          <LuBookmark className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-heading font-bold text-theme-text tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {project.title}
                      </h3>
                    </div>

                    <p className="text-sm text-theme-textMuted leading-relaxed">
                      {project.description}
                    </p>

                    {/* Problem Solved Callout */}
                    <div className="p-3.5 rounded-2xl border border-theme-border bg-theme-surfaceSecondary/60 flex items-start gap-2.5">
                      <LuCircleCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-theme-text leading-relaxed font-sans">
                        <strong className="font-semibold text-theme-text">Problem Solved:</strong>{' '}
                        {project.problemSolved}
                      </p>
                    </div>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[11px] font-mono px-2.5 py-1 rounded-md border border-theme-border bg-theme-bg text-theme-text font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-theme-border flex items-center gap-5">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400 hover:underline transition-colors"
                      >
                        <LuExternalLink className="w-3.5 h-3.5" />
                        <span>Live Demo &amp; Overview</span>
                      </a>
                    )}

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-theme-textMuted hover:text-theme-text transition-colors"
                      >
                        <LuGithub className="w-3.5 h-3.5" />
                        <span>GitHub Repository</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
        )}

      </div>
    </section>
  );
};

export default ProjectsSection;
