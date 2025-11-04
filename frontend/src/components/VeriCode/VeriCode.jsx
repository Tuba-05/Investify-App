import {React, useState, useEffect} from 'react';
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
          marginLeft: "160px",top:'22px', left:'65px', padding:'10px', overflow: 'hidden',
          /*styling of DataGrid div*/
          border:'5px solid #1cb5abff', borderRadius:'19px', boxSizing:'border-box', 
          /* Glassmorphism effect */
          background: 'rgba(255, 255, 255, 0.15)',   // transparent white
          backdropFilter: 'blur(10px)',              // frosted glass blur
          WebkitBackdropFilter: 'blur(10px)',        // Safari support
          /* Shadow on all sides , r-l-b-t */
          boxShadow:'10px 0 15px rgba(62, 59, 59, 1),-10px 0 15px rgba(62, 60, 60, 1), 0 10px 15px rgba(0,0,0,0.25), 0 -10px 15px rgba(0,0,0,0.25)'    
          }}
    >
    <form onSubmit={handleSubmit}>
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
      <button type="submit" >Verify</button>
    </form>
    </div>
  )
}

export default VeriCode