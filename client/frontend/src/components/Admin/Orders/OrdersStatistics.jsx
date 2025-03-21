import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrderStats } from "../../../redux/slices/order/orderSlices";


export default function OrdersStats() {
  const dispatch= useDispatch();
  useEffect((state)=>{
    dispatch(getOrderStats())
  },[])
  const{stats,loading,error}= useSelector((state)=>state?.orders)
  console.log('stats',stats)
//   const obj = stats?.orders
// const statistics = Object.values(obj[0])
// console.log('statistics',statistics)
// Extract order statistics safely
const orderStats = stats?.orders?.[0] || {};
const { minimumSale, maxSale, totalSales,avgSale } = orderStats;
const todaysales = stats?.saleToday?.[0] || {};

// const {totalSales:{todayOrders}} = todaysales
  return (
    <div>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* stat 1 */}
        <div className="relative overflow-hidden rounded-lg bg-pink-600 px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6">
          <dt>
            <div className="absolute rounded-md bg-indigo-500 p-3">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path>
              </svg>
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">
              Min sale
            </p>
          </dt>
          <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
            <p className="text-2xl font-semibold text-gray-900">₹{minimumSale}</p>

            <div className="absolute inset-x-0 bottom-0 bg-pink-900 px-4 py-4 sm:px-6">
              <div className="text-sm">
                {/* <a
                  href="#"
                  className="font-medium text-indigo-600 hover:text-indigo-500">
                  {" "}
                  View all
                </a> */}
              </div>
            </div>
          </dd>
        </div>
        {/* stat 2 */}
        <div className="relative overflow-hidden rounded-lg bg-pink-600 px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6">
          <dt>
            <div className="absolute rounded-md bg-indigo-500 p-3">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path>
              </svg>
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">
                  Max sale
            </p>
          </dt>
          <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
            <p className="text-2xl font-semibold text-gray-900">₹{maxSale}</p>

            <div className="absolute inset-x-0 bottom-0 bg-pink-900 px-4 py-4 sm:px-6">
              <div className="text-sm">
                {/* <a
                  href="#"
                  className="font-medium text-indigo-600 hover:text-indigo-500">
                  {" "}
                  View all
                </a> */}
              </div>
            </div>
          </dd>
        </div>
        {/* stat 3 */}
        <div className="relative overflow-hidden rounded-lg bg-pink-600 px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6">
          <dt>
            <div className="absolute rounded-md bg-indigo-500 p-3">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path>
              </svg>
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">
                  Total sales
            </p>
          </dt>
          <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
            <p className="text-2xl font-semibold text-gray-900">₹{totalSales}</p>

            <div className="absolute inset-x-0 bottom-0 bg-pink-900 px-4 py-4 sm:px-6">
              <div className="text-sm">
                {/* <a
                  href="#"
                  className="font-medium text-indigo-600 hover:text-indigo-500">
                  {" "}
                  View all
                </a> */}
              </div>
            </div>
          </dd>
        </div>
        {/* total income */}
        <div className="relative overflow-hidden rounded-lg bg-pink-600 px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6">
          <dt>
            <div className="absolute rounded-md bg-indigo-500 p-3">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path>
              </svg>
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">
              Today sales
            </p>
          </dt>
          <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
            <p className="text-2xl font-semibold text-gray-900">{ Object.keys(todaysales).length === 0?'₹ 0.00':`₹ ${todaysales?.totalSales?.toFixed(2)}`} </p>

            <div className="absolute inset-x-0 bottom-0 bg-pink-900 px-4 py-4 sm:px-6">
              <div className="text-sm">
                {/* <a
                  href="#"
                  className="font-medium text-indigo-600 hover:text-indigo-500">
                  {" "}
                  View all
                </a> */}
              </div>
            </div>
          </dd>
        </div>
      </dl>
    </div>
  );
}
