/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import { MdKeyboardDoubleArrowRight } from 'react-icons/md'
import { NavLink } from 'react-router-dom'
import './BlogBanner.css';

const BlogBanner = ({title , bannerBreadCrumbs}) => {
    return (
        <>
            <section className='blogBannerSec'>
                <div className="blogOverlay"></div>
                <div className="container blog-text-container">
                    <div className="col-12 text-center">
                        <h4 className="blog-banner-title">{title}</h4>
                        <div className="breadcrumb">
                            <NavLink to="/" className="breadcrumb-link">Home </NavLink> <MdKeyboardDoubleArrowRight />{bannerBreadCrumbs}</div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default BlogBanner