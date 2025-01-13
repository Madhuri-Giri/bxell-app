import React, {useEffect} from "react"; 
import { Form, Button } from "react-bootstrap";
import "./SellPropertyForm.css";

const Land1 = ({ formData, setFormData, handleChange, errors }) => {

  useEffect(() => {
    console.log(formData); // Log the formData here to see if it is passed correctly
  }, [formData]); 

  const handleSelectionChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  return (
    <>
      <div className="col-12">
        <Form.Group
          controlId="area_measurment"
          className="businessListingFormsDiv propertyFormRadio"
        >
          <Form.Label>AREA MEASURMENT </Form.Label>
          <span className="vallidateRequiredStar">*</span>
          <div className="row">
            <div className="mb-3 propertyTypeButtons">
            {["sq.m", "sq.ft", "cents", "acre"].map((type) => (
  <Button
    key={type}
    type="button"
    className={`btn btn-outline-primary propertyTypeButton ${
      formData && formData.area_measurment === type ? "active" : ""
    }`}
    onClick={() => handleSelectionChange("area_measurment", type)}
  >
    {type.charAt(0).toUpperCase() + type.slice(1)}
  </Button>
))}


            </div>
          </div>
          {errors?.area_measurment && (
            <small className="text-danger">{errors.area_measurment}</small>
          )}
        </Form.Group>
      </div>

      <div className="col-7">
        <Form.Group controlId="area" className="businessListingFormsDiv">
          <Form.Label>Area</Form.Label>
          <span className="vallidateRequiredStar">*</span>
          <Form.Control
            type="text"
            name="area"
            value={formData.area || ""}
            onChange={(e) => handleSelectionChange("area", e.target.value)}
            placeholder="(e.g., 25)"
            isInvalid={!!errors.area}
            onKeyPress={(e) => {
              // Allow only numbers
              if (!/^[0-9]*$/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />
          <Form.Control.Feedback type="invalid">
            {errors.area}
          </Form.Control.Feedback>
        </Form.Group>
      </div>

      {/* Listed By Selection */}
      <div className="col-12">
        <Form.Group controlId="listedBy" className="businessListingFormsDiv">
          <Form.Label>Listed By </Form.Label>
          <span className="vallidateRequiredStar">*</span>
          <div className="row">
            <div className="mb-3 propertyTypeButtons">
              {["Builder", "Dealer", "Owner"].map((type) => (
                <Button
                  key={type}
                  type="button"
                  className={`btn btn-outline-primary propertyTypeButton ${
                    formData.listed_by === type ? "active" : ""
                  }`}
                  onClick={() => handleSelectionChange("listed_by", type)}
                >
                  {" "}
                  {type}{" "}
                </Button>
              ))}
            </div>
          </div>
          {errors?.listed_by && (
            <small className="text-danger">{errors.listed_by}</small>
          )}
        </Form.Group>
      </div>

      <div className="col-7">
        <Form.Group controlId="length" className="businessListingFormsDiv">
          <Form.Label>Length</Form.Label>
          <Form.Control
            type="text"
            name="length"
            value={formData.length || ""}
            onChange={(e) => handleSelectionChange("length", e.target.value)}
            placeholder="Enter Length"
            isInvalid={!!errors.length}
            onKeyPress={(e) => {
              // Allow only numbers
              if (!/^[0-9]*$/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />
          <Form.Control.Feedback type="invalid">
            {errors.length}
          </Form.Control.Feedback>
        </Form.Group>
      </div>

      <div className="col-7">
        <Form.Group controlId="breadth" className="businessListingFormsDiv">
          <Form.Label>Breadth</Form.Label>
          <Form.Control
            type="text"
            name="breadth"
            value={formData.breadth || ""}
            onChange={(e) => handleSelectionChange("breadth", e.target.value)}
            placeholder="Enter Breadth"
            isInvalid={!!errors.breadth}
            onKeyPress={(e) => {
              // Allow only numbers
              if (!/^[0-9]*$/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />
          <Form.Control.Feedback type="invalid">
            {errors.breadth}
          </Form.Control.Feedback>
        </Form.Group>
      </div>
    </>
  );
};

export default Land1;
