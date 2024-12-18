/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BlogMainContent.css'; // Reuse the same CSS styles as the main blog page
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import blogImage_1 from '../../assets/Images/property-1.avif';
import blogImage_2 from '../../assets/Images/property-2.jpg';
import blogImage_3 from '../../assets/Images/property-3.avif';
import blogImage_4 from '../../assets/Images/property-4.avif';
import blogImage_5 from '../../assets/Images/property-5.webp';
import blogImage_6 from '../../assets/Images/business-1.webp';
import blogImage_7 from '../../assets/Images/business-2.jpg';
import blogImage_8 from '../../assets/Images/business-3.jpg';
import BlogBanner from './BlogBanner';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import ScrollToTop from '../ScrollToTop/ScrollToTop';

const BlogDetails = () => {
    const { id } = useParams(); // Get the blog ID from the URL
    const navigate = useNavigate();

    const [selectedCategory, setSelectedCategory] = useState('All');
    const categories = ['All', 'Business', 'Property'];

    const blogs = [
        {
            id: 1,
            title: "Modern Property Insights",
            image: blogImage_1,
            date: "Nov 19, 2024",
            time: "10:30 AM",
            tips: 5,
            comments: 12,
            text: "Discover the latest trends in modern property design and investment strategies for 2024.",
            category: "property",
        },
        {
            id: 2,
            title: "Starting Your Business Journey",
            image: blogImage_8,
            date: "Nov 20, 2024",
            time: "11:00 AM",
            tips: 3,
            comments: 8,
            text: "Explore tips for launching your business successfully in today’s competitive market.",
            category: "business",
        },
        {
            id: 3,
            title: "Luxury Homes in Focus",
            image: blogImage_3,
            date: "Nov 21, 2024",
            time: "1:00 PM",
            tips: 7,
            comments: 15,
            text: "Luxury homes are setting new standards for comfort and style. Here’s what’s trending.",
            category: "property",
        },
        {
            id: 4,
            title: "Scaling Up Your Business",
            image: blogImage_7,
            date: "Nov 21, 2024",
            time: "1:00 PM",
            tips: 7,
            comments: 15,
            text: "Learn strategies for taking your business to the next level with growth-focused solutions.",
            category: "business",
        },
        {
            id: 5,
            title: "Vacation Properties: Worth the Investment?",
            image: blogImage_5,
            date: "Nov 21, 2024",
            time: "1:00 PM",
            tips: 7,
            comments: 15,
            text: "Vacation properties are gaining traction as a profitable investment opportunity.",
            category: "property",
        },
        {
            id: 6,
            title: "Digital Tools for Entrepreneurs",
            image: blogImage_6,
            date: "Nov 21, 2024",
            time: "1:00 PM",
            tips: 7,
            comments: 15,
            text: "Discover essential digital tools that can help entrepreneurs streamline their operations.",
            category: "business",
        },
        {
            id: 7,
            title: "Affordable Housing Options",
            image: blogImage_2,
            date: "Nov 21, 2024",
            time: "1:00 PM",
            tips: 7,
            comments: 15,
            text: "Affordable housing solutions are redefining accessibility in urban and suburban areas.",
            category: "property",
        },
        {
            id: 8,
            title: "Building a Strong Business Network",
            image: blogImage_4,
            date: "Nov 21, 2024",
            time: "1:00 PM",
            tips: 7,
            comments: 15,
            text: "Networking is key to business success. Here’s how to build meaningful connections.",
            category: "business",
        },
    ];

    // Find the blog by ID
    const blog = blogs.find((b) => b.id === parseInt(id));

    if (!blog) {
        return <p>Blog not found</p>;
    }

    const filteredBlogs = selectedCategory === 'All'
        ? blogs
        : blogs.filter((b) => b.category === selectedCategory);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    return (
        <>
            <Header />
            <BlogBanner title={'Blog Details'} bannerBreadCrumbs={'Blog Details'} />
            <section className="blogMainContentSec">
                <div className="container">
                    <div className="row">
                        <div className="col-8">
                            <div className="blog-card">
                                <div className="blog-image">
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="img-fluid"
                                    />
                                </div>
                                <div className="blog-content">
                                    <h2 className="blog-header">{blog.title}</h2>
                                    <div className="blog-meta">
                                        <span className="blog-date">Date: {blog.date}</span>
                                        <span className="blog-time">Time: {blog.time}</span>
                                        <span className="blog-comments">Comments: {blog.comments}</span>
                                    </div>
                                    <p className="blog-text">
                                        {blog.text}
                                    </p>
                                    <button
                                        className="read-more"
                                        onClick={() => navigate(-1)}
                                    >
                                        Back to Blogs <MdKeyboardDoubleArrowRight />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="category-filter">
                                <h3>Filter by Category</h3>
                                <ul className="category-list">
                                    {categories.map((category) => (
                                        <li
                                            key={category}
                                            className={`category-item ${selectedCategory === category ? 'active' : ''
                                                }`}
                                            onClick={() => handleCategoryChange(category)}
                                            style={{
                                                cursor: 'pointer',
                                                color: selectedCategory === category ? '#007bff' : '#333',
                                                fontWeight: selectedCategory === category ? 'bold' : 'normal',
                                            }}
                                        >
                                            {category}
                                        </li>
                                    ))}
                                </ul>
                                {/* {filteredBlogs.length > 0 && (
                                    <div className="filtered-blogs">
                                        {filteredBlogs.map((b) => (
                                            <div key={b.id} onClick={() => navigate(`/blog-details/${b.id}`)} style={{ cursor: 'pointer', marginBottom: '10px' }}>
                                                <h4>{b.title}</h4>
                                            </div>
                                        ))}
                                    </div>
                                )} */}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
            <ScrollToTop />
        </>
    );
};

export default BlogDetails;
