import axiosInstance from "./axiosConfig";
import Swal from "sweetalert2";

export const openRazorpayModal = ({ key, amount, order_id, navigate,orderId,isWallet=false }) => {
  const options = {
    key, // Razorpay Key ID
    amount: amount * 100, // Amount in paisa
    currency: "INR",
    name: "TrendzCart",
    description: isWallet ? "Wallet Top-Up" : "Order Payment",
    order_id, // Razorpay Order ID
    handler: async function (response) {
      console.log("Payment Success:", response);
      // console.log('orderid',orderId)
      try {
         // Choose API endpoint based on whether it's a wallet payment or order payment
         const verifyUrl = isWallet ? `/wallet/user-profile/payment-verify` : `/order/payment-verify`;
        // Verify the payment on the backend
        // const verifyResponse = await axiosInstance.post(verifyUrl, {
        //   razorpay_payment_id: response.razorpay_payment_id,
        //   razorpay_order_id: response.razorpay_order_id,
        //   razorpay_signature: response.razorpay_signature,
        // });
        // Create request payload dynamically
        const payload = {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        };
      // Add amount for wallet payments
      if (isWallet) {
        payload.amount = amount;
      }

      // Add orderId for order payments
      if (!isWallet && orderId) {
        payload.orderId = orderId;
      }
       // Verify the payment on the backend
       const verifyResponse = await axiosInstance.post(verifyUrl, payload);

        if (verifyResponse.data.success) {
          Swal.fire({
            icon: "success",
            title: "Payment Successful",
            text: isWallet ? "Wallet funds added successfully!" : "Your order has been placed successfully!",
            timer: 3000, // Auto-close after 3 seconds
            showConfirmButton: false,
          }).then(() => {
            navigate(isWallet ? '/user-profile/wallet' : '/success');
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Payment Failed",
            text: "Your payment could not be verified. Redirecting to your orders.",
            timer: 3000,
            showConfirmButton: false,
          }).then(() => {
            navigate('/user-profile/orders');
          });
        }
      } catch (error) {
        console.error("Payment verification error:", error);
      
        Swal.fire({
          icon: "error",
          title: "Payment Verification Failed",
          text: "There was an issue verifying your payment. Redirecting to orders.",
          timer: 3000,
          showConfirmButton: false,
        }).then(() => {
          navigate('/user-profile/orders');
        });;
      }
    },
    prefill: {
      name: "Test User",
      email: "testuser@example.com",
      
    },
    theme: {
      color: "#F37254",
    },
    modal: {
      escape: false,
      ondismiss: async function () {
        console.log("User closed the Razorpay modal.");
        if (isWallet) {
          // If it's a wallet payment, don't call the API, just show a message
          Swal.fire({
            icon: "warning",
            title: "Payment Cancelled",
            text: "You closed the payment window. Your wallet was not credited.",
            timer: 3000,
            showConfirmButton: false,
          }).then(() => {
            navigate('/user-profile/wallet'); // Redirect to wallet page
          });
          return; // Stop further execution
        }
        try {
          await axiosInstance.put(`/order/payment-failed`, { orderId });
          Swal.fire({
            icon: "warning",
            title: "Payment Failed",
            text: " Redirecting to orders.",
            timer: 3000,
            showConfirmButton: false,
          }).then(() => {
            navigate('/user-profile/orders');
          });
        } catch (error) {
          console.error("Error updating payment status:", error);
        }
        navigate('/user-profile/orders'); // Redirect to orders page
      },
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};
