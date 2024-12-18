/* eslint-disable no-unused-vars */
import React from 'react';
import "./MostPopulerCity.css";
import { NavLink } from 'react-router-dom';

function MostPopulerCity() {
    return (
        <>
            <section className='homeMostPopularcitySec'>
                <div className="container">
                    <div className="row">
                        <div className="col-12 homeMostPopularcitySecHED">
                            <h4>Most Popular Cities/Towns</h4>
                            <p>Discover the best things to do, restaurants, shopping, hotels, cafes, and places around the world by categories.</p>
                        </div>
                        {/* Card Columns */}
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div className="col-lg-4 col-md-6" key={index}>
                                <NavLink to='/' className='homeMostPopularcitySecMainCard'>
                                    <div className="image-container">
                                        <div className="image"></div>
                                    </div>
                                    <div className="overlay"></div>
                                    <div className="card-link">
                                        <p> Nightlife</p>
                                        <botton>Listings</botton>
                                    </div>
                                </NavLink>
                            </div>
                        ))}
                    </div>
                    <div className='exploreMoreListingBtnDiv'>
                        <NavLink to='explore-listings' className='exploreMoreListingBtn'>Explore More Listing</NavLink>
                    </div>
                </div>
            </section>
        </>
    );
}

export default MostPopulerCity;
