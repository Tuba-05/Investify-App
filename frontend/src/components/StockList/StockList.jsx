import React, { useEffect, useState } from 'react'; // for fetching data from Flask API and storing in state
import { useNavigate } from "react-router-dom" // for navigation on row click(C-name)
import { DataGrid } from "@mui/x-data-grid"; // react table library better than simple plain html css



const StockList = () => {
    const navigate = useNavigate(); // for navigation on row click(C-name)
    const [companies, setCompanies] = useState([]); // Stores fetched company data
    // Fetching data from Flask API
    useEffect(() => {
        fetch("http://127.0.0.1:5000/companies")  // Flask API returning JSON
        .then((res) => res.json()) // Waits for server response then res.json()converts raw response into JSON format
        // data is array of companies, setCompanies(data) saves it into React state so table can update
        .then((data) => { 
            console.log("Fetched companies:", data);
            setCompanies(data);
        })
        .catch((err) => console.error("Error fetching companies:", err)); // handle errors
    }, []);

    // Columns definition for DataGrid
    const columns = [
    { field: "id", headerName: "Rank", width: 115 },
    // Clickable company name to navigate to CmpFS page
    { field: "c_name", headerName: "Company", width: 205, 
      renderCell: (params) => {
        return(
            <span
            style={{ color: "#033e3aff", cursor: "pointer" }} 
            onClick={() => navigate(`/CmpFS/${params.row.id}`)} // Navigate to CmpFS page with company ID
            >
            {params.value}
            </span>
        );
      }
    },
    { field: "symbol", headerName: "Symbol", width: 135 },
    { field: "country", headerName: "Country", width: 145 },
    { field: "price_usd", headerName: "Price (USD)", width: 175 },
    { field: "market_cap", headerName: "Market Cap", width: 200 },
    { field: "sector", headerName: "Sector", width: 125 }
    ];

    return (
    <>
    <div  style={{ height: 640, width: 1150, position:'fixed',
          /*m-l for not mixing with navbar, t&l for placing of DataGrid div*/
          marginLeft: "160px",top:'20px', left:'120px', padding:'10px', overflow: 'hidden',
          /*styling of DataGrid div*/
          border:'5px solid #1cb5abff', borderRadius:'19px', boxSizing:'border-box', 
          /* Glassmorphism effect */
          background: 'rgba(255, 255, 255, 0.15)',   // transparent white
          backdropFilter: 'blur(10px)',              // frosted glass blur
          WebkitBackdropFilter: 'blur(10px)',        // Safari support
          /* Shadow on all sides , r-l-b-t */
          boxShadow:'10px 0 15px rgba(62, 59, 59, 1),-10px 0 15px rgba(62, 60, 60, 1), 0 10px 15px rgba(0,0,0,0.25), 0 -10px 15px rgba(0,0,0,0.25)'    
          }} 
          className='data-table'>
            
        {/* DataGrid component from MUI for displaying all companies data from DB */}
        <DataGrid
          rows={companies}
          columns={columns}
          rowHeight={50}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[10]}
          sx={{
            fontSize: 16,
            fontWeight: 540,
            color: "#021413ff",
            border: "2px solid #16988fff",
            boxSizing: "border-box",  
            
            "& .MuiDataGrid-columnHeaders":{
              fontSize: 18, fontWeight: 'bolder', 
              color: '#000000ff'  
            },

            "& .MuiDataGrid-row": {
            backgroundColor: "rgba(255, 255, 255, 1)",
            },
          }}
        />      
    </div>
    </>
  )
};

export default StockList;