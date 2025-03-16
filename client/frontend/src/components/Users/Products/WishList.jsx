import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist, removeFromWishlist, } from "../../../redux/slices/wishlist/wishListSlices";
import { XMarkIcon } from "@heroicons/react/24/solid";
import SuccessMsg from "../../SuccessMsg/SuccessMsg";
import LoadingComponent from "../../LoadingComp/LoadingComponent";

export default function WishList() {
  const dispatch = useDispatch();
  const [localWishlist, setLocalWishlist] = useState([]);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const { wishLists,isDelete ,loading} = useSelector((state) => state?.wishLists);

  // Sync localWishlist with Redux store
  useEffect(() => {
    setLocalWishlist(wishLists || []);
  }, [wishLists]);

  const handleRemove = (productId) => {
    // Optimistically update UI
    setLocalWishlist((prevWishlist) => prevWishlist.filter((product) => product._id !== productId));

    // Dispatch remove action
    dispatch(removeFromWishlist(productId));
  };



  return (
    <>
   
    {isDelete && <SuccessMsg message={"Product deleted from wishlist"}/>}
    {loading? <LoadingComponent/>:<div className="bg-gradient-to-r from-gray-100 to-gray-200 min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-6">
        {localWishlist.length  === 0 ? (
          <h1 className="text-center text-3xl font-bold text-gray-800">
            Your Wishlist is Empty ❤️
          </h1>
        ) : (
          <>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 text-center mb-8">
              💖 Your Wishlist
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {localWishlist.map((product) => (
                <div
                  key={product._id}
                  className="bg-white p-5 rounded-lg shadow-lg transition transform hover:scale-105"
                >
                  <div className="relative">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-48 w-full object-cover rounded-md"
                    />
                    <span className="absolute top-2 left-2 bg-indigo-500 text-white px-3 py-1 text-xs font-semibold rounded-full">
                      {product.category}
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">₹ {product.price}</p>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleRemove(product._id)}
                        className="flex items-center bg-red-600 text-white py-2 px-3 rounded-md hover:bg-red-700 transition"
                      >
                        <XMarkIcon className="h-5 w-5 mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>}

    
    </>
  );
}
