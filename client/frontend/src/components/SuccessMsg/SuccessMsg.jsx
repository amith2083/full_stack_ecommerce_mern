import Swal from "sweetalert2";
import { resetSuccess } from "../../redux/resetError/resetError";
import { useDispatch } from "react-redux";

const SuccessMsg = ({ message }) => {
  const dispatch = useDispatch();
  Swal.fire({
    icon: "success",
    // title: "Good job!",
    text: message,
  });
  dispatch(resetSuccess())
};

export default SuccessMsg;
