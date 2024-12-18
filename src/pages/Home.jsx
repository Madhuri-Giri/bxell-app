/* eslint-disable no-unused-vars */
import React from 'react'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import MainBanner from '../components/Home/MainBanner/MainBanner'
import MostPopulerCity from '../components/Home/MostPopulerCity/MostPopulerCity'
import MostVisitedPlace from '../components/Home/MostVisitedPlace/MostVisitedPlace'
import Blog from '../components/Home/Blog/Blog'
import ScrollToTop from '../components/ScrollToTop/ScrollToTop'
import BrowserListing from '../components/Home/BrowserListing/BrowserListing'
import WhatSayCustomer from '../components/Home/WhatSayCustomer/WhatSayCustomer'
import ChoosePlan from '../components/About/Choose-Plan/ChoosePlan'
import RecomendedList from '../components/Home/Recomended/RecomendedList'

function Home() {
    return (
        <>
            <Header />
            <MainBanner />
            <RecomendedList />
            {/* <MostPopulerCity /> */}
            <MostVisitedPlace />
            <BrowserListing />
            <WhatSayCustomer />
            <Blog />
            <ChoosePlan />
            <Footer />
            <ScrollToTop />
        </>
    )
}

export default Home