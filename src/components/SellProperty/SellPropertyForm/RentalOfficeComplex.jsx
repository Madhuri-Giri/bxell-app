import React, { useState } from "react"; 
import { Button, Form } from "react-bootstrap";
import "./SellPropertyForm.css";

const RentalOfficeComplex = ({ formData, setFormData, errors }) => {
  // Error states for validation
  const [errorsState, setErrors] = useState({});

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
      <div className="col-7">
        <Form.Group controlId="projectStatus" className="businessListingFormsDiv propertyFormRadio">
          <Form.Label>Project Status: </Form.Label>
          <span className="vallidateRequiredStar">*</span>
          <div className="row">
            <div className="mb-3 propertyTypeButtons col-3">
              {["New Launch", "Ready to move", "Under Construction"].map((type) => (
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
          {errorsState.project_status && <small className="text-danger">{errorsState.project_status}</small>}
        </Form.Group>
      </div>

      {/* Listed By */}
      <div className="col-7">
        <Form.Group controlId="listedBy" className="businessListingFormsDiv propertyFormRadio">
          <Form.Label>Listed By: </Form.Label>
          <span className="vallidateRequiredStar">*</span>
          <div className="row">
            <div className="mb-3 propertyTypeButtons col-3">
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
          {errorsState.listed_by && <small className="text-danger">{errorsState.listed_by}</small>}
        </Form.Group>
      </div>

      {/* Bedroom */}
      {formData.property_type === "Complex/Entire Property"  &&(
      <div className="col-7">
        <Form.Group controlId="bedroom" className="businessListingFormsDiv propertyFormRadio">
          <Form.Label>Bedroom: </Form.Label>
          <span className="vallidateRequiredStar">*</span>
          <div className="row">
            <div className="mb-3 propertyTypeButtons col-3">
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
      )}

      {/* Bathroom */}
      {/* <div className="col-7">
        <Form.Group controlId="bathroom" className="businessListingFormsDiv propertyFormRadio">
          <Form.Label>Bathroom: </Form.Label>
          <span className="vallidateRequiredStar">*</span>
          <div className="row">
            <div className="mb-3 propertyTypeButtons col-3">
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
          {errorsState.bathroom && <small className="text-danger">{errorsState.bathroom}</small>}
        </Form.Group>
      </div> */}

      {/* Car Parking */}
      <div className="col-7">
        <Form.Group controlId="carParking" className="businessListingFormsDiv propertyFormRadio">
          <Form.Label>Car Parking: </Form.Label>
          <span className="vallidateRequiredStar">*</span>
          <div className="row">
            <div className="mb-3 propertyTypeButtons col-3">
              {["0", "1", "2", "3", "3+"].map((type) => (
                <Button
                  key={type}
                  type="button"
                  className={`btn btn-outline-primary propertyTypeButton ${
                    formData.car_parking === type ? "active" : ""
                  }`}
                  onClick={() => handleSelectionChange("car_parking")(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          {errorsState.car_parking && <small className="text-danger">{errorsState.car_parking}</small>}
        </Form.Group>
      </div>

      {/* Super Buildup Area (Sqft) */}
      <div className="col-7">
        <Form.Group controlId="sqft" className="businessListingFormsDiv">
          <Form.Label>Super Buildup Area (sqft): </Form.Label>
          <span className="vallidateRequiredStar">*</span>
          <Form.Control
            type="text"
            value={formData.sq_ft}
            onChange={(e) => setFormData({ ...formData, sq_ft: e.target.value })}
            placeholder=""
          />
          {errorsState.sq_ft && <small className="text-danger">{errorsState.sq_ft}</small>}
        </Form.Group>
      </div>

      {/* Total Floor */}
      <div className="col-7">
        <Form.Group controlId="totalFloor" className="businessListingFormsDiv">
          <Form.Label>Total Floor: </Form.Label>
          <span className="vallidateRequiredStar">*</span>
          <Form.Control
            type="text"
            value={formData.total_floor}
            onChange={(e) => setFormData({ ...formData, total_floor: e.target.value })}
            placeholder=" "
          />
          {errorsState.total_floor && <small className="text-danger">{errorsState.total_floor}</small>}
        </Form.Group>
      </div>

      {/* Floor No */}
      {/* <div className="col-7">
        <Form.Group controlId="floorNo" className="businessListingFormsDiv">
          <Form.Label>Floor No</Form.Label>
          <span className="vallidateRequiredStar">*</span>
          <Form.Select value={formData.floor_no} onChange={handleFloorChange} aria-label="Select Floor">
            <option value="">Select a floor</option>
            {["1", "2", "3", "4", "5", "6", "7", "8"].map((floor) => (
              <option key={floor} value={floor}>Floor {floor}</option>
            ))}
          </Form.Select>
          {errorsState.floor_no && <small className="text-danger">{errorsState.floor_no}</small>}
        </Form.Group>
      </div> */}
    </>
  );
};

export default RentalOfficeComplex;
