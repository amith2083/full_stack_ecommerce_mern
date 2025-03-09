import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrder, updateOrder } from "../../../redux/slices/order/orderSlices";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

const UpdateOrders = () => {
    const dispatch = useDispatch();
    const{id}=useParams()
  const { order, loading } = useSelector((state) => state?.orders);
  console.log('orderdetails',order)
  


  useEffect(() => {
    dispatch(fetchOrder(id));
  }, [dispatch, id]);
  // const [orders, setOrder] = React.useState({
  //   status: "pending",
  // });
  const [status, setStatus] = useState("pending");
  useEffect(() => {
    if (order?.order?.status) {
      setStatus(order.order.status);
    }
  }, [order]);
  const handleUpdate = (e) => {
    dispatch(updateOrder({ id, status }))
    .unwrap()
    .then(() => {Swal.fire({
      icon: "success",
      title: "status updated",
      text: "order status is updated successfully.",
      timer: 3000,
      showConfirmButton: false,
    });
    dispatch(fetchOrder(id)); 

  })
    
    .catch((error) =>   Swal.fire({
      icon: "error",
      title: "Update Failed",
      text: `Failed to update order status: ${error.message}`,
    }));
  };
  // const onChange = (e) => {
  //   setStatus(e.target.value)
  // };

  return (
    
    <div className="p-6 bg-white shadow rounded-md">
      <h2 className="text-lg font-semibold text-gray-800">Update Order</h2>

      {loading ? (
        <p>Loading order details...</p>
      ) : order ? (
        <div>
          {/* Order Status Update */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Order Status
            </label>
            <select
              name="status"
              onChange={(e) => setStatus(e.target.value)}
              value={status}
              className="mt-1 block w-full rounded-md border-2 border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
            <button
              onClick={handleUpdate}
              className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Update Status
            </button>
          </div>

          {/* Shipping Address */}
          <div className="mt-6 p-4 border rounded-md bg-gray-100">
            <h3 className="font-semibold text-gray-700">Shipping Address</h3>
            <p>
              {order?.order?.shippingAddress?.firstName} {order?.order?.shippingAddress?.lastName}
            </p>
            <p>{order?.order?.shippingAddress?.address}</p>
            <p>
              {order?.order?.shippingAddress?.city}, {order?.order?.shippingAddress?.postalCode}
            </p>
            <p>{order?.order?.shippingAddress?.phone}</p>
          </div>

          {/* Order Items */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-700">Order Items</h3>
            <ul className="divide-y divide-gray-300">
            {order?.order?.orderItems?.map((orderItem) => (
                orderItem?.items.map((item) => (
                  <li key={item._id} className="py-3 flex justify-between">
                    <div>
                    <img
              src={item.product.images[0]} 
              alt={item.product.name} 
              className="w-16 h-16 object-cover rounded-md"
            />
                      <p className="text-gray-800 font-medium">{item.product.name}</p>
                      <p className="text-gray-500 text-sm">Size: {item.size} | Color: {item.color}</p>
                    </div>
                    <div>
                      <p className="text-gray-800 font-semibold">₹ {item.totalPrice}</p>
                      <p className="text-gray-500 text-sm">{item.qty} x ₹ {item.product.price}</p>
                    </div>
                  </li>
                ))
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p>Order not found.</p>
      )}
    </div>
  );
};

export default UpdateOrders;
