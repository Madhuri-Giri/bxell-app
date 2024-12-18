/* eslint-disable no-unused-vars */
import React from 'react'
import "./AboutFirstSec.css";
import aboutFirstSec from '../../../assets/Images/utf_listing_item-01.jpg';
// import listingImg_1 from '../../assets/Images/utf_listing_item-01.jpg';

function AboutFirstSec() {
    return (
        <>
            <section className='aboutFirstSec'>
                <div className="container">
                    <div className="row">
                        <div className="col-6 aboutFirstSecColImg">
                            <img className='img-fluid' src={aboutFirstSec} />
                        </div>
                        <div className="col-6 aboutFirstSecColTxt">
                            <h3>You Read About <span>BXELL</span></h3>
                            <div className='aboutFirstSecBorder'><span></span></div>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero ab ea placeat eaque facere numquam nostrum iste nesciunt ipsa amet quasi, aperiam mollitia perferendis, distinctio, perspiciatis ratione excepturi. Voluptatibus, sunt.</p>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur, ut accusamus aspernatur maiores quam, incidunt nemo sunt ipsa nobis doloremque exercitationem hic facilis qui atque, veritatis praesentium vero ratione aliquid Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis sequi explicabo non, qui praesentium, aliquid corrupti facere illum aperiam doloribus ipsum voluptatibus libero, consectetur suscipit maiores corporis numquam nobis quasi.</p>
                        </div>

                    </div>
                </div>
            </section>
        </>
    )
}

export default AboutFirstSec