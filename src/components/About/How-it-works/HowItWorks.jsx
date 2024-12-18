/* eslint-disable no-unused-vars */
import React from 'react'
import './HowItWorks.css';
import { IoLocationOutline } from 'react-icons/io5';
import { LuMailPlus } from 'react-icons/lu';
import { TfiUser } from 'react-icons/tfi';

function HowItWorks() {
    return (
        <>
            <section className='aboutHowItWorksSec'>
                <div className="container aboutHowItWorksCont">
                    <div className="row">
                        <div className="col-12 aboutHowItWorksMainDiv">
                            <div className='aboutHowItWorksMainDivHED'>
                                <h3>How it Works ? </h3>
                                <p>Discover & connect with great local businesses</p>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className='howItworksBox'>
                                            <IoLocationOutline />
                                            <h5>Find Interesting Place</h5>
                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in pulvinar neque Nulla finibus.</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className='howItworksBox'>
                                            <LuMailPlus />
                                            <h5>Contact a Few Owners</h5>
                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in pulvinar neque Nulla finibus.</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className='howItworksBox'>
                                            <TfiUser />
                                            <h5>Make a Reservation</h5>
                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in pulvinar neque Nulla finibus.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
        </>
    )
}

export default HowItWorks