import { useParams } from "react-router-dom"; // to access/read values from URL
import { useEffect, useState } from "react"; // for fetching data from Flask API and storing in state
import { MdArrowRight } from "react-icons/md"; // arrow icon for list items
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, AreaChart, Area, ComposedChart, ResponsiveContainer, } from "recharts";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { IoIosArrowDroprightCircle } from "react-icons/io";
// ====================================================================================================================================
// import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
// Register components
// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
// ====================================================================================================================================

function CmpFS() {
  const { id } = useParams(); // get company ID from URL
  const [data, setData] = useState(null); // state to hold fetched data
  const [last30daysdata, setlast30daysdata] = useState([]);
  const [last20yrsdata, setlast20yrsdata] = useState([]);
  const [chart1CurrentIndex, setChart1CurrentIndex] = useState(0);
  const [chart2CurrentIndex, setChart2CurrentIndex] = useState(0);

  // const [chart2CurrentIndex, setChart2CurrentIndex] = useState(0);

  // COMPANY'S FS DATA FETCHING
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/company/${id}`) // Flask backend endpoint
      .then((res) => res.json()) // parse JSON response
      .then((info) => setData(info)) // set data to state
      .catch((err) => console.error("Error fetching company data:", err)); // handle errors
  }, [id]); // re-run effect if ID changes

  // GRAPH DATA FETCHING
  useEffect(() => {
    // Only fetch historical data if data and data.symbol are available
    if (data?.symbol) {
      // 1. *************** Historical Data (last 30 days) ***************
      fetch(
        `http://127.0.0.1:5000/historical-data-last-thirtyDAYS/${data.symbol}`,
        { method: "GET" }
      )
        .then((res) => res.json())
        .then((histData) => {
          if (histData.success) {
            let formatted = [];

            if (Array.isArray(histData.hist_data)) {
              // ✅ already array
              formatted = histData.hist_data;
            } else if (typeof histData.hist_data === "object") {
              // ✅ convert object of date keys → array
              formatted = Object.entries(histData.hist_data).map(
                ([date, v]) => ({
                  date,
                  open: parseFloat(v["1. open"]) || parseFloat(v.open),
                  high: parseFloat(v["2. high"]) || parseFloat(v.high),
                  low: parseFloat(v["3. low"]) || parseFloat(v.low),
                  close: parseFloat(v["4. close"]) || parseFloat(v.close),
                  volume: parseInt(v["5. volume"]) || parseInt(v.volume),
                })
              );
            }

            setlast30daysdata(formatted);
            console.log("✅ Normalized 30-day data:", formatted);
          } else {
            console.error("❌ Invalid data format:", histData);
          }
        })

        .catch((err) =>
          console.error("Error fetching 30 days historical data:", err)
        );

      // 2. *************** Historical Data (last 20 yrs weekly data) ***************
      fetch(
        `http://127.0.0.1:5000/historical-data-last-twentyYRS/${data.symbol}`,
        { method: "GET" }
      )
        .then((res) => res.json())
        .then((histData) => {
          if (histData.success && Array.isArray(histData.hist_data)) {
            const last20yrs_data = histData.hist_data.map((item) => ({
              date: item.date,
              open: item.open,
              close: item.close,
              high: item.high,
              low: item.low,
              volume: item.volume,
            }));
            setlast20yrsdata(last20yrs_data); // Store 20 yrs data in state
            console.log("Historical data (20 yrs):", histData); // for checking purposes
          } else {
            console.error("Error: Invalid historical data format", histData); // handle unexpected data format
          }
        })
        .catch((err) =>
          console.error("Error fetching 20 yrs historical data:", err)
        );
    }
  }, [data?.symbol]);

  // CHARTs SLIDER LOGIC
  const chart1nextSlide = () => {
    setChart1CurrentIndex((prevIndex) => (prevIndex === 2 ? 0 : prevIndex + 1));
  };

  const chart1prevSlide = () => {
    setChart1CurrentIndex((prevIndex) => (prevIndex === 0 ? 2 : prevIndex - 1));
  };
  const chart2nextSlide = () => {
    setChart2CurrentIndex((prevIndex) => (prevIndex === 2 ? 0 : prevIndex + 1));
  };

  const chart2prevSlide = () => {
    setChart2CurrentIndex((prevIndex) => (prevIndex === 0 ? 2 : prevIndex - 1));
  };

  // =======================CHARTS DISPLAY LOGIC=======================
  // ************last 30 days data************
  const chart1Configs = [
  { title: "Price Movement (Open & Close)", dataKey1: "open", dataKey2: "close", data: last30daysdata, colors: ["#6911c7ff", "#cf1010ff"] },
  { title: "Price Range (High & Low)", dataKey1: "high", dataKey2: "low", data: last30daysdata, colors: ["#840eaeff", "#810000ff"] },
  { title: "Trading Volume", dataKey1: "volume", data: last30daysdata, colors: ["#af22c7ff"] },
];
  // ************last 20 yrs data************
  const chart2Configs = [
  { title: "Price Movement (Open & Close)", dataKey1: "open", dataKey2: "close", data: last20yrsdata, colors: ["#6911c7ff", "#cf1010ff"] },
  { title: "Price Range (High & Low)", dataKey1: "high", dataKey2: "low", data: last20yrsdata, colors: ["#840eaeff", "#810000ff"] },
  { title: "Trading Volume", dataKey1: "volume", data: last20yrsdata, colors: ["#af22c7ff"] },
];

// making reusable chart component
  const ChartDisplay = ({ config }) => (
  <div style={{ background: "#111827" /* Tailwind bg-gray-900 */,
                padding: "1rem" /* p-4 */,
                borderRadius: "1rem" /* rounded-2xl */,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)" /* shadow-lg */,
                }}>

    <h2 style={{  fontSize: "1.25rem" /* text-xl */,
                  marginBottom: "0.75rem" /* mb-3 */,
                  fontWeight: "600" /* font-semibold */,
                  textAlign: "center" /* text-center */,
                  color: "#a855f7",}}>
                  {config.title} </h2>

    <div style={{ width: "100%", // full container width
                  overflowX: "auto", // enable horizontal scroll
                  overflowY: "auto", // enable vertical scroll
                  }}>
     <div style={{ width: "2200px", height: "400px" }}>
             {/* <-- increase size */}        
    <ResponsiveContainer width="100%" height={400}>
      {config.dataKey2 ? (
        <ComposedChart data={config.data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#aea4a4ff" />
          <XAxis dataKey="date" stroke="#aea4a4ff" />
          <YAxis stroke="#aea4a4ff" />
          <Tooltip />
          <Legend />
          <Bar dataKey={config.dataKey1} fill={config.colors[0]} />
          <Bar dataKey={config.dataKey2} fill={config.colors[1]} />
        </ComposedChart>
      ) : (
        <AreaChart data={config.data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#aea4a4ff" />
          <XAxis dataKey="date" stroke="#aea4a4ff" />
          <YAxis stroke="#aea4a4ff" />
          <Tooltip />
          <Legend />
          <Area dataKey={config.dataKey1} fill={config.colors[0]} stroke={config.colors[0]} fillOpacity={0.4} />
        </AreaChart>
      )}
    </ResponsiveContainer>
    </div>
    </div>
  </div>
);

  if (!data) return <p>Loading...</p>; // show loading state
  if (last20yrsdata.length === 0 && last30daysdata.length === 0)
    // if historical data not yet loaded
    return <p>Loading charts...</p>;
  const latest = data.financials?.[data.financials.length - 1]; // Get the most recent [financials (last entry)

  return (
    <>
      <div
        style={{
          padding: "20px",
          marginLeft: "205px",
          width: "86%",
          height: "260vh",
          marginTop: "18px",
          position: "absolute",
          background:
            "linear-gradient( 145deg, #bbebdcff 3%, #babcbcff 20%,  #c2f4e4ff 55%, #838987ff 100%)",
          borderRadius: "5px",
          border: "5px solid #0aa48dff",
          boxShadow:
            "0 4px 8px rgba(0, 0, 0, 1), 0 4px 8px rgba(220, 41, 41, 1)",
          flexWrap: "wrap", // allows stacking on smaller screens
        }} >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {/* LOGO + COMPANY NAME */}
          <img
            src={`data:image/png;base64,${data.logo}`}
            alt="Logo"
            width={50}
            height={50}
          />
          <h1 style={{ fontSize: "75px" }}>{data.c_name}</h1>
        </div>
        {latest ? ( // if financial data available, show details
        <>
          <div>
            <div
              style={{
                listStyleType: "none",
                lineHeight: "2",
                fontFamily: "Montserrat",
              }}
            >
              <table>
                <thead>
                  {" "}
                  <tr>
                    {" "}
                    <th>
                      <h2 style={{ fontSize: "35px" }}>Details </h2>
                    </th>{" "}
                  </tr>{" "}
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <b>
                        <MdArrowRight /> Symbol:
                      </b>
                    </td>{" "}
                    <td>{data.symbol}</td>
                  </tr>{" "}
                  <tr>
                    <td>
                      <b>
                        <MdArrowRight /> Country:
                      </b>
                    </td>{" "}
                    <td>{data.country}</td>
                  </tr>{" "}
                  <tr>
                    <td>
                      <b>
                        <MdArrowRight /> Price USD:
                      </b>
                    </td>{" "}
                    <td>{data.price_usd} $</td>
                  </tr>{" "}
                  <tr>
                    <td>
                      <b>
                        <MdArrowRight /> Market Capitalization:{" "}
                      </b>
                    </td>{" "}
                    <td>{data.market_cap} $</td>
                  </tr>{" "}
                  <tr>
                    <td>
                      <b>
                        <MdArrowRight /> Sector:
                      </b>
                    </td>{" "}
                    <td>{data.sector}</td>
                  </tr>{" "}
                  <tr>
                    <td>
                      <b>
                        <MdArrowRight /> Revenue:
                      </b>
                    </td>{" "}
                    <td>{latest.revenue} $</td>
                  </tr>{" "}
                  <tr>
                    <td>
                      <b>
                        <MdArrowRight /> Profit:
                      </b>
                    </td>{" "}
                    <td>{latest.profit} $</td>
                  </tr>{" "}
                  <tr>
                    <td>
                      <b>
                        <MdArrowRight /> Income:
                      </b>
                    </td>{" "}
                    <td>{latest.income} $</td>
                  </tr>{" "}
                  <tr>
                    <td>
                      <b>
                        <MdArrowRight /> Equity:
                      </b>
                    </td>{" "}
                    <td>{latest.equity} $</td>
                  </tr>{" "}
                  <tr>
                    <td>
                      <b>
                        <MdArrowRight /> Assets:
                      </b>
                    </td>{" "}
                    <td>{latest.assets} $</td>
                  </tr>{" "}
                  <tr>
                    <td>
                      <b>
                        <MdArrowRight /> Liabilities:
                      </b>
                    </td>{" "}
                    <td>{latest.liabilities} $</td>
                  </tr>{" "}
                  <tr>
                    <td>
                      <b>
                        <MdArrowRight /> Date:
                      </b>
                    </td>{" "}
                    <td>{latest.date}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* ================= CHARTS DISPLAY ================= */}
            <div className="flex flex-col gap-12 p-5 bg-gray-950 text-green-300">
              <h style={{fontSize:"20px"}} > Last 30days Data </h>
              <div className=" gap-5 p-3 bg-gray-950 text-green-300" style={{ position: "relative" }}>
                <button style={{ top: "50%", left: "-35px", position: "absolute", transform: "translateY(-50%)" }}
                      onClick={chart1prevSlide} >
                      <IoIosArrowDropleftCircle style={{ fontSize: "35px" }} /> </button>
                <div> <ChartDisplay config={chart1Configs[chart1CurrentIndex]} /> </div>
                <button style={{ top: "50%", right: "-35px", position: "absolute", transform: "translateY(-50%)" }}
                      onClick={chart1nextSlide} >
                      <IoIosArrowDroprightCircle style={{ fontSize: "35px" }} /> </button>    
              </div>
              <h style={{fontSize:"20px"}} > Last 20yrs Data </h>
              <div className=" gap-5 p-3 bg-gray-950 text-green-300" style={{ position: "relative" }}>
                <button style={{ top: "50%", left: "-35px", position: "absolute", transform: "translateY(-50%)" }}
                      onClick={chart2prevSlide} >
                      <IoIosArrowDropleftCircle style={{ fontSize: "35px" }} /> </button>
                <div> <ChartDisplay config={chart2Configs[chart2CurrentIndex]} /> </div>
                <button style={{ top: "50%", right: "-35px", position: "absolute", transform: "translateY(-50%)" }}
                      onClick={chart2nextSlide} >
                      <IoIosArrowDroprightCircle style={{ fontSize: "35px" }} /> </button>    
              </div>
            </div>  
          </div>    
        </>     
        ) : (
          <>
          {/* // if no financial data available */}
          <p>No financial data available</p>
          </>
        )}
      </div>
    </>
  );
};

export default CmpFS;
