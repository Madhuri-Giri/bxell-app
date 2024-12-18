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
            name: "Denwen Evil",
            title: "Web Developer",
            text: "Lorem Ipsum is simply dummy text of the printing and type setting industry. Lorem Ipsum has been the industry's standard dummy text ever since...",
            profile: profile_1,
        },
        {
            name: "Denwen Evil",
            title: "Web Developer",
            text: "Lorem Ipsum is simply dummy text of the printing and type setting industry. Lorem Ipsum has been the industry's standard dummy text ever since...",
            profile: profile_2,
        },
        {
            name: "Denwen Evil",
            title: "Web Developer",
            text: "Lorem Ipsum is simply dummy text of the printing and type setting industry. Lorem Ipsum has been the industry's standard dummy text ever since...",
            profile: profile_1,
        },
        {
            name: "Denwen Evil",
            title: "Web Developer",
            text: "Lorem Ipsum is simply dummy text of the printing and type setting industry. Lorem Ipsum has been the industry's standard dummy text ever since...",
            profile: profile_3,
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
