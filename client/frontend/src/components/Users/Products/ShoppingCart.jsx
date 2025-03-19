import { useEffect, useState } from "react";
import {
  CheckIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  getCartItemsFromDatabase,
  changeOrderItemQty,
  removeOrderItem,
} from "../../../redux/slices/cart/cartSlices";
import { fetchCoupon } from "../../../redux/slices/coupon/couponSlices";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import ErrorMsg from "../../ErrorMsg/ErrorMsg";
import SuccessMsg from "../../SuccessMsg/SuccessMsg";
import { current } from "@reduxjs/toolkit";


export default function ShoppingCart() {
  const dispatch = useDispatch();
  const [couponCode, setCouponCode] = useState(null);
  const { cartItems } = useSelector((state) => state?.carts);
  useEffect(() => {
    dispatch(getCartItemsFromDatabase());
  }, [dispatch]);

  const applyCouponSubmit = (e) => {
    e.preventDefault();
    dispatch(fetchCoupon(couponCode));
    setCouponCode("");
  };
  const { coupon, loading, error, isAdded } = useSelector(
    (state) => state?.coupons
  );

  //change quantity---------------------------------------------------------------------------------------------
  const changeOrderItemQtyHandler = async (productId, qty) => {
    try {
      await dispatch(changeOrderItemQty({ productId, qty })); // Update quantity
      dispatch(getCartItemsFromDatabase()); // Fetch updated cart items from database
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
    }
  };
  //remove cartItem---------------------------------------------------------------------------------------------
  const removeCartItem = (productId) => {
    dispatch(removeOrderItem(productId)) // First, remove item from cart state
      .then(() => {
        dispatch(getCartItemsFromDatabase()); // Then fetch updated cart items
      })
      .catch((error) => console.error("Error removing cart item:", error));
  };

  let sumOfTotalPrice;
  sumOfTotalPrice = cartItems.reduce((sum, cart) => {
    const itemTotal = cart.items.reduce(
      (itemSum, item) => itemSum + item.totalPrice,
      0
    );
    return sum + itemTotal;
  }, 0);

  //check if coupon found
  if (coupon) {
    sumOfTotalPrice =
      sumOfTotalPrice - (sumOfTotalPrice * coupon?.coupon?.discount) / 100;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-24 lg:px-8">
        {cartItems?.length <= 0 || cartItems[0]?.items?.length <= 0 ? (
          <h1 className="text-center text-3xl font-bold text-gray-800">
            Your Shopping Cart is Empty 🛒
          </h1>
        ) : (
          <>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">
              🛍️ Shopping Cart
            </h1>
            <div className="mt-12 grid lg:grid-cols-12 gap-10">
              {/* Cart Items Section */}
              <section
                aria-labelledby="cart-heading"
                className="lg:col-span-7 bg-white p-6 rounded-xl shadow-md"
              >
                <h2 id="cart-heading" className="sr-only">
                  Items in your shopping cart
                </h2>
                <ul className="divide-y divide-gray-200">
                  {cartItems.map((cartItem) => (
                    <div key={cartItem._id}>
                      {cartItem.items?.map((item) => (
                        <li key={item._id} className="flex py-6 items-center">
                         
                          <Link to={`/product/${item?.product?._id}`}>
                          <img
                            src={item.product.images[0]}
                            alt={item?.product?.name || "Product Image"}
                            className="h-24 w-24 rounded-lg object-cover shadow-md"
                          />
                          </Link>
                          <div className="ml-6 flex-1">
                            <h3 className="text-lg font-medium text-gray-700">
                              {item.product.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {item?.color} | {item.size}
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                              ₹ {item.product?.price} x {item.qty} ={" "}
                              <span className="text-indigo-600">
                                {item?.totalPrice}
                              </span>
                            </p>
                          </div>

                          {/* Quantity Selector */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                changeOrderItemQtyHandler(
                                  item?.product._id,
                                  Math.max(1, item.qty - 1)
                                )
                              }
                              className={`px-3 py-1 rounded-md text-white font-semibold transition ${
                                item.qty <= 1
                                  ? "bg-gray-300 cursor-not-allowed"
                                  : "bg-orange-500 hover:bg-orange-600"
                              }`}
                              disabled={item.qty <= 1} // Prevent reducing below 1
                            >
                              -
                            </button>

                            <span className="text-lg font-semibold">
                              {item.qty}
                            </span>

                            <button
                              onClick={() =>
                                changeOrderItemQtyHandler(
                                  item?.product._id,
                                  Math.min(item?.product?.qtyLeft, item.qty + 1)
                                )
                              }
                              className={`px-3 py-1 rounded-md text-white font-semibold transition ${
                                item.qty >= item?.product?.qtyLeft
                                  ? "bg-gray-300 cursor-not-allowed"
                                  : "bg-green-500 hover:bg-green-600"
                              }`}
                              disabled={item.qty >= item?.product?.qtyLeft} // Prevent exceeding stock
                            >
                              +
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeCartItem(item?.product?._id)}
                            className="ml-4 text-gray-500 hover:text-red-600 transition"
                          >
                            <XMarkIcon className="h-6 w-6" />
                          </button>
                        </li>
                      ))}
                    </div>
                  ))}
                </ul>
              </section>

              {/* Order Summary */}
              <section className="lg:col-span-5 bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-lg font-medium text-gray-900">
                  📋 Order Summary
                </h2>
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-lg font-medium text-gray-900">
                      ₹ {sumOfTotalPrice}
                    </span>
                  </div>

                  {/* Coupon Section */}
                  <div className="border-t border-gray-200 pt-4">
                    <span className="text-sm text-gray-600">
                      Have a coupon code? 🎟️
                    </span>
                    {error && <p className="text-red-500">{error?.message}</p>}
                    {isAdded && (
                      <p className="text-green-600 font-medium">
                        🎉 Congratulations! You got{" "}
                        {couponFound?.coupon?.discountInPercentage}% discount!
                      </p>
                    )}
                    <form
                      onSubmit={applyCouponSubmit}
                      className="mt-2 flex gap-2"
                    >
                      <input
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        type="text"
                        className="flex-1 border p-2 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Enter coupon code"
                      />
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition"
                      >
                        Apply
                      </button>
                    </form>
                  </div>

                  <div className="flex justify-between border-t border-gray-200 pt-4">
                    <span className="text-lg font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-xl font-bold text-indigo-600">
                      ₹ {sumOfTotalPrice}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <div className="mt-6">
                  <Link
                    to="/order-payment"
                    state={sumOfTotalPrice}
                    className="block w-full text-center bg-indigo-600 text-white py-3 rounded-lg shadow-md hover:bg-indigo-700 transition"
                  >
                    Proceed to Checkout ➡️
                  </Link>
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
