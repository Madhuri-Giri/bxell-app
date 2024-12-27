/ eslint-disable no-unused-vars /
import React, { useState, useEffect } from "react";
import "./RecomendedList.css";
import { IoLocation } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { fetchPropertyRes, fetchBusinessRes } from "../../../API/apiServices";
import { useNavigate } from "react-router-dom";
import { fetchViewPropertyRes } from "../../../API/apiServices"; // Adjust the path if needed
import { fetchViewBusinessRes } from "../../../API/apiServices";
import { FaHeart, FaPhoneAlt, FaRegHeart } from "react-icons/fa";
import home_bxell from "../../../assets/Images/home_bxell.png";
import { Button, Form, FormControl, Dropdown, DropdownButton, InputGroup } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { fetchFilterRes } from "../../../API/apiServices";

function RecomendedList() {
  const [homeBusiness, setHomeBusiness] = useState([]); // Initialize as an empty array
  const [homeProperty, setHomeProperty] = useState([]);
  const navigate = useNavigate();

   const [searchTitle, setSearchTitle] = useState(""); // State for search input
    const [selectedCountry, setSelectedCountry] = useState(""); // State for selected country
    const [filterData, setFilterData] = useState(null); // Store filter data
    const [filteredResults, setFilteredResults] = useState([]); // Store filtered results
  
    // Fetch filter data on component mount
    useEffect(() => {
      const fetchFilters = async () => {
        const response = await fetchFilterRes();
        if (response?.data) {
          setFilterData(response.data);
        }
      };
      fetchFilters();
    }, []);
  
    const handleSearch = () => {
      if (filterData) {
        const businessTitles = filterData.business_filter_fields?.title || [];
        const propertyTitles = filterData.property_filter_fields?.title || [];
        const selectedCountryLower = selectedCountry.toLowerCase();
    
        // Filter based on search title and country
        const filteredBusinesses = homeBusiness.filter(
          (list) =>
            list.title.toLowerCase().includes(searchTitle.toLowerCase()) ||
            filterData.business_filter_fields?.country?.some(
              (country) => country.toLowerCase() === selectedCountryLower
            )
        );
    
        const filteredProperties = homeProperty.filter(
          (property) =>
            property.property_title.toLowerCase().includes(searchTitle.toLowerCase()) ||
            filterData.property_filter_fields?.country?.some(
              (country) => country.toLowerCase() === selectedCountryLower
            )
        );
    
        // Combine and update filtered results
        setHomeBusiness(filteredBusinesses);
        setHomeProperty(filteredProperties);
      }
    };
    
    const handleSelectCountry = (country) => {
      console.log("Selected Country: ", country); // Log selected country for debugging
      setSelectedCountry(country);
      handleSearch(); // Trigger search when country is selected
    };
    
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

  return (
    <>
     {/* Home search Section */}
     <Form className="search-form">
            <div className="row formSearchRow">
              {/* Country Dropdown */}
              <div className="col-md-3 col-4 formSearchCOL">
              <DropdownButton
                  id="dropdown-basic-button"
                  title={selectedCountry || "Select Country"}
                  className="country-dropdown"
                  onSelect={handleSelectCountry}
                >
                  {filterData &&
                    filterData.business_filter_fields?.country?.length > 0 &&
                    filterData.business_filter_fields.country
                      .concat(filterData.property_filter_fields?.country || [])
                      .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
                      .map((country, index) => (
                        <Dropdown.Item key={index} eventKey={country}>
                          {country}
                        </Dropdown.Item>
                      ))}
                </DropdownButton>
              </div>

              {/* Search Input */}
              <div className="col-md-7 col-8 formSearchCOL">
              <InputGroup>
                  <FormControl
                    type="text"
                    placeholder="Search a Business, Property for you..."
                    className="search-input"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                  />
                  <InputGroup.Text className="search-icon" onClick={handleSearch}>
                    <FaSearch />
                  </InputGroup.Text>
                </InputGroup>
              </div>
            </div>
          </Form>

      <section className="homeRecomendedListSEC">
        <div className="container">
          <div className="explorePropertyHed homeRecomendedList">
            <h6>RECOMMENDED LISTINGS FOR YOU</h6>
          </div>

          <div className="row recommendationsClsNameRow_1 recommendationsClsNameExploreRow">
            {homeBusiness.slice(0, 4).map((list, index) => (
              <div className="col-lg-3 recommendationsClsNameCOL" key={index}>
                <div className="recommendationsClsNameBox">
                  <div className="promotedTextWrapper">
                    <img
                      className="img-fluid"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handlebusinessNavigate("business", list.id)
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
                          return "default-image.jpg"; // Fallback in case of error
                        }
                      })()}
                      alt={list.title || "business Image"}
                    />

                    <h5 className="promotedText">{list.promoting}</h5>
                  </div>
                  <h5>{list.title}</h5>
                  <div className="home_price">
                    <h6>
                      Asking Price: ₹ <span>{list.asking_price}</span>
                    </h6>
                    <span className="home_con">{list.listing_type}</span>
                  </div>

                  <h6>Reported Sale (yearly): {list.sale}
                    <br />₹ <span className="green-text">
                      {" "}
                      {list.reported_turnover_from} -{" "}
                      {list.reported_turnover_to}{" "}
                    </span>
                  </h6>
                  <div className="location-call">
                    <h6>
                      <IoLocation /> {list.city}
                    </h6>
                  
                    <a href={`tel:${list.phone_number}`} className="call-btn" style={{ textDecoration: "none" }}>Call <FaPhoneAlt /></a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row recommendationsClsNameRow_1 recommendationsClsNameExploreRow">
            {homeProperty.slice(0, 4).map((property, index) => (
              <div className="col-lg-3 recommendationsClsNameCOL" key={index}>
                <div className="recommendationsClsNameBox">
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
                          return "default-image.jpg"; // Fallback in case of error
                        }
                      })()}
                      alt={property.title || "business Image"}
                    />
                  </div>
                  <h5>{property.property_title}</h5>
                  <div className="home_price">
                    <h6>
                      Price: ₹ <span>{property.asking_price}</span>
                    </h6>
                    <span className="home_con">{property.listing_type}</span>
                  </div>
                  
                  <div>
                      <h6>Property Type : <strong>{property.property_type}</strong></h6>
                  </div>
                  <div className="location-call">
                    <h6>
                      <IoLocation /> {property.city}
                    </h6>
                  
                    <a href={`tel:${property.phone_number}`} className="call-btn" style={{ textDecoration: "none" }}>Call <FaPhoneAlt /></a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="exploreMoreListingBtnDiv">
            <NavLink to="buy" className="exploreMoreListingBtn">
              Explore More Listing
            </NavLink>
          </div>
        </div>
      </section>
      <div className="home_img">
        <img src={home_bxell} />
      </div>
    </>
  );
}

export default RecomendedList;
