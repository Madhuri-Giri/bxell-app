import React, { useEffect, useState } from "react";
import "./MostVisitedPlace.css";
import { FaCity } from "react-icons/fa6";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MostVisitedPlace() {
  
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the cities from the API
    axios
      .get("https://bxell.com/bxell/admin/api/filters")
      .then((response) => {
        if (response.data.result) {
          // Combine cities from both business and property filter fields
          const combinedCities = [
            ...new Set([
              ...response.data.business_filter_fields.city,
              ...response.data.property_filter_fields.city,
            ]),
          ]; // Use Set to remove duplicates

          setCities(combinedCities);
        }
      })
      .catch((error) => {
        console.error("Error fetching cities:", error);
      });
  }, []);

  const handleCityClick = (city) => {
    // Navigate to PropertyBuyPage with selected city
    navigate("/buy", { state: { city } });
  };

  return (
    <section className="homeMostVisitedPlace">
      <div className="container">
        <div className="row homeMostVisitedPlaceROW">
          <div className="2 homeMostVisitedPlaceHed">
            <h4>Choose your city to Explore</h4>
          </div>
          <div className="chooseCityMain">
            <div className="chooseCityWrapper">
              <div className="chooseCityWrapperInner">
                {cities.map((city, index) => (
                  <div className="chooseCityChilds" key={`original-${index}`} onClick={() => handleCityClick(city)} > <FaCity /> <h6>{city}</h6>
                  </div>
                ))}
                {/* Duplicate the list for seamless circular animation */}
                {cities.map((city, index) => (
                  <div className="chooseCityChilds" key={`duplicate-${index}`} onClick={() => handleCityClick(city)} > <FaCity /> <h6>{city}</h6>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MostVisitedPlace;
