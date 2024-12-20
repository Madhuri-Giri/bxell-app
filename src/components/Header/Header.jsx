import React, { useState, useEffect } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaCircleUser } from "react-icons/fa6";
import "./Header.css";
import headerLogo from "../../assets/Images/BXELL LOGO 3.PNG";
import { IoLogIn } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import instant_img from "../../assets/Images/instant.png";
import percent_img from "../../assets/Images/percent.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slice/authSlice";

function Header() {
  const location = useLocation();
  const isActive = (path) => (location.pathname === path ? "active-link" : "");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    if (user) {
      dispatch(logoutUser(user));
    }
  };

  const handleProfileClick = () => {
    navigate(isAuthenticated ? "/profile" : "/login", { state: { user } }); 
  };

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary sticky-top mainNav">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img src={headerLogo} alt="Logo" className="d-inline-block align-top" />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Item className="navItemSpacing">
                <Nav.Link as={Link} to="/" className={isActive("/")}>  HOME </Nav.Link>
              </Nav.Item>
              <Nav.Item className="navItemSpacing">
                <Nav.Link as={Link} to="/sell" className={isActive("/sell")}> SELL </Nav.Link>
              </Nav.Item>
              <Nav.Item className="navItemSpacing">
                <Nav.Link as={Link} to="/buy" className={isActive("/buy")}> BUY </Nav.Link>
              </Nav.Item>
              <Nav.Item className="navItemSpacing">
                <Nav.Link as={Link}  to="/sell-business" className={isActive("/sell-business")}> SELL BUSINESS</Nav.Link>
              </Nav.Item>
              <Nav.Item className="navItemSpacing">
                <Nav.Link as={Link} to="/sell-property" className={isActive("/sell-property")}> SELL PROPERTY </Nav.Link>
              </Nav.Item>
              <Nav.Item className="navItemSpacing">
                <Nav.Link as={Link} to="/aboutUs" className={isActive("/aboutUs")}>  ABOUT </Nav.Link>
              </Nav.Item>
            </Nav>

            <div className="instant-img-con">
              <img src={instant_img} alt="Instant Listing" className="instan-box"  />
            </div>

            <div className="percent-img-con">
              <img  src={percent_img}  alt="Percent Listing"  className="percent-box" />
            </div>

            <div className="navbarCorner">
              {/* Attach the click handler */}
              {isAuthenticated ? (
                <>
                  <button onClick={handleLogout} className="headerButton headerSigninbtn"> <IoMdLogOut size={20} /> Logout </button>
                </>
              ) : (
                <button onClick={() => navigate("/login")} className="headerButton headerSigninbtn"> <IoLogIn size={20} /> Login </button>
              )}

              <FaCircleUser  size={33}  className="headerUserProfile"  onClick={handleProfileClick} style={{ cursor: "pointer" }} />
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
