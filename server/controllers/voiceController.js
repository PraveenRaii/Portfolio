const {
  getHeyGenStatus,
  getHeyGenVoices,
  synthesizeSpeech,
  cleanTextForSpeech,
  DEFAULT_VOICES,
} = require('../utils/heygenVoice');

const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Certificate = require('../models/Certificate');
const Skill = require('../models/Skill');

/**
 * @desc    Get HeyGen Voice AI service status and account info
 * @route   GET /api/voice/status
 * @access  Public / Admin
 */
const getStatus = async (req, res, next) => {
  try {
    const status = await getHeyGenStatus();
    res.status(200).json({
      success: true,
      data: {
        ...status,
        defaultVoiceId: process.env.HEYGEN_DEFAULT_VOICE_ID || DEFAULT_VOICES[0].id,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get list of available HeyGen voices
 * @route   GET /api/voice/voices
 * @access  Public
 */
const getVoices = async (req, res, next) => {
  try {
    const voices = await getHeyGenVoices();
    res.status(200).json({
      success: true,
      data: {
        defaultVoiceId: process.env.HEYGEN_DEFAULT_VOICE_ID || DEFAULT_VOICES[0].id,
        voices,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Direct Text-to-Speech synthesis using HeyGen Voice 1 Turbo Free
 * @route   POST /api/voice/speak
 * @access  Public
 */
const speakText = async (req, res, next) => {
  try {
    const { text, voiceId } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Text is required for voice synthesis',
      });
    }

    const result = await synthesizeSpeech({
      text,
      voiceId,
    });

    res.status(200).json({
      success: true,
      message: 'Voice synthesized successfully with HeyGen AI',
      data: result,
    });
  } catch (err) {
    console.error('[Voice Controller Error]:', err.message);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Failed to synthesize speech with HeyGen Voice AI',
    });
  }
};

/**
 * @desc    Ask Praveen's AI Voice Assistant about his portfolio
 * @route   POST /api/voice/ask
 * @access  Public
 */
const askPortfolioAssistant = async (req, res, next) => {
  try {
    const { query, topic, voiceId } = req.body;
    const prompt = (query || topic || 'intro').toLowerCase().trim();

    // Fetch dynamic profile context
    const profile = await Profile.findOne().lean().catch(() => null);

    let answerText = '';
    let category = 'general';

    if (
      prompt.includes('intro') ||
      prompt.includes('who are you') ||
      prompt.includes('about') ||
      prompt.includes('praveen')
    ) {
      category = 'intro';
      answerText =
        profile?.bio ||
        "Hi there! I am Praveen Rai, a Full Stack Developer and Computer Science undergraduate at SRMU Lucknow powered by Sunstone. I specialize in building responsive web applications with React, Node.js, Spring Boot, and MongoDB. Welcome to my portfolio!";
    } else if (
      prompt.includes('skill') ||
      prompt.includes('stack') ||
      prompt.includes('tech') ||
      prompt.includes('languages')
    ) {
      category = 'skills';
      answerText =
        "Praveen works across the modern full-stack ecosystem. His core programming languages are Java and JavaScript. On the frontend, he builds responsive interfaces with React and Tailwind CSS. For backend systems, he creates RESTful APIs using Node.js, Express, Spring Boot, MongoDB, and MySQL, alongside solid algorithmic foundations.";
    } else if (
      prompt.includes('project') ||
      prompt.includes('fixmyarea') ||
      prompt.includes('work')
    ) {
      category = 'projects';
      answerText =
        "A standout project by Praveen is FixMyArea, a civic issue resolution platform developed with the MERN stack. It empowers citizens to report local civic issues with real-time photo uploads, status updates, and administrative resolution workflows.";
    } else if (
      prompt.includes('education') ||
      prompt.includes('college') ||
      prompt.includes('university') ||
      prompt.includes('sunstone') ||
      prompt.includes('srmu')
    ) {
      category = 'education';
      answerText =
        "Praveen is pursuing his B.Tech in Computer Science and Engineering from Shri Ramswaroop Memorial University (SRMU), Lucknow, in partnership with Sunstone, graduating in 2028. His coursework focuses on Data Structures, Database Systems, and Object-Oriented Software Engineering.";
    } else if (
      prompt.includes('leetcode') ||
      prompt.includes('coding') ||
      prompt.includes('dsa') ||
      prompt.includes('problem')
    ) {
      category = 'leetcode';
      answerText =
        "Praveen regularly practices Data Structures and Algorithms on LeetCode under the handle Praveen_913. He has solved over 150 algorithmic problems, sharpening his problem-solving skills in arrays, trees, dynamic programming, and Java OOP.";
    } else if (
      prompt.includes('contact') ||
      prompt.includes('hire') ||
      prompt.includes('email') ||
      prompt.includes('reach')
    ) {
      category = 'contact';
      answerText =
        `You can easily get in touch with Praveen by emailing praveen1234202040@gmail.com, or connecting via LinkedIn and GitHub. He is open to exciting software engineering internships, entry-level developer roles, and impactful projects.`;
    } else if (
      prompt.includes('achievement') ||
      prompt.includes('certificate') ||
      prompt.includes('awards')
    ) {
      category = 'achievements';
      answerText =
        "Praveen has earned verified credentials and certifications across Full Stack Development, Java Programming, and Cloud Databases, alongside hackathons and developer workshop participations at Sunstone and SRMU.";
    } else {
      category = 'custom';
      answerText = `Praveen Rai is a software engineer passionate about clean code, scalable architecture, and user-centric web applications. Explore his projects and feel free to connect via the contact section!`;
    }

    // Synthesize using HeyGen Voice 1 Turbo Free
    const speechResult = await synthesizeSpeech({
      text: answerText,
      voiceId,
    });

    res.status(200).json({
      success: true,
      data: {
        category,
        query: prompt,
        answerText: speechResult.text,
        audioUrl: speechResult.audioUrl,
        duration: speechResult.duration,
        voiceId: speechResult.voiceId,
        cached: speechResult.cached || false,
      },
    });
  } catch (err) {
    console.error('[Voice Assistant Query Error]:', err.message);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Failed to process voice assistant query',
    });
  }
};

module.exports = {
  getStatus,
  getVoices,
  speakText,
  askPortfolioAssistant,
};
