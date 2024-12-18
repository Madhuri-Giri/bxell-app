/* eslint-disable no-unused-vars */
import React from 'react'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import ScrollToTop from '../components/ScrollToTop/ScrollToTop'
import ProfileMain from '../components/Profile/ProfileMain'

function Profile() {
    return (
        <>
            <Header />
            <ProfileMain/>
            <Footer />
            <ScrollToTop />
        </>
    )
}

export default Profile