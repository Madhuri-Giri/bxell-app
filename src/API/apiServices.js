import axios from "axios";

// Define the base URL and endpoint
export const BASE_URL = "https://bxell.com/bxell/admin/api";
export const SELL_BUSINESS_FORM_URL = `${BASE_URL}/add-business-sale`;
export const SELL_PROPERTY_FORM_URL = `${BASE_URL}/add-property-sale`;
export const HOME_BLOG_URL = `${BASE_URL}/blog-detail`;
export const HOME_PROPERTY_DETAILS_URL = `${BASE_URL}/property-details`;
export const HOME_BUSINESS_DETAILS_URL = `${BASE_URL}/business-details`;
export const VIEW_BUSINESS_API_URL = `${BASE_URL}/view-business-detail`;
export const VIEW_PROPERTY_API_URL = `${BASE_URL}/view-property-detail`;
export const LISTING_DETAILS_API_URL = `${BASE_URL}/listing-details`;
export const UPDATE_BUSINESS_STOCK_API_URL = `${BASE_URL}/update-business-stock`;
export const UPDATE_PROPERTY_STOCK_API_URL = `${BASE_URL}/update-property-stock`;
export const FILTER_API_URL = `${BASE_URL}/filters`;
export const RATING_PROPERTY_API_URL = `${BASE_URL}/property-rating`;
export const RATING_BUSINESS_API_URL = `${BASE_URL}/business-rating`;
export const LOGIN_FORM_API_URL = `${BASE_URL}/login`;
export const REGISTRATION_FORM_API_URL = `${BASE_URL}/signup`;
// --------------------------Login form------------------------------------------



// -------------------------SignUp form------------------------------------------
// API Call to register the user
export const fetchRegistrationDetail = async (formData) => {
  try {
    const response = await axios.post(REGISTRATION_FORM_API_URL, formData);
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error during registration:", error);
    return null; // Return null if there's an error
  }
};

// ----------------------------Sell Boost Lising API-------------------------------
export const fetchListingDetail = async () => {
  try {
    const userId = localStorage.getItem("userLoginId");
    const response = await axios.post(LISTING_DETAILS_API_URL, {
      user_id: userId // Send user_id as part of the request body
    });
    return response.data.User_listing_details; // Return the 'User_listing_details' array from the response data
  } catch (error) {
    console.error("Error fetching property details:", error);
    return null; // Return null in case of an error
  }
};
// -------------------------SELL BUSINESS FORM API-----------------------------------

// export const submitSellBusinessForm = async (formData) => {
//   try {
//     const data = new FormData();

//     Object.keys(formData).forEach((key) => {
//       if (key === "file_name" && Array.isArray(formData[key])) {
//         // Append each file individually
//         formData[key].forEach((file) => {
//           data.append("file_name[]", file); // Use "file_name[]" to send multiple files
//         });
//       } else {
//         data.append(key, formData[key]);
//       }
//     });

//     const response = await axios.post(SELL_BUSINESS_FORM_URL, data, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });

//     console.log("SELL BUSINESS FORM Response:", response.data);
//     // return response.data;
//     return response.data?.data?.id; 
    
//   } catch (error) {
//     console.error("Error submitting Sell Business form data:", error.response?.data || error.message);
//     throw error;
//   }
// };

export const submitSellBusinessForm = async (formData) => {
  try {
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === "file_name") {
        const files = formData[key];

        // If it's a single file, append it as "file_name"
        if (files instanceof File) {
          data.append("file_name", files);
        }
        // If it's an array of files, append each one individually
        else if (Array.isArray(files)) {
          files.forEach((file) => {
            data.append("file_name[]", file);
          });
        }
      } else {
        data.append(key, formData[key]);
      }
    });

    const response = await axios.post(SELL_BUSINESS_FORM_URL, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("SELL BUSINESS FORM Response:", response.data);
    return response.data?.data?.id; 
    
  } catch (error) {
    console.error("Error submitting Sell Business form data:", error.response?.data || error.message);
    throw error;
  }
};

// ------------------------------PROPERTY FORM ---------------------------------
export const submitSellPropertyForm = async (formData) => {
  try {
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === "file_name" && Array.isArray(formData[key])) {
        // Append each file individually
        formData[key].forEach((file) => {
          data.append("file_name[]", file); // Use "file_name[]" to send multiple files
        });
      } else {
        data.append(key, formData[key]);
      }
    });

    const response = await axios.post(SELL_PROPERTY_FORM_URL, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("SELL property FORM Response:", response.data);
    // return response.data;
    return response.data?.data?.id; 
  } catch (error) {
    console.error("Error submitting Sell property form data:", error.response?.data || error.message);
    throw error;
  }
};

// ------------------------BLOG API-------------------------
export const fetchBlogRes = async () => {
    try {
        const response = await axios.get(HOME_BLOG_URL);
        
        // Return the 'blog' array from the response data
        return response.data.blog; 
    } catch (error) {
        console.error("Error fetching Blog:", error);
        return null; // Return null in case of an error
    }
};

// --------------------------PROPERTY DETAILS API------------------------------
export const fetchPropertyRes = async () => {
    try {
        const response = await axios.get(HOME_PROPERTY_DETAILS_URL);
        // Return the 'blog' array from the response data
        return response.data.property; 
    } catch (error) {
        console.error("Error fetching property details:", error);
        return null; // Return null in case of an error
    }
};

// ----------------------------BUSINESS DETAILS API---------------------------------
export const fetchBusinessRes = async () => {
    try {
        const response = await axios.get(HOME_BUSINESS_DETAILS_URL);
        // Return the 'blog' array from the response data
        return response.data.business; 
    } catch (error) {
        console.error("Error fetching property details:", error);
        return null; // Return null in case of an error
    }
};

// ----------------------------VIEW Property API-----------------------------
export const fetchViewPropertyRes = async (property_id) => {
  try {
    console.log("Fetching Property with ID:", property_id);  // Log the property_id to ensure it is correct
    const response = await axios.post(VIEW_PROPERTY_API_URL, { property_id });  // Pass the property_id as part of the request body
    console.log("Property API Response:", response.data);  // Log the full response to check the data
    return response.data.property;  // Return the relevant part of the data
  } catch (error) {
    console.error("Error fetching View Property details:", error);
    return null;
  }
};

// ------------------------------View Business API-------------------------------
export const fetchViewBusinessRes = async (business_id) => {
  try {
    const response = await axios.post(VIEW_BUSINESS_API_URL, { business_id });
    console.log("Business API Response:", response.data); // Log the response data here
    return response.data.business;  // Return the relevant part of the data
  } catch (error) {
    console.error("Error fetching View Business details:", error);
    return null;
  }
};

// ----------------------------------UPDATE BUSINESS STOCK-----------------------------
// export const fetchUpdateBusinessStock = async (businessId, stock) => {
//   try {
//       if (!businessId || !stock) {
//           throw new Error("Missing required parameters: 'businessId' or 'stock'");
//       }

//       const payload = {
//           business_id: businessId,
//           stock: stock,
//       };

//       console.log("Sending payload to update business stock:", payload);

//       const response = await axios.post("https://bxell.com/bxell/admin/api/update-business-stock", payload);

//       if (response.status === 200) {
//           console.log("Business stock updated successfully:", response.data);
//           return response.data.business_sale;
//       } else {
//           console.error("Unexpected response status:", response.status, response.data);
//           return null;
//       }
//   } catch (error) {
//       console.error("Error fetching update business stock details:", error);
//       return null;
//   }
// };
export const fetchUpdateBusinessStock = async (businessId, stock) => {
  try {
    // Validate inputs
    if (!businessId || !stock) {
      throw new Error("Missing required parameters: 'propertyId' or 'stock'");
    }

    // Payload to send in the API call
    const payload = {
      business_id: businessId,
      stock: stock,
    };

    console.log("Sending payload to update business stock:", payload);

    // Make the API request
    const response = await axios.post(UPDATE_BUSINESS_STOCK_API_URL, payload);

    // Log success message
    console.log("Business stock updated successfully:", response.data);

    // Return the API response
    return response.data;
  } catch (error) {
    // Log the error
    console.error("Error updating business stock:", error.message || error);

    // Return null or handle error as needed
    return null;
  }
};
// ----------------------------------UPDATE PROPERTY STOCK-----------------------------
// export const fetchUpdatePropertyStock = async (propertyId, stock) => {
//   try {
//       if (!propertyId || !stock) {
//           throw new Error("Missing required parameters: 'propertyId' or 'stock'");
//       }

//       const payload = {
//           property_id: propertyId,
//           stock: stock,
//       };

//       console.log("Sending payload to update property stock:", payload);

//       const response = await axios.post("https://bxell.com/bxell/admin/api/update-property-stock", payload);

//       if (response.status === 200) {
//           console.log("Property stock updated successfully:", response.data);
//           return response.data.property_sale;
//       } else {
//           console.error("Unexpected response status:", response.status, response.data);
//           return null;
//       }
//   } catch (error) {
//       console.error("Error fetching update property stock details:", error);
//       return null;
//   }
// };

export const fetchUpdatePropertyStock = async (propertyId, stock) => {
  try {
    // Validate inputs
    if (!propertyId || !stock) {
      throw new Error("Missing required parameters: 'propertyId' or 'stock'");
    }

    // Payload to send in the API call
    const payload = {
      property_id: propertyId,
      stock: stock,
    };

    console.log("Sending payload to update property stock:", payload);

    // Make the API request
    const response = await axios.post(UPDATE_PROPERTY_STOCK_API_URL, payload);

    // Log success message
    console.log("Property stock updated successfully:", response.data);

    // Return the API response
    return response.data;
  } catch (error) {
    // Log the error
    console.error("Error updating property stock:", error.message || error);

    // Return null or handle error as needed
    return null;
  }
};

// ------------------------------------Filter Business and Property ----------------------
export const fetchFilterRes = async () => { 
  try {
      const response = await axios.get(FILTER_API_URL);
      // Return the response data as is, since it's structured with the filter fields
      return response; 
  } catch (error) {
      console.error("Error fetching property details:", error);
      return null; // Return null in case of an error
  }
};

// ---------------------------Business Rating---------------------------------------
export const fetchBusinessRating = async (businessListingId, rating) => {
  try {
    // Retrieve the logged-in user ID from local storage
    const userId = localStorage.getItem("userLoginId");
    
    // Validate inputs before making the API call
    if (!userId) {
      throw new Error("User ID is not available. Please log in.");
    }
    if (!businessListingId || !rating) {
      throw new Error("Business Listing ID and Rating are required.");
    }

    // Make the API call
    const response = await axios.post(RATING_BUSINESS_API_URL, {
      user_id: userId,
      business_listing_id: businessListingId,
      rating: rating,
    });

    // Return the response data
    return response.data.rating;
  } catch (error) {
    // Log and handle the error
    console.error("Error posting business rating:", error);
    return null; // Return null or handle as needed
  }
};

// -----------------------------Property Rating ------------------------------------
export const fetchPropertyRating = async (propertyListingId, rating) => {
  try {
    // Retrieve the logged-in user ID from local storage
    const userId = localStorage.getItem("userLoginId");
    
    // Validate inputs before making the API call
    if (!userId) {
      throw new Error("User ID is not available. Please log in.");
    }
    if (!propertyListingId || !rating) {
      throw new Error("Business Listing ID and Rating are required.");
    }

    // Make the API call
    const response = await axios.post(RATING_PROPERTY_API_URL, {
      user_id: userId,
      property_listing_id: propertyListingId,
      rating: rating,
    });

    // Return the response data
    return response.data.rating;
  } catch (error) {
    // Log and handle the error
    console.error("Error posting business rating:", error);
    return null; // Return null or handle as needed
  }
};