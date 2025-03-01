import { useEffect, useState } from "react";
import {
  CheckIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getCartItemsFromDatabase,changeOrderItemQty,removeOrderItem } from "../../../redux/slices/cart/cartSlices";
import { fetchCoupon } from "../../../redux/slices/coupon/couponSlices";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import ErrorMsg from "../../ErrorMsg/ErrorMsg";
import SuccessMsg from "../../SuccessMsg/SuccessMsg";
import { current } from "@reduxjs/toolkit";

export default function ShoppingCart() {
  
  const dispatch = useDispatch();
  const [couponCode, setCouponCode] = useState(null);
  const {cartItems}=useSelector((state)=>state?.carts)
  useEffect(()=>{dispatch(getCartItemsFromDatabase())},[dispatch])
 
  console.log('cart',cartItems);
 
  const applyCouponSubmit = (e) => {
    e.preventDefault();
    dispatch(fetchCoupon(couponCode));
    setCouponCode("");
  };
  const{coupon,loading,error,isAdded}= useSelector((state)=>state?.coupons)
  // const changeOrderItemQtyHandler =(productId,qty)=>{
  //   dispatch(changeOrderItemQty({productId,qty}));
  //   dispatch(getCartItemsFromDatabase());

  // }
  const changeOrderItemQtyHandler = (productId, qty) => {
    dispatch(async (dispatch) => {
      await dispatch(changeOrderItemQty({ productId, qty })); // Wait for the first action to complete
      dispatch(getCartItemsFromDatabase()); // Then fetch updated cart items
    });
  };
  //remove cartItem
  const removeCartItem = (productId) => {
    dispatch(async (dispatch) => {
      await dispatch(removeOrderItem( productId )); // Wait for the first action to complete
      dispatch(getCartItemsFromDatabase()); // Then fetch updated cart items
    });
  };
  // const sumOfTotalPrice = cartItems?.items?.reduce((acc,current)=>{
  //   return acc+current?.totalPrice

  // },0)
  let sumOfTotalPrice
   sumOfTotalPrice = cartItems.reduce((sum, cart) => {
    const itemTotal = cart.items.reduce((itemSum, item) => itemSum + item.totalPrice, 0);
    return sum + itemTotal;
  }, 0);
  //check if coupon found
  if(coupon){
    sumOfTotalPrice = sumOfTotalPrice-(sumOfTotalPrice*coupon?.coupon?.discount/100)
  }
  console.log('sum ', sumOfTotalPrice)
  
  // let cartItems;
  // let changeOrderItemQtyHandler;
  let removeOrderItemFromLocalStorageHandler;
  let calculateTotalDiscountedPrice;
  // let error;
  let couponFound;
 
  let setCoupon;
  // let loading;
  // let coupon;
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
              <section aria-labelledby="cart-heading" className="lg:col-span-7 bg-white p-6 rounded-xl shadow-md">
                <h2 id="cart-heading" className="sr-only">
                  Items in your shopping cart
                </h2>
                <ul className="divide-y divide-gray-200">
                  {cartItems.map((cartItem) => (
                    <div key={cartItem._id}>
                      {cartItem.items?.map((item) => (
                        <li key={item._id} className="flex py-6 items-center">
                          <img
                            src={item.product.images[0]}
                            alt={item?.product?.name || "Product Image"}
                            className="h-24 w-24 rounded-lg object-cover shadow-md"
                          />
                          <div className="ml-6 flex-1">
                            <h3 className="text-lg font-medium text-gray-700">
                              {item.product.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {item?.color} | {item.size}
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                              ₹ {item.product?.price} x {item.qty} ={" "}
                              <span className="text-indigo-600">{item?.totalPrice}</span>
                            </p>
                          </div>

                          {/* Quantity Selector */}
                          <select
                            onChange={(e) => changeOrderItemQtyHandler(item?.product._id, e.target.value)}
                            className="rounded-md border border-gray-300 py-1 px-3 text-gray-700 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                            {[...Array(item?.product?.qtyLeft)?.keys()].map((x) => (
                              <option key={x} value={x + 1}>
                                {x + 1}
                              </option>
                            ))}
                          </select>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeCartItem(item?.product?._id)}
                            className="ml-4 text-gray-500 hover:text-red-600 transition">
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
                <h2 className="text-lg font-medium text-gray-900">📋 Order Summary</h2>
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-lg font-medium text-gray-900">₹ {sumOfTotalPrice}</span>
                  </div>

                  {/* Coupon Section */}
                  <div className="border-t border-gray-200 pt-4">
                    <span className="text-sm text-gray-600">Have a coupon code? 🎟️</span>
                    {error && <p className="text-red-500">{error?.message}</p>}
                    {isAdded && (
                      <p className="text-green-600 font-medium">
                        🎉 Congratulations! You got {couponFound?.coupon?.discountInPercentage}% discount!
                      </p>
                    )}
                    <form onSubmit={applyCouponSubmit} className="mt-2 flex gap-2">
                      <input
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        type="text"
                        className="flex-1 border p-2 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Enter coupon code"
                      />
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition">
                        Apply
                      </button>
                    </form>
                  </div>

                  <div className="flex justify-between border-t border-gray-200 pt-4">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-indigo-600">₹ {sumOfTotalPrice}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <div className="mt-6">
                  <Link
                    to="/order-payment"
                    state={sumOfTotalPrice}
                    className="block w-full text-center bg-indigo-600 text-white py-3 rounded-lg shadow-md hover:bg-indigo-700 transition">
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
