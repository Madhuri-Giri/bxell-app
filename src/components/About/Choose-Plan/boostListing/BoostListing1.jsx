import React, { useState, useEffect } from "react";
import { fetchListingDetail } from "../../../../API/apiServices";
import { IoLocation } from "react-icons/io5";
import axios from "axios";
import Footer from "../../../Footer/Footer";
import Header from "../../../Header/Header";

const BoostListing1 = () => {
    const [businessSale, setBusinessSale] = useState([]);
    const [propertySale, setPropertySale] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [businessIds, setBusinessIds] = useState([]); // To store all business IDs
    const [propertyIds, setPropertyIds] = useState([]); 
  
    const fetchListDetail = async () => {
      setLoading(true);
      setError(null);
      try {
          const data = await fetchListingDetail();
          console.log("API Response:", data);
  
          if (data && data.length > 0 && data[0].business_sale) {
              setBusinessSale(data[0].business_sale || []);
              setPropertySale(data[0].property_sale || []);
  
              // Extract all business IDs
              const businessIds = data[0].business_sale.map(item => item.id);
              // Extract all property IDs
              const propertyIds = data[0].property_sale.map(item => item.id);
  
              // Store the IDs
              setBusinessIds(businessIds);  // Set state for all business IDs
              setPropertyIds(propertyIds);  // Set state for all property IDs
  
             
          } else {
              setError("No listings available.");
          }
      } catch (error) {
          setError("Failed to load listings.");
      }
      setLoading(false);
  };
  
    useEffect(() => {
      fetchListDetail();
    }, []);
  
  // ----------------------propert payment -------------------------------
  const fetchPaymentPropertyDetails = async (propertyId) => {
    try {
      const userId = localStorage.getItem("userLoginId");
      console.log("Fetched User ID from localStorage:", userId);
  
      if (!userId || !propertyId) {
        throw new Error("Login ID or Property ID is missing.");
      }
  
      const payload = {
        amount: 149,
        user_id: userId,
        property_id: propertyId,
        boost_name: "month",
      };
  
      console.log("Sending payload for property payment:", payload);
  
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
    const paymentData = await fetchPaymentPropertyDetails(propertyId);
  
    console.log("Fetched Payment Data:", paymentData);
  
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
        description: "Property Purchase",
        image: "https://your-logo-url.com/logo.png",
        handler: async function (response) {
          console.log("Payment successful response:", response);
          try {
            await updatePropertyHandlePayment(response.razorpay_payment_id, payment_details.id);
            alert("Payment successful!");
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
  
      console.log("Updating property payment status with payload:", payload);
  
      const response = await axios.post(url, payload);
  
      console.log("API Response for payment status update:", response.data);
  
      // Check success conditions based on the actual API response structure
      if (response.data?.result === true && response.data?.status === 200) {
        alert("Payment successful and verified!");
      } else {
        alert("Payment verification failed. Please contact support.");
        console.error("Payment verification failed response:", response.data);
      }
    } catch (error) {
      console.error("Error updating payment status:", error.message);
      alert("Failed to update payment status. Please try again.");
    }
  };
  
  //------------------ Fetch Payment Business Details--------------------------
  const fetchPaymentBusinessDetails = async (businessId) => {
    try {
      const userId = localStorage.getItem("userLoginId");
      console.log("Fetched User ID from localStorage:", userId);
  
      if (!userId || !businessId) {
        throw new Error("Login ID or Property ID is missing.");
      }
  
      const payload = {
        amount: 149,
        user_id: userId,
        business_id: businessId,
        boost_name: "month",
      };
  
      console.log("Sending payload for property payment:", payload);
  
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
    const paymentData = await fetchPaymentBusinessDetails(businessId);
  
    console.log("Fetched Payment Data:", paymentData);
  
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
        description: "Property Purchase",
        image: "https://your-logo-url.com/logo.png",
        handler: async function (response) {
          console.log("Payment successful response:", response);
          try {
            await updateBusinessHandlePayment(response.razorpay_payment_id, payment_details.id);
            alert("Payment successful!");
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
  
      console.log("Updating property payment status with payload:", payload);
  
      const response = await axios.post(url, payload);
  
      console.log("API Response for payment status update:", response.data);
  
      // Check success conditions based on the actual API response structure
      if (response.data?.result === true && response.data?.status === 200) {
        alert("Payment successful and verified!");
      } else {
        alert("Payment verification failed. Please contact support.");
        console.error("Payment verification failed response:", response.data);
      }
    } catch (error) {
      console.error("Error updating payment status:", error.message);
      alert("Failed to update payment status. Please try again.");
    }
  };
   
  //   ---------------------------------------------------------------
  
  
    return (
        <>
            <Header/>
         <section className="homeListingDetailSECBoost">
        <div className="container">
          <div className="explorePropertyHed homeListingDetailBoost">
            <h6>LISTINGS FOR YOU</h6>
          </div>
          {/* Loading State */}
          {loading && <p>Loading...</p>}
          {/* Error State */}
          {error && <p>{error}</p>}
          {/* Business Listings */}
          <div className="row listingDetailRow_1Boost listingDetailExploreRowBoost">
            {businessSale && businessSale.length > 0 ? (
              businessSale.map((business, index) => (
                <div className="col-lg-3 listingDetailCOLBoost" key={index}>
                  <div className="listingDetailBoxBoost">
                    <div className="promotedTextWrapperBoost">
                      {business.file_name ? (
                        <img
                        className="img-fluid"
                        onClick={() => handlebusinessNavigate("business", business.id)}
                        src={(() => {
                          try {
                            const fileName = business.file_name;
                      
                            // Parse the file_name if it's a JSON string
                            const files =
                              typeof fileName === "string" && fileName.startsWith("[")
                                ? JSON.parse(fileName)
                                : fileName;
                      
                            if (typeof files === "string") {
                              // Single image case
                              return files.startsWith("http") ? files : `${BASE_URL}/${files}`;
                            } else if (Array.isArray(files) && files.length > 0) {
                              // Multiple images case
                              return files[0].startsWith("http") ? files[0] : `${BASE_URL}/${files[0]}`;
                            } else {
                              // Default image as fallback
                              return "default-image.jpg";
                            }
                          } catch (error) {
                            console.error("Error parsing or handling file_name:", error);
                            return "default-image.jpg"; // Fallback in case of error
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
                      <span className="home_conBoost">{business.listing_type}</span>
                    </div>
                    <h6>Reported Sale (yearly): {business.sale}</h6>
                    <div className="home_callBoost">
                      <h6>
                        <IoLocation /> {business.city}
                      </h6>
                      <h6>Call</h6>
                    </div>
                    <div className="btn_boost"> 
                    <button className="btn_boost" onClick={() => handlePaymentForBusiness(business.id)}>pay now</button>
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
            {propertySale && propertySale.length > 0 ? (
              propertySale.map((property, index) => (
                <div className="col-lg-3 listingDetailCOLBoost" key={index}>
                  <div className="listingDetailBoxBoost">
                    <div className="promotedTextWrapperBoost">
                      {property.file_name ? (
                        <img
                          className="img-fluid"
                          src={JSON.parse(property.file_name)[0]}
                          alt="Property Image"
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
                      <span className="home_conBoost">{property.listing_type}</span>
                    </div>
                    <h6>Reported Sale (yearly): {property.sale}</h6>
                    <div className="home_callBoost">
                      <h6>
                        <IoLocation /> {property.city}
                      </h6>
                      <h6>Call</h6>
                    </div>
                    <div className="btn_boost"> <button className="btn_boost"  onClick={() => handlePaymentForProperty(property.id)}>pay now</button> </div>
                   
                  </div>
               
                </div>
              ))
            ) : (
              <p>No property listings available.</p>
            )}
          </div>
        </div>
      </section>
         <Footer/>
        </>
     
  )
}

export default BoostListing1
