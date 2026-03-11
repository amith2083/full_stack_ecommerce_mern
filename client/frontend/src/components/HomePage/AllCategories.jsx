import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategory } from "../../redux/slices/category/categorySlices";
import { ArrowRight } from "lucide-react";

const AllCategories = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategory());
  }, [dispatch]);

  const {
    categories: { categories },
  } = useSelector((state) => state?.categories);

  return (
    <div className="bg-stone-100 min-h-screen font-sans">

      {/* HERO HEADER */}
      <div className="bg-neutral-900 px-10 py-20 relative overflow-hidden">
        {/* Ghost watermark */}
        <span
          className="absolute bottom-[-30px] right-[-20px] text-[180px] font-black text-white opacity-[0.03] pointer-events-none select-none whitespace-nowrap"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          CATEGORIES
        </span>

        <div className="max-w-7xl mx-auto relative z-10 flex items-end justify-between flex-wrap gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-px bg-amber-500 block"></span>
              <span className="text-[10px] font-bold tracking-[0.28em] uppercase text-amber-500">Shop by</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05]" style={{ fontFamily: "'Georgia', serif" }}>
              All<br /><span className="italic text-amber-400">Categories</span>
            </h1>
          </div>

          {/* Count badge */}
          <div className="border border-white/10 bg-white/5 px-7 py-5 flex items-center gap-4">
            <div>
              <div className="text-3xl font-bold text-amber-400 leading-none" style={{ fontFamily: "'Georgia', serif" }}>
                {categories?.length ?? "—"}
              </div>
              <div className="text-[10px] tracking-[0.18em] uppercase text-white/40 mt-1">Total Categories</div>
            </div>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {categories?.map((category, i) => (
            <Link
              key={category?.name}
              to={`/products-filters?category=${category?.name}`}
              className={`group relative block overflow-hidden bg-neutral-200 no-underline${i === 0 ? " col-span-2 row-span-2" : ""}`}
              style={{ aspectRatio: i === 0 ? "auto" : "3/4", minHeight: i === 0 ? "420px" : undefined }}
            >
              {/* Image */}
              <img
                src={category?.image}
                alt={category?.name}
                loading="lazy"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.07] absolute inset-0"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-all duration-300" />

              {/* Arrow badge top-right */}
              <div className="absolute top-3.5 right-3.5 w-9 h-9 bg-amber-500 flex items-center justify-center text-neutral-900 opacity-0 scale-75 rotate-[-45deg] group-hover:opacity-100 group-hover:scale-100 group-hover:rotate-0 transition-all duration-300">
                <ArrowRight size={16} />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3
                  className="text-white font-bold leading-tight mb-1.5"
                  style={{
                    fontFamily: "'Georgia', serif",
                    fontSize: i === 0 ? "26px" : "18px",
                  }}
                >
                  {category.name}
                </h3>
                <p className="text-[11px] tracking-[0.14em] uppercase text-white/50">
                  {category.products?.length} products
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllCategories;