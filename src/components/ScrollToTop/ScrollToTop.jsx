/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa'; // Example icon from react-icons
import './ScrollToTop.css'; // Import a CSS file for custom styles

function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled down
    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Scroll the page to the top
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // For smooth scrolling
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <div className="scroll-to-top">
            {isVisible && (
                <div onClick={scrollToTop} className="scroll-top-button">
                    <FaArrowUp />
                </div>
            )}
        </div>
    );
}

export default ScrollToTop;
