# Praveen Rai — Full Stack Developer Portfolio & Management Platform

A production-grade, full-stack MERN portfolio platform and administrative content management system built for **Praveen Rai** (B.Tech 3rd Year CSE at Shri Ramswaroop Memorial University, Lucknow - Powered by Sunstone).

Designed with a studio-grade editorial visual identity featuring **Burnt Orange + Warm Cream (Light Theme) / Deep Charcoal (Dark Theme)**, dual-role authentication (Admin & User), real-time database persistence, and an interactive developer workspace.

---

## ⚡ Tech Stack & Architecture

### Frontend Ecosystem
* **Framework:** React 18 with Vite
* **Styling & Design System:** Tailwind CSS with custom design tokens, CSS variables, and responsive grid layouts
* **Typography:** Space Grotesk (Headings), Inter (Body), JetBrains Mono (Technical labels & code panels)
* **Animation:** Framer Motion (subtle entrance and layout transitions)
* **Icons:** React Icons (`react-icons/lu` & `react-icons/fi`)
* **State & Routing:** React Router v6, Context API (`ThemeContext`, `AuthContext`)
* **HTTP Client & Notifications:** Axios with response interceptors & React Hot Toast

### Backend Ecosystem
* **Runtime & Framework:** Node.js 20+ & Express.js
* **Database & ORM:** MongoDB Atlas with Mongoose
* **Authentication:** Stateless JWT stored in secure `httpOnly` cookies with role authorization middleware (`verifyToken`, `isAdmin`, `isUser`)
* **Security Suite:** Helmet (HTTP security headers), CORS (origin validation), Express Rate Limiter, and Bcrypt password hashing
* **Media & File Storage:** Multer with Cloudinary CDN integration and local disk fallback
* **Email Service:** Nodemailer (SMTP) for inquiry notifications and OTP password reset workflows

---

## 🌟 Key Features

### 1. Public Portfolio
* **Signature Two-Column Hero:** Interactive developer workspace code editor showcasing syntax-highlighted Java & Spring Boot code with line numbers, status pill, and floating badges.
* **Developer Marquee:** Continuous horizontal ticker with technical specialties (`Java`, `Spring Boot`, `React`, `MySQL`, `REST APIs`, `Problem Solving`).
* **01 / About Me:** Educational background at SRMU Lucknow (Powered by Sunstone), engineering philosophy, and core focus areas.
* **02 / Selected Work:** Case studies of signature builds:
  * **FixMyArea:** Civic Grievance Reporting & Municipal Tracking System (React, Spring Boot, Java, MySQL).
  * **AssetFlow:** Enterprise Resource Allocation & Maintenance Hub (Node.js, Express, MongoDB, EJS).
  * **AI Education Hub:** Adaptive Learning & Automated Code Assessment Platform (React, FastAPI, Python).
* **03 / Toolkit:** Grouped tech stack cards with depth tags (`Languages`, `Backend`, `Frontend`, `Databases & Tools`, `Core Engineering`) without arbitrary percentage bars.
* **04 / Journey:** Academic milestones (B.Tech CSE & CBSE) paired with verified credentials and certifications.
* **05 / Say Hello:** Direct inquiry form connected to the backend API, plus one-click copyable email and social links.
* **Instant Resume PDF:** Direct download button in the header, hero, and footer serving the latest uploaded resume.

### 2. Administrator Portal (`/admin`)
* **Executive Dashboard:** Live visit counter, total users, published projects, unread inquiries, and visit charts.
* **Projects Manager:** Create, update, toggle featured status, and delete portfolio builds.
* **Skills & Academics Manager:** Real-time CRUD operations over technical skills, university education, and certificates.
* **Users Manager:** Search user base, inspect registered members, toggle block/unblock status, and remove accounts.
* **Testimonials Moderation:** Review pending community recommendations, approve, reject, or delete feedback.
* **Inquiry Inbox:** Read messages sent via the contact form, mark as read, delete, or reply directly via email.
* **Resume & Site Settings:** Update profile bio, phone, social URLs, and upload a new resume PDF with automatic versioning.

### 3. User Portal (`/user`)
* **Personalized Dashboard:** Welcome stats, quick links, and activity summary.
* **Saved Projects:** Bookmark favorite projects for quick reference.
* **Leave Feedback:** Submit a recommendation/testimonial that is sent directly to Admin for approval.
* **Messages:** Direct communication channel with Praveen and review reply history.
* **Profile Settings:** Update name, avatar, institution/company, change password, or self-delete account.

---

## 📂 Project Structure

```
Portfolio/
├── client/                     # Frontend React + Vite Application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── admin/              # Admin layouts and manager pages
│   │   ├── user/               # User panel layouts and sub-pages
│   │   ├── components/
│   │   │   ├── common/         # Navbar, Footer, Button, ThemeToggle, Modals
│   │   │   └── sections/       # Hero, About, Projects, Skills, Journey, Contact
│   │   ├── context/            # AuthContext & ThemeContext
│   │   ├── services/           # Axios API services (auth, public, admin, user)
│   │   ├── App.jsx             # Route definitions & protected route guards
│   │   ├── main.jsx            # Application entrypoint
│   │   └── index.css           # Design tokens, variables & utility classes
│   ├── tailwind.config.js      # Palette and font mapping
│   ├── vite.config.js          # Vite config with API proxy
│   └── package.json
│
├── server/                     # Backend Node.js + Express API
│   ├── config/                 # MongoDB & Cloudinary connectors
│   ├── controllers/            # Auth, Public, User, and Admin controllers
│   ├── middleware/             # verifyToken, role checks, upload, error handler
│   ├── models/                 # Mongoose schemas (User, Project, Skill, etc.)
│   ├── routes/                 # Express route definitions
│   ├── scripts/                # Database seed script
│   ├── uploads/                # Static files & fallback resume PDF
│   ├── utils/                  # Emailer, Cloudinary upload fallback, validators
│   ├── server.js               # Express server entrypoint
│   └── package.json
│
├── .gitignore                  # Environment and dependency exclusions
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18.x or v20.x recommended)
* **MongoDB** (Local instance or MongoDB Atlas cluster URI)
* **Git**

---

### Step 1: Clone Repository & Configure Environment

```bash
git clone https://github.com/PraveenRaii/Portfolio.git
cd Portfolio
```

#### Server Environment (`server/.env`):
Create `server/.env` using `server/.env.example`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB Connection
MONGO_URI=your_mongodb_connection_string

# Authentication & Cookies
JWT_SECRET=your_jwt_secret_minimum_32_characters_here
JWT_EXPIRE=7d
COOKIE_EXPIRE=7

# Default Administrator Seed Account
ADMIN_NAME=Praveen Rai
ADMIN_EMAIL=praveen1234202040@gmail.com
ADMIN_PASSWORD=AdminPraveen@2026

# Cloudinary (Optional - Automatic local disk fallback included)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# SMTP / Email Alerts (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
EMAIL_FROM_NAME="Praveen Rai Portfolio"
EMAIL_FROM_ADDRESS=your_email@gmail.com
```

#### Client Environment (`client/.env`):
Create `client/.env` using `client/.env.example`:
```env
VITE_API_URL=/api
```

---

### Step 2: Install Dependencies & Seed Database

#### Backend Setup:
```bash
cd server
npm install

# Seed the database with Admin, Demo User, and signature projects
npm run seed

# Start server with watch mode
npm run dev
```
*(Server runs on `http://localhost:5000`)*

#### Frontend Setup:
Open a second terminal:
```bash
cd client
npm install

# Start Vite development server
npm run dev
```
*(Client runs on `http://localhost:5173`)*

---




## 🌐 Production Deployment

### Backend (Render / Railway)
1. Deploy `server` directory as a Web Service.
2. Add environment variables from `server/.env`.
3. Set Build Command: `npm install`
4. Set Start Command: `node server.js`
5. Note: Configure `CLIENT_URL` to match your deployed frontend URL.

### Frontend (Vercel)
1. Deploy `client` directory as a Vite React project.
2. Set Environment Variable: `VITE_API_URL=https://your-backend-url.onrender.com/api`
3. Include rewrite rules in `vercel.json` for SPA routing:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 👨‍💻 Author

**Praveen Rai**  
* 🎓 B.Tech Computer Science & Engineering (3rd Year)  
* 🏛️ Shri Ramswaroop Memorial University (SRMU), Lucknow (Powered by Sunstone)  
* 💼 LinkedIn: [linkedin.com/in/praveen-rai-9r13](https://www.linkedin.com/in/praveen-rai-9r13/)  
* 🐙 GitHub: [github.com/PraveenRaii](https://github.com/PraveenRaii)  
* 📧 Email: [praveen1234202040@gmail.com](mailto:praveen1234202040@gmail.com)

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
