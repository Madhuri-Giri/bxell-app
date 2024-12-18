import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Stepper, Step, StepLabel } from "@mui/material";
import "./SellPropertyForm.css";
import HouseApartment from "../SellPropertyForm/HouseApartment";
import RentalOfficeComplex from "../SellPropertyForm/RentalOfficeComplex";
import Land from "../SellPropertyForm/Land";
import Page3Land from "../SellPropertyForm/Page3Land";
import Page3Common from "../SellPropertyForm/Page3Common";
import Page3ROC from "../SellPropertyForm/Page3ROC";
import { submitSellPropertyForm } from "../../../API/apiServices";
import Swal from "sweetalert2";
import axios from "axios";

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function SellPropertyForm() {
  const [step, setStep] = useState(0);
  const steps = ["Property Info", "Property Details", "Confirmation"];
  const [property_type, setPropertyType] = useState("");
  const [listing_type, setListingType] = useState("");
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [errors, setErrors] = useState({});
  const userId = localStorage.getItem("userLoginId");

  const [formData, setFormData] = useState({
    user_id: userId ,
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
    phone_number: "",
    amount: 199,
    bedroom: "",
    bathroom: "",
    balcony: "",
    floor_no: "",
    additional_detail: "",
    project_status: "",
    total_floor: "",
    file_name: null,
  });

  const handlePropertyTypeChange = (type) => {
    setPropertyType(type);
    setFormData((prevFormData) => ({
      ...prevFormData,
      property_type: type, // Update property_type in formData
    }));
  };

  const handleListingTypeChange = (event) => {
    setListingType(event.target.value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      listing_type: event.target.value, // Update listing_type in formData
    }));
  };

  const handleNext = () => {
    const currentErrors = { ...errors };

    // Validate required fields
    if (!listing_type)
      currentErrors.listing_type = "Please select a listing type";
    else currentErrors.listing_type = "";

    if (!property_type)
      currentErrors.property_type = "Please select a property type";
    else currentErrors.property_type = "";

    setErrors(currentErrors);

    if (!currentErrors.property_type && !currentErrors.listing_type) {
      setStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
    }
  };

  const handleBack = () => setStep((prevStep) => Math.max(prevStep - 1, 0));

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Log formData to check if values are updating correctly
    console.log("Updated Form Data:", formData);

    setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
  };

  // ---------------- RozarPay Payment Gateway Integration start -------------------
  const fetchPaymentDetails = async () => {
    try {
      // Send the form data to get the property ID and user ID
      const property_id = await submitSellPropertyForm(formData);
      const userId = localStorage.getItem("userLoginId");
  
      if (!userId || !property_id || !formData.amount) {
        throw new Error("Login ID, Transaction Number, or Hotel Booking ID is missing.");
      }
  
      // Prepare the payload to fetch payment details
      const payload = {
        amount: formData.amount,
        user_id: userId,
        property_id: property_id,
      };
  
      console.log("Sending payload:", payload);
  
      // Send the request to your API to get payment details
      const response = await axios.post(
        "https://bxell.com/bxell/admin/api/create-property-payment",
        payload
      );
  
      // Check the response and return the payment details if successful
      if (response.data.status === "success" || response.data.message === "Intent Created Successfully") {
        setPaymentDetails(response.data.payment_details); // Update payment details in state
        console.log("Payment details fetched:", response.data);
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch payment details");
      }
    } catch (error) {
      console.error("Error fetching payment details:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
      }
      alert("Failed to initiate payment. Please try again.");
      return null;
    }
  };
  
  const handlePayment = async (e) => {
    e.preventDefault();
  
    try {
      // await handleSubmit(e); 
      // Fetch payment details
      const paymentData = await fetchPaymentDetails();
      if (!paymentData) return;
  
      const { razorpay_order_id, razorpay_key, payment_details } = paymentData;
  
      // Razorpay payment options
      const options = {
        key: razorpay_key, // Razorpay API key
        amount: payment_details.amount*100, // Convert amount to paise (Razorpay expects amount in paise)
        currency: "INR",
        order_id: razorpay_order_id, // The order ID from the API response
        name: "SRN Infotech", // Your company name
        description: "Property Purchase", // Description of the payment
        image: "https://your-logo-url.com/logo.png", // Your logo URL
        handler: async function (response) {
          // Handle successful payment
          console.log("Payment successful", response);
          try {
            // Update payment status after successful payment
            await updateHandlePayment(response.razorpay_payment_id, payment_details.id);
          } catch (error) {
            console.error("Error during payment processing:", error.message);
            alert("An error occurred during payment. Please try again.");
          }
        },
        prefill: {
          name: paymentData.user_details.name || "User Name", // Prefill user details
          email: paymentData.user_details.email || "user@example.com",
          contact: paymentData.user_details.phone_number || "9999999999",
        },
        notes: {
          address: "Some Address", // You can customize this if needed
        },
        theme: {
          color: "#3399cc", // Theme color
        },
      };
  
      // Initialize Razorpay checkout
      const rzp1 = new window.Razorpay(options);
  
      // Handle payment failure
      rzp1.on("payment.failed", function (response) {
        alert(`Payment failed: ${response.error.description}`);
      });
  
      // Open Razorpay payment modal
      rzp1.open();
    } catch (error) {
      console.error("Error during payment setup:", error.message);
      alert("An error occurred during payment setup. Please try again.");
    }
  };
  
// -------------- Update payment ------------
const updateHandlePayment = async (razorpay_payment_id, Id) => {
  try {
    if (!razorpay_payment_id || !Id) {
      throw new Error("Missing payment details");
    }

    const url = "https://bxell.com/bxell/admin/api/update-property-payment";
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

    // Check if response is successful
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to update payment details. Status:", response.status, "Response:", errorText);
      alert("Failed to update payment details. Please try again.");
      return;
    }

    // Parse the response body
    const data = await response.json();
    console.log("Response Data:", data);

    // Check if the status is in the result field
    const status = data?.success || data?.result || "Unknown"; // Update this line to check success or result
    console.log("Payment Status:", status);

    // Handle status based on response
    if (status === "Payment record update successfully") {
      alert("Payment successful and verified!");
      console.log("Payment completed successfully.");
    } else if (status === "Pending") {
      alert("Payment successful, but verification is pending. Please contact support.");
      console.warn("Payment verification is pending.");
    } else if (status === "Failed") {
      alert("Payment verification failed. Please contact support.");
      console.error("Payment verification failed.");
    } else {
      alert("Unexpected payment status. Please contact support.");
      console.warn("Unexpected payment status:", status);
    }

  } catch (error) {
    console.error("Error updating payment details:", error.message);
    alert("An error occurred while updating the payment status. Please try again or contact support.");
  }
};
                                                     
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data before submission:", formData); // Log data before submission

    try {
      const response = await submitSellPropertyForm(formData);
      console.log("API Response:", response);

      // Show SweetAlert success message
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Form submitted successfully!",
        confirmButtonText: "OK",
      });

      // Reset form data to initial state
      setFormData({
        user_id: userId,
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
    } catch (error) {
      console.error("Error response:", error.response?.data || error.message);
      if (error.response?.data?.error) {
        setErrors(error.response.data.error); // Set errors from the API response
      } else {
        // Show SweetAlert error message
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error submitting the form. Please try again later.",
          confirmButtonText: "OK",
        });
      }
    }
  };

  return (
    <section className="businessListingFormMAinSec">
      <div className="container">
        <div className="row businessListingFormMAinRow">
          <div className="col-10">
            <div className="businessListingFormMainBox">
              <div className="businessListingFormHed">
                <h4>SELLING PROPERTY FORM</h4>
              </div>

              <Stepper activeStep={step}>
                {steps.map((label, index) => (
                  <Step key={index}> <StepLabel>{label}</StepLabel> </Step>))}
              </Stepper>

              <Form>
                <div className="container profileForms">
                  <div className="row">
                    {step === 0 && (
                      <>
                        <div className="col-7">
                          <Form.Group controlId="listing_type" className="businessListingFormsDiv" >
                            <Form.Label>LISTING TYPE</Form.Label>
                            <Form.Select  value={listing_type} onChange={handleListingTypeChange} >
                              <option value="">Select Listing Type</option>
                              <option value="Selling">Selling</option>
                              <option value="Renting">Renting</option>
                              <option value="Leasing">Leasing</option>
                            </Form.Select>
                            {errors.listing_type && ( <small className="text-danger">  {errors.listing_type} </small>
                            )}
                          </Form.Group>
                        </div>

                        <div className="col-7">
                          <Form.Group  controlId="property_type"  className="businessListingFormsDiv propertyFormRadio" >
                            <Form.Label>PROPERTY TYPE</Form.Label>
                            <span className="vallidateRequiredStar">*</span>
                            <div className="row">
                              <div className="mb-3 propertyTypeButtons property_space col-3">
                                {[ "House", "Apartment",  "Retail Space", "Office Space", "Complex/Entire Property", "Land",  ].map((type) => (
                                  <Button  key={type} type="button"  className={`btn btn-outline-primary propertyTypeButton ${  property_type === type ? "active" : ""
                                    }`}
                                    onClick={() => handlePropertyTypeChange(type) } > {type} </Button> ))}
                              </div>
                            </div>
                            {errors.property_type && ( <small className="text-danger"> {errors.property_type}</small> )}
                          </Form.Group>
                        </div>

                        <div className="col-7 propertyListingSubmitButton">
                          <Button variant="" onClick={handleNext} type="button"> Next</Button>
                        </div>
                      </>
                    )}

                    {step === 1 && (
                      <>
                        {property_type === "Land" && (
                          <Land  formData={formData} setFormData={setFormData} handleChange={handleChange} errors={errors} />
                        )}

                        {["House", "Apartment"].includes(property_type) && (
                          <HouseApartment  formData={formData} setFormData={setFormData} handleChange={handleChange}  errors={errors} />
                        )}

                        {[  "Retail Space",  "Office Space",  "Complex/Entire Property",  ].includes(property_type) && (
                          <RentalOfficeComplex formData={formData} setFormData={setFormData}  handleChange={handleChange}  errors={errors} />
                        )}

                        <div className="col-12 propertyListingSubmitButton">
                          {step > 0 && (
                            <Button variant="secondary" onClick={handleBack}  type="button"  className="me-2" > Back </Button>
                          )}
                          <Button variant="primary" onClick={handleNext}  type="button"> Next </Button>
                        </div>
                      </>
                    )}

                    {step === 2 && (
                      <>
                        {property_type === "Land" && (
                          <Page3Land formData={formData} setFormData={setFormData}  />
                        )}
                        {["House", "Apartment"].includes(property_type) && (
                          <Page3Common formData={formData} setFormData={setFormData}  />
                        )}
                        {[  "Retail Space", "Office Space", "Complex/Entire Property",  ].includes(property_type) && (
                          <Page3ROC formData={formData} setFormData={setFormData} />
                        )}

                        <div className="col-12 propertyListingSubmitButton">
                          {step > 0 && (
                            <Button variant="secondary"  onClick={handleBack}  type="button" className="me-2" > Back  </Button>
                          )}
                          <Button variant="primary" type="submit"  onClick={handlePayment} >  Pay Now </Button>
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
  );
}

export default SellPropertyForm;
