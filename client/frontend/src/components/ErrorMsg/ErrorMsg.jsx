// import Swal from "sweetalert2";
// import { resetError } from "../../redux/resetError/resetError";
// import { useDispatch } from "react-redux";

// const ErrorMsg = ({ message }) => {
//   const dispatch = useDispatch()
//   Swal.fire({
//     icon: "error",
//     title: "Oops...",
//     text: message,
//   });
//   dispatch(resetError());
// };

// export default ErrorMsg;
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { resetError } from "../../redux/resetError/resetError";
import { useEffect } from "react";

const ErrorMsg = ({ message }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (message) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: message,
      }).then(() => {
        // Reset the error only after the user closes the alert
        dispatch(resetError());
      });
    }
  }, [message, dispatch]);

  return null; // Nothing to render visually
};

export default ErrorMsg;

// const ErrorMsg = ({ message }) => {
//   const dispatch = useDispatch();

//   // Show the SweetAlert2 with custom styling and buttons
//   Swal.fire({
//     icon: "error",
//     title: "Oops...",
//     text: message,
//     showConfirmButton: true,  // Show the button to dismiss the alert
//     confirmButtonText: "Okay",  // Custom text for the button
//     confirmButtonColor: "#3085d6",  // Color for the button
//     background: "#f8d7da",  // Light red background
//     iconColor: "#721c24",  // Icon color (red for error)
//     customClass: {
//       popup: 'swal-popup',  // Custom popup class for easy CSS styling
//       title: 'swal-title',  // Style the title
//       content: 'swal-content',  // Style the content
//     },
//     willClose: () => {
//       // Reset the error after the alert is closed
//       dispatch(resetError());
//     },
//   });
// };

// export default ErrorMsg;
