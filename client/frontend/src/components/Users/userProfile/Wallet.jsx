import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWallet, addMoneyToWallet } from "../../../redux/slices/wallet/walletSlices";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Wallet = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const location = useLocation();
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

  useEffect(() => {
    dispatch(fetchWallet());
  }, [dispatch, location]);

  const { wallet, loading } = useSelector((state) => state?.wallet);

  const handleAddMoney = async () => {
    if (!amount || amount <= 0 ||!Number.isInteger(amount)) 
      return Swal.fire({
      icon: "warning",
      title: "Invalid Amount",
      text: "Please enter a valid amount ",
      confirmButtonColor: "#3085d6",
    });
    await dispatch(addMoneyToWallet({ amount, navigate }));
    dispatch(fetchWallet());
    setAmount(""); // Reset field
  };

  // Pagination Logic
  const totalTransactions = wallet?.walletHistory?.length || 0;
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = wallet?.walletHistory?.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(totalTransactions / transactionsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <p className="text-center text-lg text-blue-600 font-semibold">Loading wallet...</p>;
  }

  return (
    <div className="p-6 bg-white min-h-screen text-gray-800">
      <h2 className="text-3xl font-bold text-center mb-6">💰 Wallet</h2>

      <div className="bg-blue-100 p-6 rounded-lg shadow-lg text-center mb-6">
        <h3 className="text-2xl font-semibold">Current Balance</h3>
        <p className="text-4xl font-bold text-green-600">Rs {wallet?.amount || 0}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h3 className="text-xl font-semibold mb-4">Add Money</h3>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
           min="1"
  step="1" // 👈 prevents decimals
          className="border p-2 w-full mb-4 rounded-md appearance-none 
             [&::-webkit-outer-spin-button]:appearance-none 
             [&::-webkit-inner-spin-button]:appearance-none 
             focus:outline-none"
        />
        <button
          onClick={handleAddMoney}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          ➕ Add Money
        </button>
      </div>

      <h3 className="text-xl font-semibold mt-6 mb-4">📜 Transaction History</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-2 px-4">Type</th>
              <th className="py-2 px-4">Amount</th>
              <th className="py-2 px-4">Balance</th>
              <th className="py-2 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions?.length > 0 ? (
              currentTransactions.map((txn, index) => (
                <tr key={index} className="border-b text-center">
                  <td className={`py-2 px-4 font-semibold ${txn.transactionType === "credit" ? "text-green-600" : "text-red-600"}`}>
                    {txn.transactionType.toUpperCase()}
                  </td>
                  <td className="py-2 px-4">Rs {txn.amount}</td>
                  <td className="py-2 px-4">Rs {txn.balance}</td>
                  <td className="py-2 px-4">{new Date(txn.createdAt).toDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 py-4">No transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalTransactions > transactionsPerPage && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            ⬅️ Prev
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`px-4 py-2 rounded-lg transition duration-300 font-semibold text-white ${
                currentPage === index + 1 ? "bg-blue-600" : "bg-gray-400 hover:bg-blue-500"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            Next ➡️
          </button>
        </div>
      )}
    </div>
  );
};

export default Wallet;
