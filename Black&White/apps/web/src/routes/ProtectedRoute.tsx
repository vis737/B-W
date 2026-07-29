// apps/web/src/routes/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireAdmin = false }) => {
  const { isAdminAuthenticated, isCustomerLoggedIn, setIsCustomerModalOpen } = useAuth();

  if (requireAdmin) {
    if (!isAdminAuthenticated) {
      // Secret Admin Protection: Redirect to home page if not authenticated
      return <Navigate to="/" replace />;
    }
    return <Outlet />;
  }

  if (!isCustomerLoggedIn) {
    // Open Customer Auth Modal if trying to access dashboard while logged out
    setIsCustomerModalOpen(true);
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
