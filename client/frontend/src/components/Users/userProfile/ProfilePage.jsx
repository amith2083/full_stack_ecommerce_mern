import { useState } from "react";
import { Link,Outlet, useLocation } from "react-router-dom";
import { Home, MapPin, ShoppingBag, Wallet } from "lucide-react";

const ProfilePage = () => {
  const [active, setActive] = useState("dashboard");
  const location = useLocation()

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-5">
        <h2 className="text-xl font-bold text-gray-700 mb-6">My Profile</h2>
        <nav className="space-y-4">
          <Link
            to="/user-profile"
            className={`flex items-center space-x-2 p-3 rounded-lg transition-all ${
              active === "dashboard" ? "bg-green-500 text-white" : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActive("dashboard")}
          >
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/user-profile/addresses"
            className={`flex items-center space-x-2 p-3 rounded-lg transition-all ${
              active === "addresses" ? "bg-green-500 text-white" : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActive("addresses")}
          >
            <MapPin className="w-5 h-5" />
            <span>Addresses</span>
          </Link>
          <Link
            to="/user-profile/orders"
            className={`flex items-center space-x-2 p-3 rounded-lg transition-all ${
              active === "orders" ? "bg-green-500 text-white" : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActive("orders")}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Orders</span>
          </Link>
          <Link
            to="/user-profile/wallet"
            className={`flex items-center space-x-2 p-3 rounded-lg transition-all ${
              active === "wallet" ? "bg-green-500 text-white" : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActive("wallet")}
          >
            <Wallet className="w-5 h-5" />
            <span>Wallet</span>
          </Link>
        </nav>
      </div>
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Show the profile header only if the user is on "/user-profile", but not "/user-profile/orders" */}
        {location.pathname === "/user-profile" && (
          <>
            <h1 className="text-2xl font-semibold text-gray-800">Profile Page</h1>
            <p className="text-gray-600 mt-2">Manage your profile settings, orders, and wallet.</p>
          </>
        )}

        {/* Nested Components Render Here */}
        <Outlet />
      </div>
    </div>
  );
};

export default ProfilePage;