/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "./MainBanner.css";
import {useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import RazorpayLogo from "../../../assets/Images/razorpay-logo.png";
import instant_img from "../../../assets/Images/instant.png";
import whatsapp from "../../../assets/Images/whatsapp-24.png";
import instagram from "../../../assets/Images/instagram-24.png";
import phone from "../../../assets/Images/phone-24.png";
import News from "./news/News";

function MainBanner() {
  const options = [
    { text: "SELL YOUR", keyword: "BUSINESS", colorClass: "business-color" },
    { text: "SELL YOUR", keyword: "PROPERTY", colorClass: "property-color" },
    { text: "BUY A", keyword: "BUSINESS", colorClass: "business-color" },
    { text: "BUY A", keyword: "PROPERTY", colorClass: "property-color" },
  ];

  const [displayText, setDisplayText] = useState(""); // Tracks full text being typed
  const [currentColorClass, setCurrentColorClass] = useState(""); // Color class for keyword
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopIndex, setLoopIndex] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const navigate = useNavigate();

  const handleSell = () => navigate("/sell");
  const handleBuy = () => navigate("/buy");

  useEffect(() => {
    const handleTyping = () => {
      const { text, keyword, colorClass } = options[loopIndex % options.length];
      const fullText = `${text} ${keyword}`;

      if (isDeleting) {
        setDisplayText((prev) => prev.slice(0, -1));
        setTypingSpeed(50);
      } else {
        setDisplayText((prev) => fullText.slice(0, prev.length + 1));
        setCurrentColorClass(colorClass); // Update color class dynamically
        setTypingSpeed(150);
      }

      if (!isDeleting && displayText === fullText) {
        setTimeout(() => setIsDeleting(true), 1000); // Pause before deleting
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setLoopIndex((prev) => prev + 1);
      }
    };

    const typingInterval = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(typingInterval);
  }, [displayText, isDeleting, typingSpeed, loopIndex, options]);

  return (
    <>
      <News />
      <section className="homeBanner">
        {/* Vertical Icons Section */}
        <div className="vertical-icons">
          <div style={{ cursor: "pointer" }} className="vertical-box">
            <a  href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="clickable-link" >
              <img src={instagram} alt="Instagram" />
               </a>
          </div>

          <div className="vertical-box">
            <a href="https://wa.me/9566702095" target="_blank"  rel="noopener noreferrer" className="clickable-link" >
             <img src={whatsapp} alt="WhatsApp" />
              </a>
          </div>

          <div className="vertical-box">
            <a href="tel: +91 9566702095"  target="_blank" rel="noopener noreferrer" className="clickable-link" >
              <img src={phone} alt="Phone" />
            </a>
          </div>
        </div>

        <div className="overlay"></div>
        <div className="container text-container">
          <div className="col-12 text-center">
            {/* Typing Text */}
            <h1 className="banner-title">
              <span>
                {displayText.split(" ").map((word, index) =>
                  index === displayText.split(" ").length - 1 ? (
                    <span key={index} className={currentColorClass}> {word} </span>
                  ) : (
                    <span key={index}>{word} </span>
                  )
                )}
              </span>
              <span className="blinking-cursor">|</span>
            </h1>

            {/* Sell and Buy Buttons */}
            <div className="homeBannerSellBuyBtn row">
              {/* SELL Section */}
              <div className="buttonWithText homeSell col-md-5">
                <div className="text-with-image">
                  <img src={RazorpayLogo} alt="Razorpay" className="razorpay-img" />
                  <p className="button-text"> List your Business or Property for sale </p>
                </div>
                <Button variant="" className="headerSigninbtn" onClick={handleSell} >  SELL </Button>
                {/* Add instant image below SELL button */}
                <span className="instant-img-wrapper">
                  <img src={instant_img} alt="Instant Listing" className="instant-imgg" /> </span>
              </div>

              {/* BUY Section */}
              <div className="buttonWithText homeBuy col-md-5 mb-5">
                <p className="button-text"> Discover Business and Property to buy  </p>
                <Button variant="" className="headerSigninbtn"  onClick={handleBuy} > BUY </Button>
                {/* Add text below BUY button */}
                <div className="buy-info-text">
                  <p className="button-text"> <span>Free</span> to Explore </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default MainBanner;
