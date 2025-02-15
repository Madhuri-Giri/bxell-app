/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { RouterProvider, createBrowserRouter, useNavigate } from 'react-router-dom';
import { routeArray } from './hooks/GetRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';

import { Helmet } from 'react-helmet';
function App() {
  const router = createBrowserRouter(routeArray, {
    basename: '/bxell/' // Set your base URL here
  });

  return (
    <>
      <ToastContainer
        position="top-left"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />
      <RouterProvider router={router} />
      <Helmet>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </Helmet>
    </>

  );
}

export default App;
