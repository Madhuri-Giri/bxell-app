/* eslint-disable no-unused-vars */
import React from 'react'
import BlogBanner from '../components/Blog/BlogBanner'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import ScrollToTop from '../components/ScrollToTop/ScrollToTop'
import BlogMainContent from '../components/Blog/BlogMainContent'

const Blog = () => {
    return (
        <>
            <Header />
            <BlogBanner title={'Blog'} bannerBreadCrumbs={'Blog'} />
            <BlogMainContent />           
            <Footer />
            <ScrollToTop/>
        </>
    )
}

export default Blog