import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { Stepper, Step, StepLabel } from "@mui/material";
import HouseApartment1 from "../../components/editPropertyForm/HouseApartment1";
import RentalOfficeComplex1 from "../../components/editPropertyForm/RentalOfficeComplex1";
import Land1 from "../../components/editPropertyForm/Land1";
import Page3Land1 from "../../components/editPropertyForm/Page3Land1";
import Page3Common1 from "../../components/editPropertyForm/Page3Common1";
import Page3ROC1 from "../../components/editPropertyForm/Page3ROC1";
import { fetchEditPropertyForm } from "../../API/apiServices";
import Swal from "sweetalert2";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const EditPropertyForm = () => {
  const location = useLocation()
    const [step, setStep] = useState(0);
    const navigate = useNavigate();
    const steps = ["Property Info", "Property Details", "Confirmation"];
    const [property_type, setPropertyType] = useState("");
    const [listing_type, setListingType] = useState("");
    const [errors, setErrors] = useState({});
    const user = useSelector((state) => state.auth.user);

   const propertyData = location.state?.propertyData;
        console.log("propertyData", propertyData);
          if (!propertyData) {
            return <p>No data available. Please go back and try again.</p>;
          }

          const [formData, setFormData] = useState({
            user_id: "",  // Replace with actual user data
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
        
          const [imagePreview, setImagePreview] = useState([]);
        
          // Update formData and handle image preview based on propertyData
          useEffect(() => {
            if (propertyData) {
              console.log("propertyData", propertyData);
        
              // Set formData
              setFormData({
                property_type: propertyData.property_type || "",
                property_title: propertyData.property_title || "",
                listed_by: propertyData.listed_by || "",
                listing_type: propertyData.listing_type || "",
                title: propertyData.title || "",
                country: propertyData.country || "",
                state: propertyData.state || "",
                city: propertyData.city || "",
                additional_detail: propertyData.additional_detail || "",
                area_measurment: propertyData.area_measurment || "",
                sq_ft: propertyData.sq_ft || "",
                amount: propertyData.amount || "",
                bedroom: propertyData.bedroom || "",
                asking_price: propertyData.asking_price || "",
                bathroom: propertyData.bathroom || "",
                balcony: propertyData.balcony || "",
                floor_no: propertyData.floor_no || "",
                file_name: propertyData.file_name || "",
                project_status: propertyData.project_status || "",
                phone_number: propertyData.phone_number || "",
                total_floor: propertyData.total_floor || "",
              });
        
              // Handle image preview if file_name is a valid JSON string or array
              const parsedImages = propertyData.file_name && propertyData.file_name.startsWith("[")
                ? JSON.parse(propertyData.file_name)
                : [propertyData.file_name];
              setImagePreview(parsedImages);
            }
          }, [propertyData]);
        
          // Log formData state changes
          useEffect(() => {
            console.log('Updated formData:', formData);
          }, [formData]);
      
        const UpdateForm = async (e) => {
          e.preventDefault();
      
          // Prepare FormData object
          const formDataObject = new FormData();
          Object.keys(formData).forEach((key) => {
            formDataObject.append(key, formData[key]);
          });
      
        
          formDataObject.append("property_id", propertyData.id);  
      
          try {
       
            const response = await fetchEditPropertyForm(formDataObject);
      
            // Handle response from the API
            if (response) {
              toast.success("property form updated successfully!");  
              navigate("/");  // Navigate to the home page
            }
          } catch (error) {
            setErrors(error.message);
            toast.error("Error updating the property form!");  // Show error toast
          }
        };
      

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
  
    // Handle form input changes
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handlepriceChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value.replace(/\D/g, ""), // Allow only numeric values
      }));
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
                       <div className="col-lg-12 col-md-12 col-sm-12">
                                                 <Form.Group className="businessListingFormsDiv" controlId="listingType" >
                                                   <Form.Label>LISTING TYPE</Form.Label>
                                                   <span className="vallidateRequiredStar">*</span>
                                                   <div className="listing-type-container">
                                                     {["Selling", "Renting", "Leasing",  ].map((type) => (
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
                                               
                      <div className="col-lg-12">
                        <Form.Group  controlId="property_type" className="businessListingFormsDiv propertyFormRadio" >
                          <Form.Label>PROPERTY TYPE</Form.Label>
                          <span className="vallidateRequiredStar">*</span>
                          <div className="row">
                            <div className="mb-3 propertyTypeButtons property_space">
                            {["House",  "Apartment", "Retail Space", "Office Space", "Complex/Entire Property", "Land",  ].map((type) => (
                                                       <div key={type} className={`listing-type-box ${  formData.property_type === type ? "selected"  : ""
                                                         }`}
                                                         onClick={() =>
                                                           setFormData((prev) => ({
                                                             ...prev,
                                                             property_type: type,
                                                           }))
                                                         }
                                                       >
                                                         {type}
                                                       </div>
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
        {formData.property_type === 'Land' && (
          <Land1
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            errors={errors}
          />
        )}

        {['House', 'Apartment'].includes(formData.property_type) && (
          <HouseApartment1
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            errors={errors}
          />
        )}

        {['Retail Space', 'Office Space', 'Complex/Entire Property'].includes(formData.property_type) && (
          <RentalOfficeComplex1
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            errors={errors}
          />
        )}

        <div className="col-12 propertyListingSubmitButton">
          {step > 0 && (
            <Button variant="secondary" onClick={handleBack} type="button" className="me-2">
              Back
            </Button>
          )}
          <Button variant="primary" onClick={handleNext} type="button">
            Next
          </Button>
        </div>
      </>
    )}

    {/* Handle Step 2 */}
    {step === 2 && (
      <>
        {formData.property_type === 'Land' && (
          <Page3Land1
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            errors={errors}
          />
        )}

        {['House', 'Apartment'].includes(formData.property_type) && (
          <Page3Common1
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            errors={errors}
          />
        )}

        {['Retail Space', 'Office Space', 'Complex/Entire Property'].includes(formData.property_type) && (
          <Page3ROC1
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            errors={errors}
          />
        )}

          <div className="col-12 propertyListingSubmitButton">
            {step > 0 && (
              <Button variant="secondary" onClick={handleBack} type="button" className="me-2">
                Back
              </Button>
            )}
            <Button variant="primary" type="submit" onClick={UpdateForm}>
              Save Changes
            </Button>
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
  )
}

export default EditPropertyForm
