import { useDispatch, useSelector } from "react-redux";
import AddShippingAddress from "../Forms/AddShippingAddress";
import { useEffect, useState } from "react";
import { getCartItemsFromDatabase } from "../../../redux/slices/cart/cartSlices";
import { useLocation } from "react-router-dom";
import ShippingAddressModal from "../../shippingAddressModal";
import { getUser } from "../../../redux/slices/users/userSlices";
import { createOrder } from "../../../redux/slices/order/orderSlices";

export default function OrderPayment() {
  const dispatch = useDispatch();
  const location = useLocation()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const sumOfTotalPrice= location.state

  useEffect(()=>{dispatch(getCartItemsFromDatabase())},[dispatch])
  const {cartItems}=useSelector((state)=>state?.carts)
  //---get cart items from store---
  // const { cartItems } = [];
console.log('selected',selectedAddress)
  const calculateTotalDiscountedPrice = () => {};

  //create order submit handler
  const createOrderSubmitHandler = (e) => {
    e.preventDefault();
  };
  const{loading,error,profile}=useSelector((state)=>state?.users)
  const user =profile?.user?.shippingAddress
  useEffect(()=>{
    dispatch(getUser())
  },[dispatch])
  const placeOrderHandler =()=>{
    dispatch(createOrder({orderItems:cartItems,shippingAddress:selectedAddress,totalPrice:sumOfTotalPrice}))
  }

  return (
    <div className="bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <h1 className="sr-only">Checkout</h1>

          <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
            <div>
              <div className="mt-10 border-t border-gray-200 pt-10">
              <button
                  onClick={() => setIsModalOpen(true)}
                  className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Select Shipping Address
                </button>

                {/* Shipping Address Modal */}
                <ShippingAddressModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  onSelectAddress={setSelectedAddress}
                />
                {/* shipping Address */}
                <AddShippingAddress selectedAddress={selectedAddress} />
              </div>
            </div>

            {/* Order summary */}
            <div className="mt-10 lg:mt-0">
              <h2 className="text-lg font-medium text-gray-900">
                Order summary
              </h2>

              <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                <h3 className="sr-only">Items in your cart</h3>
                <ul role="list" className="divide-y divide-gray-200">
                  {cartItems?.map((cartItem) => (
                    <div key={cartItem._id}>
                    {cartItem.items?.map((item) => (
                    <li key={item._id} className="flex py-6 px-4 sm:px-6">
                      <div className="flex-shrink-0">
                        <img
                          src={item?.product.images[0]}
                          // alt={product.imageAlt}
                          className="w-20 rounded-md"
                        />
                      </div>

                      <div className="ml-6 flex flex-1 flex-col">
                        <div className="flex">
                          <div className="min-w-0 flex-1">
                            <p className="mt-1 text-sm text-gray-500">
                              {item?.product?.name}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              {item?.size}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              {item?.color}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-1 items-end justify-between pt-2">
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            $ {item?.totalPrice} X {item?.qty}
                          </p>
                        </div>
                      </div>
                    </li>
                     ))}
              
                     </div>
                  ))}
                </ul>
                <dl className="space-y-6 border-t border-gray-200 py-6 px-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm">Taxes</dt>
                    <dd className="text-sm font-medium text-gray-900">$0.00</dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                    <dt className="text-base font-medium">Sub Total</dt>
                    <dd className="text-base font-medium text-gray-900">
                      $ {sumOfTotalPrice}.00
                    </dd>
                  </div>
                </dl>

                <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                  <button
                    onClick={placeOrderHandler}
                    className="w-full rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50">
                    Confirm Payment - ${sumOfTotalPrice}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
