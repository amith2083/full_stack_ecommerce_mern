import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategory } from "../../redux/slices/category/categorySlices";

const AllCategories = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategory());
  }, [dispatch]);

  const {
    categories: { categories },
  } = useSelector((state) => state?.categories);

  return (
    <>
      <div className="bg-gradient-to-r from-indigo-100 via-white to-pink-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
            Total Categories <span className="text-indigo-600">[{categories?.length}]</span>
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Browse categories and discover amazing products just for you.
          </p>
        </div>
      </div>

      <div className="bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories?.map((category) => (
              <Link
                key={category?.name}
                to={`/products-filters?category=${category?.name}`}
                className="group relative block rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <img
                  src={category?.image}
                  alt={category?.name}
                  className="h-64 w-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-60 transition duration-300" />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
                  <h3 className="text-white text-xl font-bold drop-shadow-lg">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-200">
                    ({category.products.length} products)
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllCategories;
