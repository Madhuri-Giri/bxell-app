/* eslint-disable no-unused-vars */
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Banner.css';
import { MdKeyboardDoubleArrowRight } from 'react-icons/md';

function Banner() {
  return (
    <>
      <section className='aboutBannerSec'>
        <div className="aboutOverlay"></div>
        <div className="container about-text-container">
          <div className="col-12 text-center">
            <h4 className="about-banner-title">About Us</h4>
            <div className="breadcrumb">
              <NavLink to="/" className="breadcrumb-link">Home </NavLink> <MdKeyboardDoubleArrowRight /> About
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Banner;

