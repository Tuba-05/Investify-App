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

  return (
    <>
    <h1>HI MATE</h1>
      {/* Display company financial data */}
      <div style={{ padding: "20px" }}>
        <h1>{data.company_name}</h1>
        <p><b>Revenue:</b> {data.revenue}</p>
        <p><b>Net Income:</b> {data.net_income}</p>
        <p><b>Total Assets:</b> {data.total_assets}</p>
        <p><b>Total Liabilities:</b> {data.total_liabilities}</p>
      </div>
    </>
  );
}

export default CmpFS;
