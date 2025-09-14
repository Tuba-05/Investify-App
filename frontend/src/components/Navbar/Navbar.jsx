import React from 'react';
import './Navbar.css';
// Outlet like a slot where the child route goes & Link to connect different routes/pages
import {NavLink, Outlet} from "react-router-dom"; 
// importing react icons
import { IoHome } from "react-icons/io5";
import { AiOutlineStock } from "react-icons/ai";
import { IoInformationCircleSharp } from "react-icons/io5";
import { IoMdHelpCircle } from "react-icons/io";
import { IoStarSharp } from "react-icons/io5";


const Navbar = () => {
  return (
    <>
    {/* A horizontal line on top bcz my choice ;) */}
    <div className='single-line'></div>
    {/* Navigation bar */}
    <div className='nav-bar'>
        {/* <div> <img src="" alt="" /></div> */}
        <ul className='nav-links'>
            <li><NavLink to="/HmPg"><IoHome /> Home</NavLink></li>
            <li><NavLink to="/StockList"><AiOutlineStock /> StockList</NavLink></li>
            <li><NavLink to="/WatchList"><IoStarSharp /> Watch List</NavLink></li>
            <li><NavLink ><IoInformationCircleSharp /> About Us</NavLink></li>
            <li><NavLink ><IoMdHelpCircle /> Help</NavLink></li>
        </ul>
    </div>
    <Outlet /> {/* This is where HomePg, StockList, etc. will appear */}
    </>
  );
};

export default Navbar;
