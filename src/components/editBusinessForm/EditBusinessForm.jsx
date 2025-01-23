/* eslint-disable no-unused-vars */

import { Button, Form } from "react-bootstrap";
import { Stepper, Step, StepLabel } from "@mui/material";
import "./EditBusinessForm.css";
import { useNavigate } from "react-router-dom";
import {
  fetchEditBusinessForm,
  fetchCountryRes,
  fetchStateApiRes,
  fetchCityApiRes,
} from "../../API/apiServices";
import axios from "axios";
import { useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const EditBusinessForm = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation()
  const { type, id } = location.state;
  console.log("Type:", type, "ID:", id);
  const businessData = location.state?.businessData;

  if (!businessData) {
    return <p>No data available. Please go back and try again.</p>;
  }

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
  // const business_id = id;
  const [formData, setFormData] = useState({
    user_id: user,
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

  
  const [imagePreview, setImagePreview] = useState([]);

useEffect(() => {
  if (businessData) {

    let parsedImages = [];
    try {
      // Check if file_name is a JSON string
      parsedImages =
        typeof businessData.file_name === "string" &&
        businessData.file_name.trim().startsWith("[")
          ? JSON.parse(businessData.file_name)
          : Array.isArray(businessData.file_name)
          ? businessData.file_name
          : [businessData.file_name]; // Treat it as a single file name
    } catch (error) {
      console.error("Error parsing file_name:", error);
      parsedImages = [];
    }

    setImagePreview(parsedImages);

    setFormData({
      business_type: businessData.business_type || "",
      listing_type: businessData.listing_type || "",
      title: businessData.title || "",
      country: businessData.country || "",
      state: businessData.state || "",
      city: businessData.city || "",
      description: businessData.description || "",
      percentage_of_stake: businessData.percentage_of_stake || "",
      reported_turnover_from: businessData.reported_turnover_from || "",
      reported_turnover_to: businessData.reported_turnover_to || "",
      ebitda_margin: businessData.ebitda_margin || "",
      asking_price: businessData.asking_price || "",
      you_are: businessData.you_are || "",
      year_of_establishment: businessData.year_of_establishment || "",
      no_of_employees: businessData.no_of_employees || "",
      file_name: businessData.file_name || "",
      business_link: businessData.business_link || "",
      phone_number: businessData.phone_number || "",
      current_status: businessData.current_status || "",
    });

    // Pre-select the country
    const selectedCountry = countries.find(
      (country) => country.name.trim().toLowerCase() === businessData.country.trim().toLowerCase()
    );
    if (selectedCountry) {
      setSelectedCountryId(selectedCountry.id);

      // Fetch states for the selected country
      fetchStateApiRes(selectedCountry.id).then((stateData) => {
        setStates(stateData || []);

        // Pre-select the state
        const selectedState = stateData.find(
          (state) => state.name.trim().toLowerCase() === businessData.state.trim().toLowerCase()
        );
        if (selectedState) {
          setSelectedStateId(selectedState.id);

          // Update formData with the prefilled state
          setFormData((prev) => ({
            ...prev,
            state: selectedState.id, // Set the state ID
          }));

          // Fetch cities for the selected state
          fetchCityApiRes(selectedState.id).then((cityData) => {
            setCities(cityData || []);
          });
        }
      });
    }
  }
}, [businessData, countries]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatNumberWithCommas = (number) => {
    if (!number) return number;
    
    // Handle numbers with decimals
    let [integerPart, decimalPart] = number.toString().split('.');
    let formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
  };

   // Handle the price input change
   const handlepriceChange = (e) => {
    const { name, value } = e.target;
  
    // Remove non-numeric characters
    let rawValue = value.replace(/[^0-9]/g, ''); // Only digits allowed for phone numbers
  
    // Apply formatting based on the field name
    if (name === "asking_price" || name === "reported_turnover_from" || name === "reported_turnover_to") {
      // Format numbers with commas for specific fields
      rawValue = formatNumberWithCommas(rawValue);
    }
  
    // Update the formData state
    setFormData((prevState) => ({
      ...prevState,
      [name]: rawValue,
    }));
  };

  // Updated handleChange function
 
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

  const handleAmountChange = (e) => {
    const selectedAmount = e.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      amount: parseInt(selectedAmount), // Set the selected amount in formData
    }));
  };

  // --------------  payment ------------
  const UpdateForm = async (e) => {
    e.preventDefault();
  
    // Prepare FormData object
    const formDataObject = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "file_name" && Array.isArray(formData[key])) {
        // Append each file individually for file_name
        formData[key].forEach((file) => {
          formDataObject.append("file_name[]", file); // Use appropriate key for multiple files
        });
      } else {
        formDataObject.append(key, formData[key]);
      }
    });
  
    formDataObject.append("business_id", businessData.id); // Append business_id
  
    try {
      // Make the API call
      const response = await fetchEditBusinessForm(formDataObject);
      console.log("update edit ", response);
  
      if (response) {
        toast.success("Business form updated successfully!");
        navigate("/");
      }
    } catch (error) {
      setErrors(error.message);
      toast.error("Error updating the business form!");
    }
  };
  

  return (
    <>
    <Header />
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
                    <Step key={index}>
                      <StepLabel>{label}</StepLabel>{" "}
                    </Step>
                  ))}
                </Stepper>

                <Form>
                  <div className="container profileForms">
                    <div className="row">
                      {step === 0 && (
                        <>
                          <div className="col-lg-7 col-md-12 col-sm-12">
                            <Form.Group className="businessListingFormsDiv" controlId="businessType" >
                              <Form.Label>BUSINESS TYPE</Form.Label>
                              <span className="vallidateRequiredStar">*</span>
                            <Form.Select name="business_type" value={formData.business_type} onChange={handleChange} isInvalid={!!errors.business_type} >
                                <option value="">Select Business Type</option>
                                <option value="Manufacturing"> Manufacturing </option>
                                <option value="Retail">Retail</option>
                                <option value="Wholesaler">Wholesaler</option>
                                <option value="Agriculture">Agriculture</option>
                                <option value="Hospitality">Hospitality</option>
                                <option value="Transportation"> Transportation </option>
                                <option value="Logistics & Supply Chain"> Logistics & Supply Chain </option>
                                <option value="Real Estate">Real Estate</option>
                                <option value="IT & Software"> IT & Software </option>
                                <option value="Telecommunication"> Telecommunication </option>
                                <option value="E-commerce">E-commerce</option>
                                <option value="Education">Education</option>
                                <option value="Food & Beverage"> Food & Beverage </option>
                                <option value="Sports & Recreation"> Sports & Recreation </option>
                                <option value="Entertainment"> Entertainment </option>
                                <option value="Finance">Finance</option>
                                <option value="Media & Advertising">  Media & Advertising  </option>
                              </Form.Select>
                              <Form.Control.Feedback type="invalid"> {errors.business_type} </Form.Control.Feedback>
                            </Form.Group>
                          </div>

                          <div className="col-lg-12 col-md-12 col-sm-12">
                            <Form.Group className="businessListingFormsDiv" controlId="listingType" >
                              <Form.Label>LISTING TYPE</Form.Label>
                              <span className="vallidateRequiredStar">*</span>
                              <div className="listing-type-container">
                                {["Selling", "Franchising", "Seeking Investment",  ].map((type) => (
                                  <div key={type} className={`listing-type-box ${  formData.listing_type === type ? "selected"  : ""
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
                                <div className="error-message">  {errors.listing_type} </div>
                              )}
                            </Form.Group>
                          </div>

                          <div className="col-lg-7 col-md-12 col-sm-12">
                            <Form.Group className="businessListingFormsDiv" controlId="title" >
                              <Form.Label>TITLE</Form.Label>
                              <span className="vallidateRequiredStar">*</span>
                              <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Enter Business Title (Eg: Best Restaurant for sale)"  isInvalid={!!errors.title} />
                              <Form.Control.Feedback type="invalid">
                                {errors.title}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </div>
                        </>
                      )}
                      {step === 1 && (
                        <>
                     <div className="col-lg-7 col-md-12 col-sm-12">
                      <Form.Group className="businessListingFormsDiv" controlId="country">
                        <Form.Label>COUNTRY</Form.Label>
                        <span className="vallidateRequiredStar">*</span>
                        <div className="country-box-container">
                          {[
                            ...countries.filter((country) => country.id === selectedCountryId),
                            ...countries.filter((country) => country.id !== selectedCountryId),
                          ].map((country) => (
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

                            // Fetch cities for the selected state
                            fetchCityApiRes(stateId).then((cityData) => setCities(cityData || []));
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

                          <div className="col-lg-7 col-md-12 col-sm-12">
                            <Form.Group
                              className="businessListingFormsDiv"
                              controlId="description"
                            >
                              <Form.Label>DESCRIPTION</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={4}
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
                              
                                  {errors.percentage_of_stake}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </div>
                          )}

                          <div className="col-lg-7 col-md-12 col-sm-12">
                            <Form.Group
                              className="businessListingFormsDiv"
                              controlId="reportedTurnover"
                            >
                              <Form.Label>TURNOVER RANGE (Yearly)</Form.Label>
                              <span className="vallidateRequiredStar">*</span>
                              <div className="d-flex gap-3">
                                <div className="turnover_range">
                                  <Form.Control
                                    type="text"
                                    name="reported_turnover_from"
                                    value={formData.reported_turnover_from}
                                    onChange={handlepriceChange}
                                    placeholder="Eg: 1,00,000"
                                    isInvalid={!!errors.reported_turnover_from}
                                    className="no-spinner"
                                  />
                                  <Form.Control.Feedback type="invalid">
                                
                                    {errors.reported_turnover_from}
                                  </Form.Control.Feedback>
                                </div>
                                <span>TO</span>
                                <div className="flex-column">
                                  <Form.Control
                                    type="text"
                                    name="reported_turnover_to"
                                    value={formData.reported_turnover_to}
                                    onChange={handlepriceChange}
                                    placeholder="Eg: 1,50,000"
                                    isInvalid={!!errors.reported_turnover_to}
                                    className="no-spinner"
                                  />
                                  <Form.Control.Feedback type="invalid">
                                   
                                    {errors.reported_turnover_to}
                                  </Form.Control.Feedback>
                                </div>
                              </div>
                              <div></div>
                            </Form.Group>
                          </div>

                          <div className="col-lg-7 col-md-12 col-sm-12">
                            <Form.Group  className="businessListingFormsDiv" controlId="ebitdaMargin" >
                              <Form.Label> EBITDA MARGIN (PROFIT PERCENTAGE)  </Form.Label>
                              <Form.Select name="ebitda_margin" value={formData.ebitda_margin} onChange={handleChange} aria-label="Select EBITDA Margin" >
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

                          <div className="col-lg-7 col-md-12 col-sm-12">
                            <Form.Group className="businessListingFormsDiv" controlId="asking_price"  >
                              <Form.Label>PRICE</Form.Label>
                              <span className="vallidateRequiredStar">*</span>
                              <Form.Control type="text" name="asking_price" value={formData.asking_price}  onChange={handlepriceChange} placeholder="Enter Asking Price" isInvalid={!!errors.asking_price} className="no-spinner" />
                              <Form.Control.Feedback type="invalid"> {errors.asking_price} </Form.Control.Feedback>
                            </Form.Group>
                          </div>

                          <div className="col-7 additionalDetails">
                            <h6>ADDITIONAL DETAILS</h6>
                          </div>

                          <div className="col-lg-12 col-md-12 col-sm-12">
                            <Form.Group
                              className="businessListingFormsDiv"
                              controlId="you_are"
                            >
                              <Form.Label>YOU ARE?</Form.Label>
                              <span className="vallidateRequiredStar">*</span>
                              <div className="you-are-box-container">
                                {[
                                  {
                                    value: "Business Owner",
                                    label: "Business Owner",
                                  },
                                  {
                                    value: "Representative",
                                    label: "Representative",
                                  },
                                  {
                                    value: "Business Broker",
                                    label: "Business Broker",
                                  },
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
                                  >{role.label}
                                  </div>
                                ))}
                              </div>
                              {errors.you_are && ( <div className="invalid-feedback d-block"> {errors.you_are} </div> )}
                            </Form.Group>
                          </div>

                          <div className="col-lg-7 col-md-12 col-sm-12">
                            <Form.Group className="businessListingFormsDiv" controlId="yearEstablished" >
                              <Form.Label>YEAR OF ESTABLISHMENT</Form.Label>
                              <Form.Select name="year_of_establishment" value={formData.year_of_establishment} onChange={handleChange} >
                                <option value="">Choose Year</option>
                                {[...Array(50)].map((_, i) => (
                                  <option key={i} value={2000 + i}> {2000 + i}  </option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          </div>
                          <div className="col-lg-7 col-md-12 col-sm-12">
                            <Form.Group className="businessListingFormsDiv" controlId="no_of_employees"  >
                              <Form.Label>NUMBER OF EMPLOYEES</Form.Label>
                              <Form.Control type="text" name="no_of_employees" value={formData.no_of_employees} onChange={handleChange}  placeholder="Enter number of employees"  isInvalid={!!errors.no_of_employees}  maxLength={10}
                                onKeyPress={(e) => {
                                  // Allow only numbers
                                  if (!/^[0-9]*$/.test(e.key)) {
                                    e.preventDefault();
                                  }
                                }}
                              />
                              <Form.Control.Feedback type="invalid"> {errors.no_of_employees}  </Form.Control.Feedback>
                            </Form.Group>
                          </div>

                          <div className="col-lg-7 col-md-12 col-sm-12">
                            <Form.Group className="businessListingFormsDiv"  controlId="business_link" >
                              <Form.Label>BUSINESS WEBSITE LINK</Form.Label>
                              <Form.Control type="text" name="business_link" value={formData.business_link} onChange={handleChange}  placeholder="Paste your website link here"  isInvalid={!!errors.business_link} />
                              <Form.Control.Feedback type="invalid"> {errors.business_link} </Form.Control.Feedback>
                            </Form.Group>
                          </div>

                          <div className="col-lg-7 col-md-12 col-sm-12">
                            <Form.Group className="businessListingFormsDiv" controlId="file_name">
                              <Form.Label>CHOOSE IMAGES</Form.Label>
                              <Form.Control
  type="file"
  name="file_name"
  multiple
  onChange={(e) => {
    const files = Array.from(e.target.files); // Get the actual files
    setFormData((prev) => ({
      ...prev,
      file_name: files, // Store the files for submission
    }));

    const filePreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreview(filePreviews); // Show new image previews
  }}
  accept="image/*"
/>

                              {errors.file_name && <p className="error-text">{errors.file_name}</p>}
                            </Form.Group>
                          </div>

                          {/* Render the image previews */}
                          <div>
                            {imagePreview.map((url, index) => (
                              <img key={index} src={url} alt={`Image ${index}`} width="100" />
                            ))}
                          </div>


                          <div className="col-lg-7 col-md-12 col-sm-12">
                            <Form.Group className="businessListingFormsRadioDiv">
                              <Form.Label>CURRENT STATUS</Form.Label>
                              <span className="vallidateRequiredStar">*</span>
                              <div className="businessListingFormsRadioDivMAIN">
                              <Form.Check
                                type="radio"
                                label="Running"
                                name="current_status"
                                id="current_statusRunning"
                                value="Running"
                                checked={formData.current_status === "Running"}
                                onChange={handleChange}
                              />
                              <Form.Check
                                type="radio"
                                label="Closed"
                                name="current_status"
                                id="current_statusClosed"
                                value="Closed"
                                checked={formData.current_status === "Closed"}
                                onChange={handleChange}
                              />
                              </div>
                              {errors.current_status && ( <div className="invalid-feedback d-block"> {errors.current_status} </div> )}
                            </Form.Group>
                          </div>

                          <div className="col-lg-7 col-md-12 col-sm-12">
                            <Form.Group className="businessListingFormsDiv" controlId="phone_number"  >
                              <Form.Label>MOBILE NUMBER</Form.Label>
                              <span className="vallidateRequiredStar">*</span>
                              <Form.Control className="no-spinner" type="number" name="phone_number"  value={formData.phone_number}  onChange={handlepriceChange}  placeholder="Enter Mobile Number"  maxLength={10}  isInvalid={!!errors.phone_number}  />
                              <Form.Control.Feedback type="invalid"> {errors.phone_number}  </Form.Control.Feedback>
                            </Form.Group>
                          </div>
                        </>
                      )}

                      <div className="col-12 businesListingSubmitButton">
                        {step > 0 && (
                          <Button variant="secondary" onClick={handleBack} type="button" > Back </Button>
                        )}
                        {step < steps.length - 1 && (
                          <Button variant="primary" onClick={handleNext}  type="button" > Next </Button> )}
                           {step === steps.length - 1 && (
                              <Button  variant="primary" onClick={UpdateForm} type="button" >  Save Changes  </Button>
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
      <Footer />
    </>
  );
}




export default EditBusinessForm
