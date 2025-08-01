import { Fragment, useEffect, useState } from "react";
import { Dialog, Popover, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  ShoppingCartIcon,
  UserIcon,
  XMarkIcon,
  HeartIcon,
  HomeIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "./logo3.png";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategory } from "../../redux/slices/category/categorySlices";
import { logoutAction } from "../../redux/slices/users/userSlices";
import { fetchCoupons } from "../../redux/slices/coupon/couponSlices";
import { getCartItemsFromDatabase } from "../../redux/slices/cart/cartSlices";
import { fetchWishlist } from "../../redux/slices/wishlist/wishListSlices";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userCookie = Cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie) : null;
  const isLoggedIn = !!user?.token;

  useEffect(() => {
    dispatch(fetchCategory());
    dispatch(getCartItemsFromDatabase());
    dispatch(fetchWishlist());
    dispatch(fetchCoupons());
  }, [dispatch]);

  const { categories } = useSelector((state) => state?.categories);
  const categoriesToDisplay = categories?.categories?.slice(0, 2) || [];
  const { cartItems } = useSelector((state) => state?.carts);
  const { wishLists } = useSelector((state) => state?.wishLists);
  const { coupons } = useSelector((state) => state?.coupons);

  const latestCoupon = coupons?.coupons?.[0];
  const isCouponValid = latestCoupon && !coupons?.coupons?.isExpired;

  const isActive = (path) => location.pathname === path;

  const logoutHandler = async () => {
    await dispatch(logoutAction());
    window.location.href = "/login";
  };

  return (
    <div className="bg-white">
      <header className="sticky top-0 z-50 shadow-md">
        <nav aria-label="Top">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center text-sm py-2">
            {isCouponValid
              ? `🎉 ${latestCoupon?.code} - ${latestCoupon?.discount}% OFF 🎉`
              : "No Flash Sale"}
          </div>

          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                {/* Logo */}
                <div className="flex-shrink-0">
                  <Link to="/">
                    <img src={logo} alt="Logo" className="h-12" />
                  </Link>
                </div>

                {/* Nav Links */}
                <div className="hidden lg:flex space-x-6 items-center">
                  <Link
                    to="/"
                    className={`flex items-center gap-1 text-sm font-medium ${
                      isActive("/") ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                    } transition`}
                  >
                    <HomeIcon className="h-4 w-4" /> Home
                  </Link>

                  {categoriesToDisplay.map((cat) => (
                    <Link
                      key={cat._id}
                      to={`/products-filters?category=${cat.name}`}
                      className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
                    >
                      <TagIcon className="h-4 w-4" /> {cat.name}
                    </Link>
                  ))}

                  {/* Add Create Account and Login links for non-logged-in users */}
                  {!isLoggedIn && (
                    <>
                      <Link
                        to="/register"
                        className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
                      >
                        Create Account
                      </Link>
                      <Link
                        to="/login"
                        className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
                      >
                        Login
                      </Link>
                    </>
                  )}
                </div>

                {/* Icons Section */}
                <div className="flex items-center space-x-4">
                  {isLoggedIn && (
                    <>
                      {user?.user?.isAdmin && (
                        <Link
                          to="/admin"
                          className="text-sm font-semibold bg-orange-400 text-black hover:text-blue-800 px-4 py-2 border border-blue-600 rounded-md"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <Link to="/user-profile">
                        <UserIcon className="h-6 w-6 text-gray-600 hover:text-blue-600" />
                      </Link>
                      <button onClick={logoutHandler}>
                        <LogOut className="h-6 w-6 text-gray-600 hover:text-red-600" />
                      </button>
                    </>
                  )}

                  <Link to="/wishlist" className="relative group">
                    <HeartIcon className="h-6 w-6 text-gray-600 group-hover:text-pink-500" />
                    {wishLists?.length > 0 && (
                      <span className="absolute -top-1 -right-2 bg-pink-600 text-white text-xs px-1.5 py-0.5 rounded-full animate-bounce">
                        {wishLists?.length}
                      </span>
                    )}
                  </Link>

                  <Link to="/shopping-cart" className="relative group">
                    <ShoppingCartIcon className="h-6 w-6 text-gray-600 group-hover:text-green-500" />
                    {cartItems?.length > 0 && (
                      <span className="absolute -top-1 -right-2 bg-green-600 text-white text-xs px-1.5 py-0.5 rounded-full animate-bounce">
                        {cartItems[0]?.items?.length || 0}
                      </span>
                    )}
                  </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="lg:hidden">
                  <button
                    onClick={() => setMobileMenuOpen(true)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <Bars3Icon className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <Transition.Root show={mobileMenuOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileMenuOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative w-full max-w-xs bg-white shadow-xl overflow-y-auto">
                <div className="p-4 flex justify-between items-center">
                  <img src={logo} className="h-10" alt="Logo" />
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="space-y-4 px-4 pb-4">
                  <Link to="/" className="block text-sm font-medium text-gray-700 hover:text-blue-600">
                    Home
                  </Link>
                  {categoriesToDisplay.map((cat) => (
                    <Link
                      key={cat._id}
                      to={`/products-filters?category=${cat.name}`}
                      className="block text-sm font-medium text-gray-700 hover:text-blue-600"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  {!isLoggedIn && (
                    <>
                      <Link to="/register" className="block text-sm font-medium text-gray-700 hover:text-blue-600">
                        Create Account
                      </Link>
                      <Link to="/login" className="block text-sm font-medium text-gray-700 hover:text-blue-600">
                        Login
                      </Link>
                    </>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}