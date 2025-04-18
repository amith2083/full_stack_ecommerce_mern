import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import ErrorMsg from "../../ErrorMsg/ErrorMsg";
import SuccessMsg from "../../SuccessMsg/SuccessMsg";
import { fetchCoupon, updateCoupon } from "../../../redux/slices/coupon/couponSlices";


export default function UpdateCoupon() {
  const dispatch = useDispatch();

  //get the coupon from url
  const { code } = useParams();
  // Initialize formData state
  const [formData, setFormData] = useState({
    code: "",
    discount: "",
  });
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    dispatch(fetchCoupon(code));
  }, [dispatch, code]);
  const { coupon, loading, error, isUpdated } = useSelector(
    (state) => state?.coupons
  );
  useEffect(() => {
    if (coupon?.coupon) {
      setFormData({
        code: coupon.coupon.code || "",
        discount: coupon.coupon.discount || "",
      });

      setStartDate(new Date(coupon.coupon.startDate || new Date())); // Set start date
      setEndDate(new Date(coupon.coupon.endDate || new Date())); // Set end date
    }
  }, [coupon]); // Runs when coupon changes

  // //---handle form data---
  // const [formData, setFormData] = useState({
  //   code: coupon?.coupon?.code,
  //   discount: coupon?.coupon?.discount,
  // });

  //onHandleChange---
  const onHandleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  //onHandleSubmit---
  const onHandleSubmit = (e) => {
    e.preventDefault();
dispatch(updateCoupon({id:coupon?.coupon?._id,
  code:formData?.code,
  discount:formData?.discount,
  startDate,
  endDate
})).unwrap()
.then(() => {
  navigate("/admin/manage-coupon");
});
  
  };
  return (
    <>
      {isUpdated && <SuccessMsg message="Coupon Updated successfully" />}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Update Coupon
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error ? (
            <ErrorMsg message={error?.message} />
          ) : (
            <form className="space-y-6" onSubmit={onHandleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {/* name */}
                 coupon code
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="code"
                    value={formData?.code}
                    onChange={onHandleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {/* discount */}
                  Discount (in %)
                </label>
                <div className="mt-1">
                  <input
                    name="discount"
                    value={formData?.discount}
                    onChange={onHandleChange}
                    type="number"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              {/* start date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <div className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                  />
                </div>
              </div>

              {/* end date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <div className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                  />
                </div>
              </div>
              <div>
                {loading ? (
                  <LoadingComponent />
                ) : (
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Update Coupon
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
