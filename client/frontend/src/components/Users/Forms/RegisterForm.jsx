import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { registerUserAction } from "../../../redux/slices/users/userSlices";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import ErrorMsg from "../../ErrorMsg/ErrorMsg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import google from "./google.png";
import useGoogleAuth from "../../../utils/useGoogleAuth";
import { validateRegisterForm } from "../../../utils/validations/registrationValidation";
import Swal from "sweetalert2";

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const googleLogin = useGoogleAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = formData;
  //---onchange handler-----------------------------------------------------------------------------------
  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //---onsubmit handler----------------------------------------------------------------------------------------
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const validationError = validateRegisterForm({ name, email, password });
    if (validationError) {
      return Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: validationError,
      });
    }
    localStorage.setItem("email", email);
    const resultAction = await dispatch(
      registerUserAction({ email, password, name })
    );

    if (resultAction?.payload.status === "success") {
         // Set OTP expiration 60 seconds from now
    localStorage.setItem("otpExpiration", Date.now() + 60000);
      navigate("/verify-otp");
    }
  };
  //select store data

  const { user, error, loading } = useSelector((state) => state?.users);
   useEffect(() => {
      const userCookie = Cookies.get("user");
       const user = userCookie ? JSON.parse(userCookie) : null;
       const isLoggedIn = !!user?.token;
      if (isLoggedIn) {
        navigate("/"); // Redirect to homepage if user is authenticated
      }
    }, [ navigate]);

  return (
    <>
      <section className="relative overflow-x-hidden">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap items-center">
            <div className="w-full lg:w-2/6 px-4 mb-12 lg:mb-0">
              <div className="py-20 text-center">
                <h3 className="mb-6 text-2xl md:text-4xl font-bold font-heading">
                  Create Your Account
                </h3>
                {/* errr */}
                {/* Error */}
                {error && <ErrorMsg message={error?.message} />}
                <p className="mb-10">Join us today and start shopping!</p>

                <form onSubmit={onSubmitHandler}>
                  <input
                    name="name"
                    value={name}
                    onChange={onChangeHandler}
                    className="w-full mb-4 px-12 py-6 border border-gray-200 focus:ring-blue-300 focus:border-blue-300 rounded-md"
                    type="text"
                    placeholder="Full Name"
                    required
                  />
                  <input
                    name="email"
                    value={email}
                    onChange={onChangeHandler}
                    className="w-full mb-4 px-12 py-6 border border-gray-200 focus:ring-blue-300 focus:border-blue-300 rounded-md"
                    type="email"
                    placeholder="Enter your email"
                    required
                  />
                  <input
                    name="password"
                    value={password}
                    onChange={onChangeHandler}
                    className="w-full mb-4 px-12 py-6 border border-gray-200 focus:ring-blue-300 focus:border-blue-300 rounded-md"
                    type="password"
                    placeholder="Enter your password"
                    required
                  />
                  {loading ? (
                    <LoadingComponent />
                  ) : (
                    <button className="mt-12 md:mt-16 w-3/4 bg-blue-800 hover:bg-blue-900 text-white font-bold font-heading py-5 px-8 rounded-md uppercase">
                      Register
                    </button>
                  )}
                </form>
                {/* Divider with "or sign in with" */}
                <div className="flex items-center my-6">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <p className="mx-4 text-gray-500 text-sm">or sign in with</p>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                {/* Google Sign-In Button with Colored Icon */}
                <button
                  onClick={() => googleLogin()}
                  className="flex items-center justify-center w-full py-4 px-6 border border-gray-300 rounded-md shadow-md bg-white hover:bg-gray-100 transition duration-200"
                >
                  <img src={google} alt="Google" className="w-6 h-6 mr-2" />
                  <span className="text-gray-700 font-semibold">
                    Sign in with Google
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="hidden lg:block lg:absolute top-0 bottom-16 right-0 lg:w-3/6   bg-center bg-no-repeat"
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
