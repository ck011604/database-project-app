import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const HomeRoute = () => {
  const token = sessionStorage.getItem("token");
  let role = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      role = decodedToken.role;
    } catch (error) {
      console.error("Failed to decode token", error);
    }
  }

    if (role === "Waiter") {
        return <Navigate to="/virtual-register" />;
    }
    else if (role === "Accountant") {
        return <Navigate to="/orders-report" />;
    }
    else if (role === "Manager") {
        return <Navigate to="/Management" />;
    }
    else
        return <Navigate to="/404-Page-Not-Found" />;
};

export default HomeRoute;
