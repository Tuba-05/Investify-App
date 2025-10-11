import React, { useEffect, useState,  } from "react"; 
import { DataGrid } from "@mui/x-data-grid"; // react table library better than simple plain html css
import { IoStarSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence, m } from "framer-motion";


const WatchList = () => {
  // ======================================================================
  // ==================== WATCH LIST TABLE & DAILY NEWS ================================
  // ======================================================================
  const navigate = useNavigate(); // for navigation on row click(C-name) 
  const [rows, setRows] = useState([]); // Stores fetched watchlist data
  const [loading, setLoading] = useState(true); // Loading state
  const [userName, setUserName] = useState("");
  const userId = localStorage.getItem("userId"); // get logged-in user ID
  // State for daily news and current headline index
    const [dailyNews, setDailyNews] = useState([]);
    const [index, setIndex] = useState(0);
  
    // Fetching watchlist & daily news data from Flask API on component mount
    useEffect(() => {
      // If no user ID, skip fetching
      if (!userId) {
        setRows([]);
        setLoading(false);
        return;
      }
      // Fetching daily news data from Flask API
      fetch('http://127.0.0.1:5000/fetch-daily-news', {method: "GET"})
        .then((res) => res.json()) // Waits for server response then res.json()converts raw response into JSON format
        .then((data)=>{
          if(data.success){
            const mappedNews = data.articles.map((item) => ({
              source: item.source,
              author: item.author || "Unknown",
              description: item.description,
              title: item.title,
              url: item.url,
            }));
            setDailyNews(mappedNews);
            console.log("Daily news fetched successfully", data); // for checking purposes
          } 
          else{
            console.error("Failed to fetch daily news");
          }
        });
      // Fetching watchlist data from Flask API
      fetch(`http://127.0.0.1:5000/watchlist/${userId}`)
        .then((res) => res.json()) // Waits for server response then res.json()converts raw response into JSON format
        .then((data) => {
          // If watchlist has entries
          if (data.success) {
            setUserName(data.username);
            const mapped = data.companies.map((item, index) => ({
              id: item.id,   // use real company id from backend
              c_name: item.c_name,
              _rowId: index + 1, // unique id for DataGrid if needed
            }));
            setRows(mapped);
          } else {
            setRows([]);
          }
        })
        .catch((err) => {
          console.error("Error fetching watchlist:", err);
          setRows([]);
        })
        .finally(() => setLoading(false));
    }, [userId]);
  
    // Effect to change news headline every 4 seconds
    useEffect(() => {
      if (dailyNews.length === 0) return;
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % dailyNews.length);
      }, 4000);
      return () => clearInterval(interval);
    }, [dailyNews]);

  // Remove company from watchlist
  const handleToggleWatchlist = (companyId, companyName) => {
    fetch(`http://127.0.0.1:5000/watchlist/${userId}/${companyId}`, {
      method: "POST", // toggle route already supports add/remove
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert(`${companyName} removed from watchlist`);
          setRows((prev) => prev.filter((row) => row.c_name !== companyName)); // remove from local state
        } else {
          alert(data.message);
        }
      })
      .catch((err) => console.error("Error removing from watchlist:", err));
  };
  // Columns definition for DataGrid (User's watchlist only company name and star icon)
  const columns = [
    { field: "c_name", headerName: "Marked Companies", width: 350 , sortable: false, filterable: false,
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
    { field: "favourite", headerName: "", width: 120, sortable: false, filterable: false,
      renderCell: (params) =>(
        <span
          onClick={() => handleToggleWatchlist(params.row.id, params.row.c_name)}
          style={{ cursor: "pointer" }}
        >
          <IoStarSharp style={{ color: "#f5c518", fontSize: 20 }} />
        </span>
      ),
    },
  ];

  return (
    <>
    <div style={{ marginLeft: "210px", width: "105%", height: 600, top: "20px", position: "fixed", 
    fontfamily: 'Montserrat', padding: '20px', fontSize: '25px',}}>
        <h2 style={{ marginBottom: 10,  fontSize: '45px'  }} >📊 Your Watchlist</h2>

        {userName && (
            <p style={{ fontWeight: "600", marginBottom: "15px" }}>
            👤 Logged in as: {userName}
            </p>
        )}
        
        {loading ? (
            <p style={{ textAlign: "center" }}>Loading watchlist...</p>
        ) : rows.length === 0 ? (
            <p style={{ textAlign: "center" }}>No companies in your watchlist yet.</p>
        ) : (

        <DataGrid
            style={{ width:"475px", border: '3px solid #34c9b3ff', boxShadow: '0 4px 8px rgba(0, 0, 0, 1)'}}
            rows={rows}
            columns={columns}
            getRowId={(row) => row._rowId || row.id} // use unique _rowId if exists, else fallback to id
            hideFooterPagination
            autoHeight
            rowHeight={55}
            hideFooter
            sx={{
                fontSize: 22,
                "& .MuiDataGrid-columnHeaders": { fontWeight: "600" },
                "& .MuiDataGrid-row": { backgroundColor: "white" },
            }}
        />
      )}
    </div>
    {/* ====================================== Daily NEWS ============================================ */}
    <h2 style={{ padding: "40px", marginLeft: 900,  fontSize: '42px'  }} >📊 News Feed </h2>
    <div
      style={{
        position: "absolute", right: "100px", top: "120px", width: "500px", height: "450px", overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center", border: "5px solid #34c9b3",
        borderRadius: "12px", background: "white", boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
      }}
    > 
      <AnimatePresence mode="wait"> // ensures only one child is rendered at a time
        <motion.p // animated paragraph for news headlines
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: "18px",
            fontWeight: "500",
            textAlign: "center",
            padding: "10px",
            color: "#033e3a",
          }}
        >
          {dailyNews[index]} {/* Display current news */}
        </motion.p>
      </AnimatePresence>
    </div>
    </>
  );
};

export default WatchList;
