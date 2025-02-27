import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../redux/slices/users/userSlices";

const ShippingAddressModal = ({ isOpen, onClose, onSelectAddress }) => {
  const dispatch = useDispatch()
  const { profile } = useSelector((state) => state?.users);
  const shippingAddresses = profile?.user?.shippingAddress || [];
  console.log('shipp',shippingAddresses)

  const [selectedAddress, setSelectedAddress] = useState(null);
  console.log('selected',selectedAddress)

  const handleSelect = (address) => {
    setSelectedAddress(address);
    onSelectAddress(address); // Pass selected address to parent
    onClose(); // Close modal after selecting
  };
// useEffect(()=>{
//   dispatch(getUser())
// },[dispatch])
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Select Shipping Address</h2>
        {shippingAddresses.length > 0 ? (
          <div className="space-y-3">
            {shippingAddresses.map((address, index) => (
              <label
                key={index}
                className="flex items-center space-x-2 p-3 border rounded cursor-pointer hover:bg-gray-100"
              >
                <input
                  type="radio"
                  name="shippingAddress"
                  className="form-radio text-blue-600"
                  checked={selectedAddress === address}
                  onChange={() => handleSelect(address)}
                />
                <div>
                  <p className="text-gray-900">{address.firstName} {address.lastName}</p>
                  <p className="text-gray-600">{address.address}, {address.city}, {address.country}</p>
                  <p className="text-gray-500">Phone: {address.phone}</p>
                </div>
              </label>
            ))}
          </div>
        ) : (
          <p className="text-red-500">No shipping addresses found.</p>
        )}
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ShippingAddressModal;
