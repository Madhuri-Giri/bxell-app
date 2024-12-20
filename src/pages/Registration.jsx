import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify'; 
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import './Registration.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signupUser } from '../redux/slice/authSlice';

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
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle registration submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Dispatch signup action
      const response = await dispatch(signupUser(formData)).unwrap();
  
      console.log(response); // Debugging: Log the response
  
      // Check for successful registration (adjust according to response structure)
      if (response.status === 200 && response.result === true) {
        // Show success message
        toast.success("Registration successful! Please log in.");
  
        // Delay the navigation to ensure the toast is visible
        setTimeout(() => {
          navigate('/login');
        }, 2000); // Wait for 2 seconds before navigating
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };
  

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <>
      <Header />
      <div className="registration-container">
        <div className="registration-box">
          <div className="registration-card">
            <h2 className="registration-header text-center">Register</h2>
            {error && <p className="error-message text-danger">{error}</p>}
            <form onSubmit={handleSubmit} className="registration-form">
              {/* Name */}
              <div className="mb-3">
                <input type="text" className="form-control" name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" required />
              </div>

              {/* Email */}
              <div className="mb-3">
                <input type="email" className="form-control" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" required />
              </div>

              {/* Phone Number */}
              <div className="mb-3">
                <input type="number" className="form-control" name="phone_number" value={formData.phone_number} onChange={handleInputChange} placeholder="Phone Number" required />
              </div>

              {/* Password */}
              <div className="mb-3 position-relative">
                <input type={showPassword ? 'text' : 'password'} className="form-control" name="password" value={formData.password} onChange={handleInputChange} placeholder="Password" required />
                <span onClick={() => setShowPassword(!showPassword)} className="password-toggle-icon">{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
              </div>

              {/* Confirm Password */}
              <div className="mb-3 position-relative">
                <input type={showConfirmPassword ? 'text' : 'password'} className="form-control" name="confirm_password" value={formData.confirm_password} onChange={handleInputChange} placeholder="Confirm Password" required />
                <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="password-toggle-icon">{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</span>
              </div>

              {/* Register Button */}
              <Button type="submit" className="register-btn w-100">Register</Button>
            </form>
            <div className="text-center mt-3">
              <p>Already have an account? <Link to="/login" className="text-decoration-none">Login here</Link></p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      
      {/* Toast Container */}
      <ToastContainer />
    </>
  );
};

export default RegistrationPage;
