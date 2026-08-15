import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { NavLink, Outlet, useNavigate } from "react-router-dom"; 
import { IoMdHelpCircle } from "react-icons/io";
import { 
  IoHome, 
  IoLogOut, 
  IoStarSharp, 
  IoInformationCircleSharp, 
  IoClose,
  IoShieldCheckmark,
  IoHelpCircle
} from "react-icons/io5";
import { AiOutlineStock } from "react-icons/ai";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

const Navbar = () => {
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [watchlistCount, setWatchlistCount] = useState(0);

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName") || "Investor";
  const userEmail = localStorage.getItem("userEmail") || "Active Session";

  // Fetch watchlist count for profile telemetry
  useEffect(() => {
    if (userId) {
      fetch(`${API_BASE}/api/watchlist/watchlist/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.companies)) {
            setWatchlistCount(data.companies.length);
          }
        })
        .catch((err) => console.error("Error fetching user watchlist stats:", err));
    }
  }, [userId, showProfileModal]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <>
      {/* Top Gradient Accent Line */}
      <div className='single-line'></div>

      {/* Modern Sidebar Navbar */}
      <div className='nav-bar'>
        <div className='nav-logo'>
          <span className='logo-symbol'>📈</span> Investify.
        </div>
        
        <ul className='nav-links'>
          <li><NavLink to="/HmPg"><IoHome /> Home</NavLink></li>
          <li><NavLink to="/StockList"><AiOutlineStock /> StockList</NavLink></li>
          <li><NavLink to="/WatchList"><IoStarSharp /> Watch List</NavLink></li>
          <li><NavLink to="/AboutUs"><IoInformationCircleSharp /> About Us</NavLink></li>
          <li><NavLink to="/Help"><IoMdHelpCircle /> Help</NavLink></li>
          
          <li className="logout-li">
            {/* Active User Session Card (Clickable for User Profile Modal) */}
            <div 
              className="user-session-badge" 
              onClick={() => setShowProfileModal(true)}
              title="Click to view User Profile & Account Telemetry"
            >
              <div className="user-session-avatar">{userName.charAt(0).toUpperCase()}</div>
              <div className="user-session-info">
                <span className="user-session-name">{userName}</span>
                <span className="user-session-email">{userEmail}</span>
              </div>
            </div>

            <button onClick={handleLogout} className="logout-btn">
              <IoLogOut /> Logout
            </button>
          </li>
        </ul>
      </div>

      {/* USER PROFILE MODAL */}
      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="profile-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setShowProfileModal(false)}>
              <IoClose />
            </button>
            
            <div className="profile-modal-header">
              <div className="profile-avatar-lg">{userName.charAt(0).toUpperCase()}</div>
              <h2>{userName}</h2>
              <p className="profile-email-sub">{userEmail}</p>
              <span className="profile-status-tag"><IoShieldCheckmark /> Verified Investor</span>
            </div>

            <div className="profile-stats-grid">
              <div className="profile-stat-box">
                <span className="stat-label">Watchlist</span>
                <h3 className="stat-val">{watchlistCount} Stocks</h3>
              </div>
              <div className="profile-stat-box">
                <span className="stat-label">Account</span>
                <h3 className="stat-val">Demo Trader</h3>
              </div>
              <div className="profile-stat-box">
                <span className="stat-label">Security</span>
                <h3 className="stat-val" style={{ color: "#22c55e" }}>OTP Active</h3>
              </div>
            </div>

            <div className="profile-actions-row">
              <button 
                className="profile-action-btn primary" 
                onClick={() => { setShowProfileModal(false); navigate("/WatchList"); }}
              >
                <IoStarSharp /> View My Watchlist
              </button>
              <button 
                className="profile-action-btn secondary" 
                onClick={() => { setShowProfileModal(false); navigate("/Help"); }}
              >
                <IoHelpCircle /> Support & FAQs
              </button>
            </div>
          </div>
        </div>
      )}

      <Outlet />
    </>
  );
};

export default Navbar;
