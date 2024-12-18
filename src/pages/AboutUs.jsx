/* eslint-disable no-unused-vars */
import React from 'react'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import Banner from '../components/About/About-Banner/Banner'
import AboutBanner2 from '../components/About/Banner-2/AboutBanner2'
import HowItWorks from '../components/About/How-it-works/HowItWorks'
import ChoosePlan from '../components/About/Choose-Plan/ChoosePlan'
import ScrollToTop from '../components/ScrollToTop/ScrollToTop'
import WhatSayCustomer from '../components/Home/WhatSayCustomer/WhatSayCustomer'
import AboutFirstSec from '../components/About/AboutFirstSec/AboutFirstSec'

function AboutUs() {
    return (
        <>
            <Header />
            <Banner />
            <AboutFirstSec/>
            <WhatSayCustomer />
            <AboutBanner2 />
            <HowItWorks />
            {/* <ChoosePlan /> */}
            <Footer />
            <ScrollToTop/>
        </>
    )
}

export default AboutUs