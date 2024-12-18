import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { fetchBlogRes } from "../../../API/apiServices";
import { useNavigate } from "react-router-dom";
import "./Blog.css";

function Blog() {
  const [homeBlog, setHomeBlog] = useState([]); // Initialize as an empty array
  const [expandedBlogId, setExpandedBlogId] = useState(null); // Track the expanded blog
  const navigate = useNavigate();

  // Function to handle navigation
  const handleNavigate = (id) => {
    console.log("Navigating with ID:", id); // Debugging
    if (!id) {
      console.error("Error: Blog ID is missing!");
      return;
    }
    navigate("/single-blog", { state: { id } });
  };
  

  // Fetch blogs from the API
  useEffect(() => {
    const fetchBlog = async () => {
      const data = await fetchBlogRes();
      console.log("Fetched blog Data:", data); // Debugging API response
      if (data && Array.isArray(data)) {
        setHomeBlog(data); // Set the blogs if data is valid
      } else {
        console.error("Error: Fetched data is not an array");
      }
    };

    fetchBlog();
  }, []);

  // Handle "Read More" toggle
  const handleReadMoreClick = (id) => {
    setExpandedBlogId(expandedBlogId === id ? null : id); // Toggle expanded state
  };

  return (
    <section className="homeBlogSec">
      <div className="container">
        <div className="row">
          <div className="col-12 homeBlogHed">
            <h5>Latest Tips & Blog</h5>
            <p>Discover & connect with top-rated local businesses</p>
          </div>

          {/* Render blogs */}
          {Array.isArray(homeBlog) && homeBlog.length > 0 ? (
            homeBlog.slice(0, 4).map((blog) => (
              <div key={blog.id} className="col-lg-3 col-md-6 homeBlogBox">
                <div className="image-container">
                  {/* Blog Image with Dynamic Navigation */}
                  <img
                    src={blog.file_name}
                    alt={blog.title}
                    className="card-img-top"
                    onClick={() => handleNavigate(blog.id)} // Pass dynamic ID
                  />

                  <div className="overlay">
                    <h6 className="overlay-text">{blog.title}</h6>
                    <div>
                      <button className="overlay-button">{blog.date}</button>
                    </div>
                    <p className="overlay-text">
                      {
                        expandedBlogId === blog.id
                          ? blog.description.replace(/(<([^>]+)>)/gi, "") // Full description
                          : blog.description &&
                            blog.description
                              .replace(/(<([^>]+)>)/gi, "") // Truncated description
                              .split(" ")
                              .slice(0, 20)
                              .join(" ") + "..." // Append ellipsis
                      }
                      {blog.description &&
                        blog.description.split(" ").length > 20 && (
                          <a
                            href="#"
                            className="read-more-link"
                            onClick={(e) => {
                              e.preventDefault(); // Prevent page refresh
                              handleReadMoreClick(blog.id);
                            }}
                          >
                            {expandedBlogId === blog.id
                              ? "Read Less"
                              : "Read More"}
                          </a>
                        )}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Loading blogs...</p>
          )}
        </div>

        <div className="exploreMoreListingBtnDiv">
          <NavLink to="/blog-details" className="exploreMoreListingBtn">
            Explore More Blog
          </NavLink>
        </div>
      </div>
    </section>
  );
}

export default Blog;
