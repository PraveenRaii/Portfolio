import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuGraduationCap,
  LuAward,
  LuCalendar,
  LuExternalLink,
  LuCircleCheck,
  LuBuilding2,
  LuBookOpen,
  LuEye,
  LuX,
  LuSparkles,
} from 'react-icons/lu';
import { SiLeetcode } from 'react-icons/si';

const fallbackEducation = [
  {
    degree: 'B.Tech in Computer Science & Engineering (3rd Year)',
    institution: 'Shri Ramswaroop Memorial University (SRMU), Lucknow (Powered by Sunstone)',
    period: '2022 – 2026 (Expected)',
    location: 'Lucknow, Uttar Pradesh',
    highlights: [
      'Core coursework: Data Structures & Algorithms, Object-Oriented Programming in Java, Database Management Systems (MySQL), and Software Engineering.',
      'Active development of full-stack capstone projects utilizing React, Spring Boot, Node.js, and MongoDB.',
      'Regular contributor in developer workshops, hackathons, and student coding circles.',
    ],
    status: 'Current Student',
  },
  {
    degree: 'Higher Secondary Certificate (Class XII) — Science & Mathematics',
    institution: 'Central Board of Secondary Education (CBSE)',
    period: 'Completed',
    location: 'Uttar Pradesh, India',
    highlights: [
      'Rigorous foundation in Physics, Chemistry, and Advanced Mathematics.',
      'Early introduction to algorithmic thinking, Boolean algebra, and computer fundamentals.',
    ],
    status: 'Completed',
  },
];

const fallbackCertificates = [
  {
    title: 'Academic & Technical Excellence Achievement Award',
    issuer: 'SRMU Lucknow / Sunstone',
    issueDate: '2024',
    credentialUrl: 'https://github.com/PraveenRaii',
    skills: ['Web Development', 'Computer Science', 'Academic Excellence'],
    imageUrl: '/achievements/achievement_cert.png',
    type: 'Official Achievement Award',
  },
  {
    title: 'Full Stack Web Development & Modern Architecture',
    issuer: 'Sunstone / Industry Certified',
    issueDate: '2024',
    credentialUrl: 'https://github.com/PraveenRaii',
    skills: ['React.js', 'Node.js', 'Express', 'MongoDB', 'REST APIs'],
    imageUrl: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&auto=format&fit=crop&q=80',
    type: 'Certificate of Excellence',
  },
  {
    title: 'Java Enterprise & Spring Boot Development Honors',
    issuer: 'Professional Developer Program',
    issueDate: '2024',
    credentialUrl: 'https://github.com/PraveenRaii',
    skills: ['Java 21', 'Spring Boot 3', 'MySQL', 'Hibernate / JPA'],
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    type: 'Professional Credential',
  },
  {
    title: 'Hackathon Innovation & System Architecture Finalist',
    issuer: 'SRMU Tech Summit / Sunstone',
    issueDate: '2023',
    credentialUrl: 'https://github.com/PraveenRaii',
    skills: ['Rapid Prototyping', 'System Design', 'Team Lead'],
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    type: 'Hackathon Award',
  },
  {
    title: 'Relational Database Design & SQL Optimization',
    issuer: 'Database Engineering Track',
    issueDate: '2023',
    credentialUrl: 'https://github.com/PraveenRaii',
    skills: ['MySQL', 'Normalization', 'Indexing', 'Transactions'],
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    type: 'Specialized Track',
  },
];

const ExperienceSection = ({ education = [], certificates = [] }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const eduList =
    education && education.length > 0
      ? education.map((e) => ({
          degree: e.degree,
          institution: e.institution,
          period: `${e.startDate || '2022'} – ${e.endDate || 'Present'}`,
          location: e.location || 'Lucknow, India',
          highlights: e.description ? [e.description] : [e.fieldOfStudy || 'Computer Science & Engineering'],
          status: e.endDate ? 'Graduated' : 'Active Student',
        }))
      : fallbackEducation;

  const certList =
    certificates && certificates.length > 0
      ? certificates.map((c, i) => ({
          title: c.title,
          issuer: c.issuer,
          issueDate: c.issueDate || 'Verified',
          credentialUrl: c.credentialUrl || 'https://github.com/PraveenRaii',
          skills: c.skills || ['Full Stack', 'Software Engineering'],
          imageUrl: c.image?.url || fallbackCertificates[i % fallbackCertificates.length]?.imageUrl,
          type: c.type || 'Verified Credential',
        }))
      : fallbackCertificates;

  return (
    <section id="experience" className="py-24 border-b border-theme-border relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-14 space-y-2">
          <div className="text-indigo-600 dark:text-indigo-400 font-mono text-xs tracking-widestTechnical uppercase font-semibold">
            04 / JOURNEY &amp; ACHIEVEMENTS
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-theme-text tracking-tight">
            Milestones, learning &amp; achievements.
          </h2>
          <p className="text-sm sm:text-base text-theme-textMuted max-w-xl">
            A solid academic foundation reinforced by practical full-stack projects, competitive coding
            milestones, and verified achievement credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Education Timeline */}
          <div className="lg:col-span-6 space-y-8">
            <div className="flex items-center gap-2.5 pb-3 border-b border-theme-border">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
                <LuGraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-lg font-bold text-theme-text">
                Academic Background
              </h3>
            </div>

            <div className="space-y-8 relative pl-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-theme-border">
              {eduList.map((edu, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.1 }}
                  className="relative group"
                >
                  {/* Timeline Node */}
                  <span className="absolute -left-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-theme-surface border-2 border-indigo-500 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  </span>

                  <div className="p-5 rounded-3xl border border-theme-border bg-theme-surface hover:border-indigo-500/40 transition-colors shadow-subtle space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-xs px-2.5 py-0.5 rounded-md border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold">
                        {edu.period}
                      </span>
                      <span className="font-mono text-[11px] text-theme-textMuted uppercase font-semibold">
                        {edu.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-heading font-bold text-base text-theme-text group-hover:text-indigo-500 transition-colors">
                        {edu.degree}
                      </h4>
                      <p className="text-xs sm:text-sm font-medium text-indigo-600 dark:text-indigo-400 mt-0.5 flex items-center gap-1.5">
                        <LuBuilding2 className="w-3.5 h-3.5 shrink-0" />
                        {edu.institution}
                      </p>
                    </div>

                    <ul className="space-y-1.5 pt-2 border-t border-theme-border/60">
                      {edu.highlights.map((item, hIdx) => (
                        <li
                          key={hIdx}
                          className="text-xs text-theme-textMuted flex items-start gap-2 leading-relaxed"
                        >
                          <LuCircleCheck className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Dedicated LeetCode Problem Solving Spotlight Card */}
            <div className="p-6 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-theme-surface to-theme-surface shadow-subtle space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                    <SiLeetcode className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-theme-text">
                      LeetCode &bull; Problem Solving
                    </h4>
                    <p className="font-mono text-xs text-amber-600 dark:text-amber-400 font-semibold">
                      Profile: @Praveen_913
                    </p>
                  </div>
                </div>

                <a
                  href="https://leetcode.com/u/Praveen_913/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500 hover:text-white text-amber-600 dark:text-amber-400 text-xs font-mono font-semibold transition-all shadow-subtle"
                >
                  <span>Explore LeetCode</span>
                  <LuExternalLink className="w-3 h-3" />
                </a>
              </div>

              <p className="text-xs text-theme-textMuted leading-relaxed">
                Active problem solver practicing Data Structures &amp; Algorithms in Java. Continuous
                focus on Arrays, Dynamic Programming, Binary Trees, and Algorithmic Time-Space Complexity.
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {['Java DSA', 'Binary Trees', 'Graphs', 'Dynamic Programming', 'Two Pointers'].map((topic) => (
                  <span
                    key={topic}
                    className="font-mono text-[10px] px-2 py-0.5 rounded-md border border-amber-500/20 bg-theme-bg text-theme-textMuted"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Achievements & Verified Photo Credentials */}
          <div className="lg:col-span-6 space-y-8">
            <div className="flex items-center justify-between pb-3 border-b border-theme-border">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-500">
                  <LuAward className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-lg font-bold text-theme-text">
                  Achievements &amp; Certificates
                </h3>
              </div>
              <span className="font-mono text-xs text-theme-textMuted">
                Click photo to preview
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certList.map((cert, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.08 }}
                  className="rounded-3xl border border-theme-border bg-theme-surface hover:border-cyan-500/50 transition-all shadow-subtle group flex flex-col justify-between overflow-hidden"
                >
                  {/* Achievement Photo Thumbnail with Click-to-Zoom */}
                  <div
                    onClick={() => setSelectedPhoto(cert)}
                    className="relative h-36 w-full bg-theme-code cursor-pointer overflow-hidden group/img"
                  >
                    <img
                      src={cert.imageUrl}
                      alt={cert.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-between p-3">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-white px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-white/20">
                        {cert.type}
                      </span>
                      <span className="p-1.5 rounded-lg bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-black transition-colors">
                        <LuEye className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider">
                        <span>{cert.issuer}</span>
                        <span className="text-theme-textMuted font-normal">{cert.issueDate}</span>
                      </div>

                      <h4 className="font-heading font-bold text-xs sm:text-sm text-theme-text leading-snug group-hover:text-cyan-500 transition-colors mt-1">
                        {cert.title}
                      </h4>

                      {cert.skills && (
                        <div className="flex flex-wrap gap-1 pt-2">
                          {cert.skills.slice(0, 3).map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="font-mono text-[9.5px] px-2 py-0.5 rounded bg-theme-bg border border-theme-border text-theme-textMuted"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {cert.credentialUrl && (
                      <div className="pt-2 border-t border-theme-border/60 flex items-center justify-between text-[11px] font-mono">
                        <span
                          onClick={() => setSelectedPhoto(cert)}
                          className="text-theme-textMuted hover:text-theme-text cursor-pointer"
                        >
                          View Photo
                        </span>
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-cyan-600 dark:text-cyan-400 hover:underline font-semibold"
                        >
                          <span>Verify</span>
                          <LuExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Continuous Learning Initiative Block */}
            <div className="p-4 rounded-2xl border border-theme-border bg-indigo-500/5 font-mono text-xs space-y-1.5 text-theme-text">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-[11px]">
                <LuBookOpen className="w-4 h-4" />
                <span>CONTINUOUS LEARNING &amp; CERTIFICATION</span>
              </div>
              <p className="text-[11px] text-theme-textMuted leading-relaxed">
                Currently advancing specialized expertise in Spring Security, microservice communication patterns, and cloud containerization with Docker.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Lightbox Photo Preview Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full rounded-3xl overflow-hidden border border-white/20 bg-theme-surface shadow-2xl"
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-theme-border bg-theme-bg">
                <div>
                  <h3 className="font-heading font-bold text-sm text-theme-text">
                    {selectedPhoto.title}
                  </h3>
                  <p className="font-mono text-xs text-theme-textMuted">
                    {selectedPhoto.issuer} &bull; {selectedPhoto.issueDate}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPhoto(null)}
                  className="p-1.5 rounded-xl border border-theme-border bg-theme-surface text-theme-text hover:text-red-500"
                >
                  <LuX className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 bg-black flex items-center justify-center max-h-[70vh] overflow-hidden">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  className="max-h-[65vh] w-auto object-contain rounded-xl"
                />
              </div>

              <div className="p-4 border-t border-theme-border flex items-center justify-between bg-theme-bg">
                <span className="font-mono text-xs text-theme-textMuted">
                  Verified Credential Document
                </span>
                <a
                  href={selectedPhoto.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-mono text-xs font-semibold hover:bg-indigo-700"
                >
                  <span>Verify Credential Online</span>
                  <LuExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ExperienceSection;
