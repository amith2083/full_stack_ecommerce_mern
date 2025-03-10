import { useDispatch, useSelector } from "react-redux";
import OrdersStats from "./OrdersStatistics";
import { useEffect, useState } from "react";
import { fetchOrders } from "../../../redux/slices/order/orderSlices";
import { Link } from "react-router-dom";

export default function OrdersList() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const { orders, loading, error } = useSelector((state) => state?.orders);
  console.log("orders", orders);
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  // Calculate total pages
  const totalOrders = orders?.orders?.length || 0;
  const totalPages = Math.ceil(totalOrders / ordersPerPage);

  // Get current page orders
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders?.orders?.slice(indexOfFirstOrder, indexOfLastOrder);

  // Pagination Handlers
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Orders Management</h2>
      </div>

      {/* Order Statistics */}
      <OrdersStats />

      {/* Table Title */}
      <h3 className="text-lg font-medium leading-6 text-gray-900 mt-6">Recent Orders</h3>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-lg shadow-lg mt-4 border border-gray-200">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Order ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Payment Method</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Payment Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Order Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Total</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {currentOrders?.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 transition">
                <td className="py-4 px-4 text-sm font-medium text-gray-900">{order.orderNumber}</td>
                <td className="px-4 py-4 text-sm text-gray-600">{order.paymentMethod}</td>
                <td className="px-4 py-4 text-sm text-gray-600"> <span
                    className={`px-2 py-1 rounded-md text-xs font-semibold ${
                      order.paymentStatus === "Paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.paymentStatus}
                  </span></td>
                <td className="px-4 py-4 text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-semibold ${
                      order.status === "pending"
                      ? "bg-yellow-200 text-yellow-800"   
                      : order.status === "processing"
                      ? "bg-blue-200 text-blue-800"      
                      : order.status === "shipped"
                      ? "bg-orange-200 text-orange-800"  
                      : order.status === "delivered"
                      ? "bg-green-200 text-green-800"    
                      : order.status === "cancelled"
                      ? "bg-red-200 text-red-800"       
                      : "bg-gray-200 text-gray-800"      // Default color
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">₹{order.totalPrice.toFixed(2)}</td>
                <td className="px-4 py-4 text-center">
                  <Link to={`order-details/${order._id}`}
                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium transition"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       {/* Pagination Controls */}
       <div className="flex justify-between items-center mt-4">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            currentPage === 1
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          Previous
        </button>
        <span className="text-gray-700 text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          Next
        </button>
      </div>

      {/* Error & Loading Handling */}
      {loading && <p className="text-blue-600 text-center mt-4">Loading orders...</p>}
      {error && <p className="text-red-600 text-center mt-4">Error: {error}</p>}
    </div>
  );
}
