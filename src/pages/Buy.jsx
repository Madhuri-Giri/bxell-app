/* eslint-disable no-unused-vars */
import React from 'react'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import ScrollToTop from '../components/ScrollToTop/ScrollToTop'
import BuyBanner from '../components/Buy/BuyBanner/BuyBanner'
import PropertyBuyList from '../components/Buy/BuyProperty/PropertyBuyList'

function Buy() {
    return (
        <>
            <Header />
            <BuyBanner/>
            <PropertyBuyList/>
            <Footer />
            <ScrollToTop />

        </>
    )
}

export default Buy