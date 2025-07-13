import { useEffect } from "react";
import Swal from "sweetalert2";
import { resetSuccess } from "../../redux/resetError/resetError";
import { useDispatch } from "react-redux";

const SuccessMsg = ({ message }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (message) {
      Swal.fire({
        icon: "success",
        text: message,
      }).then(() => {
        dispatch(resetSuccess());
      });
    }
  }, [message, dispatch]);

  return null; // No visible UI needed
};

export default SuccessMsg;
