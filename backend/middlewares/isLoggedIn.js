import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

export const isLoggedIn = async (req, res, next) => {
  //get tokken from header

  try {
    // Get token from header
    const token = await getTokenFromHeader(req);

    if (token === "No token found") {
      throw new Error("No token found. Please log in.");
    }

    // Verify token
    const decodedUser = verifyToken(token);

    if (!decodedUser) {
      throw new Error("Token expired/invalid, please log in again.");
    }

    // Attach user ID to the request object
    req.userAuthId = decodedUser.id;

    next();
  } catch (err) {
    next(err); // Pass the error to the global error handler with error msg in new error
  }
};
