import React from 'react';
import { motion } from 'framer-motion';
import {
  LuGraduationCap,
  LuAward,
  LuCalendar,
  LuExternalLink,
  LuCircleCheck,
  LuBuilding2,
  LuBookOpen,
} from 'react-icons/lu';

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
    title: 'Full Stack Web Development & Modern Architecture',
    issuer: 'Sunstone / Industry Certified',
    issueDate: '2024',
    credentialUrl: 'https://github.com/PraveenRaii',
    skills: ['React.js', 'Node.js', 'Express', 'MongoDB', 'REST APIs'],
  },
  {
    title: 'Java Enterprise & Spring Boot Development',
    issuer: 'Professional Developer Program',
    issueDate: '2024',
    credentialUrl: 'https://github.com/PraveenRaii',
    skills: ['Java Core', 'Spring Boot', 'MySQL', 'Hibernate / JPA'],
  },
  {
    title: 'Relational Database Design & SQL Optimization',
    issuer: 'Database Engineering Track',
    issueDate: '2023',
    credentialUrl: 'https://github.com/PraveenRaii',
    skills: ['MySQL', 'Normalization', 'Indexing', 'Transactions'],
  },
  {
    title: 'Version Control & Collaborative Git Workflows',
    issuer: 'Developer Essentials',
    issueDate: '2023',
    credentialUrl: 'https://github.com/PraveenRaii',
    skills: ['Git', 'GitHub', 'Branching Strategies', 'Code Review'],
  },
];

const ExperienceSection = ({ education = [], certificates = [] }) => {
  // Use passed data if populated, otherwise rich fallbacks
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
      ? certificates.map((c) => ({
          title: c.title,
          issuer: c.issuer,
          issueDate: c.issueDate || 'Verified',
          credentialUrl: c.credentialUrl || 'https://github.com/PraveenRaii',
          skills: c.skills || ['Full Stack', 'Software Engineering'],
        }))
      : fallbackCertificates;

  return (
    <section id="experience" className="py-24 border-b border-theme-border relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-14 space-y-2">
          <div className="text-theme-accent font-mono text-xs tracking-widestTechnical uppercase font-semibold">
            04 / JOURNEY
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-theme-text tracking-tight">
            Milestones, learning &amp; education.
          </h2>
          <p className="text-sm sm:text-base text-theme-textMuted max-w-xl">
            A solid academic foundation reinforced by practical full-stack projects, disciplined self-study,
            and continuous technical skill verification.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Education Timeline */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex items-center gap-2.5 pb-3 border-b border-theme-border">
              <LuGraduationCap className="w-5 h-5 text-theme-accent" />
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
                  <span className="absolute -left-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-theme-surface border-2 border-theme-accent flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-theme-accent" />
                  </span>

                  <div className="p-5 rounded-2xl border border-theme-border bg-theme-surface hover:border-theme-accent/40 transition-colors shadow-subtle space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-xs px-2.5 py-0.5 rounded border border-theme-border bg-theme-bg text-theme-accent font-medium">
                        {edu.period}
                      </span>
                      <span className="font-mono text-[11px] text-theme-textMuted uppercase">
                        {edu.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-heading font-bold text-base text-theme-text">
                        {edu.degree}
                      </h4>
                      <p className="text-xs sm:text-sm font-medium text-theme-accent mt-0.5 flex items-center gap-1.5">
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
                          <LuCircleCheck className="w-3.5 h-3.5 text-theme-accent shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Credentials & Certifications */}
          <div className="lg:col-span-5 space-y-8">
            <div className="flex items-center gap-2.5 pb-3 border-b border-theme-border">
              <LuAward className="w-5 h-5 text-theme-accent" />
              <h3 className="font-heading text-lg font-bold text-theme-text">
                Verified Credentials
              </h3>
            </div>

            <div className="space-y-4">
              {certList.map((cert, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.08 }}
                  className="p-5 rounded-2xl border border-theme-border bg-theme-surface hover:border-theme-accent/40 transition-colors shadow-subtle group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-theme-accent">
                        {cert.issuer}
                      </span>
                      <span className="font-mono text-[11px] text-theme-textMuted">
                        {cert.issueDate}
                      </span>
                    </div>

                    <h4 className="font-heading font-semibold text-sm text-theme-text leading-snug group-hover:text-theme-accent transition-colors">
                      {cert.title}
                    </h4>

                    {cert.skills && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {cert.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="font-mono text-[10px] px-2 py-0.5 rounded bg-theme-bg border border-theme-border text-theme-textMuted"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {cert.credentialUrl && (
                    <div className="pt-3 mt-3 border-t border-theme-border/50 flex justify-end">
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono text-[11px] font-medium text-theme-accent hover:text-theme-accentHover transition-colors"
                      >
                        <span>Verify Credential</span>
                        <LuExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Quick highlight block */}
            <div className="p-4 rounded-xl border border-theme-border bg-theme-code/60 font-mono text-xs space-y-1.5 text-theme-text">
              <div className="flex items-center gap-2 text-theme-accent font-semibold text-[11px]">
                <LuBookOpen className="w-4 h-4" />
                <span>CONTINUOUS LEARNING INITIATIVE</span>
              </div>
              <p className="text-[11px] text-theme-textMuted leading-relaxed">
                Currently advancing knowledge in Spring Security, microservice communication patterns, and cloud containerization with Docker.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
