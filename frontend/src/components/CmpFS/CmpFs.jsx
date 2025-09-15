import { useParams } from "react-router-dom"; // to access/read values from URL 
import { useEffect, useState } from "react"; // for fetching data from Flask API and storing in state
import { MdArrowRight } from "react-icons/md"; // arrow icon for list items


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
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
      {/* LOGO + COMPANY NAME */}
      <img src={`data:image/png;base64,${data.logo}`} alt="Logo" width={50} height={50} />
      <h1 style={{ fontSize: "75px"}}
      >{data.c_name}</h1>
      </div>
      {latest // if financial data available, show details
      ? (
        <>
        <div style={{ listStyleType: "none", lineHeight: "2", fontStyle: "" }}> 
          <h2 style={{fontSize: "35px"}}>
            Details</h2>
          <li><b><MdArrowRight />Symbol:</b> {data.symbol}</li>
          <li><b><MdArrowRight />Country:</b> {data.country}</li>
          <li><b><MdArrowRight />Price USD:</b> {data.price_usd} $</li>
          <li><b><MdArrowRight />Market Capitalization:</b> {data.market_cap} $</li>
          <li><b><MdArrowRight />Sector:</b> {data.sector}nology (IT)</li>
          {/* <h2>Latest Financial Statements</h2> */}
          <li><b><MdArrowRight />Revenue:</b> {latest.revenue} $</li>
          <li><b><MdArrowRight />Profit:</b> {latest.profit} $</li>
          <li><b><MdArrowRight />Income:</b> {latest.income} $</li>
          <li><b><MdArrowRight />Equity:</b> {latest.equity} $</li>
          <li><b><MdArrowRight />Assets:</b> {latest.assets} $</li>
          <li><b><MdArrowRight />Liabilities:</b> {latest.liabilities} $</li>
          <li><b><MdArrowRight />Date:</b> {latest.date}</li>
        </div>  
        </>
      ) // if no financial data available 
      : (
        <p>No financial data available</p>
      )}
    </div>
    </>
  );
}

export default CmpFS;
