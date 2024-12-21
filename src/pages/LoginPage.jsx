import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import './Login.css';
import { Link  } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/slice/authSlice';

const LoginPage = () => {
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

const navigate = useNavigate();
  const dispatch = useDispatch();
    const { isAuthenticated, error } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(formData));
    };

    useEffect(() => {
      if (isAuthenticated) {
        toast.success("Login successful!"); 
        navigate('/'); 
      }
      if (error) {
        toast.error(error); 
      }
    }, [isAuthenticated, error, navigate]);

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
      <div className="container d-flex justify-content-center align-items-center login_box">
        <div className="auth-modal-body card p-4 shadow-sm">
          <h2 className="signInModelHed text-center">Login</h2>
          <form onSubmit={handleSubmit} className="loginForm">
            {/* Email Field */}
            <div className="mb-3">
              <input  type="email" id="loginEmail"  name="email"  value={formData.email}  onChange={handleInputChange} className="form-control custom-input"  placeholder="Enter your email" required />
            </div>

            {/* Password Field */}
            <div className="mb-3 position-relative">
              <input  type={showPassword ? 'text' : 'password'}  id="loginPassword"  name="password"  value={formData.password}  onChange={handleInputChange} className="form-control custom-input"  placeholder="Enter your password"  required  />
              <span  onClick={() => setShowPassword(!showPassword)}  className="password-toggle-icon" >  {showPassword ? <FaEyeSlash /> : <FaEye />}  </span>
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
         <p>Don't have an account? <Link to="/register" className="text-decoration-none ms-1">Register Here</Link></p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;
