import { Fragment, useCallback, useEffect, useState } from "react";

import {
  Dialog,
  Disclosure,
  Menu,
  Transition,
  RadioGroup,
} from "@headlessui/react";

import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import { debounce } from "lodash";
import Products from "./Products";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../../../redux/slices/products/productSlices";
import { fetchBrand } from "../../../redux/slices/brand/brandSlices";
import { fetchColor } from "../../../redux/slices/color/colorSlices";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import ErrorMsg from "../../ErrorMsg/ErrorMsg";
import NoDataFound from "../../NoDataFound/NoDataFound";

const sortOptions = [
  { name: "Most Popular", value: "popularity", current: true },
  { name: "Best Rating", value: "rating", current: false },
  { name: "Newest", value: "newest", current: false },
  { name: "Price: Low to High", value: "price_asc", current: false },
  { name: "Price: High to Low", value: "price_desc", current: false },
];

const allPrice = [
 
  {
    amount: "100 - 500",
  },
  {
    amount: "500 - 1000",
  },
  {
    amount: "1000 - 1500",
  },
  {
    amount: "1500 - 2000",
  },
  {
    amount: "2000 - 3000",
  },
  {
    amount: "3000 - 3500",
  },
 
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const sizeCategories = [
  "XXS",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  
];

export default function ProductsFilters() {
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [params, setParams] = useSearchParams();
  const category = params.get("category");
  const [page, setPage] = useState(1);
  const limit = 8; // Number of products per page
  const [searchTerm, setSearchTerm] = useState("");
  //filters
  const [color, setColor] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("");
//sort
const [sort, setSort] = useState("popularity"); // Default sort option
// Reset filters function
  const resetFilters = () => {
    setColor("");
    setPrice("");
    setBrand("");
    setSize("");
    setSort("popularity");
    setPage(1);
    setSearchTerm("");
    // Clear query parameters except category
    setParams(category ? { category } : {});
  };
   // Debounced fetch function
  // const debouncedFetchProduct = useCallback(
  //   debounce((url) => {
  //     dispatch(fetchProduct({ url }));
  //   }, 500),
  //   [dispatch]
  // );
  // Debounced function to update search term
const debouncedSetSearchTerm = useCallback(
  debounce((value) => {
    setSearchTerm(value);
  }, 500),
  []
);

  //fetching products------------------------------------------------------------------------------------------------
  //build up url
  let productUrl = `/product?page=${page}&limit=${limit}`;
  if(category){
    productUrl=`/product?category=${category}`
  }
 
  if(brand){
    productUrl=`${productUrl}&brand=${brand}`
  }
  if(size){
    productUrl=`${productUrl}&size=${size}`
  }
  if (price) {
    productUrl = `${productUrl}&price=${price}`;
  }
  if (color) {
    productUrl = `${productUrl}&color=${color?.name}`;
  }
  if (searchTerm) {
  productUrl = `${productUrl}&name=${encodeURIComponent(searchTerm)}`;
}
  if (page) {
    productUrl += `&page=${page}&limit=${limit}`;
  }
  if (sort) productUrl += `&sort=${sort}`;  // Include sort option
 
  // useEffect(() => {
  //   debouncedFetchProduct(productUrl);
  //   // Cleanup debounce on unmount to prevent memory leaks
  //   return () => {
  //     debouncedFetchProduct.cancel();
  //   };
  // }, [category, size, brand, price, color, sort, page, debouncedFetchProduct]);
  useEffect(() => {
    dispatch(fetchProduct({ url: productUrl }));
  },[dispatch,category,size,brand,price,color,sort,searchTerm,page]);
  //get data from store
  const {
    products,loading,error,pagination,
    } = useSelector((state) => state?.products);
    

  //fetching brands---------------------------------------------------------------------------------------------------------
  useEffect(() => {
    dispatch(fetchBrand({ url: productUrl }));
  },[dispatch]);
  //get data from store
  const {
    brands: { brands},
  } = useSelector((state) => state?.brands);
  //fetching colors--------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    dispatch(fetchColor({ url: productUrl }));
  },[dispatch]);
  //get data from store
  // Reset filters when category changes
  useEffect(() => {
    resetFilters();
  }, [category]);
  const {
    colors: { colors },
  } = useSelector((state) => state?.colors);
  useEffect(() => {
    setPage(1);  // Reset page to 1 when category changes
    setColor("");
  setBrand("");
  setSize("");
  setPrice("");
  setSearchTerm("");
  }, [category])

 
  const handleNextPage = () => {
    if (pagination?.next) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagination?.prev) {
      setPage((prevPage) => prevPage - 1);
    }
  };
  let colorsLoading;
  let colorsError;
 
  
  let productsLoading;
  let productsError;

  return (
    <div className="bg-white">
      <div>
        {/* Mobile menu */}
        <Transition.Root show={mobileMenuOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setMobileMenuOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                  <div className="flex px-4 pt-5 pb-2">
                    <button
                      type="button"
                      className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
      </div>

      <div>
        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setMobileFiltersOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      Filters
                    </h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Mobile Filters */}
                  <form className="mt-4 border-t border-gray-200">
                    {/*  */}
                    {/* Search Input for Mobile */}
    <div className="px-4 py-2">
      <input
        type="text"
        placeholder="Search products..."
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onChange={(e) => debouncedSetSearchTerm(e.target.value)}
        value={searchTerm}
      />
    </div>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="w-full px-4 py-2 mb-4 text-sm font-medium text-white bg-orange-400 rounded-md hover:bg-orange-700"
                    >
                      Clear All Filters
                    </button>
                    <Disclosure
                      as="div"
                      key="disclosure"
                      className="border-t border-gray-200 px-4 py-6"
                    >
                      {({ open }) => (
                        <>
                          <h3 className="-mx-2 -my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                              <span className="font-medium text-gray-900">
                                Choose Color
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <PlusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>

                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-6">
                              {/* Any Color */}
                              {colorsLoading ? (
                                <h2>Loading...</h2>
                              ) : colorsError ? (
                                <h2>{colorsError}</h2>
                              ) : (
                                <RadioGroup onChange={setColor}>
                                  <div className="flex items-start  flex-row flex-wrap">
                                    {colors?.map((color) => (
                                      <RadioGroup.Option
                                        key={color?._id}
                                        value={color}
                                        className={({ active, checked }) =>
                                          classNames(
                                            active && checked
                                              ? "ring ring-offset-1"
                                              : "",
                                            !active && checked ? "ring-2" : "",
                                            " relative  rounded-full flex  flex-col items-center justify-center cursor-pointer focus:outline-none m-2"
                                          )
                                        }
                                      >
                                        <span
                                          style={{
                                            backgroundColor: color?.name,
                                          }}
                                          aria-hidden="true"
                                          className="h-8 w-8 border border-black border-opacity-10 rounded-full"
                                        />
                                      </RadioGroup.Option>
                                    ))}
                                  </div>
                                </RadioGroup>
                              )}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>

                    {/* price categories section */}
                    <Disclosure
                      as="div"
                      key="disclosure"
                      className="border-t border-gray-200 px-4 py-6"
                    >
                      {({ open }) => (
                        <>
                          <h3 className="-mx-2 -my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                              <span className="font-medium text-gray-900">
                                Price
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <PlusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-6 mt-2">
                             <RadioGroup value={price} onChange={setPrice}>
                                {allPrice?.map((price) => (
                                  <RadioGroup.Option
                                    key={price.amount}
                                    value={price.amount}
                                    className={({ active, checked }) =>
                                      classNames(
                                        active && checked
                                          ? "ring ring-offset-1"
                                          : "",
                                        !active && checked ? "ring-2" : "",
                                        "relative flex items-center cursor-pointer"
                                      )
                                    }
                                  >
                                    <input
                                      type="radio"
                                      name="price"
                                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <RadioGroup.Label className="ml-3 min-w-0 flex-1 text-gray-500">
                                      ₹{price.amount}
                                    </RadioGroup.Label>
                                  </RadioGroup.Option>
                                ))}
                              </RadioGroup>
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    {/*  end price categories section  */}

                    {/* product brand categories section categories section */}
                    <Disclosure
                      as="div"
                      key="disclosure"
                      className="border-t border-gray-200 px-4 py-6"
                    >
                      {({ open }) => (
                        <>
                          <h3 className="-mx-2 -my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                              <span className="font-medium text-gray-900">
                                Brand
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <PlusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-2">
                               <RadioGroup value={brand} onChange={setBrand}>
                                {brands?.map((brand) => (
                                  <RadioGroup.Option
                                    key={brand?._id}
                                    value={brand?.name}
                                    className={({ active, checked }) =>
                                      classNames(
                                        active && checked
                                          ? "ring ring-offset-1"
                                          : "",
                                        !active && checked ? "ring-2" : "",
                                        "relative flex items-center cursor-pointer"
                                      )
                                    }
                                  >
                                    <input
                                      type="radio"
                                      name="brand"
                                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <RadioGroup.Label className="ml-3 min-w-0 flex-1 text-gray-500">
                                      {brand?.name}
                                    </RadioGroup.Label>
                                  </RadioGroup.Option>
                                ))}
                              </RadioGroup>
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    {/*  end product brand categories section */}

                    {/* product size categories   */}
                    <Disclosure
                      as="div"
                      key="disclosure"
                      className="border-t border-gray-200 px-4 py-6"
                    >
                      {({ open }) => (
                        <>
                          <h3 className="-mx-2 -my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                              <span className="font-medium text-gray-900">
                                Size
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <PlusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-6">
                             <RadioGroup value={size} onChange={setSize}>
                                {sizeCategories.map((option) => (
                                  <RadioGroup.Option
                                    key={option}
                                    value={option}
                                    className={({ active, checked }) =>
                                      classNames(
                                        active && checked
                                          ? "ring ring-offset-1"
                                          : "",
                                        !active && checked ? "ring-2" : "",
                                        "relative flex items-center cursor-pointer"
                                      )
                                    }
                                  >
                                    <input
                                      type="radio"
                                      name="size"
                                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <RadioGroup.Label className="ml-3 min-w-0 flex-1 text-gray-500">
                                      {option}
                                    </RadioGroup.Label>
                                  </RadioGroup.Option>
                                ))}
                              </RadioGroup>
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    {/*  end product size categories section */}
                  </form>
                  {/* end of mobile filters */}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pt-24 pb-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Product Filters
            </h1>
            {/* sort */}
            <div className="flex items-center">
              <input
        type="text"
        placeholder="Search products..."
        className="mr-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
         value={searchTerm} onChange={(e) => debouncedSetSearchTerm(e.target.value)}
      />
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <ChevronDownIcon
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                {/* sort item links */}
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <button
                            onClick={() => {
                              setSort(option.value); // Update sort state
                            }}
                            className={classNames(
                              option.current ? "font-medium text-gray-900" : "text-gray-500",
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm"
                            )}
                          >
                            {option.name}
                          </button>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pt-6 pb-24">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Desktop  Filters */}
              <form className="hidden lg:block">
                <button
                type="button"
                onClick={resetFilters}
                className="w-full px-4 py-2 mb-4 text-sm font-medium text-white bg-orange-400 rounded-md hover:bg-orange-700"
              >
                Clear All Filters
              </button>
                
                <h3 className="sr-only">Categories</h3>

                {/* colors categories Desktop section */}
                <Disclosure
                  as="div"
                  key="disclosure"
                  className="border-t border-gray-200 px-4 py-6"
                >
                  
                  {({ open }) => (
                    <>
                      <h3 className="-mx-2 -my-3 flow-root">
                        <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                          <span className="font-medium text-gray-900">
                            Colors 
                          </span>
                          <span className="ml-6 flex items-center">
                            {open ? (
                              <MinusIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>

                      <Disclosure.Panel className="pt-6">
                        <div className="space-y-6">
                          {/* Any Color */}
                          {colorsLoading ? (
                            <h2>Loading...</h2>
                          ) : colorsError ? (
                            <h2>{colorsError}</h2>
                          ) : (
                            <RadioGroup onChange={setColor}>
                              <div className="flex items-start  flex-row flex-wrap">
                                {colors?.map((color) => (
                                  <RadioGroup.Option
                                    key={color?.id}
                                    value={color}
                                    className={({ active, checked }) =>
                                      classNames(
                                        active && checked
                                          ? "ring ring-offset-1"
                                          : "",
                                        !active && checked ? "ring-2" : "",
                                        " relative  rounded-full flex  flex-col items-center justify-center cursor-pointer focus:outline-none m-2"
                                      )
                                    }
                                  >
                                    <span
                                      style={{ backgroundColor: color?.name }}
                                      aria-hidden="true"
                                      className="h-8 w-8 border border-black border-opacity-10 rounded-full"
                                    />
                                  </RadioGroup.Option>
                                ))}
                              </div>
                            </RadioGroup>
                          )}
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                {/* colors end categories section */}

                {/* price categories section Desktop*/}
                <Disclosure
                  as="div"
                  key="disclosure"
                  className="border-t border-gray-200 px-4 py-6"
                >
                  
                  {({ open }) => (
                    <>
                      <h3 className="-mx-2 -my-3 flow-root">
                        <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                          <span className="font-medium text-gray-900">
                            Price
                          </span>
                          <span className="ml-6 flex items-center">
                            {open ? (
                              <MinusIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel className="pt-6">
                        <div className="space-y-6 mt-2">
                   <RadioGroup value={price} onChange={setPrice}>
                            {allPrice?.map((price) => (
                              <RadioGroup.Option
                                key={price.amount}
                                value={price.amount}
                                className={({ active, checked }) =>
                                  classNames(
                                    active && checked
                                      ? "ring ring-offset-1"
                                      : "",
                                    !active && checked ? "ring-2" : "",
                                    "relative flex items-center cursor-pointer"
                                  )
                                }
                              >
                                <input
                                  type="radio"
                                  name="price"
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <RadioGroup.Label className="ml-3 min-w-0 flex-1 text-gray-500">
                                  ₹{price.amount}
                                </RadioGroup.Label>
                              </RadioGroup.Option>
                            ))}
                          </RadioGroup>
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                {/*  end price categories section  Desktop*/}

                {/* product brand categories section categories section */}
                <Disclosure
                  as="div"
                  key="disclosure"
                  className="border-t border-gray-200 px-4 py-6"
                >
                  {({ open }) => (
                    <>
                      <h3 className="-mx-2 -my-3 flow-root">
                        <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                          <span className="font-medium text-gray-900">
                            Brand
                          </span>
                          <span className="ml-6 flex items-center">
                            {open ? (
                              <MinusIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel className="pt-6">
                        <div className="space-y-2">
                          <RadioGroup value={brand} onChange={setBrand}>
                            {brands?.map((brand) => (
                              <RadioGroup.Option
                                key={brand?._id}
                                value={brand?.name}
                                className={({ active, checked }) =>
                                  classNames(
                                    active && checked
                                      ? "ring ring-offset-1"
                                      : "",
                                    !active && checked ? "ring-2" : "",
                                    "relative flex items-center cursor-pointer"
                                  )
                                }
                              >
                                <input
                                  type="radio"
                                  name="brand"
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <RadioGroup.Label className="ml-3 min-w-0 flex-1 text-gray-500">
                                  {brand?.name}
                                </RadioGroup.Label>
                              </RadioGroup.Option>
                            ))}
                          </RadioGroup>
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                {/*  end product brand categories section */}

                {/* product size categories  desktop */}
                <Disclosure
                  as="div"
                  key="disclosure"
                  className="border-t border-gray-200 px-4 py-6"
                >
                  {({ open }) => (
                    <>
                      <h3 className="-mx-2 -my-3 flow-root">
                        <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                          <span className="font-medium text-gray-900">
                            Size
                          </span>
                          <span className="ml-6 flex items-center">
                            {open ? (
                              <MinusIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel className="pt-6">
                        <div className="space-y-6">
                          <RadioGroup value={size} onChange={setSize}>
                            {sizeCategories.map((option) => (
                              <RadioGroup.Option
                                key={option}
                                value={option}
                                className={({ active, checked }) =>
                                  classNames(
                                    active && checked
                                      ? "ring ring-offset-1"
                                      : "",
                                    !active && checked ? "ring-2" : "",
                                    "relative flex items-center cursor-pointer"
                                  )
                                }
                              >
                                <input
                                  type="radio"
                                  name="size"
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <RadioGroup.Label className="ml-3 min-w-0 flex-1 text-gray-500">
                                  {option}
                                </RadioGroup.Label>
                              </RadioGroup.Option>
                            ))}
                          </RadioGroup>
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                {/*  end product size categories section */}
              </form>

              {/* Product grid */}
             {loading? <LoadingComponent/>:error?<ErrorMsg/>:products?.length<=0?<NoDataFound/>: <Products products={products} />}
            </div>
          </section>
         {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <button
          onClick={handlePrevPage}
          disabled={!pagination?.prev}
          className={`px-4 py-2 mx-2 border rounded ${!pagination?.prev ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`}
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={!pagination?.next}
          className={`px-4 py-2 mx-2 border rounded ${!pagination?.next ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`}
        >
          Next
        </button>
      </div>
        </main>
      </div>
    </div>
  );
}
