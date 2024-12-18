import React, { useState, useEffect } from "react";
import "./ProfileListingDetails.css";
import { fetchListingDetail } from "../../API/apiServices"; // Import the API function
import { IoLocation } from "react-icons/io5";
import {
  fetchUpdateBusinessStock,
  fetchUpdatePropertyStock,
} from "../../API/apiServices"; // Assuming API call functions are imported

function ProfileListingDetails() {
  const [listingDetails, setListingDetails] = useState(null); // State to store API response
  const [soldStatus, setSoldStatus] = useState({}); // State to track ON/OFF checkbox status

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchListingDetail();
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

    fetchData();
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

  return (
    <section className="homeListingDetailSECBoost">
      <div className="container">
        <div className="explorePropertyHed homeListingDetailBoost">
          <h6>LISTINGS FOR YOU</h6>
        </div>

        {/* Business Listings */}
        <div className="row listingDetailRow_1Boost listingDetailExploreRowBoost">
          {businessSale.length > 0 ? (
            businessSale.map((business, index) => (
              <div className="col-lg-3 listingDetailCOLBoost" key={index}>
                <div className="listingDetailBoxBoost">
                  <div className="promotedTextWrapperBoost">
                    {business.file_name ? (
                      <img
                        className="img-fluid"
                        src={(() => {
                          try {
                            // Try parsing file_name as JSON
                            const files = JSON.parse(business.file_name);
                            return Array.isArray(files) && files.length > 0
                              ? files[0]
                              : "default-image.jpg";
                          } catch (error) {
                            // If parsing fails, assume it's a URL or malformed string
                            console.error("Error parsing file_name:", error);
                            return business.file_name || "default-image.jpg"; // Fallback to file_name if it's a URL
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
                          handleCheckboxChange(business.id, "on", "business")
                        }
                        disabled={soldStatus[business.id]?.on} // Disable if already sold
                      />
                      ON
                    </label>
                    <br />
                    <label className="custom-checkbox">
                      <input
                        type="checkbox"
                        checked={soldStatus[business.id]?.off || false}
                        onChange={() =>
                          handleCheckboxChange(business.id, "off", "business")
                        }
                        disabled={soldStatus[business.id]?.on} // Disable "OFF" once "ON" is checked
                      />
                      OFF
                    </label>
                    <br />
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
                            return Array.isArray(files) && files.length > 0
                              ? files[0]
                              : "default-image.jpg";
                          } catch (error) {
                            // If parsing fails, assume it's a URL or malformed string
                            console.error("Error parsing file_name:", error);
                            return property.file_name || "default-image.jpg"; // Fallback to file_name if it's a URL
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
                          handleCheckboxChange(property.id, "on", "property")
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
                          handleCheckboxChange(property.id, "off", "property")
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
      </div>
    </section>
  );
}

export default ProfileListingDetails;
