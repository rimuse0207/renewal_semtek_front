import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const RedirectWithAlert = () => {
  return <Navigate to="/" replace />;
};

const RestrictRoute = ({ component, User_Info, needAccessToken }) => {
  const hasAuth = User_Info?.access?.includes(needAccessToken);

  return hasAuth ? component : <RedirectWithAlert />;
};

export default RestrictRoute;
