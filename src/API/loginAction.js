
// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from '../axios';
// import { toast } from "react-toastify";
// import { setIslogin, setIsLogout } from "../redux/slice/loginSlice";

// // signup
// export const userSignup = async ({ registerformData, navigate, setActiveTab }) => {
//     try {
//         const response = await axios.post('/signup', registerformData)
//         const data = response.data;
//         console.log('signup', data);

//         if (response.status == 200) {
//             toast.success(response.data.message);
//             // Switch to login tab after successful registration
//             setActiveTab('login');
//             return;
//         } else {
//             toast.error(`Failed to fetch signup data`);
//         }

//     } catch (error) {
//         console.log('error', error);
//         toast.error(error.response.data.message);
//     }
// };

// // Login
// export const userLogin = createAsyncThunk(
//     "auth/login",
//     async ({ formData, navigate, onHide }, { rejectWithValue, dispatch }) => {
//         try {
//             const response = await axios.post('/login', formData)
//             const data = response.data;

//             if (response.status == 200) {
//                 localStorage.setItem('userLoginId', data.user);
//                 toast.success(response.data.message);
//                 onHide();
//                 navigate("/");
//                 dispatch(setIslogin())
//                 return;
//             } else {
//                 toast.error(`Failed to fetch login data`);
//             }

//         } catch (error) {
//             console.log('error', error);
//             toast.error(error.response.data.error);
//         }
//     }
// );

// // user-details
// export const userDetailsHandler = createAsyncThunk(
//     "auth/userDetailsHandler",
//     async ({ navigate }, { rejectWithValue, dispatch }) => {
//         try {
//             const userLoginId = localStorage.getItem("userLoginId")
//             const payload = {
//                 id: userLoginId
//             }
//             const response = await axios.post('/user-detail', payload)
//             const data = response.data;
            
//             if (response.status == 200) {
//                 return data;
//             } else {
//                 userLogout({ navigate })
//                 dispatch(setIsLogout())
//             }

//         } catch (error) {
//             console.log('error', error);
//             toast.error(error.response.data.message);
//         }
//     }
// );

// // Logout
// export const userLogout = async ({ dispatch, navigate }) => {
//     try {
//         const userLoginId = localStorage.getItem("userLoginId")
//         const payload = {
//             id: userLoginId
//         }
//         const response = await axios.post('/logout', payload)
//         if (response.status == 200) {
//             toast.success(response.data.message);
//             navigate("/");
//             dispatch(setIsLogout())
//             return;
//         } else {
//             toast.error(`Failed to fetch login data`);
//         }

//     } catch (error) {
//         console.log('error', error);
//         // dispatch(setIsLogout())
//         toast.error(error.response.data.message);
//     }

// };



