import Swal from "sweetalert2";
import { resetError } from "../../redux/resetError/resetError";
import { useDispatch } from "react-redux";

const ErrorMsg = ({ message }) => {
  const dispatch = useDispatch()
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: message,
  });
  dispatch(resetError());
};

export default ErrorMsg;
