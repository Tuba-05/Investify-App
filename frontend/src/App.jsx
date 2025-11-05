// for single page/component path(Route), (Routes)provides container for multiple Routes 
// (BrowserRouter)enables routing in your React app using HTML5 history API.
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // to use this, npm install react-router-dom
// importing jsx components 
import LoginSignUp from './components/LoginSignUp/LoginSignUp.jsx';
import HomePg from './components/HomePg/HomePg.jsx'
import StockList from './components/StockList/StockList.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import CmpFs from './components/CmpFS/CmpFs.jsx';
import WatchList from './components/WatchList/WatchList.jsx';
import VeriCode from './components/VeriCode/VeriCode.jsx'; 

function App() {
  return (
    <>
    <BrowserRouter style={{ fontFamily: "Montserrat" }}>
        <Routes>
          {/*it will appear first*/}
        {/* <Route path='/' element={<LoginSignUp/>}></Route>  */}
        <Route path='/' element={<VeriCode/>}></Route>
        {/* Pages after login/signup have Navbar, is the parent layout (contains Outlet) */}
        
        {/* fallback for any unknown route */}
        {/* <Route path="*" element={<LoginSignUp />} /> */}
        </Routes>    
      </BrowserRouter>
    </>
  )
}
export default App;
