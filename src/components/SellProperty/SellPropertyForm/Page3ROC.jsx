import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { Stepper, Step, StepLabel } from "@mui/material";
import "./SellPropertyForm.css";
import {  fetchCountryRes, fetchStateApiRes, fetchCityApiRes } from "../../../API/apiServices";
import { IoLocation } from "react-icons/io5";

const Page3ROC = ({ formData, setFormData, errors, setErrors }) => {

   const [countries, setCountries] = useState([]);
          
          const [states, setStates] = useState([]);
          const [selectedCountryId, setSelectedCountryId] = useState("");
        
          const [cities, setCities] = useState([]); // For city options
        const [selectedStateId, setSelectedStateId] = useState("");
      
        
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

  // const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
  };

  const handlecountryInputChange = (e) => {
    const { name, value } = e.target;
    
    // Specific logic for country selection if needed
    console.log(`Country selected: ${value}`);

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
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
    if (name === "asking_price" || name === "advance_price" ) {
      // Format numbers with commas for specific fields
      rawValue = formatNumberWithCommas(rawValue);
    }
  
    // Update the formData state
    setFormData((prevState) => ({
      ...prevState,
      [name]: rawValue,
    }));
  };

  return (
    <>
      

      <div className="col-7">
        <Form.Group className="businessListingFormsDiv" controlId="additional_detail">
          <Form.Label>Additional details</Form.Label>
          <Form.Control
            type="text"
            name="additional_detail"
            placeholder="Eg: Profitable retail space for sale in delhi.."
            value={formData.additional_detail}
            onChange={handleChange}
        
          />
         
        </Form.Group>
      </div>

      <div className="col-7">
        <Form.Group className="businessListingFormsDiv" controlId="file_name">
          <Form.Label>CHOOSE IMAGES</Form.Label>
          <span className="vallidateRequiredStar">*</span>
          <Form.Control
            type="file"
            name="file_name"
            multiple // Allow multiple files
            accept="image/*" // Only allow image files
            onChange={handleChange}
          />
          {errors?.file_name && (  <small className="text-danger">{errors.file_name}</small>  )}
        </Form.Group>
      </div>

      {/* <div className="col-12">
  <Form.Group className="businessListingFormsDiv" controlId="country">
    <Form.Label>COUNTRY</Form.Label>
    <span className="vallidateRequiredStar">*</span>
    <div className="country-options">
      {["India", "USA", "UK"].map((country) => (
        <div
          key={country}
          className={`country-option-box ${
            formData.country === country ? "selected" : ""
          }`}
          onClick={() => handlecountryInputChange({ target: { name: "country", value: country } })}
        >
          {country}
        </div>
      ))}
    </div>
   
    {errors?.country && (
      <small className="text-danger">{errors.country}</small>
    )}
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
        <Form.Group className="businessListingFormsDiv" controlId="state">
          <Form.Label>STATE</Form.Label>
          <span className="vallidateRequiredStar">*</span>
          <Form.Select
            name="state"
            value={formData.state}
            onChange={handleChange}
        
          >
            <option value="">Select State</option>
            <option value="maharashtra">Maharashtra</option>
            <option value="karnataka">Karnataka</option>
            <option value="kerala">Kerala</option>
            <option value="punjab">Punjab</option>
          </Form.Select>
          {errors?.state && (
            <small className="text-danger">{errors.state}</small>
          )}
        </Form.Group>
      </div>

      <div className="col-7">
        <Form.Group className="businessListingFormsDiv" controlId="city">
          <Form.Label>TOWN/CITY</Form.Label>
          <span className="vallidateRequiredStar">*</span>
          <Form.Select
            name="city"
            value={formData.city}
            onChange={handleChange}
          
          >
            <option value="">Select City</option>
            <option value="mumbai">Mumbai</option>
            <option value="bengaluru">Bengaluru</option>
            <option value="delhi">Delhi</option>
            <option value="hyderabad">Hyderabad</option>
          </Form.Select>
          {errors?.city && (
            <small className="text-danger">{errors.city}</small>
          )}
        </Form.Group>
      </div> */}

         {/* <div className="col-7">
                            <Form.Group className="businessListingFormsDiv" controlId="state">
                              <Form.Label>STATE</Form.Label>
                              <span className="vallidateRequiredStar">*</span>
                              <Form.Control
                                type="text"
                                name="state"
                                placeholder="Enter State"
                                value={formData.state}
                                onChange={handleChange}
                                isInvalid={!!errors.state}
                              />
                              <Form.Control.Feedback type="invalid">{errors.state}</Form.Control.Feedback>
                            </Form.Group>
                          </div>
      
                          <div className="col-7">
                            <Form.Group className="businessListingFormsDiv" controlId="city">
                              <Form.Label>TOWN/CITY</Form.Label>
                              <span className="vallidateRequiredStar">*</span>
                              <Form.Control
                                type="text"
                                name="city"
                                placeholder="Enter City"
                                value={formData.city}
                                onChange={handleChange}
                                isInvalid={!!errors.city}
                              />
                              <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
                            </Form.Group>
                          </div> */}
      

      {/* <div className="col-7">
        <Form.Group controlId="asking_price" className="businessListingFormsDiv">
          {formData.listing_type === "Selling" && (
                     <>
                       <Form.Label>
                         PRICE<span className="vallidateRequiredStar">*</span>
                       </Form.Label>
                     </>
                 )}
                 {formData.listing_type === "Renting" && (
                   <>
                     <Form.Label>
                       Rent<span className="vallidateRequiredStar">*</span>
                     </Form.Label>
                   </>
                 )}
       
          <Form.Control
            type="text"
            name="asking_price"
            value={formData.asking_price}
            onChange={handleChange}
            placeholder="Enter Asking Price"
          
            onKeyPress={(e) => {
              // Allow only numbers
              if (!/^[0-9]*$/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />
                {errors?.asking_price && (
                  <small className="text-danger">{errors.asking_price}</small>
                )}
        </Form.Group>
      </div>

      {formData.listing_type === "Renting" &&(
      <div className="col-7">
        <Form.Group controlId="advance_price" className="businessListingFormsDiv">
          <Form.Label> Advance</Form.Label>
          <span className="vallidateRequiredStar">*</span>
          <Form.Control
            type="text"
            name="advance_price"
            value={formData.advance_price}
            onChange={handleChange}
            placeholder="Enter Advance Price"
           
            onKeyPress={(e) => {
              // Allow only numbers
              if (!/^[0-9]*$/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />
                {errors?.advance_price && (
                  <small className="text-danger">{errors.advance_price}</small>
                )}
        </Form.Group>
      </div>
)} */}

<div className="col-7">
        <Form.Group controlId="asking_price" className="businessListingFormsDiv">
          {formData.listing_type !== "Renting"  && (
                     <>
                       <Form.Label>
                         PRICE<span className="vallidateRequiredStar">*</span>
                       </Form.Label>
                     </>
                 )}
                 {formData.listing_type === "Renting" && (
                   <>
                     <Form.Label>
                       Rent<span className="vallidateRequiredStar">*</span>
                     </Form.Label>
                   </>
                 )}
       
          <Form.Control
            type="text"
            name="asking_price"
            value={formatNumberWithCommas(formData.asking_price)}
            onChange={handlepriceChange}
            placeholder="Enter Asking Price"
          
            onKeyPress={(e) => {
              // Allow only numbers
              if (!/^[0-9]*$/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />
                {errors?.asking_price && (
                  <small className="text-danger">{errors.asking_price}</small>
                )}
        </Form.Group>
      </div>

      {formData.listing_type === "Renting" &&(
      <div className="col-7">
        <Form.Group controlId="advance_price" className="businessListingFormsDiv">
          <Form.Label> Advance</Form.Label>
          <span className="vallidateRequiredStar">*</span>
          <Form.Control
            type="text"
            name="advance_price"
            value={formatNumberWithCommas(formData.advance_price)}
            onChange={handlepriceChange}
            placeholder="Enter Advance Price"
           
            onKeyPress={(e) => {
              // Allow only numbers
              if (!/^[0-9]*$/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />
                {errors?.advance_price && (
                  <small className="text-danger">{errors.advance_price}</small>
                )}
        </Form.Group>
      </div>
)}
      <div className="col-7">
              <Form.Group controlId="phone_number" className="businessListingFormsDiv">
                <Form.Label>Mobile number</Form.Label> <span className="vallidateRequiredStar">*</span>
                <Form.Control 
                  type="text" 
                  name="phone_number" 
                  value={formData.phone_number} 
                  onChange={handleChange} 
                  placeholder="Enter Mobile Number" 
                
                  onKeyPress={(e) => {
                    // Allow only numbers
                    if (!/^[0-9]*$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
               {errors?.phone_number && (
                  <small className="text-danger">{errors.phone_number}</small>
                )}
              </Form.Group>
        </div>
        <div className="col-2 preview-container-property">
                          {/* Live Preview Box */}
                          <h1>LIVE PREVIEW</h1>
                                         <div className="preview-box-property">
                          <div className="preview-image-property">
                            <img 
                              src={ formData.file_name ? URL.createObjectURL(formData.file_name) :  "default-image-url.jpg"} 
                              alt="Business Preview" 
                            
                            />
                          </div>
                          <div className="preview-title-property">
                            <h5>{formData.property_title || "property Title"}</h5>
                          </div>
                          <div className="preview-details-property">
                        <span>
                          {formData.asking_price ? (
                            <>
                              <span className="price-label-property">Asking Price: ₹ </span>
                              <span className="value_pre">{formData.asking_price}</span>
                            </>
                          ) : (
                            "Price"
                          )}
                        </span>
                        <span className="type_business">{formData.listing_type || "Business Type"}</span>
                      </div>

                          <div className="preview-turnover-property">
                          <span className="price-label-property"> Property type: </span>
                        <span>{formData.property_type}</span>
                        </div>
                          <div className="preview-location-call-property" >
                            <span><IoLocation/>{formData.city || "City"}</span>
                            <span className="call-button">{formData.phone_number || "Call"}</span>
                          </div>
                        </div>
       </div>
    </>
  );
};

export default Page3ROC;
