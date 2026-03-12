import React, { useEffect, lazy, Suspense } from "react";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import AuthRoute from "./components/Authenciation/AuthRoute";
import AdminCheck from "./components/Authenciation/AdminCheck";
import { setNavigate } from "./utils/axiosConfig";
import FullPageLoader from "./components/HomePage/FullPageLoader";


/* -------------------- Lazy Imports -------------------- */

// Home
const HomePage = lazy(() => import("./components/HomePage/HomePage"));
const AllCategories = lazy(() => import("./components/HomePage/AllCategories"));

// Products
const Product = lazy(() => import("./components/Users/Products/Product"));
const ProductsFilters = lazy(() =>
  import("./components/Users/Products/ProductsFilters")
);
const ShoppingCart = lazy(() =>
  import("./components/Users/Products/ShoppingCart")
);
const WishList = lazy(() => import("./components/Users/Products/WishList"));
const OrderPayment = lazy(() =>
  import("./components/Users/Products/OrderPayment")
);
const ThanksForOrdering = lazy(() =>
  import("./components/Users/Products/ThanksForOrdering")
);

// Users
const Login = lazy(() => import("./components/Users/Forms/Login"));
const RegisterForm = lazy(() =>
  import("./components/Users/Forms/RegisterForm")
);
const OtpVerification = lazy(() =>
  import("./components/Users/Forms/OtpVerification")
);

const ProfilePage = lazy(() =>
  import("./components/Users/userProfile/ProfilePage")
);
const Orders = lazy(() => import("./components/Users/userProfile/Orders"));
const Wallet = lazy(() => import("./components/Users/userProfile/Wallet"));
const ShippingAddressDetails = lazy(() =>
  import("./components/Users/userProfile/ShippingAddressDetails")
);

const CustomerProfile = lazy(() =>
  import("./components/Users/Profile/CustomerProfile")
);

// Reviews
const AddReview = lazy(() => import("./components/Users/Reviews/AddReview"));

// Admin Dashboard
const AdminDashboard = lazy(() =>
  import("./components/Admin/AdminDashboard")
);

// Products Admin
const AddProduct = lazy(() =>
  import("./components/Admin/Products/AddProduct")
);
const ManageStocks = lazy(() =>
  import("./components/Admin/Products/ManageStocks")
);
const ProductUpdate = lazy(() =>
  import("./components/Admin/Products/ProductUpdate")
);

// Categories Admin
const AddCategory = lazy(() =>
  import("./components/Admin/Categories/AddCategory")
);
const ManageCategories = lazy(() =>
  import("./components/Admin/Categories/ManageCategories")
);
const UpdateCategory = lazy(() =>
  import("./components/Admin/Categories/UpdateCategory")
);
const AddBrand = lazy(() => import("./components/Admin/Categories/AddBrand"));
const ManageBrands = lazy(() =>
  import("./components/Admin/Categories/ManageBrands")
);
const AddColor = lazy(() => import("./components/Admin/Categories/AddColor"));
const ColorLists = lazy(() =>
  import("./components/Admin/Categories/ColorLists")
);

// Coupons
const AddCoupon = lazy(() =>
  import("./components/Admin/Coupons/AddCoupon")
);
const ManageCoupons = lazy(() =>
  import("./components/Admin/Coupons/ManageCoupons")
);
const UpdateCoupon = lazy(() =>
  import("./components/Admin/Coupons/UpdateCoupon")
);

// Offers
const AddOffer = lazy(() =>
  import("./components/Admin/Offers/AddOffer")
);
const ManageOffers = lazy(() =>
  import("./components/Admin/Offers/ManageOffers")
);
const UpdateOffer = lazy(() =>
  import("./components/Admin/Offers/UpdateOffer")
);

// Orders
const OrdersList = lazy(() =>
  import("./components/Admin/Orders/OrdersList")
);
const ManageOrders = lazy(() =>
  import("./components/Admin/Orders/ManageOrders")
);
const UpdateOrders = lazy(() =>
  import("./components/Admin/Orders/UpdateOrders")
);

// Customers
const Customers = lazy(() =>
  import("./components/Admin/Customers/Customers")
);

/* -------------------- Layout -------------------- */

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      {children}
      {!isAdminRoute && <Footer />}
    </>
  );
};

/* -------------------- App -------------------- */

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return (
    <Layout>
      <Suspense fallback={<FullPageLoader />}>
        <Routes>

          {/* ---------------- Admin Routes ---------------- */}

          <Route
            path="admin"
            element={
              <AdminCheck>
                <AdminDashboard />
              </AdminCheck>
            }
          >
            <Route path="" element={<OrdersList />} />

            {/* Products */}
            <Route path="add-product" element={<AddProduct />} />
            <Route path="manage-products" element={<ManageStocks />} />
            <Route path="products/edit/:id" element={<ProductUpdate />} />

            {/* Coupons */}
            <Route path="add-coupon" element={<AddCoupon />} />
            <Route path="manage-coupon" element={<ManageCoupons />} />
            <Route path="manage-coupon/edit/:code" element={<UpdateCoupon />} />

            {/* Offers */}
            <Route path="add-offer" element={<AddOffer />} />
            <Route path="manage-offer" element={<ManageOffers />} />
            <Route path="manage-offer/edit/:code" element={<UpdateOffer />} />

            {/* Categories */}
            <Route path="add-category" element={<AddCategory />} />
            <Route path="manage-category" element={<ManageCategories />} />
            <Route path="edit-category/:id" element={<UpdateCategory />} />

            {/* Brands */}
            <Route path="add-brand" element={<AddBrand />} />
            <Route path="all-brands" element={<ManageBrands />} />

            {/* Colors */}
            <Route path="add-color" element={<AddColor />} />
            <Route path="all-colors" element={<ColorLists />} />

            {/* Orders */}
            <Route path="manage-orders" element={<ManageOrders />} />
            <Route path="order-details/:id" element={<UpdateOrders />} />

            {/* Customers */}
            <Route path="customers" element={<Customers />} />
          </Route>

          {/* ---------------- Public Routes ---------------- */}

          <Route path="/" element={<HomePage />} />
          <Route path="/products-filters" element={<ProductsFilters />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/all-categories" element={<AllCategories />} />
          <Route path="/success" element={<ThanksForOrdering />} />

          {/* Reviews */}
          <Route
            path="/add-review/:id"
            element={
              <AuthRoute>
                <AddReview />
              </AuthRoute>
            }
          />

          {/* Wishlist */}
          <Route
            path="/wishlist"
            element={
              <AuthRoute>
                <WishList />
              </AuthRoute>
            }
          />

          {/* Cart */}
          <Route
            path="/shopping-cart"
            element={
              <AuthRoute>
                <ShoppingCart />
              </AuthRoute>
            }
          />

          {/* Payment */}
          <Route
            path="/order-payment"
            element={
              <AuthRoute>
                <OrderPayment />
              </AuthRoute>
            }
          />

          {/* Auth */}
          <Route
            path="/login"
            element={
              <GoogleOAuthProvider
                clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
              >
                <Login />
              </GoogleOAuthProvider>
            }
          />

          <Route
            path="/register"
            element={
              <GoogleOAuthProvider
                clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
              >
                <RegisterForm />
              </GoogleOAuthProvider>
            }
          />

          <Route path="/verify-otp" element={<OtpVerification />} />

          {/* Profile */}
          <Route path="/user-profile" element={<ProfilePage />}>
            <Route path="orders" element={<Orders />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="addresses" element={<ShippingAddressDetails />} />
          </Route>

          <Route
            path="/customer-profile"
            element={
              <AuthRoute>
                <CustomerProfile />
              </AuthRoute>
            }
          />

        </Routes>
      </Suspense>
    </Layout>
  );
};

export default App;