import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import './Login.css';


const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = () => {
    e.preventDefault()
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Header />
      <div className="container d-flex justify-content-center align-items-center login_box">
        <div className="auth-modal-body card p-4 shadow-sm">
          <h2 className="signInModelHed text-center">Login</h2>
          <form className="loginForm" onSubmit={handleSubmit} >
            {/* Email Field */}
            <div className="mb-3">
              <input
                type="email"
                id="loginEmail"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-control custom-input"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Field */}
            <div className="mb-3 position-relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="loginPassword"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-control custom-input"
                placeholder="Enter your password"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle-icon"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Error Message */}
            {error && <p className="error mt-2 text-danger">{error}</p>}

            {/* Remember Me and Forgot Password */}
            <div className="forgetPassorddiv mb-3 d-flex justify-content-between">
              <div>
                <input type="checkbox" id="rememberMe" />
                <label htmlFor="rememberMe" className="ms-1">Remember Me</label>
              </div>
              <a href="#" className="text-decoration-none">Forgot Password?</a>
            </div>

            {/* Submit Button */}
            <button type="submit" className="loginSubmitBtn w-100">Login</button>
          </form>

          {/* Register Link */}
          <div className="register-link text-center mt-3">
            <p>
              Don't have an account?
              <a href="/register" className="text-decoration-none ms-1">Register Here</a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;
