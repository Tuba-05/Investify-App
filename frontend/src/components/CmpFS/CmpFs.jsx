import { useParams } from "react-router-dom"; // to access/read values from URL 
import { useEffect, useState } from "react";


function CmpFS() {
  const { id } = useParams();  // get company ID from URL
  const [data, setData] = useState(null); // state to hold fetched data

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/company/${id}`) // Flask backend endpoint
      .then((res) => res.json()) // parse JSON response
      .then((info) => setData(info)) // set data to state
      .catch((err) => console.error("Error fetching company data:", err)); // handle errors
  }, [id]); // re-run effect if ID changes

  if (!data) return <p>Loading...</p>; // show loading state
  
  const latest = data.financials?.[data.financials.length - 1]; // Get the most recent [financials (last entry)]

  return (
    <>
    <div style={{ padding: "20px" , marginLeft: "200px",}}>
      <h1>{data.c_name}</h1>
      {latest ? (
        <>
          <h2>Company Details</h2>
          <p><b>Symbol:</b> {data.symbol}</p>
          <p><b>Country:</b> {data.country}</p>
          <p><b>Price USD:</b> {data.price_usd}$</p>
          <p><b>Market Capitalization:</b> {data.market_cap}$</p>
          <p><b>Sector:</b> {data.sector}</p>
          <h2>Latest Financial Statements</h2>
          <p><b>Revenue:</b> {latest.revenue$}</p>
          <p><b>Profit:</b> {latest.profit}$</p>
          <p><b>Income:</b> {latest.income}$</p>
          <p><b>Equity:</b> {latest.equity}$</p>
          <p><b>Assets:</b> {latest.assets}$</p>
          <p><b>Liabilities:</b> {latest.liabilities}$</p>
          <p><b>Date:</b> {latest.date}</p>
        </>
      ) : (
        <p>No financial data available</p>
      )}
    </div>
    </>
  );
}

export default CmpFS;
