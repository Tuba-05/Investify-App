import React from 'react'
import './HomePg.css'
import Lottie from "lottie-react"; // animation pkg
import stock_animation from '../../assets/Animation .json'; //animation file 
import { GoArrowUpRight } from "react-icons/go"; // react icon


const HomePg = () => {
  return (
    <>
    {/* Backgroung Image on HmPg*/}
    <div 
    className='bg-img' 
    >
      {/* Animation */}
      <div className="stock-animation">
        <Lottie animationData={stock_animation} loop={true} autoplay={true} />    
      </div>
      {/* content: Heading & text */}
      <div className='content'>
        <h1>@Investify.<GoArrowUpRight /></h1>
        <p>Investify is a feature-rich platform tailored for investors of the Pakistan Stock Exchange (PSX). It provides real-time access to market data
        Users benefit from interactive price and volume charts—ranging from one-day views up to five-year historical data—for in-depth technical and 
        trend analysis. Beyond data, the app empowers investors with a demo trading feature (mock trading account), portfolio tracking with sell 
        history and dividends, customizable watchlists, and up-to-date financials, technical indicators such as RSI, MACD, stochastics, and pivot 
        points. It also includes detailed company profiles with announcements. Additionally, Investify acts as a comprehensive financial news 
        aggregator, delivering market-relevant updates from multiple sources and enabling customizable notifications for market movements and 
        portfolio events—all within a sleek, intuitive interface praised for its simplicity and utility.    
        </p>
      </div>
    </div>
  </>
  )
}

export default HomePg;