import React from 'react';
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';

const AuthRoute = ({ children }) => {
  const userCookie = Cookies.get('user');
  const user = userCookie ? JSON.parse(userCookie) : null;
  const isLogged = user?.token ? true : false;

  if (!isLogged) {
    // Redirect to the login page
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AuthRoute;
