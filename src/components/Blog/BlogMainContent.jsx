import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { fetchBlogRes } from "../../API/apiServices";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import { useNavigate } from 'react-router-dom';

const BlogMainContent = () => {
   
    const navigate = useNavigate();
    const [homeBlog, setHomeBlog] = useState([]);  // Initialize as an empty array
    
    const handleBlogClick = (blog) => {
        navigate('/single-blog', { state: { blog } }); // Pass blog data or just the ID
    };
    useEffect(() => {
        const fetchBlog = async () => {
            const data = await fetchBlogRes();
            console.log("Fetched Data:", data); // Log the fetched data

            if (data && Array.isArray(data)) {
                setHomeBlog(data);
            } else {
                console.error("Error: Fetched data is not an array");
            }
        };

        fetchBlog();
    }, []);

    const [expandedBlogId, setExpandedBlogId] = useState(null); // Track the expanded blog

    const handleReadMoreClick = (id) => {
        setExpandedBlogId(expandedBlogId === id ? null : id); // Toggle between expanded and collapsed
    };

    return (
        <>
              <Header/>
              <section className='homeBrowserListingSec'>
                <div className="overlay"></div>
                <div className="container homeBrowserListingSecHED">
                    <div className="row">
                        <div className="col-12 ">
                            <h2>Browse Blog List</h2>
                        </div>
                    </div>
                </div>
            </section>

            <section className="homeBlogSec">
                <div className="container">
                    <div className="row">
                        <div className="col-12 homeBlogHed">
                            <h5>Latest Tips & Blog</h5>
                            <p>Discover & connect with top-rated local businesses</p>
                        </div>
                        {Array.isArray(homeBlog) && homeBlog.length > 0 ? (
                            homeBlog.map((blog) => (
                                <div key={blog.id} className="col-lg-3 col-md-6 homeBlogBox">
                                    <div
                                        className="image-link"
                                        onClick={() => handleBlogClick(blog)} // Pass the blog data on click
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="image-container">
                                            <img
                                                src={blog.file_name}
                                                alt={blog.title}
                                                className="card-img-top"
                                            />
                                            <div className="overlay">
                                                <h6 className="overlay-text">{blog.title}</h6>
                                                <div>
                                                    <button className="overlay-button">{blog.date}</button>
                                                </div>
                                                <p className="overlay-text">
                                                    {expandedBlogId === blog.id
                                                        ? blog.description.replace(/(<([^>]+)>)/gi, "")
                                                        : blog.description && blog.description.replace(/(<([^>]+)>)/gi, "")
                                                            .split(" ")
                                                            .slice(0, 20)
                                                            .join(" ")}
                                                    {blog.description && blog.description.split(" ").length > 20 && (
                                                        <a
                                                            href="#"
                                                            className="read-more-link"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleReadMoreClick(blog.id);
                                                            }}
                                                        >
                                                            {expandedBlogId === blog.id ? "Read Less" : "Read More"}
                                                        </a>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Loading blogs...</p>
                        )}
                    </div>
                </div>
            </section>
        <Footer/>
        </>
    );
};

export default BlogMainContent;
