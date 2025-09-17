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
    <div style={{ padding: "20px" , marginLeft: "205px", width: '86%', height: '96vh',  marginTop: "18px", position: 'absolute',
      background: 'linear-gradient( 145deg, #bbebdcff 3%, #babcbcff 20%,  #c2f4e4ff 55%, #838987ff 100%)', 
      borderRadius: '5px', border: '5px solid #0aa48dff', 
      boxShadow: '0 4px 8px rgba(0, 0, 0, 1), 0 4px 8px rgba(220, 41, 41, 1)'}} >
  
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
      {/* LOGO + COMPANY NAME */}
      <img src={`data:image/png;base64,${data.logo}`} alt="Logo" width={50} height={50} />
      <h1 style={{ fontSize: "75px"}}
      >{data.c_name}</h1>
      </div>
      {latest // if financial data available, show details
      ? (
        <>
        <div style={{ listStyleType: "none", lineHeight: "2", fontfamily: 'Montserrat' }}> 
          <table>
            <thead> <tr> <th>
              <h2 style={{fontSize: "35px"}}>
                 Details  </h2>
                </th> </tr> </thead>
            <tbody>
              <tr>
                <td><b><MdArrowRight /> Symbol:</b></td>  <td>{data.symbol}</td>
              </tr>   <tr>
                <td><b><MdArrowRight /> Country:</b></td>   <td>{data.country}</td>
              </tr>   <tr>
                <td><b><MdArrowRight /> Price USD:</b></td>   <td>{data.price_usd} $</td>
              </tr>   <tr>
                <td><b><MdArrowRight /> Market Capitalization: </b></td>   <td>{data.market_cap} $</td>
              </tr>   <tr>
                <td><b><MdArrowRight /> Sector:</b></td>  <td>{data.sector}</td>
              </tr>   <tr>
                <td><b><MdArrowRight /> Revenue:</b></td>   <td>{latest.revenue} $</td>
              </tr>   <tr>
                <td><b><MdArrowRight /> Profit:</b></td>  <td>{latest.profit} $</td>
              </tr>   <tr>
                <td><b><MdArrowRight /> Income:</b></td>  <td>{latest.income} $</td>
              </tr>   <tr>
                <td><b><MdArrowRight /> Equity:</b></td>  <td>{latest.equity} $</td>
              </tr>   <tr>
                <td><b><MdArrowRight /> Assets:</b></td>  <td>{latest.assets} $</td>
              </tr>   <tr>
                <td><b><MdArrowRight /> Liabilities:</b></td>   <td>{latest.liabilities} $</td>
              </tr>   <tr>
                <td><b><MdArrowRight /> Date:</b></td>  <td>{latest.date}</td>
              </tr> 
              </tbody>
          </table>
          {/*---------------------------------------------------------------------*/}
          {/* <li><b><MdArrowRight />Symbol:</b> {data.symbol}</li>
          <li><b><MdArrowRight />Country:</b> {data.country}</li>
          <li><b><MdArrowRight />Price USD:</b> {data.price_usd} $</li>
          <li><b><MdArrowRight />Market Capitalization:</b> {data.market_cap} $</li>
          <li><b><MdArrowRight />Sector:</b> {data.sector}nology (IT)</li> */}
          {/* <h2>Latest Financial Statements</h2> */}
          {/* <li><b><MdArrowRight />Revenue:</b> {latest.revenue} $</li>
          <li><b><MdArrowRight />Profit:</b> {latest.profit} $</li>
          <li><b><MdArrowRight />Income:</b> {latest.income} $</li>
          <li><b><MdArrowRight />Equity:</b> {latest.equity} $</li>
          <li><b><MdArrowRight />Assets:</b> {latest.assets} $</li>
          <li><b><MdArrowRight />Liabilities:</b> {latest.liabilities} $</li>
          <li><b><MdArrowRight />Date:</b> {latest.date}</li> */}
          {/*---------------------------------------------------------------------*/}
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
