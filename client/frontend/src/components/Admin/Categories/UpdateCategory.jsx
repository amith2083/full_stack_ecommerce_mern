import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ErrorComponent from "../../ErrorMsg/ErrorMsg";
import SuccessMsg from "../../SuccessMsg/SuccessMsg";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleCategory, updateCategory } from "../../../redux/slices/category/categorySlices";
import Swal from "sweetalert2";



export default function UpdateCategory() {
  const { id } = useParams(); // Get category ID from URL
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const fileInputRef = useRef(null);  
  const { category, loading, error,isUpdated } = useSelector((state) => state?.categories);
 
  useEffect(() => {
    dispatch(fetchSingleCategory(id));
  }, [dispatch, id]);
  //---form data---
  const [formData, setFormData] = useState({
    name: ""
  });
  useEffect(()=>{
    if(category?.category){
      setFormData({
        name:category?.category?.name||''
      })
    }
  },[category])
  //---onChange---
  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [file, setFile] = useState(null);
  const [fileErr, setFileErr] = useState(null);


  const fileHandleChange = (event) => {
    const newFile = event.target.files[0];
    console.log("______",newFile)
  
    if (!newFile) return; // Ensure a file is selected before proceeding.
  
    if (newFile.size > 1000000) {
      setFileErr(`${newFile.name} is too large`);
    
      fileInputRef.current.value = "";
      return; // Stop execution if file is too large
    }
    if (!newFile.type.startsWith("image/")) {
      setFileErr(`${newFile.name} is not an image`);
    
      fileInputRef.current.value = "";
      return; // Stop execution if file is not an image
    }
  
    setFileErr(null); // Reset file error if valid
    setFile(newFile); // Update state with valid file
   
  };
  console.log('file',file)
  useEffect(() => {
    console.log("Updated file state:", file);
  }, [file]);
  
  // let loading, error, isUpdated, categoryName;

  //onSubmit
  const handleOnSubmit = (e) => {
    e.preventDefault();
    const updatedFormData = new FormData();
  updatedFormData.append("name", formData.name); // ✅ Correct
  if (file) {
    updatedFormData.append("file", file);
  }
    dispatch(updateCategory({ id, updatedFormData })).then(()=>{
      dispatch(fetchSingleCategory(id)).then(()=>{
        navigate('/admin/manage-category')
      })
    })
    
    };
  
  return (
    <>
      {error && <ErrorComponent message={error?.message} />}
      {fileErr && <ErrorComponent message={fileErr} />}
      {isUpdated && <SuccessMsg message="Category updated successfully" />}
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <svg
            className="mx-auto h-10 text-blue-600 w-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
            />
          </svg>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Update Product Category
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleOnSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <div className="mt-1">
                  <input
                    onChange={handleOnChange}
                    value={formData.name}
                    name="name"
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                {/* <label
                  htmlFor="cover-photo"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Upload Images
                </label> */}
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
                          <span>Upload file</span>
                          <input
                          id="file-upload"
                          ref={fileInputRef}
                           
                          
                            onChange={fileHandleChange}
                            type="file"
                            accept="image/*" 
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 1MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                {loading ? (
                  <LoadingComponent />
                ) : (
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Update Category
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
