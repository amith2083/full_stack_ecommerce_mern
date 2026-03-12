import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { RadioGroup } from "@headlessui/react";
import { CurrencyDollarIcon, GlobeAmericasIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/20/solid";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addOrderToCart, getCartItemsFromDatabase } from "../../../redux/slices/cart/cartSlices";
import { fetchSingleProduct } from "../../../redux/slices/products/productSlices";
import getToken from "../../../utils/getToken";
import { ShoppingBag, Truck, RotateCcw, Shield, ChevronRight, ArrowRight } from "lucide-react";

const policies = [
  {
    name: "Worldwide Delivery",
    icon: Truck,
    description: "Free shipping on orders above ₹999",
  },
  {
    name: "Easy Returns",
    icon: RotateCcw,
    description: "Hassle-free 30-day return policy",
  },
  {
    name: "Secure Payment",
    icon: Shield,
    description: "100% secured transactions",
  },
  {
    name: "Loyalty Rewards",
    icon: CurrencyDollarIcon,
    description: "Earn points on every purchase",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Product() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const { id } = useParams();

  const { loading, error, product } = useSelector((state) => state?.products);
 
  const cartItems = useSelector((state) => state?.carts?.cartItems || []);
  const productIds = cartItems.flatMap((cartItem) =>
    cartItem.items.map((item) => item.product?._id)
  );
  const isInCart = productIds.includes(product?._id);

  useEffect(() => {
    if (id) dispatch(fetchSingleProduct(id));
  }, [dispatch, id]);

  const hasDiscount = product?.salesPrice && product?.salesPrice < product?.price;
  const discountPct = hasDiscount
    ? Math.round(((product.price - product.salesPrice) / product.price) * 100)
    : null;

  const addToCartHandler = async () => {
    const token = getToken();
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Please login to use Cart",
        confirmButtonText: "Go to Login",
      }).then((result) => {
        if (result.isConfirmed) navigate("/login");
      });
      return;
    }
    if (!isInCart && (!selectedSize || !selectedColor)) {
      Swal.fire({
        icon: "error",
        title: "Selection Required",
        text: "Please select size and color before adding to cart.",
      });
      return;
    }
    if (isInCart) {
      navigate("/shopping-cart");
      return;
    }
    await dispatch(addOrderToCart({ id: product?._id, selectedColor, selectedSize }));
    Swal.fire({ icon: "success", title: "Added to Cart!", text: "Product added successfully." });
    dispatch(getCartItemsFromDatabase());
  };

  return (
    <div className="bg-stone-50 min-h-screen font-sans">

      {/* ── BREADCRUMB ── */}
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-3 flex items-center gap-2 text-[11px] font-medium tracking-wider uppercase text-neutral-400">
          <Link to="/" className="hover:text-neutral-900 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link to="/products-filters" className="hover:text-neutral-900 transition-colors">Shop</Link>
          <ChevronRight size={12} />
          <span className="text-neutral-900">{product?.name}</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── PRODUCT LAYOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

          {/* ── IMAGE GALLERY ── */}
          <div className="flex gap-4">
            {/* Thumbnails */}
            {product?.images?.length > 1 && (
              <div className="flex flex-col gap-3 w-20 shrink-0">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={classNames(
                      "aspect-square overflow-hidden border-2 transition-all duration-200",
                      activeImage === i
                        ? "border-neutral-900"
                        : "border-transparent hover:border-neutral-300"
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover object-center" />
                  </button>
                ))}
              </div>
            )}

            {/* Main image */}
            <div className="flex-1 relative overflow-hidden bg-neutral-100 aspect-[3/4]">
              {product?.images?.[activeImage] && (
                <img
                  src={product.images[activeImage]}
                  alt={product?.name}
                  className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                />
              )}
              {hasDiscount && (
                <div className="absolute top-4 left-4 bg-rose-500 text-white text-[9px] font-bold tracking-[0.18em] uppercase px-3 py-1.5">
                  -{discountPct}% OFF
                </div>
              )}
              {product?.qtyLeft <= 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-sm font-bold tracking-[0.2em] uppercase">Out of Stock</span>
                </div>
              )}
            </div>
          </div>

          {/* ── PRODUCT INFO ── */}
          <div className="flex flex-col">

            {/* Name + Price */}
            <div className="pb-7 border-b border-neutral-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-amber-500">
                  {product?.brand || "Premium Collection"}
                </span>
              </div>
              <h1
                className="text-3xl sm:text-4xl font-black text-neutral-900 leading-tight mb-5"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                {product?.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center gap-0.5">
                  {[0, 1, 2, 3, 4].map((r) => (
                    <StarIcon
                      key={r}
                      className={classNames(
                        product?.averageRating > r ? "text-amber-400" : "text-neutral-200",
                        "h-4 w-4 shrink-0"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-neutral-500 font-medium">
                  {product?.averageRating > 0 ? product?.averageRating?.toFixed(1) : "No ratings yet"}
                </span>
                <span className="text-neutral-300">·</span>
                <Link
                  to={`/add-review/${product?._id}`}
                  className="text-sm font-semibold text-neutral-900 hover:text-amber-500 transition-colors underline underline-offset-2"
                >
                  Write a review
                </Link>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span
                  className="text-3xl font-black text-neutral-900"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  ₹{(hasDiscount ? product.salesPrice : product?.price)?.toLocaleString("en-IN")}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-neutral-400 line-through font-medium">
                    ₹{product.price?.toLocaleString("en-IN")}
                  </span>
                )}
                {hasDiscount && (
                  <span className="text-sm font-bold text-emerald-600">
                    Save ₹{(product.price - product.salesPrice).toLocaleString("en-IN")}
                  </span>
                )}
              </div>
            </div>

            {/* Color */}
            <div className="py-6 border-b border-neutral-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-neutral-900">Color</span>
                {selectedColor && (
                  <span className="text-xs text-neutral-500 capitalize">{selectedColor}</span>
                )}
              </div>
              <RadioGroup value={selectedColor} onChange={setSelectedColor}>
                <div className="flex flex-wrap gap-3">
                  {product?.color?.map((color) => (
                    <RadioGroup.Option
                      key={color}
                      value={color}
                      className={({ checked }) =>
                        classNames(
                          "relative rounded-full cursor-pointer focus:outline-none transition-all duration-150",
                          checked
                            ? "ring-2 ring-offset-2 ring-neutral-900 scale-110"
                            : "hover:scale-105 ring-1 ring-black/10"
                        )
                      }
                    >
                      <span
                        style={{ backgroundColor: color }}
                        className="block h-8 w-8 rounded-full border border-black/10"
                      />
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Size */}
            <div className="py-6 border-b border-neutral-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-neutral-900">Size</span>
                {selectedSize && (
                  <span className="text-xs font-semibold text-neutral-500">{selectedSize} selected</span>
                )}
              </div>
              <RadioGroup value={selectedSize} onChange={setSelectedSize}>
                <div className="flex flex-wrap gap-2">
                  {product?.sizes?.map((size) => (
                    <RadioGroup.Option
                      key={size}
                      value={size}
                      className={({ checked }) =>
                        classNames(
                          "w-12 h-12 flex items-center justify-center text-sm font-bold border cursor-pointer transition-all duration-150",
                          checked
                            ? "bg-neutral-900 text-white border-neutral-900"
                            : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-900"
                        )
                      }
                    >
                      {size}
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Stock indicator */}
            {product?.qtyLeft > 0 && product?.qtyLeft <= 10 && (
              <div className="py-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block animate-pulse"></span>
                <span className="text-xs font-semibold text-amber-600">
                  Only {product.qtyLeft} left in stock — order soon
                </span>
              </div>
            )}

            {/* CTA */}
            <div className="pt-6 flex flex-col gap-3">
              {product?.qtyLeft <= 0 ? (
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-3 bg-neutral-200 text-neutral-400 text-[12px] font-bold tracking-[0.18em] uppercase py-4 cursor-not-allowed"
                >
                  Out of Stock
                </button>
              ) : (
                <button
                  onClick={addToCartHandler}
                  className="w-full flex items-center justify-center gap-3 bg-neutral-900 text-white text-[12px] font-bold tracking-[0.18em] uppercase py-4 hover:bg-amber-500 hover:text-neutral-900 transition-colors duration-200"
                >
                  <ShoppingBag size={16} />
                  {isInCart ? "Go to Cart" : "Add to Cart"}
                </button>
              )}

              {isInCart && (
                <Link
                  to="/shopping-cart"
                  className="w-full flex items-center justify-center gap-3 border border-neutral-900 text-neutral-900 text-[12px] font-bold tracking-[0.18em] uppercase py-4 hover:bg-neutral-900 hover:text-white transition-colors duration-200 no-underline"
                >
                  Proceed to Checkout <ArrowRight size={15} />
                </Link>
              )}
            </div>

            {/* Description */}
            <div className="pt-8 border-t border-neutral-200 mt-6">
              <h2 className="text-[11px] font-bold tracking-[0.18em] uppercase text-neutral-900 mb-3">
                Description
              </h2>
              <p className="text-sm text-neutral-500 leading-relaxed">{product?.description}</p>
            </div>

            {/* Policies */}
            <div className="pt-6 grid grid-cols-2 gap-3 mt-2">
              {policies.map((policy) => (
                <div
                  key={policy.name}
                  className="flex items-start gap-3 bg-white border border-neutral-100 p-4"
                >
                  <policy.icon className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-[11px] font-bold tracking-wide text-neutral-900">{policy.name}</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">{policy.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── REVIEWS ── */}
        <section className="mt-24">
          <div className="flex items-end justify-between mb-8 pb-6 border-b border-neutral-200">
            <div>
              <div className="text-[10px] font-bold tracking-[0.22em] uppercase text-amber-500 mb-2">
                What customers say
              </div>
              <h2
                className="text-3xl font-black text-neutral-900"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                Customer <span className="italic">Reviews</span>
              </h2>
            </div>
            <Link
              to={`/add-review/${product?._id}`}
              className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] uppercase text-neutral-900 border-b border-neutral-900 pb-0.5 hover:text-amber-500 hover:border-amber-500 transition-colors no-underline"
            >
              Write a Review <ArrowRight size={13} />
            </Link>
          </div>

          {product?.reviews?.length === 0 ? (
            <div className="text-center py-16 text-neutral-400">
              <StarIcon className="h-10 w-10 mx-auto mb-3 text-neutral-200" />
              <p className="text-sm font-medium">No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <div className="space-y-0 divide-y divide-neutral-100">
              {product?.reviews?.map((review) => (
                <div key={review._id} className="py-8 grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6">
                  {/* Reviewer info */}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-neutral-900 text-white flex items-center justify-center text-sm font-bold shrink-0">
                        {review?.user?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-neutral-900">{review?.user?.name}</p>
                        <time className="text-xs text-neutral-400">
                          {new Date(review.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </time>
                      </div>
                    </div>
                  </div>

                  {/* Review content */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      {[0, 1, 2, 3, 4].map((r) => (
                        <StarIcon
                          key={r}
                          className={classNames(
                            review.rating > r ? "text-amber-400" : "text-neutral-200",
                            "h-4 w-4 shrink-0"
                          )}
                        />
                      ))}
                      <span className="text-xs text-neutral-500 font-medium ml-1">
                        {review.rating}/5
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-neutral-900 mb-2">{review?.message}</h3>
                    <div
                      className="text-sm text-neutral-500 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: review.content }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}