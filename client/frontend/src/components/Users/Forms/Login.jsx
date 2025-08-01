import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUserAction } from "../../../redux/slices/users/userSlices";
import ErrorMsg from "../../ErrorMsg/ErrorMsg";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import { useNavigate } from "react-router-dom";
import { getCartItemsFromDatabase } from "../../../redux/slices/cart/cartSlices";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import google from "./google.png";
import useGoogleAuth from "../../../utils/useGoogleAuth";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const googleLogin = useGoogleAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const { loading, error } = useSelector((state) => state?.users?.userAuth);
  // Check if user is already logged in
  useEffect(() => {
    const userCookie = Cookies.get("user");
     const user = userCookie ? JSON.parse(userCookie) : null;
     const isLoggedIn = !!user?.token;
    if (isLoggedIn) {
      navigate("/"); // Redirect to homepage if user is authenticated
    }
  }, [ navigate]);

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const response = await dispatch(loginUserAction({ email, password }));

    if (response?.payload?.message === "login success") {
      await dispatch(getCartItemsFromDatabase());
      navigate("/");
    } else {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: response.payload?.message || "Invalid email or password",
      });
    }
  };

  return (
    <>
      <section className="py-20 bg-gray-100 overflow-x-hidden">
        <div className="relative container px-4 mx-auto">
          <div className="absolute inset-0 bg-blue-200 my-24 -ml-4" />
          <div className="relative flex flex-wrap bg-white">
            <div className="w-full md:w-4/6 px-4">
              <div className="lg:max-w-3xl mx-auto py-20 px-4 md:px-10 lg:px-20">
                <h3 className="mb-8 text-4xl md:text-5xl font-bold font-heading">
                  Login to your account
                </h3>
                <p className="mb-10 font-semibold font-heading">
                  Happy to see you again
                </p>
                {error && <ErrorMsg message={error?.message} />}
                <form
                  className="flex flex-wrap -mx-4"
                  onSubmit={onSubmitHandler}
                >
                  <div className="w-full md:w-1/2 px-4 mb-8 md:mb-12">
                    <label>
                      <h4 className="mb-5 text-gray-400 uppercase font-bold font-heading">
                        Your Email
                      </h4>
                      <input
                        name="email"
                        value={email}
                        onChange={onChangeHandler}
                        className="p-5 w-full border border-gray-200 focus:ring-blue-300 focus:border-blue-300 rounded-md"
                        type="email"
                        required
                      />
                    </label>
                  </div>
                  <div className="w-full md:w-1/2 px-4 mb-12">
                    <label>
                      <h4 className="mb-5 text-gray-400 uppercase font-bold font-heading">
                        Password
                      </h4>
                      <input
                        name="password"
                        value={password}
                        onChange={onChangeHandler}
                        className="p-5 w-full border border-gray-200 focus:ring-blue-300 focus:border-blue-300 rounded-md"
                        type="password"
                        required
                      />
                    </label>
                  </div>

                  <div className="w-full px-4 flex justify-center">
                    {loading ? (
                      <LoadingComponent />
                    ) : (
                      <button className="bg-blue-800  hover:bg-blue-900 w-1/2 text-white font-bold font-heading py-5 px-8 rounded-md uppercase">
                        Login
                      </button>
                    )}
                  </div>
                </form>
                <div className="w-full px-4 mt-6">
                  <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <p className="mx-4 text-gray-500 text-sm">
                      or sign in with
                    </p>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>
                  <button
                    type="button"
                    onClick={() => googleLogin()}
                    className="w-full flex items-center justify-center gap-3 py-4 px-6 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-100 transition duration-200"
                  >
                    <img src={google} alt="Google" className="w-5 h-5" />
                    <span className="text-gray-700 font-medium">
                      Continue with Google
                    </span>
                  </button>
                </div>
              </div>
            </div>
         <div className="w-full md:w-2/6">
  <img
    src="/images/young-woman.jpg"
    alt="Login background"
    className="w-full h-[50vh] md:h-auto object-contain"
  />
</div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
