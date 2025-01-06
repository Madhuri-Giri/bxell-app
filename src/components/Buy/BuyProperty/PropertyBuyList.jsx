/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "./PropertyBuyList.css";
import { useSelector } from "react-redux";
import { IoLocation } from "react-icons/io5";
import { FaHeart, FaPhoneAlt, FaRegHeart } from "react-icons/fa"; // Added icons
import { useNavigate, useLocation } from "react-router-dom";
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
    ebitda_margin: "",
    asking_price:"",
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Adjust items per page as needed

  // Calculate the start and end index for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Slice data for the current page
  const paginatedBusiness = filteredBusiness.slice(startIndex, endIndex);
  const paginatedProperty = filteredProperty.slice(startIndex, endIndex);

  // Total pages for pagination
  const totalBusinessPages = Math.ceil(filteredBusiness.length / itemsPerPage);
  const totalPropertyPages = Math.ceil(filteredProperty.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = (totalPages) => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
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
        const matchesBusinessType =
          !selectedFilters.business_type ||
          business.business_type === selectedFilters.business_type;
        const matchesCurrentStatus =
          !selectedFilters.current_status ||
          business.current_status === selectedFilters.current_status;
        const matchesState =
          !selectedFilters.state || business.state === selectedFilters.state;
          
          const matchesMargin =
          !selectedFilters.ebitda_margin ||
          business.ebitda_margin === selectedFilters.ebitda_margin;

          const matchesCountry =
          !selectedFilters.country ||
          business.country === selectedFilters.country;

          const matchesPrice = !selectedFilters.asking_price || business.asking_price === selectedFilters.asking_price;

        // Adjust the matchesCity condition: give priority to selectedFilters.city over city
        const matchesCity =
          // If `selectedFilters.city` is set, use it for filtering
          (selectedFilters.city && business.city === selectedFilters.city) ||
          // If `selectedFilters.city` is not set, use `city` for filtering
          (!selectedFilters.city && city && business.city === city) ||
          // If neither `selectedFilters.city` nor `city` is set, show all results
          (!selectedFilters.city && !city);

        const matchesListingType =
          !selectedFilters.listing_type ||
          business.listing_type === selectedFilters.listing_type;

        const matchesTitle =
          !searchQuery ||
          business.title.toLowerCase().includes(searchQuery.toLowerCase());


        return (
          matchesBusinessType &&
          matchesCurrentStatus &&
          matchesState &&
          matchesMargin &&
          matchesCity &&
          matchesListingType &&
          matchesTitle &&
          matchesPrice &&
          matchesCountry 
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
        const matchesPropertyType =
          !selectedFilters.property_type ||
          property.property_type === selectedFilters.property_type;
        const matchesProjectStatus =
          !selectedFilters.project_status ||
          property.project_status === selectedFilters.project_status;
        const matchesState =
          !selectedFilters.state || property.state === selectedFilters.state;

          const matchesPrice =
          !selectedFilters.asking_price || property.asking_price === selectedFilters.asking_price;

          const matchesCountry =
          !selectedFilters.country || property.country === selectedFilters.country;
    
        const matchesFurnishing =
          !selectedFilters.furnishing ||
          property.furnishing === selectedFilters.furnishing;
    
        const matchesCarParking =
          !selectedFilters.car_parking ||
          property.car_parking === selectedFilters.car_parking;

        // Adjust the matchesCity condition: give priority to selectedFilters.city over city
        const matchesCity =
          (selectedFilters.city && property.city === selectedFilters.city) ||
          (!selectedFilters.city && city && property.city === city) ||
          (!selectedFilters.city && !city);

        const matchesListingType =
          !selectedFilters.listing_type ||
          property.listing_type === selectedFilters.listing_type;

        // Ensure property.title is defined before calling toLowerCase()
        const matchesTitle =
          !searchQuery ||
          (property.property_title &&
            property.property_title
              .toLowerCase()
              .includes(searchQuery.toLowerCase()));

        return (
          matchesPropertyType &&
          matchesProjectStatus &&
          matchesState &&
          matchesCity &&
          matchesListingType &&
          matchesCountry &&
          matchesFurnishing &&
          matchesCarParking &&
          matchesTitle && 
          matchesPrice
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
            <div className="col-lg-3 col-sm-4 filter_res">
              <div className="propertyBuyListingfilterBox">
                <div className="tab-buttons">
                  <button
                    className={`tab-button ${
                      activeTab === "business" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("business")}
                  >
                    {" "}
                    Business{" "}
                  </button>
                  <button
                    className={`tab-button ${
                      activeTab === "property" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("property")}
                  >
                    {" "}
                    Property{" "}
                  </button>
                </div>
                <h6>Filter Options</h6>
                {/* Filter Options for Business */}
                {activeTab === "business" && (
                  <>
                    <div className="filter-group">
                      <label>Business Type</label>
                      <select
                        name="business_type"
                        value={selectedFilters.business_type}
                        onChange={(e) => handleFilterChange(e, "business")}
                        className="form-select"
                      >
                        <option value="">Select Type</option>
                        {businessFilter.business_type?.map((type) => (
                          <option key={type} value={type}>
                            {" "}
                            {type}{" "}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="filter-group">
                      <label>Open/Close</label>
                      <select
                        name="current_status"
                        value={selectedFilters.current_status}
                        onChange={(e) => handleFilterChange(e, "business")}
                        className="form-select"
                      >
                        <option value="">Select Status</option>
                        {businessFilter.current_status?.map((status) => (
                          <option key={status} value={status}>
                            {" "}
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="filter-group">
                      <label>Country</label>
                      <select
                        name="country"
                        value={selectedFilters.country}
                        onChange={(e) => handleFilterChange(e, "business")}
                        className="form-select"
                      >
                        <option value="">Select Country</option>
                        {businessFilter.country?.map((country) => (
                          <option key={country} value={country}>
                            {" "}
                            {country}{" "}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="filter-group">
                      <label>State</label>
                      <select
                        name="state"
                        value={selectedFilters.state}
                        onChange={(e) => handleFilterChange(e, "business")}
                        className="form-select"
                      >
                        <option value="">Select State</option>
                        {businessFilter.state?.map((state) => (
                          <option key={state} value={state}>
                            {" "}
                            {state}{" "}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="filter-group">
                      <label>Location</label>
                      <select
                        name="city"
                        value={selectedFilters.city || city}
                        onChange={(e) => handleFilterChange(e, "business")}
                        className="form-select"
                      >
                        <option value="">Select Location</option>
                        {businessFilter.city?.map((location) => (
                          <option key={location} value={location}>
                            {" "}
                            {location}{" "}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="filter-group">
                      <label>Margin</label>
                      <select
                        name="ebitda_margin"
                        value={selectedFilters.ebitda_margin}
                        onChange={(e) => handleFilterChange(e, "business")}
                        className="form-select"
                      >
                        <option value="">Select Status</option>
                        {businessFilter.ebitda_margin?.map((ebitda_margin) => (
                          <option key={ebitda_margin} value={ebitda_margin}>
                            {" "}
                            {ebitda_margin}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="filter-group">
                      <label>Price</label>
                      <select
                        name="asking_price"
                        value={selectedFilters.asking_price}
                        onChange={(e) => handleFilterChange(e, "business")}
                        className="form-select"
                      >
                        <option value="">Select Status</option>
                        {businessFilter.asking_price?.map((asking_price) => (
                          <option key={asking_price} value={asking_price}>
                            {" "}
                            {asking_price}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* <div className="filter-group">
                      <label>Price Range (Business)</label>
                      <input
                        type="range"
                        min="0"
                        max="1000000"
                        step="10000"
                        value={businessPrice}
                        onChange={handleBusinessPriceChange}
                        className="form-range"
                      />
                      <div className="price-value">
                        {" "}
                        Selected Price: ₹{businessPrice}{" "}
                      </div> */}

                    <div className="filter_listing_type">
                      <h6>Listing Type</h6>
                      <div className="filter_box">
                        <p
                          className={`filter-button ${
                            selectedFilters.listing_type === "Franchising"
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            handleListingTypeClick("Franchising", "business")
                          }
                        >
                          Franchising{" "}
                        </p>
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
                    {/* </div> */}
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
                      <label>Country</label>
                      <select
                        name="country"
                        value={selectedFilters.country}
                        onChange={(e) => handleFilterChange(e, "property")}
                        className="form-select"
                      >
                        <option value="">Select State</option>{" "}
                        {propertyFilter.country?.map((country) => (
                          <option key={country} value={country}>
                            {" "}
                            {country}{" "}
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
                  <label>Furnishing</label>
                  <select
                    name="furnishing"
                    value={selectedFilters.furnishing}
                    onChange={(e) => handleFilterChange(e, "property")}
                    className="form-select"
                  >
                    <option value="">Select Furnishing</option>
                    {propertyFilter.furnishing?.map((furnishing) => (
                      <option key={furnishing} value={furnishing}>
                        {furnishing}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="filter-group">
                  <label>Car Parking</label>
                  <select
                    name="car_parking"
                    value={selectedFilters.car_parking}
                    onChange={(e) => handleFilterChange(e, "property")}
                    className="form-select"
                  >
                    <option value="">Select Car Parking</option>
                    {propertyFilter.car_parking?.map((car_parking) => (
                      <option key={car_parking} value={car_parking}>
                        {car_parking}
                      </option>
                    ))}
                  </select>
                </div>
                    <div className="filter-group">
                      <label>Price</label>
                      <select
                        name="asking_price"
                        value={selectedFilters.asking_price}
                        onChange={(e) => handleFilterChange(e, "property")}
                        className="form-select"
                      >
                        <option value="">Select Status</option>
                        {propertyFilter.asking_price?.map((asking_price) => (
                          <option key={asking_price} value={asking_price}>
                            {" "}
                            {asking_price}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* <div className="filter-group">
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
                      </div> */}

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
                        >
                          {" "}
                          Renting{" "}
                        </p>
                        <p
                          className={`filter-button ${
                            selectedFilters.listing_type === "Listing"
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            handleListingTypeClick("Listing", "property")
                          }
                        >
                          {" "}
                          Listing{" "}
                        </p>
                        <p
                          className={`filter-button ${
                            selectedFilters.listing_type === "Selling"
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            handleListingTypeClick("Selling", "property")
                          }
                        >
                          {" "}
                          Selling{" "}
                        </p>
                      </div>
                    </div>
                    {/* </div> */}
                  </>
                )}
              </div>
            </div>

            <div className="col-lg-9 col-sm-8 filter_search">
            {activeTab === "business" && (
                <div className="row propertyBuyListingRow_1 propertyBuyListingExploreRow recommendationsClsName_1">
                  {/* Search Bar Section */}
                  <div className="search-bar-section">
                    <input
                      type="text"
                      className="form-control search-input"
                      placeholder="Search by title..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="btn search-button" onClick={handleSearch}>
                      Search
                    </button>
                  </div>

                  <div className="explorePropertyHed">
                    <h5>
                      <strong>EXPLORE NOW</strong>
                    </h5>
                  </div>

                  {paginatedBusiness.length > 0 ? (
                    paginatedBusiness.map((lists, index) => (
                      <div
                        className="col-lg-4 col-md-6 col-sm-12 recommendationsClsNameCOL"
                        key={index}
                      >
                        <div className="recommendationsClsNameBox">
                          {/* Wishlist Heart */}
                          <div
                            className="propertyBuyListingBox"
                            style={{ position: "relative" }}
                          >
                            <div
                              className="wishlist-heart"
                              style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                zIndex: 10,
                              }}
                              onClick={() => handleWishlistClick(index, lists.id)}
                            >
                              {wishlist[index] ? (
                                <FaHeart className="wishlist-icon" />
                              ) : (
                                <FaRegHeart className="wishlist-icon" />
                              )}
                            </div>

                            <img
                              className="img-fluid"
                              onClick={() => handlebusinessNavigate("business", lists.id)}
                              src={(() => {
                                try {
                                  const fileName = lists.file_name;

                                  // Parse the file_name if it's a JSON string
                                  const files =
                                    typeof fileName === "string" && fileName.startsWith("[")
                                      ? JSON.parse(fileName)
                                      : fileName;

                                  if (typeof files === "string") {
                                    // Single image case
                                    return files.startsWith("http")
                                      ? files
                                      : `${BASE_URL}/${files}`;
                                  } else if (Array.isArray(files) && files.length > 0) {
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
                                  return "default-image.jpg";
                                }
                              })()}
                              alt={lists.title || "business Image"}
                            />
                            <div className="listing-details">
                              <div className="title-location">
                                <h5>{lists.title}</h5>
                                <span className="interested">
                                  {lists.interested} Interested
                                </span>
                              </div>
                              <div className="home_price">
                                <span className="buy_titles">
                                  Asking Price: ₹ <span>{lists.asking_price}</span>
                                </span>
                                <span className="home_con">{lists.listing_type}</span>
                              </div>
                              <span className="buy_titles">
                                Reported Sale (yearly):
                                <br /> ₹
                                <span className="green-text">
                                  {lists.reported_turnover_from} - {lists.reported_turnover_to}
                                </span>
                              </span>

                              <div className="location-call">
                                <h6>
                                  <IoLocation /> {lists.city}
                                </h6>
                                <a
                                  href={`tel:${lists.phone_number}`}
                                  className="call-btn"
                                  style={{ textDecoration: "none" }}
                                >
                                  Call <FaPhoneAlt />
                                </a>
                              </div>
                              {lists.subscription &&
                                lists.subscription.length > 0 &&
                                lists.subscription[0].status === "Valid" && (
                                  <div className="promotedText">
                                    {lists.subscription[0].type}
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="data-not-found">
                      <h4>Data Not Found</h4>
                      <p>No results match your filters. Please try adjusting the filters.</p>
                    </div>
                  )}

                  {/* Pagination Controls */}
                  {paginatedBusiness.length > 0 && (
                    <div className="pagination-controls">
                      <button
                        onClick={handlePreviousPage}
                        className="page-button"
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalBusinessPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`page-button ${
                              page === currentPage ? "active" : ""
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                      <button
                        onClick={() => handleNextPage(totalBusinessPages)}
                        className="page-button"
                        disabled={currentPage === totalBusinessPages}
                      >
                        Next
                      </button>
                    </div>
                  )}
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn search-button" onClick={handleSearch}>
                  Search
                </button>
              </div>

              <div className="explorePropertyHed">
                <h5>
                  <strong>EXPLORE NOW</strong>
                </h5>
              </div>

              {paginatedProperty.length > 0 ? (
                paginatedProperty.map((listsProperty, index) => (
                  <div
                    className="col-lg-4 col-md-6 col-sm-12 recommendationsClsNameCOL"
                    key={index}
                  >
                    <div className="recommendationsClsNameBox recommendationsClsName_1">
                      {/* Wishlist Heart */}
                      <div
                        className="propertyBuyListingBox"
                        style={{ position: "relative" }}
                      >
                        <div
                          className="wishlist-heart"
                          style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            zIndex: 10,
                          }}
                          onClick={() => handleWishlistClick(index, listsProperty.id)}
                        >
                          {wishlist[index] ? (
                            <FaHeart className="wishlist-icon" />
                          ) : (
                            <FaRegHeart className="wishlist-icon" />
                          )}
                        </div>

                        <img
                          className="img-fluid"
                          onClick={() =>
                            handlepropertyNavigate("property", listsProperty.id)
                          }
                          src={(() => {
                            try {
                              const fileNames = JSON.parse(listsProperty.file_name);
                              return Array.isArray(fileNames) && fileNames.length > 0
                                ? fileNames[0]
                                : "default-image.jpg";
                            } catch (error) {
                              console.error("Error parsing file_name:", error);
                              return listsProperty.file_name || "default-image.jpg";
                            }
                          })()}
                          alt={listsProperty.property_title}
                        />

                        <div className="title-location">
                          <h5>{listsProperty.property_title}</h5>
                          <span className="interested">
                            {listsProperty.interested} Interested
                          </span>
                        </div>
                        <div className="home_price">
                          <span className="buy_titles">
                            Price: ₹ <span>{listsProperty.asking_price}</span>
                          </span>
                          <span className="home_con">{listsProperty.listing_type}</span>
                        </div>
                        <div>
                          <span className="buy_titles">
                            Property Type:{" "}
                            <strong>{listsProperty.property_type}</strong>
                          </span>
                        </div>
                        {listsProperty.subscription &&
                          listsProperty.subscription.length > 0 &&
                          listsProperty.subscription[0].status === "Valid" && (
                            <div className="promotedText">
                              {listsProperty.subscription[0].type}
                            </div>
                          )}
                        <div className="location-call">
                          <h6>
                            <IoLocation /> {listsProperty.city}
                          </h6>
                          <a
                            href={`tel:${listsProperty.phone_number}`}
                            className="call-btn"
                            style={{ textDecoration: "none" }}
                          >
                            Call <FaPhoneAlt />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="data-not-found">
                  <h4>Data Not Found</h4>
                  <p>No results match your filters. Please try adjusting the filters.</p>
                </div>
              )}

              {/* Pagination Controls */}
              {paginatedProperty.length > 0 && (
                <div className="pagination-controls">
                  <button
                    onClick={handlePreviousPage}
                    className="page-button"
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPropertyPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`page-button ${
                          page === currentPage ? "active" : ""
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => handleNextPage(totalPropertyPages)}
                    className="page-button"
                    disabled={currentPage === totalPropertyPages}
                  >
                    Next
                  </button>
                </div>
              )}
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
