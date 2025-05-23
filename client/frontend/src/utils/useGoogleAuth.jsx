
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Cookies from "js-cookie";
import baseURL from "./baseURL";



const useGoogleAuth = () => {
  const navigate = useNavigate();

  const handleGoogleAuth = async (authResult) => {
    try {
      if (authResult?.code) {
        const response = await axios.get(
          `${baseURL}/user/google/callback?code=${authResult.code}`,
          { withCredentials: true }
        );
        Cookies.set("user", JSON.stringify(response.data), { expires: 7 });
        navigate("/");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleAuth,
    onError: (error) => {
      console.error("Google Login Failed:", error);
    },
    flow: "auth-code",
  });

  return googleLogin;
};

export default useGoogleAuth;
