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
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function SellPropertyForm() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const steps = ["Property Info", "Property Details", "Confirmation"];
  const [property_type, setPropertyType] = useState("");
  const [listing_type, setListingType] = useState("");
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [errors, setErrors] = useState({});
  const user = useSelector((state) => state.auth.user);
  const [amountError, setAmountError] = useState(""); // For displaying error messages
 const [formSubmitting, setFormSubmitting] = useState(false);

  const [formData, setFormData] = useState({
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
    phone_number: "",
    amount: "",
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

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
  };

  const handleListingTypeChange = (type) => {
    setListingType(type);
    setFormData((prevFormData) => ({
      ...prevFormData,
      listing_type: type, // Update listing_type in formData
    }));
  };

  const handleNext = () => {
    const currentErrors = { ...errors };

    // Validate required fields
    if (!formData.listing_type)
      currentErrors.listing_type = "Please select a listing type";
    else currentErrors.listing_type = "";

    if (!formData.property_type)
      currentErrors.property_type = "Please select a property type";
    else currentErrors.property_type = "";

    if (!formData.property_title)
      currentErrors.property_title = "Please enter property title";
    else currentErrors.property_title = "";

    setErrors(currentErrors);

    // If no errors, move to the next step
    if (
      !currentErrors.listing_type &&
      !currentErrors.property_type &&
      !currentErrors.property_title
    ) {
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
  const handleAmountChange = (e) => {
    const selectedAmount = e.target.value;
    setFormData(prevFormData => ({
      ...prevFormData,
      amount: parseInt(selectedAmount), // Set the selected amount in formData
    }));
  };
  // ---------------- RozarPay Payment Gateway Integration start -------------------
  const fetchPaymentDetails = async () => {
    try {
      if (!user || !formData.amount) {
        throw new Error("Login ID, amount or Business ID is missing.");
      }
  
      const payload = {
        amount: formData.amount,
        user_id: user,
      };
  
      const response = await axios.post(
        "https://bxell.com/bxell/admin/api/create-business-payment",
        payload
      );
  
      if (response.data.result === true && response.data.status === 200) {
        setPaymentDetails(response.data.payment_details);
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch payment details");
      }
    } catch (error) {
      console.error("Error fetching payment details:", error.message);
      toast.error(error.message || "Failed to initiate payment. Please try again.");
      return null;
    }
  };
  
  const handlePayment = async (e) => {
    e.preventDefault();
  
    // Reset the error message
    setAmountError("");
  
    if (!user) {
      navigate("/login");
      return;
    }
  
    if (!formData.amount) {
      setAmountError("Please select an amount to proceed.");
      return; // Stop further execution
    }
  
    if (formSubmitting) return; // Prevent multiple submissions
    setFormSubmitting(true);
  
    try {
      const paymentData = await fetchPaymentDetails();
      if (!paymentData) {
        setFormSubmitting(false);
        return;
      }
  
      const { razorpay_order_id, razorpay_key, payment_details } = paymentData;
  
      const options = {
        key: razorpay_key,
        amount: payment_details.amount * 100,
        currency: "INR",
        order_id: razorpay_order_id,
        name: "SRN Infotech",
        description: "Business Purchase",
        image: "https://your-logo-url.com/logo.png",
        handler: async function (response) {
          toast.success("Payment successful!");
          try {
            const formSubmissionData = await handleSubmit(e, payment_details.id);
            if (formSubmissionData) {
              const isPaymentUpdated = await updateHandlePayment(
                response.razorpay_payment_id,
                payment_details.id
              );
  
              if (isPaymentUpdated) {
                toast.success("Payment update successful!");
              }
            }
          } catch (error) {
            console.error("Error during form submission or payment update:", error.message);
            toast.error("Form submission failed or payment verification failed. Please try again.");
          } finally {
            setFormSubmitting(false);
          }
        },
  
        prefill: {
          name: paymentData.user_details.name || "User Name",
          email: paymentData.user_details.email || "user@example.com",
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
        setFormSubmitting(false);
        toast.error(`Payment failed: ${response.error.description}`);
      });
  
      rzp1.open();
    } catch (error) {
      console.error("Error during payment setup:", error.message);
      toast.error("An error occurred during payment setup. Please try again.");
      setFormSubmitting(false);
    }
  };
  
  
  const handleSubmit = async (e, paymentId) => {
    e.preventDefault();
  
    // Validate the form before submission
    if (!formData.amount) {
      setErrors({ amount: "Amount is required" });
      toast.error("Please fill in all required fields.");
      return null;
    }
  
    try {
      const updatedFormData = {
        ...formData,
        payment_id: paymentId,
      };
  
      const response = await submitSellPropertyForm(updatedFormData, user);
      toast.success(response.message || "Form submitted successfully!");
      setFormData({}); // Clear form data after submission
      navigate("/");
  
      // Return successful form submission data
      return response;
    } catch (error) {
      console.error("Error submitting form:", error.message);
      const apiErrors = error.response?.data?.error || {};
      setErrors(apiErrors);
      toast.error("Failed to submit the form. Please try again.");
      return null;
    }
  };
  
  const updateHandlePayment = async (razorpay_payment_id, Id) => {
    try {
      if (!razorpay_payment_id || !Id) {
        throw new Error("Missing payment details");
      }
  
      const payload = {
        payment_id: razorpay_payment_id,
        id: Id,
      };
  
      const response = await fetch(
        "https://bxell.com/bxell/admin/api/update-business-payment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update payment details");
      }
  
      const data = await response.json();
      console.log("Payment status updated:", data);
      return true;
    } catch (error) {
      console.error("Error updating payment:", error.message);
      toast.error(error.message || "An error occurred during payment verification.");
      return false;
    }
  };
  
  
  

  return (
    <section className="businessListingFormMAinSec">
      <div className="container">
        <div className="row businessListingFormMAinRow">
          <div className="col-10 property_width">
            <div className="businessListingFormMainBox">
              <div className="businessListingFormHed mb-4">
                <h4>SELLING PROPERTY FORM</h4>
              </div>

              <Stepper activeStep={step} className="stepper">
                {steps.map((label, index) => (
                  <Step key={index}>
                     <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Form>
                <div className="container profileForms mt-2">
                  <div className="row">
                    {step === 0 && (
                      <>
                        <div className="col-lg-12">
                          <Form.Group controlId="listing_type" className="businessListingFormsDiv propertyFormRadio" >
                            <Form.Label>Listing TYPE</Form.Label>
                            <span className="vallidateRequiredStar">*</span>
                            <div className="row">
                              <div className="mb-3 propertyTypeButtons property_space">
                                {["Selling", "Renting", "Leasing"].map(
                                  (type) => ( <Button key={type} type="button"  className={`btn btn-outline-primary propertyTypeButton ${ listing_type === type ? "active" : ""  }`} onClick={() => handleListingTypeChange(type) } > {type}  </Button>
                                  )
                                )}
                              </div>
                            </div>
                         {errors.listing_type && (<small className="text-danger"> {errors.listing_type}  </small> )}
                          </Form.Group>
                        </div>
                        <div className="col-lg-12">
                          <Form.Group  controlId="property_type" className="businessListingFormsDiv propertyFormRadio" >
                            <Form.Label>PROPERTY TYPE</Form.Label>
                            <span className="vallidateRequiredStar">*</span>
                            <div className="row">
                              <div className="mb-3 propertyTypeButtons property_space">
                                {[ "House",  "Apartment", "Retail Space", "Office Space", "Complex/Entire Property", "Land",  ].map((type) => (
                                  <Button key={type}  type="button" className={`btn btn-outline-primary propertyTypeButton ${  property_type === type ? "active" : "" }`}
                                    onClick={() => handlePropertyTypeChange(type) } >{type} </Button>
                                ))}
                              </div>
                            </div>
                        {errors.property_type && (<small className="text-danger"> {errors.property_type} </small>  )}
                          </Form.Group>
                        </div>

                        <div className="col-7">
                          <Form.Group className="businessListingFormsDiv" controlId="property_title" >
                            <Form.Label>TITLE</Form.Label>
                            <span className="vallidateRequiredStar">*</span>
                            <Form.Control type="text" name="property_title" placeholder="Title (e.g., RETAIL SPACE FOR SALE)"  value={formData.property_title} onChange={handleInputChange}  isInvalid={!!errors.property_title} />
                          
                            <Form.Control.Feedback type="invalid"> {errors.property_title} </Form.Control.Feedback> </Form.Group>
                        </div>

                        <div className="col-7 propertyListingSubmitButton">
                          <Button variant="" onClick={handleNext} type="button"> Next  </Button>
                        </div>
                      </>
                    )}

                    {step === 1 && (
                      <>
                        {property_type === "Land" && (
                          <Land formData={formData} setFormData={setFormData} handleChange={handleChange} errors={errors}  />
                        )}

                        {["House", "Apartment"].includes(property_type) && (
                          <HouseApartment formData={formData}  setFormData={setFormData} handleChange={handleChange} errors={errors}  />
                        )}

                        {[ "Retail Space", "Office Space",  "Complex/Entire Property", ].includes(property_type) && (
                          <RentalOfficeComplex  formData={formData} setFormData={setFormData} handleChange={handleChange} errors={errors} />
                        )}

                        <div className="col-12 propertyListingSubmitButton">
                          {step > 0 && (
                            <Button variant="secondary" onClick={handleBack} type="button" className="me-2" > Back </Button>
                          )}
                          <Button variant="primary" onClick={handleNext} type="button"> Next</Button>
                        </div>
                      </>
                    )}

                    {step === 2 && (
                      <>
                        {property_type === "Land" && (
                          <Page3Land formData={formData} setFormData={setFormData} handleChange={handleChange} errors={errors} />
                        )}
                        {["House", "Apartment"].includes(property_type) && (
                          <Page3Common formData={formData} setFormData={setFormData} handleChange={handleChange}  errors={errors} />
                        )}
                        {["Retail Space", "Office Space", "Complex/Entire Property",  ].includes(property_type) && (
                          <Page3ROC formData={formData} setFormData={setFormData} handleChange={handleChange}  errors={errors} />
                        )}

                        <div className="col-12 propertyListingSubmitButton">
                          {step > 0 && (
                            <Button variant="secondary" onClick={handleBack} type="button"  className="me-2" > Back </Button>
                          )}
                          <Button variant="primary" type="submit" onClick={handlePayment} > Pay Now  </Button>
                        </div>
                      </>
                    )}
                    
                     {step === steps.length -1 && (
                      <div className="price_radio">
                         {amountError && <p style={{ color: "red", margin: "0px", padding: "0px" }}>{amountError}</p>}
                    {/* Radio button for Basic Listing */}
                    <div className="radio-item">
                      <label className="price-option">
                        <input
                          type="radio"
                          name="listingType"
                          value="199"
                          className="radio-input"
                          onChange={(e) => handleAmountChange(e)} // Handle amount change
                          checked={formData.amount === 199} // Set checked based on formData.amount
                        />
                        <div className="price-details">
                          <span className="price">₹199</span>
                          <div className="content">
                            <h3>Basic Listing</h3>
                            <p>Listing for Lifetime</p>
                          </div>
                        </div>
                      </label>
                    </div>

                    {/* Radio button for Basic Boost Listing */}
                    <div className="radio-item">
                      <label className="price-option">
                        <input
                          type="radio"
                          name="listingType"
                          value="49"
                          className="radio-input"
                          onChange={(e) => handleAmountChange(e)} // Handle amount change
                          checked={formData.amount === 49} // Set checked based on formData.amount
                        />
                        <div className="price-details">
                          <span className="price">₹49</span>
                          <div className="content">
                            <h3>Basic Boost Listing  (for 1 week)</h3>
                            <p>Promotion Listing to Attract More Buyers</p>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
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
