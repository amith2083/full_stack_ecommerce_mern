import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  fetchWishlist,
  removeFromWishlist,
} from "../../../redux/slices/wishlist/wishListSlices";
import Swal from "sweetalert2";
import SuccessMsg from "../../SuccessMsg/SuccessMsg";
import getToken from "../../../utils/getToken";
import { Heart } from "lucide-react";

const Products = ({ products }) => {
  const navigate = useNavigate();
  const [localWishlist, setLocalWishlist] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const { wishLists, isAdded, isDelete } = useSelector(
    (state) => state?.wishLists
  );

  useEffect(() => {
    setLocalWishlist(wishLists?.map((item) => item._id) || []);
  }, [wishLists]);

  const handleWishlistClick = (productId) => {
    const token = getToken();
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Please login to use wishlist",
        confirmButtonText: "Go to Login",
      }).then((result) => {
        if (result.isConfirmed) navigate("/login");
      });
      return;
    }
    if (localWishlist.includes(productId)) {
      setLocalWishlist((prev) => prev.filter((id) => id !== productId));
      dispatch(removeFromWishlist(productId));
      dispatch(fetchWishlist());
    } else {
      setLocalWishlist((prev) => [...prev, productId]);
      dispatch(addToWishlist(productId));
      dispatch(fetchWishlist());
    }
  };

  return (
    <>
      {isAdded && <SuccessMsg message="Product added to wishlist" />}
      {isDelete && <SuccessMsg message="Product removed from wishlist" />}

      <div className="grid grid-cols-2 gap-0.5 lg:col-span-3 xl:grid-cols-3">
        {products?.map((product) => {
          const isWishlisted = localWishlist.includes(product._id);
          const hasDiscount =
            product.salesPrice && product.salesPrice < product.price;
          const discountPct = hasDiscount
            ? Math.round(
                ((product.price - product.salesPrice) / product.price) * 100
              )
            : null;

          return (
            <div
              key={product._id}
              className="group relative bg-stone-100 overflow-hidden"
            >
              {/* Image area */}
              <div className="relative aspect-[3/4] overflow-hidden bg-stone-200">
                <Link to={`/product/${product?.id}`} className="block w-full h-full">
                  <img
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    src={product?.images[0]}
                    alt={product?.name}
                  />
                </Link>

                {/* Hover overlay + Quick View */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <span className="bg-white text-neutral-900 text-[10px] font-bold tracking-[0.18em] uppercase px-6 py-2.5 translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                    Quick View
                  </span>
                </div>

                {/* Discount badge */}
                {hasDiscount && (
                  <div className="absolute top-3 left-3 bg-rose-500 text-white text-[9px] font-bold tracking-[0.18em] uppercase px-2.5 py-1">
                    -{discountPct}%
                  </div>
                )}

                {/* Wishlist button */}
                <button
                  onClick={() => handleWishlistClick(product?._id)}
                  className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center transition-all duration-200 shadow-md
                    ${isWishlisted
                      ? "bg-rose-500 text-white opacity-100"
                      : "bg-white text-neutral-400 opacity-0 group-hover:opacity-100 hover:text-rose-500"
                    }`}
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart
                    size={15}
                    className={isWishlisted ? "fill-white" : ""}
                  />
                </button>
              </div>

              {/* Product info */}
              <div className="bg-white px-4 py-4">
                <h3 className="text-sm font-semibold text-neutral-800 truncate leading-snug mb-2">
                  {product?.name}
                </h3>
                <div className="flex items-center gap-2">
                  {hasDiscount ? (
                    <>
                      <span
                        className="text-base font-bold text-neutral-900"
                        style={{ fontFamily: "'Georgia', serif" }}
                      >
                        ₹{product.salesPrice.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-neutral-400 line-through">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                    </>
                  ) : (
                    <span
                      className="text-base font-bold text-neutral-900"
                      style={{ fontFamily: "'Georgia', serif" }}
                    >
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default React.memo(Products);