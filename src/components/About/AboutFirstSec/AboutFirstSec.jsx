/* eslint-disable no-unused-vars */
import React from 'react';
import "./AboutFirstSec.css";
import aboutFirstSec from '../../../assets/Images/utf_listing_item-01.jpg';

function AboutFirstSec() {
    return (
        <>
            <section className='aboutFirstSec'>
                <div className="container">
                    <div className="row">
                        {/* Image Column */}
                        <div className="col-lg-6 col-md-12 aboutFirstSecColImg order-md-1 order-1">
                            <img className='img-fluid' src={aboutFirstSec} alt="About BXELL" />
                        </div>

                        {/* Text Column */}
                        <div className="col-lg-6 col-md-12 aboutFirstSecColTxt order-md-2 order-2">
                            <h3>You Read About <span>BXELL</span></h3>
                            <div className='aboutFirstSecBorder'><span></span></div>
                            <p>At Bxell, we believe that every business—big or small—has the power to shape lives and communities. Our mission is simple: to connect aspiring entrepreneurs with businesses that are ready for a new chapter. Whether you’re looking to sell your thriving venture or take the leap into business ownership, Bxell is your trusted partner, providing a seamless platform for opportunity to meet ambition. We’re here to simplify the process, so you can focus on what truly matters—making dreams a reality.</p>
                            <p>Think of us as the matchmakers of the business world, pairing passionate buyers with businesses brimming with potential. No endless paperwork, no hidden hurdles—just a straightforward way to find or sell what matters most. At Bxell, every listing represents a story waiting to unfold, and we’re proud to play a small part in bringing those stories to life. Ready to make your next big move? Let’s build the future, one business at a time.</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default AboutFirstSec;
