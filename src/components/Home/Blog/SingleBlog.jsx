import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchBlogRes } from "../../../API/apiServices";
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import './SingleBlog.css'; // Import the CSS file for styling
import { Container } from 'react-bootstrap';

const SingleBlog = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBlog = async () => {
            const blogFromState = location.state?.blog;

            if (blogFromState) {
                setBlog(blogFromState);
                setLoading(false);
            } else {
                const blogs = await fetchBlogRes();
                const id = location.state?.id;
                const foundBlog = blogs?.find((b) => b.id === id);

                if (foundBlog) {
                    setBlog(foundBlog);
                } else {
                    console.error("Blog not found!");
                }
                setLoading(false);
            }
        };

        loadBlog();
    }, [location.state]);

    if (loading) {
        return <p className="loading-text">Loading blog...</p>;
    }

    if (!blog) {
        return <p className="error-text">Blog not found!</p>;
    }

    return (
        <>
            <Header />
            <Container>

            <section className="single-blog-section">
                <div className="container single-blog-container">
                    <h2 className="blog-title">{blog.title}</h2>
                    <div className="blog-content">
                        <img className="blog-image" src={blog.file_name} alt={blog.title} />
                        <div className="blog-text">
                            <p className="blog-description" dangerouslySetInnerHTML={{ __html: blog.description }}></p>
                            <p className="blog-date">Date: {blog.date}</p>
                        </div>
                    </div>
                </div>
            </section>
            </Container>
           
            <Footer />
        </>
    );
};

export default SingleBlog;
