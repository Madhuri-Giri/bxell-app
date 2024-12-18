/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Stepper, Step, StepLabel } from "@mui/material";
import "./SellBusinessForm.css"; // Import the CSS file
import { useNavigate } from "react-router-dom";
import { submitSellBusinessForm } from "../../../API/apiServices";
import axios from "axios";

function SellBusinessForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const steps = ["Business Info", "Business Details"];
  const [paymentDetails, setPaymentDetails] = useState(null);
  const userId = localStorage.getItem("userLoginId");

  const [formData, setFormData] = useState({
    user_id: userId,
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

  const handlepriceChange = (e) => {
    const { name, value } = e.target;

    // Ensure only positive numbers are allowed
    if (
      name === "asking_price" ||
      name === "reported_turnover_from" ||
      name === "reported_turnover_to" ||
      name === "phone_number"
    ) {
      // Allow only positive integers or zero
      if (value === "" || /^[+]?\d+(\.\d+)?$/.test(value)) {
        setFormData((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      }
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





  // --------------  payment ------------

  const fetchPaymentDetails = async () => {
    try {
      // Fetch business ID from the submitted form
      const business_id = await submitSellBusinessForm(formData);
      const userId = localStorage.getItem("userLoginId");

      if (!userId || !business_id || !formData.amount) {
        throw new Error(
          "Login ID, Transaction Number, or Business ID is missing."
        );
      }

      const payload = {
        amount: formData.amount,
        user_id: userId,
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
        console.error("Error response data:", error.response.data);
      }
      alert("Failed to initiate payment. Please try again.");
      return null;
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      // Fetch payment details
      const paymentData = await fetchPaymentDetails();
      if (!paymentData) {
        alert("Failed to fetch payment details. Please try again.");
        return;
      }

      // Extract required data from the response
      const razorpay_order_id = paymentData.payment_details?.razorpay_order_id;
      const razorpay_key = paymentData.razorpay_key;
      const payment_details = paymentData.payment_details;

      // Validate payment data before proceeding
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

      console.log("Fetched payment details:", paymentData);

      // Razorpay payment options
      const options = {
        key: razorpay_key,
        amount: payment_details.amount * 100, // Convert to paise
        currency: "INR",
        order_id: razorpay_order_id,
        name: "SRN Infotech",
        description: "Business Purchase",
        image: "https://your-logo-url.com/logo.png",
        handler: async function (response) {
          console.log("Payment successful", response);
          try {
            await updateHandlePayment(
              response.razorpay_payment_id,
              payment_details.id
            );
            alert("Payment successful!");
          } catch (error) {
            console.error("Error during payment processing:", error.message);
            alert(
              "An error occurred while updating the payment status. Please contact support."
            );
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
        console.error(
          "Failed to update payment details. Status:",
          response.status,
          "Response:",
          errorText
        );
        throw new Error("Failed to update payment details.");
      }

      const data = await response.json();
      console.log("Update successful:", data);

      // Check payment status
      const status = data?.data?.status || "Unknown";
      console.log("Payment Status:", status);

      // Handle status and return immediately after each alert
      if (status === "Success") {
        alert("Payment successful and verified!");
        console.log("Payment completed successfully.");
        return; // Prevent further execution
      }

      if (status === "Pending") {
        alert(
          "Payment successful, but verification is pending. Please contact support."
        );
        console.warn("Payment verification is pending.");
        return; // Prevent further execution
      }

      if (status === "Failed") {
        alert("Payment verification failed. Please contact support.");
        console.error("Payment verification failed.");
        return; // Prevent further execution
      }
    } catch (error) {
      console.error("Error updating payment details:", error.message);
      alert(
        "An error occurred while updating the payment status. Please try again or contact support."
      );
      throw error; // Optional: To signal an error in higher-level logic
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
      const response = await submitSellBusinessForm(formData);
      alert(response.message || "Form submitted successfully!");
  
      // Reset form data after successful submission
      setFormData({
        user_id: userId,
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
        asking_price: "",
        phone_number: "",
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
            <div className="col-10">
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
                        <div className="col-7">
                          <Form.Group className="businessListingFormsDiv" controlId="businessType">
                            <Form.Label>BUSINESS TYPE</Form.Label>
                            <span className="validateRequiredStar">*</span>
                            <Form.Select
                              name="business_type"
                              value={formData.business_type}
                              onChange={handleChange}
                              isInvalid={!!errors.business_type}
                            >
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
                            <Form.Control.Feedback type="invalid">
                              {errors.business_type}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </div>

                        <div className="col-7">
                          <Form.Group className="businessListingFormsDiv" controlId="listingType">
                            <Form.Label>LISTING TYPE</Form.Label>
                            <span className="validateRequiredStar">*</span>
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

                        <div className="col-7">
                          <Form.Group className="businessListingFormsDiv" controlId="title">
                            <Form.Label>TITLE</Form.Label>
                            <span className="validateRequiredStar">*</span>
                            <Form.Control
                              type="text"
                              name="title"
                              value={formData.title}
                              onChange={handleChange}
                              placeholder="Business Title (Eg: Best Restaurant for sale)"
                              isInvalid={!!errors.title}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.title}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </div>
                        </>
                    )}
                      {step === 1 && (
                        <>
                          <div className="col-7">
                            <Form.Group className="businessListingFormsDiv" controlId="country">
                              <Form.Label>COUNTRY</Form.Label>
                              <span className="vallidateRequiredStar">*</span>
                              <div className="country-box-container">
                                {["INDIA", "USA", "UK"].map((country) => (
                                  <div
                                    key={country}
                                    className={`country-box ${formData.country === country ? "selected" : ""}`}
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
                          </div>


                          <div className="col-7">
                            <Form.Group
                              className="businessListingFormsDiv"
                              controlId="state"
                            >
                              <Form.Label>STATE</Form.Label>
                              <span className="vallidateRequiredStar">*</span>
                              <Form.Select
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                isInvalid={!!errors.state}
                              >
                                <option value="">Select State</option>
                                <option value="Maharashtra">Maharashtra</option>
                                <option value="Karnataka">Karnataka</option>
                                <option value="Kerala">Kerala</option>
                                <option value="Punjab">Punjab</option>
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                {" "}
                                {errors.state}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </div>

                          <div className="col-7">
                            <Form.Group
                              className="businessListingFormsDiv"
                              controlId="city"
                            >
                              <Form.Label>TOWn/CITY</Form.Label>
                              <span className="vallidateRequiredStar">*</span>
                              <Form.Select
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                isInvalid={!!errors.city}
                              >
                                <option value="">Select City</option>
                                <option value="Mumbai">Mumbai</option>
                                <option value="Bengaluru">Bengaluru</option>
                                <option value="Delhi">Delhi</option>
                                <option value="Hyderabad">Hyderabad</option>
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                {errors.city}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </div>

                          <div className="col-7">
                            <Form.Group
                              className="businessListingFormsDiv"
                              controlId="description"
                            >
                              <Form.Label>DESCRIPTION</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={
                                  4
                                } /* Sets the textarea to display 4 lines */
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Tell us about your Business, Product, or Services"
                                isInvalid={!!errors.description}
                              />
                              <Form.Control.Feedback type="invalid">
                             
                                {errors.description}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </div>

                          {/* Conditionally display the Percentage of Stake field */}
                          {formData.listing_type === "Seeking Investment" && (
                            <div className="col-7">
                              <Form.Group
                                className="businessListingFormsDiv"
                                controlId="description"
                              >
                                <Form.Label>Percentage of Stake:</Form.Label>
                                <span className="vallidateRequiredStar">*</span>
                                <Form.Control
                                  type="text"
                                  name="percentage_of_stake"
                                  value={formData.percentage_of_stake}
                                  onChange={handleChange}
                                  placeholder="Percentage of stake"
                                  isInvalid={!!errors.percentage_of_stake}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {" "}
                                  {errors.percentage_of_stake}{" "}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </div>
                          )}

                          <div className="col-7">
                            <Form.Group
                              className="businessListingFormsDiv"
                              controlId="asking_price"
                            >
                              <Form.Label>PRICE</Form.Label>
                              <span className="vallidateRequiredStar">*</span>
                              <Form.Control
                                type="number"
                                name="asking_price"
                                value={formData.asking_price}
                                onChange={handlepriceChange}
                                placeholder="Asking Price"
                                isInvalid={!!errors.asking_price}
                                className="no-spinner"
                              />
                              <Form.Control.Feedback type="invalid">
                                {" "}
                                {errors.asking_price}{" "}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </div>

                          <div className="col-7">
                            <Form.Group
                              className="businessListingFormsDiv"
                              controlId="reportedTurnover"
                            >
                              <Form.Label>TURNOVER RANGE (Yearly)</Form.Label>
                              <span className="vallidateRequiredStar">*</span>
                              <div className="d-flex gap-3">
                                <Form.Control
                                  type="number"
                                  name="reported_turnover_from"
                                  value={formData.reported_turnover_from}
                                  onChange={handlepriceChange}
                                  placeholder="Eg: 1,00,000"
                                  isInvalid={!!errors.reported_turnover_from}
                                  className="no-spinner"
                                />
                                <span>TO</span>
                                <Form.Control
                                  type="number"
                                  name="reported_turnover_to"  value={formData.reported_turnover_to}  onChange={handlepriceChange}  placeholder="Eg: 1,50,000"  isInvalid={!!errors.reported_turnover_to} className="no-spinner"  />
                              </div>
                              <div>
                                {errors.reported_turnover_from && (
                                  <Form.Control.Feedback type="invalid"> {errors.reported_turnover_from} </Form.Control.Feedback>
                                )}
                                {errors.reported_turnover_to && (
                                  <Form.Control.Feedback type="invalid"> {errors.reported_turnover_to} </Form.Control.Feedback>
                                )}
                              </div>
                            </Form.Group>
                          </div>

                          <div className="col-7">
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

                          <div className="col-7 additionalDetails">
                            <h6>ADDITIONAL DETAILS</h6>
                          </div>

                          <div className="col-7">
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

                          <div className="col-7">
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
                          <div className="col-7">
                            <Form.Group className="businessListingFormsDiv" controlId="no_of_employees" >
                              <Form.Label>NUMBER OF EMPLOYEES</Form.Label>
                              <Form.Control  type="number" name="no_of_employees"  value={formData.no_of_employees} onChange={handleChange} placeholder="Enter number of employees" isInvalid={!!errors.no_of_employees} maxLength={10}  />
                              <Form.Control.Feedback type="invalid"> {errors.no_of_employees} </Form.Control.Feedback>
                            </Form.Group>
                          </div>

                          <div className="col-7">
                            <Form.Group className="businessListingFormsDiv"  controlId="business_link" >
                              <Form.Label>BUSINESS WEBSITE LINK</Form.Label>
                              <Form.Control type="text"  name="business_link"  value={formData.business_link} onChange={handleChange}  placeholder="Paste your website link here" isInvalid={!!errors.business_link}  />
                              <Form.Control.Feedback type="invalid"> {errors.business_link}</Form.Control.Feedback>
                            </Form.Group>
                          </div>

                          <div className="col-7">
                            <Form.Group  className="businessListingFormsDiv"  controlId="file_name" >
                              <Form.Label>CHOOSE IMAGES</Form.Label>
                              <Form.Control  type="file" name="file_name" multiple  onChange={handleChange}  accept="image/*" />
                              {errors.file_name && ( <p className="error-text">{errors.file_name}</p>   )}
                            </Form.Group>
                          </div>

                          <div className="col-7">
                            <Form.Group className="businessListingFormsRadioDiv">
                              <Form.Label>CURRENT STATUS</Form.Label>
                              <span className="vallidateRequiredStar">*</span>
                              <div className="businessListingFormsRadioDivMAIN">
                                <Form.Check type="radio" label="Running" name="current_status" id="current_statusRunning" value="Running" onChange={handleChange} />
                                <Form.Check type="radio" label="Closed" name="current_status" id="current_statusClosed" className="radio_space" value="closed" onChange={handleChange} />
                              </div>
                              {errors.current_status && (
                                <div className="invalid-feedback d-block"> {errors.current_status} </div>
                              )}
                            </Form.Group>
                          </div>

                          <div className="col-7">
                            <Form.Group className="businessListingFormsDiv" controlId="phone_number"  >
                              <Form.Label>MOBILE NUMBER</Form.Label>
                              <span className="vallidateRequiredStar">*</span>
                              <Form.Control className="no-spinner" type="number" name="phone_number" value={formData.phone_number} onChange={handlepriceChange} placeholder="Mobile Number" maxLength={10} isInvalid={!!errors.phone_number} />
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
                          <Button  variant="primary"  onClick={handlePayment}  type="submit" > Pay Now </Button>
                        )}
                      </div>
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
