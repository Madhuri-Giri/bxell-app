
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
  const [homeBusiness, setHomeBusiness] = useState([]);
  const [homeProperty, setHomeProperty] = useState([]);
  const [filteredHomeBusiness, setFilteredHomeBusiness] = useState([]);
  const [filteredHomeProperty, setFilteredHomeProperty] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [filterData, setFilterData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFilters = async () => {
      const response = await fetchFilterRes();
      if (response?.data) {
        setFilterData(response.data);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchProperty = async () => {
      const data = await fetchPropertyRes();
      if (data && Array.isArray(data)) {
        setHomeProperty(data);
        setFilteredHomeProperty(data);
      }
    };

    const fetchBusiness = async () => {
      const data = await fetchBusinessRes();
      if (data && Array.isArray(data)) {
        setHomeBusiness(data);
        setFilteredHomeBusiness(data);
      }
    };

    fetchProperty();
    fetchBusiness();
  }, []);

  const handleSearch = () => {
    console.log('Search Title:', searchTitle);
    console.log('Selected City:', selectedCity);  // Check if selected city is correct
  
    if (searchTitle || selectedCity) {
      const filteredBusinesses = homeBusiness.filter(
        (list) => {
          const isTitleMatch = list.title.toLowerCase().includes(searchTitle.toLowerCase());
          const isCityMatch = list.city?.toLowerCase() === selectedCity.toLowerCase();
          console.log('Business City:', list.city, 'Matches:', isCityMatch); // Debug
          return (searchTitle ? isTitleMatch : true) && (selectedCity ? isCityMatch : true);
        }
      );
  
      const filteredProperties = homeProperty.filter(
        (property) => {
          const isTitleMatch = property.property_title.toLowerCase().includes(searchTitle.toLowerCase());
          const isCityMatch = property.city?.toLowerCase() === selectedCity.toLowerCase();
          console.log('Property City:', property.city, 'Matches:', isCityMatch); // Debug
          return (searchTitle ? isTitleMatch : true) && (selectedCity ? isCityMatch : true);
        }
      );
  
      setFilteredHomeBusiness(filteredBusinesses);
      setFilteredHomeProperty(filteredProperties);
    } else {
      // Reset to original data if no search criteria
      setFilteredHomeBusiness(homeBusiness);
      setFilteredHomeProperty(homeProperty);
    }
  };
  
  
  const handleSelectCity = (city) => {
    console.log('City Selected:', city);  // Debugging the selected city
    setSelectedCity(city);
    handleSearch();
  };
  

  const handlepropertyNavigate = (type, id) => {
    fetchViewPropertyRes(id);
    navigate("/single-page", { state: { type, id } });
  };

  const handlebusinessNavigate = (type, id) => {
    fetchViewBusinessRes(id);
    navigate("/single-page", { state: { type, id } });
  };

  return (
    <>
      <div className="container">
        <Form className="search-form">
          <div className="row formSearchRow d-flex">
            <div className="col-lg-4 col-4 formSearchCOL">
            <DropdownButton
  id="dropdown-basic-button"
  title={selectedCity || "Select City"}
  className="country-dropdown"
  onSelect={(city) => handleSelectCity(city)} // Ensure city is passed correctly
>
  {filterData &&
    filterData.business_filter_fields?.city &&
    [...new Set([...filterData.business_filter_fields.city, ...filterData.property_filter_fields?.city || []])].map((city, index) => (
      <Dropdown.Item key={index} eventKey={city}>
        {city}
      </Dropdown.Item>
    ))}
</DropdownButton>

            </div>
            <div className="col-lg-8 col-8 formSearchCOL">
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
      </div>
    

      <section className="homeRecomendedListSEC">
        <div className="container">
          <div className="explorePropertyHed homeRecomendedList">
            <h6>RECOMMENDED LISTINGS FOR YOU</h6>
          </div>

          <div className="row recommendationsClsNameRow_1 recommendationsClsNameExploreRow">
            {filteredHomeBusiness.slice(0, 4).map((list, index) => (
              <div className="col-lg-3 col-md-6 recommendationsClsNameCOL" key={index}>
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
             {list.subscription && list.subscription.length > 0 && list.subscription[0].status === 'Valid' && (
                      <div className="promotedText">
                        {list.subscription[0].type}
                      </div>
                    )}
                    {/* <h5 className="promotedText">{list.promoting}</h5> */}
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
            {filteredHomeProperty.slice(0, 4).map((property, index) => (
              <div className="col-lg-3 col-md-6 recommendationsClsNameCOL" key={index}>
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
                  {property.subscription && property.subscription.length > 0 && property.subscription[0].status === 'Valid' &&(
                      <div className="promotedText">
                          {property.subscription[0].type}
                      </div>
                  )}
                  <div>
                      {/* <h6>Property Type : <strong>{property.property_type}</strong></h6> */}
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
