/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "./PropertyBuyList.css";
import { useSelector } from 'react-redux';
import { IoLocation } from "react-icons/io5";
import { FaHeart, FaPhoneAlt, FaRegHeart } from "react-icons/fa"; // Added icons
import { useNavigate, useLocation  } from "react-router-dom";
import { fetchPropertyRes, fetchBusinessRes, fetchViewPropertyRes, fetchViewBusinessRes, fetchFilterRes, fetchBusinessFav, fetchPropertyFav } from "../../../API/apiServices";

function PropertyBuyList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("business");
  const [wishlist, setWishlist] = useState({}); // Store wishlist state for each item
  const [businessPrice, setBusinessPrice] = useState(0); // State for business price range
  const [propertyPrice, setPropertyPrice] = useState(0); // State for property price range
  const [homeBusiness, setHomeBusiness] = useState([]); // Initialize as an empty array
  const [homeProperty, setHomeProperty] = useState([]);
  const [filteredBusiness, setFilteredBusiness] = useState([]);
  const [filteredProperty, setFilteredProperty] = useState([]);
  const [businessFilter, setBusinessFilter] = useState({});
  const [propertyFilter, setPropertyFilter] = useState({});
  const [loading, setLoading] = useState(true);
  const user_id = useSelector((state) => state.auth.user);

  const { city } = location.state || {};
  
  const [selectedFilters, setSelectedFilters] = useState({
    // for business
    business_type: "",
    current_status: "",
    state: "",
    country: "",
    city: "",
    listing_type: "",
    // for property
    property_type: "",
    project_status: "",
    state: "",
    country: "",
    city: "",
    listing_type: "",
  });

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    // This will trigger the filters to be applied whenever the search query changes
    setSearchQuery(searchQuery);
  };

  const handleListingTypeClick = (type, section) => {
    if (section === "business") {
      setSelectedFilters({ ...selectedFilters, listing_type: type });
    } else if (section === "property") {
      setSelectedFilters({ ...selectedFilters, listing_type: type });
    }
  };
  console.log("city:", city);
  
  useEffect(() => {
    const fetchFilterData = async () => {
      const response = await fetchFilterRes();
      console.log("filter api response", response);
      if (response && response.data?.result) {
        setBusinessFilter(response.data.business_filter_fields);
        setPropertyFilter(response.data.property_filter_fields);
        setLoading(false);
      } else {
        console.error("Failed to load filter data");
        setLoading(false);
      }
    };

    fetchFilterData();
  }, []);

 
    useEffect(() => {
      const applyFilters = () => {
        const filtered = homeBusiness.filter((business) => {
          const matchesBusinessType = !selectedFilters.business_type || business.business_type === selectedFilters.business_type;
          const matchesCurrentStatus = !selectedFilters.current_status || business.current_status === selectedFilters.current_status;
          const matchesState = !selectedFilters.state || business.state === selectedFilters.state;
    
          // Adjust the matchesCity condition: give priority to selectedFilters.city over city
          const matchesCity =
            // If `selectedFilters.city` is set, use it for filtering
            (selectedFilters.city && business.city === selectedFilters.city) || 
            // If `selectedFilters.city` is not set, use `city` for filtering
            (!selectedFilters.city && city && business.city === city) ||
            // If neither `selectedFilters.city` nor `city` is set, show all results
            (!selectedFilters.city && !city);
    
          const matchesListingType = !selectedFilters.listing_type || business.listing_type === selectedFilters.listing_type;

          const matchesTitle = !searchQuery || business.title.toLowerCase().includes(searchQuery.toLowerCase()); 
    
          return (
            matchesBusinessType && 
            matchesCurrentStatus && 
            matchesState && 
            matchesCity && 
            matchesListingType &&
            matchesTitle
          );
        });
    
        setFilteredBusiness(filtered);
      };
    
      applyFilters();
    }, [selectedFilters, homeBusiness, city, searchQuery]); // Ensure `city` is in the dependencies to trigger updates when it changes
     // Ensure `city` is in the dependencies to trigger updates when it changes
  
     useEffect(() => {
      const applyPropertyFilters = () => {
        const filtered = homeProperty.filter((property) => {
          const matchesPropertyType = !selectedFilters.property_type || property.property_type === selectedFilters.property_type;
          const matchesProjectStatus = !selectedFilters.project_status || property.project_status === selectedFilters.project_status;
          const matchesState = !selectedFilters.state || property.state === selectedFilters.state;
    
          // Adjust the matchesCity condition: give priority to selectedFilters.city over city
          const matchesCity =
            (selectedFilters.city && property.city === selectedFilters.city) ||
            (!selectedFilters.city && city && property.city === city) ||
            (!selectedFilters.city && !city);
    
          const matchesListingType = !selectedFilters.listing_type || property.listing_type === selectedFilters.listing_type;
    
          // Ensure property.title is defined before calling toLowerCase()
          const matchesTitle = !searchQuery || (property.property_title && property.property_title.toLowerCase().includes(searchQuery.toLowerCase()));
    
          return (
            matchesPropertyType &&
            matchesProjectStatus &&
            matchesState &&
            matchesCity &&
            matchesListingType &&
            matchesTitle
          );
        });
    
        setFilteredProperty(filtered);
      };
    
      applyPropertyFilters();
    }, [selectedFilters, homeProperty, city, searchQuery]); // Ensure `searchQuery` is in the dependencies
    

  // Handle filter change
  const handleFilterChange = (event, filterType) => {
    const { name, value } = event.target;
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };
  // --------------------------------------------------------------------------------------------------

  const handlepropertyNavigate = (type, id) => {
    console.log("Navigating with type:", type, "and ID:", id);
    fetchViewPropertyRes(id); // Ensure you call the function here
    navigate("/single-page", { state: { type, id } });
  };

  const handlebusinessNavigate = (type, id) => {
    console.log("Navigating with type:", type, "and ID:", id);
    fetchViewBusinessRes(id); // Ensure you call the function here
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

  // Handlers for price range changes
  const handleBusinessPriceChange = (event) => {
    setBusinessPrice(event.target.value);
  };

  const handlePropertyPriceChange = (event) => {
    setPropertyPrice(event.target.value);
  };

  const handleBusinessFavorite = async (businessId) => {
    if (!user_id) {
      console.error("User ID is not available.");
      return;
    }
  
    try {
      const result = await fetchBusinessFav(businessId, user_id);
      if (!result.success) {
        console.error(result.message); // Handle error
      } else {
        console.log("Business favorite added successfully:", result);
      }
    } catch (error) {
      console.error("Error handling business favorite:", error.message);
    }
  };
  
  
  const handlePropertyFavorite = async (propertyId) => {
    if (!user_id) {
      console.error("User ID is not available.");
      return;
    }
  
    try {
      const result = await fetchPropertyFav(propertyId, user_id);
      if (!result.success) {
        console.error(result.message); // Handle error
      } else {
        console.log("Property favorite added successfully:", result);
      }
    } catch (error) {
      console.error("Error handling property favorite:", error.message);
    }
  };
  
  useEffect(() => {
    // Load wishlist state from localStorage on component mount
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(savedWishlist);
  }, []); // Empty dependency array to run only on mount

  const handleWishlistClick = (index, id) => {
    // Toggle the favorite state
    const newWishlist = [...wishlist];
    newWishlist[index] = !newWishlist[index];

    // Save the updated wishlist to localStorage
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
    setWishlist(newWishlist);

    // Handle the API call to update the favorite status
    if (activeTab === "business") {
      handleBusinessFavorite(id);
    } else if (activeTab === "property") {
      handlePropertyFavorite(id);
    }
  };

  return (
    <>
      <section className="propertyBuyListingSec">
        <div className="container">
          <div className="row">
            <div className="col-3">
              <div className="propertyBuyListingfilterBox">
                <div className="tab-buttons">
                  <button className={`tab-button ${ activeTab === "business" ? "active" : ""  }`} onClick={() => setActiveTab("business")} > Business </button>
                  <button
                    className={`tab-button ${ activeTab === "property" ? "active" : ""  }`}  onClick={() => setActiveTab("property")} >   Property </button>
                </div>
                <h6>Filter Options</h6>
                {/* Filter Options for Business */}
                {activeTab === "business" && (
                  <>
                    <div className="filter-group">
                      <label>Business Type</label>
                      <select name="business_type" value={selectedFilters.business_type} onChange={(e) => handleFilterChange(e, "business")} className="form-select" >
                        <option value="">Select Type</option>
                        {businessFilter.business_type?.map((type) => (
                          <option key={type} value={type}> {type} </option>
                        ))}
                      </select>
                    </div>

                    <div className="filter-group">
                      <label>Open/Close</label>
                      <select name="current_status" value={selectedFilters.current_status} onChange={(e) => handleFilterChange(e, "business")} className="form-select" >
                        <option value="">Select Status</option>
                        {businessFilter.current_status?.map((status) => (
                          <option key={status} value={status}> {status}</option>
                        ))}
                      </select>
                    </div>

                    <div className="filter-group">
                      <label>State</label>
                      <select name="state" value={selectedFilters.state} onChange={(e) => handleFilterChange(e, "business")} className="form-select" >
                        <option value="">Select State</option>
                        {businessFilter.state?.map((state) => (
                          <option key={state} value={state}> {state} </option>
                        ))}
                      </select>
                    </div>
                    <div className="filter-group">
                      <label>Location</label>
                      <select name="city" value={selectedFilters.city || city} onChange={(e) => handleFilterChange(e, "business")}  className="form-select" >
                        <option value="">Select Location</option>
                        {businessFilter.city?.map((location) => (
                          <option key={location} value={location}> {location} </option>
                        ))}
                      </select>
                    </div>

                    <div className="filter-group">
                      <label>Price Range (Business)</label>
                      <input type="range" min="0" max="1000000"  step="10000" value={businessPrice} onChange={handleBusinessPriceChange} className="form-range" />
                      <div className="price-value">  Selected Price: ₹{businessPrice} </div>

                      <div className="filter_listing_type">
                        <h6>Listing Type</h6>
                        <div className="filter_box">
                          <p className={`filter-button ${ selectedFilters.listing_type === "Franchising"
                                ? "active"
                                : ""
                            }`}
                            onClick={() =>  handleListingTypeClick("Franchising", "business") } >Franchising </p>
                          <p
                            className={`filter-button ${
                              selectedFilters.listing_type ===
                              "Seeking Investment"
                                ? "active"
                                : ""
                            }`}
                            onClick={() =>
                              handleListingTypeClick(
                                "Seeking Investment",
                                "business"
                              )
                            }
                          >
                            {" "}
                            Seeking Investment{" "}
                          </p>
                          <p
                            className={`filter-button ${
                              selectedFilters.listing_type === "Selling"
                                ? "active"
                                : ""
                            }`}
                            onClick={() =>
                              handleListingTypeClick("Selling", "business")
                            }
                          >
                            {" "}
                            Selling{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Filter Options for Property */}
                {activeTab === "property" && (
                  <>
                    <div className="filter-group">
                      <label>Property Type</label>
                      <select
                        name="property_type"
                        value={selectedFilters.property_type}
                        onChange={(e) => handleFilterChange(e, "property")}
                        className="form-select"
                      >
                        <option value="">Select Type</option>
                        {propertyFilter.property_type?.map((type) => (
                          <option key={type} value={type}>
                            {" "}
                            {type}{" "}
                          </option>
                        ))}{" "}
                      </select>
                    </div>

                    <div className="filter-group">
                      <label>Status</label>
                      <select
                        name="project_status"
                        value={selectedFilters.project_status}
                        onChange={(e) => handleFilterChange(e, "property")}
                        className="form-select"
                      >
                        <option value="">Select Status</option>
                        {propertyFilter.project_status?.map((status) => (
                          <option key={status} value={status}>
                            {" "}
                            {status}{" "}
                          </option>
                        ))}{" "}
                      </select>
                    </div>

                    <div className="filter-group">
                      <label>State</label>
                      <select
                        name="state"
                        value={selectedFilters.state}
                        onChange={(e) => handleFilterChange(e, "property")}
                        className="form-select"
                      >
                        <option value="">Select State</option>{" "}
                        {propertyFilter.state?.map((state) => (
                          <option key={state} value={state}>
                            {" "}
                            {state}{" "}
                          </option>
                        ))}{" "}
                      </select>
                    </div>

                    <div className="filter-group">
                      <label>Location</label>
                      <select
                        name="city"
                        value={selectedFilters.city || city}
                        onChange={(e) => handleFilterChange(e, "property")}
                        className="form-select"
                      >
                        <option value="">Select Location</option>
                        {propertyFilter.city?.map((location) => (
                          <option key={location} value={location}>
                            {" "}
                            {location}{" "}
                          </option>
                        ))}{" "}
                      </select>
                    </div>

                    <div className="filter-group">
                      <label>Price Range (Property)</label>
                      <input
                        type="range"
                        min="0"
                        max="5000000"
                        step="50000"
                        value={propertyPrice}
                        onChange={handlePropertyPriceChange}
                        className="form-range"
                      />
                      <div className="price-value">
                        {" "}
                        Selected Price: ₹{propertyPrice}{" "}
                      </div>

                      <div className="filter_listing_type">
                        <h6>Listing Type</h6>
                        <div className="filter_box">
                          <p
                            className={`filter-button ${
                              selectedFilters.listing_type === "Renting"
                                ? "active"
                                : ""
                            }`}
                            onClick={() =>
                              handleListingTypeClick("Renting", "property")
                            }
                          > Renting </p>
                          <p
                            className={`filter-button ${
                              selectedFilters.listing_type === "Listing"
                                ? "active"
                                : ""
                            }`}
                            onClick={() =>  handleListingTypeClick("Listing", "property") } >  Listing </p>
                          <p className={`filter-button ${  selectedFilters.listing_type === "Selling"  ? "active" : "" }`}
                            onClick={() => handleListingTypeClick("Selling", "property")  }  >  Selling </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="col-9">
              {activeTab === "business" && (
                <div className="row propertyBuyListingRow_1 propertyBuyListingExploreRow">
                  {/* Search Bar Section */}
                  <div className="search-bar-section">
        <input
          type="text"
          className="form-control search-input"
          placeholder="Search by title..."
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} />
        <button className="btn search-button" onClick={handleSearch}> Search </button>
      </div>
                  <div className="explorePropertyHed">
                  <h5><strong>EXPLORE NOW</strong></h5>
                  </div>
                  {filteredBusiness.map((lists, index) => (
                    <div  className="col-lg-4 recommendationsClsNameCOL" key={index} >
                      <div className="recommendationsClsNameBox">
                        {/* Wishlist Heart */}
                        <div className="propertyBuyListingBox" style={{ position: "relative" }}  >
                          <div
                            className="wishlist-heart"
                            style={{ position: "absolute", top: "10px",  right: "10px", zIndex: 10, }} onClick={() => handleWishlistClick(index, lists.id)}  >
                            {wishlist[index] ? (
                              <FaHeart className="wishlist-icon" />
                            ) : (
                              <FaRegHeart className="wishlist-icon" />
                            )}
                          </div>

                          <img
                            className="img-fluid"
                            onClick={() =>
                              handlebusinessNavigate("business", lists.id)
                            }
                            src={(() => {
                              try {
                                const fileName = lists.file_name;

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
                                console.error( "Error parsing or handling file_name:", error );
                                return "default-image.jpg";
                              }
                            })()}
                            alt={lists.title || "business Image"}/>
                          <div className="listing-details">
                            <div className="title-location">
                              <h5>{lists.title}</h5>
                              <span className="interested"> {lists.interested} Interested </span>
                            </div>
                            <h6> Asking Price: ₹ <span className="">{lists.asking_price}</span> </h6>
                            <h6> Reported Sale (yearly): ₹ <span className="green-text"> {lists.reported_turnover_from} - <br />{lists.reported_turnover_to} </span> </h6>
                            <div className="location-call">
                              <h6> <IoLocation /> {lists.city} </h6>
                              {/* <button className="call-btn"> Call <FaPhoneAlt />
                              </button> */}
                              <a href={`tel:${lists.phone_number}`} className="call-btn" style={{ textDecoration: "none" }}>Call <FaPhoneAlt /></a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "property" && (
                <div className="row propertyBuyListingRow_1">
                   {/* Search Bar Section */}
                   <div className="search-bar-section">
        <input
          type="text"
          className="form-control search-input"
          placeholder="Search by title..."
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} />
        <button className="btn search-button" onClick={handleSearch}> Search </button>
     
                  </div>
                  <div className="explorePropertyHed">
                  <h5><strong>EXPLORE NOW</strong></h5>
                  </div>
                  {filteredProperty.map((listsProperty, index) => (
                    <div className="col-lg-4 recommendationsClsNameCOL" key={index} >
                      <div className="recommendationsClsNameBox">
                        {/* Wishlist Heart */}
                        <div className="propertyBuyListingBox" style={{ position: "relative" }} >
                          <div
                            className="wishlist-heart"
                            style={{ position: "absolute", top: "10px", right: "10px",  zIndex: 10, }}
                            onClick={() => handleWishlistClick(index, listsProperty.id)  }  >
                            {wishlist[index] ? (
                              <FaHeart className="wishlist-icon" />
                            ) : (
                              <FaRegHeart className="wishlist-icon" />
                            )}
                          </div>

                          <img className="img-fluid" onClick={() => handlepropertyNavigate( "property", listsProperty.id
                              )
                            }
                            src={
                              listsProperty.file_name &&
                              Array.isArray(JSON.parse(listsProperty.file_name))
                                ? JSON.parse(listsProperty.file_name)[0]
                                : "default-image.jpg"
                            }
                            alt={listsProperty.property_title}
                          />
                          <div className="title-location">
                            <h5>{listsProperty.property_title}</h5>
                            <span className="interested">{listsProperty.interested} Interested </span>
                          </div>
                          <h6> Asking Price: ₹ <span>{listsProperty.asking_price}</span> </h6>
                          <div>
                            <h6> Property Type : <strong>{listsProperty.property_type}</strong> </h6>
                          </div>
                          {/* <h6>  Reported Sale (yearly):  <span>{listsProperty.price}</span> </h6> */}
                          {/* <h6><IoLocation /> {listsProperty.city}</h6> */}
                          <div className="location-call">
                            <h6> <IoLocation /> {listsProperty.city} </h6>
                            {/* <button className="call-btn"> Call <FaPhoneAlt /> </button> */}
                            <a href={`tel:${listsProperty.phone_number}`} className="call-btn" style={{ textDecoration: "none" }}>Call <FaPhoneAlt /></a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default PropertyBuyList;
