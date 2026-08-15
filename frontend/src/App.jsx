import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginSignUp from './components/LoginSignUp/LoginSignUp.jsx';
import HomePg from './components/HomePg/HomePg.jsx';
import StockList from './components/StockList/StockList.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import CmpFs from './components/CmpFS/CmpFs.jsx';
import WatchList from './components/WatchList/WatchList.jsx';
import VeriCode from './components/VeriCode/VeriCode.jsx'; 
import Help from './components/Help/Help.jsx';
import AboutUs from './components/AboutUs/AboutUs.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <BrowserRouter style={{ fontFamily: "Montserrat" }}>
      <Routes>
        {/* Public Auth Routes */}
        <Route path='/' element={<LoginSignUp />} /> 
        <Route path='/VeriCode' element={<VeriCode />} />

        {/* Session Protected Application Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Navbar />}> 
            <Route path='/HmPg' element={<HomePg />} />
            <Route path='/StockList' element={<StockList />} />
            <Route path='/CmpFS/:id' element={<CmpFs />} />
            <Route path='/WatchList' element={<WatchList />} />
            <Route path='/Help' element={<Help />} />
            <Route path='/AboutUs' element={<AboutUs />} />
          </Route>
        </Route>

        {/* Fallback redirect */}
        <Route path="*" element={<LoginSignUp />} />
      </Routes>    
    </BrowserRouter>
  );
}

export default App;
