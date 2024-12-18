/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "./PropertyBuyList.css";
import { IoLocation } from "react-icons/io5";
import { FaHeart, FaPhoneAlt, FaRegHeart } from "react-icons/fa"; // Added icons
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { fetchPropertyRes, fetchBusinessRes } from "../../../API/apiServices";
import { fetchViewPropertyRes } from "../../../API/apiServices"; // Adjust the path if needed
import { fetchViewBusinessRes } from "../../../API/apiServices";
import { fetchFilterRes } from "../../../API/apiServices";

function PropertyBuyList() {
  const navigate = useNavigate();
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

  const handleListingTypeClick = (type, section) => {
    if (section === "business") {
      setSelectedFilters({ ...selectedFilters, listing_type: type });
    } else if (section === "property") {
      setSelectedFilters({ ...selectedFilters, listing_type: type });
    }
  };

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
        const matchesCity =
          !selectedFilters.city || business.city === selectedFilters.city;
        const matchesListingType =
          !selectedFilters.listing_type ||
          business.listing_type === selectedFilters.listing_type;

        return (
          matchesBusinessType &&
          matchesCurrentStatus &&
          matchesState &&
          matchesCity &&
          matchesListingType
        );
      });
      setFilteredBusiness(filtered);
    };

    applyFilters();
  }, [selectedFilters, homeBusiness]);

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
        const matchesCity =
          !selectedFilters.city || property.city === selectedFilters.city;
        const matchesListingType =
          !selectedFilters.listing_type ||
          property.listing_type === selectedFilters.listing_type;

        return (
          matchesPropertyType &&
          matchesProjectStatus &&
          matchesState &&
          matchesCity &&
          matchesListingType
        );
      });
      setFilteredProperty(filtered);
    };

    applyPropertyFilters();
  }, [selectedFilters, homeProperty]);

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

  const handleWishlistClick = (index) => {
    setWishlist((prevState) => ({
      ...prevState,
      [index]: !prevState[index], // Toggle the wishlist state (true/false)
    }));
  };

  return (
    <>
      <section className="propertyBuyListingSec">
        <div className="container">
          <div className="row">
            <div></div>
            <div className="col-3">
              <div className="propertyBuyListingfilterBox">
                <div className="tab-buttons">
                  <button
                    className={`tab-button ${
                      activeTab === "business" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("business")}
                  >
                    Business
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
                            {type}
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
                            {status}
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
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="filter-group">
                      <label>Location</label>
                      <select
                        name="city"
                        value={selectedFilters.city}
                        onChange={(e) => handleFilterChange(e, "business")}
                        className="form-select"
                      >
                        <option value="">Select Location</option>
                        {businessFilter.city?.map((location) => (
                          <option key={location} value={location}>
                            {location}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="filter-group">
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
                        Selected Price: ₹{businessPrice}
                      </div>

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
                            Franchising
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
                            Seeking Investment
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
                            Selling
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
                            {type}
                          </option>
                        ))}
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
                            {status}
                          </option>
                        ))}
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
                        <option value="">Select State</option>
                        {propertyFilter.state?.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="filter-group">
                      <label>Location</label>
                      <select
                        name="city"
                        value={selectedFilters.city}
                        onChange={(e) => handleFilterChange(e, "property")}
                        className="form-select"
                      >
                        <option value="">Select Location</option>
                        {propertyFilter.city?.map((location) => (
                          <option key={location} value={location}>
                            {" "}
                            {location}{" "}
                          </option>
                        ))}
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
                          >
                            Renting
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
                            Listing
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
                            Selling
                          </p>
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
                  <div className="explorePropertyHed">
                    <h5>EXPLORE BUSINESSES (RECOMMENDED)</h5>{" "}
                  </div>
                  {filteredBusiness.map((lists, index) => (
                    <div className="col-lg-6" key={index}>
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
                          onClick={() => handleWishlistClick(index)}
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
                              console.error(
                                "Error parsing or handling file_name:",
                                error
                              );
                              return "default-image.jpg"; // Fallback in case of error
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
                          <h6>Asking Price: {lists.asking_price}</h6>
                          <h6>
                            Reported Sale (yearly): <span>{lists.price}</span>
                          </h6>
                          <div className="location-call">
                            <h6>
                              <IoLocation /> {lists.city}
                            </h6>
                            <button className="call-btn">
                              Call <FaPhoneAlt />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "property" && (
                <div className="row propertyBuyListingRow_1">
                  <div className="explorePropertyHed">
                    <h5>EXPLORE PROPERTIES</h5>
                  </div>
                  {filteredProperty.map((listsProperty, index) => (
                    <div className="col-lg-6" key={index}>
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
                          onClick={() => handleWishlistClick(index)}
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
                          <span className="interested">
                            {" "}
                            {listsProperty.interested} Interested{" "}
                          </span>
                        </div>
                        <h6>Asking Price: {listsProperty.asking_price}</h6>
                        <h6>
                          {" "}
                          Reported Sale (yearly):{" "}
                          <span>{listsProperty.price}</span>{" "}
                        </h6>
                        {/* <h6><IoLocation /> {listsProperty.city}</h6> */}
                        <div className="location-call">
                          <h6>
                            {" "}
                            <IoLocation /> {listsProperty.city}
                          </h6>
                          <button className="call-btn">
                            {" "}
                            Call <FaPhoneAlt />{" "}
                          </button>
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
