import React, { useEffect, useState } from "react";
import OrderDetails from "./OrderDetail";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, retryPayment } from "../../../redux/slices/order/orderSlices";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchOrders()); // Fetch orders on component mount
  }, [dispatch]);

  const { orders, loading } = useSelector((state) => state?.orders);
  
  console.log("Orders from Redux:", orders);
  const handleRetryPayment =({orderId,totalPrice})=>{
    return  dispatch(retryPayment({orderId,totalPrice,navigate}))
  }

  const ordersPerPage = 2;
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders?.orders?.slice(indexOfFirstOrder, indexOfLastOrder) || [];

  if (loading) {
    return <p className="text-center text-lg text-blue-600 font-semibold">Loading orders...</p>;
  }

  if (!orders?.orders || orders.orders.length === 0) {
    return <p className="text-center text-lg text-red-500 font-semibold">No orders found.</p>;
  }

  if (selectedOrder) {
    return <OrderDetails order={selectedOrder} goBack={() => setSelectedOrder(null)} />;
  }

  return (
    <div className="p-6 bg-white min-h-screen text-white">
      <h2 className="text-3xl font-bold text-center mb-6">📦 Your Orders</h2>
      
      <div className="grid gap-6">
        {currentOrders.map((order, index) => (
          <div key={order._id || index} className="bg-white p-6 rounded-lg shadow-xl transform hover:scale-105 transition duration-300 ease-in-out">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">📄 #{order.orderNumber}</h3>
              <span
                className={`px-4 py-1 text-sm font-semibold rounded-full shadow-lg ${
                  order.status === "Processing" ? "bg-yellow-500 text-white" : "bg-red-500 text-white"
                }`}
              >
                {order.status}
              </span>
            </div>

            {/* Order Items */}
            <div className="mt-3 flex space-x-2 overflow-x-auto">
              {order.orderItems.map((item) =>
                item.items.map((product, idx) => (
                  <img
                    key={idx}
                    src={product.product.images[0] || "https://via.placeholder.com/50"}
                    alt={product.product.name}
                    className="w-14 h-14 rounded-full border-2 border-gray-300 shadow-md"
                  />
                ))
              )}
            </div>

            <p className="text-gray-700 mt-2">🗓 {new Date(order.createdAt).toDateString()}</p>
            <p className="text-gray-900 font-medium">💰 Rs {order.totalPrice} for {order.orderItems.reduce((acc, item) => acc + item.items.length, 0)} item(s)</p>
            <p className="text-gray-900 font-medium">💳 Payment Status: <span className="text-green-500">{order.paymentStatus}</span></p>

            {/* Buttons */}
            <div className="mt-4 flex space-x-3">
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition transform hover:scale-110 duration-300"
                onClick={() => setSelectedOrder(order)}
              >
                🔍 View
              </button>
              {/* <button 
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg transition transform hover:scale-110 duration-300"
              >
                ❌ Cancel
              </button> */}
              {/* Dynamic Button Logic */}
              {order.paymentStatus === "Failed" ? (
                <button 
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-lg transition transform hover:scale-110 duration-300"
                  onClick={() => handleRetryPayment({orderId:order._id,totalPrice:order.totalPrice})}
                >
                  🔁 Retry
                </button>
              ) : order.status === "delivered" ? (
                <button 
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow-lg transition transform hover:scale-110 duration-300"
                >
                  🔄 Return
                </button>
              ) : (
                <button 
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg transition transform hover:scale-110 duration-300"
                >
                  ❌ Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center">
        <button 
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
          disabled={currentPage === 1} 
          className={`px-4 py-2 rounded-lg shadow-lg transition duration-300 ${
            currentPage === 1 ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          ⬅️ Previous
        </button>
        
        <span className="text-lg font-semibold">📄 Page {currentPage}</span>
        
        <button 
          onClick={() => setCurrentPage((prev) => (indexOfLastOrder < orders?.orders?.length ? prev + 1 : prev))} 
          disabled={indexOfLastOrder >= orders?.orders?.length} 
          className={`px-4 py-2 rounded-lg shadow-lg transition duration-300 ${
            indexOfLastOrder >= orders?.orders?.length ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          Next ➡️
        </button>
      </div>
    </div>
  );
};

export default Orders;
