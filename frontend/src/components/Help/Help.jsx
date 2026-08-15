import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoSearch, 
  IoHelpCircle, 
  IoTrendingUp, 
  IoStar, 
  IoShieldCheckmark, 
  IoMail, 
  IoChevronDown,
  IoPaperPlane,
  IoCheckmarkCircle
} from 'react-icons/io5';
import './Help.css';

const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');
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
      category: 'Market Data',
      icon: <IoTrendingUp />,
      question: 'How is stock market data fetched and updated?',
      answer: 'Investify integrates with Yahoo Finance (yfinance) and live telemetry APIs to parse real-time stock rates, historical 30-day intraday charts, and 20-year weekly trends.'
    },
    {
      id: 2,
      category: 'Watchlist',
      icon: <IoStar />,
      question: 'How do I add or remove companies from my Watchlist?',
      answer: 'Navigate to the StockList page and click the Star icon next to any company name. Starred companies will automatically appear in your personalized WatchList page.'
    },
    {
      id: 3,
      category: 'Account & Security',
      icon: <IoShieldCheckmark />,
      question: 'How does OTP email verification work for Forgot Password?',
      answer: 'When requesting a password reset, a cryptographically secure 6-character verification code is dispatched to your registered Gmail address via SMTP. The code remains active for 2 minutes.'
    },
    {
      id: 4,
      category: 'Financial Statements',
      icon: <IoHelpCircle />,
      question: 'Where can I see company financial statements and balance sheets?',
      answer: 'Click on any company name in the StockList to open its detailed Financial Statement page (CmpFS). There you can view revenues, net income, assets, liabilities, and multi-year performance graphs.'
    }
  ];

  const filteredFaqs = faqData.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFaq = (id) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  const handleFormChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      alert("Please fill in all required fields.");
      return;
    }
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', email: '', category: 'General Query', message: '' });
    }, 4000);
  };

  return (
    <div className="help-container">
      {/* Hero Header */}
      <motion.div 
        className="help-hero"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1><IoHelpCircle className="hero-icon" /> Investify Support Center</h1>
        <p>Find answers to common questions about live market telemetry, watchlists, and account security.</p>
        
        {/* Search Bar */}
        <div className="help-search-wrapper">
          <IoSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search help topics, FAQs, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="help-content-grid">
        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
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
              ))
            ) : (
              <p className="no-faqs">No matching help topics found for "{searchTerm}".</p>
            )}
          </div>
        </div>

        {/* Contact Support Card */}
        <div className="contact-card">
          <h2><IoMail /> Contact Support</h2>
          <p>Have a question or feedback? Direct Email: <a href="mailto:tubabintenaushad@gmail.com" style={{ color: '#1cb5ab', fontWeight: 'bold' }}>tubabintenaushad@gmail.com</a></p>

          {contactSubmitted ? (
            <div className="contact-success-msg">
              <IoCheckmarkCircle className="success-icon" />
              <h3>Message Sent!</h3>
              <p>Thank you for reaching out. Our support team will respond shortly.</p>
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
                <label>Category</label>
                <select 
                  name="category"
                  value={contactForm.category}
                  onChange={handleFormChange}
                >
                  <option value="General Query">General Query</option>
                  <option value="Market Data Issue">Market Data Issue</option>
                  <option value="Watchlist Problem">Watchlist Problem</option>
                  <option value="Account & Login">Account & Login</option>
                </select>
              </div>

              <div className="form-group">
                <label>Message *</label>
                <textarea 
                  name="message"
                  rows="4"
                  placeholder="Describe your question or feedback..." 
                  value={contactForm.message}
                  onChange={handleFormChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-support-btn">
                <IoPaperPlane /> Submit Ticket
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Help;
