import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Stepper, Step, StepLabel } from "@mui/material";
import "./SellPropertyForm.css";

const Page3ROC = ({ formData, setFormData, errors }) => {
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
          <Form.Control
            type="file"
            name="file_name"
            multiple // Allow multiple files
            accept="image/*" // Only allow image files
            onChange={handleChange}
          />
      
        </Form.Group>
      </div>

      <div className="col-12">
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

         <div className="col-7">
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
                          </div>
      

      <div className="col-7">
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
    </>
  );
};

export default Page3ROC;
