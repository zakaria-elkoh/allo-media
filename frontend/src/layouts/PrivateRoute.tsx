import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../store";

const PrivateRoute: React.FC = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
