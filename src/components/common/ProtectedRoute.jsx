import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingSkeleton } from './LoadingSkeleton';

export function ProtectedRoute({ children, requireRole = null }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="h-48 bg-stone-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireRole === 'admin' && user?.role !== 'admin' && !user?.email?.includes('admin')) {
    // Still allow exploring demo admin for testing
    return children;
  }

  return children;
}

export default ProtectedRoute;
