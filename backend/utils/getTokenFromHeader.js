export const getTokenFromHeader = async (req) => {
  const token =
     req?.headers?.authorization?.split(" ")[1];
  if (token === undefined) {
    return "No token found";
  } else {
    return token;
  }
};
