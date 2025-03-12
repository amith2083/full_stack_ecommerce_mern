import React from 'react';
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';
import AccessDenied from '../NoDataFound/AccessDenied';

const AdminCheck= ({ children }) => {
  const userCookie = Cookies.get('user');
  const user = userCookie ? JSON.parse(userCookie) : null;
  // const isAdmin = user?.userFound?.isAdmin ? true : false;
  const isAdmin = user?.user?.isAdmin ? true : false;

  if (!isAdmin) {
    // Redirect to the login page
    // return <Navigate to="/login" replace />;
    return <AccessDenied/>
  }

  return children;
};

export default AdminCheck;
