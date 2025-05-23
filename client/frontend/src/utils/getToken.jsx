// utils/getToken.js
import Cookies from "js-cookie";

const getToken = () => {
  const userCookie = Cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie) : null;
  return user?.token || null;
};

export default getToken;
