import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import HeroSection from '../components/sections/HeroSection';
import DeveloperMarquee from '../components/sections/DeveloperMarquee';
import AboutSection from '../components/sections/AboutSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import SkillsSection from '../components/sections/SkillsSection';
import ExperienceSection from '../components/sections/ExperienceSection';
import HackathonsSection from '../components/sections/HackathonsSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import ContactSection from '../components/sections/ContactSection';
import { publicService } from '../services/publicService';

const HomePage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Non-blocking visit logging
    publicService.recordVisit(window.location.pathname);

    // Fetch complete portfolio data asynchronously
    const loadData = async () => {
      try {
        const res = await publicService.getPortfolioData();
        if (res && res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.warn('Backend data unavailable, rendering local portfolio details:', err);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-theme-bg text-theme-text font-sans transition-colors duration-300 selection:bg-theme-accent selection:text-white">
      {/* Sticky Refined Navigation */}
      <Navbar profile={data?.profile} />

      <main className="flex-1">
        {/* Signature Two-Column Hero */}
        <HeroSection profile={data?.profile} />

        {/* Restrained Developer Marquee */}
        <DeveloperMarquee />

        {/* 01 / About Section */}
        <AboutSection profile={data?.profile} />

        {/* 02 / Selected Projects */}
        <ProjectsSection projects={data?.projects} />

        {/* 03 / Skills & Toolkit */}
        <SkillsSection skills={data?.skills} />

        {/* 04 / Journey & Education */}
        <ExperienceSection
          education={data?.education}
          certificates={data?.certificates}
        />

        {/* 05 / Hackathons & Campus Life Moments Photo Showcase */}
        <HackathonsSection certificates={data?.certificates} />

        {/* Endorsements / Testimonials */}
        <TestimonialsSection testimonials={data?.testimonials} />

        {/* 06 / Contact & Direct Message */}
        <ContactSection profile={data?.profile} />
      </main>

      {/* Studio Editorial Footer */}
      <Footer profile={data?.profile} />
    </div>
  );
};

export default HomePage;
