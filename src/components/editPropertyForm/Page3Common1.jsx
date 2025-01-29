import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { Stepper, Step, StepLabel } from "@mui/material";
import "./SellPropertyForm.css";
import {
  fetchCountryRes,
  fetchStateApiRes,
  fetchCityApiRes,
} from "../../API/apiServices";

const Page3Common1 = ({
  formData,
  setFormData,
  errors,
  selectedCountry,
  setSelectedCountry,
  selectedState,  imagePreview, setImagePreview,
}) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedStateId, setSelectedStateId] = useState("");
  const [selectedCountryId, setSelectedCountryId] = useState(""); // Track the selected country

  // Fetch countries on mount
  useEffect(() => {
    const getCountries = async () => {
      try {
        const data = await fetchCountryRes(); // Fetch your countries API here
        if (data && data.country) {
          setCountries(data.country);
          // Set the selected country from props if exists
          if (selectedCountry?.id) {
            setSelectedCountryId(selectedCountry.id);
            setFormData((prev) => ({
              ...prev,
              country: selectedCountry.name,
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    getCountries();
  }, [selectedCountry, setFormData]);

  // Fetch states based on selected country
  useEffect(() => {
    if (selectedCountryId) {
      const getStates = async () => {
        try {
          const stateData = await fetchStateApiRes(selectedCountryId); // Fetch state data API
          setStates(stateData || []);
        } catch (error) {
          console.error("Error fetching states:", error);
        }
      };

      getStates();
    } else {
      setStates([]); // Reset states if no country selected
    }
  }, [selectedCountryId]);

  console.log("selectedState", selectedState);

  // Fetch cities based on selected state
  useEffect(() => {
    const getCities = async () => {
      if (!selectedStateId && !selectedState?.id) {
        console.error("State ID is missing. Cannot fetch cities.");
        setCities([]);
        return;
      }

      try {
        const stateIdToUse = selectedStateId || selectedState.id;
        const cityData = await fetchCityApiRes(stateIdToUse);
        setCities(cityData);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    getCities();
  }, [selectedStateId, selectedState]);

  // const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    // Update form data
    if (type === "file" && files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCountryInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  const formatNumberWithCommas = (number) => {
    if (!number) return number;

    // Handle numbers with decimals
    let [integerPart, decimalPart] = number.toString().split(".");
    let formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return decimalPart
      ? `${formattedInteger}.${decimalPart}`
      : formattedInteger;
  };

  // Handle the price input change
  const handlepriceChange = (e) => {
    const { name, value } = e.target;

    // Remove non-numeric characters
    let rawValue = value.replace(/[^0-9]/g, ""); // Only digits allowed for phone numbers

    // Apply formatting based on the field name
    if (name === "asking_price" || name === "advance_price") {
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
        <Form.Group
          className="businessListingFormsDiv"
          controlId="additional_detail"
        >
          <Form.Label>Additional details</Form.Label>
          <Form.Control
            type="text"
            name="additional_detail"
            placeholder="Eg: Recently constructed 2bhk house for sale in Indore."
            value={formData.additional_detail}
            onChange={handleInputChange}
          />
          {errors?.additional_detail && (
            <small className="text-danger">{errors.additional_detail}</small>
          )}
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
        <Form.Group className="businessListingFormsDiv" controlId="country">
          <Form.Label>COUNTRY</Form.Label>
          <span className="vallidateRequiredStar">*</span>
          <div className="country-box-container">
            {countries.map((country) => (
              <div
                key={country.id}
                className={`country-box ${
                  selectedCountry?.id === country.id ? "selected" : ""
                }`}
                onClick={() => {
                  setSelectedCountry(country); // Update selected country object
                  setFormData((prev) => ({
                    ...prev,
                    country: country.name,
                    state: "", // Reset state on country change
                    city: "",
                  }));
                }}
              >
                {country.name}
              </div>
            ))}
          </div>
          {errors.country && (
            <div className="error-message">{errors.country}</div>
          )}
        </Form.Group>
      </div>

      {/* State Selection */}
      <div className="col-lg-7 col-md-12 col-sm-12">
        <Form.Group className="businessListingFormsDiv" controlId="state">
          <Form.Label>STATE</Form.Label>
          <span className="vallidateRequiredStar">*</span>

          <Form.Control
            as="select"
            value={formData.state}
            onChange={(e) => {
              const stateId = e.target.value;
              setSelectedStateId(stateId);
              setFormData((prev) => ({
                ...prev,
                state: stateId,
                city: "", // Reset city field when state changes
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

      {/* City Selection */}
      <div className="col-lg-7 col-md-12 col-sm-12">
        <Form.Group className="businessListingFormsDiv" controlId="city">
          <Form.Label>TOWN/CITY</Form.Label>
          <Form.Control
            as="select"
            value={formData.city}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                city: e.target.value, // Update city field in formData
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
          <Form.Control.Feedback type="invalid">
            {errors.city}
          </Form.Control.Feedback>
        </Form.Group>
      </div>

      {/* <div className="col-7">
        <Form.Group className="businessListingFormsDiv" controlId="state">
          <Form.Label>STATE</Form.Label> <span className="vallidateRequiredStar">*</span>
          <Form.Select name="state" value={formData.state} onChange={handleInputChange}  >
            <option value="">Select State</option>
            <option value="maharashtra">Maharashtra</option>
            <option value="karnataka">Karnataka</option>
            <option value="kerala">Kerala</option>
            <option value="punjab">Punjab</option>
          </Form.Select>
          {errors?.state && (  <small className="text-danger">{errors.state}</small>  )}
        </Form.Group>
      </div>

      <div className="col-7">
        <Form.Group className="businessListingFormsDiv" controlId="city">
          <Form.Label>TOWN/CITY</Form.Label>
          <span className="vallidateRequiredStar">*</span>
          <Form.Select name="city" value={formData.city} onChange={handleInputChange} >
            <option value="">Select City</option>
            <option value="mumbai">Mumbai</option>
            <option value="bengaluru">Bengaluru</option>
            <option value="delhi">Delhi</option>
            <option value="hyderabad">Hyderabad</option>
          </Form.Select>
          {errors?.city && (  <small className="text-danger">{errors.city}</small>  )}
        </Form.Group>
      </div> */}

      {/* <div className="col-7">
        <Form.Group controlId="asking_price" className="businessListingFormsDiv" >
        {formData.listing_type === "Selling" && (
            <>
              <Form.Label>
                PRICE <span className="vallidateRequiredStar">*</span>
              </Form.Label>
            </>
        )}
        {formData.listing_type === "Renting" && (
          <>
            <Form.Label>
              Rent <span className="vallidateRequiredStar">*</span>
            </Form.Label>
          </>
        )}
          <Form.Control type="text" name="asking_price" value={formData.asking_price} onChange={handleInputChange} placeholder="Enter Asking Price"  onKeyPress={(e) => {
                    // Allow only numbers
                    if (!/^[0-9]*$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }} />
          {errors?.asking_price && (  <small className="text-danger">{errors.asking_price}</small>  )}
          </Form.Group>
      </div>

      {formData.listing_type === "Renting" &&(
      <div className="col-7">
        <Form.Group controlId="advance" className="businessListingFormsDiv">
          <Form.Label>Advance</Form.Label> <span className="vallidateRequiredStar">*</span>
          <Form.Control type="text" name="advance_price" value={formData.advance_price} onChange={handleInputChange} placeholder="Enter Advance Price" onKeyPress={(e) => {
                    // Allow only numbers
                    if (!/^[0-9]*$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }} />
         {errors?.advance_price && (  <small className="text-danger">{errors.advance_price}</small>  )}
           </Form.Group>
      </div>
      )} */}
      <div className="col-7">
        <Form.Group
          controlId="asking_price"
          className="businessListingFormsDiv"
        >
          {formData.listing_type !== "Renting" && (
            <>
              <Form.Label>
                PRICE <span className="vallidateRequiredStar">*</span>
              </Form.Label>
            </>
          )}
          {formData.listing_type === "Renting" && (
            <>
              <Form.Label>
                Rent <span className="vallidateRequiredStar">*</span>
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

      {formData.listing_type === "Renting" && (
        <div className="col-7">
          <Form.Group controlId="advance" className="businessListingFormsDiv">
            <Form.Label>Advance</Form.Label>{" "}
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
        <Form.Group
          controlId="phone_number"
          className="businessListingFormsDiv"
        >
          <Form.Label>Mobile number</Form.Label>{" "}
          <span className="vallidateRequiredStar">*</span>
          <Form.Control
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
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

export default Page3Common1;
