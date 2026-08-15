import {React, useState, useEffect, useCallback } from 'react'; //useEffect
import VCimg from '../../assets/vericode.png'
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

const VeriCode = () => {
    const userEmail = localStorage.getItem('userEmail');
    const [VeriCode, setVeriCode] = useState("");
    const navigate = useNavigate();

    const generate_code = useCallback((e) => {
        if (e) e.preventDefault();
        if (!userEmail) return;
        fetch(`${API_BASE}/api/auth/veri-code-fpassword` , 
            {method: 'POST', headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email : userEmail
            })
        })
        .then((res) => res.json())
        .catch((err) => console.error("Error generating code:", err));
    }, [userEmail]);
    
    const handleSubmit = (e) =>{
        if (e) e.preventDefault();
        fetch(`${API_BASE}/api/auth/check-veri-code`, 
            {method: 'POST', headers: { "Content-Type": "application/json" },
             body: JSON.stringify({
                email : userEmail,
                veriCode : VeriCode
            })
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.success){
                localStorage.setItem("Newpassword", "true" );
                navigate("/"); // navigate directly to login page without alert popup
            }
            else {
                alert(data.message); // wrong code alert
            }   
        })
        .catch((err) => console.error("Error verifying code:", err));
    }

    // ✅ Run once when page loads
    useEffect(() => {
        if (!userEmail) {
            alert("No email provided. Please enter your email on the login page.");
            navigate("/");
        }
    }, [userEmail, navigate]);
  return (
    <div style={{ height: 640, width: 1260, position:'fixed', fontfamily: 'Montserrat',
          /*m-l for not mixing with navbar, t&l for placing of DataGrid div*/
          marginLeft: "130px",top:'22px', padding:'10px', overflow: 'hidden',
          /*styling of DataGrid div*/
          border:'7px solid #1cb5abff', borderRadius:'19px', boxSizing:'border-box', 
          /* Glassmorphism effect */
          background: 'rgba(212, 94, 4, 0.15)',   // transparent white
          backdropFilter: 'blur(10px)',              // frosted glass blur
          WebkitBackdropFilter: 'blur(10px)',        // Safari support
          /* Shadow on all sides , r-l-b-t */
          boxShadow:'10px 0 15px rgba(62, 59, 59, 1),-10px 0 15px rgba(62, 60, 60, 1), 0 10px 15px rgba(0,0,0,0.25), 0 -10px 15px rgba(0,0,0,0.25)'    
          , flexWrap: 'wrap', display: 'flex',  justifyContent: 'center',
        }}
    >
        <form onSubmit={handleSubmit} 
            style={{
            fontWeight: '600', fontSize:'35px',  padding: '20px', display: 'flex', 
            alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
            gap: '15px'
        }}>
        <label htmlFor="veriCode">Enter Verification Code:</label> 
        <input
            type="text" // or "number" if it’s digits only
            maxLength={6}
            id="veriCode"
            value={VeriCode}
            onChange={(e) => setVeriCode(e.target.value)}
            placeholder="Enter here "
            required
            style={{
                border: '2.5px solid #c49b09ff',
            }}
        />
        <div style={{ display: 'flex', flexDirection:'column', gap: '10px' 
            }}
        >
        <button type="button" onClick={generate_code}
        style={{
            border: '2.5px solid #e21313ff', borderRadius:'30px', width: '280px', 
        }}
        >Generate Code</button>
        <button type="submit"
        style={{
            border: '2.5px solid #049d3cff', borderRadius:'30px', width: '120px',
        }}
        >Verify</button>
        </div>
        </form>
        <div>
            <img src={VCimg} alt="" 
            style={{
                width: '100%', height: '90vh'
            }}
            />
        </div>
    </div>
  )
}

export default VeriCode