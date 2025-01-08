import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ProfileListingDetails.css";
import { IoLocation } from "react-icons/io5";
import { useSelector } from "react-redux";
import { fetchListingDetail, fetchUpdateBusinessStock, fetchUpdatePropertyStock, fetchPropertyFavoriteRes, fetchBusinessFavoriteRes, fetchEnquiryDetailRes, fetchBusinessFav, fetchPropertyFav } from "../../API/apiServices"; 
import { FaHeart, FaRegHeart, FaPhoneAlt } from "react-icons/fa";
import { toast } from 'react-toastify';

function ProfileListingDetails() {
   const navigate = useNavigate();
  // const [listingDetails, setListingDetails] = useState(null); 
  const [listingDetails, setListingDetails] = useState({ business_sale: [], property_sale: [] }); 
  const businessSale = listingDetails.business_sale || [];
  const propertySale = listingDetails.property_sale || [];
  const [soldStatus, setSoldStatus] = useState({}); // State to track ON/OFF checkbox status
  const [propertyData, setPropertyData] = useState([]);
  const [businessData, setBusinessData] = useState([]);
  const [wishlist, setWishlist] = useState({});
  const [activeTab, setActiveTab] = useState("listings");
  const [enquiryDetails, setEnquiryDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState(null); // State to store selected amount
  const [amountError, setAmountError] = useState(""); // Error state for invalid selection
  const [boostName, setBoostName] = useState(""); // State to store selected boost name (week/month)

  const handleAmountChange = (e) => {
    const selectedAmount = parseInt(e.target.value);
    setAmount(selectedAmount);

    // Set the corresponding boost name
    if (selectedAmount === 49) {
      setBoostName("week");
    } else if (selectedAmount === 149) {
      setBoostName("month");
    }

    setAmountError(""); // Reset any previous errors
  };

  const fetchPaymentBusinessDetails = async (businessId, selectedAmount, boostName) => {
    try {
      if (!user || !businessId) {
        throw new Error("Login ID or Property ID is missing.");
      }

      const payload = {
        amount: selectedAmount, // Dynamic amount based on radio selection
        user_id: user,
        business_id: businessId,
        boost_name: boostName, // Dynamic boost name (week or month)
      };

      console.log("Sending payload for business payment:", payload);

      const response = await axios.post(
        "https://bxell.com/bxell/admin/api/create-business-boost-payment",
        payload
      );

      if (response.data.result === true && response.data.status === 200) {
        console.log("Payment API Response:", response.data);
        return response.data; // Returning the complete response
      } else {
        throw new Error(response.data.message || "Failed to fetch payment details.");
      }
    } catch (error) {
      console.error("Error fetching payment details:", error.message);
      alert("Failed to initiate payment. Please try again.");
      return null;
    }
  };

  const handlePaymentForBusiness = async (businessId) => {
    if (!amount) {
      setAmountError("Please select a payment option.");
      return;
    }

    const paymentData = await fetchPaymentBusinessDetails(businessId, amount, boostName);

    console.log("Fetched Payment Data:", paymentData);

    if (!user) {
      // If the user is not logged in, redirect to the login page
      navigate("/login");
      return;
    }

    if (paymentData) {
      const { payment_details, user_details, razorpay_key } = paymentData;
      const { razorpay_order_id, amount } = payment_details;

      if (!razorpay_order_id || !razorpay_key || !amount) {
        alert("Incomplete payment details. Please try again.");
        return;
      }

      const options = {
        key: razorpay_key,
        amount: amount * 100, // Convert to paise
        currency: "INR",
        order_id: razorpay_order_id,
        name: "SRN Infotech",
        description: "Business Listing Payment",
        image: "https://your-logo-url.com/logo.png",
        handler: async function (response) {
          console.log("Payment successful response:", response);
          try {
            await updateBusinessHandlePayment(response.razorpay_payment_id, payment_details.id);
          } catch (error) {
            console.error("Error during payment processing:", error.message);
            alert("Error updating payment status. Please contact support.");
          }
        },
        prefill: {
          name: user_details?.name || "User Name",
          email: user_details?.email || "user@example.com",
          contact: user_details?.phone_number || "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);

      rzp1.on("payment.failed", function (response) {
        alert(`Payment failed: ${response.error.description}`);
      });

      rzp1.open();
    }
  };

  const updateBusinessHandlePayment = async (razorpay_payment_id, id) => {
    try {
      const url = "https://bxell.com/bxell/admin/api/update-business-boost-payment";
      const payload = { payment_id: razorpay_payment_id, id };

      console.log("Updating business payment status with payload:", payload);

      const response = await axios.post(url, payload);

      console.log("API Response for payment status update:", response.data);

      if (response.data?.result === true && response.data?.status === 200) {
        toast.success("Payment successful and verified!");
        setTimeout(() => {
          navigate("/"); // Redirect after 3 seconds
        }, 3000);
      } else {
        toast.error("Payment verification failed. Please contact support.");
        console.error("Payment verification failed response:", response.data);
      }
    } catch (error) {
      console.error("Error updating payment status:", error.message);
      toast.error("Failed to update payment status. Please try again.");
    }
  };
// --------------------------------property payment-----------------------------
const fetchPaymentPropertDetails = async (propertyId, selectedAmount, boostName) => {
  try {
    if (!user || !propertyId) {
      throw new Error("Login ID or Property ID is missing.");
    }

    const payload = {
      amount: selectedAmount, // Dynamic amount based on radio selection
      user_id: user,
      property_id: propertyId,
      boost_name: boostName, // Dynamic boost name (week or month)
    };

    console.log("Sending payload for business payment:", payload);

    const response = await axios.post(
      "https://bxell.com/bxell/admin/api/create-property-boost-payment",
      payload
    );

    if (response.data.result === true && response.data.status === 200) {
      console.log("Payment API Response:", response.data);
      return response.data; // Returning the complete response
    } else {
      throw new Error(response.data.message || "Failed to fetch payment details.");
    }
  } catch (error) {
    console.error("Error fetching payment details:", error.message);
    alert("Failed to initiate payment. Please try again.");
    return null;
  }
};

const handlePaymentForProperty = async (propertyId) => {
  if (!amount) {
    setAmountError("Please select a payment option.");
    return;
  }

  const paymentData = await fetchPaymentPropertDetails(propertyId, amount, boostName);

  console.log("Fetched Payment Data:", paymentData);

  if (!user) {
    // If the user is not logged in, redirect to the login page
    navigate("/login");
    return;
  }

  if (paymentData) {
    const { payment_details, user_details, razorpay_key } = paymentData;
    const { razorpay_order_id, amount } = payment_details;

    if (!razorpay_order_id || !razorpay_key || !amount) {
      alert("Incomplete payment details. Please try again.");
      return;
    }

    const options = {
      key: razorpay_key,
      amount: amount * 100, // Convert to paise
      currency: "INR",
      order_id: razorpay_order_id,
      name: "SRN Infotech",
      description: "Business Listing Payment",
      image: "https://your-logo-url.com/logo.png",
      handler: async function (response) {
        console.log("Payment successful response:", response);
        try {
          await updatePropertyHandlePayment(response.razorpay_payment_id, payment_details.id);
        } catch (error) {
          console.error("Error during payment processing:", error.message);
          alert("Error updating payment status. Please contact support.");
        }
      },
      prefill: {
        name: user_details?.name || "User Name",
        email: user_details?.email || "user@example.com",
        contact: user_details?.phone_number || "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp1 = new window.Razorpay(options);

    rzp1.on("payment.failed", function (response) {
      alert(`Payment failed: ${response.error.description}`);
    });

    rzp1.open();
  }
};

const updatePropertyHandlePayment = async (razorpay_payment_id, id) => {
  try {
    const url = "https://bxell.com/bxell/admin/api/update-property-boost-payment";
    const payload = { payment_id: razorpay_payment_id, id };

    console.log("Updating business payment status with payload:", payload);

    const response = await axios.post(url, payload);

    console.log("API Response for payment status update:", response.data);

    if (response.data?.result === true && response.data?.status === 200) {
      toast.success("Payment successful and verified!");
      setTimeout(() => {
        navigate("/"); // Redirect after 3 seconds
      }, 3000);
    } else {
      toast.error("Payment verification failed. Please contact support.");
      console.error("Payment verification failed response:", response.data);
    }
  } catch (error) {
    console.error("Error updating payment status:", error.message);
    toast.error("Failed to update payment status. Please try again.");
  }
};

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  
  // Get current listings based on pagination
  const paginate = (items) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };
  
  // Handle pagination button clicks
  const handlePagelisChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  const totalPages = Math.ceil(businessSale.length / itemsPerPage);
  // ------------------------fav pagination--------------------------

  const ITEMS_PER_PAGE = 4;
  const [currentPropertyPage, setCurrentPropertyPage] = useState(1); // Property pagination
  const [currentBusinessPage, setCurrentBusinessPage] = useState(1);
  
  const paginatedPropertyData = propertyData.slice(
    (currentPropertyPage - 1) * ITEMS_PER_PAGE,
    currentPropertyPage * ITEMS_PER_PAGE
  );
  
  const paginatedBusinessData = businessData.slice(
    (currentBusinessPage - 1) * ITEMS_PER_PAGE,
    currentBusinessPage * ITEMS_PER_PAGE
  );
  
  const totalPropertyPages = Math.ceil(propertyData.length / ITEMS_PER_PAGE);
  const totalBusinessPages = Math.ceil(businessData.length / ITEMS_PER_PAGE);
  
  // Handle Page Change
  const handlePageChange = (page) => {
    setCurrentPropertyPage(page);
    setCurrentBusinessPage(page);
  };
  
  // Handle Previous Page
  const handlePreviousPage = (type) => {
    if (type === "property" && currentPropertyPage > 1) {
      setCurrentPropertyPage((prevPage) => prevPage - 1);
    } else if (type === "business" && currentBusinessPage > 1) {
      setCurrentBusinessPage((prevPage) => prevPage - 1);
    }
  };
  
  // Handle Next Page
  const handleNextPage = (type, totalPages) => {
    if (type === "property" && currentPropertyPage < totalPages) {
      setCurrentPropertyPage((prevPage) => prevPage + 1);
    } else if (type === "business" && currentBusinessPage < totalPages) {
      setCurrentBusinessPage((prevPage) => prevPage + 1);
    }
  };

    const handlepropertyNavigate = (type, id) => {
   
      navigate("/single-page", { state: { type, id } });
    };
  
    const handlebusinessNavigate = (type, id) => {
     
      navigate("/single-page", { state: { type, id } });
    };
  
  // ---------------Enquiry form api-------------------------
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setError("User is not logged in.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const details = await fetchEnquiryDetailRes(user); 
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

// --------------------Favourite API ------------------------------------
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

  // -------------------------Listing Detail---------------------
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
  
  const handleBoostClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  return (
    <>
      <section className="homeListingDetailSECBoost">
        <div className="container">
          <div className="tab-header explorePropertyHeding ">
            <div className="row">
              <div className={`col-lg-3 col-md-4 col-sm-4 tab-button listing ${ activeTab === "listings" ? "active" : ""   }`}
                onClick={() => setActiveTab("listings")}  > LISTINGS FOR YOU
              </div>
              <div className={`col-lg-3 col-md-4 col-sm-4 tab-button listing ${ activeTab === "explore" ? "active" : ""
                }`}  onClick={() => setActiveTab("explore")}  >  FAVOURITE
              </div>
              <div  className={`col-lg-3 col-md-4 col-sm-4 tab-button listing ${ activeTab === "enquiry" ? "active" : "" }`}
                onClick={() => setActiveTab("enquiry")}  > ENQUIRY
              </div>
            </div>
          </div>

          {activeTab === "listings" && (
            <>
              <div className="explorePropertyHed homeListingDetailBoost">
                <h6> BUSINESS LISTINGS BY YOU</h6>
              </div>

              <div className="row listingDetailRow_1Boost listingDetailExploreRowBoost">
                {businessSale.length > 0 ? (
                 paginate(businessSale).map((business, index) => (
                    <div className="col-lg-3 col-md-6 col-sm-6 listingDetailCOLBoost" key={index}>
                      <div className="listingDetailBoxBoost">
                        <div className="promotedTextWrapperBoost">
                          {business.file_name ? (
                            <img className="img-fluid" style={{ cursor: "pointer" }} onClick={() =>  handlebusinessNavigate("business", business.id) }
                              src={(() => {
                                try {
                                  const fileName = business.file_name;
                                  const files = typeof fileName === "string" &&  fileName.startsWith("[")   ? JSON.parse(fileName) : fileName;
                                  if (typeof files === "string") {
                                    return files.startsWith("http")  ? files  : `${BASE_URL}/${files}`;
                                  } else if ( Array.isArray(files) &&  files.length > 0
                                  ) {
                                    return files[0].startsWith("http")   ? files[0]  : `${BASE_URL}/${files[0]}`;
                                  } else {
                                    return "default-image.jpg";  }  } catch (error) {  console.error( "Error parsing file_name:",   error );  return "default-image.jpg";  }   })()}  alt={business.title || "business Image"}  />
                          ) : (
                            <p>No images available</p>
                          )}
                        </div>
                        <h5>{business.title}</h5>
                        <div className="home_priceBoost">
                          <h6>  Asking Price: <span>₹{business.asking_price}</span>  </h6>
                          <span className="home_conBoost">  {business.listing_type}  </span>
                        </div>
                        <div className="home_priceBoost">
                          <h6>Reported Sale (yearly): <br></br> <span> {business.reported_turnover_from} - {business.reported_turnover_to}  </span> </h6>
                        </div>
                        <div className="home_callBoost">
                          <h6>  <IoLocation /> {business.city} </h6>
                          <h6>Call</h6>
                        </div>
                        <div className="status-controls">
                          <label className="custom-checkbox">
                            <input  type="checkbox"  checked={soldStatus[business.id]?.on || false}  onChange={() =>  handleCheckboxChange(  business.id,  "on",  "business"   ) }  disabled={soldStatus[business.id]?.on} /> ON </label> <br />
                          <label className="custom-checkbox">
                            <input  type="checkbox"  checked={soldStatus[business.id]?.off || false} onChange={() => handleCheckboxChange(   business.id,  "off", "business"  )  } disabled={soldStatus[business.id]?.on}  />   OFF </label>
                        </div>
                        <div className="btn_boost_container">
                        <div className="sold_status">
                          {soldStatus[business.id]?.on && ( <button className="btn_boost">Sold</button> )}
                          {soldStatus[business.id]?.off && ( <button className="btn_boost">Unsold</button>  )}
                        </div>
                        {/* <button className="pay_now_btn"  onClick={() => handlePaymentForBusiness(business.id)}>Pay Now</button> */}
                         {/* Payment Button */}
                         <button className="pay_now_btn" onClick={handleBoostClick}> Boost </button>
                      </div>
                        <div>
                          {/* Price Radio Buttons */}
                          {isModalOpen && (
                          <div className="modal_overlay">
                            <div className="modal_content">
                              <button className="close_modal_btn" onClick={handleCloseModal}> &times; </button>

                              <div className="price_radio_section">
                                {amountError && ( <p style={{ color: "red", margin: "0px", padding: "0px" }}> {amountError} </p> )}

                                <div className="price_radio_box">
                                  <div className="radio_item_box">
                                    <label className="price_option_box">
                                    <input type="radio" name="listingType" value="149" className="radio_input_box" onChange={handleAmountChange} checked={amount === 149} />
                                      <div className="price_details_box">
                                        <span className="price_box">₹149</span>
                                        <div className="content_box">
                                          <h3>Basic Boost Listing (for 1 month)</h3>
                                        </div>
                                      </div>
                                    </label>
                                  </div>

                                  <div className="radio_item_box">
                                    <label className="price_option_box">
                                      <input type="radio" name="listingType" value="49" className="radio_input_box" onChange={handleAmountChange} checked={amount === 49} />
                                      <div className="price_details_box">
                                        <span className="price_box">₹49</span>
                                        <div className="content_box">
                                          <h3>Basic Boost Listing (for 1 week)</h3>
                                        </div>
                                      </div>
                                    </label>
                                  </div>
                                </div>
                                <button className="pay_now_btn" onClick={() => handlePaymentForBusiness(business.id)} > Pay Now </button>
                              </div>
                            </div>
                          </div>
                        )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No business listings available.</p>
                )}
              </div>
              <div className="pagination-controls">
                <button onClick={() => handlePagelisChange(currentPage - 1)} className="page-button" disabled={currentPage === 1} > Previous </button>

                {/* Generate page numbers dynamically */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button  key={page} onClick={() => handlePagelisChange(page)} className={`page-button ${page === currentPage ? "active" : ""}`} > {page} </button>
                ))}

                <button onClick={() => handlePagelisChange(currentPage + 1)} className="page-button" disabled={currentPage === totalPages} > Next </button>
              </div>
                          {/* {/ Property Listings /} */} 
                 <div className="explorePropertyHed homeListingDetailBoost">
                <h6> PROPERTY LISTINGS BY YOU</h6>
              </div>
              <div className="row listingDetailRow_1Boost listingDetailExploreRowBoost">
                {propertySale.length > 0 ? (
                 paginate(propertySale).map((property, index) => (
                    <div className="col-lg-3 col-md-6 col-sm-6 listingDetailCOLBoost" key={index}>
                      <div className="listingDetailBoxBoost">
                        <div className="promotedTextWrapperBoost">
                          {property.file_name ? (
                            <img  className="img-fluid" style={{ cursor: "pointer" }} onClick={() =>  handlepropertyNavigate("property", property.id) }
                             src={(() => {
                                try {
                                  // Try parsing file_name as JSON
                                  const files = JSON.parse(property.file_name);
                                  return Array.isArray(files) &&
                                    files.length > 0  ? files[0]  : "default-image.jpg";
                                } catch (error) {
                                  console.error( "Error parsing file_name:",  error );
                                  return (   property.file_name || "default-image.jpg"
                                  );    }  })()}  alt={property.property_title || "business Image"}  />
                          ) : (
                            <p>No images available</p>
                          )}
                        </div>
                        <h5>{property.property_title}</h5>
                        <div className="home_priceBoost">
                          <h6>  Price: <span>₹{property.asking_price}</span> </h6>
                          <span className="home_conBoost"> {property.listing_type}  </span>
                        </div>
                        <div>   <h6>Property Type : <strong>{property.property_type}</strong></h6>  </div>
                        <div className="home_callBoost">
                          <h6><IoLocation /> {property.city}  </h6>
                          <h6>Call</h6>
                        </div>
                        <div className="status-controls">
                          <label className="custom-checkbox">
                            <input type="checkbox"  checked={soldStatus[property.id]?.on || false}  onChange={() =>  handleCheckboxChange( property.id,  "on",  "property" )  }  disabled={soldStatus[property.id]?.on}   />   ON </label>  <br />
                          <label className="custom-checkbox">
                            <input type="checkbox"   checked={soldStatus[property.id]?.off || false} onChange={() =>  handleCheckboxChange(  property.id,  "off",  "property"   )   } disabled={soldStatus[property.id]?.on}  />  OFF </label> <br />
                        </div>
                        <div className="btn_boost_container">
                      <div className="sold_status">
                        {soldStatus[property.id]?.on && <button className="btn_boost">Sold</button>}
                        {soldStatus[property.id]?.off && <button className="btn_boost">Unsold</button>}
                      </div>
                      <div>
                          {/* Boost Button */}
                          <button className="pay_now_btn" onClick={handleBoostClick}> Boost </button>
                          </div>
                          {/* Modal */}
                          {isModalOpen && (
                            <div className="modal_overlay">
                              <div className="modal_content">
                                <button className="close_modal_btn" onClick={handleCloseModal}> &times; </button>

                                <div className="price_radio_section">
                                  {amountError && ( <p style={{ color: "red", margin: "0px", padding: "0px" }}> {amountError} </p> )}

                                  <div className="price_radio_box">
                                    <div className="radio_item_box">
                                      <label className="price_option_box">
                                        <input type="radio"  name="listingType" value="149"  className="radio_input_box"   onChange={handleAmountChange}  checked={amount === 149}  />
                                        <div className="price_details_box">
                                          <span className="price_box">₹149</span>
                                          <div className="content_box">
                                            <h3>Basic Boost Listing (for 1 month)</h3>
                                          </div>
                                        </div>
                                      </label>
                                    </div>

                                    <div className="radio_item_box">
                                      <label className="price_option_box">
                                        <input type="radio"  name="listingType" value="49" className="radio_input_box" onChange={handleAmountChange} checked={amount === 49} />
                                        <div className="price_details_box">
                                          <span className="price_box">₹49</span>
                                          <div className="content_box">
                                            <h3>Basic Boost Listing (for 1 week)</h3>
                                          </div>
                                        </div>
                                      </label>
                                    </div>
                                  </div>

                                  <button className="pay_now_btn" onClick={() => handlePaymentForProperty(property.id) } > Pay Now  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  ))
                ) : (
                  <p>No property listings available.</p>
                )}
              </div>
              <div className="pagination-controls">
                <button onClick={() => handlePagelisChange(currentPage - 1)} className="page-button" disabled={currentPage === 1} > Previous </button>
                {/* Generate page numbers dynamically */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button key={page}  onClick={() => handlePagelisChange(page)} className={`page-button ${page === currentPage ? "active" : ""}`}  >  {page} </button>
                ))}
                <button onClick={() => handlePagelisChange(currentPage + 1)} className="page-button"  disabled={currentPage === totalPages} > Next </button>
              </div>
            </>
          )}
        </div>
      </section>

      <section>
      <div className="container">
          {activeTab === "explore" && (
            <>
            <div className="explorePropertyHed homeListingDetailBoost"> <h6>PROPERTY FAVOURITE</h6> </div>
            <div>
              {propertyData.length > 0 && (
                <div className="row propertyBuyListingRow_1">
                  
                  {paginatedPropertyData.map((property, index) => (
                    <div  className="col-lg-3 col-md-6 col-sm-6 recommendationsClsNameCOL"  key={index} >
                      <div className="recommendationsClsNameBox">
                        <div className="propertyBuyListingBox" style={{ position: "relative" }}  >
                          <div   className="wishlist-heart"  style={{   position: "absolute",  top: "10px",  right: "10px",  zIndex: 10,  }}   >
                            <FaHeart className="wishlist-icon" />  </div>
                          <img  className="img-fluid"  src={ property.property_sale?.file_name ? JSON.parse(property.property_sale.file_name)[0]  : "default-image.jpg" }  alt={property.property_sale?.property_title}  />
                          <div className="title-location">  <h5>{property.property_sale?.property_title}</h5> 
                          </div>
                         
                          <div className="home_price">
                            <h6>  Asking Price: ₹{" "}  <span>{property.property_sale.asking_price}</span>  </h6>
                          </div>
                          <div>
                              <h6>Property Type : <strong>{property.property_sale.property_type}</strong></h6>
                          </div>
                          <div className="location-call">
                            <h6> <IoLocation /> {property.property_sale.city} </h6>
              <a  href={`tel:${property.property_sale.phone_number}`} className="call-btn" style={{ textDecoration: "none" }} > Call <FaPhoneAlt />  </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
               {/* Property Pagination */}
          <div className="pagination-controls">
            <button  onClick={() => handlePreviousPage("property")} className="page-button" disabled={currentPropertyPage === 1} >
              Previous </button>
            {Array.from({ length: totalPropertyPages }, (_, i) => i + 1).map((page) => (
              <button  key={page}  onClick={() => handlePageChange(page)}  className={`page-button ${page === currentPropertyPage ? "active" : ""}`}  >
                {page}  </button>
            ))}
            <button onClick={() => handleNextPage("property", totalPropertyPages)} className="page-button"  disabled={currentPropertyPage === totalPropertyPages} > Next </button>
          </div>


          <div className="explorePropertyHed homeListingDetailBoost">
              <h6>BUSINESS FAVOURITE</h6>
            </div>
              {businessData.length > 0 ? (
                <div className="row propertyBuyListingRow_1">
                  {paginatedBusinessData.map((business, index) => (
                    <div   className="col-lg-3 col-md-6 col-sm-6 recommendationsClsNameCOL" key={index} >
                      <div className="recommendationsClsNameBox">
                        <div  className="propertyBuyListingBox"  style={{ position: "relative" }} >
                          <div  className="wishlist-heart"  style={{   position: "absolute",  top: "10px",  right: "10px",  zIndex: 10,  }}  >
                             <FaHeart className="wishlist-icon" />
                          </div>
                          <img  className="img-fluid"  src={  business.business_sale?.file_name ||   "default-image.jpg"} alt={business.business_sale?.title} />
                          <div className="title-location">
                            <h5>{business.business_sale?.title}</h5>  <span className="interested">Interested</span>
                          </div>
                          <div className="home_price">
                            <h6>  Asking Price: ₹ <span>{business.business_sale.asking_price}</span> </h6>
                          </div>
                          <div className="home_priceBoost">
                            <h6>Reported Sale (yearly): <br></br>  <span>  {business.business_sale.reported_turnover_from} - {business.business_sale.reported_turnover_to}  </span> </h6>
                          </div>
                          <div className="location-call">
                            <h6> <IoLocation /> {business.business_sale.city} </h6>
                               <a href={`tel:${business.business_sale.phone_number}`} className="call-btn" style={{ textDecoration: "none" }} > Call <FaPhoneAlt /> </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>No favorite businesses available</div>
              )}
               {/* Business Pagination */}
          <div className="pagination-controls">
            <button onClick={() => handlePreviousPage("business")}  className="page-button"  disabled={currentBusinessPage === 1} >
              Previous </button>
            {Array.from({ length: totalBusinessPages }, (_, i) => i + 1).map((page) => (
              <button  key={page} onClick={() => handlePageChange(page)} className={`page-button ${page === currentBusinessPage ? "active" : ""}`} >
                {page} </button>
            ))}
            <button  onClick={() => handleNextPage("business", totalBusinessPages)} className="page-button"  disabled={currentBusinessPage === totalBusinessPages} >
              Next
            </button>
          </div>
            </div>
            </>
          )}
        </div>
      </section>

      <section>
        <div className="container">
          {activeTab === "enquiry" && (
            <>
               <div className="explorePropertyHed homeListingDetailBoost">
                  <h6>Enquiry Details</h6>
                </div>
              <div className="enquiry-container enquiry-section">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-sm-12">
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
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default ProfileListingDetails;
