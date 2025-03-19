import { Link, useParams } from "react-router-dom";

import ErrorMsg from "../../ErrorMsg/ErrorMsg";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import NoDataFound from "../../NoDataFound/NoDataFound";
import { useDispatch, useSelector } from "react-redux";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { fetchOffers } from "../../../redux/slices/offers/OfferSlices";
export default function ManageOffers() {
  const dispatch  = useDispatch()
  const{id}= useParams()
  const [currentPage, setCurrentPage] = useState(1); 
  const itemsPerPage = 5; 
  
  useEffect(()=>{
    dispatch(fetchOffers())

  },[dispatch])
  //get coupons
  const { offers, loading, error } = useSelector((state)=>state?.offers)
 

  //---deleteHandler---

  const blockUnblockHandler = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This coupon will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteCoupon(id))
          .unwrap()
          .then(() => {
            Swal.fire("Deleted!", "The coupon has been deleted.");
            dispatch(fetchOffers()); // Refresh coupon list after deletion
          });
      }
    });
  };
  // Pagination 
  const totalOffers = offers?.offers?.length || 0;
  const totalPages = Math.ceil(totalOffers / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOffers = offers?.offers?.slice(startIndex, startIndex + itemsPerPage);


  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">
            Manage offers - [{totalOffers}]
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            List of all offers
          </p>
        </div>
       
      </div>
      {loading ? (
        <LoadingComponent />
      ) : error ? (
        <ErrorMsg
          message={error?.message || "Something went wrong, please try again"}
        />
      ) : offers?.offers?.length <= 0 ? (
        <NoDataFound />
      ) : (
        <>
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          offer Code
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Discount (%)
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                         Status
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Start Date
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                         End Date
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Applicable To
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Edit
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {currentOffers?.map((offer) => (
                        <tr key={offer?._id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {offer?.code}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {offer?.offerValue}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {offer?.isExpired ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-700 text-gray-300">
                                Expired
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-400 text-green-800">
                                Active
                              </span>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {new Date(offer.startDate)?.toLocaleDateString()}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {new Date(offer.endDate)?.toLocaleDateString()}
                          </td>

                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {offer.applicableToProduct
        ? offer.applicableToProduct.name
        : offer.applicableToCategory
        ? offer.applicableToCategory.name
        : "Not applicable"}
                          </td>
                          {/* edit icon */}
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <Link
                              to={`/admin/manage-offer/edit/${offer.code}`}>
                              ✏️
                            </Link>
                          </td>
                          {/* delete */}
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <button
                              onClick={() => blockUnblockHandlerHandler(offer?._id)}>
                             🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* Pagination Controls */}
        <div className="mt-6 flex justify-center">
          <nav className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border ${
                  currentPage === index + 1 ? "bg-indigo-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
          </div>
          
        </>
      )}
    </div>
  );
}
