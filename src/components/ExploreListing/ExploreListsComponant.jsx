/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import './ExploreListsComponant.css'; // Import the CSS file
import listingImg_1 from '../../assets/Images/utf_listing_item-01.jpg';
import listingImg_2 from '../../assets/Images/utf_listing_item-03.jpg';
import listingImg_3 from '../../assets/Images/utf_listing_item-06.jpg';
// import HomeLsideImage_1 from '../../../assets/Images/utf_listing_item-01.jpg';
// import HomeLsideImage_2 from '../../../assets/Images/utf_listing_item-03.jpg';
// import HomeLsideImage_3 from '../../../assets/Images/utf_listing_item-06.jpg';
import { NavLink } from 'react-router-dom';
import { FaLocationDot } from 'react-icons/fa6';
import { FaPhoneAlt, FaTag } from 'react-icons/fa';

import { Form, Button, InputGroup, Collapse } from 'react-bootstrap'; // React Bootstrap components
import { FaSearch, FaMapMarkerAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Icons

function ExploreListsComponant() {

    const [openMoreFilters, setOpenMoreFilters] = useState(false); // Toggle state for more filters

    // Function to handle the filter logic (this is a placeholder)
    const handleSearch = (event) => {
        event.preventDefault();
        // Perform search/filter logic here
    };

    const exploreLists = [
        {
            to: "/beautiful-beach",
            img: listingImg_1,
            title: "Chontaduro Barcelona",
            priceRange: "$25 - $55",
            tag: "Open Now",
            type: "Restaurant",
            featured: "Featured",
            rating: 4.5,
            reviews: 822,
            phone: "+(15) 124-796-3633",
            location: "The Ritz-Carlton, Hong Kong"
        },
        {
            to: "/city-park",
            img: listingImg_2,
            title: "The Lounge & Bar",
            priceRange: "$45 - $70",
            tag: "Open Now",
            type: "Events",
            featured: "Featured",
            rating: 4.5,
            reviews: 822,
            phone: "+(15) 124-796-3633",
            location: "The Ritz-Carlton, Hong Kong"
        },
        {
            to: "/historic-museum",
            img: listingImg_3,
            title: "Westfield Sydney",
            priceRange: "$25 - $55",
            tag: "Closed",
            type: "Hotel",
            featured: "Featured",
            rating: 4.5,
            reviews: 822,
            phone: "+(15) 124-796-3633",
            location: "The Ritz-Carlton, Hong Kong"
        },
        {
            to: "/city-park",
            img: listingImg_1,
            title: "The Lounge & Bar",
            priceRange: "$45 - $70",
            tag: "Open Now",
            type: "Events",
            featured: "Featured",
            rating: 4.5,
            reviews: 822,
            phone: "+(15) 124-796-3633",
            location: "The Ritz-Carlton, Hong Kong"
        },
        {
            to: "/historic-museum",
            img: listingImg_2,
            title: "Westfield Sydney",
            priceRange: "$25 - $55",
            tag: "Closed",
            type: "Hotel",
            featured: "Featured",
            rating: 4.5,
            reviews: 822,
            phone: "+(15) 124-796-3633",
            location: "The Ritz-Carlton, Hong Kong"
        },
        {
            to: "/historic-museum",
            img: listingImg_1,
            title: "Westfield Sydney",
            priceRange: "$25 - $55",
            tag: "Closed",
            type: "Hotel",
            featured: "Featured",
            rating: 4.5,
            reviews: 822,
            phone: "+(15) 124-796-3633",
            location: "The Ritz-Carlton, Hong Kong"
        }
    ];

    return (
        <>
            <section>
                <div className="container">
                    <div className="row mt-5 mb-5">
                        <div className="col-8">
                            {exploreLists.map((place, index) => (
                                <NavLink key={index} to={place.to} className="exploreListcard mb-3 mt-3">
                                    <div className='explorealllistBox'>
                                        <div className="row">
                                            <div className="col-4">
                                                <img className='img-fluid' src={place.img} />
                                            </div>
                                            <div className="col-8 explorealllistBoxTextCol">
                                                <h5 className='explorealllistBoxHed'>{place.title}</h5>
                                                <p className='explorealllistBoxLoca'><FaLocationDot />{place.location}</p>
                                                <p className='explorealllistBoxPhone'><FaPhoneAlt />{place.phone}</p>
                                                <p className='explorealllistBoxParagrap'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quia, expedita voluptas deleniti tempora corrupti, incidunt ad quisquam fugit nesciunt voluptates</p>
                                            </div>
                                        </div>
                                    </div>
                                </NavLink>
                            ))}
                        </div>
                        <div className="col-4">
                            <div className='listingFilterBox'>
                                {/* Listing Filter Box */}
                                <div className="listingFilterBox p-3">
                                    {/* Search Filter */}
                                    <Form className='listingfilterForm' onSubmit={handleSearch}>
                                        {/* Search by Text */}
                                        <Form.Group className="mb-3">
                                            <InputGroup>
                                                <InputGroup.Text>
                                                    <FaSearch />
                                                </InputGroup.Text>
                                                <Form.Control type="text" placeholder="Search by keyword..." />
                                            </InputGroup>
                                        </Form.Group>

                                        {/* Search by Location */}
                                        <Form.Group className="mb-3">
                                            <InputGroup>
                                                <InputGroup.Text>
                                                    <FaMapMarkerAlt />
                                                </InputGroup.Text>
                                                <Form.Control type="text" placeholder="Search by location..." />
                                            </InputGroup>
                                        </Form.Group>

                                        {/* More Filters Button */}
                                        <Button
                                            variant="outline-secondary"
                                            onClick={() => setOpenMoreFilters(!openMoreFilters)}
                                            aria-controls="more-filters-collapse"
                                            aria-expanded={openMoreFilters}
                                            className="listingfilterMoreBtn justify-between d-flex align-items-center mb-3 w-100"
                                        >
                                            More Filters {openMoreFilters ? <FaChevronUp /> : <FaChevronDown />}
                                        </Button>

                                        {/* Collapsible More Filters */}
                                        <Collapse in={openMoreFilters}>
                                            <div id="more-filters-collapse">
                                                <Form.Group className="mb-2">
                                                    <Form.Check type="checkbox" label="Open Now" />
                                                </Form.Group>
                                                <Form.Group className="mb-2">
                                                    <Form.Check type="checkbox" label="Restaurants" />
                                                </Form.Group>
                                                <Form.Group className="mb-2">
                                                    <Form.Check type="checkbox" label="Events" />
                                                </Form.Group>
                                                <Form.Group className="mb-2">
                                                    <Form.Check type="checkbox" label="Hotels" />
                                                </Form.Group>
                                                <Form.Group className="mb-2">
                                                    <Form.Check type="checkbox" label="Featured Listings" />
                                                </Form.Group>
                                            </div>
                                        </Collapse>

                                        {/* Search Button */}
                                        <Button variant="" type="submit" className="listingfilterSearchBtn w-100 mt-3">
                                            Search
                                        </Button>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

export default ExploreListsComponant