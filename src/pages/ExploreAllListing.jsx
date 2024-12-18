/* eslint-disable no-unused-vars */
import React from 'react'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import ScrollToTop from '../components/ScrollToTop/ScrollToTop'
import ExploreListsComponant from '../components/ExploreListing/ExploreListsComponant'
import ExploreListsBAnner from '../components/ExploreListing/ExploreListsBAnner'

function ExploreAllListing() {
    return (
        <>
            <Header />
            <ExploreListsBAnner />           
            <ExploreListsComponant />           
            <Footer />
            <ScrollToTop />
        </>
    )
}

export default ExploreAllListing