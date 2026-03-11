import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProduct } from "../../redux/slices/products/productSlices";
import { ArrowRight, TrendingUp, Heart } from "lucide-react";

const HomeProductTrending = () => {
  const dispatch = useDispatch();
  const productUrl = `/product`;

  useEffect(() => {
    dispatch(fetchProduct({ url: productUrl }));
  }, [dispatch]);

  const { products, loading } = useSelector((state) => state?.products);

  return (
    <section className="bg-white py-20 font-sans">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-8 mb-12 flex items-end justify-between flex-wrap gap-5">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.26em] uppercase text-amber-500 mb-2">
            <TrendingUp size={12} />
            What's Hot Right Now
          </div>
          <h2
            className="text-4xl sm:text-5xl font-black text-neutral-900 leading-none"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Trending <span className="italic text-rose-500">Products</span>
          </h2>
        </div>
        <Link
          to="/products-filters"
          className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] uppercase text-neutral-900 border-b border-neutral-900 pb-0.5 hover:text-rose-500 hover:border-rose-500 transition-colors no-underline"
        >
          Shop the Collection <ArrowRight size={14} />
        </Link>
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-0.5">
          {loading
            ? [...Array(8)].map((_, i) => (
                <div key={i} className="bg-stone-100 animate-pulse">
                  <div className="aspect-[3/4] bg-stone-200" />
                  <div className="bg-white p-4">
                    <div className="h-3 bg-stone-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-stone-200 rounded w-1/3" />
                  </div>
                </div>
              ))
            : products?.slice(0, 8).map((product, i) => (
                <Link
                  to={`/product/${product._id}`}
                  key={product._id}
                  className="group relative block no-underline bg-stone-100"
                >
                  {/* Image */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-stone-200">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-white text-neutral-900 text-[10px] font-bold tracking-[0.18em] uppercase px-6 py-3 translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        Quick View
                      </div>
                    </div>

                    {/* Trending badge */}
                    {i < 3 && (
                      <div className="absolute top-3 left-3 bg-rose-500 text-white text-[9px] font-bold tracking-[0.18em] uppercase px-2.5 py-1">
                        Trending
                      </div>
                    )}

                    {/* Wishlist */}
                    <button
                      onClick={(e) => e.preventDefault()}
                      className="absolute top-3 right-3 w-8 h-8 bg-white flex items-center justify-center text-neutral-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all duration-200"
                      aria-label="Add to wishlist"
                    >
                      <Heart size={14} />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="bg-white px-4 py-4">
                    <p className="text-sm font-medium text-neutral-800 truncate leading-snug mb-1.5">
                      {product.name}
                    </p>
                    <div className="flex items-center justify-between">
                      <p
                        className="text-base font-bold text-neutral-900"
                        style={{ fontFamily: "'Georgia', serif" }}
                      >
                        ₹{product.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </div>

      {/* CTA STRIP */}
      <div className="max-w-7xl mx-auto px-8 mt-12 text-center">
        <Link
          to="/products-filters"
          className="inline-flex items-center gap-3 bg-neutral-900 text-white text-[11px] font-bold tracking-[0.18em] uppercase px-14 py-4 hover:bg-rose-500 transition-colors duration-200 no-underline"
        >
          View All Products <ArrowRight size={15} />
        </Link>
      </div>

    </section>
  );
};

export default HomeProductTrending;