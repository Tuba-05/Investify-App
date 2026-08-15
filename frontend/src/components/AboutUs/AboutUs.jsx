import React from 'react';
import { motion } from 'framer-motion';
import { 
  IoAnalytics, 
  IoLogoReact, 
  IoLogoPython, 
  IoServer, 
  IoSchool, 
  IoLockClosed,
  IoTrendingUp,
  IoLayers,
  IoSparkles,
  IoLogoLinkedin,
  IoMail,
  IoCheckmarkDoneCircle
} from 'react-icons/io5';
import './AboutUs.css';

const AboutUs = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="about-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Banner */}
      <motion.div className="about-hero" variants={itemVariants}>
        <div className="badge-wrapper">
          <span className="hero-badge"><IoSparkles /> Full-Stack Financial Application</span>
        </div>
        <h1><IoAnalytics className="about-hero-icon" /> About Investify</h1>
        <p>
          Investify is a state-of-the-art web application providing real-time stock market telemetry, 
          intraday and long-term trend analysis, historical financial statements, and custom user watchlists.
        </p>
      </motion.div>

      {/* Key Takeaways & Capabilities */}
      <motion.div className="about-section" variants={itemVariants}>
        <h2>✨ Core Capabilities</h2>
        <div className="capabilities-grid">
          <div className="capability-card">
            <IoTrendingUp className="cap-icon" />
            <h3>Live Market Telemetry</h3>
            <p>Integrates external financial APIs and <code>yfinance</code> to fetch live stock prices, market capitalization, and statement records.</p>
          </div>

          <div className="capability-card">
            <IoLayers className="cap-icon" />
            <h3>Interactive Visualization</h3>
            <p>Dynamic stock performance graphs rendering 30-day intraday series and 20-year long-term weekly trends using Recharts.</p>
          </div>

          <div className="capability-card">
            <IoServer className="cap-icon" />
            <h3>Relational Watchlist</h3>
            <p>Personalized stock watchlist management per user stored in PostgreSQL with SQLAlchemy ORM query optimization.</p>
          </div>

          <div className="capability-card">
            <IoLockClosed className="cap-icon" />
            <h3>Secure OTP Verification</h3>
            <p>User signup, login, and password reset verified via 6-digit OTP verification email integration over SMTP.</p>
          </div>
        </div>
      </motion.div>

      {/* Tech Stack Cards */}
      <motion.div className="about-section" variants={itemVariants}>
        <h2>🛠️ Technology Stack</h2>
        <div className="tech-grid">
          <div className="tech-card">
            <IoLogoReact className="tech-icon react-icon" />
            <h3>Frontend (React & Vite)</h3>
            <p>React 19, React Router, Material-UI (<code>@mui/x-data-grid</code>), Recharts, Chart.js, Framer Motion, and Boxicons.</p>
          </div>

          <div className="tech-card">
            <IoLogoPython className="tech-icon python-icon" />
            <h3>Backend (Flask REST API)</h3>
            <p>Flask Blueprints, Flask-SQLAlchemy, Werkzeug Password Hashing, SMTP Mail Dispatch, Pandas, NumPy, and <code>yfinance</code>.</p>
          </div>

          <div className="tech-card">
            <IoServer className="tech-icon db-icon" />
            <h3>Database System</h3>
            <p>PostgreSQL relational database storing users, password verification records, company metadata, and watchlists.</p>
          </div>
        </div>
      </motion.div>

      {/* Academic Context & Author Card */}
      <motion.div className="author-academic-grid" variants={itemVariants}>
        <div className="academic-card">
          <IoSchool className="academic-icon" />
          <div>
            <h3>🎓 Academic Context</h3>
            <p>
              Developed as part of the <strong>Computer & Information Systems Engineering</strong> curriculum 
              at <strong>NED University of Engineering & Technology (NEDUET)</strong> to demonstrate full-stack architecture, 
              live API integration, and relational database planning.
            </p>
          </div>
        </div>

        <div className="author-card">
          <h3>👩‍💻 Project Author</h3>
          <p className="author-name">Tuba Naushad</p>
          <p className="author-title">CIS Engineering Student @ NEDUET</p>
          
          <div className="author-links">
            <a 
              href="https://linkedin.com/in/tuba-naushad-6a4552253" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-btn linkedin-btn"
            >
              <IoLogoLinkedin /> LinkedIn Profile
            </a>
            <a 
              href="mailto:tubabintenaushad@gmail.com" 
              className="social-btn email-btn"
            >
              <IoMail /> Contact via Email
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AboutUs;
