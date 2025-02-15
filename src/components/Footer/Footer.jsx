import "./Footer.css";
import { NavLink } from "react-router-dom";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import footerLogo from "../../assets/Images/BXELL LOGO 3.PNG";

function Footer() {
  return (
    <>
      <section className="footer">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="utf_subscribe_block clearfix row">
                <div className="col-md-8 col-sm-7">
                  <div className="section-heading">
                    <h2 className="utf_sec_title_item utf_sec_title_item2">
                      Subscribe to Newsletter!
                    </h2>
                    <p className="utf_sec_meta">
                      Subscribe to get latest updates and information.
                    </p>
                  </div>
                </div>
                <div className="col-md-4 col-sm-5">
                  <div className="contact-form-action">
                    <form method="post" className="footerForm">
                      <span className="la la-envelope-o"></span>
                      <input  className=""  type="email"  placeholder="Enter your email" required="" />
                      <button className="utf_theme_btn" type="submit">  Subscribe </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-md-8 col-lg-6 footerAboutUs footer_com">
              <img src={footerLogo} alt="Logo"  width="70"  height="40"  className="d-inline-block align-top" />
              <h1>BEST WAY TO SELL</h1>
              <p className="footer_contact">
              Join thousands of users buying and selling businesses and properties with ease
              </p>
              <h6 className="footer_c">Contact Us: </h6>
              <p className="footer_contact">For support, email us at thebxell@gmail.com or call +91 9566702095</p>
            </div>

            <div className="col-12 col-md-4 col-lg-2 mt-2 footerUsefullLinksDiv footer_box">
              <h5>Useful Links</h5>
              <ul>
                <li> <NavLink to="/"> <MdKeyboardDoubleArrowRight /> Home </NavLink> </li>
                <li> <NavLink to="/aboutUs"> <MdKeyboardDoubleArrowRight />  About Us </NavLink>  </li>
                <li> <NavLink to="/blog-details"> <MdKeyboardDoubleArrowRight /> Blog </NavLink>  </li>
                {/* <li> <NavLink to="/"> <MdKeyboardDoubleArrowRight /> Contact </NavLink> </li> */}
              </ul>
            </div>

            <div className="col-12 col-md-8 col-lg-2 mt-2 footerPagesDiv">
              <h5>Pages</h5>
              <ul>
                <li> <NavLink to="/buy"> <MdKeyboardDoubleArrowRight /> Buy  </NavLink> </li>
                <li> <NavLink to="/sell"> <MdKeyboardDoubleArrowRight /> Sell </NavLink> </li>
                <li> <NavLink to="/register"> <MdKeyboardDoubleArrowRight /> Signin </NavLink> </li>
                <li> <NavLink to="/register"> <MdKeyboardDoubleArrowRight /> Register </NavLink> </li>
              </ul>
            </div>

            <div className="col-12 col-md-4 col-lg-2 mt-2 footerHelpDiv">
              <h5>Help</h5>
              <ul>
               
              <li> <NavLink to="/boost-listing1"> <MdKeyboardDoubleArrowRight /> Boost Listing (Month)</NavLink> </li>
                <li> <NavLink to="/boost-listing"> <MdKeyboardDoubleArrowRight /> Boost Listing (Week)</NavLink> </li>
                <li> <NavLink to="/sell-business"> <MdKeyboardDoubleArrowRight /> Add Listing Business </NavLink> </li>
                <li> <NavLink to="/sell-property"> <MdKeyboardDoubleArrowRight /> Add Listing Property </NavLink> </li> 
                </ul>
            </div>
          </div>

          <div className="row">
            <div className="col-12 footerCopyRight">
              <p>Copyright © 2024-2025 Bxell. All rights reserved.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Footer;
