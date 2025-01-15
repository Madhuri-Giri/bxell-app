import React, { useState, useEffect } from "react";
import { fetchListingDetail } from "../../../../API/apiServices";
import { IoLocation } from "react-icons/io5";
import axios from "axios";
import Footer from "../../../Footer/Footer";
import Header from "../../../Header/Header";
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const BoostListing1 = () => {
  const navigate = useNavigate();
    const [businessSale, setBusinessSale] = useState([]);
    const [propertySale, setPropertySale] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [businessIds, setBusinessIds] = useState([]); // To store all business IDs
    const [propertyIds, setPropertyIds] = useState([]); 
    const user = useSelector((state) => state.auth.user);

    const fetchListDetail = async (userId) => {
      setLoading(true);
      setError(null);
      try {
          const data = await fetchListingDetail(userId);
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
  
             
          }
      } catch (error) {
          setError("Failed to load listings.");
      }
      setLoading(false);
  };
  
   useEffect(() => {
     if (user) {
       fetchListDetail(user); // Pass the user ID here
     }
   }, [user]);

   
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

const handleBusinessPageChange = (pageNumber) => {
  setCurrentPageBusiness(pageNumber);
};

const handlePropertyPageChange = (pageNumber) => {
  setCurrentPageProperty(pageNumber);
};

// Total pages for each category
const totalPagesBusiness = Math.ceil((businessSale?.length || 0) / itemsPerPageBusiness);
const totalPagesProperty = Math.ceil((propertySale?.length || 0) / itemsPerPageProperty);

const currentBusinessSale = businessSale.slice(
  (currentPageBusiness - 1) * itemsPerPageBusiness,
  currentPageBusiness * itemsPerPageBusiness
);

const currentPropertySale = propertySale.slice(
  (currentPageProperty - 1) * itemsPerPageProperty,
  currentPageProperty * itemsPerPageProperty
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

  // ----------------------propert payment -------------------------------
  const fetchPaymentPropertyDetails = async (propertyId) => {
    try {
   
  
      if (!user || !propertyId) {
        throw new Error("Login ID or Property ID is missing.");
      }
  
      const payload = {
        amount: 149,
        user_id: user,
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
      toast.success("Payment successful and verified!"); // Show success message

      // Navigate to the home page after a delay
      setTimeout(() => {
        navigate("/"); // Adjust the route based on your routing setup
      }, 3000); // Navigate after 3 seconds
    } else {
      toast.error("Payment verification failed. Please contact support."); // Show error message
      console.error("Payment verification failed response:", response.data);
    }
  } catch (error) {
    console.error("Error updating payment status:", error.message);
    toast.error("Failed to update payment status. Please try again."); // Show error message
  }
  };
  
  //------------------ Fetch Payment Business Details--------------------------
  const fetchPaymentBusinessDetails = async (businessId) => {
    try {
      if (!user || !businessId) {
        throw new Error("Login ID or Property ID is missing.");
      }
  
      const payload = {
        amount: 149,
        user_id: user,
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
        description: "Property Purchase",
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

    console.log("Updating property payment status with payload:", payload);

    const response = await axios.post(url, payload);

    console.log("API Response for payment status update:", response.data);

    // Check success conditions based on the actual API response structure
    if (response.data?.result === true && response.data?.status === 200) {
      toast.success("Payment successful and verified!"); // Show success message

      // Navigate to the home page after a delay
      setTimeout(() => {
        navigate("/"); // Adjust the route based on your routing setup
      }, 3000); // Navigate after 3 seconds
    } else {
      toast.error("Payment verification failed. Please contact support."); // Show error message
      console.error("Payment verification failed response:", response.data);
    }
  } catch (error) {
    console.error("Error updating payment status:", error.message);
    toast.error("Failed to update payment status. Please try again."); // Show error message
  }
};

  //   ---------------------------------------------------------------
    return (
        <>
            <Header/>
         <section className="homeListingDetailSECBoost">
        <div className="container">
          
          {/* Loading State */}
          {/* {loading && <p>Loading...</p>} */}
          {/* Error State */}
          {error && <p>{error}</p>}
          {/* Business Listings */}
          <div className="explorePropertyHed homeListingDetailBoost">
            <h6>BUSINESS LISTINGS FOR YOU</h6>
          </div>
          <div className="row listingDetailRow_1Boost listingDetailExploreRowBoost">
  {businessSale && businessSale.length > 0 ? (
    <>
      {currentBusinessSale.map((business, index) => (
        <div className="col-lg-3 col-md-6 listingDetailCOLBoost" key={index}>
          <div className="listingDetailBoxBoost">
            <div className="promotedTextWrapperBoost">
              {business.file_name ? (
                <img
                  className="img-fluid"
                  style={{ cursor: "pointer" }}
                  onClick={() => handlebusinessNavigate("business", business.id)}
                  src={(() => {
                    try {
                      const fileName = business.file_name;
                      const files =
                        typeof fileName === "string" && fileName.startsWith("[")
                          ? JSON.parse(fileName)
                          : fileName;

                      if (typeof files === "string") {
                        return files.startsWith("http") ? files : `${BASE_URL}/${files}`;
                      } else if (Array.isArray(files) && files.length > 0) {
                        return files[0].startsWith("http") ? files[0] : `${BASE_URL}/${files[0]}`;
                      } else {
                        return "default-image.jpg";
                      }
                    } catch (error) {
                      console.error("Error parsing or handling file_name:", error);
                      return "default-image.jpg";
                    }
                  })()}
                  alt={business.title || "Business Image"}
                />
              ) : (
                <p>No images available</p>
              )}
            </div>
            <div className="inter_text d-flex justify-content-between">
              <h5>{business.title}</h5>
              <span className="interested"  style={{textAlign:"right"}}>{business.view} Interested</span>
            </div>
            {business.subscription &&
              business.subscription.length > 0 &&
              business.subscription[0].status === "Valid" && (
                <div className="promotedText">{business.subscription[0].type}</div>
              )}
            <div className="home_priceBoost">
              <h6>
                Asking Price: <span>₹{business.asking_price}</span>
              </h6>
              <span className="home_conBoost">{business.listing_type}</span>
            </div>
            <h6>
              Reported Sale (yearly): <br />
              ₹ <span>{business.reported_turnover_from}</span> -{" "}
              <span>{business.reported_turnover_to}</span>
            </h6>
            <div className="home_callBoost">
              <h6>
                <IoLocation /> {business.city}
              </h6>
            </div>
            <div
              className="btn_boost"
              onClick={() => handlePaymentForBusiness(business.id)}
              style={{ cursor: "pointer", textAlign: "center" }}
            >
              <button className="btn_boost">Pay now</button>
            </div>
          </div>
        </div>
      ))}
  <div className="pagination-controls">
        <button
          onClick={handleBusinessPreviousPage}
          className="page-button"
          disabled={currentPageBusiness === 1}
        >
          Previous
        </button>
        {Array.from({ length: totalPagesBusiness }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handleBusinessPageChange(page)}
            className={`page-button ${page === currentPageBusiness ? "active" : ""}`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handleBusinessNextPage(totalPagesBusiness)}
          className="page-button"
          disabled={currentPageBusiness === totalPagesBusiness}
        >
          Next
        </button>
      </div>
    </>
  ) : (
    <div className="data-not-found">
          <h4>Data Not Found</h4>
          <p>Loading Boost Business Listing...</p>
        </div>
  )}
</div>

          {/* Property Listings */}
          <div className="explorePropertyHed homeListingDetailBoost">
            <h6>PROPERTY LISTINGS FOR YOU</h6>
          </div>
          <div className="row listingDetailRow_1Boost listingDetailExploreRowBoost">
  {propertySale && propertySale.length > 0 ? (
    <>
      {currentPropertySale.map((property, index) => (
        <div className="col-lg-3 col-md-6 listingDetailCOLBoost" key={index}>
          <div className="listingDetailBoxBoost">
            <div className="promotedTextWrapperBoost">
              {property.file_name ? (
                <img
                  className="img-fluid"
                  style={{ cursor: "pointer" }}
                  onClick={() => handlepropertyNavigate("property", property.id)}
                  src={(() => {
                    try {
                      const fileName = property.file_name;
                      const files =
                        typeof fileName === "string" && fileName.startsWith("[")
                          ? JSON.parse(fileName)
                          : fileName;

                      if (typeof files === "string") {
                        return files.startsWith("http") ? files : `${BASE_URL}/${files}`;
                      } else if (Array.isArray(files) && files.length > 0) {
                        return files[0].startsWith("http") ? files[0] : `${BASE_URL}/${files[0]}`;
                      } else {
                        return "default-image.jpg";
                      }
                    } catch (error) {
                      console.error("Error parsing or handling file_name:", error);
                      return "default-image.jpg";
                    }
                  })()}
                />
              ) : (
                <p>No images available</p>
              )}
            </div>
            <div className="inter_text d-flex justify-content-between">
              <h5>{property.property_title}</h5>
              <span className="interested"  style={{textAlign:"right"}}>{property.view} Interested</span>
            </div>
            {property.subscription &&
              property.subscription.length > 0 &&
              property.subscription[0].status === "Valid" && (
                <div className="promotedText">{property.subscription[0].type}</div>
              )}
            <div className="home_priceBoost">
              <h6>
                Price: <span>₹{property.asking_price}</span>
              </h6>
              <span className="home_conBoost">{property.listing_type}</span>
            </div>
            <div>
              <h6>
                Property Type: <strong>{property.property_type}</strong>
              </h6>
            </div>
            <div className="home_callBoost">
              <h6>
                <IoLocation /> {property.city}
              </h6>
            </div>
            <div
              className="btn_boost"
              onClick={() => handlePaymentForProperty(property.id)}
              style={{ cursor: "pointer", textAlign: "center" }}
            >
              <button className="btn_boost">Pay now</button>
            </div>
          </div>
        </div>
      ))}
      <div className="pagination-controls">
        <button
          onClick={handlePreviousPage}
          className="page-button"
          disabled={currentPageProperty === 1}
        >
          Previous
        </button>
        {Array.from({ length: totalPagesProperty }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePropertyPageChange(page)}
            className={`page-button ${
              page === currentPageProperty ? "active" : ""
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handleNextPage(totalPagesProperty)}
          className="page-button"
          disabled={currentPageProperty === totalPagesProperty}
        >
          Next
        </button>
      </div>
    </>
  ) : (
    <div className="data-not-found">
          <h4>Data Not Found</h4>
          <p>Loading Boost Property Listing...</p>
        </div>
  )}
</div>

        </div>
      </section>
         <Footer/>
        </>
     
  )
}

export default BoostListing1
