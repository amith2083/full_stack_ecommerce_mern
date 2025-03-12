import axiosInstance from "./axiosConfig";
import Swal from "sweetalert2";

export const openRazorpayModal = ({ key, amount, order_id, navigate, orderId, isWallet = false }) => {
  const options = {
    key, // Razorpay Key ID
    amount: amount * 100, // Amount in paisa
    currency: "INR",
    name: "TrendzCart",
    description: isWallet ? "Wallet Top-Up" : "Order Payment",
    order_id, // Razorpay Order ID
    handler: async function (response) {
      console.log("Payment Success:", response);
      try {
        const verifyUrl = isWallet ? `/wallet/user-profile/payment-verify` : `/order/payment-verify`;
        
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
            timer: 3000,
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
        });
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
        console.log("ondismiss triggered");

        if (isWallet) {
          Swal.fire({
            icon: "warning",
            title: "Payment Cancelled",
            text: "You closed the payment window. Your wallet was not credited.",
            timer: 3000,
            showConfirmButton: false,
          }).then(() => {
            navigate('/user-profile/wallet');
          });
          return;
        }

        try {
          const payload = {
            razorpay_payment_id: null, // No payment ID since it was dismissed
            razorpay_order_id: order_id,
            razorpay_signature: null, // No signature available
            orderId,
            failed: true, // Mark as a failed attempt
          };
          const verifyResponse =await axiosInstance.post('/order/payment-verify', payload);
          if (!verifyResponse.data.success) {
            Swal.fire({
              icon: "warning",
              title: "Payment Cancelled",
              text: "Your closed payment window. Your order was not placed",
              timer: 3000,
              showConfirmButton: false,
            }).then(() => {
              navigate('/user-profile/orders');
            });
          }
        } catch (error) {
          console.error("Error updating payment status:", error);
        }

        navigate('/user-profile/orders');
      },
    },
  };

  // Initialize Razorpay instance
  const rzp = new window.Razorpay(options);

  // Handle Payment Failure Event
  rzp.on("payment.failed", async function (response) {
    console.log("Payment failed triggered:", response);
   
    // Check if the Razorpay instance is still valid before closing
    if (rzp) {
      rzp.close(); // Close modal if it's still active
  }

  // Forcefully remove any lingering Razorpay elements from the DOM
  document.querySelectorAll('.razorpay-container').forEach(el => el.remove());

    if (isWallet) {
      Swal.fire({
        icon: "warning",
        title: "Payment Cancelled",
        text: "Your wallet was not credited.",
        timer: 3000,
        showConfirmButton: false,
      }).then(() => {
        
        // navigate('/user-profile/wallet');
        window.location.href='/user-profile/wallet'
      });
      return;
    }

    try {
      const payload = {
        razorpay_payment_id: response.error.metadata.payment_id || null,
        razorpay_order_id: response.error.metadata.order_id || order_id,
        razorpay_signature: null, // No signature available for failed payments
        orderId,
        failed: true, // Mark as a failed attempt
      };
  

      await axiosInstance.post('/order/payment-verify', payload);

      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: "Your payment was not completed. Redirecting to your orders.",
        timer: 3000,
        showConfirmButton: false,
      }).then(() => {
      
        // navigate('/user-profile/orders');
        window.location.href = "/user-profile/orders";
      });
      return

    } catch (error) {
      console.error("Error handling failed payment:", error);
      
    }

    // navigate('/user-profile/orders');
  });

  // Open Razorpay modal
  rzp.open();
};
