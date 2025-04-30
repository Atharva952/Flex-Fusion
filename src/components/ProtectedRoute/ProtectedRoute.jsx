
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const authUser = useSelector((state) => state.user.authUser);
  console.log(authUser);
  

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  
  if (allowedRoles && !allowedRoles.includes(authUser.role)) {
 
    return <Navigate to="" replace />;
  }


  return children;
}
