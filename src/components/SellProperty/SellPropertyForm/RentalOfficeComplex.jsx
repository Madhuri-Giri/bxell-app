import React, { useState } from "react"; 
import { Button, Form } from "react-bootstrap";
import "./SellPropertyForm.css";

const RentalOfficeComplex = ({ formData, setFormData, errors }) => {
  // Error states for validation
  // const [errorsState, setErrors] = useState({});

  // Ensure that the formData is updated properly
  const handleSelectionChange = (field) => (value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" })); // Clear error for that field
  };

  const handleFloorChange = (e) => {
    setFormData((prevData) => ({ ...prevData, floor_no: e.target.value }));
    setErrors((prevErrors) => ({ ...prevErrors, floor_no: "" })); // Clear error for floor_no
  };

  return (
    <>
      {/* Project Status */}
      <div className="col-lg-12">
        <Form.Group controlId="projectStatus" className="businessListingFormsDiv propertyFormRadio">
          <Form.Label>Project Status </Form.Label>
          <span className="vallidateRequiredStar">*</span>
          <div className="row">
            <div className="mb-3 propertyTypeButtons col-12">
              {["New Launch", "Ready To Move", "Under Construction"].map((type) => (
                <Button
                  key={type}
                  type="button"
                  className={`btn btn-outline-primary propertyTypeButton ${
                    formData.project_status === type ? "active" : ""
                  }`}
                  onClick={() => handleSelectionChange("project_status")(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          {errors?.project_status && (  <small className="text-danger">{errors.project_status}</small>  )}
        </Form.Group>
      </div>

      {/* Listed By */}
      <div className="col-lg-12">
        <Form.Group controlId="listedBy" className="businessListingFormsDiv propertyFormRadio">
          <Form.Label>Listed By </Form.Label>
          <span className="vallidateRequiredStar">*</span>
          <div className="row">
            <div className="mb-3 propertyTypeButtons col-12">
              {["Builder", "Dealer", "Owner"].map((type) => (
                <Button
                  key={type}
                  type="button"
                  className={`btn btn-outline-primary propertyTypeButton ${
                    formData.listed_by === type ? "active" : ""
                  }`}
                  onClick={() => handleSelectionChange("listed_by")(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          {errors?.listed_by && (  <small className="text-danger">{errors.listed_by}</small>  )}
        </Form.Group>
      </div>

      {/* Bedroom */}
      {/* {formData.property_type === "Complex/Entire Property"  &&(
      <div className="col-12">
        <Form.Group controlId="bedroom" className="businessListingFormsDiv propertyFormRadio">
          <Form.Label>Bedroom </Form.Label>
          <span className="vallidateRequiredStar">*</span>
          <div className="row">
            <div className="mb-3 propertyTypeButtons col-12">
              {["1", "2", "3", "4", "5", "6", "7", "8"].map((type) => (
                <Button
                  key={type}
                  type="button"
                  className={`btn btn-outline-primary propertyTypeButton ${
                    formData.bedroom === type ? "active" : ""
                  }`}
                  onClick={() => handleSelectionChange("bedroom")(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          {errorsState.bedroom && <small className="text-danger">{errorsState.bedroom}</small>}
        </Form.Group>
      </div>
      )} */}

      {/* Bathroom */}
      <div className="col-lg-12">
        <Form.Group controlId="bathroom" className="businessListingFormsDiv propertyFormRadio">
          <Form.Label>Bathroom </Form.Label>
          <div className="row">
            <div className="mb-3 propertyTypeButtons">
              {["1", "2", "3", "4", "5", "6", "7", "8"].map((type) => (
                <Button
                  key={type}
                  type="button"
                  className={`btn btn-outline-primary propertyTypeButton ${
                    formData.bathroom === type ? "active" : ""
                  }`}
                  onClick={() => handleSelectionChange("bathroom")(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          {errors?.bathroom && (  <small className="text-danger">{errors.bathroom}</small>  )}
        </Form.Group>
      </div>

      {/* Car Parking */}
       {/* Car Parking */}
<div className="col-lg-12">
  <Form.Group controlId="carParking" className="businessListingFormsDiv">
    <Form.Label>Car Parking </Form.Label>
    <span className="vallidateRequiredStar">*</span>
    <div className="row">
      <div className="mb-3 propertyTypeButtons">
        {["0", "1", "2", "3", "3+"].map((type) => (
          <Button
            key={type}
            type="button"
            className={`btn btn-outline-primary propertyTypeButton ${
              formData.car_parking === type ? "active" : ""
            }`}
            onClick={() => handleSelectionChange("car_parking")(type)}
          >
            {type}
          </Button>
        ))}
      </div>
    </div>
    {errors?.car_parking && <small className="text-danger">{errors.car_parking}</small>}
  </Form.Group>
</div>


      {/* Super Buildup Area (Sqft) */}
      <div className="col-7">
  <Form.Group controlId="sqft" className="businessListingFormsDiv">
    <Form.Label>
      Super Buildup Area (sqft)
      {/* Show asterisk only for specific property types */}
      {(formData.property_type === "Retail Space" || formData.property_type === "Complex/Entire Property") && (
        <span className="vallidateRequiredStar">*</span>
      )}
    </Form.Label>
    <Form.Control
      type="text"
      value={formData.sq_ft}
      onChange={(e) => setFormData({ ...formData, sq_ft: e.target.value })}
      placeholder="Enter area sqft"
    />
    {errors?.sq_ft && <small className="text-danger">{errors.sq_ft}</small>}
  </Form.Group>
</div>


      {/* Total Floor */}
      <div className="col-7">
  <Form.Group controlId="totalFloor" className="businessListingFormsDiv">
    <Form.Label>Total Floor </Form.Label>
    <Form.Control
      type="text"
      value={formData.total_floor}
      onChange={(e) => {
        setFormData({ ...formData, total_floor: e.target.value });
        setErrors((prevErrors) => ({ ...prevErrors, total_floor: "" })); // Clear error on change
      }}
      placeholder="Enter total floor number"
      onKeyPress={(e) => {
        if (!/^[0-9]*$/.test(e.key)) e.preventDefault(); // Allow only numbers
      }}
    />
    {errors?.total_floor && <small className="text-danger">{errors.total_floor}</small>}
  </Form.Group>
</div>

      {/* Floor No */}
      {(formData.property_type === "Retail Space" || formData.property_type === "Office Space")  &&(
        <div className="col-7">
          <Form.Group controlId="floorNo" className="businessListingFormsDiv">
            <Form.Label>Floor No</Form.Label>
            <Form.Control
              type="text"
              value={formData.floor_no}
              onChange={(e) => {
                setFormData({ ...formData, floor_no: e.target.value });
             
              }}
              placeholder="Enter floor number"
              onKeyPress={(e) => {
                if (!/^[0-9]*$/.test(e.key)) e.preventDefault(); // Allow only numbers
              }}
            />
            {errors?.floor_no && (  <small className="text-danger">{errors.floor_no}</small>  )}
          </Form.Group>
        </div>
      )}
    </>
  );
};

export default RentalOfficeComplex;
