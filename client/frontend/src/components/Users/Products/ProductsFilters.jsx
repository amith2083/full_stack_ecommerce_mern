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
import { ArrowRight, RotateCcw, Search, SlidersHorizontal } from "lucide-react";

const sortOptions = [
  { name: "Most Popular", value: "popularity" },
  { name: "Best Rating", value: "rating" },
  { name: "Newest", value: "newest" },
  { name: "Price: Low to High", value: "price_asc" },
  { name: "Price: High to Low", value: "price_desc" },
];

const allPrice = [
  { amount: "100 - 500" },
  { amount: "500 - 1000" },
  { amount: "1000 - 1500" },
  { amount: "1500 - 2000" },
  { amount: "2000 - 3000" },
  { amount: "3000 - 3500" },
];

const sizeCategories = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

/* ─── Reusable sidebar section ─── */
function FilterSection({ title, children }) {
  return (
    <Disclosure as="div" className="border-b border-neutral-100 py-5">
      {({ open }) => (
        <>
          <Disclosure.Button className="flex w-full items-center justify-between text-left">
            <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-neutral-900">
              {title}
            </span>
            <span className="text-neutral-400">
              {open ? <MinusIcon className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
            </span>
          </Disclosure.Button>
          <Disclosure.Panel className="pt-4">{children}</Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

export default function ProductsFilters() {
  const dispatch = useDispatch();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [params, setParams] = useSearchParams();
  const category = params.get("category");
  const [page, setPage] = useState(1);
  const limit = 8;
  const [searchTerm, setSearchTerm] = useState("");
  const [color, setColor] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("");
  const [sort, setSort] = useState("popularity");

  const resetFilters = () => {
    setColor(""); setPrice(""); setBrand(""); setSize("");
    setSort("popularity"); setPage(1); setSearchTerm("");
    setParams(category ? { category } : {});
  };

  const debouncedSetSearchTerm = useCallback(
    debounce((value) => setSearchTerm(value), 500),
    []
  );

  let productUrl = `/product?page=${page}&limit=${limit}`;
  if (category) productUrl = `/product?category=${category}`;
  if (brand) productUrl += `&brand=${brand}`;
  if (size) productUrl += `&size=${size}`;
  if (price) productUrl += `&price=${price}`;
  if (color) productUrl += `&color=${color?.name}`;
  if (searchTerm) productUrl += `&name=${encodeURIComponent(searchTerm)}`;
  productUrl += `&page=${page}&limit=${limit}`;
  if (sort) productUrl += `&sort=${sort}`;

  useEffect(() => {
    dispatch(fetchProduct({ url: productUrl }));
  }, [dispatch, category, size, brand, price, color, sort, searchTerm, page]);

  useEffect(() => { dispatch(fetchBrand({ url: productUrl })); }, [dispatch]);
  useEffect(() => { dispatch(fetchColor({ url: productUrl })); }, [dispatch]);

  useEffect(() => {
    resetFilters();
  }, [category]);

  useEffect(() => {
    setPage(1); setColor(""); setBrand(""); setSize(""); setPrice(""); setSearchTerm("");
  }, [category]);

  const { products, loading, error, pagination } = useSelector((s) => s?.products);
  const { brands: { brands } } = useSelector((s) => s?.brands);
  const { colors: { colors } } = useSelector((s) => s?.colors);

  const handleNextPage = () => { if (pagination?.next) setPage((p) => p + 1); };
  const handlePrevPage = () => { if (pagination?.prev) setPage((p) => p - 1); };

  /* ── Shared filter panel content ── */
  const FilterPanelContent = () => (
    <div className="space-y-1">
      {/* Search */}
      <div className="pb-5 border-b border-neutral-100">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search products..."
            defaultValue={searchTerm}
            onChange={(e) => debouncedSetSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-stone-50 border border-neutral-200 focus:outline-none focus:border-neutral-900 transition-colors placeholder:text-neutral-400"
          />
        </div>
      </div>

      {/* Clear Filters */}
      <button
        type="button"
        onClick={resetFilters}
        className="flex items-center gap-2 text-[10px] font-bold tracking-[0.16em] uppercase text-neutral-500 hover:text-rose-500 transition-colors py-3"
      >
        <RotateCcw size={12} /> Clear All Filters
      </button>

      {/* Colors */}
      <FilterSection title="Color">
        <RadioGroup onChange={setColor}>
          <div className="flex flex-wrap gap-2">
            {colors?.map((c) => (
              <RadioGroup.Option
                key={c?._id}
                value={c}
                className={({ checked }) =>
                  classNames(
                    "relative rounded-full cursor-pointer focus:outline-none transition-all duration-150",
                    checked ? "ring-2 ring-offset-2 ring-neutral-900 scale-110" : "hover:scale-105"
                  )
                }
              >
                <span
                  style={{ backgroundColor: c?.name }}
                  className="block h-7 w-7 rounded-full border border-black/10"
                />
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Price">
        <RadioGroup value={price} onChange={setPrice}>
          <div className="space-y-1.5">
            {allPrice.map((p) => (
              <RadioGroup.Option
                key={p.amount}
                value={p.amount}
                className={({ checked }) =>
                  classNames(
                    "flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors",
                    checked ? "bg-neutral-900 text-white" : "hover:bg-stone-50 text-neutral-600"
                  )
                }
              >
                {({ checked }) => (
                  <span className={`text-sm font-medium ${checked ? "text-white" : "text-neutral-600"}`}>
                    ₹{p.amount}
                  </span>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand">
        <RadioGroup value={brand} onChange={setBrand}>
          <div className="space-y-1.5">
            {brands?.map((b) => (
              <RadioGroup.Option
                key={b?._id}
                value={b?.name}
                className={({ checked }) =>
                  classNames(
                    "flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors",
                    checked ? "bg-neutral-900 text-white" : "hover:bg-stone-50 text-neutral-600"
                  )
                }
              >
                {({ checked }) => (
                  <span className={`text-sm font-medium ${checked ? "text-white" : "text-neutral-600"}`}>
                    {b?.name}
                  </span>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </FilterSection>

      {/* Size */}
      <FilterSection title="Size">
        <RadioGroup value={size} onChange={setSize}>
          <div className="flex flex-wrap gap-2">
            {sizeCategories.map((s) => (
              <RadioGroup.Option
                key={s}
                value={s}
                className={({ checked }) =>
                  classNames(
                    "w-12 h-12 flex items-center justify-center text-sm font-bold cursor-pointer border transition-all duration-150",
                    checked
                      ? "bg-neutral-900 text-white border-neutral-900"
                      : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-900"
                  )
                }
              >
                {s}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </FilterSection>
    </div>
  );

  return (
    <div className="bg-white min-h-screen font-sans">

      {/* ── MOBILE FILTER DRAWER ── */}
      <Transition.Root show={mobileFiltersOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileFiltersOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0" enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100" leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full" enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0" leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-6 pb-12 shadow-2xl">
                <div className="flex items-center justify-between px-6 mb-6">
                  <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-900">
                    Filters
                  </h2>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="px-6">
                  <FilterPanelContent />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* ── PAGE HEADER ── */}
      <div className="bg-neutral-900 px-8 py-16 relative overflow-visible">
        <span
          className="absolute bottom-[-20px] right-0 text-[160px] font-black text-white opacity-[0.03] pointer-events-none select-none"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          SHOP
        </span>
        <div className="max-w-7xl mx-auto relative z-10 flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-6 h-px bg-amber-500 block"></span>
              <span className="text-[10px] font-bold tracking-[0.28em] uppercase text-amber-500">
                {category || "All Products"}
              </span>
            </div>
            <h1
              className="text-5xl sm:text-6xl font-black text-white leading-none"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              {category ? (
                <>{category.charAt(0).toUpperCase() + category.slice(1)}</>
              ) : (
                <>Product <span className="italic text-amber-400">Collection</span></>
              )}
            </h1>
          </div>

          {/* Sort + Mobile filter trigger */}
          <div className="flex items-center gap-3">
            {/* Sort dropdown */}
            <Menu as="div" className="relative z-50">
              <Menu.Button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold tracking-wider uppercase px-5 py-2.5 transition-colors">
                Sort <ChevronDownIcon className="h-4 w-4 text-white/60" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-[9999] mt-1 w-52 bg-white shadow-2xl ring-1 ring-black/10 focus:outline-none">
                  {sortOptions.map((option) => (
                    <Menu.Item key={option.name}>
                      {({ active }) => (
                        <button
                          onClick={() => setSort(option.value)}
                          className={classNames(
                            "w-full text-left px-4 py-3 text-[11px] font-semibold tracking-wider uppercase transition-colors",
                            sort === option.value
                              ? "bg-neutral-900 text-white"
                              : active
                              ? "bg-stone-50 text-neutral-900"
                              : "text-neutral-500"
                          )}
                        >
                          {option.name}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>

            {/* Mobile filter button */}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold tracking-wider uppercase px-5 py-2.5 transition-colors"
            >
              <SlidersHorizontal size={14} /> Filters
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-x-10 lg:grid-cols-[240px_1fr]">

          {/* ── DESKTOP SIDEBAR ── */}
          <aside className="hidden lg:block">
            <div className="sticky top-6">
              <div className="mb-6">
                <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-neutral-400">
                  Refine
                </span>
                <h2
                  className="text-2xl font-black text-neutral-900 mt-1"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  Filters
                </h2>
              </div>
              <FilterPanelContent />
            </div>
          </aside>

          {/* ── PRODUCTS AREA ── */}
          <div>
            {/* Active filters summary */}
            {(color || price || brand || size || searchTerm) && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-400">Active:</span>
                {[
                  color && { label: color?.name || color, clear: () => setColor("") },
                  price && { label: `₹${price}`, clear: () => setPrice("") },
                  brand && { label: brand, clear: () => setBrand("") },
                  size && { label: size, clear: () => setSize("") },
                  searchTerm && { label: `"${searchTerm}"`, clear: () => setSearchTerm("") },
                ]
                  .filter(Boolean)
                  .map((tag, i) => (
                    <button
                      key={i}
                      onClick={tag.clear}
                      className="flex items-center gap-1.5 bg-neutral-900 text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 hover:bg-rose-500 transition-colors"
                    >
                      {tag.label} ×
                    </button>
                  ))}
              </div>
            )}

            {/* Product grid */}
            {loading ? (
              <LoadingComponent />
            ) : error ? (
              <ErrorMsg />
            ) : products?.length <= 0 ? (
              <NoDataFound />
            ) : (
              <Products products={products} />
            )}

            {/* Pagination */}
            <div className="flex items-center justify-center gap-4 mt-14">
              <button
                onClick={handlePrevPage}
                disabled={!pagination?.prev}
                className={classNames(
                  "flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] uppercase px-8 py-3.5 border transition-all duration-200",
                  !pagination?.prev
                    ? "border-neutral-200 text-neutral-300 cursor-not-allowed"
                    : "border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white"
                )}
              >
                ← Prev
              </button>

              <span className="text-[11px] tracking-wider uppercase text-neutral-400 font-semibold">
                Page {page}
              </span>

              <button
                onClick={handleNextPage}
                disabled={!pagination?.next}
                className={classNames(
                  "flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] uppercase px-8 py-3.5 border transition-all duration-200",
                  !pagination?.next
                    ? "border-neutral-200 text-neutral-300 cursor-not-allowed"
                    : "border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white"
                )}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}