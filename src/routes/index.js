import React, { useState } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import LoginRoute from "./LoginRoute/LoginRouteMainPage";
import MainHome from "../pages/Home/MainHome";
import ApplyPage from "../pages/Apply/ApplyPage";
import Layout from "../pages/Layout/Layout";
import ApprovalPage from "../pages/Approval/ApprovalPage";
import AdminReportPage from "../pages/Admin/Report/AdminReportPage";
import LoginPage from "../pages/Login/LoginPage";
import UserManagementPage from "../pages/User/UserManagementPage";
import { useSelector } from "react-redux";

const RouterMainPage = () => {
  const User_Info = useSelector(
    (state) => state.Login_Info_Reducer_State.Login_Info,
  );

  const [RouterInfo, setRouterInfo] = useState([
    {
      path: "/login",
      element: <LoginPage />,
      withAuthorization: false,
      withAdminAuthorization: false,
      useLayout: false,
    },
    {
      path: "/",
      element: <MainHome />,
      withAuthorization: true,
      withAdminAuthorization: false,
      useLayout: true,
    },
    {
      path: "/apply",
      element: <ApplyPage />,
      withAuthorization: true,
      withAdminAuthorization: false,
      useLayout: true,
    },
    {
      path: "/approval",
      element: <ApprovalPage />,
      withAuthorization: true,
      withAdminAuthorization: true,
      needAccessToken: "approval",
      useLayout: true,
    },
    {
      path: "/admin/report",
      element: <AdminReportPage />,
      withAuthorization: true,
      withAdminAuthorization: true,
      needAccessToken: "adminReport",
      useLayout: true,
    },
    {
      path: "/admin/users",
      element: <UserManagementPage />,
      withAuthorization: true,
      withAdminAuthorization: true,
      needAccessToken: "adminUsers",
      useLayout: true,
    },
  ]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {RouterInfo.filter((route) => route.useLayout).map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <LoginRoute
                  withAdminAuthorization={route.withAdminAuthorization}
                  withAuthorization={route.withAuthorization}
                  component={route.element}
                  User_Info={User_Info}
                  needAccessToken={route.needAccessToken}
                ></LoginRoute>
              }
            ></Route>
          ))}
        </Route>

        {RouterInfo.filter((route) => !route.useLayout).map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <LoginRoute
                withAdminAuthorization={route.withAdminAuthorization}
                withAuthorization={route.withAuthorization}
                component={route.element}
                User_Info={User_Info}
                needAccessToken={route.needAccessToken}
              ></LoginRoute>
            }
          ></Route>
        ))}
      </Routes>
    </BrowserRouter>
  );
};

export default RouterMainPage;
