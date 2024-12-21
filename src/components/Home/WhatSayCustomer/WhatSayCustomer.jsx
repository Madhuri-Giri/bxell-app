/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import "./WhatSayCustomer.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import profile_1 from '../../../assets/Images/happy-client-01.jpg';
import profile_2 from '../../../assets/Images/happy-client-02.jpg';
import profile_3 from '../../../assets/Images/happy-client-03.jpg';
import Slider from 'react-slick';
import { text } from '@fortawesome/fontawesome-svg-core';

function WhatSayCustomer() {
    const [activeSlide, setActiveSlide] = useState(0);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        centerMode: true, // Enable center mode
        centerPadding: '0', // No padding on the sides, can adjust if needed
        arrows: false,
        beforeChange: (current, next) => setActiveSlide(next),
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                    centerMode: true, // Keep center mode for smaller screens
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    centerMode: true, // Keep center mode for even smaller screens
                    slidesToScroll: 1,
                },
            },
        ],
    };

    const testimonials = [
        {
            name: "Vignesh",
            title: "Investor",
            text: "I found Bxell.com to be very easy to use. I was able to browse business listings without any hassle, and the details provided for each business were comprehensive. I ended up buying a small business, and the entire process went smoothly. Highly recommend this platform for anyone looking to invest in a business!",
            profile: profile_1,
        },
        {
            name: "Anjali M.",
            title: "Business Owner",
            text: "I listed my boutique for sale on Bxell.com, and within two weeks, I received multiple inquiries. The premium listing option really helped boost visibility and I’m very happy with the results",
            profile: profile_2,
        },
        {
            name: "Vaibav",
            title: "Entrepreneur",
            text: "I love how Bxell.com doesn’t require mandatory registration for browsing listings, So i view this as a great platform for connecting buyers and sellers.",
            profile: profile_1,
        },
        {
            name: "Priya Suresh",
            title: "Seller",
            text: "The platform is user-friendly, and the payment process for boosting my listing was smooth. However, I feel it would be even better if there were tools like chat options or buyer-seller feedback to make communication easier. Overall, I’m satisfied.",
            profile: profile_3,
        },
        {
            name: "Rohit Moorthy",
            title: "Business ",
            text: "I was struggling to find a buyer for my small IT company. After listing it on Bxell.com, I was surprised by the number of inquiries I received within a week. The boost feature is definitely worth it. I’ll use this platform again if needed.",
            profile: profile_1,
        },
        {
            name: "Deepak",
            title: "Buyer",
            text:"The concept of connecting buyers and sellers is amazing, and the platform is simple to navigate. However, I came across a few listings that seemed misleading. I appreciate that fraudulent listings are removed, but stricter moderation would make this even better",
            profile: profile_2,
        },
        {
            name: "Bitto Xavier",
            title: "First-time Buyer",
            text:"As someone new to buying businesses, I found Bxell.com extremely helpful. The website provides clear details about each listing, making it easier to evaluate opportunities. I purchased a small franchise through the platform and am very happy!",
            profile: profile_3,
        },
        {
            name: "Sundharam",
            title: "Seller",
            text:"The pricing for premium and boost listings is very reasonable. I liked how simple the listing process was, and the OTP verification adds a layer of trust. Highly recommend Bxell.com for anyone selling their business!",
            profile: profile_1,
        }
    ];

    return (
        <>
            <section className='homeWhatSayCustomerSec'>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12 homeWhatSayCustomerSecHed">
                            <h4>What Say Our Customers</h4>
                            <p>Lorem Ipsum is simply dummy text of the printing and type setting industry. Lorem Ipsum has been the industry's standard dummy text ever since...</p>
                        </div>
                    </div>
                    <Slider {...settings}>
                        {testimonials.map((testimonial, index) => (
                            <div
                                className={`testimonial ${index === activeSlide ? 'active' : ''}`}
                                key={index}
                            >
                                <div
                                    className={`testimonialBox ${index === activeSlide ? 'active' : ''}`}
                                >
                                    <p>{testimonial.text}</p>
                                </div>
                                {index === activeSlide && (
                                    <div className="utf_testimonial_author">
                                        <img src={testimonial.profile} alt={`${testimonial.name}'s profile`} />
                                        <h4>{testimonial.name}</h4>
                                        <p>{testimonial.title}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </Slider>
                </div>
            </section>
        </>
    );
}

export default WhatSayCustomer;
