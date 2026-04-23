
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import MainLayout from "./Layouts/MainLayout/MainLayout";
import AuthLayout from "./Layouts/AuthLayout/AuthLayout";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Shop from "./pages/Shop/Shop";
import Notfound from "./pages/Notfound/Notfound";
import Products from "./pages/Products/Products";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import MyProfile from "./pages/MyProfile/MyProfile";
import Address from "./pages/Address/Address";
import Wishlist from "./pages/Wishlist/Wishlist";
import Cart from "./pages/Cart/Cart";
import Orders from "./pages/Orders/Orders";
import Checkout from "./pages/Checkout/Checkout";

import Contact from "./pages/Contact/Contact";

import Register from "./pages/Auth/Register/Register";
import Login from "./pages/Auth/Login/Login";
import ForgetPassword from "./pages/ForgetPassword/ForgetPassword";

import PaymentFailed from "./pages/PaymentFailed/PaymentFailed";
import PaymentSuccess from "./pages/Paymentsuccess/Paymentsuccess";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: <MainLayout />,
      children: [
        { index: true, element: <Navigate to="/home" /> },
        { path: "/home",                  element: <Home /> },
        { path: "/about",                 element: <About /> },
        { path: "/contact",               element: <Contact /> },
        { path: "/shop",                  element: <Shop /> },
        { path: "/products",              element: <Products /> },
        { path: "/products/:productId",   element: <ProductDetails /> },
        { path: "/profile",               element: <MyProfile /> },
        { path: "/address",               element: <Address /> },
        { path: "/wishlist",              element: <Wishlist /> },
        { path: "/cart",                  element: <Cart /> },
        { path: "/orders",                element: <Orders /> },
        { path: "/checkout",              element: <Checkout /> },
        { path: "/payment/success",       element: <PaymentSuccess /> },
        { path: "/payment/failed",        element: <PaymentFailed /> },
        { path: "*",                      element: <Notfound /> },
      ],
    },
    {
      path: "",
      element: <AuthLayout />,
      children: [
        { path: "login",            element: <Login /> },
        { path: "register",         element: <Register /> },
        { path: "forget-password",  element: <ForgetPassword /> },
      ],
    },
  ]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} closeOnClick pauseOnHover />
      <RouterProvider router={router} />
    </>
  );
}