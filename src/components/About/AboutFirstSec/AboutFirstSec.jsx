/* eslint-disable no-unused-vars */
import React from 'react';
import "./AboutFirstSec.css";
import aboutFirstSec from '../../../assets/Images/utf_listing_item-01.jpg';

function AboutFirstSec() {
    return (
        <>
            <section className='aboutFirstSec'>
                <div className="container">
                    <div className="row">
                        {/* Image Column */}
                        <div className="col-lg-6 col-md-12 aboutFirstSecColImg order-md-1 order-1">
                            <img className='img-fluid' src={aboutFirstSec} alt="About BXELL" />
                        </div>

                        {/* Text Column */}
                        <div className="col-lg-6 col-md-12 aboutFirstSecColTxt order-md-2 order-2">
                            <h3>You Read About <span>BXELL</span></h3>
                            <div className='aboutFirstSecBorder'><span></span></div>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero ab ea placeat eaque facere numquam nostrum iste nesciunt ipsa amet quasi, aperiam mollitia perferendis, distinctio, perspiciatis ratione excepturi. Voluptatibus, sunt.</p>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur, ut accusamus aspernatur maiores quam, incidunt nemo sunt ipsa nobis doloremque exercitationem hic facilis qui atque, veritatis praesentium vero ratione aliquid Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis sequi explicabo non, qui praesentium, aliquid corrupti facere illum aperiam doloribus ipsum voluptatibus libero, consectetur suscipit maiores corporis numquam nobis quasi.</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default AboutFirstSec;
