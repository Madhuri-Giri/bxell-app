/* eslint-disable no-unused-vars */
import React from 'react'
import { NavLink } from 'react-router-dom'
import './AboutBanner2.css';

function AboutBanner2() {
    return (
        <>
            <section className='aboutBannerSec-2'>
                <div className="aboutBanner_2_Overlay"></div>
                <div className="container aboutBanner_2-text-container">
                    <div className="col-12">
                        <div className='aboutbanner_2hed'>
                            <h1 className="">Run and Grow Your Business With Listing
                                Star from Anywhere</h1>
                        </div>
                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quidem amet, autem similique minus veniam porro sequi laborum molestiae. Saepe ut minus nulla quasi quo porro dolorum debitis quam dolores sunt. Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta quibusdam non nesciunt cumque odit, eligendi ex totam minus atque unde aperiam molestias tempora consequatur soluta neque alias eos officiis voluptates!</p>
                        <NavLink to="" className="">Get Started </NavLink>
                    </div>
                </div>
            </section>
        </>
    )
}

export default AboutBanner2