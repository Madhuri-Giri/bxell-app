import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { IoLocation } from "react-icons/io5";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import { useNavigate } from "react-router-dom";
import ScrollToTop from "../../ScrollToTop/ScrollToTop";
// import { fetchViewBusinessRes } from "../../../API/apiServices";
// import { fetchViewPropertyRes } from "../../../API/apiServices";
import {
  fetchViewBusinessRes,
  fetchViewPropertyRes,
  fetchPropertyRating,
  fetchBusinessRating,
} from "../../../API/apiServices";
import { useLocation } from "react-router-dom";
import "./PropertyBuySinglePage.css";
import { IoShareSocial, IoMail, IoCall } from "react-icons/io5";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { fetchPropertyRes, fetchBusinessRes } from "../../../API/apiServices";
import ReactStars from "react-rating-stars-component";

function PropertyBuySinglePage() {
  const location = useLocation();
  const [business, setBusiness] = useState(null);
  const [property, setProperty] = useState(null);
  const { type, id } = location.state || {};
  const [userRating, setUserRating] = useState(0); // To store user's rating
  const [averageRating, setAverageRating] = useState(0);
  const [homeProperty, setHomeProperty] = useState([]);
  const [homeBusiness, setHomeBusiness] = useState([]);
  const navigate = useNavigate();

  // Fetch the property data when the component mounts or the id/type changes
  useEffect(() => {
    if (type === "property" && id) {
      const fetchProperty = async () => {
        const fetchedProperty = await fetchViewPropertyRes(id);
        setProperty(fetchedProperty);
        setAverageRating(fetchedProperty.average_rating || 0);
      };
      fetchProperty();
    }
  }, [id, type]);

  useEffect(() => {
    if (type === "business" && id) {
      const fetchBusiness = async () => {
        const fetchedBusiness = await fetchViewBusinessRes(id);
        setBusiness(fetchedBusiness);
        setAverageRating(fetchedBusiness.average_rating || 0);
      };
      fetchBusiness();
    }
  }, [id, type]);

  // Function to handle rating submission
  const handleRatingChange = async (newRating) => {
    setUserRating(newRating);

    // Store the rating in localStorage
    localStorage.setItem(`${type}-${id}-rating`, newRating); // Use unique key for property/business

    try {
      if (type === "property") {
        await fetchPropertyRating(id, newRating); // Pass the property ID and rating
      } else if (type === "business") {
        await fetchBusinessRating(id, newRating); // Pass the business ID and rating
      }
      alert("Thank you for rating!");
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  useEffect(() => {
    // Check if a rating exists in localStorage for the specific property or business
    const storedRating = localStorage.getItem(`${type}-${id}-rating`);
    if (storedRating) {
      setUserRating(Number(storedRating)); // Restore the stored rating
    }
  }, [id, type]); // This ensures the effect runs when the component mounts or id/type changes

  const handlepropertyNavigate = (type, id) => {
    console.log("Navigating with type:", type, "and ID:", id);
    fetchViewPropertyRes(id); // Ensure you call the function here
    navigate("/single-page", { state: { type, id } });
  };

  useEffect(() => {
    const fetchProperty = async () => {
      const data = await fetchPropertyRes();
      console.log("Fetched Property Data:", data); // Log the full fetched data

      if (data && Array.isArray(data)) {
        setHomeProperty(data);

        // Extract and log IDs
        const propertyIds = data.map((item) => item.id);
        console.log("Property IDs:", propertyIds); // Log all property IDs
      } else {
        console.error("Error: Fetched property data is not an array");
      }
    };

    fetchProperty();
  }, []);

  const handlebusinessNavigate = (type, id) => {
    console.log("Navigating with type:", type, "and ID:", id);
    fetchViewBusinessRes(id); // Ensure you call the function here
    navigate("/single-page", { state: { type, id } });
  };

  useEffect(() => {
    const fetchBusiness = async () => {
      const data = await fetchBusinessRes();
      console.log("Fetched Business Data:", data); // Log the full fetched data

      if (data && Array.isArray(data)) {
        setHomeBusiness(data);

        // Extract and log IDs
        const businessIds = data.map((item) => item.id);
        console.log("Business IDs:", businessIds); // Log all business IDs
      } else {
        console.error("Error: Fetched business data is not an array");
      }
    };

    fetchBusiness();
  }, []);

  return (
    <>
      <Header />

      <section className="propertyBuyListingSec">
        <div className="space_r_l">
          <div className="container">
          <div className=" row single_container">
               {/* Conditionally render Property or Business */}
               {type === "property" && property && (
                <div className="col-9">
                  <>
                    <div className="single_box">
                      <div className="row">
                        <div className="col-6 ">
                          <h1>{property.property_title}</h1>
                          <div className="boldBorder"></div>
                          <div className="prop_type">
                            <h6> Property Type : <span>{property.property_type}</span> </h6>
                          </div>
                        </div>
                        <div className="col-6 d-flex justify-content-between align-items-center">
                          <div className="propertyBuyListingActions">
                            <button> <IoShareSocial /> Share </button>
                            <button> <IoMail /> Mail </button>
                            <button>  <IoCall /> Call </button>
                          </div>
                          <div className="business_rating">
                            {/* Star Rating Section */}
                            {/* <h5>Rate this Property</h5> */}
                            <ReactStars  count={5} size={25}   activeColor="#ffd700"  value={userRating || averageRating}  onChange={handleRatingChange} />
                            {/* <p>Average Rating: {averageRating.toFixed(1)}</p> */}
                          </div>
                        </div>
                      </div>

                      <div className="row propertyBuyListingRow_1 propertySinglePage">
                        <div className="col-6">
                          <img  className="img-fluid"  src={(() => {  try {   const fileName = property.file_name;

                                // Parse the file_name if it's a JSON string
                                const files =
                                  typeof fileName === "string" &&
                                  fileName.startsWith("[")
                                    ? JSON.parse(fileName)
                                    : fileName;

                                if (typeof files === "string") {
                                  // Single image case
                                  return files.startsWith("http")
                                    ? files
                                    : `${BASE_URL}/${files}`;
                                } else if (
                                  Array.isArray(files) &&
                                  files.length > 0
                                ) {
                                  // Multiple images case
                                  return files[0].startsWith("http")
                                    ? files[0]
                                    : `${BASE_URL}/${files[0]}`;
                                } else {
                                  // Default image as fallback
                                  return "default-image.jpg";
                                }
                              } catch (error) {
                                console.error(
                                  "Error parsing or handling file_name:",
                                  error
                                );
                                return "default-image.jpg"; // Fallback in case of error
                              }
                            })()}
                            alt={property.title || "business Image"}
                          />
                        </div>

                        <div className="col-6">
                          <div className="row">
                            <div className="col-6 ask_price">
                              <h6> Asking Price : <span>{property.asking_price} </span> </h6>
                            </div>
                            <div className="col-6">
                              <h6> <IoLocation /> {property.city}  </h6>
                            </div>
                          </div>

                          {/* Property Financials in table format */}
                          <div>
                            <div className="propertyInfoTableContainer">
                              <table className="propertyInfoTable">
                                <tbody>
                                  <tr>
                                    {/* <td>Reported sale (yearly): <br /><span className="green-text">82,00,000</span></td> */}
                                    <td> Listing Type: <br /> <span className="green-text">  {property.listing_type} </span> </td>
                                    <td> Property Type: <br /> <span className="green-text">  {property.property_type}  </span>  </td>
                                  </tr>
                                  <tr>
                                  <td>BUSINESS STATUS:<br /> <span className="green-text">{property.project_status}</span> </td>
                                  <td>Furnishing: <br /> <span className="green-text">{property.furnishing}</span> </td>
                                  </tr>
                                  <tr>
                                    <td>Price: <br /> <span className="green-text"> {property.asking_price}</span> </td>

                                    <td>
                                      DOCUMENTS UPLOADED: <br />
                                      <span className="green-text">
                                        {(() => { try {   const files = JSON.parse(  property.file_name
                                            ); return Array.isArray(files) ? files.length  : 0;
                                          } catch (error) { console.error("Error parsing file_name:",  error
                                            );  return 0;
                                          }   })()}  </span> </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description Section */}
                    <div className="descriptionSection">
                      <h5>Description</h5>
                      {/* <p>{property.additional_detail}</p> */}
                    </div>

                    {/* Google Map Section */}
                    <div className="mapLocationDiv">
                      <iframe  style={{ width: "100%" }}  src="https://www.google.com/maps/embed?pb=..."  width="600" height="450" allowFullScreen=""  loading="lazy" ></iframe>
                    </div>
                  </>
                
              </div>
            )}
              <div className="col-3 property-listings-scroll ">
              {/* <h2>SIMILAR LISTINGS</h2> */}
                  {/* Scrollable Container for Property Listings */}
                  {type === "property" &&
          homeProperty.map((property, index) => (
            <div className="">
                  <div className="">
                    <div className="propertyBuyClsNameRow_1 propertyBuyClsNameExploreRow">
                   
            <div className="propertyBuyClsNameCOL" key={index}>
              <div className="propertyBuyClsNameBox">
                <div className="promotedTextWrapper">
                  <img
                    className="img-fluid"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      handlepropertyNavigate("property", property.id)
                    }
                    src={(() => {
                      try {
                        const fileName = property.file_name;

                        const files =
                          typeof fileName === "string" && fileName.startsWith("[")
                            ? JSON.parse(fileName)
                            : fileName;

                        if (typeof files === "string") {
                          return files.startsWith("http")
                            ? files
                            : `${BASE_URL}/${files}`;
                        } else if (Array.isArray(files) && files.length > 0) {
                          return files[0].startsWith("http")
                            ? files[0]
                            : `${BASE_URL}/${files[0]}`;
                        } else {
                          return "default-image.jpg";
                        }
                      } catch (error) {
                        console.error("Error parsing file_name:", error);
                        return "default-image.jpg";
                      }
                    })()}
                    alt={property.title || "property Image"}
                  />
                </div>
                <h5>{property.property_title}</h5>
                <div className="home_price">
                  <h6>
                    Price: <span>{property.asking_price}</span>
                  </h6>
                  <span className="home_con">{property.listing_type}</span>
                </div>
                <h6>Reported Sale (yearly): {property.sale}</h6>
                <div className="home_call">
                  <h6>
                    <IoLocation /> {property.city}
                  </h6>
                  <h6 style={{ cursor: "pointer" }}>Call</h6>
                </div>
              </div>
            </div>
     
                    </div>
                  </div>
                  </div>
                       ))}
               
              </div>
            </div>

            <div className=" row single_container">
                {type === "business" && business && (
              <div className="col-9">
                  <div className="single_box">
                    <>
                      <div className="row">
                        <div className="col-6">
                          <h1>{business.title}</h1>
                          <div className="boldBorder"></div>
                        </div>
                        <div className="col-6 d-flex justify-content-between align-items-center">
                          <div className="propertyBuyListingActions">
                            <button>  <IoShareSocial /> Share </button>
                            <button> <IoMail /> Mail </button>
                            <button><IoCall /> Call </button>
                          </div>

                          <div className="business_rating">
                            {/* Star Rating Section */}
                            {/* <h5>Rate this Business</h5> */}
                            <ReactStars count={5} size={25} activeColor="#ffd700" value={userRating || averageRating} onChange={handleRatingChange}  />
                            {/* <p>Average Rating: {averageRating.toFixed(1)}</p> */}
                          </div>
                        </div>
                      </div>

                      <div className="row propertyBuyListingRow_1 propertySinglePage">
                        <div className="col-6">
                          <img
                            className="img-fluid"
                            src={(() => {
                              try {
                                const fileName = business.file_name;

                                // Parse the file_name if it's a JSON string
                                const files =
                                  typeof fileName === "string" &&
                                  fileName.startsWith("[")
                                    ? JSON.parse(fileName)
                                    : fileName;

                                if (typeof files === "string") {
                                  // Single image case
                                  return files.startsWith("http")
                                    ? files
                                    : `${BASE_URL}/${files}`;
                                } else if (
                                  Array.isArray(files) &&
                                  files.length > 0
                                ) {
                                  // Multiple images case
                                  return files[0].startsWith("http")
                                    ? files[0]
                                    : `${BASE_URL}/${files[0]}`;
                                } else {
                                  // Default image as fallback
                                  return "default-image.jpg";
                                }
                              } catch (error) {
                                console.error(
                                  "Error parsing or handling file_name:",
                                  error
                                );
                                return "default-image.jpg"; // Fallback in case of error
                              }
                            })()}
                            alt={business.title || "business Image"}
                          />
                        </div>
                        <div className="col-6">
                          <div className="row">
                            <div className="col-6">
                              <h6>Asking Price: {business.asking_price}</h6>
                            </div>
                            <div className="col-6">
                              <h6>  <IoLocation /> {business.city} </h6>
                            </div>
                          </div>

                          {/* Business Financials in table format */}
                          <div>
                            {/* Business Financials Table */}
                            <div className="propertyInfoTableContainer">
                              <table className="propertyInfoTable">
                                <tbody>
                                  <tr>
                                    <td>  REPORTED TURNOVER (YEARLY): <br />  <span className="green-text"> {business.reported_turnover_from} -  {business.reported_turnover_to}  </span></td>
                                    <td>  PROFITABILITY(EBITDA MARGIN) : <br /> <span className="green-text">  {business.ebitda_margin} </span> </td>
                                  </tr>
                                  <tr>
                                    <td>   BUSINESS STATUS:  <br />  <span className="green-text">   {business.current_status}   </span>   </td>
                                    <td>  NUMBER OF EMPLOYEES: <br /> <span className="green-text">  {business.no_of_employees}  </span>  </td>
                                  </tr>
                                  <tr>
                                    <td>   YEAR OF ESTABLISHMENT: <br /> <span className="green-text"> {business.year_of_establishment} </span>   </td>
                                    <td>   DOCUMENTS UPLOADED: <br /><span className="green-text"> {(() => { try {  const files = JSON.parse(  business.file_name );   return Array.isArray(files)   ? files.length   : 0;    } catch (error) {   console.error( "Error parsing file_name:",   error  );  return 0;   }   })()}  </span> </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  </div>
                
                {/* Description Section */}
                <div className="descriptionSection">
                  <h5>Description</h5>
                  <div   dangerouslySetInnerHTML={{   __html:  business.description || "<p>No description available</p>",    }} />
                </div>

                {/* Google Map Section */}
                <div className="mapLocationDiv">
                  <iframe    style={{ width: "100%" }}   src="https://www.google.com/maps/embed?pb=..."  width="600" height="450"  allowFullScreen=""  loading="lazy"  ></iframe>
                </div>
              </div>
            )}
             <div className="col-3 property-listings-scroll ">
             {/* <h2>SIMILAR LISTINGS</h2> */}
             {type === "business" && 
                      homeBusiness.map((list, index) => (
                <div className="">
                  <div className="">
                    <div className="propertyBuyClsNameRow_1 propertyBuyClsNameExploreRow">
                        <div className="propertyBuyClsNameCOL" key={index}>
                          <div className="propertyBuyClsNameBox">
                            <div className="promotedTextWrapper">
                              <img
                                className="img-fluid"
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  handlepropertyNavigate(
                                    "business",
                                    list.id
                                  )
                                }
                                src={(() => {
                                  try {
                                    const fileName = list.file_name;

                                    // Parse the file_name if it's a JSON string
                                    const files =
                                      typeof fileName === "string" &&
                                      fileName.startsWith("[")
                                        ? JSON.parse(fileName)
                                        : fileName;

                                    if (typeof files === "string") {
                                      // Single image case
                                      return files.startsWith("http")
                                        ? files
                                        : `${BASE_URL}/${files}`;
                                    } else if (
                                      Array.isArray(files) &&
                                      files.length > 0
                                    ) {
                                      // Multiple images case
                                      return files[0].startsWith("http")
                                        ? files[0]
                                        : `${BASE_URL}/${files[0]}`;
                                    } else {
                                      // Default image as fallback
                                      return "default-image.jpg";
                                    }
                                  } catch (error) {
                                    console.error(
                                      "Error parsing or handling file_name:",  error   );   return "default-image.jpg"; // Fallback in case of error
                                  }  })()}   alt={list.title || "business Image"}  />
                            </div>
                            <h5>{list.title}</h5>
                            <div className="home_price">
                              <h6>  Price: <span>{list.asking_price}</span></h6>
                              <span className="home_con">  {list.listing_type}  </span>
                            </div>
                            <h6>Reported Sale (yearly): {list.sale}</h6>
                            <div className="home_call">
                              <h6>  <IoLocation /> {list.city} </h6>
                              <h6 style={{ cursor: "pointer" }}>Call</h6>
                            </div>
                          </div>
                        </div>
                    
                    </div>
                  </div>
                </div>
                  ))}
              </div>
            </div>
            
          </div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </>
  );
}

export default PropertyBuySinglePage;
