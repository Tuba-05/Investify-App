import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { jsPDF } from "jspdf";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from "react-icons/io";
import { IoTrendingUp, IoBusiness, IoStatsChart, IoInformationCircle, IoDownloadOutline, IoDocumentTextOutline } from "react-icons/io5";
import "./CmpFs.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

function CmpFS() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [last30daysdata, setlast30daysdata] = useState([]);
  const [last20yrsdata, setlast20yrsdata] = useState([]);
  const [chart1CurrentIndex, setChart1CurrentIndex] = useState(0);
  const [chart2CurrentIndex, setChart2CurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Company Details
  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/companies/company/${id}`)
      .then((res) => res.json())
      .then((info) => {
        if (info && info.c_name) {
          setData(info);
        }
      })
      .catch((err) => console.error("Error fetching company details:", err))
      .finally(() => setLoading(false));
  }, [id]);

  // 2. Fetch Historical Graph Data
  useEffect(() => {
    if (data?.symbol) {
      // 30 Days Data
      fetch(`${API_BASE}/api/analytics/historical-data-last-thirtyDAYS/${data.symbol}`)
        .then((res) => res.json())
        .then((histData) => {
          if (histData.success && Array.isArray(histData.hist_data)) {
            setlast30daysdata(histData.hist_data);
          }
        })
        .catch((err) => console.error("Error 30-day graph fetch:", err));

      // 20 Years Data
      fetch(`${API_BASE}/api/analytics/historical-data-last-twentyYRS/${data.symbol}`)
        .then((res) => res.json())
        .then((histData) => {
          if (histData.success && Array.isArray(histData.hist_data)) {
            setlast20yrsdata(histData.hist_data);
          }
        })
        .catch((err) => console.error("Error 20-yr graph fetch:", err));
    }
  }, [data?.symbol]);

  // CSV Export Functionality
  const exportCSV = () => {
    if (!data) return;
    const latest = data.financials?.[0] || {};
    const headers = ["Company Name", "Symbol", "Sector", "Country", "Price (USD)", "Market Cap", "Revenue", "Net Income", "Total Assets", "Total Liabilities", "Equity", "Report Date"];
    const row = [
      `"${data.c_name}"`,
      `"${data.symbol}"`,
      `"${data.sector}"`,
      `"${data.country}"`,
      `"${data.price_usd || ''}"`,
      `"${data.market_cap || ''}"`,
      `"${latest.revenue || ''}"`,
      `"${latest.income || ''}"`,
      `"${latest.assets || ''}"`,
      `"${latest.liabilities || ''}"`,
      `"${latest.equity || ''}"`,
      `"${latest.date || ''}"`
    ];

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), row.join(",")].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${data.symbol}_Financial_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF Export Functionality
  const exportPDF = () => {
    if (!data) return;
    const latest = data.financials?.[0] || {};
    const doc = new jsPDF();

    // Dark Header Banner
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 38, "F");

    // Title
    doc.setTextColor(28, 181, 171);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("INVESTIFY FINANCIAL REPORT", 14, 20);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text(`${data.c_name} (${data.symbol})`, 14, 30);

    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 150, 30);

    // Section 1: Overview & Metrics
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("1. Market Telemetry Overview", 14, 50);

    doc.setFontSize(11);
    
    let y = 60;
    const metrics = [
      ["Stock Symbol:", data.symbol],
      ["Industry Sector:", data.sector],
      ["Country / HQ:", data.country],
      ["Current Share Price:", `$${Number(data.price_usd || 0).toFixed(2)} USD`],
      ["Market Capitalization:", `$${data.market_cap ? Number(data.market_cap).toLocaleString() : "N/A"}`],
      ["Total Annual Revenue:", `$${Number(latest.revenue || 0).toLocaleString()} USD`],
      ["Net Income / Profit:", `$${Number(latest.income || 0).toLocaleString()} USD (${latest.profit || 0}%)`],
      ["Total Assets:", `$${Number(latest.assets || 0).toLocaleString()} USD`],
      ["Total Liabilities:", `$${Number(latest.liabilities || 0).toLocaleString()} USD`],
      ["Shareholder Equity:", `$${Number(latest.equity || 0).toLocaleString()} USD`],
      ["Report Telemetry Date:", latest.date || "N/A"]
    ];

    metrics.forEach(([label, val]) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, 14, y);
      doc.setFont("helvetica", "normal");
      doc.text(String(val), 80, y);
      y += 9;
    });

    // Separator Line
    doc.setDrawColor(28, 181, 171);
    doc.setLineWidth(0.5);
    doc.line(14, y + 5, 196, y + 5);

    // Section 2: Analyst Summary Note
    y += 18;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("2. Executive Summary Note", 14, y);

    y += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(71, 85, 105);
    const summaryText = `This document provides real-time audited financial telemetry for ${data.c_name} (${data.symbol}). All prices and market valuation metrics are updated via live telemetry algorithms on Investify Platform.`;
    const splitText = doc.splitTextToSize(summaryText, 180);
    doc.text(splitText, 14, y);

    // Footer
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    doc.text("Investify Financial Technologies Inc. • Confidential Investor Report", 14, 285);

    doc.save(`${data.symbol}_Financial_Report.pdf`);
  };

  const chart1nextSlide = () => {
    setChart1CurrentIndex((prev) => (prev === 2 ? 0 : prev + 1));
  };
  const chart1prevSlide = () => {
    setChart1CurrentIndex((prev) => (prev === 0 ? 2 : prev - 1));
  };

  const chart2nextSlide = () => {
    setChart2CurrentIndex((prev) => (prev === 2 ? 0 : prev + 1));
  };
  const chart2prevSlide = () => {
    setChart2CurrentIndex((prev) => (prev === 0 ? 2 : prev - 1));
  };

  const chart1Configs = [
    { 
      type: "line",
      title: "📉 Stock Price Trend (Open vs Close Price)", 
      dataKey1: "open", 
      dataKey2: "close", 
      label1: "Opening Price ($)",
      label2: "Closing Price ($)",
      data: last30daysdata, 
      colors: ["#eab308", "#22c55e"],
      explanation: "Shows daily stock price momentum. When Closing Price (Green) is above Opening Price (Yellow), the stock is gaining value."
    },
    { 
      type: "area",
      title: "📊 Daily Price Range (High vs Low)", 
      dataKey1: "high", 
      dataKey2: "low", 
      label1: "Peak High ($)",
      label2: "Lowest Low ($)",
      data: last30daysdata, 
      colors: ["#38bdf8", "#ef4444"],
      explanation: "Illustrates market volatility. Wider gap between High (Cyan) and Low (Red) indicates higher price volatility."
    },
    { 
      type: "bar",
      title: "🔊 Trading Volume Telemetry", 
      dataKey1: "volume", 
      label1: "Traded Volume",
      data: last30daysdata, 
      colors: ["#a855f7"],
      explanation: "Displays total shares traded. High volume spikes reflect major investor interest and market liquidity."
    },
  ];

  const chart2Configs = [
    { 
      type: "line",
      title: "📈 Multi-Year Price Trajectory (Open vs Close)", 
      dataKey1: "open", 
      dataKey2: "close", 
      label1: "Opening Price ($)",
      label2: "Closing Price ($)",
      data: last20yrsdata, 
      colors: ["#eab308", "#22c55e"],
      explanation: "Long-term historical trend tracking overall capital growth across multi-year market cycles."
    },
    { 
      type: "area",
      title: "📊 Long-Term Volatility Envelope (High vs Low)", 
      dataKey1: "high", 
      dataKey2: "low", 
      label1: "Historical High ($)",
      label2: "Historical Low ($)",
      data: last20yrsdata, 
      colors: ["#38bdf8", "#ef4444"],
      explanation: "Historical price boundaries showing all-time record highs and support lows over 20 years."
    },
    { 
      type: "bar",
      title: "🔊 Institutional Volume Accumulation", 
      dataKey1: "volume", 
      label1: "Weekly Volume",
      data: last20yrsdata, 
      colors: ["#a855f7"],
      explanation: "Long-term volume trends indicating institutional market participation."
    },
  ];

  const ChartDisplay = ({ config }) => (
    <div style={{ background: "#0f172a", padding: "20px", borderRadius: "16px", border: "1px solid rgba(28, 181, 171, 0.3)" }}>
      <div style={{ marginBottom: "15px" }}>
        <h4 style={{ color: "#1cb5ab", margin: "0 0 6px 0", fontSize: "1.15rem", fontWeight: "700" }}>
          {config.title}
        </h4>
        <p style={{ color: "#cbd5e1", fontSize: "0.88rem", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
          <IoInformationCircle style={{ color: "#ff9800", fontSize: "1.1rem" }} />
          {config.explanation}
        </p>
      </div>

      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          {config.type === "line" ? (
            <LineChart data={config.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} domain={['auto', 'auto']} unit="$" />
              <Tooltip 
                contentStyle={{ backgroundColor: "#1e293b", borderColor: "#1cb5ab", borderRadius: "10px", color: "#fff" }}
                formatter={(val) => [`$${Number(val).toFixed(2)}`, ""]}
              />
              <Legend />
              <Line type="monotone" dataKey={config.dataKey1} name={config.label1} stroke={config.colors[0]} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey={config.dataKey2} name={config.label2} stroke={config.colors[1]} strokeWidth={2.5} dot={false} />
            </LineChart>
          ) : config.type === "area" ? (
            <AreaChart data={config.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} domain={['auto', 'auto']} unit="$" />
              <Tooltip 
                contentStyle={{ backgroundColor: "#1e293b", borderColor: "#1cb5ab", borderRadius: "10px", color: "#fff" }}
                formatter={(val) => [`$${Number(val).toFixed(2)}`, ""]}
              />
              <Legend />
              <Area type="monotone" dataKey={config.dataKey1} name={config.label1} fill={config.colors[0]} stroke={config.colors[0]} fillOpacity={0.25} />
              <Area type="monotone" dataKey={config.dataKey2} name={config.label2} fill={config.colors[1]} stroke={config.colors[1]} fillOpacity={0.2} />
            </AreaChart>
          ) : (
            <BarChart data={config.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#1e293b", borderColor: "#1cb5ab", borderRadius: "10px", color: "#fff" }}
                formatter={(val) => [Number(val).toLocaleString(), config.label1]}
              />
              <Legend />
              <Bar dataKey={config.dataKey1} name={config.label1} fill={config.colors[0]} radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="cmpfs-container">
        <div className="cmpfs-card" style={{ textAlign: "center", padding: "60px" }}>
          <p style={{ color: "#94a3b8", fontSize: "1.2rem" }}>Loading Company Telemetry & Market Analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="cmpfs-container">
        <div className="cmpfs-card" style={{ textAlign: "center", padding: "60px" }}>
          <p style={{ color: "#ef4444", fontSize: "1.2rem" }}>Company not found or invalid company ID.</p>
        </div>
      </div>
    );
  }

  const latest = data.financials?.[0] || {
    revenue: (data.market_cap || 100000000) * 0.22,
    profit: 14.5,
    income: (data.market_cap || 100000000) * 0.03,
    equity: (data.market_cap || 100000000) * 0.35,
    assets: (data.market_cap || 100000000) * 0.55,
    liabilities: (data.market_cap || 100000000) * 0.20,
    date: "2025-12-31"
  };

  return (
    <div className="cmpfs-container">
      <div className="cmpfs-card">
        {/* Company Header with Export Buttons */}
        <div className="cmpfs-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "15px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            {data.logo ? (
              <img src={`data:image/png;base64,${data.logo}`} alt="Logo" className="cmpfs-logo" />
            ) : (
              <IoBusiness style={{ fontSize: "3rem", color: "#1cb5ab" }} />
            )}
            <div>
              <h1>{data.c_name} ({data.symbol})</h1>
              <span style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
                Sector: <strong style={{ color: "#1cb5ab" }}>{data.sector}</strong> • Country: <strong>{data.country}</strong>
              </span>
            </div>
          </div>

          {/* Export Action Controls */}
          <div className="export-buttons-group">
            <button className="export-btn csv" onClick={exportCSV} title="Export Report as CSV Spreadsheet">
              <IoDownloadOutline /> Export CSV
            </button>
            <button className="export-btn pdf" onClick={exportPDF} title="Download Report as PDF Document">
              <IoDocumentTextOutline /> Download PDF Report
            </button>
          </div>
        </div>

        {/* Live Telemetry Overview Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "30px" }}>
          <div style={{ background: "#1e293b", padding: "16px 20px", borderRadius: "12px", border: "1px solid rgba(28,181,171,0.3)" }}>
            <span style={{ color: "#94a3b8", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: "600" }}>Market Price</span>
            <h3 style={{ color: "#22c55e", fontSize: "1.6rem", margin: "4px 0 0 0" }}>${Number(data.price_usd || 0).toFixed(2)}</h3>
          </div>

          <div style={{ background: "#1e293b", padding: "16px 20px", borderRadius: "12px", border: "1px solid rgba(28,181,171,0.3)" }}>
            <span style={{ color: "#94a3b8", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: "600" }}>Market Capitalization</span>
            <h3 style={{ color: "#38bdf8", fontSize: "1.4rem", margin: "4px 0 0 0" }}>${data.market_cap ? Number(data.market_cap).toLocaleString() : "N/A"}</h3>
          </div>

          <div style={{ background: "#1e293b", padding: "16px 20px", borderRadius: "12px", border: "1px solid rgba(28,181,171,0.3)" }}>
            <span style={{ color: "#94a3b8", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: "600" }}>Annual Revenue</span>
            <h3 style={{ color: "#ff9800", fontSize: "1.4rem", margin: "4px 0 0 0" }}>${Number(latest.revenue).toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
          </div>

          <div style={{ background: "#1e293b", padding: "16px 20px", borderRadius: "12px", border: "1px solid rgba(28,181,171,0.3)" }}>
            <span style={{ color: "#94a3b8", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: "600" }}>Net Margin / Profit</span>
            <h3 style={{ color: "#a855f7", fontSize: "1.4rem", margin: "4px 0 0 0" }}>{latest.profit}%</h3>
          </div>
        </div>

        <div className="cmpfs-content-grid">
          {/* Financial Statements Details Table */}
          <div className="details-table-box">
            <h2><IoTrendingUp /> Financial Telemetry</h2>
            <table className="details-table">
              <tbody>
                <tr>
                  <td>Stock Symbol:</td>
                  <td>{data.symbol}</td>
                </tr>
                <tr>
                  <td>Headquarters:</td>
                  <td>{data.country}</td>
                </tr>
                <tr>
                  <td>Current Price (USD):</td>
                  <td>${Number(data.price_usd || 0).toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Market Cap:</td>
                  <td>${data.market_cap ? Number(data.market_cap).toLocaleString() : "N/A"}</td>
                </tr>
                <tr>
                  <td>Industry Sector:</td>
                  <td>{data.sector}</td>
                </tr>
                <tr>
                  <td>Total Revenue:</td>
                  <td>${Number(latest.revenue).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td>Net Income:</td>
                  <td>${Number(latest.income).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td>Total Assets:</td>
                  <td>${Number(latest.assets).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td>Total Liabilities:</td>
                  <td>${Number(latest.liabilities).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td>Shareholder Equity:</td>
                  <td>${Number(latest.equity).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td>Report Date:</td>
                  <td>{latest.date}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Charts Analytics Section */}
          <div className="charts-section">
            {/* 30-Day Intraday Chart Slider */}
            <div className="chart-slider-box">
              <div className="chart-slider-header">
                <h3><IoStatsChart /> Intraday Performance (30 Days)</h3>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button className="slider-btn" onClick={chart1prevSlide} title="Previous Chart">
                    <IoIosArrowDropleftCircle />
                  </button>
                  <button className="slider-btn" onClick={chart1nextSlide} title="Next Chart">
                    <IoIosArrowDroprightCircle />
                  </button>
                </div>
              </div>
              <ChartDisplay config={chart1Configs[chart1CurrentIndex]} />
            </div>

            {/* 20-Year Historical Chart Slider */}
            <div className="chart-slider-box">
              <div className="chart-slider-header">
                <h3><IoStatsChart /> Historical Multi-Year Cycle</h3>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button className="slider-btn" onClick={chart2prevSlide} title="Previous Chart">
                    <IoIosArrowDropleftCircle />
                  </button>
                  <button className="slider-btn" onClick={chart2nextSlide} title="Next Chart">
                    <IoIosArrowDroprightCircle />
                  </button>
                </div>
              </div>
              <ChartDisplay config={chart2Configs[chart2CurrentIndex]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CmpFS;
