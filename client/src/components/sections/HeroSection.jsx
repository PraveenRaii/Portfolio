import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LuArrowDown,
  LuMail,
  LuCode,
  LuTerminal,
  LuDownload,
  LuExternalLink,
  LuLayers,
  LuCpu,
  LuDatabase,
  LuSparkles,
  LuArrowUpRight,
  LuUser,
} from 'react-icons/lu';
import { SiLeetcode } from 'react-icons/si';
import Button from '../common/Button';
import { getAssetUrl, DEFAULT_AVATAR, DEFAULT_RESUME } from '../../utils/imageUrl';

const HeroSection = ({ profile }) => {
  const [activeCodeTab, setActiveCodeTab] = useState('controller');

  const avatarSrc = getAssetUrl(profile?.avatar?.url);
  const resumeUrl = getAssetUrl(profile?.resume?.url) || DEFAULT_RESUME;

  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden"
    >
      {/* Aesthetic Ambient Indigo & Cyan Lighting Mesh */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-indigo-600/15 dark:bg-indigo-500/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-16 right-10 w-[500px] h-[350px] bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-[130px] pointer-events-none" />

      {/* Modern Grid Background Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] dark:bg-[radial-gradient(#1E2433_1px,transparent_1px)] [background-size:24px_24px] opacity-70 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* Developer Avatar & Eyebrow Label with Status Pulse */}
            <div className="flex items-center gap-4">
              <div className="relative group shrink-0">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur-sm opacity-50 group-hover:opacity-100 transition duration-300" />
                <img
                  src={avatarSrc}
                  alt={profile?.name || 'Praveen Rai'}
                  className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-theme-surface shadow-md group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_AVATAR;
                  }}
                />
                <span
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-theme-bg shadow-sm"
                  title="Available for opportunities"
                />
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[11px] font-mono tracking-widestTechnical uppercase font-semibold shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>HELLO, WORLD &bull; I'M PRAVEEN RAI</span>
                </div>
                <div className="text-xs font-mono text-theme-textMuted flex items-center gap-2">
                  <span>{profile?.roleTitle || 'Full Stack Developer'}</span>
                  <span>&bull;</span>
                  <span className="text-indigo-500 font-medium">B.Tech CSE '26</span>
                </div>
              </div>
            </div>

            {/* Main Aesthetic Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-heading font-extrabold text-theme-text tracking-tight leading-[1.12]">
              Building digital experiences with{' '}
              <span className="text-gradient font-black">
                code
              </span>{' '}
              and{' '}
              <span className="text-theme-accent">purpose</span>.
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-theme-textMuted max-w-xl leading-relaxed">
              {profile?.intro ||
                "I'm a Computer Science student and full stack developer focused on building scalable, performant web applications with Java, React, and Spring Boot."}
            </p>

            {/* Aesthetic Tech Stack Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-theme-border bg-theme-surface shadow-subtle text-xs font-mono text-theme-text font-medium">
                <span className="text-indigo-500">🎓</span> B.Tech 3rd Year &bull; SRMU Lucknow
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-theme-border bg-theme-surface shadow-subtle text-xs font-mono text-theme-text font-medium">
                <span className="text-cyan-500">⚡</span> Java &bull; Spring Boot &bull; React
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-theme-border bg-theme-surface shadow-subtle text-xs font-mono text-theme-text font-medium">
                <span className="text-emerald-500">📍</span> Lucknow, India
              </span>
              <a
                href={profile?.socialLinks?.leetcode || 'https://leetcode.com/u/Praveen_913/'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:border-amber-500 text-xs font-mono text-amber-600 dark:text-amber-400 font-semibold shadow-subtle transition-all"
                title="Praveen Rai's LeetCode Profile"
              >
                <SiLeetcode className="w-3.5 h-3.5 text-amber-500" />
                <span>LeetCode @Praveen_913</span>
                <LuArrowUpRight className="w-3 h-3 text-amber-500/80" />
              </a>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-3">
              <a href="#projects">
                <Button variant="primary" size="lg" icon={LuArrowDown}>
                  Explore My Work
                </Button>
              </a>

              <a href="#contact">
                <Button variant="secondary" size="lg" icon={LuMail}>
                  Let's Connect
                </Button>
              </a>

              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" icon={LuDownload}>
                  Resume PDF
                </Button>
              </a>
            </div>

            {/* Subtle Availability Label */}
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-theme-textMuted">
              <span className="text-indigo-500 font-bold">●</span>
              <span className="tracking-widestTechnical uppercase font-semibold text-theme-text">
                OPEN TO INTERNSHIPS &amp; COLLABORATIONS
              </span>
            </div>
          </motion.div>

          {/* Right Column: Studio Developer IDE Workspace Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            {/* Floating Glass Badges */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-5 -right-3 z-20 px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-theme-surface/90 backdrop-blur-md shadow-glowSm text-xs font-mono text-theme-text flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span>Java 21 &bull; Spring Boot</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-5 -left-3 z-20 px-3 py-1.5 rounded-xl border border-cyan-500/30 bg-theme-surface/90 backdrop-blur-md shadow-cyanGlow text-xs font-mono text-theme-text flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>React 18 &bull; MySQL</span>
            </motion.div>

            {/* Studio Workspace Code Window */}
            <div className="relative rounded-2xl border border-theme-border bg-theme-code shadow-card dark:shadow-cardDark overflow-hidden text-white">
              {/* Window Header with Controls and Tabs */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-black/40 border-b border-white/10 select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] inline-block"></span>
                </div>

                <div className="flex items-center gap-1 font-mono text-[11px]">
                  <button
                    type="button"
                    onClick={() => setActiveCodeTab('controller')}
                    className={`px-2.5 py-0.5 rounded transition-all ${
                      activeCodeTab === 'controller'
                        ? 'bg-white/10 text-indigo-300 font-semibold border border-white/10'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    PraveenController.java
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCodeTab('config')}
                    className={`px-2.5 py-0.5 rounded transition-all ${
                      activeCodeTab === 'config'
                        ? 'bg-white/10 text-cyan-300 font-semibold border border-white/10'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    stack.json
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCodeTab('portrait')}
                    className={`px-2.5 py-0.5 rounded transition-all flex items-center gap-1 ${
                      activeCodeTab === 'portrait'
                        ? 'bg-white/10 text-emerald-300 font-semibold border border-white/10'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <LuUser className="w-3 h-3 text-emerald-400" />
                    <span>profile.jpg</span>
                  </button>
                </div>

                <div className="w-4"></div>
              </div>

              {/* Code Content / Portrait Preview */}
              <div className="p-4 sm:p-5 font-mono text-xs leading-relaxed overflow-x-auto text-gray-200 select-none min-h-[300px]">
                {activeCodeTab === 'controller' && (
                  <div className="flex gap-4">
                    {/* Gutter */}
                    <div className="text-gray-500 select-none text-right font-mono text-[11px] leading-relaxed space-y-[2px]">
                      <div>01</div>
                      <div>02</div>
                      <div>03</div>
                      <div>04</div>
                      <div>05</div>
                      <div>06</div>
                      <div>07</div>
                      <div>08</div>
                      <div>09</div>
                      <div>10</div>
                      <div>11</div>
                      <div>12</div>
                    </div>

                    {/* Code Body */}
                    <div className="space-y-[2px] text-[11.5px] leading-relaxed font-mono">
                      <div>
                        <span className="text-indigo-400 font-semibold">@RestController</span>
                      </div>
                      <div>
                        <span className="text-indigo-400 font-semibold">@RequestMapping</span>
                        <span className="text-cyan-300">("/api/v1/engineer")</span>
                      </div>
                      <div>
                        <span className="text-purple-400 font-semibold">public class</span>{' '}
                        <span className="text-white font-bold">PraveenRai</span> {'{'}
                      </div>
                      <div className="pl-4">
                        <span className="text-purple-400">private final</span>{' '}
                        <span className="text-yellow-300">String</span> role ={' '}
                        <span className="text-emerald-400">"Full Stack Dev"</span>;
                      </div>
                      <div className="pl-4">
                        <span className="text-purple-400">private final</span>{' '}
                        <span className="text-yellow-300">String</span> education ={' '}
                        <span className="text-emerald-400">"SRMU Lucknow"</span>;
                      </div>
                      <div className="pl-4">
                        <span className="text-indigo-400 font-semibold">@GetMapping</span>
                        <span className="text-cyan-300">("/readiness")</span>
                      </div>
                      <div className="pl-4">
                        <span className="text-purple-400">public</span> Response{' '}
                        <span className="text-amber-300">getStatus</span>() {'{'}
                      </div>
                      <div className="pl-8">
                        <span className="text-purple-400">return</span> Response.builder()
                      </div>
                      <div className="pl-12 text-emerald-400">
                        .status("Available For Opportunities")
                      </div>
                      <div className="pl-12 text-emerald-400">
                        .stack(List.of("Java", "Spring Boot", "React", "MySQL"))
                      </div>
                      <div className="pl-12 text-emerald-400">
                        .build();
                      </div>
                      <div className="pl-4">{'}'}</div>
                      <div>
                        {'}'}
                        <span className="cursor-blink"></span>
                      </div>
                    </div>
                  </div>
                )}

                {activeCodeTab === 'config' && (
                  <div className="space-y-1.5 text-[11.5px] font-mono text-gray-300">
                    <p className="text-white font-semibold">{'{'}</p>
                    <p className="pl-4">"engineer": <span className="text-indigo-300">"Praveen Rai"</span>,</p>
                    <p className="pl-4">"primary_languages": [<span className="text-emerald-400">"Java"</span>, <span className="text-emerald-400">"JavaScript"</span>, <span className="text-emerald-400">"SQL"</span>],</p>
                    <p className="pl-4">"frameworks": [<span className="text-emerald-400">"Spring Boot"</span>, <span className="text-emerald-400">"React"</span>, <span className="text-emerald-400">"Express"</span>],</p>
                    <p className="pl-4">"databases": [<span className="text-cyan-300">"MySQL"</span>, <span className="text-cyan-300">"MongoDB"</span>],</p>
                    <p className="pl-4">"university": <span className="text-indigo-300">"SRMU Lucknow (Powered by Sunstone)"</span>,</p>
                    <p className="pl-4">"degree": <span className="text-indigo-300">"B.Tech CSE (3rd Year)"</span>,</p>
                    <p className="pl-4">"location": <span className="text-emerald-400">"Lucknow, UP, India"</span></p>
                    <p className="text-white font-semibold">{'}'}</p>
                  </div>
                )}

                {activeCodeTab === 'portrait' && (
                  <div className="flex flex-col items-center justify-center p-4 text-center space-y-4">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-cyan-500 to-purple-500 rounded-2xl blur-md opacity-60 group-hover:opacity-100 transition duration-300"></div>
                      <img
                        src={avatarSrc}
                        alt={profile?.name || 'Praveen Rai'}
                        className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-2xl object-cover border-2 border-white/20 shadow-2xl"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_AVATAR;
                        }}
                      />
                      <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Active
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-heading font-extrabold text-base text-white">
                        {profile?.name || 'Praveen Rai'}
                      </h3>
                      <p className="text-xs font-mono text-gray-300">
                        {profile?.roleTitle || 'Full Stack Developer'} &bull; SRMU Lucknow
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                      <span className="px-2.5 py-1 rounded-md bg-white/10 border border-white/10 text-[10px] font-mono text-indigo-300">
                        Java 21 &bull; Spring Boot
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-white/10 border border-white/10 text-[10px] font-mono text-cyan-300">
                        React 18 &bull; MySQL
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Terminal Bottom Status Bar */}
              <div className="px-4 py-2 bg-black/60 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>git: main</span>
                  <span>&bull;</span>
                  <span>UTF-8</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-indigo-400 font-semibold">Spring Boot 3.2</span>
                  <span>&bull;</span>
                  <span className="text-cyan-400">React 18</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
