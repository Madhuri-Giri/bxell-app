import "./Footer.css"
import { NavLink } from 'react-router-dom';
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import footerLogo from '../../assets/Images/BXELL LOGO 3.PNG';

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
                                        <h2 className="utf_sec_title_item utf_sec_title_item2">Subscribe to Newsletter!</h2>
                                        <p className="utf_sec_meta">
                                            Subscribe to get latest updates and information.
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-4 col-sm-5">
                                    <div className="contact-form-action">
                                        <form method="post" className="footerForm">
                                            <span className="la la-envelope-o"></span>
                                            <input className="" type="email" placeholder="Enter your email" required="" />
                                            <button className="utf_theme_btn" type="submit">Subscribe</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-5 footerAboutUs">
                            {/* <h5>About Us</h5> */}
                            <img
                                src={footerLogo}
                                alt="Logo"
                                width="70"
                                height="40"
                                className="d-inline-block align-top"
                            />
                            <h1>BEST WAY TO SELL</h1>
                            <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis ipsa aliquid Lorem ipsum dolor, sit amet consectetur adipisicing elit.</p>
                        </div>
                        <div className="col-2 mt-2 footerUsefullLinksDiv">
                            <h5>Useful Links</h5>
                            <ul>
                                <li><NavLink to='/'><MdKeyboardDoubleArrowRight />Home </NavLink></li>
                                <li><NavLink to='/'><MdKeyboardDoubleArrowRight />Listing  </NavLink></li>
                                <li><NavLink to='/'><MdKeyboardDoubleArrowRight />Blog </NavLink></li>
                                <li><NavLink to='/'><MdKeyboardDoubleArrowRight />Privacy Policy </NavLink></li>
                                <li><NavLink to='/'><MdKeyboardDoubleArrowRight />Contact </NavLink></li>
                            </ul>
                        </div>
                        <div className="col-2 mt-2 footerPagesDiv">
                            <h5>Pages</h5>
                            <ul>
                                <li><NavLink to='/blog'><MdKeyboardDoubleArrowRight />Blog </NavLink></li>
                                <li><NavLink to='/'><MdKeyboardDoubleArrowRight />How it work </NavLink></li>
                                <li><NavLink to='/'><MdKeyboardDoubleArrowRight />Our Partner </NavLink></li>
                            </ul>
                        </div>
                        <div className="col-2 mt-2 footerHelpDiv">
                            <h5>Help</h5>
                            <ul>
                                <li><NavLink to='/'><MdKeyboardDoubleArrowRight />Sign In   </NavLink></li>
                                <li><NavLink to='/'><MdKeyboardDoubleArrowRight />Register </NavLink></li>
                                <li><NavLink to='/'><MdKeyboardDoubleArrowRight />Pricing </NavLink></li>
                                <li><NavLink to='/'><MdKeyboardDoubleArrowRight />Add Listing </NavLink></li>
                            </ul>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 footerCopyRight">
                            <p>Copyright © 2022 All Rights Reserved.</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Footer