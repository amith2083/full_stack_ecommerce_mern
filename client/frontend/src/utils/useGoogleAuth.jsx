
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
// import axios from "axios";
import Cookies from "js-cookie";
import baseURL from "./baseURL";
import Swal from "sweetalert2";
import axiosInstance from "./axiosConfig";



const useGoogleAuth = () => {
  const navigate = useNavigate();

  const handleGoogleAuth = async (authResult) => {
    try {
      if (authResult?.code) {
        const response = await axiosInstance.get(
          `/user/google/callback?code=${authResult.code}`,
          // { withCredentials: true }
        );
        Cookies.set("user", JSON.stringify(response.data), { expires: 7 });
        navigate("/");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong with Google sign-in. Please try again later.",
      });
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleAuth,
    onError: (error) => {
      console.error("Google Login Failed:", error);
      Swal.fire({
        icon: "error",
        title: "Google Sign-In Failed",
        text:
          error?.error_description ||
          "Unable to sign in with Google. Please try again or use another method.",
      });
    },
    flow: "auth-code",
  });

  return googleLogin;
};

export default useGoogleAuth;
