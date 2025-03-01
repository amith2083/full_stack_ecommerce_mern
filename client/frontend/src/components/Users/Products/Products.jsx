import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, fetchWishlist, removeFromWishlist, } from "../../../redux/slices/wishlist/wishListSlices";

import SuccessMsg from "../../SuccessMsg/SuccessMsg";

const Products = ({ products }) => {
  const [localWishlist, setLocalWishlist] = useState([]);
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchWishlist());
    // setLocalWishlist(wishlistProductIds);
   
  }, [dispatch]);
  const { wishLists,isAdded,isDelete } = useSelector((state) => state?.wishLists);
  console.log('wishlists',wishLists)
 // Update localWishlist whenever wishLists change
 useEffect(() => {
  setLocalWishlist(wishLists?.map((item) => item._id) || []);
}, [wishLists]);;

 
    // Extract product IDs from the wishlist
    const wishlistProductIds = wishLists?.map((item)=>item._id)
    console.log('wishlistids',wishlistProductIds)
    // let isWishlisted
    // isWishlisted= wishlistProductIds.includes(productId);
     
  // const handleWishlistClick = (productId,isWishlisted) => {
  

  //   if (isWishlisted) {
  //     dispatch(removeFromWishlist(productId));
  //   } else {
  //     dispatch(addToWishlist(productId));
  //   }
  // };
  const handleWishlistClick = (productId) => {
    if (localWishlist.includes(productId)) {
      setLocalWishlist((prev) => prev.filter((id) => id !== productId)); // Update local state instantly
      dispatch(removeFromWishlist(productId));
      dispatch(fetchWishlist())
    } else {
      setLocalWishlist((prev) => [...prev, productId]); // Update local state instantly
      dispatch(addToWishlist(productId));
      dispatch(fetchWishlist())
    }
  };
  
  return (
    <>
      {isAdded && <SuccessMsg message={"Product added to wishlist"} />}
      {isDelete && <SuccessMsg message={"Product deleted from wishlist"}/>}
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:col-span-3 lg:gap-x-8">
        {products?.map((product) => {
          const isWishlisted = localWishlist.includes(product._id);

          return (
            <div key={product._id} className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
              <div className="relative bg-gray-50">
                <span className="absolute top-0 left-0 ml-6 mt-6 px-2 py-1 text-xs font-bold font-heading bg-white border-2 border-red-500 rounded-full text-red-500">
                  -15%
                </span>
                <Link className="block" to={`/product/${product?.id}`}>
                  <img className="w-full h-64 object-cover" src={product?.images[0]} alt={product?.name} />
                </Link>
                <div className="px-6 pb-6 mt-8">
                  <h3 className="mb-2 text-xl font-bold font-heading">{product?.name}</h3>
                  <p className="text-lg font-bold font-heading text-blue-500">
                    <span>₹{product?.price}</span>
                    <span className="text-xs text-gray-500 font-semibold font-heading line-through">₹40.99</span>
                  </p>
                  {/* Wishlist Button */}
                  <button
  onClick={() => handleWishlistClick(product?._id)}
  className="absolute top-3 right-3 flex items-center justify-center w-12 h-12 rounded-full transition bg-gray-200 text-gray-600"
>
  {isWishlisted ? "❤️" : "🤍"}
</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Products;
