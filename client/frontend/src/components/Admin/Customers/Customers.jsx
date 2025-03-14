import { useDispatch, useSelector } from "react-redux";

import { useEffect, useState } from "react";
import { getAllUsers, toggleBlockUser } from "../../../redux/slices/users/userSlices";
import Swal from "sweetalert2";




export default function Customers() {
  
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state?.users);
  console.log("users", users)
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {  
    dispatch(getAllUsers());
  }, [dispatch]);

 
  const handleBlockUnblock = (userId,isBlocked) => {
   
    dispatch(toggleBlockUser(userId))
    .unwrap()
    .then(() => {
      Swal.fire({
      icon: "success",
      title: "status updated",
      text: isBlocked?'user unblocked successfully':'user blocked successfully',
      timer: 3000,
      showConfirmButton: false,
      })
      dispatch(getAllUsers())
      }
      
    );
     
  };
    // Pagination Logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  
    const totalPages = Math.ceil(users.length / usersPerPage);
  
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">All Customers</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the users in your account including their name,
            email and role.
          </p>
        </div>
        {/* <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto">
            Add user
          </button>
        </div> */}
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8">
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                   
                    
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Role
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {currentUsers.map((person) => (
                    <tr key={person._id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                        {person.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {person.email}
                      </td>
                     
                     
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {person?.isAdmin?'Admin':'customer'}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                       {/* Block/Unblock Button */}
                        {/* Hide Block/Unblock Button for Admins */}
                        {!person.isAdmin && (
                  <button
                   onClick={() => handleBlockUnblock(person._id, person.isBlocked)}
                    className={`px-4 py-2 text-white rounded-md ${
                      person.isBlocked ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {person.isBlocked ? "Unblock" : "Block"}
                  </button>
                        )}
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
          currentPage === index + 1
            ? "bg-indigo-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-50"
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
    </div>
  );
}
