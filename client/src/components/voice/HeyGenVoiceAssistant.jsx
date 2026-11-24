import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuBot,
  LuX,
  LuPlay,
  LuPause,
  LuRotateCcw,
  LuSparkles,
  LuVolume2,
  LuVolumeX,
  LuSend,
  LuAudioLines,
  LuHeadphones,
  LuChevronDown,
} from 'react-icons/lu';
import { voiceService } from '../../services/voiceService';
import toast from 'react-hot-toast';

const PRESET_TOPICS = [
  { id: 'intro', label: '👋 Introduce Yourself', query: 'intro' },
  { id: 'skills', label: '🛠️ Top Skills & Stack', query: 'skills' },
  { id: 'projects', label: '🚀 FixMyArea Project', query: 'project fixmyarea' },
  { id: 'education', label: '🎓 Education & Sunstone', query: 'education' },
  { id: 'leetcode', label: '🏆 LeetCode & Coding', query: 'leetcode coding' },
  { id: 'contact', label: '📬 Contact Praveen', query: 'contact' },
];

const HeyGenVoiceAssistant = ({ initialOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('80b17a1be1594e578b92c0ddf4a37fc8'); // Lewis default
  const [customQuery, setCustomQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentResponse, setCurrentResponse] = useState({
    text: "Hi! I am Praveen's AI Voice Assistant, powered by HeyGen Voice AI. Ask me anything about Praveen's technical skills, full-stack projects, education at SRMU Sunstone, or contact details!",
    audioUrl: null,
    duration: 0,
    category: 'welcome',
  });
  const [progress, setProgress] = useState(0);

  const audioRef = useRef(null);

  // Load available voices on mount
  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const res = await voiceService.getVoices();
        if (res.success && res.data?.voices) {
          setVoices(res.data.voices);
          if (res.data.defaultVoiceId) {
            setSelectedVoice(res.data.defaultVoiceId);
          }
        }
      } catch (err) {
        console.warn('Could not load HeyGen voices list, using defaults:', err.message);
      }
    };
    fetchVoices();
  }, []);

  // Sync audio progress and end event
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  // Play audio url
  const playAudio = (url) => {
    if (!audioRef.current || !url) return;
    audioRef.current.src = url;
    audioRef.current.currentTime = 0;
    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.warn('Autoplay prevented or audio load issue:', err);
        setIsPlaying(false);
      });
  };

  // Toggle Play / Pause
  const togglePlayPause = () => {
    if (!audioRef.current || !currentResponse.audioUrl) {
      // If no audio yet, trigger speech synthesis for current text
      handleSpeakCurrentText();
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
  };

  // Replay
  const handleReplay = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  };

  // Toggle Mute
  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMuted = !isMuted;
    audioRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  // Synthesize custom text currently in view
  const handleSpeakCurrentText = async () => {
    if (!currentResponse.text) return;
    try {
      setLoading(true);
      const res = await voiceService.speak(currentResponse.text, selectedVoice);
      if (res.success && res.data?.audioUrl) {
        setCurrentResponse((prev) => ({
          ...prev,
          audioUrl: res.data.audioUrl,
          duration: res.data.duration,
        }));
        playAudio(res.data.audioUrl);
      }
    } catch (err) {
      toast.error('Voice AI service busy, displaying text transcript.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Question Query (Preset or Custom)
  const handleAskQuestion = async (queryText) => {
    const q = (queryText || customQuery).trim();
    if (!q) return;

    try {
      setLoading(true);
      if (audioRef.current) {
        audioRef.current.pause();
      }

      const res = await voiceService.ask(q, selectedVoice);
      if (res.success && res.data) {
        setCurrentResponse({
          text: res.data.answerText,
          audioUrl: res.data.audioUrl,
          duration: res.data.duration,
          category: res.data.category,
        });

        if (res.data.audioUrl) {
          playAudio(res.data.audioUrl);
        }
      }
      setCustomQuery('');
    } catch (err) {
      console.error('Ask error:', err);
      toast.error('Failed to generate AI voice response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hidden audio element for speech playback */}
      <audio ref={audioRef} preload="auto" />

      {/* Floating Action Trigger Button (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-600 text-white shadow-xl shadow-indigo-500/25 border border-indigo-400/30 backdrop-blur-md transition-all font-mono text-xs font-semibold"
          aria-label="Open HeyGen AI Voice Assistant"
        >
          {/* Subtle Ambient Pulse Ring */}
          <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 opacity-40 blur-sm group-hover:opacity-75 transition duration-500 -z-10 animate-pulse" />

          <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-white/20">
            {isPlaying ? (
              <LuAudioLines className="w-4 h-4 animate-bounce text-cyan-200" />
            ) : (
              <LuBot className="w-4 h-4 text-white" />
            )}
          </div>

          <div className="text-left hidden sm:block">
            <span className="block leading-none text-white font-bold tracking-wide">
              Voice AI Guide
            </span>
            <span className="text-[10px] text-cyan-200/80 font-normal">
              Powered by HeyGen
            </span>
          </div>

          {isPlaying && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          )}
        </motion.button>
      </div>

      {/* Expanded Interactive Voice AI Drawer / Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[85vh] flex flex-col rounded-3xl border border-theme-border/80 bg-theme-surface/95 dark:bg-theme-surface/90 shadow-2xl backdrop-blur-xl overflow-hidden font-sans"
          >
            {/* Top Header Bar */}
            <div className="p-4 border-b border-theme-border/60 bg-gradient-to-r from-indigo-600/10 via-theme-surface to-cyan-600/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-600 text-white shadow-md">
                  <LuSparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-heading font-bold text-sm text-theme-text">
                      Praveen's Voice AI
                    </h3>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold uppercase tracking-wider">
                      HeyGen Turbo
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-theme-textMuted">
                    Interactive voice answers &amp; audio walk-through
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg border border-theme-border text-theme-textMuted hover:text-theme-text hover:bg-theme-bg transition-colors"
                aria-label="Close"
              >
                <LuX className="w-4 h-4" />
              </button>
            </div>

            {/* Audio Waveform / Visualizer Stage */}
            <div className="p-4 bg-gradient-to-b from-indigo-500/5 to-transparent border-b border-theme-border/40">
              <div className="flex items-center justify-between mb-3 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isPlaying
                        ? 'bg-emerald-500 animate-pulse'
                        : loading
                        ? 'bg-amber-500 animate-ping'
                        : 'bg-theme-textMuted/40'
                    }`}
                  />
                  <span className="text-theme-textMuted text-[11px]">
                    {loading
                      ? 'HeyGen Synthesizing Voice...'
                      : isPlaying
                      ? 'AI Speaking Now'
                      : 'Audio Standby'}
                  </span>
                </div>

                {/* Voice Selection Dropdown */}
                <div className="relative">
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    disabled={loading}
                    className="appearance-none pl-2 pr-6 py-1 text-[11px] font-mono rounded-lg border border-theme-border bg-theme-bg text-theme-text focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    {voices.length > 0 ? (
                      voices.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name.split('-')[0]} ({v.gender === 'female' ? 'F' : 'M'})
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="80b17a1be1594e578b92c0ddf4a37fc8">
                          Lewis (Praveen - Male UK)
                        </option>
                        <option value="330290724a1b470fb63153f34d4c0183">
                          Annie (Lifelike - Female US)
                        </option>
                        <option value="c30ecab014cb4a8d816d07f6b2b625c8">
                          Brodie (Breezy - Male UK)
                        </option>
                      </>
                    )}
                  </select>
                  <LuChevronDown className="absolute right-1.5 top-2 w-3 h-3 text-theme-textMuted pointer-events-none" />
                </div>
              </div>

              {/* Animated Sound Wave Bars */}
              <div className="flex items-center justify-center gap-1 h-10 py-1 px-4 rounded-2xl bg-theme-bg/80 border border-theme-border/60">
                {[12, 24, 18, 32, 14, 28, 20, 36, 16, 22, 30, 15, 26, 18, 22].map(
                  (height, idx) => (
                    <motion.span
                      key={idx}
                      animate={
                        isPlaying
                          ? {
                              scaleY: [0.3, 1.2, 0.4, 1],
                              opacity: [0.6, 1, 0.7, 0.9],
                            }
                          : { scaleY: 0.25, opacity: 0.3 }
                      }
                      transition={
                        isPlaying
                          ? {
                              repeat: Infinity,
                              duration: 0.6 + (idx % 5) * 0.1,
                              ease: 'easeInOut',
                            }
                          : { duration: 0.3 }
                      }
                      style={{ height: `${height}px` }}
                      className="w-1.5 rounded-full bg-gradient-to-t from-indigo-500 via-cyan-500 to-indigo-400 origin-bottom"
                    />
                  )
                )}
              </div>

              {/* Progress Track */}
              <div className="w-full bg-theme-border/60 h-1 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-indigo-500 h-full transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Controls bar */}
              <div className="flex items-center justify-between mt-3 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePlayPause}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors disabled:opacity-50"
                  >
                    {isPlaying ? (
                      <>
                        <LuPause className="w-3.5 h-3.5" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <LuPlay className="w-3.5 h-3.5" />
                        <span>{currentResponse.audioUrl ? 'Play Audio' : 'Speak Text'}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleReplay}
                    disabled={!currentResponse.audioUrl || loading}
                    className="p-1.5 rounded-xl border border-theme-border text-theme-textMuted hover:text-theme-text hover:bg-theme-bg transition-colors disabled:opacity-40"
                    title="Replay from start"
                  >
                    <LuRotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={toggleMute}
                    className="p-1.5 rounded-xl border border-theme-border text-theme-textMuted hover:text-theme-text hover:bg-theme-bg transition-colors"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? (
                      <LuVolumeX className="w-3.5 h-3.5 text-rose-500" />
                    ) : (
                      <LuVolume2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {currentResponse.duration > 0 && (
                  <span className="text-[11px] text-theme-textMuted">
                    {Math.round(currentResponse.duration)}s audio
                  </span>
                )}
              </div>
            </div>

            {/* Response Transcript Display Area */}
            <div className="flex-1 p-4 overflow-y-auto max-h-48 space-y-2 text-xs leading-relaxed text-theme-text bg-theme-bg/30">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-theme-accent font-semibold">
                <span>Transcript / Answer</span>
                <span className="text-theme-textMuted font-normal">
                  {currentResponse.category}
                </span>
              </div>
              <p className="font-sans leading-relaxed text-theme-text/90 bg-theme-surface/80 p-3 rounded-2xl border border-theme-border/60 shadow-sm">
                "{currentResponse.text}"
              </p>
            </div>

            {/* Quick Topic Chips */}
            <div className="p-3 border-t border-theme-border/40 bg-theme-surfaceSecondary/30">
              <span className="block text-[10px] font-mono text-theme-textMuted mb-2 uppercase tracking-wider">
                💡 Ask One-Click Topics:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {PRESET_TOPICS.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => handleAskQuestion(topic.query)}
                    disabled={loading}
                    className="text-[11px] font-mono px-2.5 py-1 rounded-lg border border-theme-border bg-theme-bg/80 text-theme-text hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors disabled:opacity-50 text-left"
                  >
                    {topic.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Question Input Footer */}
            <div className="p-3 border-t border-theme-border bg-theme-surface">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAskQuestion(customQuery);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  placeholder="Ask anything about Praveen's projects, skills..."
                  disabled={loading}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-theme-border bg-theme-bg text-theme-text placeholder:text-theme-textMuted focus:outline-none focus:border-indigo-500 font-mono"
                />
                <button
                  type="submit"
                  disabled={loading || !customQuery.trim()}
                  className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors disabled:opacity-40"
                  aria-label="Send query"
                >
                  <LuSend className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HeyGenVoiceAssistant;
