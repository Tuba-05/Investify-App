import React, { useState, useEffect } from 'react';
import "./LoginSignUp.css";
import { useNavigate } from "react-router-dom";
import { HiOutlineMail } from "react-icons/hi";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaUserAlt } from "react-icons/fa";
import { IoAlertCircleOutline } from "react-icons/io5";

const LoginSignUp = () => {
  const navigate = useNavigate();
  const Newpassword = localStorage.getItem("Newpassword") || "false";

  // Auto redirect if user session is already active
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      navigate("/HmPg", { replace: true });
    }
  }, [navigate]);

  const [isLogin, setIsLogin] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });

  const handleInputChange = (e) => {
    setErrorMsg(''); // Clear error message when user starts typing
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";
    setErrorMsg('');

    if (isLogin) {
      if (!formData.email || !formData.password) {
        setErrorMsg("Please fill in both email and password.");
        return;
      }
    } else {
      if (!formData.username || !formData.email || !formData.password) {
        setErrorMsg("Please fill in all fields (username, email, password).");
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Login API Call
        const response = await fetch(`${API_BASE}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            ChangePassword: Newpassword
          })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          localStorage.setItem("userId", data.user.id);
          localStorage.setItem("userName", data.user.name);
          localStorage.setItem("userEmail", data.user.email);
          navigate("/HmPg");
        } else {
          // Specific Valid Error Handling
          if (response.status === 404) {
            setErrorMsg("No account found with this email. Please check your email or Sign Up.");
          } else if (response.status === 401) {
            setErrorMsg("Invalid password. Please check your credentials and try again.");
          } else {
            setErrorMsg(data.message || "Invalid login credentials. Please try again.");
          }
        }
      } else {
        // Signup API Call
        const response = await fetch(`${API_BASE}/api/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password
          })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          localStorage.setItem("userId", data.user.id);
          localStorage.setItem("userName", data.user.name);
          localStorage.setItem("userEmail", data.user.email);
          navigate("/HmPg");
        } else {
          if (response.status === 400) {
            setErrorMsg(data.message || "This email address is already registered. Please Sign In.");
          } else {
            setErrorMsg(data.message || "Failed to create account. Please try again.");
          }
        }
      }
    } catch (error) {
      console.error("Network / Server Error:", error);
      setErrorMsg("Network Error: Unable to connect to backend server. Please make sure server is running.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setErrorMsg('');
    setFormData({
      email: '',
      password: '',
      username: ''
    });
  };

  const trigger_verif_code = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!formData.email) {
      setErrorMsg("Please enter your email address first to reset password.");
      return;
    }
    
    const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

    try {
      const response = await fetch(`${API_BASE}/api/auth/veri-code-fpassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem("userEmail", formData.email);
        navigate("/VeriCode");
      } else {
        setErrorMsg(data.message || "No account found with this email. Please check your email or Sign Up.");
      }
    } catch (err) {
      console.error("Error sending verification code:", err);
      setErrorMsg("Network Error: Failed to send OTP code. Please check your network connection.");
    }
  };

  return (
    <div className="auth-page">
      <div className="background-overlay"></div>
      
      <div className="auth-container">
        <div className="glass-card">
          <div className="card-header">
            <h1 className="auth-title">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="auth-subtitle">
              {isLogin 
                ? 'Sign in to access your investment portfolio' 
                : 'Join thousands of successful investors'
              }
            </p>
          </div>

          {/* Valid Error Alert Banner */}
          {errorMsg && (
            <div className="auth-error-banner">
              <IoAlertCircleOutline className="error-banner-icon" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="auth-form">      
            {!isLogin && (
              <div className="input-group">
                <label htmlFor="username"><FaUserAlt /> Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="glass-input"
                  placeholder="Enter username"
                />
              </div>  
            )}

            <div className="input-group">
              <label htmlFor="email"><HiOutlineMail /> Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="glass-input"
                placeholder="Enter email"
              />
            </div>

            <div className="input-group">
              <label htmlFor="password"><RiLockPasswordLine /> Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="glass-input"
                placeholder="Enter password"
              />
            </div>

            {isLogin && (
              <div className="forgot-password">
                <a href="#" className="forgot-link" onClick={trigger_verif_code}>Forgot your password?</a>
              </div>
            )}

            <button 
              type="button" 
              onClick={handleSubmit} 
              disabled={loading}
              className="glass-button primary"
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'} 
            </button>
          </div>

          <div className="auth-switch">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button" 
                onClick={switchMode} 
                className="switch-button"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div> 
      </div>
    </div>
  );
};

export default LoginSignUp;