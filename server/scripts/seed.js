const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Models
const User = require('../models/User');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Education = require('../models/Education');
const Certificate = require('../models/Certificate');
const Testimonial = require('../models/Testimonial');

// Load env
dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('[Seeding]: Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Seeding]: Connected to MongoDB successfully.');

    // Clear existing collections
    console.log('[Seeding]: Clearing old data collections...');
    await Promise.all([
      User.deleteMany(),
      Profile.deleteMany(),
      Project.deleteMany(),
      Skill.deleteMany(),
      Education.deleteMany(),
      Certificate.deleteMany(),
      Testimonial.deleteMany(),
    ]);

    // 1. Create Admin Account
    console.log('[Seeding]: Creating Admin Account...');
    const adminEmail = process.env.ADMIN_EMAIL || 'praveen1234202040@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPraveen@2026';
    const adminName = process.env.ADMIN_NAME || 'Praveen Rai';

    const adminUser = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      collegeOrCompany: 'SRMU Lucknow / Sunstone',
      isBlocked: false,
      avatar: {
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
        public_id: '',
      },
    });
    console.log(`[Seeding]: Admin created successfully (${adminEmail})`);

    // Create a demo verified User for testing
    const demoUser = await User.create({
      name: 'Rohan Sharma',
      email: 'rohan.sharma@example.com',
      password: 'UserDemo@123',
      role: 'user',
      collegeOrCompany: 'Tech Innovators Club',
      isBlocked: false,
      avatar: {
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
        public_id: '',
      },
    });

    // 2. Create Profile Data
    console.log('[Seeding]: Creating Profile Data...');
    await Profile.create({
      name: 'Praveen Rai',
      roleTitle: 'Full Stack Developer (MERN)',
      intro:
        'Passionate MERN stack developer from Lucknow, building full-stack projects with authentication, role-based access and real-world features. Actively looking for internship and placement opportunities.',
      aboutText:
        'I am currently pursuing my B.Tech (3rd Year) in Computer Science & Engineering at Shri Ramswaroop Memorial University (SRMU), Lucknow (Powered by Sunstone). With a deep focus on the JavaScript ecosystem, I architect robust RESTful APIs with Node.js and Express, build intuitive and animated frontend interfaces with React and Tailwind CSS, and manage scalable document databases with MongoDB. Passionate about system design, code quality, and solving problems that deliver measurable business impact.',
      email: 'praveen1234202040@gmail.com',
      phone: '+91-9876543210',
      location: 'Lucknow, Uttar Pradesh, India',
      avatar: {
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
        public_id: '',
      },
      resume: {
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // Default placeholder URL
        fileName: 'Praveen_Rai_Resume.pdf',
        updatedAt: new Date(),
      },
      socialLinks: {
        linkedin: 'https://www.linkedin.com/in/praveen-rai-9r13/',
        github: 'https://github.com/PraveenRaii',
        twitter: 'https://twitter.com/',
        leetcode: 'https://leetcode.com/',
        instagram: 'https://instagram.com/',
      },
    });

    // 3. Create Projects
    console.log('[Seeding]: Creating Projects...');
    const project1 = await Project.create({
      title: 'FixMyArea - Civic Grievance & Municipal Tracking System',
      description:
        'Civic-tech web platform enabling citizens to report local infrastructure issues, monitor complaint workflows, and verify municipal resolution.',
      longDescription:
        'Engineered with React, Spring Boot, Java, and MySQL. Features real-time status transitions, role-based departmental escalation, automated ticket resolution metrics, and interactive maps for localized grievance tracking.',
      image: {
        url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1200&auto=format&fit=crop&q=80',
        public_id: '',
      },
      tags: ['React', 'Spring Boot', 'Java', 'MySQL', 'REST APIs', 'Tailwind CSS'],
      liveUrl: 'https://github.com/PraveenRaii',
      githubUrl: 'https://github.com/PraveenRaii',
      order: 1,
      isFeatured: true,
      likes: [demoUser._id],
    });

    const project2 = await Project.create({
      title: 'AssetFlow - Enterprise Resource & Maintenance Hub',
      description:
        'Comprehensive asset tracking system to monitor institutional equipment, departmental reservations, maintenance schedules, and audit trails.',
      longDescription:
        'Architected with Node.js, Express, MongoDB, and EJS. Implements automated reservation lifecycles, equipment maintenance alerts, role-based departmental checkout, and comprehensive audit history to prevent resource bottlenecks.',
      image: {
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
        public_id: '',
      },
      tags: ['Node.js', 'Express', 'MongoDB', 'EJS', 'REST APIs', 'Cloudinary'],
      liveUrl: 'https://github.com/PraveenRaii',
      githubUrl: 'https://github.com/PraveenRaii',
      order: 2,
      isFeatured: true,
      likes: [demoUser._id, adminUser._id],
    });

    const project3 = await Project.create({
      title: 'AI Education Hub - Intelligent Adaptive Learning Platform',
      description:
        'Interactive learning system providing automated programming assessment, real-time code execution feedback, and adaptive module guidance.',
      longDescription:
        'Built with React, FastAPI, Python, and Tailwind CSS. Features containerized sandbox code execution, algorithmic complexity evaluation, structured problem recommendations, and comprehensive student learning analytics.',
      image: {
        url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80',
        public_id: '',
      },
      tags: ['React', 'FastAPI', 'Python', 'Tailwind CSS', 'REST APIs'],
      liveUrl: 'https://github.com/PraveenRaii',
      githubUrl: 'https://github.com/PraveenRaii',
      order: 3,
      isFeatured: true,
      likes: [adminUser._id],
    });

    // Link one saved project to demo user
    demoUser.savedProjects = [project1._id, project2._id];
    await demoUser.save();

    // 4. Create Skills
    console.log('[Seeding]: Creating Skills...');
    const skillsData = [
      { name: 'React.js', category: 'Frontend', level: 'Advanced', proficiency: 90, icon: 'SiReact', order: 1 },
      { name: 'JavaScript (ES6+)', category: 'Languages', level: 'Advanced', proficiency: 92, icon: 'SiJavascript', order: 2 },
      { name: 'Node.js', category: 'Backend', level: 'Advanced', proficiency: 88, icon: 'SiNodedotjs', order: 3 },
      { name: 'Express.js', category: 'Backend', level: 'Advanced', proficiency: 89, icon: 'SiExpress', order: 4 },
      { name: 'MongoDB & Mongoose', category: 'Database', level: 'Advanced', proficiency: 86, icon: 'SiMongodb', order: 5 },
      { name: 'Tailwind CSS', category: 'Frontend', level: 'Expert', proficiency: 94, icon: 'SiTailwindcss', order: 6 },
      { name: 'RESTful API Design', category: 'Backend', level: 'Advanced', proficiency: 90, icon: 'SiPostman', order: 7 },
      { name: 'HTML5 & Modern CSS3', category: 'Frontend', level: 'Expert', proficiency: 95, icon: 'SiHtml5', order: 8 },
      { name: 'Git & GitHub', category: 'Tools & DevOps', level: 'Advanced', proficiency: 88, icon: 'SiGithub', order: 9 },
      { name: 'Postman & API Testing', category: 'Tools & DevOps', level: 'Advanced', proficiency: 87, icon: 'SiPostman', order: 10 },
      { name: 'Cloudinary Media API', category: 'Tools & DevOps', level: 'Intermediate', proficiency: 82, icon: 'SiCloudinary', order: 11 },
      { name: 'Vercel & Render Deployment', category: 'Tools & DevOps', level: 'Advanced', proficiency: 85, icon: 'SiVercel', order: 12 },
    ];
    await Skill.insertMany(skillsData);

    // 5. Create Education
    console.log('[Seeding]: Creating Education...');
    await Education.create([
      {
        degree: 'Bachelor of Technology (B.Tech) - Computer Science & Engineering',
        institution: 'Shri Ramswaroop Memorial University (SRMU), Lucknow (Powered by Sunstone)',
        fieldOfStudy: 'Computer Science and Information Technology',
        startDate: '2022',
        endDate: '2026',
        current: true,
        grade: 'Current: 3rd Year (8.2 CGPA)',
        description:
          'Specializing in Full Stack Software Development, Database Management Systems, Object Oriented Programming in Java/C++, Operating Systems, and Cloud Architectures.',
        order: 1,
      },
      {
        degree: 'Senior Secondary Education (Class XII - PCM)',
        institution: 'Central Board of Secondary Education (CBSE)',
        fieldOfStudy: 'Physics, Chemistry, Mathematics & Computer Science',
        startDate: '2020',
        endDate: '2022',
        current: false,
        grade: 'First Division with Distinction',
        description:
          'Strong foundational coursework in algorithmic thinking, calculus, physics, and programming basics.',
        order: 2,
      },
    ]);

    // 6. Create Certificates
    console.log('[Seeding]: Creating Certificates...');
    await Certificate.create([
      {
        title: 'Full Stack Web Development (MERN Stack)',
        issuer: 'Sunstone Eduversity / Industry Bootcamp',
        issueDate: '2024',
        credentialUrl: 'https://github.com/PraveenRaii',
        image: {
          url: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&auto=format&fit=crop&q=60',
          public_id: '',
        },
        order: 1,
      },
      {
        title: 'Building Scalable REST APIs with Node.js & Express',
        issuer: 'Udemy / Online Academy',
        issueDate: '2023',
        credentialUrl: 'https://github.com/PraveenRaii',
        image: {
          url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60',
          public_id: '',
        },
        order: 2,
      },
      {
        title: 'MongoDB Database Administrator & Mongoose Essentials',
        issuer: 'MongoDB University',
        issueDate: '2023',
        credentialUrl: 'https://github.com/PraveenRaii',
        image: {
          url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60',
          public_id: '',
        },
        order: 3,
      },
    ]);

    // 7. Create Testimonials
    console.log('[Seeding]: Creating Sample Testimonials...');
    await Testimonial.create([
      {
        user: demoUser._id,
        name: 'Amit Verma',
        roleOrCompany: 'Senior Project Mentor, Sunstone',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80',
        content:
          'Praveen is an exceptional developer who masters full-stack MERN development with remarkable clarity. His attention to authentication security, clean API structure, and responsive UI components makes his applications production-ready from day one.',
        rating: 5,
        status: 'approved',
      },
      {
        user: demoUser._id,
        name: 'Neha Gupta',
        roleOrCompany: 'Tech Lead / Peer Collaborator',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=80',
        content:
          'Worked with Praveen on collaborative sprint projects. His ability to build modular Express middleware, handle state management smoothly in React, and deliver before deadlines is truly commendable!',
        rating: 5,
        status: 'approved',
      },
    ]);

    console.log('========================================================');
    console.log('[Seeding Completed Successfully!]');
    console.log('Admin Account:');
    console.log(`Email:    ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('--------------------------------------------------------');
    console.log('Demo User Account:');
    console.log(`Email:    rohan.sharma@example.com`);
    console.log(`Password: UserDemo@123`);
    console.log('========================================================');

    process.exit(0);
  } catch (error) {
    console.error('[Seeding Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
