/* eslint-disable no-unused-vars */

import { Button, Form } from "react-bootstrap";
import { Stepper, Step, StepLabel } from "@mui/material";
import "./SellBusinessForm.css"; // Import the CSS file
import { useNavigate } from "react-router-dom";
import { submitSellBusinessForm, fetchCountryRes, fetchStateApiRes, fetchCityApiRes } from "../../../API/apiServices";
import axios from "axios";
import { useLocation } from "react-router-dom";
import React, { useState, useEffect} from "react";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

function SellBusinessForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const steps = ["Business Info", "Business Details"];
  const [paymentDetails, setPaymentDetails] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const [amountError, setAmountError] = useState(""); 
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [countries, setCountries] = useState([]);
  
  const [states, setStates] = useState([]);
  const [selectedCountryId, setSelectedCountryId] = useState("");

  const [cities, setCities] = useState([]); // For city options
const [selectedStateId, setSelectedStateId] = useState("");

  const [formData, setFormData] = useState({
    user_id: user ,
    business_type: "",
    title: "",
    description: "",
    percentage_of_stake: "",
    country: "",
    state: "",
    city: "",
    year_of_establishment: "",
    ebitda_margin: "",
    reported_turnover_from: "",
    reported_turnover_to: "",
    you_are: "",
    business_link: "",
    amount: 299,
    asking_price: "",
    phone_number: "",
    no_of_employees: "",
    current_status: "",
    listing_type: "",
    file_name: null,
  });
  console.log("User ID:", formData.user_id);

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
    if (selectedCountryId) {
      const getStates = async () => {
        try {
          const stateData = await fetchStateApiRes(selectedCountryId);
          if (stateData) {
            setStates(stateData); // Populate the states dropdown
          } else {
            console.error("No states found.");
          }
        } catch (error) {
          console.error("Error fetching states:", error);
        }
      };
  
      getStates();
    } else {
      setStates([]); // Clear states when no country is selected
    }
  }, [selectedCountryId]);
  
  useEffect(() => {
    if (selectedStateId) {
      const getCities = async () => {
        const cityData = await fetchCityApiRes(selectedStateId);
        setCities(cityData || []); // Update cities based on the selected state
      };
      getCities();
    } else {
      setCities([]); // Reset city options when no state is selected
    }
  }, [selectedStateId]); 

  // Updated handleChange function
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files && files.length > 0) {
      if (files.length === 1) {
        // Single file: store it as a single file object
        setFormData((prev) => ({
          ...prev,
          [name]: files[0], // Store single file directly
        }));
      } else {
        // Multiple files: store them as an array
        setFormData((prev) => ({
          ...prev,
          [name]: Array.from(files), // Convert FileList to Array
        }));
      }
    } else {
      // Handle other input types
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

 

  const handleNext = () => {
    // Check if all required fields are filled
    const errors = {};
  
    if (!formData.business_type) {
      errors.business_type = "Business Type field is required";
    }
    if (!formData.title) {
      errors.title = "Title field is required";
    }
    if (!formData.listing_type) {
      errors.listing_type = "Listing Type field is required";
    }
  
    setErrors(errors); // Set errors state
  
    // If there are errors, do not allow the user to go to the next page
    if (Object.keys(errors).length === 0) {
      setStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
    }
  };
  
  const handleBack = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 0));
  };
  const formatNumberWithCommas = (number) => {
    // If there's a number, format it with commas
    if (!number) return number;
    
    let [integerPart, decimalPart] = number.split('.');
    let formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
  };

   // Handle the price input change
  const handlepriceChange = (e) => {
      const { name, value } = e.target;

      // Ensure only positive numbers are allowed
      if (
        name === "asking_price" ||
        name === "reported_turnover_from" ||
        name === "reported_turnover_to" ||
        name === "phone_number"
      ) {
        // Remove non-numeric characters except the dot
        let rawValue = value.replace(/[^0-9.]/g, '');

        // Update the raw value in the state (no commas yet)
        setFormData((prevState) => ({
          ...prevState,
          [name]: rawValue,
        }));
      }
  };
  const handleAmountChange = (e) => {
    const selectedAmount = e.target.value;
    setFormData(prevFormData => ({
      ...prevFormData,
      amount: parseInt(selectedAmount), // Set the selected amount in formData
    }));
  };
// ------------------------boost payment--------------------------------------
// const fetchPaymentBusinessDetails = async () => {
//   try {
//     if (!user || !formData.amount) {
//       throw new Error("Login ID");
//     }

//     const payload = {
//       amount: 49,
//       user_id: user,
//       form_boost: "Form Boost",
//       boost_name: "week",
//     };

//     const response = await axios.post(
//       "https://bxell.com/bxell/admin/api/create-business-boost-payment",
//       payload
//     );

//     if (response.data.result === true && response.data.status === 200) {
//       return response.data;
//     } else {
//       throw new Error(response.data.message || "Failed to fetch payment details.");
//     }
//   } catch (error) {
//     console.error("Error fetching payment details:", error.message);
//     alert("Failed to initiate payment. Please try again.");
//     return null;
//   }
// };

// const handlePaymentForBusiness = async () => {
//   const paymentData = await fetchPaymentBusinessDetails();

//   if (!user) {
//     navigate("/login");
//     return;
//   }

//   if (paymentData) {
//     const { payment_details, user_details, razorpay_key } = paymentData;
//     const { razorpay_order_id, amount } = payment_details;

//     const options = {
//       key: razorpay_key,
//       amount: amount * 100,
//       currency: "INR",
//       order_id: razorpay_order_id,
//       name: "SRN Infotech",
//       description: "Boost Listing",
//       image: "https://your-logo-url.com/logo.png",
//       handler: async function (response) {
//         try {
//           await updateBusinessHandlePayment(response.razorpay_payment_id, payment_details.id);
//         } catch (error) {
//           alert("Error updating payment status. Please contact support.");
//         }
//       },
//       prefill: {
//         name: user_details?.name || "User Name",
//         email: user_details?.email || "user@example.com",
//         contact: user_details?.phone_number || "9999999999",
//       },
//       theme: { color: "#3399cc" },
//     };

//     const rzp1 = new window.Razorpay(options);
//     rzp1.on("payment.failed", function (response) {
//       alert(`Payment failed: ${response.error.description}`);
//     });
//     rzp1.open();
//   }
// };

// const updateBusinessHandlePayment = async (razorpay_payment_id, id) => {

//   try {
//     const url = "https://bxell.com/bxell/admin/api/update-business-boost-payment";
//     const payload = { payment_id: razorpay_payment_id, id };
  
//     console.log("Updating property payment status with payload:", payload);
  
//     const response = await axios.post(url, payload);
  
//     console.log("API Response for payment status update:", response.data);
  
//     // Check success conditions based on the actual API response structure
//     if (response.data?.result === true && response.data?.status === 200) {
//       toast.success("Payment successful and verified!"); // Show success message
  
//       // Navigate to the home page after a delay
//       setTimeout(() => {
//         navigate("/"); // Adjust the route based on your routing setup
//       }, 3000); // Navigate after 3 seconds
//     } else {
//       toast.error("Payment verification failed. Please contact support."); // Show error message
//       console.error("Payment verification failed response:", response.data);
//     }
//   } catch (error) {
//     console.error("Error updating payment status:", error.message);
//     toast.error("Failed to update payment status. Please try again."); // Show error message
//   }
//   };
   
  // --------------  payment ------------
  // const fetchPaymentDetails = async () => {
  //   try {
  //     if (!user || !formData.amount) {
  //       throw new Error("Login ID, amount or Business ID is missing.");
  //     }
  
  //     const payload = {
  //       amount: formData.amount,
  //       user_id: user,
  //     };
  
  //     const response = await axios.post(
  //       "https://bxell.com/bxell/admin/api/create-business-payment",
  //       payload
  //     );
  
  //     if (response.data.result === true && response.data.status === 200) {
  //       setPaymentDetails(response.data.payment_details);
  //       return response.data;
  //     } else {
  //       throw new Error(response.data.message || "Failed to fetch payment details");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching payment details:", error.message);
  //     toast.error(error.message || "Failed to initiate payment. Please try again.");
  //     return null;
  //   }
  // };
  
  // const handlePayment = async (e) => {
  //   e.preventDefault();
  
  //   // Reset the error message
  //   setAmountError("");
  
  //   if (!user) {
  //     navigate("/login");
  //     return;
  //   }
  
  //   if (!formData.amount) {
  //     setAmountError("Please select an amount to proceed.");
  //     return; // Stop further execution
  //   }
  
  //   if (formSubmitting) return; // Prevent multiple submissions
  //   setFormSubmitting(true);
  
  //   try {
  //     const paymentData = await fetchPaymentDetails();
  //     if (!paymentData) {
  //       setFormSubmitting(false);
  //       return;
  //     }
  
  //     const { razorpay_order_id, razorpay_key, payment_details } = paymentData;
  
  //     const options = {
  //       key: razorpay_key,
  //       amount: payment_details.amount * 100,
  //       currency: "INR",
  //       order_id: razorpay_order_id,
  //       name: "SRN Infotech",
  //       description: "Business Purchase",
  //       image: "https://your-logo-url.com/logo.png",
  //       handler: async function (response) {
  //         toast.success("Payment successful!");
  //         try {
  //           const formSubmissionData = await handleSubmit(e, payment_details.id);
  //           if (formSubmissionData) {
  //             const isPaymentUpdated = await updateHandlePayment(
  //               response.razorpay_payment_id,
  //               payment_details.id
  //             );
  
  //             if (isPaymentUpdated) {
  //               toast.success("Payment update successful!");
  //             }
  //           }
  //         } catch (error) {
  //           console.error("Error during form submission or payment update:", error.message);
  //           toast.error("Form submission failed or payment verification failed. Please try again.");
  //         } finally {
  //           setFormSubmitting(false);
  //         }
  //       },
  
  //       prefill: {
  //         name: paymentData.user_details.name || "User Name",
  //         email: paymentData.user_details.email || "user@example.com",
  //         contact: paymentData.user_details.phone_number || "9999999999",
  //       },
  //       notes: {
  //         address: "Some Address",
  //       },
  //       theme: {
  //         color: "#3399cc",
  //       },
  //     };
  
  //     const rzp1 = new window.Razorpay(options);
  
  //     rzp1.on("payment.failed", function (response) {
  //       setFormSubmitting(false);
  //       toast.error(`Payment failed: ${response.error.description}`);
  //     });
  
  //     rzp1.open();
  //   } catch (error) {
  //     console.error("Error during payment setup:", error.message);
  //     toast.error("An error occurred during payment setup. Please try again.");
  //     setFormSubmitting(false);
  //   }
  // };
  
  // const handleSubmit = async (e, paymentId) => {
  //   e.preventDefault();
  
  //   // Validate the form before submission
  //   if (!formData.amount) {
  //     setErrors({ amount: "Amount is required" });
  //     toast.error("Please fill in all required fields.");
  //     return null;
  //   }
  
  //   try {
  //     const updatedFormData = {
  //       ...formData,
  //       payment_id: paymentId,
  //     };
  
  //     const response = await submitSellBusinessForm(updatedFormData, user);
  //     toast.success(response.message || "Form submitted successfully!");
  //     setFormData({}); // Clear form data after submission
  //     navigate("/");
  
  //     // Return successful form submission data
  //     return response;
  //   } catch (error) {
  //     console.error("Error submitting form:", error.message);
  //     const apiErrors = error.response?.data?.error || {};
  //     setErrors(apiErrors);
  //     toast.error("Failed to submit the form. Please try again.");
  //     return null;
  //   }
  // };
  
  // const updateHandlePayment = async (razorpay_payment_id, Id) => {
  //   try {
  //     if (!razorpay_payment_id || !Id) {
  //       throw new Error("Missing payment details");
  //     }
  
  //     const payload = {
  //       payment_id: razorpay_payment_id,
  //       id: Id,
  //     };
  
  //     const response = await fetch(
  //       "https://bxell.com/bxell/admin/api/update-business-payment",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(payload),
  //       }
  //     );
  
  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || "Failed to update payment details");
  //     }
  
  //     const data = await response.json();
  //     console.log("Payment status updated:", data);
  //     return true;
  //   } catch (error) {
  //     console.error("Error updating payment:", error.message);
  //     toast.error(error.message || "An error occurred during payment verification.");
  //     return false;
  //   }
  // };


  const fetchPaymentDetails = async () => {
    try {
      // Fetch business ID from the submitted form
      const business_id = await submitSellBusinessForm(formData);
  
      if (!user || !business_id || !formData.amount) {
        throw new Error(
          "Login ID, amount  or Business ID is missing."
        );
      }

      const payload = {
        amount: formData.amount,
        user_id: user,
        business_id: business_id,
      };

      console.log("Sending payload:", payload);

      // Call the API to fetch payment details
      const response = await axios.post(
        "https://bxell.com/bxell/admin/api/create-business-payment",
        payload
      );

      console.log("API Response:", response.data);

      // Handle success cases
      if (response.data.result === true && response.data.status === 200) {
        setPaymentDetails(response.data.payment_details); // Update state with payment details
        console.log("Payment details fetched:", response.data);
        return response.data; // Return the successful response data
      } else {
        // Handle unexpected response
        throw new Error(
          response.data.message || "Failed to fetch payment details"
        );
      }
    } catch (error) {
      console.error("Error fetching payment details:", error.message);
      if (error.response) {
        const errorData = error.response.data;

        // Process errors and update the error state
        setErrors({
          asking_price: errorData.error?.asking_price ? errorData.error.asking_price[0] : '',
          city: errorData.error?.city ? errorData.error.city[0] : '',
          country: errorData.error?.country ? errorData.error.country[0] : '',
          current_status: errorData.error?.current_status ? errorData.error.current_status[0] : '',
          phone_number: errorData.error?.phone_number ? errorData.error.phone_number[0] : '',
          percentage_of_stake: errorData.error?.percentage_of_stake ? errorData.error.percentage_of_stake[0] : '',
          reported_turnover_from: errorData.error?.reported_turnover_from ? errorData.error.reported_turnover_from[0] : '',
          reported_turnover_to: errorData.error?.reported_turnover_to ? errorData.error.reported_turnover_to[0] : '',
          state: errorData.error?.state ? errorData.error.state[0] : '',
          you_are: errorData.error?.you_are ? errorData.error.you_are[0] : '',
          file_name: errorData.error?.file_name ? errorData.error.file_name[0] : '',
        });
      }
      // alert("Failed to initiate payment. Please try again.");
      return null;
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
  
    if (!user) {
      // Redirect to login if the user is not logged in
      navigate("/login");
      return;
    }
  
    try {
      // Submit the form first
      const response = await submitSellBusinessForm(formData, user);
  
      if (!response || response.error) {
        alert(response.message || "Form submission failed. Please try again.");
        return;
      }
  
      alert(response.message || "Form submitted successfully!");
  
      // Proceed with payment if the form submission is successful
      const paymentData = await fetchPaymentDetails();
      if (!paymentData) {
        alert("Failed to fetch payment details. Please try again.");
        return;
      }
  
      const razorpay_order_id = paymentData.payment_details?.razorpay_order_id;
      const razorpay_key = paymentData.razorpay_key;
      const payment_details = paymentData.payment_details;
  
      if (
        !razorpay_order_id ||
        !razorpay_key ||
        !payment_details ||
        !payment_details.amount
      ) {
        console.error("Incomplete payment data:", paymentData);
        alert("Missing payment details. Please try again.");
        return;
      }
  
      // Set up Razorpay payment options
      const options = {
        key: razorpay_key,
        amount: payment_details.amount * 100, // Convert to paise
        currency: "INR",
        order_id: razorpay_order_id,
        name: "SRN Infotech",
        description: "Business Purchase",
        image: "https://your-logo-url.com/logo.png",
        handler: async function (response) {
          try {
            await updateHandlePayment(
              response.razorpay_payment_id,
              payment_details.id
            );
          } catch (error) {
            console.error("Error during payment processing:", error.message);
            alert(
              "An error occurred while updating the payment status. Please contact support."
            );
          }
        },
        prefill: {
          name: paymentData.user_details.name || "User Name",
          email: paymentData.user_details.email || "mailto:user@example.com",
          contact: paymentData.user_details.phone_number || "9999999999",
        },
        notes: {
          address: "Some Address",
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
    } catch (error) {
      console.error("Error during payment setup:", error.message);
      alert("An error occurred during payment setup. Please try again.");
    }
  };
  
  const updateHandlePayment = async (razorpay_payment_id, Id) => {
    try {
      if (!razorpay_payment_id || !Id) {
        throw new Error("Missing payment details");
      }
  
      const url = "https://bxell.com/bxell/admin/api/update-business-payment";
      const payload = {
        payment_id: razorpay_payment_id,
        id: Id,
      };
      console.log("Updating payment with payload:", payload);
  
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to update payment details. Status:", response.status, "Response:", errorText);
        toast.error("Failed to update payment details. Please try again.");
        return;
      }
  
      const data = await response.json();
      console.log("Response Data:", data);
  
      const status = data?.success || data?.result || "Unknown";
      console.log("Payment Status:", status);
  
      if (status === "Payment record update successfully") {
        // Display toast notification for success
        toast.success("Payment successful and verified!");
        console.log("Payment completed successfully.");
  
        // Add delay before navigating
        setTimeout(() => {
          // Reset form and navigate to home page after successful payment
          setFormData({
            user_id: user,
            property_title: "",
            listing_type: "",
            listed_by: "",
            property_type: "",
            country: "",
            state: "",
            city: "",
            area: "",
            length: "",
            breadth: "",
            area_measurment: "",
            sq_ft: "",
            asking_price: "",
            advance_price: "",
            amount: "299",
            phone_number: "",
            bedroom: "",
            bathroom: "",
            floor_no: "",
            additional_detail: "",
            project_status: "",
            total_floor: "",
            file_name: null,
          });
          navigate("/");
        }, 5000); // 3-second delay before navigation
        
      } else if (status === "Pending") {
        toast.warn("Payment successful, but verification is pending. Please contact support.");
      } else if (status === "Failed") {
        toast.error("Payment verification failed. Please contact support.");
      } else {
        toast.error("Unexpected payment status. Please contact support.");
      }
    } catch (error) {
      console.error("Error updating payment details:", error.message);
      toast.error("An error occurred while updating the payment status. Please try again or contact support.");
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if image file is provided
    if (!formData.file_name) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        file_name: "Image file is required",
      }));
      return;
    }
  
    try {
      const response = await submitSellBusinessForm(formData, user);
      alert(response.message || "Form submitted successfully!");
  
      // Reset form data after successful submission
      setFormData({
         user_id: user ,
        business_type: "",
        title: "",
        description: "",
        percentage_of_stake: "",
        country: "",
        state: "",
        city: "",
        year_of_establishment: "",
        ebitda_margin: "",
        reported_turnover_from: "",
        reported_turnover_to: "",
        you_are: "",
        business_link: "",
        amount: 299,
        asking_price: "",
        phone_number: "",
        no_of_employees: "",
        current_status: "",
        listing_type: "",
        file_name: null,
      });
  
      setErrors({});
    } catch (error) {
      // Handle API errors
      if (error.response && error.response.data && error.response.data.error) {
        const apiErrors = error.response.data.error;
  
        // Process API errors into a flat structure for the form
        const processedErrors = Object.keys(apiErrors).reduce((acc, field) => {
          acc[field] = apiErrors[field][0]; // Take the first error message from the array
          return acc;
        }, {});
  
        // Update the errors state with the processed errors
        setErrors((prevErrors) => ({
          ...prevErrors,
          ...processedErrors,
        }));
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };
  
  return (
    <>
      <section className="businessListingFormMAinSec">
        <div className="container">
          <div className="row businessListingFormMAinRow">
            <div className="col-10 business_width">
              <div className="businessListingFormMainBox">
                <div className="businessListingFormHed">
                  <h4>SELLING BUSINESS FORM</h4>
                </div>
                <Stepper activeStep={step} className="businessformStepper">
                  {steps.map((label, index) => (
                    <Step key={index}><StepLabel>{label}</StepLabel> </Step>
                  ))}
                </Stepper>

                <Form>
                  <div className="container profileForms">
                    <div className="row">
                    {step === 0 && (
                        <>
                        <div className="col-lg-7 col-md-12 col-sm-12">
                          <Form.Group className="businessListingFormsDiv" controlId="businessType">
                            <Form.Label>BUSINESS TYPE</Form.Label>
                            <span className="vallidateRequiredStar">*</span>
                            <Form.Select  name="business_type" value={formData.business_type}  onChange={handleChange} isInvalid={!!errors.business_type} >
                              <option value="">Select Business Type</option>
                              <option value="Manufacturing">Manufacturing</option>
                              <option value="Retail">Retail</option>
                              <option value="Wholesaler">Wholesaler</option>
                              <option value="Agriculture">Agriculture</option>
                              <option value="Hospitality">Hospitality</option>
                              <option value="Transportation">Transportation</option>
                              <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
                              <option value="Real Estate">Real Estate</option>
                              <option value="IT & Software">IT & Software</option>
                              <option value="Telecommunication">Telecommunication</option>
                              <option value="E-commerce">E-commerce</option>
                              <option value="Education">Education</option>
                              <option value="Food & Beverage">Food & Beverage</option>
                              <option value="Sports & Recreation">Sports & Recreation</option>
                              <option value="Entertainment">Entertainment</option>
                              <option value="Finance">Finance</option>
                              <option value="Media & Advertising">Media & Advertising</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">  {errors.business_type}  </Form.Control.Feedback>
                          </Form.Group>
                        </div>

                        <div className="col-lg-12 col-md-12 col-sm-12">
                          <Form.Group className="businessListingFormsDiv" controlId="listingType">
                            <Form.Label>LISTING TYPE</Form.Label>
                            <span className="vallidateRequiredStar">*</span>
                            <div className="listing-type-container">
                              {["Selling", "Franchising", "Seeking Investment"].map((type) => (
                                <div
                                  key={type}
                                  className={`listing-type-box ${
                                    formData.listing_type === type ? "selected" : ""
                                  }`}
                                  onClick={() =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      listing_type: type,
                                    }))
                                  }
                                >
                                  {type}
                                </div>
                              ))}
                            </div>
                            {errors.listing_type && (
                              <div className="error-message">{errors.listing_type}</div>
                            )}
                          </Form.Group>
                        </div>

                        <div className="col-lg-7 col-md-12 col-sm-12">
                          <Form.Group className="businessListingFormsDiv" controlId="title">
                            <Form.Label>TITLE</Form.Label>
                            <span className="vallidateRequiredStar">*</span>
                            <Form.Control type="text"  name="title"  value={formData.title} onChange={handleChange} placeholder="Enter Business Title (Eg: Best Restaurant for sale)"  isInvalid={!!errors.title}  />
                            <Form.Control.Feedback type="invalid">
                              {errors.title}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </div>
                        </>
                    )}
                      {step === 1 && (
                        <>
                          {/* <div className="col-lg-7 col-md-12 col-sm-12">
                            <Form.Group className="businessListingFormsDiv" controlId="country">
                              <Form.Label>COUNTRY</Form.Label>
                              <span className="vallidateRequiredStar">*</span>
                              <div className="country-box-container">
                                {["INDIA", "USA", "UK"].map((country) => (
                                  <div key={country} className={`country-box ${formData.country === country ? "selected" : ""}`}
                                    onClick={() =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        country: country,
                                      }))
                                    }
                                  >
                                    {country}
                                  </div>
                                ))}
                              </div>
                              {errors.country && <div className="error-message">{errors.country}</div>}
                            </Form.Group>
                          </div> */}
                         <div className="col-lg-7 col-md-12 col-sm-12">
  <Form.Group className="businessListingFormsDiv" controlId="country">
    <Form.Label>COUNTRY</Form.Label>
    <span className="vallidateRequiredStar">*</span>
    <div className="country-box-container">
      {countries.map((country) => (
        <div
          key={country.id}
          className={`country-box ${selectedCountryId === country.id ? "selected" : ""}`}
          onClick={() => {
            setSelectedCountryId(country.id); // Update the selected country ID
            setFormData((prev) => ({
              ...prev,
              country: country.name, // Update the country in form data
              state: "", // Reset state selection
            }));
          }}
        >
          {country.name}
        </div>
      ))}
    </div>
    {errors.country && <div className="error-message">{errors.country}</div>}
  </Form.Group>
</div>

    
<div className="col-lg-7 col-md-12 col-sm-12">
  <Form.Group className="businessListingFormsDiv" controlId="state">
    <Form.Label>STATE</Form.Label>
    <span className="vallidateRequiredStar">*</span>
    <Form.Control
      as="select"
      value={formData.state}
      onChange={(e) => {
        const stateId = e.target.value;
        setSelectedStateId(stateId); // Update selected state ID
        setFormData((prev) => ({
          ...prev,
          state: stateId, // Update the state in form data
          city: "", // Reset city field
        }));
      }}
    >
      <option value="">Select State</option>
      {states.map((state) => (
        <option key={state.id} value={state.id}>
          {state.name}
        </option>
      ))}
    </Form.Control>
    {errors.state && <div className="error-message">{errors.state}</div>}
  </Form.Group>
</div>


    <div className="col-lg-7 col-md-12 col-sm-12">
  <Form.Group className="businessListingFormsDiv" controlId="city">
    <Form.Label>TOWN/CITY</Form.Label>
    {/* <span className="vallidateRequiredStar">*</span> */}
    <Form.Control
      as="select"
      name="city"
      value={formData.city}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          city: e.target.value, // Update the city in formData
        }))
      }
      isInvalid={!!errors.city}
    >
      <option value="">Select City</option>
      {cities.map((city) => (
        <option key={city.id} value={city.name}>
          {city.name}
        </option>
      ))}
    </Form.Control>
    <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
  </Form.Group>
</div>



                          {/* <div className="col-7">
                            <Form.Group className="businessListingFormsDiv" controlId="state" >
                              <Form.Label>STATE</Form.Label>
                              <span className="vallidateRequiredStar">*</span>
                              <Form.Select  name="state"  value={formData.state} onChange={handleChange} isInvalid={!!errors.state} >
                                <option value="">Select State</option>
                                <option value="Maharashtra">Maharashtra</option>
                                <option value="Karnataka">Karnataka</option>
                                <option value="Kerala">Kerala</option>
                                <option value="Punjab">Punjab</option>
                              </Form.Select>
                              <Form.Control.Feedback type="invalid"> {errors.state} </Form.Control.Feedback>
                            </Form.Group>
                          </div> */}

                          {/* <div className="col-7">
                            <Form.Group className="businessListingFormsDiv" controlId="city"  >
                              <Form.Label>TOWn/CITY</Form.Label>
                              <span className="vallidateRequiredStar">*</span>
                              <Form.Select  name="city" value={formData.city}  onChange={handleChange}  isInvalid={!!errors.city}  >
                                <option value="">Select City</option>
                                <option value="Mumbai">Mumbai</option>
                                <option value="Bengaluru">Bengaluru</option>
                                <option value="Delhi">Delhi</option>
                                <option value="Hyderabad">Hyderabad</option>
                              </Form.Select>
                              <Form.Control.Feedback type="invalid"> {errors.city} </Form.Control.Feedback>
                            </Form.Group>
                          </div> */}

                          <div className="col-lg-7 col-md-12 col-sm-12">
                            <Form.Group className="businessListingFormsDiv" controlId="description" >
                              <Form.Label>DESCRIPTION</Form.Label>
                              <Form.Control  as="textarea" rows={ 4 }  name="description" value={formData.description} onChange={handleChange}  placeholder="Tell us about your Business, Product, or Services" isInvalid={!!errors.description} />
                              <Form.Control.Feedback type="invalid">  {errors.description} </Form.Control.Feedback>
                            </Form.Group>
                          </div>

                          {/* Conditionally display the Percentage of Stake field */}
                          {formData.listing_type === "Seeking Investment" && (
                            <div className="col-7">
                              <Form.Group  className="businessListingFormsDiv" controlId="description" >
                                <Form.Label>Percentage of Stake:</Form.Label>
                                <span className="vallidateRequiredStar">*</span>
                                <Form.Control type="text" name="percentage_of_stake"  value={formData.percentage_of_stake}  onChange={handleChange}  placeholder="Percentage of stake" isInvalid={!!errors.percentage_of_stake} />
                                <Form.Control.Feedback type="invalid"> {errors.percentage_of_stake} </Form.Control.Feedback>
                              </Form.Group>
                            </div>
                          )}

                          {/* <div className="col-lg-7 col-md-12 col-sm-12">
                            <Form.Group className="businessListingFormsDiv" controlId="reportedTurnover" >
                              <Form.Label>TURNOVER RANGE (Yearly)</Form.Label>
                              <span className="vallidateRequiredStar">*</span>
                              <div className="d-flex gap-3">
                                <div className="turnover_range">
                                  <Form.Control type="number" name="reported_turnover_from" value={formData.reported_turnover_from} onChange={handlepriceChange}  placeholder="Eg: 1,00,000"  isInvalid={!!errors.reported_turnover_from}  className="no-spinner"  />
                                  <Form.Control.Feedback type="invalid"> {errors.reported_turnover_from} </Form.Control.Feedback>
                                </div>
                                <span>TO</span>
                                <div className="flex-column">
                                <Form.Control  type="number"  name="reported_turnover_to"  value={formData.reported_turnover_to}  onChange={handlepriceChange}  placeholder="Eg: 1,50,000"  isInvalid={!!errors.reported_turnover_to} className="no-spinner"  />
                                <Form.Control.Feedback type="invalid"> {errors.reported_turnover_to} </Form.Control.Feedback>
                                </div>
                              </div>
                              <div>
                                
                              </div>
                            </Form.Group>
                          </div> */}
                          <div className="col-lg-7 col-md-12 col-sm-12">
                            <Form.Group className="businessListingFormsDiv" controlId="reportedTurnover" >
                              <Form.Label>TURNOVER RANGE (Yearly)</Form.Label>
                              <span className="vallidateRequiredStar">*</span>
                              <div className="d-flex gap-3">
                                <div className="turnover_range">
                                  <Form.Control type="text" name="reported_turnover_from" value={formatNumberWithCommas(formData.reported_turnover_from)} onChange={handlepriceChange}  placeholder="Eg: 1,00,000"  isInvalid={!!errors.reported_turnover_from}  className="no-spinner"  />
                                  <Form.Control.Feedback type="invalid"> {errors.reported_turnover_from} </Form.Control.Feedback>
                                </div>
                                <span>TO</span>
                                <div className="flex-column">
                                <Form.Control  type="text"  name="reported_turnover_to"  value={formatNumberWithCommas(formData.reported_turnover_to)}  onChange={handlepriceChange}  placeholder="Eg: 1,50,000"  isInvalid={!!errors.reported_turnover_to} className="no-spinner"  />
                                <Form.Control.Feedback type="invalid"> {errors.reported_turnover_to} </Form.Control.Feedback>
                                </div>
                              </div>
                              <div>
                                
                              </div>
                            </Form.Group>
                          </div>

                          <div className="col-lg-7 col-md-12 col-sm-12">
                            <Form.Group className="businessListingFormsDiv" controlId="ebitdaMargin" >
                              <Form.Label> EBITDA MARGIN (PROFIT PERCENTAGE)  </Form.Label>
                              <Form.Select  name="ebitda_margin"  value={formData.ebitda_margin} onChange={handleChange}  aria-label="Select EBITDA Margin" >
                                <option value="">Select EBITDA Margin</option>
                                <option value="1% - 5%">1% - 5%</option>
                                <option value="5% - 10%">5% - 10%</option>
                                <option value="10% - 15%">10% - 15%</option>
                                <option value="15% - 20%">15% - 20%</option>
                                <option value="20% - 30%">20% - 30%</option>
                                <option value="30% - 40%">30% - 40%</option>
                                <option value="40% - 50%">40% - 50%</option>
                                <option value="50% - 60%">50% - 60%</option>
                                <option value="60% - 70%">60% - 70%</option>
                                <option value="70% - 80%">70% - 80%</option>
                                <option value="80% - 90%">80% - 90%</option>
                                <option value="90% - 99%">90% - 99%</option>
                              </Form.Select>
                            </Form.Group>
                          </div>

                          {/* <div className="col-lg-7 col-md-12 col-sm-12">
                            <Form.Group className="businessListingFormsDiv"  controlId="asking_price" >
                              <Form.Label>PRICE</Form.Label>
                              <span className="vallidateRequiredStar">*</span>
                              <Form.Control type="number"  name="asking_price" value={formData.asking_price} onChange={handlepriceChange} placeholder="Enter Asking Price"  isInvalid={!!errors.asking_price} className="no-spinner" />
                              <Form.Control.Feedback type="invalid"> {errors.asking_price} </Form.Control.Feedback></Form.Group>
                          </div> */}
                          <div className="col-lg-7 col-md-12 col-sm-12">
                          <Form.Group className="businessListingFormsDiv" controlId="asking_price">
        <Form.Label>PRICE</Form.Label>
        <span className="vallidateRequiredStar">*</span>
        <Form.Control
          type="text"  // Changed type to text
          name="asking_price"
          value={formatNumberWithCommas(formData.asking_price)} // Format with commas
          onChange={handlepriceChange} // Handle input change
          placeholder="Enter Asking Price"
          isInvalid={!!errors.asking_price}
          className="no-spinner"
        />
        <Form.Control.Feedback type="invalid"> {errors.asking_price} </Form.Control.Feedback>
      </Form.Group>
                          </div>

                          <div className="col-7 additionalDetails">
                            <h6>ADDITIONAL DETAILS</h6>
                          </div>

                          <div className="col-lg-12 col-md-12 col-sm-12">
                            <Form.Group className="businessListingFormsDiv" controlId="you_are" >
                              <Form.Label>YOU ARE?</Form.Label>
                              <span className="vallidateRequiredStar">*</span>
                              <div className="you-are-box-container">
                                {[  { value: "Business Owner", label: "Business Owner",  },
                                  {  value: "Representative",  label: "Representative", },
                                  {   value: "Business Broker", label: "Business Broker",  },
                                  { value: "Founder", label: "Founder" },
                                ].map((role) => (
                                  <div
                                    key={role.value}
                                    className={`you-are-box ${
                                      formData.you_are === role.value
                                        ? "selected"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        you_are: role.value,
                                      }))
                                    }
                                  >
                                    {role.label}
                                  </div>
                                ))}
                              </div>
                              {errors.you_are && (
                                <div className="invalid-feedback d-block"> {errors.you_are}  </div>
                              )}
                            </Form.Group>
                          </div>

                          <div className="col-lg-7 col-md-12 col-sm-12">
                            <Form.Group  className="businessListingFormsDiv"  controlId="yearEstablished" >
                              <Form.Label>YEAR OF ESTABLISHMENT</Form.Label>
                              <Form.Select  name="year_of_establishment"  value={formData.year_of_establishment} onChange={handleChange}  >
                                <option value="">Choose Year</option>
                                {[...Array(50)].map((_, i) => (
                                  <option key={i} value={2000 + i}>  {2000 + i}  </option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          </div>
                          <div className="col-lg-7 col-md-12 col-sm-12">
                            <Form.Group className="businessListingFormsDiv" controlId="no_of_employees" >
                              <Form.Label>NUMBER OF EMPLOYEES</Form.Label>
                              <Form.Control  type="text" name="no_of_employees"  value={formData.no_of_employees} onChange={handleChange} placeholder="Enter number of employees" isInvalid={!!errors.no_of_employees} maxLength={10} onKeyPress={(e) => {
                            // Allow only numbers
                            if (!/^[0-9]*$/.test(e.key)) {
                              e.preventDefault();
                            }
                          }} />
                              <Form.Control.Feedback type="invalid"> {errors.no_of_employees} </Form.Control.Feedback>
                            </Form.Group>
                          </div>

                          <div className="col-lg-7 col-md-12 col-sm-12">
                            <Form.Group className="businessListingFormsDiv"  controlId="business_link" >
                              <Form.Label>BUSINESS WEBSITE LINK</Form.Label>
                              <Form.Control type="text"  name="business_link"  value={formData.business_link} onChange={handleChange}  placeholder="Paste your website link here" isInvalid={!!errors.business_link}  />
                              <Form.Control.Feedback type="invalid"> {errors.business_link}</Form.Control.Feedback>
                            </Form.Group>
                          </div>

                          <div className="col-lg-7 col-md-12 col-sm-12">
                            <Form.Group  className="businessListingFormsDiv"  controlId="file_name" >
                              <Form.Label>CHOOSE IMAGES</Form.Label>
                              <span className="vallidateRequiredStar">*</span>
                              <Form.Control  type="file" name="file_name" multiple  onChange={handleChange}  accept="image/*" />
                              {errors.file_name && ( <p className="error-text">{errors.file_name}</p>   )}
                            </Form.Group>
                          </div>

                          <div className="col-lg-7 col-md-12 col-sm-12">
                            <Form.Group className="businessListingFormsRadioDiv">
                              <Form.Label>CURRENT STATUS</Form.Label>
                              <span className="vallidateRequiredStar">*</span>
                              <div className="businessListingFormsRadioDivMAIN">
                                <Form.Check type="radio" label="Running" name="current_status" id="current_statusRunning" value="Running" onChange={handleChange} />
                                <Form.Check type="radio" label="Closed" name="current_status" id="current_statusClosed" className="radio_space" value="Closed" onChange={handleChange} />
                              </div>
                              {errors.current_status && (
                                <div className="invalid-feedback d-block"> {errors.current_status} </div>
                              )}
                            </Form.Group>
                          </div>

                          <div className="col-lg-7 col-md-12 col-sm-12">
                            <Form.Group className="businessListingFormsDiv" controlId="phone_number"  >
                              <Form.Label>MOBILE NUMBER</Form.Label>
                              <span className="vallidateRequiredStar">*</span>
                              <Form.Control className="no-spinner" type="number" name="phone_number" value={formData.phone_number} onChange={handlepriceChange} placeholder="Enter Mobile Number" maxLength={10} isInvalid={!!errors.phone_number} />
                              <Form.Control.Feedback type="invalid"> {errors.phone_number}</Form.Control.Feedback>
                            </Form.Group>
                          </div>
                        </>
                      )}

                      <div className="col-12 businesListingSubmitButton">
                        {step > 0 && (
                          <Button variant="secondary" onClick={handleBack} type="button"> Back  </Button>
                        )}
                        {step < steps.length - 1 && (
                          <Button variant="primary"  onClick={handleNext}  type="button" > Next </Button>
                        )}
                        {step === steps.length - 1 && (
                          <>
                          {/* <Button  variant="primary"  onClick={handlePayment}  type="submit" > Pay Now </Button> */}
                          {/* <Button
        variant="primary"
        onClick={formData.amount === 49 ? () => handlePaymentForBusiness() : handlePayment}
      >
        Pay Now
      </Button> */}
      <Button variant="primary" onClick={handlePayment} type="submit">
  Pay Now
</Button>

                          </>
                        )}
                      </div>
                      {step === steps.length - 1 && (

                        <> 
                           <div className="price_radio">
                           {amountError && <p style={{ color: "red", margin: "0px", padding: "0px" }}>{amountError}</p>}
                    {/* Radio button for Basic Listing */}
                    <div className="radio-item">
                      <label className="price-option">
                        <input
                          type="radio"
                          name="listingType"
                          value="299"
                          className="radio-input"
                          onChange={(e) => handleAmountChange(e)} // Handle amount change
                          checked={formData.amount === 299} // Set checked based on formData.amount
                        />
                        <div className="price-details">
                          <span className="price">₹299</span>
                          <div className="content">
                            <h3>Basic Listing</h3>
                            <p>Listing for Lifetime</p>
                          </div>
                        </div>
                      </label>
                    </div>

                    {/* Radio button for Basic Boost Listing */}
                    {/* <div className="radio-item">
                      <label className="price-option">
                        <input
                          type="radio"
                          name="listingType"
                          value="49"
                          className="radio-input"
                          onChange={(e) => handleAmountChange(e)} 
                          checked={formData.amount === 49}
                        />
                        <div className="price-details">
                          <span className="price">₹49</span>
                          <div className="content">
                            <h3>Basic Boost Listing (for 1 week)</h3>
                            <p>Promotion Listing to Attract More Buyers</p>
                          </div>
                        </div>
                      </label>
                    </div> */}
                  </div>
                  </>
                   
                      )}
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default SellBusinessForm;
