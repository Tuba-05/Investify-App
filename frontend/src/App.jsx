// for single page/component path(Route), (Routes)provides container for multiple Routes 
// (BrowserRouter)enables routing in your React app using HTML5 history API.
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // to use this, npm install react-router-dom
// importing jsx components 
import LoginSignUp from './components/LoginSignUp/LoginSignUp.jsx';
import HomePg from './components/HomePg/HomePg.jsx'
import StockList from './components/StockList/StockList.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import CmpFs from './components/CmpFS/CmpFs.jsx';
function App() {
  return (
    <>
    <BrowserRouter>
        <Routes>
        <Route path='/' element={<LoginSignUp/>}></Route> {/*it will appear first*/}
        {/* Pages after login/signup have Navbar, is the parent layout (contains Outlet) */}
        <Route element={<Navbar />}> 
              {/* pages accessible after login/ signup */}
              <Route path='/HmPg' element={<HomePg/>}></Route> {/*it will appear after successful SignUp/In attempt*/}
              <Route path='/StockList' element={<StockList/>}></Route> {/* StockList page */}
              <Route path='/CmpFS/:id' element={<CmpFs/>}></Route> {/* Company Financial Statements page with dynamic ID */}
        </Route>  
        {/* fallback for any unknown route */}
        {/* <Route path="*" element={<LoginSignUp />} /> */}
        </Routes>    
      </BrowserRouter>
    </>
  )
}
export default App;
