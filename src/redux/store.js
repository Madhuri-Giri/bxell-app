import { configureStore } from "@reduxjs/toolkit";
// import loginSlice from '../redux/slice/loginSlice';

const store = configureStore({
  reducer: {
    //  loginReducer: loginSlice,
  }
})
export default store