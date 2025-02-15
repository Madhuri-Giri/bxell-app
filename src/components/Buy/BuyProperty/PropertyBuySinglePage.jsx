import React, { useState, useRef, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import { useNavigate } from "react-router-dom";
import ScrollToTop from "../../ScrollToTop/ScrollToTop";
import { useSelector } from "react-redux";
import { fetchPropertyRes, fetchBusinessRes, fetchViewBusinessRes, fetchViewPropertyRes, fetchPropertyRating, fetchBusinessRating, submitbusinessEnquiryForm, submitpropertyEnquiryForm, fetchPropertyFavoriteRes, fetchBusinessFavoriteRes, fetchBusinessFav, fetchPropertyFav  } from "../../../API/apiServices";
import { useLocation } from "react-router-dom";
import "./PropertyBuySinglePage.css";
import { IoShareSocial, IoMail, IoCall, IoLocation } from "react-icons/io5";
import { FaHeart, FaRegHeart, FaPhoneAlt } from "react-icons/fa";
import News from "../../Home/MainBanner/news/News";
import Slider from "react-slick";
import ReactStars from "react-rating-stars-component";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { toast } from "react-toastify";
import { FaCircleUser } from "react-icons/fa6";

function PropertyBuySinglePage() {
  
  const location = useLocation();
  const navigate = useNavigate();
  const { type, id } = location.state || {};
  const [business, setBusiness] = useState(null);
  const [property, setProperty] = useState(null);
  const [userRating, setUserRating] = useState(0); // To store user's rating
  const [averageRating, setAverageRating] = useState(0);
  const [homeProperty, setHomeProperty] = useState([]);
  const [homeBusiness, setHomeBusiness] = useState([]);
  const user = useSelector((state) => state.auth.user);
    const user_id = useSelector((state) => state.auth.user);
  const [wishlist, setWishlist] = useState({}); 
  const [coordinates, setCoordinates] = useState(null);
  const [showFullMap, setShowFullMap] = useState(false);
  const smallMapRef = useRef(null);
  const fullMapRef = useRef(null);

  const googleApiKey = "AIzaSyCMlSAyBPURMfD8HzSj1z_vDD-pcoZuOhI";

  // Fetch coordinates using Google Maps Geocoding API
  const fetchCoordinates = async (city) => {
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${googleApiKey}`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        return { latitude: lat, longitude: lng };
      } else {
        console.error("City not found.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };

  // Fetch coordinates when property or business city changes
  useEffect(() => {
    if (property && property.city) {
      fetchCoordinates(property.city).then((coords) => {
        if (coords) {
          setCoordinates(coords);
        }
      });
    }
  }, [property]);

  useEffect(() => {
    if (business && business.city) {
      fetchCoordinates(business.city).then((coords) => {
        if (coords) {
          setCoordinates(coords);
        }
      });
    }
  }, [business]);

  // Initialize Google Map when coordinates are fetched
  useEffect(() => {
    if (coordinates) {
      console.log("Initializing Map with coordinates:", coordinates);

      // Initialize the map (small map or full map based on state)
      const map = new google.maps.Map(
        showFullMap ? fullMapRef.current : smallMapRef.current,
        {
          center: { lat: coordinates.latitude, lng: coordinates.longitude },
          zoom: 10,
        }
      );

      const marker = new google.maps.Marker({
        position: { lat: coordinates.latitude, lng: coordinates.longitude },
        map: map,
        title: property?.city || business?.city,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `<h3>${property?.city || business?.city}</h3>`,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });

      // Cleanup function when map or component unmounts
      return () => {
        google.maps.event.clearInstanceListeners(map);
      };
    }
  }, [coordinates, showFullMap]);

  // Toggle between small and full map views
  const toggleMapView = () => {
    setShowFullMap(!showFullMap);
  };

  const [formData, setFormData] = useState({
    user_id: user,
    name: "",
    email: "",
    listing_title: "",
    enquiry_message: "",
  });

  const [showModal, setShowModal] = useState(false); // State for modal visibility

  const toggleModal = () => setShowModal(!showModal); // Toggle modal visibility


   // Get images from file_name
   const getImages = () => {
    if (!property || !property.file_name) return [];

    const fileName = property.file_name;

    try {
      const files = typeof fileName === "string" && fileName.startsWith("[")
        ? JSON.parse(fileName) // Parse JSON array if string
        : fileName;

      if (Array.isArray(files) && files.length > 0) {
        return files; // Return the array of images
      } else if (typeof files === "string") {
        return [files]; // If it's a single string, return it as an array
      }
    } catch (error) {
      console.error("Error parsing file names:", error);
    }

    return ["default-image.jpg"]; // Return default image if no valid files
  };

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // Get the images array for business and property

  const images = getImages();

  const getBusinessImages = () => {
    if (!business || !business.file_name) return [];

    const fileName = business.file_name;

    try {
      const files =
        typeof fileName === "string" && fileName.startsWith("[")
          ? JSON.parse(fileName) // Parse JSON array
          : fileName;

      if (Array.isArray(files) && files.length > 0) {
        return files; // Return the array of images
      } else if (typeof files === "string") {
        return [files]; // If it's a single string, wrap it in an array
      }
    } catch (error) {
      console.error("Error parsing file_name:", error);
    }

    return ["default-image.jpg"]; // Fallback image
  };

  // Get the images array
  const imagesBusiness = getBusinessImages();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (type === "property" && property) {
      setFormData((prevData) => ({
        ...prevData,
        listing_title: property.property_title, // Automatically fill listing_title with property_title
      }));
    } else if (type === "business" && business) {
      setFormData((prevData) => ({
        ...prevData,
        listing_title: business.title, // Automatically fill listing_title with business_title
      }));
    }
  }, [type, property, business]);
  
  const handlePropertyEnquirySubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.user_id || !id) {
      toast.error("User ID or Business ID is missing.");
      return;
    }
  
    try {
      const response = await submitpropertyEnquiryForm({
        user_id: formData.user_id,
        property_id: id,
        name: formData.name,
        email: formData.email,
        listing_title: formData.listing_title, // This will auto-fill
        enquiry_message: formData.enquiry_message,
      });
  
      if (response.status === 200) {
        toast.success(response.message);
        setShowModal(false);
      } else {
        toast.error("Error submitting form.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  const handleBusinessEnquirySubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.user_id || !id) {
      toast.error("User ID or Business ID is missing.");
      return;
    }
  
    try {
      const response = await submitbusinessEnquiryForm({
        user_id: formData.user_id,
        business_id: id,
        name: formData.name,
        email: formData.email,
        listing_title: formData.listing_title, // This will auto-fill
        enquiry_message: formData.enquiry_message,
      });
  
      if (response.status === 200) {
        toast.success(response.message);
        setShowModal(false);
      } else {
        toast.error("Error submitting form.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
    const storageKey = `${type}-${id}-rating`;
  
    // Check if a rating already exists in localStorage
    if (localStorage.getItem(storageKey)) {
      toast.error("You have already submitted a rating for this listing."); // Inform the user they've already rated
      return; // Prevent further execution
    }
  
    // Store the rating in localStorage only the first time
    localStorage.setItem(storageKey, newRating);
  
    setUserRating(newRating);
  
    if (!user) {
      toast.error("Please log in to submit a rating.");
      return;
    }
  
    try {
      if (type === "property") {
        await fetchPropertyRating(id, newRating, user); // Pass the property ID and rating
        toast.success("Thank you for rating!");
      } else if (type === "business") {
        await fetchBusinessRating(id, newRating, user); // Pass the business ID and rating
        toast.success("Thank you for rating!");
      }
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


  
    useEffect(() => {
      const fetchFavorites = async () => {
        if (!user_id) {
          console.error("User ID is not available.");
          return;
        }
  
        try {
          const favoritesData = await Promise.all([
            fetchPropertyFavoriteRes(user_id),
            fetchBusinessFavoriteRes(user_id),
          ]);
  
          const favorites = {};
          [...favoritesData[0], ...favoritesData[1]].forEach((item) => {
            favorites[item.property_id || item.business_id] = item.status === "Active";
          });
  
          setWishlist(favorites);
        } catch (error) {
          console.error("Error fetching favorites:", error);
        }
      };
  
      fetchFavorites();
    }, [user_id]);
  
    const handleWishlistClick = async (id) => {
      try {
        setWishlist((prevWishlist) => ({
          ...prevWishlist,
          [id]: !prevWishlist[id],
        }));
  
        let result;
        if (homeBusiness.some((item) => item.id === id)) {
          result = await fetchBusinessFav(id, user_id);
        } else if (homeProperty.some((item) => item.id === id)) {
          result = await fetchPropertyFav(id, user_id);
        }
  
        if (!result.success) {
          setWishlist((prevWishlist) => ({
            ...prevWishlist,
            [id]: prevWishlist[id],
          }));
          console.error("Error toggling favorite:", result.message);
        }
      } catch (error) {
        setWishlist((prevWishlist) => ({
          ...prevWishlist,
          [id]: prevWishlist[id],
        }));
        console.error("Error handling favorite toggle:", error.message);
      }
    };

  return (
    <>
      <Header />
      <News />

      <section>
        <div className="space_r_l">
          <div className="container">
            <div className=" row single_container">
              {/* Conditionally render Property or Business */}
              {type === "property" && property && (
                <div className="col-lg-9 col-sm-12">
                  <>
                    <div className="single_box mb-4">
                      <div className="row">
                        <div className="col-lg-6 col-sm-12">
                          <div className="row">
                            <div className="col-lg-10 col-md-10 col-sm-10 col-10">
                              <h1>{property.property_title}</h1>
                            </div>
                            <div className="col-lg-2 col-sm-2 col-md-2 col-2">
                              <div className="propertyBuyListingBox" style={{ position: "relative" }}  >
                                <div
                                  className="wishlist-heart"
                                  style={{  position: "absolute",
                                   
                                    right: "-10px", zIndex: 10, }}
                                  onClick={() => handleWishlistClick(property.id) } >
                                  {wishlist[property.id] ? (
                                    <FaHeart className="wishlist-icon" /> // Filled heart for "Active"
                                  ) : (
                                    <FaRegHeart className="wishlist-icon" /> // Outline heart for "DeActive"
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="boldBorder"></div>
                          <div className="prop_type">
                            <h6>Property Type : <span>{property.property_type}</span> </h6>
                          </div>
                        </div>
                        <div className="col-lg-6 col-sm-12  d-flex justify-content-between align-items-center margin_class">
                          <div className="business_rating">
                            <ReactStars className="rating" count={5} activeColor="#ffd700" value={userRating || averageRating} onChange={handleRatingChange} />
                          </div>
                          <div className="propertyBuyListingActions">
                            <button> <IoShareSocial /> Share  </button>
                            <button> <IoMail /> Mail </button>
                            <a href={`tel:${property.phone_number}`} className="call-btnn"  style={{ textDecoration: "none" }}  >
                            <button> <IoCall /> Call  </button>
                              </a>
                          </div>
                        </div>
                      </div>

                      <div className="row propertyBuyListingRow_1 propertySinglePage">
                        <div className="col-lg-6 col-sm-12">
                          {images.length > 1 ? (
                            <Slider {...sliderSettings}>
                              {images.map((image, index) => (
                                <div key={index}>
                                  <img className="img-fluid"  style={{ cursor: "pointer",  width: "100%",  height: "300px", objectFit: "contain",  }}
                                    src={ image.startsWith("http") ? image : `${BASE_URL}/${image}` }
                                    alt={ property.property_title || "Property Image"  }  />
                                </div>
                              ))}
                            </Slider>
                          ) : (
                          
                            <img className="img-fluid" style={{ objectFit: "contain", }}
                              src={ images[0].startsWith("http") ? images[0]  : `${BASE_URL}/${images[0]}`   }  alt={property.property_title || "Property Image"}  />
                          )}
                        </div>

                        <div className="col-lg-6 col-sm-12">
                          <div className="row margin_asking price_location">
                            <div className="col-6 ask_price">
                              <span> Asking Price : ₹ <span className="green-text"> {property.asking_price} </span> </span>
                            </div>
                            <div className="col-6 pro_city ">
                              <IoLocation /> <span> {property.city} </span>
                            </div>
                          </div>
                         
                          <div>
              {/* Conditional Rendering for Land or Other Property Types */}
              {property.property_type === "Land" ? (
                // Land Property Table
                <div className="propertyInfoTableContainer">
                  <table className="propertyInfoTable ">
                    <thead className=" table_heading">
                      <tr>
                        <th colSpan="3">Land Proposal</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td> Listing Type: <br /> <span className="green-text"> {property.listing_type || "N/A"} </span> </td>
                        <td> Property Type: <br /> <span className="green-text"> {property.property_type || "N/A"} </span> </td>
                        <td> Area Measurement: <br /> <span className="green-text"> {property.area_measurment || "N/A"} </span> </td> 
                      </tr>
                      <tr>
                        <td> Area: <br /> <span className="green-text"> {property.area || "N/A"} </span> </td> 
                        <td> Length: <br />  <span className="green-text"> {property.length || "N/A"} </span> </td> 
                        <td> Breadth: <br /> <span className="green-text">{property.breadth || "N/A"}  </span> </td> 
                      </tr>
                      <tr>
                        <td> Listed By: <br />  <span className="green-text"> {property.listed_by || "N/A"}  </span>  </td>
                        <td> Country: <br /> <span className="green-text"> {property.country || "N/A"} </span> </td>
                        <td> Documents Uploaded: <br /> <span className="green-text">
                          {(() => {
                            try {
                              const files = JSON.parse( property.file_name );
                              return Array.isArray(files) ? files.length : 0;
                            } catch (error) {
                              console.error( "Error parsing file_name:", error );
                              return 0;
                            }
                          })()}
                        </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                // Residential/Other Property Table (for Home, Apartment, Office, etc.)
                <div className="propertyInfoTableContainer">
                  <table className="propertyInfoTable ">
                    <thead className=" table_heading">
                      <tr>
                        <th colSpan="3">Property Proposal</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td> Listing Type: <br /> <span className="green-text"> {property.listing_type || "N/A"} </span> </td>
                        <td> Property Type: <br /> <span className="green-text"> {property.property_type || "N/A"} </span> </td>
                        <td> Bathroom: <br /> <span className="green-text"> {property.bathroom || "N/A"} </span> </td>
                      </tr>
                      <tr>
                        <td> Property Status: <br /> <span className="green-text"> {property.project_status || "N/A"} </span> </td>
                        <td> Furnishing: <br />  <span className="green-text"> {property.furnishing || "N/A"} </span> </td>
                        <td> Carpet Area: <br /> <span className="green-text">{property.sq_ft || "N/A"}  </span> </td>
                      </tr>
                      <tr>
                        <td> Listed By: <br />   <span className="green-text"> {property.listed_by || "N/A"}  </span>  </td>
                        <td> Project Status: <br /> <span className="green-text"> {property.project_status || "N/A"} </span> </td>
                        <td> Documents Uploaded: <br /> <span className="green-text">
                          {(() => {
                            try {
                              const files = JSON.parse( property.file_name );
                              return Array.isArray(files) ? files.length : 0;
                            } catch (error) {
                              console.error( "Error parsing file_name:", error );
                              return 0;
                            }
                          })()}
                        </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
                        </div>
                      </div>
                    </div>

                    <div className="container_b">
                      <div className="descriptionSection">
                        <h3>Description</h3>
                        <p>{property.additional_detail}</p>
                      </div>

                      <div className="button_box">
                        <button className="enquiry-btn" onClick={toggleModal}> Enquiry Form </button>
                      </div>
                    </div>

                    <Modal show={showModal} onHide={toggleModal} centered>
                      <Modal.Header closeButton>
                        <Modal.Title>Send Us A Message</Modal.Title>
                      </Modal.Header>
                      <Modal.Body className="form-page">
                        {/* <h5>Send Us A Message</h5> */}
                        <p>
                          Please contact us for any assistance by filling up the
                          form below. We will get back to you within 24 hours.
                        </p>
                        <form onSubmit={handlePropertyEnquirySubmit}>
                          <div className="ipt">
                            <input type="text" name="name" placeholder="Full Name*" required  value={formData.name} onChange={handleChange}   />
                          </div>
                          <div className="ipt">
                            <input  type="email"  name="email"  placeholder="Email*"  required value={formData.email} onChange={handleChange}  />
                          </div>
                          <div className="ipt">
                            <input type="text" name="listing_title" placeholder="Listing Title*" required value={formData.listing_title} onChange={handleChange}   />
                          </div>
                          <div className="ipt">
                            <textarea name="enquiry_message" placeholder="Message*" required  value={formData.enquiry_message} onChange={handleChange}  />
                          </div>
                          <div className="btn-cont">
                            <button type="submit">SEND MESSAGE</button>
                          </div>
                        </form>
                      </Modal.Body>
                    </Modal>

                    <div className="mapLocationDiv">
      <div
        ref={smallMapRef}
        style={{
          width: "100%",
          height: "450px",
          visibility: showFullMap ? "hidden" : "visible", 
          position: "relative",
        }}
      >
        <div className="toggle-map-icon" onClick={toggleMapView}>
          {showFullMap ? <span>Hide Map</span> : <span>Show Full Map</span>}
        </div>
      </div>

      {showFullMap && (
        <div className="map-overlay">
          <div className="map-overlay-content">
            <span className="map-overlay-close" onClick={toggleMapView}>
              <i className="ri-close-line"></i>
            </span>
            <div
              ref={fullMapRef}
              style={{
                width: "100%",
                height: "600px",
                position: "relative",
              }}
            />
          </div>
        </div>
      )}
                   </div>
                  </>
                </div>
              )}
              <div className="col-3  property-listings-scroll ">
                {/* Scrollable Container for Property Listings */}
                {type === "property" && homeProperty.length > 0 && (
                  <>
                     <div  className="listed_box">
                    <h2>LISTED BY</h2>
                    <FaCircleUser className="listed_user"  size={33}   style={{ cursor: "pointer" }} />
                    <div className="listed_call">
                    
                    <span> <IoCall className="listed_user"/> Call  </span>
                    </div>
                    <div className="listed_by_box">
                      <span className="veri_user">verified user</span>
                      <span> <IoLocation /> {property?.city || "City not available"} </span></div>
                    </div>
                    <div className="buy_back">
                      <h2>SIMILAR LISTINGS</h2>
                      {homeProperty.map((property, index) => (
                        <div className="" key={index}>
                          <div className="propertyBuyClsNameRow_1 propertyBuyClsNameExploreRow ">
                            <div className="propertyBuyClsNameCOL">
                              <div className="propertyBuyClsNameBox">
                                <div className="promotedTextWrapper">
                                  {/* <img className="img-fluid" alt={property.title || "property Image"}  /> */}
                                  <img  className="img-fluid" style={{ cursor: "pointer" }} onClick={() => handlepropertyNavigate( "property",
                                        property.id  ) }
                                    src={(() => {
                                      try {
                                        const fileName = property.file_name;
                                        const files = typeof fileName === "string" && fileName.startsWith("[") ? JSON.parse(fileName) : fileName;

                                        if (typeof files === "string") {
                                          return files.startsWith("http")
                                            ? files : `${BASE_URL}/${files}`;
                                        } else if (
                                          Array.isArray(files) &&  files.length > 0
                                        ) {
                                          return files[0].startsWith("http") ? files[0]  : `${BASE_URL}/${files[0]}`;
                                        } else {
                                          return "default-image.jpg";
                                        }
                                      } catch (error) {
                                        console.error( "Error parsing or handling file_name:",  error );
                                        return "default-image.jpg";
                                      }
                                    })()}  alt={property.title || "property Image"}  />
                                </div>

                   

                                <h5>{property.property_title}</h5>
                                <div className="home_price">
                                  <h6> Price: ₹ <span className="ask_price_side"> {property.asking_price}
                                    </span></h6>  <span className="home_con">{property.listing_type} </span>
                                </div>
                                <div>
                                  <h6> Property Type : <strong>{property.property_type}</strong> </h6>
                                </div>
                                <div className="location-call">
                                  <h6> <IoLocation /> {property.city} </h6>
                                  <a href={`tel:${property.phone_number}`}  className="call-btn"  style={{ textDecoration: "none" }}  > Call <FaPhoneAlt />
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className=" row single_container">

            {type === "business" && business && (
                <div className="col-lg-9 col-sm-12">
                  <div className="single_box mb-4">
                    <>
                      <div className="row">
                        <div className="col-lg-6 col-sm-12">
                          <div className="row">
                            <div className="col-lg-10 col-sm-10 col-md-10 col-10">
                              <h1>{business.title}</h1>
                            </div>
                            <div className="col-lg-2 col-sm-2 col-md-2 col-2">
                                <div className="propertyBuyListingBox" style={{ position: "relative" }}  >
                                  <div
                                    className="wishlist-heart"
                                    style={{  position: "absolute",
                                      right: "10px", zIndex: 10, }}
                                    onClick={() => handleWishlistClick(business.id) } >
                                    {wishlist[business.id] ? (
                                      <FaHeart className="wishlist-icon" /> // Filled heart for "Active"
                                    ) : (
                                      <FaRegHeart className="wishlist-icon" /> // Outline heart for "DeActive"
                                    )}
                                  </div>
                                </div>
                            </div>
                          </div>
                          <div className="boldBorder"></div>
                          <div className="prop_type">
                            <h6> Business Type : <span>{business.business_type}</span>  </h6>
                          </div>
                        </div>
                        <div className="col-lg-6 col-sm-12 d-flex justify-content-between align-items-center margin_class">
                        <div className="business_rating">
                            <ReactStars count={5} activeColor="#ffd700" value={userRating || averageRating} onChange={handleRatingChange}  />
                          </div>
                          <div className="propertyBuyListingActions">
                            <button> <IoShareSocial /> Share  </button>
                            <button> <IoMail /> Mail </button>
                              <a href={`tel:${business.phone_number}`}  className="call-btnn" style={{ textDecoration: "none" }} >
                            <button><IoCall /> Call </button> </a>
                          </div>
                        </div>
                      </div>

                      <div className="row propertyBuyListingRow_1 propertySinglePage">
                        <div className="col-lg-6 col-sm-12">
                        
                          {imagesBusiness.length > 1 ? (
                            <Slider {...sliderSettings}>
                              {imagesBusiness.map((image, index) => (
                                <div key={index}>
                                  <img className="img-fluid" style={{ cursor: "pointer", width: "100%", height: "300px", objectFit: "contain", }}
                                    src={  image.startsWith("http") ? image : `${BASE_URL}/${image}` } alt={business.title || "Business Image"}  />
                                </div>
                              ))}
                            </Slider>
                          ) : (
                            // Render single image if there's only one
                            <img className="img-fluid" style={{ objectFit: "contain",   }}
                              src={  imagesBusiness[0].startsWith("http")  ? imagesBusiness[0]  : `${BASE_URL}/${imagesBusiness[0]}`}
                              alt={business.title || "Business Image"}  />
                          )}
                        </div>
                        <div className="col-lg-6 col-sm-12">
                          <div className="row margin_asking">
                            <div className="d-flex justify-content-between price_location">
                              <div className="col-6 ask_price">
                                <span> Asking Price : ₹  <span className="green-text"> {business.asking_price} </span> </span>
                              </div>
                              <div className="col-6 pro_city">
                                <IoLocation /> <span> {business.city} </span>
                              </div>
                            </div>
                          </div>
                          <div>
                           
                            <div className="propertyInfoTableContainer">
                              <table className="propertyInfoTable">
                                <thead className=" table_heading">
                                  <tr>
                                    <th colSpan="2">Proposal</th>
                                     </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>  REPORTED TURNOVER (YEARLY): <br /> ₹ <span className="green-text"> {business.reported_turnover_from || "N/A"} -
                                        {business.reported_turnover_to } </span> </td>
                                    <td> PROFITABILITY(EBITDA MARGIN) : <br /> <span className="green-text"> {business.ebitda_margin || "N/A"} </span> </td>
                                  </tr>

                                  <tr>    
                                    <td> BUSINESS STATUS: <br /> <span className="green-text"> {business.current_status || "N/A"} </span>
                                    </td>
                                    <td>  NUMBER OF EMPLOYEES: <br /> <span className="green-text"> {business.no_of_employees || "N/A"} </span> </td>
                                  </tr>
                                  <tr>
                                     <td> YEAR OF ESTABLISHMENT: <br /> <span className="green-text"> {business.year_of_establishment || "N/A"} </span> </td>
                                    <td>
                                      DOCUMENTS UPLOADED: <br />
                                      <span className="green-text">
                                        {(() => {
                                          try { 
                                            const files = JSON.parse( business.file_name );
                                            return Array.isArray(files) ? files.length  : 0;
                                          } catch (error) {
                                            console.error("Error parsing file_name:",  error);
                                            return 0;
                                          }
                                        })()}
                                      </span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  </div>

                  <div className="container_b">
                    <div className="descriptionSection">
                      <h3>Description</h3>
                      <div dangerouslySetInnerHTML={{ __html: business.description || "<p>No description available</p>", }} />
                    </div>

                    <div className="button_box">
                      <button className="enquiry-btn" onClick={toggleModal}> Enquiry Form </button>
                    </div>
                  </div>

                  <Modal  show={showModal} onHide={toggleModal}  centered dialogClassName="custom-modal-width" >
                    <Modal.Header closeButton>
                      <Modal.Title>Send Us A Message</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="form-page">
                      {/* <h5>Send Us A Message</h5> */}
                      <p>
                        Please contact us for any assistance by filling up the
                        form below. We will get back to you within 24 hours.
                      </p>
                      <form onSubmit={handleBusinessEnquirySubmit}>
                        <div className="ipt">
                          <input type="text" name="name" placeholder="Full Name*" required value={formData.name} onChange={handleChange} />
                        </div>
                        <div className="ipt">
                          <input type="email" name="email" placeholder="Email*"  required  value={formData.email}  onChange={handleChange}  />
                        </div>
                        <div className="ipt">
                          <input type="text" name="listing_title" placeholder="Listing Title*" required value={formData.listing_title} onChange={handleChange} />
                        </div>
                        <div className="ipt">
                          <textarea  name="enquiry_message"  placeholder="Message*"  required value={formData.enquiry_message} onChange={handleChange} />
                        </div>
                        <div className="btn-cont">
                          <button type="submit">SEND MESSAGE</button>
                        </div>
                      </form>
                    </Modal.Body>
                  </Modal>

                  <div className="mapLocationDiv">
                    <div
                      ref={smallMapRef}
                      style={{
                        width: "100%",
                        height: "450px",
                        visibility: showFullMap ? "hidden" : "visible", 
                        position: "relative",
                      }}
                    >
                      <div className="toggle-map-icon" onClick={toggleMapView}>
                        {showFullMap ? <span>Hide Map</span> : <span>Show Full Map</span>}
                      </div>
                    </div>

                    {showFullMap && (
                      <div className="map-overlay">
                        <div className="map-overlay-content">
                          <span className="map-overlay-close" onClick={toggleMapView}>
                            <i className="ri-close-line"></i>
                          </span>
                          <div
                            ref={fullMapRef}
                            style={{
                              width: "100%",
                              height: "600px",
                              position: "relative",
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="col-3 property-listings-scroll ">
                {type === "business" && (
                  <>
                     <div  className="listed_box">
                    <h2>LISTED BY</h2>
                    <FaCircleUser className="listed_user"  size={33}   style={{ cursor: "pointer" }} />
                    <div className="listed_call">
                    
                    <span> <IoCall className="listed_user"/> Call  </span>
                    </div>
                    <div className="listed_by_box">
                      <span className="veri_user">verified user</span>
                      <span> <IoLocation /> {business?.city || "City not available"} </span></div>
                    </div>
                    <div className="buy_back">
                      <h2>SIMILAR LISTINGS</h2>
                      {/* Move this outside the map */}
                      {homeBusiness.map((list, index) => (
                        <div className="" key={index}>
                          <div className="propertyBuyClsNameRow_1 propertyBuyClsNameExploreRow">
                            <div className="propertyBuyClsNameCOL">
                              <div className="propertyBuyClsNameBox">
                                <div className="promotedTextWrapper">
                                  <img  className="img-fluid" style={{ cursor: "pointer" }} onClick={() => handlebusinessNavigate( "business",
                                        list.id  ) }
                                    src={(() => {
                                      try {
                                        const fileName = list.file_name;
                                        const files = typeof fileName === "string" && fileName.startsWith("[") ? JSON.parse(fileName) : fileName;

                                        if (typeof files === "string") {
                                          return files.startsWith("http")
                                            ? files : `${BASE_URL}/${files}`;
                                        } else if (
                                          Array.isArray(files) &&  files.length > 0
                                        ) {
                                          return files[0].startsWith("http") ? files[0]  : `${BASE_URL}/${files[0]}`;
                                        } else {
                                          return "default-image.jpg";
                                        }
                                      } catch (error) {
                                        console.error( "Error parsing or handling file_name:",  error );
                                        return "default-image.jpg";
                                      }
                                    })()}  alt={list.title || "business Image"}  />
                                </div>
                                <h5>{list.title}</h5>

                                <div className="home_price">
                                  <h6> Price: ₹ <span className="ask_price_side"> {list.asking_price}  </span> </h6>
                                  <span className="home_con"> {list.listing_type} </span>
                                </div>

                                <h6> Reported Sale (yearly): <br />₹  <span className="green-text">  {list.reported_turnover_from} -  {list.reported_turnover_to} </span> </h6>

                                <div className="location-call">
                                  <h6> <IoLocation /> {list.city} </h6>
                                  <a href={`tel:${list.phone_number}`} className="call-btn"  style={{ textDecoration: "none" }}  > Call <FaPhoneAlt />  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
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
