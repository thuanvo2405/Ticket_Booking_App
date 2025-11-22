import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";

const AdminProtectedRoute = () => {
  const { user, isLoggedIn } = useAuth();
  console.log(user);

  if (!isLoggedIn() || user?.vaitro !== "QUAN_TRI") {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
