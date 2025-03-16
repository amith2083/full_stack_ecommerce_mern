import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser, updateShippingAddress } from "../../../redux/slices/users/userSlices";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import ErrorMsg from "../../ErrorMsg/ErrorMsg";
import { MapPin, User, Phone, Home, Globe, Building } from "lucide-react";

const AddShippingAddress = ({ selectedAddress  }) => {
   const dispatch = useDispatch()
  
   const [isEditing, setIsEditing] = useState(false)
 
  //user profile
 
  const{loading,error,profile}=useSelector((state)=>state?.users)
  const user =profile?.user?.shippingAddress||[];
  
  useEffect(()=>{
    dispatch(getUser())
  },[dispatch])
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    country: "",
    region: "",
    postalCode: "",
    phone: "",
  });
  useEffect(() => {
    if (selectedAddress) {
      setFormData(selectedAddress); // Auto-fill form when address is selected
    }
  }, [selectedAddress]);
 

  //onchange
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //onsubmit
  const onSubmit = async(e) => {
    e.preventDefault();
   await dispatch(updateShippingAddress(formData))
    dispatch(getUser())
    setIsEditing(false);
  };
   // Decide which shipping address to display
   const userAddress = selectedAddress || profile?.user?.shippingAddress;
   const showForm = !userAddress || isEditing;


  return (
    <>
    {error&&<ErrorMsg message={error?.message}/>}
      {/* shipping details */}
      {user.length>0 && !isEditing ? (
        <div className="mt-6">
           <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
    <MapPin className="w-6 h-6 text-blue-600" />
    Shipping Details
  </h3>

  <p className="mt-1 text-sm text-gray-500">Double check your information.</p>

  <div className="mt-4 space-y-2">
    <p className="flex items-center gap-2 text-gray-700">
      <User className="w-5 h-5 text-blue-500" />
      <span className="font-medium">First Name:</span> {userAddress?.firstName}
    </p>
    <p className="flex items-center gap-2 text-gray-700">
      <User className="w-5 h-5 text-blue-500" />
      <span className="font-medium">Last Name:</span> {userAddress?.lastName}
    </p>
    <p className="flex items-center gap-2 text-gray-700">
      <Home className="w-5 h-5 text-blue-500" />
      <span className="font-medium">Address:</span> {userAddress?.address}
    </p>
    <p className="flex items-center gap-2 text-gray-700">
      <Building className="w-5 h-5 text-blue-500" />
      <span className="font-medium">City:</span> {userAddress?.city}
    </p>
    <p className="flex items-center gap-2 text-gray-700">
      <Globe className="w-5 h-5 text-blue-500" />
      <span className="font-medium">Country:</span> {userAddress?.country}
    </p>
    <p className="flex items-center gap-2 text-gray-700">
      <Phone className="w-5 h-5 text-blue-500" />
      <span className="font-medium">Phone:</span> {userAddress?.phone}
    </p>
  </div>

  <button 
    onClick={() => setIsEditing(true)} 
    className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 shadow-md">
    + Add Address
  </button>
        </div>
      ) : (
        <form
  onSubmit={onSubmit}
  className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 bg-white p-6 rounded-lg shadow-md"
>
  <h3 className="col-span-2 text-xl font-semibold text-gray-900">
    Shipping Information
  </h3>

  <div>
    <label className="block text-sm font-semibold text-gray-700">
      First Name
    </label>
    <input
      type="text"
      name="firstName"
      onChange={onChange}
      value={formData.firstName}
      className="mt-1 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-semibold text-gray-700">
      Last Name
    </label>
    <input
      type="text"
      name="lastName"
      onChange={onChange}
      value={formData.lastName}
      className="mt-1 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      required
    />
  </div>

  <div className="sm:col-span-2">
    <label className="block text-sm font-semibold text-gray-700">
      Address
    </label>
    <input
      type="text"
      name="address"
      onChange={onChange}
      value={formData.address}
      className="mt-1 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-semibold text-gray-700">City</label>
    <input
      type="text"
      name="city"
      onChange={onChange}
      value={formData.city}
      className="mt-1 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-semibold text-gray-700">
      Country
    </label>
    <select
      name="country"
      value={formData.country}
      onChange={onChange}
      className="mt-1 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
    >
      <option value="India">India</option>
      <option value="USA">United States</option>
      <option value="CAN">Canada</option>
      <option value="MEX">Mexico</option>
      <option value="Ghana">Ghana</option>
      <option value="Nigeria">Nigeria</option>
      <option value="South Africa">South Africa</option>
    </select>
  </div>

  <div>
    <label className="block text-sm font-semibold text-gray-700">
      State / Province
    </label>
    <input
      type="text"
      name="region"
      onChange={onChange}
      value={formData.region}
      className="mt-1 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
    />
  </div>

  <div>
    <label className="block text-sm font-semibold text-gray-700">
      Postal Code
    </label>
    <input
      type="text"
      name="postalCode"
      onChange={onChange}
      value={formData.postalCode}
      className="mt-1 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      required
    />
  </div>

  <div className="sm:col-span-2">
    <label className="block text-sm font-semibold text-gray-700">Phone</label>
    <input
      type="text"
      name="phone"
      id="phone"
      onChange={onChange}
      value={formData.phone}
      className="mt-1 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      required
    />
  </div>

  <div className="sm:col-span-2">
    {loading ? (
      <LoadingComponent />
    ) : (
      <button
        type="submit"
        className="w-full rounded-md bg-gradient-to-r from-indigo-600 to-indigo-500 py-3 text-base font-semibold text-white shadow-md transition-transform duration-200 hover:scale-105 hover:from-indigo-700 hover:to-indigo-600 focus:ring-2 focus:ring-indigo-500"
      >
        Add Shipping Address
      </button>
    )}
  </div>
</form>

        
      )}
    </>
  );
};

export default AddShippingAddress;
