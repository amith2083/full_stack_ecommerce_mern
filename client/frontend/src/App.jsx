import React from "react";
import { BrowserRouter, Route, Routes,Outlet, useLocation, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import AdminDashboard from "./components/Admin/AdminDashboard";
import ManageCoupons from "./components/Admin/Coupons/ManageCoupons";
import AddCoupon from "./components/Admin/Coupons/AddCoupon";
import Login from "./components/Users/Forms/Login";
import AddProduct from "./components/Admin/Products/AddProduct";
import RegisterForm from "./components/Users/Forms/RegisterForm";
import HomePage from "./components/HomePage/HomePage";
import Navbar from "./components/Navbar/Navbar";
import OrderHistory from "./components/Admin/Orders/ManageOrders";
import OrderPayment from "./components/Users/Products/OrderPayment";
import ManageCategories from "./components/Admin/Categories/ManageCategories";
// import UpdateProduct from "./components/Admin/Products/UpdateProduct";
import ManageStocks from "./components/Admin/Products/ManageStocks";
import CategoryToAdd from "./components/Admin/Categories/CategoryToAdd";
import AddCategory from "./components/Admin/Categories/AddCategory";
import AddBrand from "./components/Admin/Categories/AddBrand";
import AddColor from "./components/Admin/Categories/AddColor";
import AllCategories from "./components/HomePage/AllCategories";
import UpdateCoupon from "./components/Admin/Coupons/UpdateCoupon";
import Product from "./components/Users/Products/Product";
import ShoppingCart from "./components/Users/Products/ShoppingCart";
import ProductsFilters from "./components/Users/Products/ProductsFilters";
import CustomerProfile from "./components/Users/Profile/CustomerProfile";
import AddReview from "./components/Users/Reviews/AddReview";
import UpdateCategory from "./components/Admin/Categories/UpdateCategory";
import ThanksForOrdering from "./components/Users/Products/ThanksForOrdering";

import OrdersList from "./components/Admin/Orders/OrdersList";
import ManageOrders from "./components/Admin/Orders/ManageOrders";

import ManageBrands from "./components/Admin/Categories/ManageBrands";
import AuthRoute from "./components/Authenciation/AuthRoute";
import AdminCheck from "./components/Authenciation/AdminCheck";
import ProfilePage from "./components/Users/userProfile/ProfilePage";
import Orders from "./components/Users/userProfile/Orders";
import ProductUpdate from "./components/Admin/Products/ProductUpdate";
import OtpVerification from "./components/Users/Forms/OtpVerification";
import ShippingAddressDetails from "./components/Users/userProfile/ShippingAddressDetails";
import WishList from "./components/Users/Products/WishList";
import Wallet from "./components/Users/userProfile/Wallet";
import UpdateOrders from "./components/Admin/Orders/UpdateOrders";
import Customers from "./components/Admin/Customers/Customers";
import ColorLists from "./components/Admin/Categories/ColorLists";
import { setNavigate } from "./utils/axiosConfig";
import { useEffect } from "react";



// Function to handle conditional Navbar rendering
const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin"); // Check if route starts with /admin

  return (
    <>
      {!isAdminRoute && <Navbar />} {/* Show Navbar only if NOT an admin route */}
      {children}
    </>
  );
};

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate); // Set navigate function globally
  }, [navigate]);
  
  
  return (
   
    <Layout>
     
      {/* hide navbar if admin */}
      <Routes>
        {/* nested route */}
        <Route  path="admin" element={<AdminCheck>
          <AdminDashboard />
        </AdminCheck>}>
          {/* products */} 
          <Route path="" element={<AdminCheck><OrdersList /></AdminCheck>} />
          <Route path="add-product" element={<AdminCheck><AddProduct /></AdminCheck>} />
<Route path="manage-products" element={<AdminCheck><ManageStocks /></AdminCheck>} />
<Route path="products/edit/:id" element={<AdminCheck><ProductUpdate /></AdminCheck>} />
{/* coupons */}
<Route path="add-coupon" element={<AdminCheck><AddCoupon /></AdminCheck>} />
<Route path="manage-coupon" element={<AdminCheck><ManageCoupons /></AdminCheck>} />
<Route path="manage-coupon/edit/:code" element={<AdminCheck><UpdateCoupon /></AdminCheck>} />
{/* Category */}
<Route path="category-to-add" element={<AdminCheck><CategoryToAdd /></AdminCheck>} />
<Route path="add-category" element={<AdminCheck><AddCategory /></AdminCheck>} />
<Route path="manage-category" element={<AdminCheck><ManageCategories /></AdminCheck>} />
<Route path="edit-category/:id" element={<AdminCheck><UpdateCategory /></AdminCheck>} />
{/* brand category */}
<Route path="add-brand" element={<AdminCheck><AddBrand /></AdminCheck>} />
<Route path="all-brands" element={<AdminCheck><ManageBrands /></AdminCheck>} />
{/* color category */}
<Route path="add-color" element={<AdminCheck><AddColor /></AdminCheck>} />
<Route path="all-colors" element={<AdminCheck><ColorLists /></AdminCheck>} />
{/* Orders */}
<Route path="manage-orders" element={<AdminCheck><ManageOrders /></AdminCheck>} />
<Route path="order-details/:id" element={<AdminCheck><UpdateOrders /></AdminCheck>} />
         
          <Route path="customers" element={<AdminCheck><Customers /></AdminCheck>} />
        </Route>
        {/* public links */}
        {/* Products */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products-filters" element={<ProductsFilters />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/all-categories" element={<AllCategories />} />
        <Route path="/success" element={<ThanksForOrdering />} />
        {/* review */}
        <Route path="/add-review/:id" element={<AuthRoute><AddReview /></AuthRoute>} />

        {/* shopping cart &wishlist */}
        <Route path="/wishlist" element={<AuthRoute><WishList/></AuthRoute>} />
        
        <Route path="/shopping-cart" element={<AuthRoute><ShoppingCart /></AuthRoute>} />
        <Route path="/order-payment" element={<AuthRoute><OrderPayment /></AuthRoute>} />
        {/* users */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
              <RegisterForm />
            </GoogleOAuthProvider>} />
        <Route path="/verify-otp" element={<OtpVerification />} />

        {/* <Route path="/register" element={<RegisterForm />} /> */}
        <Route path="/user-profile" element={<ProfilePage />}>
  <Route path="/user-profile/orders" element={<Orders />} />
  <Route path="/user-profile/wallet" element={<Wallet />} />
  <Route path="/user-profile/addresses" element={<ShippingAddressDetails/>} />
</Route>
     
        <Route path="/customer-profile" element={<AuthRoute><CustomerProfile /></AuthRoute>} />
      </Routes>
      </Layout>
   
  );
};

export default App;
