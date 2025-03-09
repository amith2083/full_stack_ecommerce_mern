import { useDispatch, useSelector } from "react-redux";
import AddShippingAddress from "../Forms/AddShippingAddress";
import { useEffect, useState } from "react";
import { getCartItemsFromDatabase } from "../../../redux/slices/cart/cartSlices";
import { useLocation, useNavigate } from "react-router-dom";
import ShippingAddressModal from "../../shippingAddressModal";
import { getUser } from "../../../redux/slices/users/userSlices";
import { createOrder } from "../../../redux/slices/order/orderSlices";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import ErrorMsg from "../../ErrorMsg/ErrorMsg";

export default function OrderPayment() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const sumOfTotalPrice = location.state;
  const [selectedPayment, setSelectedPayment] = useState("razorpay");

  useEffect(() => {
    dispatch(getCartItemsFromDatabase());
  }, [dispatch]);
  const { cartItems } = useSelector((state) => state?.carts);
  //---get cart items from store---

  console.log("selected", selectedAddress);
  const calculateTotalDiscountedPrice = () => {};

  const { loading, error, profile } = useSelector((state) => state?.users);
  const user = profile?.user?.shippingAddress;
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);
  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cartItems,
        shippingAddress: selectedAddress,
        totalPrice: sumOfTotalPrice,
        paymentMethod: selectedPayment,
        navigate,
      })
    );
  };
  const { loading: orderLoading, error: orderError } = useSelector(
    (state) => state?.orders
  );

  return (
    <>
      <div className="bg-gray-100 min-h-screen py-12">
        
        {orderError && <ErrorMsg message={orderError?.message} />}
        <main className="max-w-7xl mx-auto px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Section - Shipping */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Shipping Address
              </h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-35 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Select Shipping Address
              </button>
              <ShippingAddressModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelectAddress={setSelectedAddress}
              />
              <AddShippingAddress selectedAddress={selectedAddress} />
            </div>

            {/* Right Section - Order Summary */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-900">
                Order Summary
              </h2>
              <div className="mt-4 space-y-4 ">
                {cartItems?.map((cartItem) => (
                  <div key={cartItem._id} className="border-b pb-4">
                    {cartItem.items?.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center gap-4 mb-3"
                      >
                        <img
                          src={item?.product.images[0]}
                          className="w-20 h-20 object-cover rounded-md"
                          alt="Product"
                        />
                        <div>
                          <p className="text-gray-800 font-medium">
                            {item?.product?.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Size: {item?.size} | Color: {item?.color}
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            ₹ {item?.totalPrice} x {item?.qty}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxes</span>
                  <span className="font-medium">₹0.00</span>
                </div>
                <div className="flex justify-between text-lg font-semibold mt-3">
                  <span>Total</span>
                  <span className="text-gray-900">₹ {sumOfTotalPrice}.00</span>
                </div>
              </div>

            
              <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Select Payment Method
                </h2>
                <div className="mt-4 space-y-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={selectedPayment === "razorpay"}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                    />
                    <span>Pay with Razorpay</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="wallet"
                      checked={selectedPayment === "wallet"}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                    />
                    <span>Pay with Wallet </span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={selectedPayment === "cod"}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                    />
                    <span>Cash on Delivery (COD)</span>
                  </label>
                  <div className="mt-6">
              {orderLoading ? (
                <LoadingComponent />
              ) : (
                <button
                  onClick={placeOrderHandler}
                  className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition shadow-md"
                >
                  Confirm Payment 
                </button>
              )}
            </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
