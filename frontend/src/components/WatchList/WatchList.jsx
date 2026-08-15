import React, { useEffect, useState } from "react"; 
import { DataGrid } from "@mui/x-data-grid";
import { IoStarSharp, IoChevronBack, IoChevronForward, IoNewspaper, IoStatsChart } from "react-icons/io5";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./WatchList.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

const WatchList = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const sessionUserName = localStorage.getItem("userName") || "Investor";
  const [userName, setUserName] = useState(sessionUserName);
  const userId = localStorage.getItem("userId");
  
  const [dailyNews, setDailyNews] = useState([]);
  const [index, setIndex] = useState(0);

  // Fetching watchlist & daily news data from Flask API
  useEffect(() => {
    if (!userId) {
      setRows([]);
      setLoading(false);
      return;
    }

    // Fetch live Tech & Finance news
    fetch(`${API_BASE}/api/news/fetch-daily-news`, { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.articles)) {
          const mappedNews = data.articles.map((item) => ({
            source: item.source || "Financial Desk",
            author: item.author || "Tech Reporter",
            description: item.description || "No detailed description available.",
            title: item.title || "Latest Market Update",
            url: item.url || "#",
          }));
          setDailyNews(mappedNews);
        }
      })
      .catch((err) => console.error("Error fetching live news:", err));

    // Fetch user watchlist
    fetch(`${API_BASE}/api/watchlist/watchlist/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const activeName = localStorage.getItem("userName") || data.username || "Investor";
          setUserName(activeName);
          const mapped = data.companies.map((item, idx) => ({
            id: item.id,
            c_name: item.c_name,
            _rowId: idx + 1,
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

  // Auto slide news every 6 seconds
  useEffect(() => {
    if (dailyNews.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % dailyNews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [dailyNews]);

  const nextArticle = () => {
    if (dailyNews.length === 0) return;
    setIndex((prev) => (prev + 1) % dailyNews.length);
  };

  const prevArticle = () => {
    if (dailyNews.length === 0) return;
    setIndex((prev) => (prev - 1 + dailyNews.length) % dailyNews.length);
  };

  // Remove company from watchlist
  const handleToggleWatchlist = (companyId, companyName) => {
    fetch(`${API_BASE}/api/watchlist/watchlist/${userId}/${companyId}`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRows((prev) => prev.filter((row) => row.c_name !== companyName));
        } else {
          alert(data.message);
        }
      })
      .catch((err) => console.error("Error removing from watchlist:", err));
  };

  const columns = [
    { 
      field: "c_name", 
      headerName: "Marked Companies", 
      flex: 1, 
      sortable: false, 
      filterable: false,
      renderCell: (params) => (
        <span
          className="company-link"
          onClick={() => navigate(`/CmpFS/${params.row.id}`)}
        >
          {params.value}
        </span>
      )
    },
    { 
      field: "favourite", 
      headerName: "Remove", 
      width: 90, 
      sortable: false, 
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <span
          className="clean-star-wrapper"
          title="Remove from Watchlist"
          onClick={() => handleToggleWatchlist(params.row.id, params.row.c_name)}
        >
          <IoStarSharp className="gold-star-icon" />
        </span>
      )
    },
  ];

  const current = dailyNews[index] || {};

  return (
    <div className="watchlist-container">
      {/* WATCHLIST TABLE CARD */}
      <div className="watchlist-card">
        <div className="section-header">
          <h2 className="section-title">
            <IoStatsChart /> Your Watchlist
          </h2>
          {userName && (
            <span className="user-badge">
              👤 User: {userName} • ({rows.length} Saved)
            </span>
          )}
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: "#94a3b8", padding: "30px" }}>Loading Watchlist...</p>
        ) : rows.length === 0 ? (
          <div className="empty-watchlist">
            <p>No bookmarked companies in your watchlist yet.</p>
            <Link to="/StockList" className="browse-btn">
              Browse StockList to Add Companies
            </Link>
          </div>
        ) : (
          <DataGrid
            className="watchlist-datagrid"
            rows={rows}
            columns={columns}
            getRowId={(row) => row._rowId || row.id}
            hideFooterPagination
            autoHeight
            rowHeight={55}
            hideFooter
          />
        )}
      </div>

      {/* LIVE NEWS FEED CARD */}
      <div className="news-card">
        <div className="news-header-wrapper">
          <h2 className="section-title">
            <IoNewspaper /> News Feed
          </h2>
          <span className="live-news-badge">
            <span className="live-dot"></span> LIVE TECH & FINANCE
          </span>
        </div>

        {dailyNews.length === 0 ? (
          <p style={{ textAlign: "center", color: "#94a3b8", padding: "40px" }}>Loading live headlines...</p>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="news-card-content"
            >
              <div>
                <div className="news-meta-row">
                  <span className="news-source-tag">{current.source}</span>
                  <span className="news-author-tag">By {current.author}</span>
                </div>

                <h3 className="news-article-title">{current.title}</h3>
                <p className="news-article-desc">{current.description}</p>
              </div>

              <div className="news-actions-row">
                <a
                  href={current.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="read-article-btn"
                >
                  Read Full Article ↗
                </a>

                <div className="news-nav-controls">
                  <button className="news-nav-btn" onClick={prevArticle} title="Previous Headline">
                    <IoChevronBack />
                  </button>
                  <span className="article-counter">{index + 1} / {dailyNews.length}</span>
                  <button className="news-nav-btn" onClick={nextArticle} title="Next Headline">
                    <IoChevronForward />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default WatchList;
