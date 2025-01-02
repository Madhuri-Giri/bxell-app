import React, { useState, useEffect } from "react";
import "./ProfileListingDetails.css";
import { fetchListingDetail } from "../../API/apiServices"; // Import the API function
import { IoLocation } from "react-icons/io5";
import {
  fetchUpdateBusinessStock,
  fetchUpdatePropertyStock,
} from "../../API/apiServices";
import { useSelector } from "react-redux";
import {
  fetchPropertyFavoriteRes,
  fetchBusinessFavoriteRes,
  fetchEnquiryDetailRes,
  fetchBusinessFav,
  fetchPropertyFav,
} from "../../API/apiServices"; // Import the API functions
import { FaHeart, FaRegHeart, FaPhoneAlt } from "react-icons/fa";

function ProfileListingDetails() {
  const [listingDetails, setListingDetails] = useState(null); // State to store API response
  const [soldStatus, setSoldStatus] = useState({}); // State to track ON/OFF checkbox status

  const [propertyData, setPropertyData] = useState([]);
  const [businessData, setBusinessData] = useState([]);
  const [wishlist, setWishlist] = useState({});
  const [activeTab, setActiveTab] = useState("listings");

  const [enquiryDetails, setEnquiryDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setError("User is not logged in.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const details = await fetchEnquiryDetailRes(user); // Assuming user.id exists
        setEnquiryDetails(details);
      } catch (err) {
        setError("Failed to fetch enquiry details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        console.error("User ID is not available. Please log in.");
        return;
      }

      try {
        const propertyRes = await fetchPropertyFavoriteRes(user);
        const businessRes = await fetchBusinessFavoriteRes(user);

        console.log("Property Data:", propertyRes);
        console.log("Business Data:", businessRes);

        setPropertyData(propertyRes);
        setBusinessData(businessRes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async (userId) => {
      try {
        const data = await fetchListingDetail(userId);
        console.log("Full API Response:", data);

        if (data && data.length > 0) {
          const details = data[0];

          if (details.business_sale || details.property_sale) {
            setListingDetails(details);

            // Initialize soldStatus state based on stock value from API response
            const initialSoldStatus = {};

            // Combine both business_sale and property_sale items
            const combinedItems = [
              ...(details.business_sale || []),
              ...(details.property_sale || []),
            ];

            combinedItems.forEach((item) => {
              initialSoldStatus[item.id] = {
                on: item.stock === "Sold", // Check the box if the stock is "Sold"
                off: item.stock !== "Sold", // Uncheck the box if the stock is not "Sold"
              };
            });

            setSoldStatus(initialSoldStatus);
          } else {
            console.log(
              "Error: business_sale or property_sale not found in response"
            );
          }
        } else {
          console.log("Error: API returned empty data");
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData(user);
  }, []);

  const handleCheckboxChange = async (id, type, itemType) => {
    try {
      if (type === "on") {
        if (itemType === "business") {
          await fetchUpdateBusinessStock(id, "Sold");
        } else if (itemType === "property") {
          await fetchUpdatePropertyStock(id, "Sold");
        }
      } else if (type === "off") {
        if (itemType === "business") {
          await fetchUpdateBusinessStock(id, "UnSold");
        } else if (itemType === "property") {
          await fetchUpdatePropertyStock(id, "UnSold");
        }
      }

      // Update local state
      setSoldStatus((prevStatus) => {
        const updatedStatus = {
          ...prevStatus,
          [id]: {
            on: type === "on",
            off: type === "off",
          },
        };

        // Save the updated state to localStorage
        localStorage.setItem(`soldStatus-${id}`, type === "on" ? "on" : "off");

        return updatedStatus;
      });
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  if (!listingDetails) {
    return <p>Loading listings...</p>;
  }

  const businessSale = listingDetails.business_sale || [];
  const propertySale = listingDetails.property_sale || [];

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

  const handleWishlistClick = (index, id) => {
    // Toggle the favorite state
    const newWishlist = { ...wishlist, [index]: !wishlist[index] };

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
      <section className="homeListingDetailSECBoost">
        <div className="container">
          <div className="tab-header explorePropertyHeding ">
            <div className="row">
              <div
                className={`col-2 tab-button ${
                  activeTab === "listings" ? "active" : ""
                }`}
                onClick={() => setActiveTab("listings")}
              >
                LISTINGS FOR YOU
              </div>
              <div
                className={`col-2 tab-button ${
                  activeTab === "explore" ? "active" : ""
                }`}
                onClick={() => setActiveTab("explore")}
              >
                FAVOURITE
              </div>
              <div
                className={`col-2 tab-button ${
                  activeTab === "enquiry" ? "active" : ""
                }`}
                onClick={() => setActiveTab("enquiry")}
              >
                Enquiry
              </div>
            </div>
          </div>

          {activeTab === "listings" && (
            <>
              <div className="explorePropertyHed homeListingDetailBoost">
                <h6>LISTINGS FOR YOU</h6>
              </div>

              <div className="row listingDetailRow_1Boost listingDetailExploreRowBoost">
                {businessSale.length > 0 ? (
                  businessSale.map((business, index) => (
                    <div className="col-lg-3 listingDetailCOLBoost" key={index}>
                      <div className="listingDetailBoxBoost">
                        <div className="promotedTextWrapperBoost">
                          {business.file_name ? (
                            <img
                              className="img-fluid"
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                handlebusinessNavigate("business", business.id)
                              }
                              src={(() => {
                                try {
                                  const fileName = business.file_name;
                                  const files =
                                    typeof fileName === "string" &&
                                    fileName.startsWith("[")
                                      ? JSON.parse(fileName)
                                      : fileName;

                                  if (typeof files === "string") {
                                    return files.startsWith("http")
                                      ? files
                                      : `${BASE_URL}/${files}`;
                                  } else if (
                                    Array.isArray(files) &&
                                    files.length > 0
                                  ) {
                                    return files[0].startsWith("http")
                                      ? files[0]
                                      : `${BASE_URL}/${files[0]}`;
                                  } else {
                                    return "default-image.jpg";
                                  }
                                } catch (error) {
                                  console.error(
                                    "Error parsing file_name:",
                                    error
                                  );
                                  return "default-image.jpg";
                                }
                              })()}
                              alt={business.title || "business Image"}
                            />
                          ) : (
                            <p>No images available</p>
                          )}
                        </div>
                        <h5>{business.title}</h5>
                        <div className="home_priceBoost">
                          <h6>
                            Asking Price: <span>₹{business.asking_price}</span>
                          </h6>
                          <span className="home_conBoost">
                            {business.listing_type}
                          </span>
                        </div>
                        <h6>Reported Sale (yearly): {business.sale}</h6>
                        <div className="home_callBoost">
                          <h6>
                            <IoLocation /> {business.city}
                          </h6>
                          <h6>Call</h6>
                        </div>
                        <div className="status-controls">
                          <label className="custom-checkbox">
                            <input
                              type="checkbox"
                              checked={soldStatus[business.id]?.on || false}
                              onChange={() =>
                                handleCheckboxChange(
                                  business.id,
                                  "on",
                                  "business"
                                )
                              }
                              disabled={soldStatus[business.id]?.on}
                            />
                            ON
                          </label>
                          <br />
                          <label className="custom-checkbox">
                            <input
                              type="checkbox"
                              checked={soldStatus[business.id]?.off || false}
                              onChange={() =>
                                handleCheckboxChange(
                                  business.id,
                                  "off",
                                  "business"
                                )
                              }
                              disabled={soldStatus[business.id]?.on}
                            />
                            OFF
                          </label>
                        </div>
                        <div className="btn_boost">
                          {soldStatus[business.id]?.on && (
                            <button className="btn_boost">Sold</button>
                          )}
                          {soldStatus[business.id]?.off && (
                            <button className="btn_boost">Unsold</button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No business listings available.</p>
                )}
              </div>

              {/* Property Listings */}
              <div className="row listingDetailRow_1Boost listingDetailExploreRowBoost">
                {propertySale.length > 0 ? (
                  propertySale.map((property, index) => (
                    <div className="col-lg-3 listingDetailCOLBoost" key={index}>
                      <div className="listingDetailBoxBoost">
                        <div className="promotedTextWrapperBoost">
                          {property.file_name ? (
                            <img
                              className="img-fluid"
                              src={(() => {
                                try {
                                  // Try parsing file_name as JSON
                                  const files = JSON.parse(property.file_name);
                                  return Array.isArray(files) &&
                                    files.length > 0
                                    ? files[0]
                                    : "default-image.jpg";
                                } catch (error) {
                                  // If parsing fails, assume it's a URL or malformed string
                                  console.error(
                                    "Error parsing file_name:",
                                    error
                                  );
                                  return (
                                    property.file_name || "default-image.jpg"
                                  ); // Fallback to file_name if it's a URL
                                }
                              })()}
                              alt={property.property_title || "business Image"}
                            />
                          ) : (
                            <p>No images available</p>
                          )}
                        </div>
                        <h5>{property.property_title}</h5>
                        <div className="home_priceBoost">
                          <h6>
                            Price: <span>₹{property.asking_price}</span>
                          </h6>
                          <span className="home_conBoost">
                            {property.listing_type}
                          </span>
                        </div>
                        <h6>Reported Sale (yearly): {property.sale}</h6>
                        <div className="home_callBoost">
                          <h6>
                            <IoLocation /> {property.city}
                          </h6>
                          <h6>Call</h6>
                        </div>
                        <div className="status-controls">
                          <label className="custom-checkbox">
                            <input
                              type="checkbox"
                              checked={soldStatus[property.id]?.on || false}
                              onChange={() =>
                                handleCheckboxChange(
                                  property.id,
                                  "on",
                                  "property"
                                )
                              }
                              disabled={soldStatus[property.id]?.on} // Disable "ON" after it's checked
                            />
                            ON
                          </label>
                          <br />
                          <label className="custom-checkbox">
                            <input
                              type="checkbox"
                              checked={soldStatus[property.id]?.off || false}
                              onChange={() =>
                                handleCheckboxChange(
                                  property.id,
                                  "off",
                                  "property"
                                )
                              }
                              disabled={soldStatus[property.id]?.on} // Disable "OFF" once "ON" is checked
                            />
                            OFF
                          </label>
                          <br />
                        </div>
                        <div className="btn_boost">
                          {soldStatus[property.id]?.on && (
                            <button className="btn_boost">Sold</button>
                          )}
                          {soldStatus[property.id]?.off && (
                            <button className="btn_boost">Unsold</button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No property listings available.</p>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      <section>
      <div className="container">
          {activeTab === "explore" && (
            <>
            <div className="explorePropertyHed homeListingDetailBoost">
              <h6>FAVOURITE</h6>
            </div>
            <div>
              {propertyData.length > 0 && (
                <div className="row propertyBuyListingRow_1">
                  
                  {propertyData.map((property, index) => (
                    <div
                      className="col-lg-3 recommendationsClsNameCOL"
                      key={index}
                    >
                      <div className="recommendationsClsNameBox">
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
                            
                          >
                            <FaHeart className="wishlist-icon" />
                            {/* {wishlist[index] ? (
                              <FaHeart className="wishlist-icon" />
                            ) : (
                              <FaRegHeart className="wishlist-icon" />
                            )} */}
                          </div>
                          <img
                            className="img-fluid"
                            src={
                              property.property_sale?.file_name
                                ? JSON.parse(property.property_sale.file_name)[0]
                                : "default-image.jpg"
                            }
                            alt={property.property_sale?.property_title}
                          />
                          <div className="title-location">
                            <h5>{property.property_sale?.property_title}</h5>
                          
                          </div>
                         
                          <div className="home_price">
                            <h6>
                              Asking Price: ₹{" "}
                              <span>{property.property_sale.asking_price}</span>
                            </h6>
                          </div>
                          <div className="location-call">
                            <h6>
                              <IoLocation /> {property.property_sale.city}
                            </h6>

                            <a
                              href={`tel:${property.property_sale.phone_number}`}
                              className="call-btn"
                              style={{ textDecoration: "none" }}
                            >
                              Call <FaPhoneAlt />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {businessData.length > 0 ? (
                <div className="row propertyBuyListingRow_1">
                  {businessData.map((business, index) => (
                    <div
                      className="col-lg-3 recommendationsClsNameCOL"
                      key={index}
                    >
                      <div className="recommendationsClsNameBox">
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
                            
                          >
                             <FaHeart className="wishlist-icon" />
                            {/* {wishlist[index] ? (
                              <FaHeart className="wishlist-icon" />
                            ) : (
                              <FaRegHeart className="wishlist-icon" />
                            )} */}
                          </div>
                          <img
                            className="img-fluid"
                            src={
                              business.business_sale?.file_name ||
                              "default-image.jpg"
                            } // Corrected
                            alt={business.business_sale?.title}
                          />
                          <div className="title-location">
                            <h5>{business.business_sale?.title}</h5>{" "}
                            
                            <span className="interested">Interested</span>
                          </div>
                          <div className="home_price">
                            <h6>
                              Asking Price: ₹{" "}
                              <span>{business.business_sale.asking_price}</span>
                            </h6>
                          </div>
                          <div className="location-call">
                            <h6>
                              <IoLocation /> {business.business_sale.city}
                            </h6>

                            <a
                              href={`tel:${business.business_sale.phone_number}`}
                              className="call-btn"
                              style={{ textDecoration: "none" }}
                            >
                              Call <FaPhoneAlt />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>No favorite businesses available</div>
              )}
            </div>

            </>
          )}
        </div>
      </section>

      <section className="">
        <div className="container">

        
          {activeTab === "enquiry" && (
            <>
               <div className="explorePropertyHed homeListingDetailBoost">
                  <h6>Enquiry Details</h6>
                </div>
              <div className="enquiry-container enquiry-section">
                <table className="enquiry-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Listing Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiryDetails.map((detail) => (
                      <tr key={detail.id}>
                        <td>{detail.name}</td>
                        <td>{detail.email}</td>
                        <td>{detail.listing_name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default ProfileListingDetails;
