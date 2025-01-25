import React from 'react';
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';

const AdminCheck= ({ children }) => {
  const userCookie = Cookies.get('user');
  const user = userCookie ? JSON.parse(userCookie) : null;
  const isAdmin = user?.userFound?.isAdmin ? true : false;

  if (!isAdmin) {
    // Redirect to the login page
    // return <Navigate to="/login" replace />;
    return <h1>access denied</h1>
  }

  return children;
};

export default AdminCheck;
