import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ProfileListingDetails.css";
import { IoLocation } from "react-icons/io5";
import { useSelector } from "react-redux";
import { fetchListingDetail, fetchUpdateBusinessStock, fetchUpdatePropertyStock, fetchPropertyFavoriteRes, fetchBusinessFavoriteRes, fetchEnquiryDetailRes, editBusinessDetail, editPropertyDetail, fetchBusinessFav, fetchPropertyFav } from "../../API/apiServices";
import { FaHeart, FaRegHeart, FaPhoneAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import ReactStars from "react-rating-stars-component";

function ProfileListingDetails() {
  const navigate = useNavigate();
  // const [listingDetails, setListingDetails] = useState(null);
  const [listingDetails, setListingDetails] = useState({
    business_sale: [],
    property_sale: [],
  });
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpenBusiness, setIsModalOpenBusiness] = useState(false);
  const [isModalOpenProperty, setIsModalOpenProperty] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState(null); // To store the businessId
  const [selectedPropertyId, setSelectedPropertyId] = useState(null); // To store the businessId

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

  const fetchPaymentBusinessDetails = async (
    businessId,
    selectedAmount,
    boostName
  ) => {
    try {
      if (!user || !businessId) {
        throw new Error("Login ID or Business ID is missing.");
      }

      console.log("check business_id fetchPaymentBusinessDetails", businessId);
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

        return response.data;
      } else {
        if (response.data.error) {
          toast.error(response.data.error); // Show backend error in toast
        } else {
          toast.error("Failed to fetch payment details.");
        }
        return null;
      }
    } catch (error) {
      console.error("Error fetching payment details:", error);

      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error); // Show backend error message
      } else {
        toast.error(
          error.message || "Failed to initiate payment. Please try again."
        );
      }
      return null;
    }
  };

  const handlePaymentForBusiness = async (businessId) => {
    console.log("check business_id handlePaymentForBusiness", businessId);
    if (!amount) {
      setAmountError("Please select a payment option.");
      return;
    }

    const paymentData = await fetchPaymentBusinessDetails(
      businessId,
      amount,
      boostName
    );

    console.log("Fetched Payment Data:", paymentData);
    console.log("check business_id 3", businessId);

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
            await updateBusinessHandlePayment( response.razorpay_payment_id, payment_details.id  );
          } catch (error) {
            console.error("Error during payment processing:", error.message);
            alert("Error updating payment status. Please contact support.");
          }
        },
        prefill: {
          name: user_details?.name || "User Name",
          email: user_details?.email || "mailto:user@example.com",
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
      const url =
        "https://bxell.com/bxell/admin/api/update-business-boost-payment";
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
  const fetchPaymentPropertDetails = async (
    propertyId,
    selectedAmount,
    boostName
  ) => {
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

      console.log("Sending payload for property payment:", payload);

      const response = await axios.post(
        "https://bxell.com/bxell/admin/api/create-property-boost-payment",
        payload
      );

      if (response.data.result === true && response.data.status === 200) {
        console.log("Payment API Response:", response.data);

        return response.data;
      } else {
        if (response.data.error) {
          toast.error(response.data.error); // Show backend error in toast
        } else {
          toast.error("Failed to fetch payment details.");
        }
        return null;
      }
    } catch (error) {
      console.error("Error fetching payment details:", error);

      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error); // Show backend error message
      } else {
        toast.error(
          error.message || "Failed to initiate payment. Please try again."
        );
      }
    }
  };

  const handlePaymentForProperty = async (propertyId) => {
    if (!amount) {
      setAmountError("Please select a payment option.");
      return;
    }

    const paymentData = await fetchPaymentPropertDetails(
      propertyId,
      amount,
      boostName
    );

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
            await updatePropertyHandlePayment(
              response.razorpay_payment_id,
              payment_details.id
            );
          } catch (error) {
            console.error("Error during payment processing:", error.message);
            alert("Error updating payment status. Please contact support.");
          }
        },
        prefill: {
          name: user_details?.name || "User Name",
          email: user_details?.email || "mailto:user@example.com",
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
      const url =
        "https://bxell.com/bxell/admin/api/update-property-boost-payment";
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

  const handlepropertyNavigate = (type, id) => {
    navigate("/single-page", { state: { type, id } });
  };
  const handlebusinessNavigate = (type, id) => {
    navigate("/single-page", { state: { type, id } });
  };

  const [currentPageBusiness, setCurrentPageBusiness] = useState(1);
  const [itemsPerPageBusiness] = useState(4); // Number of items per page for businesses

  const [currentPageProperty, setCurrentPageProperty] = useState(1);
  const [itemsPerPageProperty] = useState(4); // Number of items per page for properties

  const [currentPageBusinessFav, setCurrentPageBusinessFav] = useState(1);
  const [itemsPerPageBusinessFav] = useState(4); // Number of items per page for businesses

  const [currentPagePropertyFav, setCurrentPagePropertyFav] = useState(1);
  const [itemsPerPagePropertyFav] = useState(4); // Number of items per page for properties

  const handleBusinessPageChange = (pageNumber) => {
    setCurrentPageBusiness(pageNumber);
  };

  const handlePropertyPageChange = (pageNumber) => {
    setCurrentPageProperty(pageNumber);
  };

  const handleBusinessPageChangeFav = (pageNumber) => {
    setCurrentPageBusinessFav(pageNumber);
  };

  const handlePropertyPageChangeFav = (pageNumber) => {
    setCurrentPagePropertyFav(pageNumber);
  };

  // Total pages for each category
  const totalPagesBusiness = Math.ceil(
    (businessSale?.length || 0) / itemsPerPageBusiness
  );
  const totalPagesProperty = Math.ceil(
    (propertySale?.length || 0) / itemsPerPageProperty
  );

  const totalPagesBusinessFav = Math.ceil(
    (businessData?.length || 0) / itemsPerPageBusinessFav
  );
  const totalPagesPropertyFav = Math.ceil(
    (propertyData?.length || 0) / itemsPerPagePropertyFav
  );

  const currentBusinessSale = businessSale.slice(
    (currentPageBusiness - 1) * itemsPerPageBusiness,
    currentPageBusiness * itemsPerPageBusiness
  );

  const currentPropertySale = propertySale.slice(
    (currentPageProperty - 1) * itemsPerPageProperty,
    currentPageProperty * itemsPerPageProperty
  );

  const currentBusinessSaleFav = businessData.slice(
    (currentPageBusinessFav - 1) * itemsPerPageBusinessFav,
    currentPageBusinessFav * itemsPerPageBusinessFav
  );

  const currentPropertySaleFav = propertyData.slice(
    (currentPagePropertyFav - 1) * itemsPerPagePropertyFav,
    currentPagePropertyFav * itemsPerPagePropertyFav
  );

  const handlePreviousPage = () => {
    if (currentPageProperty > 1) {
      handlePropertyPageChange(currentPageProperty - 1);
    }
  };

  const handleNextPage = (totalPages) => {
    if (currentPageProperty < totalPages) {
      handlePropertyPageChange(currentPageProperty + 1);
    }
  };

  const handlePreviousPageFav = () => {
    if (currentPagePropertyFav > 1) {
      handlePropertyPageChangeFav(currentPagePropertyFav - 1);
    }
  };

  const handleNextPageFav = (totalPages) => {
    if (currentPagePropertyFav < totalPages) {
      handlePropertyPageChangeFav(currentPagePropertyFav + 1);
    }
  };

  const handleBusinessPreviousPage = () => {
    if (currentPageBusiness > 1) {
      handleBusinessPageChange(currentPageBusiness - 1);
    }
  };

  const handleBusinessNextPage = (totalPages) => {
    if (currentPageBusiness < totalPages) {
      handleBusinessPageChange(currentPageBusiness + 1);
    }
  };

  const handleBusinessPreviousPageFav = () => {
    if (currentPageBusinessFav > 1) {
      handleBusinessPageChangeFav(currentPageBusinessFav - 1);
    }
  };

  const handleBusinessNextPageFav = (totalPages) => {
    if (currentPageBusinessFav < totalPages) {
      handleBusinessPageChangeFav(currentPageBusinessFav + 1);
    }
  };

  // const handlepropertyNavigate = (type, id) => {

  //   navigate("/single-page", { state: { type, id } });
  // };
  const handlePropertyEditClick = async (propertyId) => {
    try {
      const response = await editPropertyDetail(propertyId);
      console.log("API property Response:", response);

      // Navigate to the edit-business page with the API response
      if (response?.result) {
        navigate("/edit-property", {
          state: { propertyData: response.property_detail }, // Correct the key
        });
      }
    } catch (error) {
      console.error("Failed to fetch property details:", error.message);
    }
  };
  // const handlebusinessNavigate = (type, id) => {

  //   navigate("/edit-business", { state: { type, id } });
  // };
  const handleEditClick = async (businessId) => {
    try {
      const response = await editBusinessDetail(businessId);
      console.log("API Response:", response);

      // Navigate to the edit-business page with the API response
      if (response?.result) {
        navigate("/edit-business", {
          state: { businessData: response.business_detail },
        });
      }
    } catch (error) {
      console.error("Failed to fetch business details:", error.message);
    }
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
        // Fetch the property and business data
        const propertyRes = await fetchPropertyFavoriteRes(user);
        const businessRes = await fetchBusinessFavoriteRes(user);

        console.log("Raw Property Data:", propertyRes);
        console.log("Raw Business Data:", businessRes);

        // Filter to include only items with `status` as "Active" in `business_favorite_detail`
        const filteredBusinessData = businessRes.filter(
          (item) => item.status === "Active"
        );

        const filteredPropertyData = propertyRes.filter(
          (item) => item.status === "Active"
        );

        console.log("Filtered Business Data (Active):", filteredBusinessData);

        // Update state with filtered data
        setPropertyData(filteredPropertyData); // Assuming filtering is not needed for properties
        setBusinessData(filteredBusinessData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleBusinessFavClick = async (businessId) => {
    if (!user) {
      console.error("User ID is not available. Please log in.");
      return;
    }

    try {
      const response = await fetchBusinessFav(businessId, user);
      window.location.reload();
      if (response.success) {
        console.log("Business added to favorites:", response);
        // Optionally, refresh data or update UI
      } else {
        console.error("Failed to add business to favorites:", response.message);
      }
    } catch (error) {
      console.error("Error adding business to favorites:", error);
    }
  };

  const handlePropertyFavClick = async (propertyId) => {
    if (!user) {
      console.error("User ID is not available. Please log in.");
      return;
    }

    try {
      const response = await fetchPropertyFav(propertyId, user);
      window.location.reload();
      if (response.success) {
        console.log("Property added to favorites:", response);
        // Optionally, refresh data or update UI
      } else {
        console.error("Failed to add property to favorites:", response.message);
      }
    } catch (error) {
      console.error("Error adding property to favorites:", error);
    }
  };

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
  const handleBoostClickBusiness = (businessId) => {
    console.log(businessId); // Log the selected businessId
    setSelectedBusinessId(businessId); // Save the businessId in state
    setIsModalOpenBusiness(true); // Open the modal
  };

  const handleCloseModalBusiness = () => {
    setIsModalOpenBusiness(false);
    setSelectedBusinessId(null); // Reset the selected businessId
  };

  const handleBoostClickProperty = (propertyId) => {
    console.log(propertyId); // Log the selected businessId
    setSelectedPropertyId(propertyId); // Save the businessId in state
    setIsModalOpenProperty(true); // Open the modal
  };

  const handleCloseModalProperty = () => {
    setIsModalOpenProperty(false);
    setSelectedPropertyId(null); // Reset the selected businessId
  };

  return (
    <>
      <section className="homeListingDetailSECBoost">
        <div className="container">
          <div className="tab-header explorePropertyHeding ">
            <div className="row">
              <div
                className={`col-lg-3 col-md-4 col-sm-4 tab-button listing ${
                  activeTab === "listings" ? "active" : ""
                }`}
                onClick={() => setActiveTab("listings")} > LISTINGS FOR YOU
              </div>
              <div
                className={`col-lg-3 col-md-4 col-sm-4 tab-button listing ${
                  activeTab === "explore" ? "active" : ""
                }`}
                onClick={() => setActiveTab("explore")} >FAVOURITE
              </div>
              <div
                className={`col-lg-3 col-md-4 col-sm-4 tab-button listing ${
                  activeTab === "enquiry" ? "active" : ""
                }`}
                onClick={() => setActiveTab("enquiry")}
              > ENQUIRY
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
                  currentBusinessSale.map((business, index) => (
                    <div className="col-lg-3 col-md-6 col-sm-6 listingDetailCOLBoost" key={index}  >
                      <div className="listingDetailBoxBoost">
                         <div className="promotedTextWrapperBoost image-wrapper">
                           {business.file_name ? (
                           <img className="img-fluid" style={{ cursor: "pointer" }} onClick={() => handlebusinessNavigate("business", business.id) }
                              src={(() => {
                                try {
                                  const fileName = business.file_name;
                                  const files = typeof fileName === "string" && fileName.startsWith("[")  ? JSON.parse(fileName) : fileName;
                                  if (typeof files === "string") {
                                    return files.startsWith("http") ? files : `${BASE_URL}/${files}`;
                                  } else if (
                                    Array.isArray(files) && files.length > 0
                                  ) {
                                    return files[0].startsWith("http") ? files[0]  : `${BASE_URL}/${files[0]}`;
                                  } else {
                                    return "default-image.jpg";
                                  }
                                } catch (error) {
                                  console.error("Error parsing file_name:", error  );
                                  return "default-image.jpg";
                                }
                              })()}
                              alt={business.title || "business Image"}
                            />
                          ) : (
                            <p>No images available</p>
                          )}
                          <button className="edit-button"  onClick={() => handleEditClick(business.id)} > Edit </button>
                        </div>
                        {business.subscription && business.subscription.length > 0 && business.subscription[0].status === "Valid" && (
                            <div className="promotedText">
                              {business.subscription[0].type}
                            </div>
                          )}
                           <span className="d-flex justify-content-end align-items-end">  <ReactStars  count={5}  value={business.rating} activeColor="#ffd700"  edit={false}  />  </span>
                        <div className="inter_text d-flex  justify-content-between">
                          <h5>{business.title}</h5>
                          <span className="interested" style={{ textAlign: "right" }}  > {business.view} Interested </span>
                        </div>

                        <div className="home_priceBoost">
                          <h6> Asking Price: <span> ₹{business.asking_price}  </span> </h6>
                          <span className="home_conBoost"> {business.listing_type} </span>
                        </div>
                        <div className="home_priceBoost">
                          <h6>  Reported Sale (yearly): <br></br> <span> {business.reported_turnover_from} - {business.reported_turnover_to} </span> </h6>
                        </div>
                        <div className="home_callBoost">
                          <h6> <IoLocation /> {business.city} </h6>
                          {/* <h6>Call</h6> */}
                        </div>
                        <div className="status-controls">
                          <label className="custom-checkbox">
                            <input  type="checkbox" checked={soldStatus[business.id]?.on || false} onChange={() => handleCheckboxChange(  business.id,   "on", "business"  )  }  disabled={soldStatus[business.id]?.on}  /> ON
                          </label>
                          <br />
                          <label className="custom-checkbox">
                            <input type="checkbox" checked={soldStatus[business.id]?.off || false} onChange={() =>  handleCheckboxChange( business.id,  "off",  "business"  )  } disabled={soldStatus[business.id]?.on } />   OFF </label>
                        </div>
                        <div className="btn_boost_container">
                          <div className="sold_status">
                            {soldStatus[business.id]?.on && ( <button className="btn_boost">Sold</button> )}
                            {soldStatus[business.id]?.off && ( <button className="btn_boost">Unsold</button> )}
                          </div>

                          <button className="pay_now_btn" onClick={() => handleBoostClickBusiness(business.id)  } > Boost </button>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="boost_text">
                            <span> Lorem ipsum dolor </span>
                          </div>
                          <div className="boost_text">
                            <span>Lorem ipsum dolor </span>
                          </div>
                        </div>

                        <div>
                          {/* Price Radio Buttons */}
                          {isModalOpenBusiness && (
                            <div className="modal_overlay">
                              <div className="modal_content">
                                <button className="close_modal_btn"  onClick={handleCloseModalBusiness} >  &times;  </button>

                                <div className="price_radio_section">
                                  {amountError && (
                                    <p  style={{ color: "red", margin: "0px", padding: "0px",  }}  >  {amountError} </p> )}

                                  <div className="price_radio_box">
                                    <div className="radio_item_box">
                                      <label className="price_option_box">
                                        <input type="radio" name="listingType"  value="149" className="radio_input_box"  onChange={handleAmountChange} />
                                        <div className="price_details_box">
                                          <span className="price_box">  ₹149 </span>
                                          <div className="content_box">
                                            <h3> Basic Boost Listing (for 1 month) </h3>
                                          </div>
                                        </div>
                                      </label>
                                    </div>

                                    <div className="radio_item_box">
                                      <label className="price_option_box">
                                        <input type="radio"  name="listingType" value="49" className="radio_input_box" onChange={handleAmountChange}  />
                                        <div className="price_details_box">
                                          <span className="price_box">₹49</span>
                                          <div className="content_box">
                                            <h3> Basic Boost Listing (for 1 week) </h3>
                                          </div>
                                        </div>
                                      </label>
                                    </div>
                                  </div>

                                  <button
                                    className="pay_now_btn"
                                    onClick={() =>
                                      handlePaymentForBusiness(  selectedBusinessId )  }  >  Pay Now </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // <p>No business listings available.</p>
                  <div className="data-not-found">
                    <h4>Data Not Found</h4>
                    <p>Loading business listings...</p>
                  </div>
                )}
              </div>
              <div className="pagination-controls">
                <button  onClick={handleBusinessPreviousPage} className="page-button" disabled={currentPageBusiness === 1} >   Previous </button>
                {Array.from(
                  { length: totalPagesBusiness },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => handleBusinessPageChange(page)}
                    className={`page-button ${
                      page === currentPageBusiness ? "active" : ""
                    }`}
                  >
                    {page} </button>
                ))}
                <button  onClick={() => handleBusinessNextPage(totalPagesBusiness)} className="page-button" disabled={currentPageBusiness === totalPagesBusiness} >   Next  </button>
              </div>
              {/* {/ Property Listings /} */}
              <div className="explorePropertyHed homeListingDetailBoost">
                <h6> PROPERTY LISTINGS BY YOU</h6>
              </div>
              <div className="row listingDetailRow_1Boost listingDetailExploreRowBoost">
                {propertySale.length > 0 ? (
                  currentPropertySale.map((property, index) => (
                    <div className="col-lg-3 col-md-6 col-sm-6 listingDetailCOLBoost"  key={index} >
                      <div className="listingDetailBoxBoost">
                        <div className="promotedTextWrapperBoost image-wrapper">
                          {property.file_name ? (
                            <img className="img-fluid" style={{ cursor: "pointer" }} onClick={() => handlepropertyNavigate("property", property.id)  }
                              src={(() => {
                                try {
                                  // Try parsing file_name as JSON
                                  const files = JSON.parse(property.file_name);
                                  return Array.isArray(files) &&  files.length > 0  ? files[0]  : "default-image.jpg";
                                } catch (error) {
                                  console.error(  "Error parsing file_name:",  error  );
                                  return (
                                    property.file_name || "default-image.jpg"
                                  );
                                }
                              })()}
                              alt={property.property_title || "business Image"}
                            />
                          ) : (
                            <p className="no-listings">No images available.</p>
                          )}
                          <button  className="edit-button" onClick={() => handlePropertyEditClick(property.id)} > Edit </button>
                        </div>
                        {property.subscription &&
                          property.subscription.length > 0 &&
                          property.subscription[0].status === "Valid" && (
                            <div className="promotedText">
                              {property.subscription[0].type}
                            </div>
                          )}
                           <span className="d-flex justify-content-end align-items-end">  <ReactStars  count={5}  value={property.rating} activeColor="#ffd700"   edit={false}  />  </span>
                        <div className="inter_text d-flex  justify-content-between">
                          <h5>{property.property_title}</h5>
                          <span className="interested" style={{ textAlign: "right" }} > {property.view} Interested  </span>
                        </div>
                        <div className="home_priceBoost">
                          <h6> Price: <span>₹{property.asking_price}</span> </h6>
                          <span className="home_conBoost"> {property.listing_type} </span>
                        </div>
                        <div>
                         
                          <h6>  Property Type : <strong>{property.property_type}</strong> </h6>
                        </div>
                        <div className="home_callBoost">
                          <h6><IoLocation /> {property.city} </h6>
                          {/* <h6>Call</h6> */}
                        </div>
                        <div className="status-controls">
                          <label className="custom-checkbox">
                            <input  type="checkbox" checked={soldStatus[property.id]?.on || false} onChange={() =>  handleCheckboxChange( property.id,  "on",  "property"  )  } disabled={soldStatus[property.id]?.on}   />   ON </label> <br />
                          <label className="custom-checkbox">
                            <input type="checkbox" checked={soldStatus[property.id]?.off || false} onChange={() => handleCheckboxChange(  property.id, "off", "property" ) } disabled={soldStatus[property.id]?.on} />  OFF </label> <br />
                        </div>
                        <div className="btn_boost_container">
                          <div className="sold_status">
                            {soldStatus[property.id]?.on && ( <button className="btn_boost">Sold</button> )}
                            {soldStatus[property.id]?.off && ( <button className="btn_boost">Unsold</button> )}
                          </div>

                          <div>
                            <button className="pay_now_btn"  onClick={() => handleBoostClickProperty(property.id) } >  Boost </button>
                          </div>

                          {isModalOpenProperty && (
                            <div className="modal_overlay">
                              <div className="modal_content">
                                <button className="close_modal_btn" onClick={handleCloseModalProperty}  > &times; </button>

                                <div className="price_radio_section">
                                  {amountError && ( <p  style={{ color: "red", margin: "0px",  padding: "0px", }} > {amountError} </p> )}

                                  <div className="price_radio_box">
                                    <div class="form-check">
                                      <input class="form-check-input"  type="radio" value="149"  name="listingType"  id="flexRadioDefault1" onChange={handleAmountChange}  />
                                      <label   class="form-check-label" for="flexRadioDefault1" >  <span className="price_box">₹149</span>
                                        <div className="content_box">
                                          <h3> Basic Boost Listing (for 1 month) </h3>
                                        </div>
                                      </label>
                                    </div>

                                    <div class="form-check">
                                      <input  class="form-check-input"  type="radio"  value="49" name="listingType" id="flexRadioDefault1" onChange={handleAmountChange} />
                                      <label class="form-check-label" for="flexRadioDefault1" >
                                        <span className="price_box">₹49</span>
                                        <div className="content_box">
                                          <h3>  Basic Boost Listing (for 1 week) </h3>
                                        </div>
                                      </label>
                                    </div>
                                  </div>

                                  <button className="pay_now_btn" onClick={() =>  handlePaymentForProperty(property.id)   }  > Pay Now  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="boost_text">
                            <span> Lorem ipsum dolor </span>
                          </div>
                          <div className="boost_text">
                            <span>Lorem ipsum dolor </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // <p className="no-listings">No property listings available.</p>
                  <div className="data-not-found">
                    <h4>Data Not Found</h4>
                    <p>Loading property listings...</p>
                  </div>
                )}
              </div>
              <div className="pagination-controls">
                <button onClick={handlePreviousPage}  className="page-button"  disabled={currentPageProperty === 1}  >  Previous  </button>
                {Array.from(
                  { length: totalPagesProperty },
                  (_, i) => i + 1
                ).map((page) => (
                  <button  key={page} onClick={() => handlePropertyPageChange(page)}  className={`page-button ${  page === currentPageProperty ? "active" : ""  }`}  > {page} </button>
                ))}
                <button  onClick={() => handleNextPage(totalPagesProperty)}  className="page-button" disabled={currentPageProperty === totalPagesProperty}> Next  </button>
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
                {" "}
                <h6>PROPERTY FAVOURITE</h6>{" "}
              </div>
              <div>
                {propertyData.length > 0 ? (
                  <div className="row propertyBuyListingRow_1">
                    {currentPropertySaleFav.map((property, index) => (
                      <div
                        className="col-lg-3 col-md-6 col-sm-6 recommendationsClsNameCOL"
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
                              <FaHeart
                                className="wishlist-icon"
                                onClick={() =>
                                  handlePropertyFavClick(
                                    property.property_sale.id
                                  )
                                }
                              />{" "}
                            </div>

                            <img
                              className="img-fluid"
                              onClick={() =>
                                handlepropertyNavigate(
                                  "property",
                                  property.property_sale.id
                                )
                              }
                              src={(() => {
                                try {
                                  const fileName =
                                    property.property_sale?.file_name;

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
                                  return "default-image.jpg";
                                }
                              })()}
                              alt={property.property_title || "property Image"}
                            />

                            {property.property_sale.subscription &&
                              property.property_sale.subscription.length > 0 &&
                              property.property_sale.subscription[0].status ===
                                "Valid" && (
                                <div className="promotedText">
                                  {property.property_sale.subscription[0].type}
                                </div>
                              )}
                                <span className="d-flex justify-content-end align-items-end">
                                                  <ReactStars
                                                    count={5}
                                                    value={property.rating}
                                                    activeColor="#ffd700"
                                                    edit={false}
                                                  />
                                                </span>
                            <div className="title-location">
                              <div className="inter_text d-flex  justify-content-between">
                                <h5>
                                  {property.property_sale?.property_title}
                                </h5>
                                <span
                                  className="interested"
                                  style={{ textAlign: "right" }}
                                >
                                  {" "}
                                  {property.property_sale.view} Interested{" "}
                                </span>
                              </div>
                            </div>

                            <div className="home_price">
                              <h6>
                                {" "}
                                Asking Price: ₹{" "}
                                <span>
                                  {property.property_sale.asking_price}
                                </span>{" "}
                              </h6>
                              <span className="home_con">
                                {" "}
                                {property.property_sale.listing_type}{" "}
                              </span>
                            </div>
                            <div>
                              <h6>
                                Property Type :{" "}
                                <strong>
                                  {property.property_sale.property_type}
                                </strong>
                              </h6>
                            </div>

                            <div className="location-call">
                              <h6>
                                {" "}
                                <IoLocation /> {
                                  property.property_sale.city
                                }{" "}
                              </h6>
                              <a
                                href={`tel:${property.property_sale.phone_number}`}
                                className="call-btn"
                                style={{ textDecoration: "none" }}
                              >
                                {" "}
                                Call <FaPhoneAlt />{" "}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="data-not-found">
                    <h4>Data Not Found</h4>
                    <p>Loading favorite property...</p>
                  </div>
                )}

                {/* Property Pagination */}
                <div className="pagination-controls">
                  <button
                    onClick={handlePreviousPageFav}
                    className="page-button"
                    disabled={currentPagePropertyFav === 1}
                  >
                    Previous
                  </button>
                  {Array.from(
                    { length: totalPagesPropertyFav },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePropertyPageChangeFav(page)}
                      className={`page-button ${
                        page === currentPagePropertyFav ? "active" : ""
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handleNextPageFav(totalPagesPropertyFav)}
                    className="page-button"
                    disabled={currentPagePropertyFav === totalPagesPropertyFav}
                  >
                    Next
                  </button>
                </div>

                <div className="explorePropertyHed homeListingDetailBoost">
                  <h6>BUSINESS FAVOURITE</h6>
                </div>
                {businessData.length > 0 ? (
                  <div className="row propertyBuyListingRow_1">
                    {currentBusinessSaleFav.map((business, index) => (
                      <div
                        className="col-lg-3 col-md-6 col-sm-6 recommendationsClsNameCOL"
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
                              <FaHeart
                                className="wishlist-icon"
                                onClick={() =>
                                  handleBusinessFavClick(
                                    business.business_sale.id
                                  )
                                }
                              />
                            </div>
                            {/* <img  className="img-fluid"  src={  business.business_sale?.file_name ||   "default-image.jpg"} alt={business.business_sale?.title} /> */}
                            <img
                              className="img-fluid"
                              onClick={() =>
                                handlebusinessNavigate(
                                  "business",
                                  business.business_sale.id
                                )
                              }
                              src={(() => {
                                try {
                                  const fileName =
                                    business.business_sale?.file_name;

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
                                  return "default-image.jpg";
                                }
                              })()}
                              alt={business.title || "business Image"}
                            />
                              <span className="d-flex justify-content-end align-items-end">
                                                  <ReactStars
                                                    count={5}
                                                    value={business.rating}
                                                    activeColor="#ffd700"
                                                    edit={false}
                                                  />
                                                </span>
                            {business.business_sale.subscription &&
                              business.business_sale.subscription.length > 0 &&
                              business.business_sale.subscription[0].status ===
                                "Valid" && (
                                <div className="promotedText">
                                  {business.business_sale.subscription[0].type}
                                </div>
                              )}
                            <div className="title-location">
                              <div className="inter_text d-flex  justify-content-between">
                                <h5>{business.business_sale?.title}</h5>
                                <span
                                  className="interested"
                                  style={{ textAlign: "right" }}
                                >
                                  {" "}
                                  {business.business_sale.view} Interested{" "}
                                </span>
                              </div>
                            </div>
                            <div className="home_price">
                              <h6>
                                {" "}
                                Asking Price: ₹{" "}
                                <span>
                                  {business.business_sale.asking_price}
                                </span>{" "}
                              </h6>
                              <span className="home_con">
                                {" "}
                                {business.business_sale.listing_type}{" "}
                              </span>
                            </div>

                            <div className="home_priceBoost">
                              <h6>
                                Reported Sale (yearly): <br></br>{" "}
                                <span>
                                  {" "}
                                  {
                                    business.business_sale
                                      .reported_turnover_from
                                  }{" "}
                                  -{" "}
                                  {business.business_sale.reported_turnover_to}{" "}
                                </span>{" "}
                              </h6>
                            </div>
                            <div className="location-call">
                              <h6>
                                {" "}
                                <IoLocation /> {
                                  business.business_sale.city
                                }{" "}
                              </h6>
                              <a
                                href={`tel:${business.business_sale.phone_number}`}
                                className="call-btn"
                                style={{ textDecoration: "none" }}
                              >
                                {" "}
                                Call <FaPhoneAlt />{" "}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // <div>No favorite businesses available</div>
                  <div className="data-not-found">
                    <h4>Data Not Found</h4>
                    <p>Loading favorite businesses...</p>
                  </div>
                )}
                {/* Business Pagination */}
                <div className="pagination-controls">
                  <button
                    onClick={handleBusinessPreviousPageFav}
                    className="page-button"
                    disabled={currentPageBusinessFav === 1}
                  >
                    Previous
                  </button>
                  {Array.from(
                    { length: totalPagesBusinessFav },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => handleBusinessPageChangeFav(page)}
                      className={`page-button ${
                        page === currentPageBusinessFav ? "active" : ""
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      handleBusinessNextPageFav(totalPagesBusinessFav)
                    }
                    className="page-button"
                    disabled={currentPageBusinessFav === totalPagesBusinessFav}
                  >
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
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enquiryDetails.map((detail) => (
                          <tr key={detail.id}>
                            <td>{detail.name}</td>
                            <td>{detail.email}</td>
                            <td>{detail.listing_name}</td>
                            <td>{detail.status}</td>
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
