import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBlogRes } from "../../API/apiServices";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";

const BlogMainContent = () => {
  const navigate = useNavigate();
  const [homeBlog, setHomeBlog] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 8;

  const handleBlogClick = (blog) => {
    navigate("/single-blog", { state: { blog } });
  };

  useEffect(() => {
    const fetchBlog = async () => {
      const data = await fetchBlogRes();
      if (data && Array.isArray(data)) {
        setHomeBlog(data);
      } else {
        console.error("Error: Fetched data is not an array");
      }
    };
    fetchBlog();
  }, []);

  const [expandedBlogId, setExpandedBlogId] = useState(null);

  const handleReadMoreClick = (e, id) => {
    e.stopPropagation();
    setExpandedBlogId(expandedBlogId === id ? null : id);
  };

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = homeBlog.slice(indexOfFirstBlog, indexOfLastBlog);

  const totalPages = Math.ceil(homeBlog.length / blogsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <Header />
      <section className="homeBrowserListingSec">
        <div className="overlay"></div>
        <div className="container homeBrowserListingSecHED">
          <div className="row">
            <div className="col-12">
              {/* <h2>Browse Blog List</h2> */}
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
            {currentBlogs.length > 0 ? (
              currentBlogs.map((blog) => (
                <div key={blog.id} className="col-lg-3 col-md-6 homeBlogBox">
                  <div className="image-link" onClick={() => handleBlogClick(blog)} style={{ cursor: "pointer" }} >
                    <div className="image-container">
                      <img  src={blog.file_name}  alt={blog.title}  className="card-img-top"  />
                      <div className="overlay">
                        <h6 className="overlay-text">{blog.title}</h6>
                        <div>
                          <button className="overlay-button"> {blog.date} </button>
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
                              <a href="#" className="read-more-link"  onClick={(e) => {  e.preventDefault(); handleReadMoreClick(blog.id); }} > {expandedBlogId === blog.id ? "Read Less"  : "Read More"} </a>
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

          {/* Pagination Controls */}
          <div className="row">
            <div className="col-12 pagination">
              <button  onClick={handlePreviousPage}  disabled={currentPage === 1} className="page-button" > Previous </button>
              {Array.from({ length: totalPages }, (_, index) => (
            <button key={index + 1} onClick={() => setCurrentPage(index + 1)} className={`page-button ${ currentPage === index + 1 ? "active" : "" }`} >
                  {index + 1}  </button>
              ))}
              <button onClick={handleNextPage} disabled={currentPage === totalPages} className="page-button" >  Next </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default BlogMainContent;
