import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { deleteUserShippingAddress, getUser, updateShippingAddress, updateUserShippingAddress } from "../../../redux/slices/users/userSlices";
import SuccessMsg from "../../SuccessMsg/SuccessMsg";
import Modal from "react-modal";

const ShippingAddressDetails = () => {
  const dispatch = useDispatch();
  const { profile,updated ,isDelete} = useSelector((state) => state?.users);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const openModal = (address) => {
    setSelectedAddress(address);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedAddress(null);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    dispatch(updateUserShippingAddress({ addressId: selectedAddress._id, updatedAddress: selectedAddress  }));
    closeModal();
  };
  const handleDelete = (addressId) => {
  
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(deleteUserShippingAddress({  addressId }))
  };
})
  };
  

  if (!profile?.user || !profile?.user.shippingAddress || profile?.user.shippingAddress.length === 0) {
    return <p className="text-center text-lg text-red-500 font-semibold">No shipping addresses found.</p>;
  }

  return (
    <>
    {updated && (
        <SuccessMsg
          message="
       Bravo, Address updated successfuly
      "
        />
      )}
       {isDelete && (
        <SuccessMsg
          message="
       Address deleted successfuly
      "
        />
      )}
    <div className="p-6 bg-white min-h-screen text-gray-900">
      <h2 className="text-3xl font-bold text-center mb-6">🏠 Shipping Addresses</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {profile?.user?.shippingAddress.map((address) => (
          <div key={address._id} className="bg-white p-6 rounded-lg shadow-xl border border-gray-200">
            <h3 className="text-xl font-bold">{address.firstName} {address.lastName}</h3>
            <p>📍 {address.address}, {address.city}</p>
            <p>📮 {address.postalCode}</p>
            <p>📞 {address.phone}</p>
            <div className="mt-4 flex space-x-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg" onClick={() => openModal(address)}>✏️ Edit</button>
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg" onClick={()=>handleDelete(address._id)}>❌ Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Shipping Address Modal */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="p-6 bg-white rounded-lg shadow-lg w-1/3 mx-auto mt-20">
        <h2 className="text-2xl font-bold mb-4">Edit Shipping Address</h2>
        {selectedAddress && (
          <form onSubmit={handleUpdate}>
            <input type="text" className="w-full p-2 border mb-2" placeholder="First Name" value={selectedAddress.firstName} onChange={(e) => setSelectedAddress({ ...selectedAddress, firstName: e.target.value })} />
            <input type="text" className="w-full p-2 border mb-2" placeholder="Last Name" value={selectedAddress.lastName} onChange={(e) => setSelectedAddress({ ...selectedAddress, lastName: e.target.value })} />
            <input type="text" className="w-full p-2 border mb-2" placeholder="Address" value={selectedAddress.address} onChange={(e) => setSelectedAddress({ ...selectedAddress, address: e.target.value })} />
            <input type="text" className="w-full p-2 border mb-2" placeholder="City" value={selectedAddress.city} onChange={(e) => setSelectedAddress({ ...selectedAddress, city: e.target.value })} />
            <input type="text" className="w-full p-2 border mb-2" placeholder="Postal Code" value={selectedAddress.postalCode} onChange={(e) => setSelectedAddress({ ...selectedAddress, postalCode: e.target.value })} />
            <input type="text" className="w-full p-2 border mb-4" placeholder="Phone" value={selectedAddress.phone} onChange={(e) => setSelectedAddress({ ...selectedAddress, phone: e.target.value })} />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg">Save</button>
          </form>
        )}
      </Modal>
    </div>
    </>
  );
};

export default ShippingAddressDetails;

