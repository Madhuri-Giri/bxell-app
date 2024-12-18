import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify'; 
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import './Registration.css';
import { fetchRegistrationDetail } from "../API/apiServices";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize navigate

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      setError("Passwords don't match!");
      return;
    }

    setError('');

    // Call the API to register the user
    const result = await fetchRegistrationDetail(formData);

    if (result && result.result) {
      // Show success message in toaster
      toast.success(result.message);

      // Reset the form after successful registration
      setFormData({
        name: '',
        email: '',
        phone_number: '',
        password: '',
        confirm_password: '',
      });

      // Redirect to the login page after successful registration
      navigate('/login');
    } else {
      // Handle error
      setError('Registration failed, please try again.');
      toast.error('Registration failed!');
    }
  };

  return (
    <>
      <Header />
      <div className="registration-container">
        <div className="registration-box">
          <div className="registration-card">
            <h2 className="registration-header text-center">Register</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleRegister} className="registration-form">
              {/* Name */}
              <div className="mb-3">
                <input type="text"  className="form-control"   name="name"  value={formData.name} onChange={handleInputChange}  placeholder="Full Name"   required />
              </div>

              {/* Email */}
              <div className="mb-3">
                <input type="email"  className="form-control" name="email"   value={formData.email}  onChange={handleInputChange}  placeholder="Email Address"  required  />
              </div>

              {/* Phone Number */}
              <div className="mb-3">
                <input type="number"  className="form-control" name="phone_number" value={formData.phone_number} onChange={handleInputChange} placeholder="Phone Number"  required />
              </div>

              {/* Password */}
              <div className="mb-3 position-relative">
                <input type={showPassword ? 'text' : 'password'}  className="form-control"  name="password"  value={formData.password} onChange={handleInputChange}  placeholder="Password"  required  />
                <span onClick={() => setShowPassword(!showPassword)} className="password-toggle-icon">   {showPassword ? <FaEyeSlash /> : <FaEye />}  </span>
              </div>

              {/* Confirm Password */}
              <div className="mb-3 position-relative">
                <input type={showConfirmPassword ? 'text' : 'password'} className="form-control" name="confirm_password" value={formData.confirm_password} onChange={handleInputChange}  placeholder="Confirm Password" required />
                <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="password-toggle-icon">
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}  </span>
              </div>

              {/* Register Button */}
              <Button type="submit" className="register-btn w-100">Register</Button>
            </form>
            <div className="text-center mt-3">
              <p>Already have an account? <a href="/login" className="text-decoration-none">Login here</a></p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RegistrationPage;
