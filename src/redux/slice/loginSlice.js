
// // redux/loginSlice.js
// import { createSlice } from '@reduxjs/toolkit';
// import {  userDetailsHandler, userLogin } from '../../API/loginAction';

// const initialState = {
//     isLogin: false,
//     userDetails: null,
// };

// const loginSlice = createSlice({
//     name: 'auth',
//     initialState,
//     reducers: {
//         setIslogin: (state) => {
//             if (localStorage.getItem("userLoginId")) {
//                 state.isLogin = true;
//             }
//         },
//         setIsLogout: (state) => {
//             if (localStorage.getItem("userLoginId")) {
//                 localStorage.removeItem("userLoginId")
//             }
//             state.isLogin = false;
//             state.userDetails = null
//         },
//     },

//     extraReducers: (builder) => {
//         builder

//             // User Details
//             .addCase(userDetailsHandler.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(userDetailsHandler.fulfilled, (state, { payload }) => {                
//                 state.loading = false;
//                 state.userDetails = payload;
//                 state.isUserLogin = true;
//             })
//             .addCase(userDetailsHandler.rejected, (state, { payload }) => {
//                 state.loading = false;
//                 state.error = payload;
//             })
//     },
// });

// export const { setIslogin, setIsLogout , userDetails } = loginSlice.actions;
// export default loginSlice.reducer;
