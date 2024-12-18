import BoostListing from "../components/About/Choose-Plan/boostListing/BoostListing";
import BoostListing1 from "../components/About/Choose-Plan/boostListing/BoostListing1";
import BlogDetails from "../components/Blog/BlogDetails";
import BlogMainContent from "../components/Blog/BlogMainContent";
import PropertyBuySinglePage from "../components/Buy/BuyProperty/PropertyBuySinglePage";
import SingleBlog from "../components/Home/Blog/SingleBlog";
import HouseApartment from "../components/SellProperty/SellPropertyForm/HouseApartment";
import Land from "../components/SellProperty/SellPropertyForm/Land";
import Page3Common from "../components/SellProperty/SellPropertyForm/Page3Common";
import Page3Land from "../components/SellProperty/SellPropertyForm/Page3Land";
import Page3ROC from "../components/SellProperty/SellPropertyForm/Page3ROC";
import RentalOfficeComplex from "../components/SellProperty/SellPropertyForm/RentalOfficeComplex";
import AboutUs from "../pages/AboutUs";
import Blog from "../pages/Blog";
import Buy from "../pages/Buy";
import ExploreAllListing from "../pages/ExploreAllListing";
import Home from "../pages/Home";
import LoginPage from "../pages/LoginPage";
import Profile from "../pages/Profile";
import RegistrationPage from "../pages/Registration";
import Sell from "../pages/Sell";
import SellBusiness from "../pages/SellBusiness";
import SellProperty from "../pages/SellProperty";

export const routeArray = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/aboutUs",
    element: <AboutUs />,
  },
  {
    path: "/buy",
    element: <Buy />,
  },
  {
    path: "/sell",
    element: <Sell />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/sell-business",
    element: <SellBusiness />,
  },
  {
    path: "/sell-property",
    element: <SellProperty />,
  },
  {
    path: "/test",
    element: <HouseApartment/>
  },
  {
    path: "/test1",
    element: <RentalOfficeComplex/>
  },
  {
    path: "/test2",
    element: <Page3Common/>
  },
  {
    path: "/test3",
    element: <Page3ROC/>
  },
  {
    path: "/test4",
    element: <Land/>
  },
  {
    path: "/test5",
    element: <Page3Land/>
  },
  {
    path: "/single-page",
    element: <PropertyBuySinglePage />,
  },
  {
    path: "/explore-listings",
    element: <ExploreAllListing />,
  },
  {
    path: "/blog",
    element: <Blog />,
  },
  {
    path: "/blog-details/:id",
    element: <BlogDetails />,
  },

  {
    path: "/boost-listing",
    element: <BoostListing />,
  },

  {
    path: "/boost-listing1",
    element: <BoostListing1 />,
  },

  {
    path: "/blog-details",
    element: <BlogMainContent />,
  },
  {
    path: "/single-blog",
    element: <SingleBlog />,
  },

  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/register",
    element: <RegistrationPage />,
  },

  // {
  //   path: "*",
  //   element: <SomethingWentWrong />,
  // },
];
