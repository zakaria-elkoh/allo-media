import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);

  if (user && token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
