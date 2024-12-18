/* eslint-disable no-unused-vars */
import React from 'react';
import { NavLink } from 'react-router-dom';
import Slider from 'react-slick';
import "./MostVisitedPlace.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HomeLsideImage_1 from '../../../assets/Images/utf_listing_item-01.jpg';
import HomeLsideImage_2 from '../../../assets/Images/utf_listing_item-03.jpg';
import HomeLsideImage_3 from '../../../assets/Images/utf_listing_item-06.jpg';
import { FaPhoneAlt, FaTag } from 'react-icons/fa';
import { CiLocationOn } from 'react-icons/ci';
import { FaLocationDot } from 'react-icons/fa6';
import { IoLocation } from 'react-icons/io5';
import { FaCity } from "react-icons/fa6";

function MostVisitedPlace() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Default for large screens
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 992, // For screens below 992px
        settings: {
          slidesToShow: 2, // Show 2 slides
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, // For screens below 768px
        settings: {
          slidesToShow: 1, // Show 1 slide
          slidesToScroll: 1,
        },
      },
    ],
  };


  const places = [
    {
      to: "/beautiful-beach",
      img: HomeLsideImage_1,
      title: "Chontaduro Barcelona",
      priceRange: "$25 - $55",
      tag: "Open Now",
      type: "Restaurant",
      featured: "Featured",
      rating: 4.5,
      reviews: 822,
      phone: "+(15) 124-796-3633",
      location: "The Ritz-Carlton, Hong Kong"
    },
    {
      to: "/city-park",
      img: HomeLsideImage_2,
      title: "The Lounge & Bar",
      priceRange: "$45 - $70",
      tag: "Open Now",
      type: "Events",
      featured: "Featured",
      rating: 4.5,
      reviews: 822,
      phone: "+(15) 124-796-3633",
      location: "The Ritz-Carlton, Hong Kong"
    },
    {
      to: "/historic-museum",
      img: HomeLsideImage_3,
      title: "Westfield Sydney",
      priceRange: "$25 - $55",
      tag: "Closed",
      type: "Hotel",
      featured: "Featured",
      rating: 4.5,
      reviews: 822,
      phone: "+(15) 124-796-3633",
      location: "The Ritz-Carlton, Hong Kong"
    },
    {
      to: "/city-park",
      img: HomeLsideImage_2,
      title: "The Lounge & Bar",
      priceRange: "$45 - $70",
      tag: "Open Now",
      type: "Events",
      featured: "Featured",
      rating: 4.5,
      reviews: 822,
      phone: "+(15) 124-796-3633",
      location: "The Ritz-Carlton, Hong Kong"
    },
    {
      to: "/historic-museum",
      img: HomeLsideImage_3,
      title: "Westfield Sydney",
      priceRange: "$25 - $55",
      tag: "Closed",
      type: "Hotel",
      featured: "Featured",
      rating: 4.5,
      reviews: 822,
      phone: "+(15) 124-796-3633",
      location: "The Ritz-Carlton, Hong Kong"
    },
    {
      to: "/historic-museum",
      img: HomeLsideImage_3,
      title: "Westfield Sydney",
      priceRange: "$25 - $55",
      tag: "Closed",
      type: "Hotel",
      featured: "Featured",
      rating: 4.5,
      reviews: 822,
      phone: "+(15) 124-796-3633",
      location: "The Ritz-Carlton, Hong Kong"
    }
  ];

  return (
    <section className='homeMostVisitedPlace'>
      <div className="container">
        <div className="row homeMostVisitedPlaceROW">
          <div className="2 homeMostVisitedPlaceHed">
            {/* <h4>Most Visited Place</h4> */}
            <h4>Choose your city to Explore</h4>
          </div>
          <div className='chooseCityMain row'>
          <div className="col-md-2 col-6 chooseCityChilds text-center">
            <FaCity />
            <h6>DELHI</h6>
          </div>
          <div className="col-md-2 col-6 chooseCityChilds text-center">
            <FaCity />
            <h6>MUMBAI</h6>
          </div>
          <div className="col-md-2 col-6 chooseCityChilds text-center">
            <FaCity />
            <h6>KOLKATA</h6>
          </div>
          <div className="col-md-2 col-6 chooseCityChilds text-center">
            <FaCity />
            <h6>BANGLORE</h6>
          </div>
          <div className="col-md-2 col-6 chooseCityChilds text-center">
            <FaCity />
            <h6>CHENNAI</h6>
          </div>
          <div className="col-md-2 col-6 chooseCityChilds text-center">
            <FaCity />
            <h6>BHOPAL</h6>
          </div>
          <div className="col-md-2 col-6 chooseCityChilds text-center">
            <FaCity />
            <h6>HYDERABAD</h6>
          </div>
          {/* <div className="chooseCityChilds text-center">
            <FaCity />
            <h6>INDORE</h6>
          </div> */}
          </div>
        </div>

        {/* <div className="slider-container">
          <Slider {...settings} className='homeMostVisitedPlaceSlider'>
            {places.map((place, index) => (
              <NavLink key={index} className="card">
                <div className="card-image-wrapper">
                  <div className="image-background">
                    <img src={place.img} alt={place.title} />
                    <div className="image-overlay"></div>
                    <div className={`status-tag ${place.tag === 'Closed' ? 'closed' : 'open'}`}>{place.tag}</div>
                    <div className="info-overlay">
                      <div className="typee"><span>{place.type}</span></div>
                    </div>
                  </div>
                </div>
                <div className='homeMostVisitedPlaceHedCardText'>
                  <h6 className="card-title">{place.title}</h5>
                  <p className="card-location"><FaLocationDot /> {place.location}</p>
                  <p className="card-phone"><FaPhoneAlt />{place.phone}</p>
                </div>
              </NavLink>
            ))}
          </Slider>
        </div> */}
      </div>
    </section>
  );
}

export default MostVisitedPlace;
