/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Modal, Tab, Tabs, Button, Form } from 'react-bootstrap';
import './AuthModal.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { userLogin, userSignup } from '../../API/loginAction';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';

function AuthModal({ show, onHide, modalType }) { // Accept modalType as a prop
    const [activeTab, setActiveTab] = useState('login');
    const [error, setError] = useState('');
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [registerformData, setRegisterFormData] = useState({
        name: '',
        email: '',
        phone_number: '',
        password: '',
        confirm_password: '',
    });

    useEffect(() => {
        // Update activeTab based on modalType whenever modalType changes
        setActiveTab(modalType === 'signup' ? 'register' : 'login');
    }, [modalType]);

    const handleRegisterInputChange = (e) => {
        const { name, value } = e.target;
        setRegisterFormData({
            ...registerformData,
            [name]: value
        });
    };

    const handleRegister = (event) => {
        event.preventDefault();
        userSignup({ registerformData, navigate, onHide, setActiveTab  });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleLogin = (event) => {
        event.preventDefault();
        dispatch(userLogin({ formData, navigate, onHide }));
        setFormData({ email: '', password: '' });
        setError('');
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton className='signInModelHed'>
                <Modal.Title>Sign In</Modal.Title>
            </Modal.Header>
            <Modal.Body className="auth-modal-body">
                <Tabs  id="signup-login-tabs"  activeKey={activeTab}  onSelect={(tab) => setActiveTab(tab)}  className="mb-3 px-3 nav-justified w-100 custom-tabs"  >
                    <Tab eventKey="register" title="REGISTER" className="custom-tab" />
                    <Tab eventKey="login" title="LOG IN" className="custom-tab" />
                </Tabs>
                <div className="container">
                    <div className="row">
                        {activeTab === 'register' && (
                            <form onSubmit={handleRegister} className='registerForm'>
                                <div className="mb-3">
                                    <input placeholder='Name'  type="text"  className="form-control"  id="registerName"  name="name"  value={registerformData.name}   onChange={handleRegisterInputChange}  required />
                                </div>
                                <div className="mb-3">
                                    <input placeholder='Email' type="email"    className="form-control"  id="registerEmail"   name="email"  value={registerformData.email}   onChange={handleRegisterInputChange} required />
                                </div>
                                <div className="mb-3">
                                    <input placeholder='Number'    type="number" className="form-control" id="registernumber" name="phone_number"  value={registerformData.phone_number}   onChange={handleRegisterInputChange}    required />
                                </div>
                                <div className="mb-3 position-relative">
                                    <input placeholder='Password' type={showRegisterPassword ? "text" : "password"}  className="form-control"  id="registerPassword"  name="password" value={registerformData.password}  onChange={handleRegisterInputChange}  required />
                                    <span onClick={() => setShowRegisterPassword(!showRegisterPassword)} className="password-toggle-icon">
                                        {showRegisterPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                                <div className="mb-3 position-relative">
                                    <input placeholder='Confirm Password'
                                        type={showConfirmPassword ? "text" : "password"}
                                        className="form-control"
                                        id="registerconfirmPassword"
                                        name="confirm_password"
                                        value={registerformData.confirm_password}
                                        onChange={handleRegisterInputChange}
                                        required />
                                    <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="password-toggle-icon">
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                                <Button type="submit" className="registerSubmitBtn w-100">Register</Button>
                            </form>
                        )}

                        {activeTab === 'login' && (
                            <form onSubmit={handleLogin} className='loginForm'>
                                <div className="mb-3">
                                    <input
                                        placeholder='Email'
                                        type="email"
                                        className="form-control"
                                        id="loginEmail"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mb-3 position-relative">
                                    <input
                                        placeholder='Password'
                                        type={showLoginPassword ? "text" : "password"}
                                        className="form-control"
                                        id="loginPassword"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                    />
                                    <span onClick={() => setShowLoginPassword(!showLoginPassword)} className="password-toggle-icon">
                                        {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                                {error && <p className="error">{error}</p>}
                                <div className="mb-3 forgetPassorddiv">
                                    <NavLink to='' className="text-decoration-none">Forgot Password?</NavLink>
                                    <Form.Check
                                        type="checkbox"
                                        id="rememberMe"
                                        label="Remember Me"
                                    />
                                </div>
                                <Button type="submit" className="loginSubmitBtn w-100">Login</Button>
                            </form>
                        )}
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default AuthModal;
