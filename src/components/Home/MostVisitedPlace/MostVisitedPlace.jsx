import React, { useEffect, useState } from "react";
import "./MostVisitedPlace.css";
import { FaCity } from "react-icons/fa6";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MostVisitedPlace() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
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
      })
      .finally(() => {
        setLoading(false); // End loading state
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
            {loading ? (
              // Show loading message while fetching data
              <div className="data-not-found">
                <h4>Loading Cities...</h4>
                <p>Please wait while we load the data.</p>
              </div>
            ) : cities.length > 0 ? (
              // Show cities if data is available
              <div className="chooseCityWrapper">
                <div className="chooseCityWrapperInner">
                  {cities.map((city, index) => (
                    <div
                      className="chooseCityChilds"
                      key={`original-${index}`}
                      onClick={() => handleCityClick(city)}
                    >
                      <FaCity />
                      <h6>{city}</h6>
                    </div>
                  ))}
                  {/* Duplicate the list for seamless circular animation */}
                  {cities.map((city, index) => (
                    <div
                      className="chooseCityChilds"
                      key={`duplicate-${index}`}
                      onClick={() => handleCityClick(city)}
                    >
                      <FaCity />
                      <h6>{city}</h6>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Show "Data Not Found" if no cities are available
              <div className="data-not-found">
                <h4>Data Not Found</h4>
                <p>Loading Cities...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default MostVisitedPlace;
