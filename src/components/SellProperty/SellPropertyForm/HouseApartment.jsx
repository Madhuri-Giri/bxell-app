import React from "react";
import { Button, Form } from "react-bootstrap";
import "./SellPropertyForm.css";

const HouseApartment = ({ formData, setFormData, errors }) => {
  // Update parent form data directly
  const handleSelectionChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  return (
    <>
      {/* Bedroom Selection */}
      <div className="col-7">
        <Form.Group controlId="bedroom" className="businessListingFormsDiv">
          <Form.Label>BEDROOMS: </Form.Label>
          <span className="vallidateRequiredStar">*</span>
          <div className="row">
            <div className="mb-3 propertyTypeButtons col-3">
              {["1", "2", "3", "4", "5", "6", "7", "8"].map((type) => (
                <Button key={type} type="button" className={`btn btn-outline-primary propertyTypeButton ${
                    formData.bedroom === type ? "active" : "" }`} onClick={() => handleSelectionChange("bedroom", type)} >  {type} </Button> ))}
            </div>
          </div>
          {errors?.bedroom && ( <small className="text-danger">{errors.bedroom}</small> )}
        </Form.Group>
      </div>

      {(formData.listing_type === "Selling" || formData.listing_type === "Renting") && (
  <div className="col-7">
  <Form.Group controlId="balcony" className="businessListingFormsDiv">
    <Form.Label>Balcony: </Form.Label>
    <span className="vallidateRequiredStar">*</span>
    <div className="row">
      <div className="mb-3 propertyTypeButtons col-3">
        {["1", "2", "3", "4", "5", "6"].map((type) => (
          <Button key={type} type="button" className={`btn btn-outline-primary propertyTypeButton ${ formData.balcony === type ? "active" : "" }`} onClick={() => handleSelectionChange("balcony", type)} >
            {type} </Button>
        ))}
      </div>
    </div>
    {errors?.balcony && ( <small className="text-danger">{errors.balcony}</small> )}
  </Form.Group>
</div>
)}

      {/* Bathroom Selection */}
      <div className="col-7">
        <Form.Group controlId="bathroom" className="businessListingFormsDiv">
          <Form.Label>BATHROOM: </Form.Label>
          <span className="vallidateRequiredStar">*</span>
          <div className="row">
            <div className="mb-3 propertyTypeButtons col-3">
              {["1", "2", "3", "4", "5", "6"].map((type) => (
                <Button key={type} type="button" className={`btn btn-outline-primary propertyTypeButton ${ formData.bathroom === type ? "active" : "" }`} onClick={() => handleSelectionChange("bathroom", type)} >
                  {type} </Button>
              ))}
            </div>
          </div>
          {errors?.bathroom && ( <small className="text-danger">{errors.bathroom}</small> )}
        </Form.Group>
      </div>

      {/* Furnishing Selection */}
      <div className="col-7">
        <Form.Group controlId="furnishing" className="businessListingFormsDiv">
          <Form.Label>Furnishing: </Form.Label>
          <span className="vallidateRequiredStar">*</span>
          <div className="row">
            <div className="mb-3 propertyTypeButtons col-3">
              {["Furnished", "Semi-Furnishing", "UnFurnished"].map((type) => (
                <Button  key={type}  type="button" className={`btn btn-outline-primary propertyTypeButton ${
                    formData.furnishing === type ? "active" : ""  }`}  onClick={() => handleSelectionChange("furnishing", type)}  > {type} </Button> ))}
            </div>
          </div>
          {errors?.furnishing && ( <small className="text-danger">{errors.furnishing}</small>  )}
        </Form.Group>
      </div>

      {/* Project Status Selection */}
      <div className="col-7">
        <Form.Group controlId="projectStatus" className="businessListingFormsDiv" >
          <Form.Label>Project Status: </Form.Label>
          <span className="vallidateRequiredStar">*</span>
          <div className="row">
            <div className="mb-3 propertyTypeButtons col-3">
              {["New Launch", "Ready to move", "Under Construction"].map(
                (type) => ( <Button  key={type} type="button"
                    className={`btn btn-outline-primary propertyTypeButton ${  formData.project_status === type ? "active" : "" }`}
                    onClick={() => handleSelectionChange("project_status", type) } > {type}</Button> ) )}
            </div>
          </div>
          {errors?.project_status && (  <small className="text-danger">{errors.project_status}</small>  )}
        </Form.Group>
      </div>

      {/* Listed By Selection */}
      <div className="col-7">
        <Form.Group controlId="listedBy" className="businessListingFormsDiv">
          <Form.Label>Listed By: </Form.Label>
          <span className="vallidateRequiredStar">*</span>
          <div className="row">
            <div className="mb-3 propertyTypeButtons col-3">
              {["Builder", "Dealer", "Owner"].map((type) => (
                <Button  key={type} type="button" className={`btn btn-outline-primary propertyTypeButton ${
                    formData.listed_by === type ? "active" : "" }`} onClick={() => handleSelectionChange("listed_by", type)}  >  {type} </Button> ))}
            </div>
          </div>
          {errors?.listed_by && ( <small className="text-danger">{errors.listed_by}</small> )}
        </Form.Group>
      </div>

      {/* Car Parking Selection */}
      <div className="col-7">
        <Form.Group controlId="carParking" className="businessListingFormsDiv">
          <Form.Label>Car Parking: </Form.Label>
          <span className="vallidateRequiredStar">*</span>
          <div className="row">
            <div className="mb-3 propertyTypeButtons col-3">
              {["0", "1", "2", "3", "3+"].map((type) => (
                <Button key={type} type="button"
                  className={`btn btn-outline-primary propertyTypeButton ${ formData.car_parking === type ? "active" : ""
                  }`}  onClick={() => handleSelectionChange("car_parking", type)} > {type} </Button>  ))}
            </div>
          </div>
          {errors?.car_parking && (  <small className="text-danger">{errors.car_parking}</small>  )}
        </Form.Group>
      </div>

      {/* Super Built-Up Area */}
      <div className="col-7">
        <Form.Group controlId="sqft" className="businessListingFormsDiv">
          <Form.Label>Super Built-up area sqft</Form.Label>
          <span className="vallidateRequiredStar">*</span>
          <Form.Control type="text" value={formData.sq_ft} onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                sq_ft: e.target.value,
              }))
            }  placeholder="Enter area"  />
          {errors?.sq_ft && (  <small className="text-danger">{errors.sq_ft}</small> )}
        </Form.Group>
      </div>

      <div className="col-7">
        <Form.Group controlId="floor_no" className="businessListingFormsDiv">
          <Form.Label> Floor No</Form.Label>
          <span className="vallidateRequiredStar">*</span>
          <Form.Control  type="text" value={formData.floor_no}
            onChange={(e) => setFormData((prevData) => ({
                ...prevData,
                floor_no: e.target.value,
              }))
            } placeholder="Enter total floor"  />
          {errors?.floor_no && (  <small className="text-danger">{errors.floor_no}</small>
          )}
        </Form.Group>
      </div>
      {/* Total Floor */}
      <div className="col-7">
        <Form.Group controlId="totalFloor" className="businessListingFormsDiv">
          <Form.Label>Total Floor</Form.Label>
          <span className="vallidateRequiredStar">*</span>
          <Form.Control  type="text" value={formData.total_floor}
            onChange={(e) => setFormData((prevData) => ({
                ...prevData,
                total_floor: e.target.value,
              }))
            } placeholder="Enter total floor"  />
          {errors?.total_floor && (  <small className="text-danger">{errors.total_floor}</small>
          )}
        </Form.Group>
      </div>
    </>
  );
};

export default HouseApartment;
