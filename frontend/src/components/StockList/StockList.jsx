import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { IoStarSharp, IoTrendingUp, IoSearch, IoRefresh } from "react-icons/io5";
import "./StockList.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

const StockList = () => {
  const navigate = useNavigate();
  const [starredRows, setStarredRows] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStockList = () => {
    setRefreshing(true);
    fetch(`${API_BASE}/api/companies/companies`)  
      .then((res) => res.json())
      .then((data) => { 
        if (Array.isArray(data)) {
          setCompanies(data);
        }
      })
      .catch((err) => console.error("Error fetching companies:", err))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    fetchStockList();

    // Auto-refresh quotes and re-sort ranks every 5 minutes (300000ms)
    const interval = setInterval(() => {
      fetchStockList();
    }, 300000);

    // Fetch user's watchlist to highlight starred companies
    if (userId) {
      fetch(`${API_BASE}/api/watchlist/watchlist/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.companies)) {
            const watchlistIds = data.companies.map((c) => c.id);
            setStarredRows(watchlistIds);
          }
        })
        .catch((err) => console.error("Error fetching watchlist:", err));
    }

    return () => clearInterval(interval);
  }, []);

  const filteredCompanies = companies.filter((c) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      (c.c_name && c.c_name.toLowerCase().includes(term)) ||
      (c.symbol && c.symbol.toLowerCase().includes(term)) ||
      (c.sector && c.sector.toLowerCase().includes(term)) ||
      (c.country && c.country.toLowerCase().includes(term))
    );
  });

  const columns = [
    { 
      field: "favourite", 
      headerName: "★", 
      width: 70,
      sortable: false, 
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const isStarred = starredRows.includes(params.row.id);
        
        const handleToggleWatchlist = (e) => {
          e.stopPropagation();
          const userId = localStorage.getItem("userId");
          const companyId = params.row.id;
          if (!userId) {
            alert("Please log in to add companies to your watchlist");
            return;
          }

          fetch(`${API_BASE}/api/watchlist/watchlist/${userId}/${companyId}`, {
            method: "POST",
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.success) {
                if (data.action === "added") {
                  setStarredRows((prev) => [...prev, companyId]);
                } else if (data.action === "removed") {
                  setStarredRows((prev) => prev.filter((id) => id !== companyId));
                }
              }
            })
            .catch((err) => console.error("Error toggling watchlist:", err));
        };

        return (
          <span 
            className="star-action-btn"
            title={isStarred ? "Remove from Watchlist" : "Add to Watchlist"}
            onClick={handleToggleWatchlist}
          >
            <IoStarSharp className={isStarred ? "star-icon-gold" : "star-icon-grey"} />
          </span>
        );
      }, 
    },
    { 
      field: "rank", 
      headerName: "Rank", 
      width: 90, 
      align: "center", 
      headerAlign: "center",
      renderCell: (params) => <span style={{ fontWeight: "700", color: "#1cb5ab" }}>#{params.value || params.row.id}</span>
    },
    { 
      field: "c_name", 
      headerName: "Company", 
      flex: 1.2, 
      minWidth: 200,
      renderCell: (params) => (
        <span
          className="stock-company-link" 
          onClick={() => navigate(`/CmpFS/${params.row.id}`)}
        >
          {params.value}
        </span>
      )
    },
    { field: "symbol", headerName: "Symbol", width: 120 },
    { field: "country", headerName: "Country", width: 130 },
    { 
      field: "price_usd", 
      headerName: "Price (USD)", 
      width: 140,
      valueFormatter: (value) => value ? `$${Number(value).toFixed(2)}` : "N/A"
    },
    { field: "market_cap", headerName: "Market Cap", flex: 1, minWidth: 160 },
    { field: "sector", headerName: "Sector", flex: 1, minWidth: 140 }
  ];

  return (
    <div className="stocklist-container">
      <div className="stocklist-card">
        <div className="stocklist-header">
          <h2><IoTrendingUp /> Listed Companies</h2>

          {/* LIVE SEARCH INPUT BAR */}
          <div className="stock-search-wrapper">
            <IoSearch className="search-icon-svg" />
            <input
              type="text"
              placeholder="Search company, symbol, or sector..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button 
              className="refresh-ranks-btn" 
              onClick={fetchStockList}
              disabled={refreshing}
              title="Re-sort companies by live market cap"
            >
              <IoRefresh className={refreshing ? "spin-icon" : ""} /> {refreshing ? "Updating..." : "Live Ranks"}
            </button>

            <span className="stock-count-badge">
              {filteredCompanies.length} / {companies.length} Companies
            </span>
          </div>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: "#94a3b8", padding: "40px" }}>Loading Stock Market Companies & Live Ranks...</p>
        ) : (
          <DataGrid
            className="stocklist-datagrid"
            rows={filteredCompanies}
            columns={columns}
            rowHeight={52}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
              sorting: { sortModel: [{ field: "rank", sort: "asc" }] },
            }}
            pageSizeOptions={[10, 25, 50]}
            autoHeight
          />
        )}
      </div>
    </div>
  );
};

export default StockList;