/* eslint-disable no-unused-vars */
import React from 'react'
import ScrollToTop from '../components/ScrollToTop/ScrollToTop'
import Footer from '../components/Footer/Footer'
import PropertyBuyList from '../components/Buy/BuyProperty/PropertyBuyList'
import Header from '../components/Header/Header'
import SellBanner from '../components/Sell/SellBanner'
import SellButtons from '../components/Sell/SellButtons'
import BrowserListing from '../components/Home/BrowserListing/BrowserListing'
import Blog from '../components/Home/Blog/Blog'

function Sell() {
    return (
        <>
            <Header />
            <SellBanner />
            <SellButtons />
            <BrowserListing />
            <Blog />
            <Footer />
            <ScrollToTop />
        </>
    )
}

export default Sell