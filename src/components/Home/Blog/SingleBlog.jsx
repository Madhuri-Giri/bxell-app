import React, { useState, useEffect } from 'react'; 
import { NavLink } from 'react-router-dom';
import { fetchBlogRes } from "../../../API/apiServices";
import { useLocation } from 'react-router-dom';
const SingleBlog = () => {
    const [homeBlog, setHomeBlog] = useState([]);  // Initialize as an empty array
    
    const location = useLocation();
    const { id } = location.state || {}; // Retrieve the ID from state

    useEffect(() => {
        if (!id) {
            console.error("Blog ID is missing. Navigation state is not set.");
            return;
        }

        const fetchBlog = async () => {
            const data = await fetchBlogRes();
            console.log("Fetched Data:", data);

            if (data && Array.isArray(data)) {
                const blog = data.find((item) => item.id === id); // Find the blog by ID
                if (blog) {
                    setHomeBlog([blog]); // Set the blog data
                } else {
                    console.error("Blog with the given ID not found.");
                }
            } else {
                console.error("Error: Fetched data is not an array");
            }
        };

        fetchBlog();
    }, [id]);


    return (
        <>
         
         
        </>
    );
};

export default SingleBlog;
