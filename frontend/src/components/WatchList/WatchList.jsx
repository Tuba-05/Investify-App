import React, { useEffect, useState } from "react"; 
import { DataGrid } from "@mui/x-data-grid"; // react table library better than simple plain html css
import { IoStarSharp } from "react-icons/io5";

const WatchList = () => {
  const [rows, setRows] = useState([]); // Stores fetched watchlist data
  const [loading, setLoading] = useState(true); // Loading state
  const [userName, setUserName] = useState("");
  const userId = localStorage.getItem("userId"); // get logged-in user ID

  useEffect(() => {
    // If no user ID, skip fetching
    if (!userId) {
      setRows([]);
      setLoading(false);
      return;
    }
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
      .finally(() => setLoading(false)); // stop loading spinner
  }, [userId]);

  // Remove company from watchlist
  const handleToggleWatchlist = (companyId, companyName) => {
    fetch(`http://127.0.0.1:5000/watchlist/${userId}/${companyId}`, {
      method: "POST", // toggle route already supports add/remove
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert(`${companyName} removed from watchlist`);
          setRows((prev) => prev.filter((row) => row.c_name !== companyName));
        } else {
          alert(data.message);
        }
      })
      .catch((err) => console.error("Error removing from watchlist:", err));
  };
  // Columns definition for DataGrid (User's watchlist only company name and star icon)
  const columns = [
    { field: "c_name", headerName: "Company", width: 300 },
    { field: "favourite", headerName: "Favourites", width: 130,
      sortable: false, filterable: false,
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
    <div style={{ marginLeft: "230px", width: "95%", height: 560, top: "20px", position: "fixed", fontfamily: 'Montserrat' }}>
        <h2 style={{ marginBottom: 10 }}>📊 My Watchlist</h2>

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
            style={{ width:"700px"}}
            rows={rows}
            columns={columns}
            getRowId={(row) => row._rowId || row.id} // use unique _rowId if exists, else fallback to id
            pageSizeOptions={[5, 10]}
            initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
            rowHeight={54}
            sx={{
                fontSize: 14,
                "& .MuiDataGrid-columnHeaders": { fontWeight: "600" },
                "& .MuiDataGrid-row": { backgroundColor: "white" },
            }}
        />
      )}
    </div>
  );
};

export default WatchList;
