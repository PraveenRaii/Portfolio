import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuTrophy,
  LuCode,
  LuUsers,
  LuCalendar,
  LuMapPin,
  LuEye,
  LuX,
  LuExternalLink,
  LuSparkles,
  LuBuilding2,
  LuFlame,
  LuCircleCheck,
} from 'react-icons/lu';
import { getAssetUrl, DEFAULT_AVATAR } from '../../utils/imageUrl';

// Curated default hackathons and college life moments
const fallbackMoments = [
  {
    title: 'SRMU Tech Summit Hackathon — Civic Grievance Tracker',
    issuer: 'SRMU Lucknow / Powered by Sunstone',
    issueDate: '2024',
    category: 'Hackathons Attended',
    type: 'Hackathon Attended',
    description:
      'Participated in a 24-hour sprint designing FixMyArea, an automated civic complaint reporting and municipal tracking system with real-time location mapping and status alerts.',
    skills: ['React', 'Spring Boot', 'MySQL', 'Rapid Prototyping', 'Team Lead'],
    imageUrl:
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    credentialUrl: 'https://github.com/PraveenRaii',
    highlights: 'Pitched live prototype to industry jury panel; built in under 24 hours.',
  },
  {
    title: 'Academic & Technical Excellence Achievement Award',
    issuer: 'Shri Ramswaroop Memorial University (SRMU)',
    issueDate: '2024',
    category: 'College Life & Campus',
    type: 'College Life & Campus',
    description:
      'Conferred the university excellence award for outstanding academic standing in B.Tech Computer Science & Engineering and high-impact full-stack system implementations.',
    skills: ['Academic Excellence', 'Full Stack Architecture', 'Computer Science'],
    imageUrl: '/achievements/achievement_cert.png',
    credentialUrl: 'https://github.com/PraveenRaii',
    highlights: 'Official Merit Recognition by Faculty & Dean of Engineering.',
  },
  {
    title: 'Smart Campus 36-Hour Hackathon Sprint — AssetFlow Hub',
    issuer: 'Sunstone Tech Innovation Arena',
    issueDate: '2024',
    category: 'Hackathons Attended',
    type: 'Hackathon Attended',
    description:
      'Engineered AssetFlow, an enterprise resource allocation and maintenance ticketing platform with automated equipment logging, QR tagging, and RBAC authentication.',
    skills: ['Node.js', 'Express', 'MongoDB', 'System Design', 'JWT Auth'],
    imageUrl:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    credentialUrl: 'https://github.com/PraveenRaii',
    highlights: 'Completed full end-to-end prototype within 36-hour sprint deadline.',
  },
  {
    title: 'Campus Developer Workshop & Student Peer Mentorship',
    issuer: 'SRMU Coding Club & Tech Circles',
    issueDate: '2023 – 2024',
    category: 'College Life & Campus',
    type: 'College Life & Campus',
    description:
      'Organized and led interactive hands-on developer bootcamps for 2nd and 3rd year CSE peers, covering REST API design, Git workflow conventions, and Data Structures in Java.',
    skills: ['Peer Mentoring', 'Java & DSA', 'React Workshop', 'Public Speaking'],
    imageUrl:
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
    credentialUrl: 'https://github.com/PraveenRaii',
    highlights: 'Guided 60+ junior engineering students in building their first full-stack projects.',
  },
  {
    title: 'SRMU Inter-College Speed Coding & DSA Odyssey',
    issuer: 'Department of Computer Science & Engineering, SRMU',
    issueDate: '2023',
    category: 'Awards & Honors',
    type: 'Hackathon Award',
    description:
      'Earned top podium recognition in a high-intensity algorithmic challenge testing dynamic programming, graph traversal, and optimized relational database queries.',
    skills: ['Java 21', 'Data Structures', 'Competitive Programming', 'Algorithm Design'],
    imageUrl:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    credentialUrl: 'https://leetcode.com/u/Praveen_913/',
    highlights: 'Ranked in top 5% among 200+ university contestants.',
  },
  {
    title: 'MERN Stack & Cloud Architecture Bootcamp Showcase',
    issuer: 'Industry Developer Immersion Program',
    issueDate: '2024',
    category: 'College Life & Campus',
    type: 'College Life & Campus',
    description:
      'Showcased full-stack production capstone systems featuring stateless token authentication, rate limiters, security headers, and responsive Tailwind UI design.',
    skills: ['React 18', 'Node.js', 'Express', 'MongoDB Atlas', 'Tailwind CSS'],
    imageUrl:
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80',
    credentialUrl: 'https://github.com/PraveenRaii',
    highlights: 'Capstone rated top-tier for architectural cleanliness and security.',
  },
];

const HackathonsSection = ({ certificates = [] }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [activeTab, setActiveTab] = useState('All');

  // Convert incoming certificates or fall back to curated real items
  const momentsList =
    certificates && certificates.length > 0
      ? certificates.map((c, i) => {
          const typeLower = (c.type || '').toLowerCase();
          let category = 'Awards & Honors';

          if (
            typeLower.includes('hackathon attended') ||
            typeLower.includes('hackathon') ||
            typeLower.includes('competition')
          ) {
            category = 'Hackathons Attended';
          } else if (
            typeLower.includes('college') ||
            typeLower.includes('campus') ||
            typeLower.includes('workshop') ||
            typeLower.includes('academic')
          ) {
            category = 'College Life & Campus';
          }

          return {
            title: c.title,
            issuer: c.issuer,
            issueDate: c.issueDate || '2024',
            category,
            type: c.type || 'Achievement',
            description: c.description || '',
            skills: c.skills && c.skills.length > 0 ? c.skills : ['Teamwork', 'Software Engineering'],
            imageUrl: getAssetUrl(c.image?.url) || fallbackMoments[i % fallbackMoments.length].imageUrl,
            credentialUrl: c.credentialUrl || '',
            highlights: c.highlights || '',
          };
        })
      : fallbackMoments;

  const categories = [
    'All',
    'Hackathons Attended',
    'College Life & Campus',
    'Awards & Honors',
  ];

  const filteredMoments = momentsList.filter((m) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Hackathons Attended') {
      return (
        m.category === 'Hackathons Attended' ||
        m.type?.toLowerCase().includes('hackathon')
      );
    }
    if (activeTab === 'College Life & Campus') {
      return (
        m.category === 'College Life & Campus' ||
        m.type?.toLowerCase().includes('college') ||
        m.type?.toLowerCase().includes('campus') ||
        m.type?.toLowerCase().includes('academic') ||
        m.type?.toLowerCase().includes('workshop')
      );
    }
    if (activeTab === 'Awards & Honors') {
      return (
        m.category === 'Awards & Honors' ||
        m.type?.toLowerCase().includes('award') ||
        m.type?.toLowerCase().includes('cert') ||
        m.type?.toLowerCase().includes('honor')
      );
    }
    return true;
  });

  return (
    <section id="hackathons" className="py-24 border-b border-theme-border relative bg-theme-bg/50">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-mono text-xs tracking-widestTechnical uppercase font-semibold">
              <LuFlame className="w-3.5 h-3.5 text-amber-500" />
              <span>05 / HACKATHONS &amp; CAMPUS MOMENTS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-theme-text tracking-tight">
              Where code meets teamwork. Hackathons &amp; College Life.
            </h2>
            <p className="text-sm text-theme-textMuted leading-relaxed">
              A photo gallery capturing 24–48 hour hackathon sprints, rapid prototyping, live project pitches, and collegiate milestones at Shri Ramswaroop Memorial University (SRMU), Lucknow.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-theme-surface border border-theme-border shadow-subtle self-start md:self-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveTab(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                  activeTab === cat
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-glowSm scale-102'
                    : 'text-theme-textMuted hover:text-theme-text hover:bg-theme-surfaceSecondary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Photo Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMoments.map((moment, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="rounded-3xl border border-theme-border bg-theme-surface hover:border-indigo-500/50 transition-all duration-300 shadow-card hover:shadow-cardHover flex flex-col justify-between overflow-hidden group"
            >
              {/* Photo Showcase Thumbnail with Live Preview Overlay */}
              <div
                onClick={() => setSelectedPhoto(moment)}
                className="relative h-52 w-full bg-theme-code cursor-pointer overflow-hidden group/img"
              >
                <img
                  src={moment.imageUrl}
                  alt={moment.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-108"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_AVATAR;
                  }}
                />

                {/* Subtle Gradient Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex items-end justify-between p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-white px-2.5 py-1 rounded-md bg-black/65 backdrop-blur-md border border-white/20">
                      {moment.type}
                    </span>
                  </div>

                  <span
                    className="p-2.5 rounded-xl bg-white/20 hover:bg-white text-white hover:text-black backdrop-blur-md transition-all shadow-md transform group-hover/img:scale-110"
                    title="Click for full photo preview"
                  >
                    <LuEye className="w-4 h-4" />
                  </span>
                </div>

                {/* Top Badge: Date Pill */}
                <div className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-mono font-bold text-white flex items-center gap-1.5 shadow-sm">
                  <LuCalendar className="w-3 h-3 text-cyan-400" />
                  <span>{moment.issueDate}</span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-indigo-500">
                    <LuBuilding2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{moment.issuer}</span>
                  </div>

                  <h3
                    onClick={() => setSelectedPhoto(moment)}
                    className="font-heading font-bold text-base text-theme-text group-hover:text-indigo-500 transition-colors cursor-pointer leading-snug line-clamp-2"
                  >
                    {moment.title}
                  </h3>

                  {moment.description && (
                    <p className="text-xs text-theme-textMuted leading-relaxed line-clamp-3">
                      {moment.description}
                    </p>
                  )}
                </div>

                {/* Tags & Action Row */}
                <div className="space-y-3 pt-3 border-t border-theme-border/60">
                  {moment.skills && moment.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {moment.skills.slice(0, 4).map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-theme-surfaceSecondary border border-theme-border text-theme-textMuted font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs font-mono pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedPhoto(moment)}
                      className="text-indigo-500 hover:text-indigo-400 font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <LuEye className="w-3.5 h-3.5" />
                      <span>Full Photo</span>
                    </button>

                    {moment.credentialUrl ? (
                      <a
                        href={moment.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-cyan-600 dark:text-cyan-400 hover:underline font-semibold"
                      >
                        <span>Project / Proof</span>
                        <LuExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-500 font-semibold text-[11px]">
                        <LuCircleCheck className="w-3.5 h-3.5" />
                        <span>Verified Event</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Callout Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-cyan-500/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-heading font-extrabold text-base sm:text-lg text-theme-text">
              Building a team for an upcoming Hackathon or Campus Project?
            </h4>
            <p className="text-xs sm:text-sm text-theme-textMuted max-w-xl">
              I love fast-paced hackathon prototyping, full-stack architecture, and shipping production-ready demos. Let's build something impactful together.
            </p>
          </div>

          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition-all shadow-glow shrink-0"
          >
            <LuSparkles className="w-4 h-4" />
            <span>Connect for Hackathons</span>
          </a>
        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full rounded-3xl overflow-hidden border border-white/20 bg-theme-surface shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-theme-border flex items-center justify-between bg-theme-surfaceSecondary/50">
                <div className="flex items-center gap-2.5 min-w-0 pr-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-500 border border-indigo-500/30">
                    {selectedPhoto.type || 'Hackathon / Campus Life'}
                  </span>
                  <span className="text-xs font-mono text-theme-textMuted font-medium">
                    {selectedPhoto.issueDate}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPhoto(null)}
                  className="p-2 rounded-xl bg-theme-surface hover:bg-theme-border text-theme-textMuted hover:text-theme-text transition-colors"
                  aria-label="Close photo preview"
                >
                  <LuX className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Photo Display */}
              <div className="relative max-h-[60vh] bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  className="max-h-[60vh] w-auto max-w-full object-contain mx-auto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_AVATAR;
                  }}
                />
              </div>

              {/* Modal Footer Details */}
              <div className="p-5 sm:p-6 space-y-3 bg-theme-surface">
                <div>
                  <h3 className="font-heading font-extrabold text-base sm:text-lg text-theme-text">
                    {selectedPhoto.title}
                  </h3>
                  <p className="text-xs font-mono text-indigo-500 mt-0.5">
                    {selectedPhoto.issuer}
                  </p>
                </div>

                {selectedPhoto.description && (
                  <p className="text-xs sm:text-sm text-theme-textMuted leading-relaxed">
                    {selectedPhoto.description}
                  </p>
                )}

                {selectedPhoto.skills && selectedPhoto.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedPhoto.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-md bg-theme-surfaceSecondary border border-theme-border text-[10.5px] font-mono text-theme-text"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-3 border-t border-theme-border flex items-center justify-between">
                  <a
                    href={selectedPhoto.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-indigo-500 hover:underline font-semibold"
                  >
                    <span>Open Full Resolution Photo</span>
                    <LuExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {selectedPhoto.credentialUrl && (
                    <a
                      href={selectedPhoto.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold transition-all shadow-glowSm"
                    >
                      <span>View Project Repository</span>
                      <LuExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HackathonsSection;
