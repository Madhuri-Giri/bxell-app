/* eslint-disable no-unused-vars */
import React from 'react'
import { MdKeyboardDoubleArrowRight } from 'react-icons/md'
import { NavLink } from 'react-router-dom'

function SellBanner() {
    return (
        <>
            <section className='aboutBannerSec'>
                <div className="aboutOverlay"></div>
                <div className="container about-text-container">
                    <div className="col-12 text-center">
                        <h4 className="about-banner-title">Sell</h4>
                        <div className="breadcrumb">
                            <NavLink to="/" className="breadcrumb-link">Home </NavLink> <MdKeyboardDoubleArrowRight /> Sell
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default SellBanner