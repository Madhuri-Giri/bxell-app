/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "./ProfileMain.css";
import { FaRegUserCircle } from "react-icons/fa";
import User_Avtar from "../../assets/Images/user-avatar.jpg";
import { Button, Form, Nav } from "react-bootstrap";
import ProfileListingDetails from "./profileLisintgDetails";
import { useLocation } from "react-router-dom";
import {userProfile, updateProfile} from '../../API/apiServices';

function ProfileMain() {
  const location = useLocation();
  const { user } = location.state || {}; // Extract user ID from state
  const [activeTab, setActiveTab] = useState("view"); // Track active tab
  const [profile, setProfile] = useState(null); // Store profile data
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(null); // Track error state
  const [formData, setFormData] = useState({
    id: user || "", // Initialize with user ID
    name: "",
    phone_number: "",
    company: "",
    email: "",
    designation: "",
    state: "",
    birth: "",
    country: "",
    age: "",
    address: "",
    profile: "",
  });

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setError("User ID is missing");
        return;
      }
      setLoading(true);
      try {
        const data = await userProfile(user); // Call API with user ID
        setProfile(data);
      } catch (err) {
        setError(err.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Update formData whenever profile data changes
  useEffect(() => {
    if (profile) {
      setFormData({
        id: profile.id || "",
        name: profile.name || "",
        phone_number: profile.phone_number || "",
        company: profile.company || "",
        email: profile.email || "",
        designation: profile.designation || "",
        state: profile.state || "",
        birth: profile.birth || "",
        country: profile.country || "",
        age: profile.age || "",
        address: profile.address || "",
        profile: profile.profile || "",
      });
    }
  }, [profile]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle profile image upload

  
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Create a temporary URL for the uploaded file for immediate preview
      const imageUrl = URL.createObjectURL(file);

      // Update state in a single call
      setFormData((prevData) => ({
        ...prevData,
        profile: file, // Store the file for API submission
        profileUrl: imageUrl, // Store the URL for immediate preview
      }));
    }
  };
  

  // Save profile changes
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]); // Append file if present
      }
    }
  
    try {
      await updateProfile(formDataToSend, user); // Pass FormData to API
      alert("Profile updated successfully!");
      setActiveTab("view");
    } catch (err) {
      setError(err.message || "Failed to update profile");
      alert("Error updating profile: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  return (
    <section className="profileMAinSec">
      <div className="container">
        <div className="row profileMAinRow">
          <div className="col-12">
            <div className="profileMainBox">
              {/* Header with User Icon and Profile Details Title */}
              <div className="profileHed">
                <FaRegUserCircle />
                <h4>Profile</h4>
              </div>

              {/* Tabs for View and Edit Profile */}
              <Nav variant="tabs" defaultActiveKey="view">
                <Nav.Item>
                  <Nav.Link  eventKey="view"   onClick={() => handleTabChange("view")} className={activeTab === "view" ? "active-tab" : ""} >  Profile Details </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link  eventKey="edit"  onClick={() => handleTabChange("edit")}  className={activeTab === "edit" ? "active-tab" : ""} >  Edit Profile </Nav.Link>
                </Nav.Item>
              </Nav>

              <div className="edit-profile-photo">
                <img
                  src={formData.profileUrl || formData.profile}
                  alt="User Avatar"
                />
                {activeTab === "edit" && (
                  <div className="change-photo-btn">
                    <div className="photoUpload">
                      <span>
                        <i className="fa fa-upload"></i> Upload Photo
                      </span>
                      <input
                        type="file"
                        className="upload"
                        onChange={handleImageChange}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Display Profile Info or Edit Form Based on Active Tab */}
              {activeTab === "view" ? (
                // View Profile Tab Content
                <div className="profileForms row">
                  <div className="col-md-4">  <p>  <strong>Name:</strong> {formData.name}  </p> </div>
                  <div className="col-md-4">  <p> <strong>Phone:</strong> {formData.phone_number} </p>   </div>
                  <div className="col-md-4"><p> <strong>Company:</strong> {formData.company} </p> </div>
                  <div className="col-md-4">  <p>  <strong>Email:</strong> {formData.email} </p>  </div>
                  <div className="col-md-4">  <p>  <strong>Designation:</strong> {formData.designation} </p>  </div>
                  <div className="col-md-4">  <p> <strong>State:</strong> {formData.state} </p> </div>
                  <div className="col-md-4">  <p> <strong>Birth:</strong> {formData.birth} </p>  </div>
                  <div className="col-md-4"> <p>  <strong>Country:</strong> {formData.country}  </p>  </div>
                  <div className="col-md-4">  <p>   <strong>Age:</strong> {formData.age}  </p> </div>
                  <div className="col-12">  <p>  <strong>Address:</strong> {formData.address}  </p>  </div>
                </div>
              ) : (
                // Edit Profile Tab Content
                <Form onSubmit={handleSaveChanges}>
                  <div className="container profileForms">
                    <div className="row">
                      <div className="col-md-4">
                        <Form.Group  className="profileFormsDiv"  controlId="name" >
                          <Form.Label>Name</Form.Label>
                          <Form.Control  type="text"  placeholder="Name" name="name"   value={formData.name} onChange={handleChange} />
                        </Form.Group>
                      </div>

                      <div className="col-md-4">
                        <Form.Group  className="profileFormsDiv"  controlId="phone"  >
                          <Form.Label>Phone</Form.Label>
                          <Form.Control type="number"  placeholder="Phone" name="phone_number"  value={formData.phone_number} onChange={handleChange}  />
                        </Form.Group>
                      </div>

                      <div className="col-md-4">
                        <Form.Group className="profileFormsDiv" controlId="company"  >
                          <Form.Label>Company</Form.Label>
                          <Form.Control  type="text" placeholder="Company" name="company" value={formData.company}  onChange={handleChange} />
                        </Form.Group>
                      </div>

                      <div className="col-md-4">
                        <Form.Group className="profileFormsDiv" controlId="email"  >
                          <Form.Label>Email</Form.Label>
                          <Form.Control  type="email"  placeholder="Email"  name="email" value={formData.email} readOnly  />
                        </Form.Group>
                      </div>

                      <div className="col-md-4">
                        <Form.Group className="profileFormsDiv" controlId="designation" >
                          <Form.Label>Designation</Form.Label>
                          <Form.Control type="text" placeholder="Designation"   name="designation" value={formData.designation} onChange={handleChange} />
                        </Form.Group>
                      </div>

                      <div className="col-md-4">
                        <Form.Group className="profileFormsDiv"  controlId="state" >
                          <Form.Label>State</Form.Label>
                          <Form.Control  type="text" placeholder="State"  name="state"  value={formData.state} onChange={handleChange} />
                        </Form.Group>
                      </div>

                      <div className="col-md-4">
                        <Form.Group className="profileFormsDiv" controlId="birth" >
                          <Form.Label>Birth</Form.Label>
                          <Form.Control   type="text" placeholder="dd/mm/yyyy" name="birth"  value={formData.birth} onChange={handleChange} />
                        </Form.Group>
                      </div>

                      <div className="col-md-4">
                        <Form.Group className="profileFormsDiv"  controlId="country" >
                          <Form.Label>Country</Form.Label>
                          <Form.Control type="text" placeholder="Country" name="country"  value={formData.country} onChange={handleChange}  />
                        </Form.Group>
                      </div>

                      <div className="col-md-4">
                        <Form.Group className="profileFormsDiv" controlId="age">
                          <Form.Label>Age</Form.Label>
                          <Form.Control  type="number"  placeholder="Age" name="age" value={formData.age} onChange={handleChange} />
                        </Form.Group>
                      </div>

                      <div className="col-12">
                        <Form.Group className="profileFormsDiv" controlId="address" >
                          <Form.Label>Address</Form.Label>
                          <Form.Control  as="textarea" rows={5} placeholder="Enter your address" name="address"  value={formData.address} onChange={handleChange} />
                        </Form.Group>
                      </div>
                      <div className="col-12 profileSaveChangesButton">
                        <Button type="submit"> Save Changes </Button>
                      </div>
                    </div>
                  </div>
                </Form>
              )}

              <div className="row mt-4"> <ProfileListingDetails /> </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfileMain;
