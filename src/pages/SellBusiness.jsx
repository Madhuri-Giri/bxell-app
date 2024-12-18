/* eslint-disable no-unused-vars */
import React from 'react'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import ScrollToTop from '../components/ScrollToTop/ScrollToTop'
import SellBusinessBanner from '../components/SellBusiness/SellBusinessBanner/SellBusinessBanner'
import SellBusinessForm from '../components/SellBusiness/SellBusinessForm/SellBusinessForm'

function SellBusiness() {
    return (
        <>
            <Header />
            <SellBusinessBanner title="List your Business"/>  
            <SellBusinessForm />  
            <Footer />
            <ScrollToTop />
        </>
    )
}

export default SellBusiness