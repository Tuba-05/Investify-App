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
          if (data.success && Array.isArray(data.articles)) {
            const mappedNews = data.articles.map((item) => ({
              source: item.source || "Unknown",
              author: item.author || "Unknown",
              description: item.description || "No description available",
              title: item.title || "Untitled",
              url: item.url || "#",
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
      if (dailyNews.length === 0) return; // if daily news array is empty
      const interval = setInterval(() => {  
        setIndex((prev) => (prev + 1) % dailyNews.length); // move to next news (loop back if at end)/
      }, 5000); // 5 mili secs
      return () => clearInterval(interval); // Stop timer when component updates/ remove from screen to prevent memory leaks or duplicate timers
    }, [dailyNews]);
    const current = dailyNews[index] || {}; // Current news item or empty object

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
    { field: "favourite", headerName: "", width: 50, sortable: false, filterable: false,
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
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "80px",
        marginLeft: "150px",
        flexWrap: "wrap", // allows stacking on smaller screens
      }}
    >
      {/* ====================================== WATCH-LIST TABLE ============================================ */}
      <div
        style={{
          width: "45%",
          minWidth: "340px",
          fontFamily: "Montserrat",
          fontSize: "25px",
        }}
      >
        <h2 style={{ marginBottom: 10, fontSize: "45px" }}>📊 Your Watchlist</h2>

        {userName && (
          <p style={{ fontWeight: "600", marginBottom: "15px" }}>
            👤 Logged in as: {userName}
          </p>
        )}

        {loading ? (
          <p style={{ textAlign: "center" }}>Loading watchlist...</p>
        ) : rows.length === 0 ? (
          <p style={{ textAlign: "center" }}>
            No companies in your watchlist yet.
          </p>
        ) : (
          <DataGrid
            style={{
              width: "450px",
              border: "3px solid #34c9b3ff",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 1)",
            }}
            rows={rows}
            columns={columns}
            getRowId={(row) => row._rowId || row.id}
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

      {/* ====================================== DAILY NEWS ============================================ */}
      <div
        style={{
          width: "45%",
          minWidth: "350px",
          background: "white",
          border: "5px solid #34c9b3",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.83)",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "42px", marginBottom: "35px" }}>📰 News Feed</h2>

        <AnimatePresence mode="wait">
          {current && (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 2.0 }}
            >
              <h4>{current.title}</h4>
              <p>
                <strong>Source:</strong> {current.source}
              </p>
              <p>
                <strong>Author:</strong> {current.author}
              </p>
              <p>{current.description}</p>
              <a
                href={current.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#890202ff", textDecoration: "none" }}
              >
                Read more
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </>
);

};

export default WatchList;
