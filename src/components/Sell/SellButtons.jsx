/* eslint-disable no-unused-vars */
import React from 'react'
import './SellButtons.css';
import { NavLink } from 'react-router-dom';

function SellButtons() {
    return (
        <>
            <section>
           
                   <div className='banner_sell_img'>
                   <div className="container">
                    <div className="row sellMainBtnRow">
                        {/* <h1>SELL</h1> */}
                        <div className="col-md-5 sellMainBtnBuisness">
                            <NavLink to="/sell-business">
                                <h2><span>LIST BUSINESS</span></h2>
                                <p className=''><span>TO SELL</span></p>
                            </NavLink>
                        </div>
                        <div className="col-md-5 sellMainBtnProperty">
                            <NavLink to="/sell-property">
                                <h2><span>LIST PROPERTIES</span></h2>
                                <p className=''><span>TO SELL, RENT OR LEASE</span></p>
                            </NavLink>
                       
                    </div>
                </div>
                </div>
                   </div>
               
                
            </section>

        </>
    )
}

export default SellButtons