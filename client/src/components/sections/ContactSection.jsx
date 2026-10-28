import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LuMail,
  LuMapPin,
  LuLinkedin,
  LuGithub,
  LuSend,
  LuCopy,
  LuCheck,
  LuClock,
  LuArrowUpRight,
} from 'react-icons/lu';
import Button from '../common/Button';
import { publicService } from '../../services/publicService';
import toast from 'react-hot-toast';

const ContactSection = ({ profile }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const emailAddress = profile?.email || 'praveen1234202040@gmail.com';
  const linkedinUrl =
    profile?.socialLinks?.linkedin || 'https://www.linkedin.com/in/praveen-rai-9r13/';
  const githubUrl = profile?.socialLinks?.github || 'https://github.com/PraveenRaii';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    toast.success('Email address copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please provide your name, email, and message.');
      return;
    }

    try {
      setLoading(true);
      const res = await publicService.submitContact(formData);
      if (res.success) {
        toast.success(
          res.message || 'Message delivered successfully! Praveen will get back to you shortly.'
        );
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to deliver message. Please try again or email directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 border-b border-theme-border relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-14 space-y-2">
          <div className="text-theme-accent font-mono text-xs tracking-widestTechnical uppercase font-semibold">
            05 / SAY HELLO
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-theme-text tracking-tight">
            Have an interesting problem? Let's build something.
          </h2>
          <p className="text-sm sm:text-base text-theme-textMuted max-w-xl">
            Whether you have an internship opening, a project collaboration in mind, or just want to
            connect over Java, React, or modern system design — my inbox is always open.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Reachability & Details */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Availability Status Card */}
            <div className="p-5 rounded-2xl border border-theme-border bg-theme-surface space-y-2 shadow-subtle">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Open to Opportunities
                </span>
              </div>
              <p className="text-xs text-theme-textMuted leading-relaxed">
                Currently seeking Software Engineering Internships and Full Stack Developer roles for
                Summer / Fall 2025. Flexible with on-site, hybrid, or remote positions.
              </p>
            </div>

            {/* Direct Email Card with One-Click Copy */}
            <div className="p-5 rounded-2xl border border-theme-border bg-theme-surface space-y-3 shadow-subtle">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-theme-textMuted uppercase tracking-wider">
                  Direct Email
                </span>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="font-mono text-[11px] text-theme-accent hover:text-theme-accentHover flex items-center gap-1 transition-colors"
                  title="Copy email to clipboard"
                >
                  {copied ? (
                    <>
                      <LuCheck className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <LuCopy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <a
                href={`mailto:${emailAddress}`}
                className="font-mono text-sm sm:text-base font-semibold text-theme-text hover:text-theme-accent transition-colors block truncate"
              >
                {emailAddress}
              </a>
              <p className="text-[11px] text-theme-textMuted">
                Typical reply time: within 24 business hours.
              </p>
            </div>

            {/* Location & Timezone Card */}
            <div className="p-5 rounded-2xl border border-theme-border bg-theme-surface space-y-2 shadow-subtle">
              <span className="font-mono text-[11px] text-theme-textMuted uppercase tracking-wider">
                Location &amp; Working Hours
              </span>
              <div className="flex items-center gap-2 text-sm font-semibold text-theme-text">
                <LuMapPin className="w-4 h-4 text-theme-accent shrink-0" />
                <span>Lucknow, Uttar Pradesh, India</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-theme-textMuted pt-1">
                <LuClock className="w-3.5 h-3.5" />
                <span>India Standard Time (IST • UTC+05:30)</span>
              </div>
            </div>

            {/* Social Links Rows */}
            <div className="rounded-2xl border border-theme-border bg-theme-surface overflow-hidden divide-y divide-theme-border shadow-subtle">
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 flex items-center justify-between text-theme-text hover:bg-theme-bg/60 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-theme-accent/10 text-theme-accent flex items-center justify-center">
                    <LuLinkedin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold font-heading">LinkedIn</p>
                    <p className="text-[11px] font-mono text-theme-textMuted">/in/praveen-rai-9r13</p>
                  </div>
                </div>
                <LuArrowUpRight className="w-4 h-4 text-theme-textMuted group-hover:text-theme-accent transition-colors" />
              </a>

              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 flex items-center justify-between text-theme-text hover:bg-theme-bg/60 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-theme-accent/10 text-theme-accent flex items-center justify-center">
                    <LuGithub className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold font-heading">GitHub</p>
                    <p className="text-[11px] font-mono text-theme-textMuted">/PraveenRaii</p>
                  </div>
                </div>
                <LuArrowUpRight className="w-4 h-4 text-theme-textMuted group-hover:text-theme-accent transition-colors" />
              </a>
            </div>

          </div>

          {/* Right Column: Editorial Contact Form */}
          <div className="lg:col-span-7">
            <motion.form
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              onSubmit={handleSubmit}
              className="p-6 sm:p-8 rounded-3xl border border-theme-border bg-theme-surface shadow-card dark:shadow-cardDark space-y-5"
            >
              <div className="border-b border-theme-border pb-4">
                <h3 className="font-heading font-bold text-lg text-theme-text">
                  Send a Direct Message
                </h3>
                <p className="text-xs text-theme-textMuted mt-1">
                  Fill out this form and I will receive your note directly in my portfolio inbox.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block font-mono text-xs text-theme-text font-medium">
                    Your Name <span className="text-theme-accent">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-theme-border bg-theme-bg text-theme-text text-sm placeholder:text-theme-textMuted/60 focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-mono text-xs text-theme-text font-medium">
                    Your Email <span className="text-theme-accent">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. john@example.com"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-theme-border bg-theme-bg text-theme-text text-sm placeholder:text-theme-textMuted/60 focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-xs text-theme-text font-medium">
                  Subject / Topic
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Internship Opportunity / Collaboration / Feedback"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-theme-border bg-theme-bg text-theme-text text-sm placeholder:text-theme-textMuted/60 focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-xs text-theme-text font-medium">
                  Message <span className="text-theme-accent">*</span>
                </label>
                <textarea
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your team, project requirements, or what you'd like to discuss..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-theme-border bg-theme-bg text-theme-text text-sm placeholder:text-theme-textMuted/60 focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition-colors resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-4">
                <p className="font-mono text-[11px] text-theme-textMuted">
                  Encrypted &amp; delivered via API
                </p>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  icon={LuSend}
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? 'Sending Message...' : 'Send Message'}
                </Button>
              </div>
            </motion.form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;
