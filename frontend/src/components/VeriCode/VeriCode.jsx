import {React, useState, useEffect } from 'react'; //useEffect
import VCimg from '../../assets/vericode.png'
import { useNavigate } from 'react-router-dom';

const VeriCode = () => {
    const userEmail = localStorage.getItem('userEmail')
    const [VeriCode, setVeriCode] = useState("")
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://127.0.0.1:5000/veri-code-fpassword' , 
            {method: 'POST', headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email : userEmail
            })
        })
    })
    const handleSubmit = () =>{
        fetch(`http://127.0.0.1:5000/check-veri-code`, 
            {method: 'POST', headers: { "Content-Type": "application/json" },
             body: JSON.stringify({
                email : userEmail,
                veriCode : VeriCode
            })
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.success){
                alert(data.message); // code verified
                localStorage.setItem("Newpassword", "true" );
                navigate("/"); // navigate to login page
            }
            else {
                alert(data.message); // wrong code
            }   
        })
    }
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
        <form onClick={handleSubmit} 
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
        />
        <button type="submit" 
        style={{
            border: '2.5px solid #e21313ff', borderRadius:'10px', width: '120px'
        }}
        >Verify</button>
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