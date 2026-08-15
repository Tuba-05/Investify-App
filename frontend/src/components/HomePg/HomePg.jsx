import React from 'react';
import './HomePg.css';
import Lottie from "lottie-react";
import stock_animation from '../../assets/Animation .json';
import { GoArrowUpRight } from "react-icons/go";

const HomePg = () => {
  return (
    <>
      {/* Background Image on Home Page */}
      <div className='bg-img'>
        {/* Animation */}
        <div className="stock-animation">
          <Lottie animationData={stock_animation} loop={true} autoplay={true} />    
        </div>

        {/* Content: Heading & Text */}
        <div className='content'>
          <h1>@Investify.<GoArrowUpRight /></h1>
          <p>
            Investify is a state-of-the-art web application providing real-time stock market telemetry, 
            0ms latency caching, interactive intraday and 10-year historical trend analytics, automated PDF & CSV 
            financial report downloads, and personalized user watchlists. Built with a modern glassmorphic interface 
            and backed by Supabase PostgreSQL cloud database, Investify empowers investors to explore audited market 
            valuations, monitor live financial statements, and stay updated with real-time Tech & Finance news 
            headlines—all within a sleek, intuitive platform crafted for clarity and performance.
          </p>
        </div>
      </div>
    </>
  );
};

export default HomePg;