/* eslint-disable no-unused-vars */
import React from 'react'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import ScrollToTop from '../components/ScrollToTop/ScrollToTop'
import SellPropertyBanner from '../components/SellProperty/SellPropertyBanner/SellPropertyBanner'
import SellPropertyForm from '../components/SellProperty/SellPropertyForm/SellPropertyForm'

function SellProperty() {
  return (
    <>
            <Header />
            <SellPropertyBanner title="LIST YOUR PROPERTY"/>           
            <SellPropertyForm/>           
            <Footer />
            <ScrollToTop />
        </>
  )
}

export default SellProperty