import React, { useState, useEffect } from "react";
import { fetchPropertyRes, fetchBusinessRes, fetchCountryRes, fetchFilterRes, fetchViewPropertyRes, fetchViewBusinessRes, fetchBusinessFav, fetchPropertyFav, fetchPropertyFavoriteRes, fetchBusinessFavoriteRes  } from "../../../API/apiServices";
import { useNavigate } from "react-router-dom";
import { FaHeart,FaRegHeart, FaPhoneAlt, FaSearch } from "react-icons/fa";
import { IoLocation } from "react-icons/io5";
import home_bxell from "../../../assets/Images/home_bxell.png";
import { Form, FormControl, Dropdown, DropdownButton, InputGroup } from "react-bootstrap";
import ReactStars from "react-rating-stars-component";
import "./RecomendedList.css";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

function RecomendedList() {
  const navigate = useNavigate();
  const [homeBusiness, setHomeBusiness] = useState([]);
  const [homeProperty, setHomeProperty] = useState([]);
  const [filteredHomeBusiness, setFilteredHomeBusiness] = useState([]);
  const [filteredHomeProperty, setFilteredHomeProperty] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [filterData, setFilterData] = useState(null);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry]= useState(null);
  const [wishlist, setWishlist] = useState({}); 
  const [activeTab, setActiveTab] = useState("property");
  const user_id = useSelector((state) => state.auth.user);
  
    useEffect(() => {
      const getCountries = async () => {
        try {
          const data = await fetchCountryRes();
          if (data && data.country) {
            setCountries(data.country); // Populate the countries dropdown
          } else {
            console.error("Failed to fetch countries.");
          }
        } catch (error) {
          console.error("Error fetching countries:", error);
        }
      };
    
      getCountries();
    }, []);

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
    console.log("Search Title:", searchTitle);
    console.log("Selected Country:", selectedCountry); // Log selected country
  
    if (searchTitle || selectedCountry) {
      const filteredBusinesses = homeBusiness.filter((list) => {
        const isTitleMatch = list.title.toLowerCase().includes(searchTitle.toLowerCase());
        const isCountryMatch = selectedCountry
          ? list.country?.toLowerCase() === selectedCountry.toLowerCase() // Match country only if selectedCountry is not null
          : true;
        console.log("Business Country:", list.country, "Matches:", isCountryMatch); // Debug
        return (searchTitle ? isTitleMatch : true) && (selectedCountry ? isCountryMatch : true);
      });
  
      const filteredProperties = homeProperty.filter((property) => {
        const isTitleMatch = property.property_title.toLowerCase().includes(searchTitle.toLowerCase());
        const isCountryMatch = selectedCountry
          ? property.country?.toLowerCase() === selectedCountry.toLowerCase() // Match country only if selectedCountry is not null
          : true;
        console.log("Property Country:", property.country, "Matches:", isCountryMatch); // Debug
        return (searchTitle ? isTitleMatch : true) && (selectedCountry ? isCountryMatch : true);
      });
  
      setFilteredHomeBusiness(filteredBusinesses);
      setFilteredHomeProperty(filteredProperties);
    } else {
      // Reset to original data if no search criteria
      setFilteredHomeBusiness(homeBusiness);
      setFilteredHomeProperty(homeProperty);
    }
  };
  
const handleSelectCountry = (country) => {
  console.log('Country Selected:', country); 
  setSelectedCountry(country);
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
    <> <div className="container">
    <Form className="search-form">
    <div className="row formSearchRow d-flex">
  <div className="col-lg-4 col-4 formSearchCOL">
  <DropdownButton
    id="dropdown-basic-button"
    title={selectedCountry || "Select Country"}
    className="country-dropdown"
    onSelect={(country) => {
      console.log('Country Selected:', country); // Check if this logs the correct country
      handleSelectCountry(country);
    }}
  >
    {filterData &&
      filterData.business_filter_fields?.country &&
      [...new Set([...(filterData.business_filter_fields.country || []), ...(filterData.property_filter_fields?.country || [])])].map((country, index) => (
        <Dropdown.Item key={index} eventKey={country}>
          {country}
        </Dropdown.Item>
      ))}
  </DropdownButton>

  </div>
  <div className="col-lg-8 col-8 formSearchCOL">
    <InputGroup>
      <FormControl type="text"  placeholder="Search a Business, Property for you..." className="search-input" value={searchTitle}  onChange={(e) => setSearchTitle(e.target.value)} />
      <InputGroup.Text className="search-icon" onClick={handleSearch}><FaSearch /></InputGroup.Text>
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
      {filteredHomeBusiness.length === 0 && filteredHomeProperty.length === 0 ? (
        <div className="data-not-found">
        <h4>Data Not Found</h4>
        <p>No results match your filters. Please try adjusting the filters.</p>
      </div>
      ) : (
        <>

{filteredHomeBusiness.length > 0 && (
  <div className="row recommendationsClsNameRow_1 recommendationsClsNameExploreRow">
    {filteredHomeBusiness.slice(0, 4).map((list, index) => (
      <div className="col-lg-3 col-md-6 recommendationsClsNameCOL" key={index} >
        <div className="recommendationsClsNameBox" style={{ position: "relative" }}>
           <div
                                        className="wishlist-heart"
                                        style={{  position: "absolute",
                                          // top: "10px",
                                          right: "10px", zIndex: 10, }}
                                        onClick={() => handleWishlistClick(list.id) } >
                                        {wishlist[list.id] ? (
                                          <FaHeart className="wishlist-icon" /> // Filled heart for "Active"
                                        ) : (
                                          <FaRegHeart className="wishlist-icon" /> // Outline heart for "DeActive"
                                        )}
                                      </div>
          <div className="promotedTextWrapper">
            <img className="img-fluid" style={{ cursor: "pointer" }} onClick={() => handlebusinessNavigate("business", list.id)}
              src={(() => {
                try {
                  const fileName = list.file_name;
                  const files =  typeof fileName === "string" && fileName.startsWith("[") ? JSON.parse(fileName) : fileName;

                  if (typeof files === "string") {
                    return files.startsWith("http") ? files : `${BASE_URL}/${files}`;
                  } else if (Array.isArray(files) && files.length > 0) {
                    return files[0].startsWith("http") ? files[0] : `${BASE_URL}/${files[0]}`;
                  } else {
                    return "default-image.jpg";
                  }
                } catch (error) {
                  console.error(  "Error parsing or handling file_name:", error );
                  return "default-image.jpg";
                }
              })()}
              alt={list.title || "business Image"} />
            {list.subscription && list.subscription.length > 0 && list.subscription[0].status === "Valid" && (
                <div className="promotedText"> {list.subscription[0].type} </div>
              )}
          </div>
          
            <span className="d-flex justify-content-end align-items-end">
              <ReactStars  count={5} value={list.rating}  activeColor="#ffd700"  edit={false} /> </span>
          
          <div className="inter_text d-flex justify-content-between">
              <h5>{list.title}</h5>
          
            <span className="interested"  style={{textAlign:"right"}}>{list.view} Interested</span>
          </div>
          <div className="home_price">
            <h6> Asking Price: ₹ <span>{list.asking_price}</span></h6> <span className="home_con">{list.listing_type}</span>
          </div>
          <h6> Reported Sale (yearly): {list.sale}  <br />₹  <span className="green-text"> {list.reported_turnover_from} - {list.reported_turnover_to}  </span> </h6>
          <div className="location-call">
            <h6> <IoLocation /> {list.city} </h6>
            <a  href={`tel:${list.phone_number}`}  className="call-btn" style={{ textDecoration: "none" }} > Call <FaPhoneAlt /> </a>
          </div>
        </div>
      </div>
    ))}
  </div>
) }

{filteredHomeProperty.length > 0 && (
  <div className="row recommendationsClsNameRow_1 recommendationsClsNameExploreRow">
    {filteredHomeProperty.slice(0, 4).map((property, index) => (
      <div className="col-lg-3 col-md-6 recommendationsClsNameCOL" key={index} >
        <div className="recommendationsClsNameBox" style={{ position: "relative" }}>
        <div
                                        className="wishlist-heart"
                                        style={{  position: "absolute",
                                          // top: "10px",
                                          right: "10px", zIndex: 10, }}
                                        onClick={() => handleWishlistClick(property.id) } >
                                        {wishlist[property.id] ? (
                                          <FaHeart className="wishlist-icon" /> // Filled heart for "Active"
                                        ) : (
                                          <FaRegHeart className="wishlist-icon" /> // Outline heart for "DeActive"
                                        )}
                                      </div>
          <div className="promotedTextWrapper">
            <img className="img-fluid" style={{ cursor: "pointer" }} onClick={() => handlepropertyNavigate("property", property.id) }
              src={(() => {
                try {
                  const fileName = property.file_name;
                  const files = typeof fileName === "string" &&  fileName.startsWith("[") ? JSON.parse(fileName) : fileName;

                  if (typeof files === "string") {
                    return files.startsWith("http") ? files  : `${BASE_URL}/${files}`;
                  } else if (Array.isArray(files) && files.length > 0) {
                    return files[0].startsWith("http") ? files[0]  : `${BASE_URL}/${files[0]}`;
                  } else {
                    return "default-image.jpg";
                  }
                } catch (error) {
                  console.error( "Error parsing or handling file_name:", error );
                     return "default-image.jpg";  }  })()} alt={property.title || "property Image"} />
          </div>

            <span className="d-flex justify-content-end align-items-end">
              <ReactStars  count={5}  value={property.rating}  activeColor="#ffd700"  edit={false}  /> </span>

          <div className="inter_text d-flex justify-content-between">
            <h5>{property.property_title}</h5>
            
            <span className="interested"  style={{textAlign:"right"}}>{property.view} Interested</span>
          </div>
          <div className="home_price">
            <h6> Price: ₹ <span>{property.asking_price}</span></h6> <span className="home_con">{property.listing_type}</span>
          </div>
          <div>
            <h6> Property Type : <strong>{property.property_type}</strong> </h6>
          </div>
          {property.subscription &&  property.subscription.length > 0 && property.subscription[0].status === "Valid" && (
              <div className="promotedText">
                {property.subscription[0].type}
              </div>
            )}
          <div className="location-call">
            <h6> <IoLocation /> {property.city} </h6>
            <a href={`tel:${property.phone_number}`} className="call-btn" style={{ textDecoration: "none" }} >  Call <FaPhoneAlt /> </a>
          </div>
        </div>
      </div>
    ))}
  </div>
) }
</>
)}
</div>
<div className="exploreMoreListingBtnDiv">
<NavLink to="buy" className="exploreMoreListingBtn">
  Explore More Listing
</NavLink>
</div>
</section>
<div className="home_img">
<img src={home_bxell} />
</div>
    </>
  );
}

export default RecomendedList;
