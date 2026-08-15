import React, { useState, useEffect, useCallback } from 'react';
import VCimg from '../../assets/vericode.png';
import { useNavigate } from 'react-router-dom';
import { IoTimer, IoRefresh, IoCheckmarkCircle, IoAlertCircle, IoLockClosed } from 'react-icons/io5';

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

const VeriCode = () => {
    const userEmail = localStorage.getItem('userEmail');
    const [veriCode, setVeriCode] = useState("");
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes (120s)
    const [isExpired, setIsExpired] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    // 🕒 120-Second Live Countdown Timer Logic
    useEffect(() => {
        if (timeLeft <= 0) {
            setIsExpired(true);
            setStatusMsg({ type: 'error', text: '⏰ Verification code has EXPIRED! Click "Resend Code" to get a new one.' });
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // Format Seconds to MM:SS (e.g. 01:45)
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // 🔄 Generate & Resend Fresh Code
    const generate_code = useCallback((e) => {
        if (e) e.preventDefault();
        if (!userEmail) return;

        setIsSending(true);
        setStatusMsg({ type: 'info', text: 'Sending new 6-digit OTP code to your email...' });

        fetch(`${API_BASE}/api/auth/veri-code-fpassword`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: userEmail })
        })
        .then((res) => res.json())
        .then((data) => {
            setIsSending(false);
            if (data.success) {
                setTimeLeft(120); // Reset 2-min timer
                setIsExpired(false);
                setVeriCode("");
                setStatusMsg({ type: 'success', text: '✅ Fresh OTP verification code sent to your email!' });
            } else {
                setStatusMsg({ type: 'error', text: data.message || 'Failed to generate code.' });
            }
        })
        .catch((err) => {
            setIsSending(false);
            console.error("Error generating code:", err);
            setStatusMsg({ type: 'error', text: 'Network Error: Unable to connect to backend server.' });
        });
    }, [userEmail]);

    // 🔐 Verify Submitted OTP Code
    const handleSubmit = (e) => {
        if (e) e.preventDefault();

        if (isExpired) {
            setStatusMsg({ type: 'error', text: '⏰ Code has expired! Please click "Resend Code" to get a new OTP.' });
            return;
        }

        if (!veriCode || veriCode.trim().length === 0) {
            setStatusMsg({ type: 'error', text: 'Please enter your 6-character verification code.' });
            return;
        }

        fetch(`${API_BASE}/api/auth/check-veri-code`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: userEmail,
                veriCode: veriCode.trim()
            })
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                localStorage.setItem("Newpassword", "true");
                setStatusMsg({ type: 'success', text: '🎉 Code verified! Redirecting to login...' });
                setTimeout(() => navigate("/"), 1200);
            } else {
                if (data.expired) {
                    setIsExpired(true);
                    setTimeLeft(0);
                }
                setStatusMsg({ type: 'error', text: data.message || 'Invalid Verification Code.' });
            }
        })
        .catch((err) => {
            console.error("Error verifying code:", err);
            setStatusMsg({ type: 'error', text: 'Network Error: Unable to connect to server.' });
        });
    };

    // Run once on load
    useEffect(() => {
        if (!userEmail) {
            alert("No email provided. Please enter your email on the login page.");
            navigate("/");
        }
    }, [userEmail, navigate]);

    return (
        <div style={{
            height: '86vh',
            width: 'calc(100vw - 260px)',
            marginLeft: '230px',
            marginTop: '30px',
            padding: '30px',
            borderRadius: '20px',
            boxSizing: 'border-box',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '2px solid rgba(28, 181, 171, 0.4)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(28, 181, 171, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '40px',
            color: '#f8fafc',
            fontFamily: 'Inter, sans-serif'
        }}>
            {/* Left Column: Form & Timer */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                maxWidth: '520px'
            }}>
                <div>
                    <h2 style={{
                        fontSize: '2rem',
                        fontWeight: '800',
                        color: '#1cb5ab',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '8px'
                    }}>
                        <IoLockClosed /> Security OTP Verification
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.5' }}>
                        We sent a 6-character security code to <strong style={{ color: '#cbd5e1' }}>{userEmail}</strong>. 
                        Please enter the code below to reset your password.
                    </p>
                </div>

                {/* Live Countdown Timer Badge */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 20px',
                    borderRadius: '12px',
                    background: isExpired 
                        ? 'rgba(239, 68, 68, 0.15)' 
                        : 'rgba(28, 181, 171, 0.12)',
                    border: `1.5px solid ${isExpired ? '#ef4444' : '#1cb5ab'}`,
                    transition: 'all 0.3s ease'
                }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: '600', color: isExpired ? '#f87171' : '#5eead4' }}>
                        <IoTimer style={{ fontSize: '1.3rem' }} /> 
                        {isExpired ? 'Code Status:' : 'Code Valid For:'}
                    </span>
                    <span style={{
                        fontSize: '1.3rem',
                        fontWeight: '800',
                        letterSpacing: '1px',
                        color: isExpired ? '#ef4444' : '#1cb5ab',
                        fontFamily: 'monospace'
                    }}>
                        {isExpired ? 'EXPIRED (00:00)' : formatTime(timeLeft)}
                    </span>
                </div>

                {/* Status / Error Alert Banner */}
                {statusMsg.text && (
                    <div style={{
                        padding: '12px 16px',
                        borderRadius: '10px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: statusMsg.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : statusMsg.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                        color: statusMsg.type === 'error' ? '#fca5a5' : statusMsg.type === 'success' ? '#86efac' : '#93c5fd',
                        border: `1px solid ${statusMsg.type === 'error' ? '#ef4444' : statusMsg.type === 'success' ? '#22c55e' : '#3b82f6'}`
                    }}>
                        {statusMsg.type === 'error' ? <IoAlertCircle style={{ fontSize: '1.2rem', flexShrink: 0 }} /> : <IoCheckmarkCircle style={{ fontSize: '1.2rem', flexShrink: 0 }} />}
                        {statusMsg.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#cbd5e1' }}>
                            ENTER 6-CHARACTER OTP CODE
                        </label>
                        <input
                            type="text"
                            maxLength={6}
                            value={veriCode}
                            onChange={(e) => setVeriCode(e.target.value)}
                            placeholder="e.g. A9B2X7"
                            disabled={isExpired}
                            required
                            style={{
                                width: '100%',
                                padding: '14px 18px',
                                borderRadius: '12px',
                                background: 'rgba(15, 23, 42, 0.8)',
                                border: isExpired ? '2px solid #ef4444' : '2px solid rgba(28, 181, 171, 0.5)',
                                color: '#ffffff',
                                fontSize: '1.4rem',
                                fontWeight: '800',
                                letterSpacing: '4px',
                                textAlign: 'center',
                                outline: 'none',
                                boxSizing: 'border-box',
                                transition: 'all 0.3s ease',
                                opacity: isExpired ? 0.6 : 1
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '14px' }}>
                        <button
                            type="submit"
                            disabled={isExpired}
                            style={{
                                flex: 1,
                                padding: '14px',
                                borderRadius: '12px',
                                background: isExpired ? '#475569' : 'linear-gradient(135deg, #1cb5ab, #13877f)',
                                color: '#ffffff',
                                border: 'none',
                                fontWeight: '700',
                                fontSize: '1rem',
                                cursor: isExpired ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s ease',
                                opacity: isExpired ? 0.6 : 1,
                                boxShadow: isExpired ? 'none' : '0 4px 15px rgba(28, 181, 171, 0.4)'
                            }}
                        >
                            Verify OTP Code
                        </button>

                        <button
                            type="button"
                            onClick={generate_code}
                            disabled={isSending}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                padding: '14px 20px',
                                borderRadius: '12px',
                                background: 'rgba(51, 65, 85, 0.8)',
                                color: '#38bdf8',
                                border: '1.5px solid rgba(56, 189, 248, 0.4)',
                                fontWeight: '700',
                                fontSize: '0.95rem',
                                cursor: isSending ? 'wait' : 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <IoRefresh className={isSending ? 'spin' : ''} />
                            {isSending ? 'Sending...' : 'Resend Code'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Right Column: Illustration */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                maxHeight: '100%',
                overflow: 'hidden'
            }}>
                <img 
                    src={VCimg} 
                    alt="Security Verification" 
                    style={{
                        maxWidth: '100%',
                        maxHeight: '480px',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.5))'
                    }}
                />
            </div>
        </div>
    );
};

export default VeriCode;