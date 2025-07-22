import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import ErrorMsg from "../../ErrorMsg/ErrorMsg";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import SuccessMsg from "../../SuccessMsg/SuccessMsg";
import { fetchCategory } from "../../../redux/slices/category/categorySlices";
import { fetchBrand } from "../../../redux/slices/brand/brandSlices";
import { fetchColor } from "../../../redux/slices/color/colorSlices";
import { createProduct } from "../../../redux/slices/products/productSlices";
import { useNavigate } from "react-router-dom";

//animated components for react-select
const animatedComponents = makeAnimated();

export default function AddProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //files
  const [files, setFiles] = useState([]);
  const [fileErrs, setFileErrs] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const fileHandleChange = (event) => {
    const newFiles = Array.from(event.target.files);

    //validation
    const newErrs = [];
    const newPreviews = [];

    //
    // Check if more than 3 images are selected
    if (newFiles.length > 3) {
      setFileErrs(["You can only upload up to 3 images."]);
      return;
    }
    newFiles.forEach((file) => {
      if (file?.size > 1000000) {
        newErrs.push(`${file?.name} is too large`);
        return;
      }
      if (!file?.type?.startsWith("image/")) {
        newErrs.push(`${file?.name} is not an image`);
      }
      newPreviews.push(URL.createObjectURL(file));
    });

    setFiles(newFiles);
    setFileErrs(newErrs);
    setPreviewImages(newPreviews);
  };
  //for fetch categories---------------------------------------------------------------------------------------------------------
  useEffect(() => {
    dispatch(fetchCategory());
  }, [dispatch]);
  const { categories } = useSelector((state) => state?.categories?.categories);

  //for fetch brands--------------------------------------------------------------------------------------------------------
  useEffect(() => {
    dispatch(fetchBrand());
  }, [dispatch]);
  const { brands } = useSelector((state) => state?.brands?.brands);
  //for fetch colors----------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    dispatch(fetchColor());
  }, [dispatch]);
  const { colors } = useSelector((state) => state?.colors?.colors);

  //for size--------------------------------------------------------------------------------------------------------------------
  const sizes = ["M", "S", "L", "XL"];
  const [sizeOption, setSizeOption] = useState([]); //for submitting to backend
  const sizeOptionsConverted = sizes?.map((size) => {
    return {
      value: size,
      label: size,
    };
  });
  const handleSizeChange = (selectedSizes) => {
    setSizeOption(selectedSizes);
  };

  //for color---------------------------------------------------------------------------------------------------------------------
  const [colorOption, setColorOption] = useState([]);
  const colorOptionsConverted = colors?.map((color) => {
    return {
      value: color?.name,
      label: color?.name,
    };
  });
  const handleColorChange = (colors) => {
    setColorOption(colors);
  };

  // let  categories,
  //      sizeOptionsConverted,
  //      handleSizeChange,
  //   colorOptionsCoverted,
  //   handleColorChangeOption

  //---form data---
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    sizes: "",
    brand: "",
    color: "",

    price: "",
    totalQty: "",
  });

  //onChange
  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  //get data from store
  const { product, isAdded, error, loading } = useSelector(
    (state) => state?.products
  );

  //onSubmit
  const handleOnSubmit = (e) => {
    e.preventDefault();

    //reset form data
    setFormData({
      name: "",
      description: "",
      category: "",
      brand: "",
      price: "",
      totalQty: "",
    });
    dispatch(
      createProduct({
        ...formData,
        files,
        color: colorOption?.map((color) => color?.label),
        sizes: sizeOption?.map((size) => size?.label),
      })
    ).then(() => {
      navigate("/admin/manage-products");
    });
  };

  return (
    <>
      {error && <ErrorMsg message={error?.message} />}
      {fileErrs?.length > 0 && <ErrorMsg message={fileErrs} />}
      {isAdded && <SuccessMsg message="Product Added Successfully" />}
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Create New Product
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            <p className="font-medium text-indigo-600 hover:text-indigo-500">
              Manage Products
            </p>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleOnSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <div className="mt-1">
                  <input
                    name="name"
                    value={formData?.name}
                    onChange={handleOnChange}
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              {/* size option */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Size
                </label>
                <Select
                  components={animatedComponents}
                  isMulti
                  name="sizes"
                  options={sizeOptionsConverted}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  isClearable={true}
                  isLoading={false}
                  isSearchable={true}
                  closeMenuOnSelect={false}
                  onChange={(item) => handleSizeChange(item)}
                />
              </div>
              {/* Select category */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleOnChange}
                  className="mt-1  block w-full rounded-md border-gray-300 py-2  pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm border"
                  defaultValue="Canada"
                >
                  {/* <option>-- Select Category --</option>
                  <option value="Clothings">Clothings</option>
                  <option value="Shoes">Shoes</option>
                  <option value="Accessories">Accessories</option> */}
                  <option>-- Select Category --</option>
                  {categories?.map((category) => (
                    <option key={category?._id} value={category?.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Select Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Brand
                </label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleOnChange}
                  className="mt-1  block w-full rounded-md border-gray-300 py-2  pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm border"
                  defaultValue="Canada"
                >
                  <option>-- Select Brand --</option>
                  {brands?.map((brand) => (
                    <option key={brand?._id} value={brand?.name}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Color
                </label>
                <Select
                  components={animatedComponents}
                  isMulti
                  name="color"
                  options={colorOptionsConverted}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  isClearable={true}
                  isLoading={false}
                  isSearchable={true}
                  closeMenuOnSelect={false}
                  onChange={(e) => handleColorChange(e)}
                />
              </div>

              {/* upload images */}
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="cover-photo"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Upload Images
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <div className="flex max-w-lg justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <span>Upload files</span>
                          <input
                            multiple
                            onChange={fileHandleChange}
                            type="file"
                            accept="image/*"
                          />
                        </label>
                      </div>
                      {/* Show Preview */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {previewImages.map((img, index) => (
                          <img
                            key={index}
                            src={img}
                            alt="Preview"
                            className="w-24 h-24 object-cover rounded-md"
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 1MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* price */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <div className="mt-1">
                  <input
                    name="price"
                    value={formData.price}
                    onChange={handleOnChange}
                    type="number"
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Total Quantity
                </label>
                <div className="mt-1">
                  <input
                    name="totalQty"
                    value={formData.totalQty}
                    onChange={handleOnChange}
                    type="number"
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              {/* description */}
              <div>
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700"
                >
                  Add Product Description
                </label>
                <div className="mt-1">
                  <textarea
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleOnChange}
                    className="block w-full rounded-md border-gray-300 border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                {loading ? (
                  <LoadingComponent />
                ) : (
                  <button
                    disabled={fileErrs?.length > 0}
                    type="submit"
                    className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Add Product
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
