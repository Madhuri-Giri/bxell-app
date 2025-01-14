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
  const handleBlogClick = (blog) => {
    navigate('/single-blog', { state: { blog } }); // Pass blog data or just the ID
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
  const handleReadMoreClick = (e, id) => {
    e.stopPropagation();
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
            homeBlog.slice(0, 4).map((blog) => ( // Display only the first 4 blogs
              <div key={blog.id} className="col-lg-3 col-md-6 homeBlogBox">
                <div
                  className="image-link"
                  onClick={() => handleBlogClick(blog)} // Pass the blog data on click
                  style={{ cursor: "pointer" }}
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
                          : blog.description &&
                            blog.description
                              .replace(/(<([^>]+)>)/gi, "")
                              .split(" ")
                              .slice(0, 20)
                              .join(" ")}
                        {blog.description &&
                          blog.description.split(" ").length > 20 && (
                            <a
                              href="#"
                              className="read-more-link"
                              onClick={(e) => {
                                e.preventDefault();
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
              </div>
            ))
          ) : (
            <div className="data-not-found">
              <h4>Data Not Found</h4>
              <p>Loading Blogs...</p>
            </div>
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
