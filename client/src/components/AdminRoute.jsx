import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';

const AdminRoute = () => {
  const { loading, isAdmin } = useAuth();

  if (loading) {
    return <LoadingSpinner label="Loading admin panel..." />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;

