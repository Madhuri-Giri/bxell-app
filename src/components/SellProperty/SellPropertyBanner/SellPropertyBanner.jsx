/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import { Button, Form } from 'react-bootstrap'
import { MdKeyboardDoubleArrowRight } from 'react-icons/md'
import { NavLink } from 'react-router-dom'

function SellPropertyBanner({title}) {
    return (
        <>
          <section className='aboutBannerSec'>
                <div className="aboutOverlay"></div>
                <div className="container about-text-container">
                    <div className="col-12 text-center">
                        <h4 className="about-banner-title">{title}</h4>
                        <div className="breadcrumb">
                            <NavLink to="/" className="breadcrumb-link">Home </NavLink> <MdKeyboardDoubleArrowRight /> SELL PROPERTY
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default SellPropertyBanner