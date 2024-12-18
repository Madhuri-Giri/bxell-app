/* eslint-disable no-unused-vars */
import React from 'react'
import './ChoosePlan.css';
import { NavLink } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';

function ChoosePlan() {
    // const arr1 = ['as', 'hh', 'ar'];
    // const arr2 = ['sh', 'ab', 'nam'];
    // const mainArr = [...arr1, ...arr2]
    // console.log(mainArr);

    return (
        <>
            <section className='aboutChoosePlanSec'>
                <div className="container aboutChoosePlanSecCont">
                    <div className="row">
                        <div className="col-12 aboutChoosePlanSecMainDiv">
                            <div className='aboutChoosePlanSecMainDivHED'>
                                <h3>Choose Your Plan</h3>
                                <p>Discover & connect with top-rated local businesses</p>
                            </div>
                            <div className="row">
                                <div className="col-lg-3 col-md-6">
                                    <div className='choosePlanBox'>
                                        <div className='choosePlanBoxSKyBlue'>
                                            <h4>boost listing for a week </h4>
                                            <p className='ChoosePlanPrice'> <strong>49</strong> / listing</p>
                                        </div>
                                        <div className='choosePlanBoxWhite'>
                                            <div className='orderButton'>
                                                <NavLink  to="/boost-listing"> <FiShoppingCart /> Order Now</NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6">
                                    <div className='choosePlanBox'>
                                        <div className='choosePlanBoxSKyBlue'>
                                            <h4>Boost listing for a Month</h4>
                                            <p className='ChoosePlanPrice'> <strong> 149</strong> / listing</p>
                                        </div>
                                        <div className='choosePlanBoxWhite'>

                                            <div className='orderButton'>
                                                <NavLink to="/boost-listing1"> <FiShoppingCart /> Order Now</NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6">
                                    <div className='choosePlanBox'>
                                        <div className='choosePlanBoxSKyBlue'>
                                            <h4>Basic Property listing </h4>
                                            <p className='ChoosePlanPrice'> <strong>199</strong> / listing</p>
                                        </div>
                                        <div className='choosePlanBoxWhite'>
                                            <div className='orderButton'>
                                            <NavLink to="/sell-property"> <FiShoppingCart /> Order Now</NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6">
                                    <div className='choosePlanBox'>
                                        <div className='choosePlanBoxSKyBlue'>
                                            <h4>Basic business listing </h4>
                                            <p className='ChoosePlanPrice'> <strong>299</strong> / listing</p>
                                        </div>
                                        <div className='choosePlanBoxWhite'>

                                            <div className='orderButton'>
                                            <NavLink to="/sell-business"> <FiShoppingCart /> Order Now</NavLink>
                                            </div>
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

export default ChoosePlan