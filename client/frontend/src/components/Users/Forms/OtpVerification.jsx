import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resendOtp, verifyOtp } from "../../../redux/slices/users/userSlices";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import ErrorMsg from "../../ErrorMsg/ErrorMsg";
import SuccessMsg from "../../SuccessMsg/SuccessMsg";

const OtpVerification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  // Retrieve email from Redux or localStorage
  const emailFromState = useSelector((state) => state.users?.email);
  const email = emailFromState || localStorage.getItem("email");

  // Set and Retrieve OTP expiration time
  const getExpirationTime = () => {
    return localStorage.getItem("otpExpiration")
      ? parseInt(localStorage.getItem("otpExpiration"), 10)
      : Date.now() + 60000; // Default: 60 seconds if not stored
  };

  const [timeLeft, setTimeLeft] = useState(
    Math.max(0, Math.floor((getExpirationTime() - Date.now()) / 1000))
  );

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsDisabled(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsDisabled(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Store OTP expiration in localStorage
  useEffect(() => {
    if (timeLeft > 0) {
      localStorage.setItem("otpExpiration", Date.now() + timeLeft * 1000);
    } else {
      localStorage.removeItem("otpExpiration");
    }
  }, [timeLeft]);

  // Format Time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  const onChangeHandler = (e) => {
    setOtp(e.target.value);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!otp) return;

    const res = await dispatch(verifyOtp({ email, otp }));

    if (res?.payload?.status === "success") {
      localStorage.removeItem("otpExpiration"); // Remove OTP expiry after successful verification
      navigate("/login");
    }
  };
  const { error, loading, success } = useSelector((state) => state.users);
  console.log('success',success)
  const handleResendOtp = async () => {
    const result = await dispatch(resendOtp({ email }));

    if (resendOtp.rejected.match(result)) {
      const message = result.payload?.message || result.payload;

      if (message && message.toLowerCase().includes("please register again")) {
        // Remove stored data and navigate to register
        localStorage.removeItem("email");
        localStorage.removeItem("otpExpiration");
        navigate("/register");
        return;
      }
    }

    // If no error, reset timer
    setTimeLeft(60);
    setIsDisabled(false);
    localStorage.setItem("otpExpiration", Date.now() + 60000);
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
                  OTP Verification
                </h3>
                {success && (
                  <SuccessMsg message={success?.message} />
                )}
                {error && <ErrorMsg message={error?.message} />}
                <p className="mb-10 font-semibold font-heading">
                  Please enter the OTP sent to your email
                </p>

                {/* Timer */}
                <p className="mb-6 text-red-500 font-bold">
                  Time left: {formatTime(timeLeft)}
                </p>

                <form
                  className="flex flex-wrap -mx-4"
                  onSubmit={onSubmitHandler}
                >
                  <div className="w-full px-4 mb-8">
                    <label>
                      <h4 className="mb-5 text-gray-400 uppercase font-bold font-heading">
                        Enter OTP
                      </h4>
                      <input
                        name="otp"
                        value={otp}
                        onChange={onChangeHandler}
                        className="p-5 w-full border border-gray-200 focus:ring-blue-300 focus:border-blue-300 rounded-md"
                        type="text"
                        maxLength="6"
                        placeholder="Enter 6-digit OTP"
                      />
                    </label>
                  </div>

                  <div className="w-full px-4">
                    {loading ? (
                      <LoadingComponent />
                    ) : (
                      <button
                        type="submit"
                        className={`py-5 px-8 rounded-md uppercase font-bold font-heading ${
                          isDisabled
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-blue-800 hover:bg-blue-900 text-white"
                        }`}
                        disabled={isDisabled}
                      >
                        {isDisabled ? "OTP Expired" : "Verify OTP"}
                      </button>
                    )}
                  </div>
                </form>

                {/* Resend OTP button when timer expires */}
                {isDisabled && (
                  <div className="w-full px-4 mt-4">
                    <button
                      onClick={handleResendOtp}
                      className="bg-red-700 hover:bg-blue-800 text-white font-bold font-heading py-4 px-6 rounded-md"
                    >
                      Resend OTP
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div
              className="w-full md:w-2/6 h-128 md:h-auto flex items-center lg:items-end px-4 pb-20 bg-cover bg-no-repeat"
              style={{
                backgroundImage: `url("/images/otp-verification.jpg")`,
              }}
            ></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OtpVerification;
