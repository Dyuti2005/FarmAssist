import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, role }) {
    const isAuthenticated = localStorage.getItem('fc_auth') === 'true' && !!localStorage.getItem('fc_token');
    const currentRole = localStorage.getItem('fc_role');

    if (!isAuthenticated) {
        return <Navigate to="/role-selection" replace />;
    }

    if (role && currentRole !== role) {
        return <Navigate to="/role-selection" replace />;
    }

    return children;
}
