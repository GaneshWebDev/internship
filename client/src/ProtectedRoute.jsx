import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

// ProtectedRoute component
const ProtectedRoute = () => {
  const token = localStorage.getItem('jwtToken'); // Get token from localStorage
  return token?<Outlet/>:<Navigate to='/login'/>

};

export default ProtectedRoute;

