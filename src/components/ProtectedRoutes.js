import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ element, allowedRoles }) => {
    const token = sessionStorage.getItem('token');
    let role = null;

    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            role = decodedToken.role;
        } catch (error) {
            console.error("Failed to decode token", error);
        }
    }

    return token && allowedRoles.includes(role) ? element : <Navigate to="/404-Page-Not-Found" />;
};

export default ProtectedRoute;
