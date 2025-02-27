import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser, updateShippingAddress } from "../../../redux/slices/users/userSlices";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import ErrorMsg from "../../ErrorMsg/ErrorMsg";

const AddShippingAddress = ({ selectedAddress }) => {
   const dispatch = useDispatch()
  
   const [isEditing, setIsEditing] = useState(false)
 
  //user profile
 
  const{loading,error,profile}=useSelector((state)=>state?.users)
  const user =profile?.user?.shippingAddress
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
  console.log('selectedin add',selectedAddress)

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
      {userAddress  && !isEditing ? (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900">
            Shipping details
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Double check your information.
          </p>
          <div>
          <p className="mt-1 text-sm text-gray-500">First Name: {userAddress?.firstName}</p>
            <p className="mt-1 text-sm text-gray-500">Last Name: {userAddress?.lastName}</p>
            <p className="mt-1 text-sm text-gray-500">Address: {userAddress?.address}</p>
            <p className="mt-1 text-sm text-gray-500">City: {userAddress?.city}</p>
            <p className="mt-1 text-sm text-gray-500">Country: {userAddress?.country}</p>
            <p className="mt-1 text-sm text-gray-500">Phone: {userAddress?.phone}</p>
          </div>
          <button 
      onClick={() => setIsEditing(true)} 
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
      Change Address
    </button>
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
          <div>
            <label
              htmlFor="first-name"
              className="block text-sm font-medium text-gray-700">
              First name
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="firstName"
                onChange={onChange}
                value={formData.firstName}
                autoComplete="given-name"
                className="block w-full rounded-md border-gray-300  p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required/>
            </div>
          </div>

          <div>
            <label
              htmlFor="last-name"
              className="block text-sm font-medium text-gray-700">
              Last name
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="lastName"
                onChange={onChange}
                value={formData.lastName}
                className="block w-full rounded-md border-gray-300  p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
             required />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="address"
                onChange={onChange}
                value={formData.address}
                autoComplete="street-address"
                className="block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required/>
            </div>
          </div>

          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700">
              City
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="city"
                onChange={onChange}
                value={formData.city}
                autoComplete="address-level2"
                className="block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required/>
            </div>
          </div>

          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <div className="mt-1">
              <select
                id="country"
                name="country"
                autoComplete="country"
                value={formData.country}
                onChange={onChange}
                className="block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
               <option value="USA">India</option>
                <option value="USA">United States</option>
                <option value="CAN">Canada</option>
                <option value="MEX">Mexico</option>
                <option value="Ghana">Ghana</option>
                <option value="Nigeria">Nigeria</option>
                <option value="South Africa">South Africa</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="region"
              className="block text-sm font-medium text-gray-700">
              State / Province
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="region"
                onChange={onChange}
                value={formData.region}
                autoComplete="address-level1"
                className="block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="postal-code"
              className="block text-sm font-medium text-gray-700">
              Postal code
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="postalCode"
                onChange={onChange}
                value={formData.postalCode}
                autoComplete="postal-code"
                className="block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
             required />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="phone"
                id="phone"
                onChange={onChange}
                value={formData.phone}
                autoComplete="tel"
                className="block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required/>
            </div>
          </div>
          {loading ?<LoadingComponent/>: <button
            type="submit"
            className="w-full rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50">
            Add Shipping Address
          </button>
}
        </form>
        
      )}
    </>
  );
};

export default AddShippingAddress;
