import React, { useEffect, useState } from 'react'; // for fetching data from Flask API and storing in state
import { useNavigate } from "react-router-dom" // for navigation on row click(C-name)
import { DataGrid } from "@mui/x-data-grid"; // react table library better than simple plain html css
import { IoStarSharp } from "react-icons/io5"; // star icon to add favourites in watchlist


const StockList = () => {
    const navigate = useNavigate(); // for navigation on row click(C-name)
    const [starredRows, setStarredRows] = useState([]); // store company IDs that are starred
    const [companies, setCompanies] = useState([]); // Stores fetched company data
    // Fetching data from Flask API
    useEffect(() => {
      const userId = localStorage.getItem("userId");
      // Fetch all companies + user's watchlist to mark starred companies
      fetch("http://127.0.0.1:5000/companies")  
      .then((res) => res.json()) // Waits for server response then res.json()converts raw response into JSON format
      // data is array of companies, setCompanies(data) saves it into React state so table can update
      .then((data) => { 
          console.log("Fetched companies:", data); // log fetched data for debugging
          setCompanies(data); 
      })
      .catch((err) => console.error("Error fetching companies:", err)); // handle errors

      // Fetch user's watchlist
      fetch(`http://127.0.0.1:5000/watchlist/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("User watchlist:", data); // log watchlist data for debugging
        // If fetch successful and companies array exists
        if (data.success && Array.isArray(data.companies)) {
        // extract company IDs from watchlist
        const watchlistIds = data.companies.map((c) => c.id);
        setStarredRows(watchlistIds);
        }
      })
      .catch((err) => console.error("Error fetching watchlist:", err)); // handle errors
    }, []);

    // Columns definition for DataGrid
    const columns = [
    { field: "favourite", headerName: "Favourites", width: 105,
      sortable: false, filterable: false,
      renderCell: (params) => {
        const isStarred = starredRows.includes(params.row.id); // check if this row's company ID is in starredRows
        // Toggle watchlist status on star icon click
        const handleToggleWatchlist = () => {
          const userId = localStorage.getItem("userId"); // get logged-in user ID
          const companyId = params.row.id; // company ID from the row
          // Call backend to add/remove from watchlist
          fetch(`http://127.0.0.1:5000/watchlist/${userId}/${companyId}`, {
            method: "POST",
          })
            .then((res) => res.json())
            .then((data) => {
              // If backend confirms success
              if (data.success) {
                // If added to watchlist, show alert and update starredRows state
                if (data.action === "added") {
                  alert(`${params.row.c_name} successfully added to your watchlist`);
                  setStarredRows((prev) => [...prev, companyId]);
                } // If removed from watchlist, show alert and update starredRows state 
                else if (data.action === "removed") {
                  alert(`${params.row.c_name} removed from your watchlist`);
                  setStarredRows((prev) => prev.filter((id) => id !== companyId));
                }
              } // If backend returns an error message 
              else {
                alert(data.message);
              }
            })
            .catch((err) => console.error("Error toggling watchlist:", err));
        };
        return (
          <span onClick={handleToggleWatchlist} style={{ cursor: "pointer" }}>
            <IoStarSharp
              style={{
                color: isStarred ? "#f5c518ff" : "#ccc",
                fontSize: 22,
              }}
            />
          </span>
        );
      }, 
    },
    { field: "id", headerName: "Rank", width: 110 },
    // Clickable company name to navigate to CmpFS page
    { field: "c_name", headerName: "Company", width: 215, 
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
    <div  style={{ height: 640, width: 1260, position:'fixed',
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