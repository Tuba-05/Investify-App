import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoHelpCircle, 
  IoTrendingUp, 
  IoStar, 
  IoShieldCheckmark, 
  IoMail, 
  IoChevronDown,
  IoPaperPlane,
  IoCheckmarkCircle,
  IoDocumentText,
  IoStatsChart,
  IoLockClosed
} from 'react-icons/io5';
import './Help.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

const Help = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    category: 'General Query',
    message: ''
  });

  const faqData = [
    {
      id: 1,
      category: 'Market Telemetry',
      icon: <IoTrendingUp />,
      question: 'How is stock market data fetched and updated?',
      answer: 'Investify integrates with Yahoo Finance (yfinance) and 5-minute memory TTL caching algorithms to parse real-time stock rates, market caps, 30-day intraday charts, and 20-year weekly trend cycles.'
    },
    {
      id: 2,
      category: 'Stock Rankings',
      icon: <IoStatsChart />,
      question: 'How does live Market Cap Ranking work in StockList?',
      answer: 'Companies are dynamically sorted in real-time by Market Capitalization in descending order (#1 NVIDIA, #2 Apple, #3 Google...). Ranks auto-poll every 5 minutes and can be manually refreshed anytime using the "Live Ranks" button.'
    },
    {
      id: 3,
      category: 'Watchlist Management',
      icon: <IoStar />,
      question: 'How do I add or remove companies from my Watchlist?',
      answer: 'Navigate to the StockList page and click the Star icon next to any company. Starred companies will automatically appear on your personalized WatchList page.'
    },
    {
      id: 4,
      category: 'Financial Exports',
      icon: <IoDocumentText />,
      question: 'How can I download PDF or CSV Financial Reports?',
      answer: 'Open any company\'s Financial Statement page (CmpFS) and click either the "📄 Download PDF Report" or "📊 Export CSV" button at the top of the card to save full financial audit reports.'
    },
    {
      id: 5,
      category: 'Account & Security',
      icon: <IoShieldCheckmark />,
      question: 'How does OTP email verification work for Forgot Password?',
      answer: 'When requesting a password reset, a 6-character verification code is sent to your registered email address via SMTP. The code remains active for 2 minutes for maximum security.'
    },
    {
      id: 6,
      category: 'Session Protection',
      icon: <IoLockClosed />,
      question: 'Are application pages protected by user session guards?',
      answer: 'Yes! All internal application pages (Home, StockList, WatchList, Help, AboutUs, CmpFS) are protected by ProtectedRoute session guards. Unauthenticated requests automatically redirect to the Login page.'
    },
    {
      id: 7,
      category: 'Interactive Charts',
      icon: <IoHelpCircle />,
      question: 'What historical chart views are available for companies?',
      answer: 'Each company\'s Financial Statement page features two interactive chart sliders: a 30-Day Intraday Performance slider (Price Trend, Volatility Range, Volume) and a 10-Year Historical Cycle slider.'
    }
  ];

  const toggleFaq = (id) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  const handleFormChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      alert("Please fill in all required fields.");
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE}/api/auth/submit-support-ticket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          category: contactForm.category,
          message: contactForm.message
        })
      });
      const data = await response.json();
      if (data.success) {
        setContactSubmitted(true);
        setTimeout(() => {
          setContactSubmitted(false);
          setContactForm({ name: '', email: '', category: 'General Query', message: '' });
        }, 4000);
      } else {
        alert(data.message || "Failed to send support ticket.");
      }
    } catch (err) {
      console.error("Error submitting support query:", err);
      alert("Failed to send support ticket. Please check your server connection.");
    }
  };

  return (
    <div className="help-container">
      {/* Hero Header without Search Bar */}
      <motion.div 
        className="help-hero"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1><IoHelpCircle className="hero-icon" /> Investify Support Center</h1>
        <p>Explore comprehensive answers regarding market telemetry, watchlist management, reports, and security.</p>
      </motion.div>

      {/* Main Grid */}
      <div className="help-content-grid">
        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqData.map((faq) => (
              <div 
                key={faq.id} 
                className={`faq-item ${activeFaq === faq.id ? 'active' : ''}`}
              >
                <button className="faq-question-btn" onClick={() => toggleFaq(faq.id)}>
                  <span className="faq-icon-title">
                    <span className="category-icon">{faq.icon}</span>
                    {faq.question}
                  </span>
                  <IoChevronDown className={`chevron-icon ${activeFaq === faq.id ? 'rotated' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === faq.id && (
                    <motion.div 
                      className="faq-answer"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p>{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support Form */}
        <div className="contact-card">
          <h2><IoMail /> Contact Support</h2>
          <p>Have a custom question or feedback? Type your message below and send it directly: <br />
            <a href="mailto:tubabintenaushad@gmail.com" style={{ color: '#1cb5ab', fontWeight: 'bold' }}>tubabintenaushad@gmail.com</a>
          </p>

          {contactSubmitted ? (
            <div className="contact-success-msg">
              <IoCheckmarkCircle className="success-icon" />
              <h3>Message Sent Successfully!</h3>
              <p>Thank you for reaching out. Our support team will review your message shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="contact-form">
              <div className="form-group">
                <label>Your Name *</label>
                <input 
                  type="text" 
                  name="name"
                  placeholder="Enter your name" 
                  value={contactForm.name}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="name@example.com" 
                  value={contactForm.email}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Query Category</label>
                <select 
                  name="category"
                  value={contactForm.category}
                  onChange={handleFormChange}
                >
                  <option value="General Query">General Query</option>
                  <option value="Market Data Issue">Market Data Issue</option>
                  <option value="Watchlist Problem">Watchlist Problem</option>
                  <option value="Account & Login">Account & Login</option>
                  <option value="PDF/CSV Export">PDF/CSV Export</option>
                </select>
              </div>

              <div className="form-group">
                <label>Message *</label>
                <textarea 
                  name="message"
                  rows="4"
                  placeholder="Type your message or question here..." 
                  value={contactForm.message}
                  onChange={handleFormChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-support-btn">
                <IoPaperPlane /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Help;
