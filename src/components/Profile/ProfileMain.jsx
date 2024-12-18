/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import './ProfileMain.css';
import { FaRegUserCircle } from 'react-icons/fa';
import User_Avtar from '../../assets/Images/user-avatar.jpg';
import { Button, Form, Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import ProfileListingDetails from './profileLisintgDetails';

function ProfileMain() {
    const [activeTab, setActiveTab] = useState('view'); // Track the active tab
    const { isLogin, userDetails } = useSelector((state) => state.loginReducer);

    // Check for userDetails to avoid errors in initial render
    console.log('userDetails', userDetails?.data[0]?.name);

    // Initialize formData state
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        company: '',
        email: '',
        designation: '',
        state: '',
        birth: '',
        country: '',
        age: '',
        address: '',
        profile: '',
    });

    // Update formData when userDetails changes
    useEffect(() => {
        if (userDetails?.data?.length > 0) {
            setFormData({
                name: userDetails?.data[0]?.name || '',
                phone: userDetails?.data[0]?.phone_number || '',
                company: userDetails?.data[0]?.company || '',
                email: userDetails?.data[0]?.email || '',
                designation: userDetails?.data[0]?.designation || '',
                state: userDetails?.data[0]?.state || '',
                birth: userDetails?.data[0]?.birth || '',
                country: userDetails?.data[0]?.country || '',
                age: userDetails?.data[0]?.age || '',
                address: userDetails?.data[0]?.address || '',
                profile: userDetails?.data[0]?.profile || '',  // Ensure this is correctly set
            });
        }
    }, [userDetails]);
    

    const handleImageChange = (e) => {
        const file = e.target.files[0];  // Get the selected file
        if (file) {
            const imageUrl = URL.createObjectURL(file);  // Create a URL for the image
            setFormData((prevData) => ({
                ...prevData,
                profile: imageUrl,  // Set the image URL to formData
            }));
        }
    };
    
    
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSaveChanges = (e) => {
        e.preventDefault();
        // Handle saving changes (e.g., update data in backend or state)
        console.log("Profile updated:", formData);

        // Move back to the "View Profile" tab after saving changes
        setActiveTab('view');
    };

    return (
        <section className='profileMAinSec'>
            <div className="container">
                <div className="row profileMAinRow">
                    <div className="col-12">
                        <div className='profileMainBox'>
                            {/* Header with User Icon and Profile Details Title */}
                            <div className='profileHed'>
                                <FaRegUserCircle />
                                <h4>Profile</h4>
                            </div>

                            {/* Tabs for View and Edit Profile */}
                            <Nav variant="tabs" defaultActiveKey="view">
                                <Nav.Item>
                                    <Nav.Link
                                        eventKey="view"
                                        onClick={() => handleTabChange('view')}
                                        className={activeTab === 'view' ? 'active-tab' : ''}
                                    >
                                        Profile Details
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link
                                        eventKey="edit"
                                        onClick={() => handleTabChange('edit')}
                                        className={activeTab === 'edit' ? 'active-tab' : ''}
                                    >
                                        Edit Profile
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>

                            {/* Profile Photo and Upload Option */}
                            {/* <div className="edit-profile-photo">
                                <img src={User_Avtar} alt="User Avatar" />
                                {activeTab === 'edit' && (
                                    <div className="change-photo-btn">
                                        <div className="photoUpload">
                                            <span><i className="fa fa-upload"></i> Upload Photo</span>
                                            <input type="file" className="upload" />
                                        </div>
                                    </div>
                                )}
                            </div> */}
                            <div className="edit-profile-photo">
    <img src={formData.profile || User_Avtar} alt="User Avatar" />
    {activeTab === 'edit' && (
        <div className="change-photo-btn">
            <div className="photoUpload">
                <span><i className="fa fa-upload"></i> Upload Photo</span>
                <input type="file" className="upload" onChange={handleImageChange} />
            </div>
        </div>
    )}
</div>



                            {/* Display Profile Info or Edit Form Based on Active Tab */}
                            {activeTab === 'view' ? (
                                // View Profile Tab Content
                                <div className="profileForms row">
                                    <div className="col-md-4">
                                        <p><strong>Name:</strong> {formData.name}</p>
                                    </div>
                                    <div className="col-md-4">
                                        <p><strong>Phone:</strong> {formData.phone}</p>
                                    </div>
                                    <div className="col-md-4">
                                        <p><strong>Company:</strong> {formData.company}</p>
                                    </div>
                                    <div className="col-md-4">
                                        <p><strong>Email:</strong> {formData.email}</p>
                                    </div>
                                    <div className="col-md-4">
                                        <p><strong>Designation:</strong> {formData.designation}</p>
                                    </div>
                                    <div className="col-md-4">
                                        <p><strong>State:</strong> {formData.state}</p>
                                    </div>
                                    <div className="col-md-4">
                                        <p><strong>Birth:</strong> {formData.birth}</p>
                                    </div>
                                    <div className="col-md-4">
                                        <p><strong>Country:</strong> {formData.country}</p>
                                    </div>
                                    <div className="col-md-4">
                                        <p><strong>Age:</strong> {formData.age}</p>
                                    </div>
                                    <div className="col-12">
                                        <p><strong>Address:</strong> {formData.address}</p>
                                    </div>
                                </div>
                            ) : (
                                // Edit Profile Tab Content
                                <Form onSubmit={handleSaveChanges}>
                                    <div className="container profileForms">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <Form.Group className="profileFormsDiv" controlId="name">
                                                    <Form.Label>Name</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Name"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-4">
                                                <Form.Group className="profileFormsDiv" controlId="phone">
                                                    <Form.Label>Phone</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        placeholder="Phone"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-4">
                                                <Form.Group className="profileFormsDiv" controlId="company">
                                                    <Form.Label>Company</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Company"
                                                        name="company"
                                                        value={formData.company}
                                                        onChange={handleChange}
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-4">
                                                <Form.Group className="profileFormsDiv" controlId="email">
                                                    <Form.Label>Email</Form.Label>
                                                    <Form.Control
                                                        type="email"
                                                        placeholder="Email"
                                                        name="email"
                                                        value={formData.email}
                                                        readOnly // Make the email field non-editable
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-4">
                                                <Form.Group className="profileFormsDiv" controlId="designation">
                                                    <Form.Label>Designation</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Designation"
                                                        name="designation"
                                                        value={formData.designation}
                                                        onChange={handleChange}
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-4">
                                                <Form.Group className="profileFormsDiv" controlId="state">
                                                    <Form.Label>State</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="State"
                                                        name="state"
                                                        value={formData.state}
                                                        onChange={handleChange}
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-4">
                                                <Form.Group className="profileFormsDiv" controlId="birth">
                                                    <Form.Label>Birth</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="dd/mm/yyyy"
                                                        name="birth"
                                                        value={formData.birth}
                                                        onChange={handleChange}
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-4">
                                                <Form.Group className="profileFormsDiv" controlId="country">
                                                    <Form.Label>Country</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Country"
                                                        name="country"
                                                        value={formData.country}
                                                        onChange={handleChange}
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-4">
                                                <Form.Group className="profileFormsDiv" controlId="age">
                                                    <Form.Label>Age</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        placeholder="Age"
                                                        name="age"
                                                        value={formData.age}
                                                        onChange={handleChange}
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className="col-12">
                                                <Form.Group className="profileFormsDiv" controlId="address">
                                                    <Form.Label>Address</Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={5}
                                                        placeholder="Enter your address"
                                                        name="address"
                                                        value={formData.address}
                                                        onChange={handleChange}
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className="col-12 profileSaveChangesButton">
                                                <Button type="submit">
                                                    Save Changes
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            )}

                            <div className='row mt-4'>
                                {/* <div className='profileNoOfListing'>
                                    <h6>No of Listings :- 3</h6>
                                </div>    */}
                                    <ProfileListingDetails/>
                            </div>
                            {/* <div className='row mt-4'>
                                <div className='recentIquiies'>
                                    <h6>Recent Inquiries</h6>
                                </div>
                            </div> */}

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ProfileMain;
