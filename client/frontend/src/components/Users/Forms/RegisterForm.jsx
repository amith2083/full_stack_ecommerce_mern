import React, { useState,useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";

import { registerUserAction } from "../../../redux/slices/users/userSlices";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import ErrorMsg from "../../ErrorMsg/ErrorMsg";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  //dispatch
  const dispatch = useDispatch()
  const navigate=useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  //---Destructuring---
  const { name, email, password } = formData;
  //---onchange handler----
  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //---onsubmit handler----
  const onSubmitHandler = async(e) => {
    e.preventDefault();
    localStorage.setItem("email", email);
   const resultAction= await dispatch(registerUserAction({email,password,name}))
   console.log('result',resultAction)
    
    if (registerUserAction.fulfilled.match(resultAction)) {
      // Navigate only if the user is newly registered
      navigate("/verify-otp");
    }
  };
  //select store data

  //select store data
  const { user, error, loading } = useSelector((state) => state?.users);
  console.log(user)
  //   useEffect(() => {
  //   if (user) {
  //    navigate('/login')
  //   }
  // }, [user,navigate]);
  // Check if user is available, then redirect to login page
  // Redirect to /login when the user is successfully registered

  return (
    <>
      <section className="relative overflow-x-hidden">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap items-center">
            <div className="w-full lg:w-2/6 px-4 mb-12 lg:mb-0">
              <div className="py-20 text-center">
                <h3 className="mb-8 text-4xl md:text-5xl font-bold font-heading">
                  Signing up with social is super quick
                </h3>
                {/* errr */}
                {/* Error */}
               {error && <ErrorMsg message={error?.message}/>}
                <p className="mb-10">Please, do not hesitate</p>
                <form onSubmit={onSubmitHandler}>
                  <input
                    name="name"
                    value={name}
                    onChange={onChangeHandler}
                    className="w-full mb-4 px-12 py-6 border border-gray-200 focus:ring-blue-300 focus:border-blue-300 rounded-md"
                    type="text"
                    placeholder="Full Name"
                  />
                  <input
                    name="email"
                    value={email}
                    onChange={onChangeHandler}
                    className="w-full mb-4 px-12 py-6 border border-gray-200 focus:ring-blue-300 focus:border-blue-300 rounded-md"
                    type="email"
                    placeholder="Enter your email"
                  />
                  <input
                    name="password"
                    value={password}
                    onChange={onChangeHandler}
                    className="w-full mb-4 px-12 py-6 border border-gray-200 focus:ring-blue-300 focus:border-blue-300 rounded-md"
                    type="password"
                    placeholder="Enter your password"
                  />
                {loading ? (
                    <LoadingComponent />
                  ) : (
                    <button className="mt-12 md:mt-16 bg-blue-800 hover:bg-blue-900 text-white font-bold font-heading py-5 px-8 rounded-md uppercase">
                      Register
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
        <div
  className="hidden lg:block lg:absolute top-0 bottom-0 right-0 lg:w-3/6 bg-center bg-no-repeat"
  style={{
    backgroundImage: `url("/images/young-woman.jpg")`,
    backgroundSize: "cover", // Ensures the image covers the entire container
    backgroundPosition: "top center", // Centers the image
   

  }}
/>
      </section>
    </>
  );
};

export default RegisterForm;
