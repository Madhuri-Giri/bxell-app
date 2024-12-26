import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios"; // Assuming you are using axios

function SingleBlog() {
  const { state } = useLocation(); // Get the passed state (blog ID)
  const { id } = state || {}; // Extract the ID from state

  const [blog, setBlog] = useState(null);

  useEffect(() => {
    if (id) {
      // Fetch blog data based on the ID
      axios
        .get(`https://bxell.com/bxell/admin/api/get-blog/${id}`) // Adjust the URL based on your API
        .then((response) => {
          if (response.data.result && response.data.blog) {
            setBlog(response.data.blog); // Set the blog data
          } else {
            console.error("Blog not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching blog data:", error);
        });
    }
  }, [id]);

  if (!blog) {
    return <p>Loading blog...</p>; // Show loading while fetching
  }

  return (
    <section className="singleBlogPage">
      <div className="container">
        <h2>{blog.title}</h2>
        <p><strong>Date:</strong> {blog.date}</p>
        <div dangerouslySetInnerHTML={{ __html: blog.description }} /> {/* Render HTML content */}
        <img src={blog.file_name} alt={blog.title} /> {/* Display image */}
      </div>
    </section>
  );
}

export default SingleBlog;
