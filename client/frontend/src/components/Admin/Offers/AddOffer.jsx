import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchProduct } from "../../../redux/slices/products/productSlices";
import { fetchCategory } from "../../../redux/slices/category/categorySlices";
import { useDispatch, useSelector } from "react-redux";
import { createOffer } from "../../../redux/slices/offers/OfferSlices";

export default function AddOffer() {
    const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [applicableTo, setApplicableTo] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  console.log('selected',selectedItem)
 
  
  // Get products & categories from Redux store
  const { products,} = useSelector((state) => state.products);
 
  const { categories} = useSelector((state) => state.categories);



  const [formData, setFormData] = useState({
   code : "",
    discount: "",
    description: "",
  });

  const onHandleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
   // Fetch products or categories dynamically based on selection
   useEffect(() => {
    if (applicableTo === "Product") {
      dispatch(fetchProduct({ url: "/product" }));
    } else {
      dispatch(fetchCategory());
    }
  }, [applicableTo, dispatch]);

  const onHandleSubmit = (e) => {
    e.preventDefault();
    const offerData = {
        code: formData.code,
        offerType: "percentage", // Change this as needed
        offerValue: formData.discount, 
        startDate,
        endDate,
        description: formData.description,
        applicableTo,
        applicableToProduct: applicableTo === "Product" ? selectedItem : null,
        applicableToCategory: applicableTo === "Category" ? selectedItem : null,
        usageLimit: 10, // Set a default usage limit or take input from the user
      };
    
      dispatch(createOffer(offerData))
        .unwrap()
        .then((response) => {
          console.log("Offer created successfully", response);
          // Optionally, show a success message or navigate to another page
        })
        .catch((error) => {
          console.error("Failed to create offer", error);
          // Optionally, show an error message
        });
  };

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Add New Offer
      </h2>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={onHandleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">offer code</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={onHandleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
              <input
                name="discount"
                value={formData.discount}
                onChange={onHandleChange}
                type="number"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={onHandleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Applicable To</label>
              <select
                value={applicableTo}
                onChange={(e) => setApplicableTo(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              >
                <option value="Product">Product</option>
                <option value="Category">Category</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {applicableTo === "Product" ? "Select Product" : "Select Category"}
              </label>
              <select
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              >
                {applicableTo === "Product"
                  ? products?.map((product, index) => (
                      <option key={index} value={product._id}>
                        {product.name}
                      </option>
                    ))
                  : categories?.categories?.map((category, index) => (
                      <option key={index} value={category._id}>
                        {category.name}
                      </option>
                    ))}
              </select>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Add Offer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}