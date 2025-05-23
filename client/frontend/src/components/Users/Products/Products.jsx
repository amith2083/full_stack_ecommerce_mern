import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, fetchWishlist, removeFromWishlist, } from "../../../redux/slices/wishlist/wishListSlices";
import Swal from "sweetalert2";
import SuccessMsg from "../../SuccessMsg/SuccessMsg";
import getToken from "../../../utils/getToken";



const Products = ({ products }) => {
  const navigate = useNavigate()
  const [localWishlist, setLocalWishlist] = useState([]);
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchWishlist());
    // setLocalWishlist(wishlistProductIds);
   
  }, [dispatch]);
  const { wishLists,isAdded,isDelete } = useSelector((state) => state?.wishLists);
 
 // Update localWishlist whenever wishLists change
 useEffect(() => {
  setLocalWishlist(wishLists?.map((item) => item._id) || []);
}, [wishLists]);;

 
    // Extract product IDs from the wishlist
    const wishlistProductIds = wishLists?.map((item)=>item._id)
   
  const handleWishlistClick = (productId) => {
    // 1. Check login
 const token = getToken()
 
  
  if (!token) {
    Swal.fire({
      icon: 'warning',
      title: 'Please login to use wishlist',
      confirmButtonText: 'Go to Login',
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/login");
      }
    });
    return;
  }
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
      {isDelete && <SuccessMsg message={"Product removed from wishlist"}/>}

<div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:col-span-3 lg:gap-x-8">
  {products?.map((product) => {
    const isWishlisted = localWishlist.includes(product._id);

    return (

      <>
      <div key={product._id} className="w-full overflow-hidden rounded-lg bg-gray-100 group">
        <div className="relative bg-white p-4 shadow-md rounded-lg">
          {/* Discount Badge */}
          {product.salesPrice && product.salesPrice < product.price && (
                  <span className="absolute top-4 left-4 px-2 py-1 text-xs font-bold bg-white border-2 border-red-500 rounded-full text-red-500">
                    -{Math.round(((product.price - product.salesPrice) / product.price) * 100)}%
                  </span>
                )}

          {/* Image Wrapper */}
          <Link className="block w-full" to={`/product/${product?.id}`}>
          <div className="relative w-full max-h-[300px] aspect-[4/5] overflow-hidden rounded-md">
              <img
                className="w-full h-full object-contain object-center"
                src={product?.images[0]}
                alt={product?.name}
              />
            </div>
          </Link>

          {/* Product Details */}
          <div className="px-4 pb-4 mt-4">
          <h3 className="mb-2 text-center font-bold font-heading">
                      {product?.name}
                    </h3>
          <p className="text-center font-bold text-blue-500">
                    {product.salesPrice && product.salesPrice < product.price ? (
                      <>
                        <span className="text-blue-500">₹{product.salesPrice}</span>
                        <span className="ml-2 text-sm text-gray-500 line-through">₹{product.price}</span>
                      </>
                    ) : (
                      <span>₹{product.price}</span>
                    )}
                  </p>

            {/* Wishlist Button */}
            <button
              onClick={() => handleWishlistClick(product?._id)}
              className="absolute top-0 right-0 m-1 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md hover:bg-gray-200 transition"
            >
              {isWishlisted ? "❤️" : "🤍"}
            </button>
          </div>
        </div>
      </div>
      </>
    );
  })}
</div>

    </>
  );
};

export default Products;
