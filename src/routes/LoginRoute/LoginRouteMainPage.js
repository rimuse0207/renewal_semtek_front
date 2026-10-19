import React, { useEffect, useState } from "react";
import RestrictRoute from "../RestrictRoute/RestrictRoute";

import { useNavigate } from "react-router-dom";
import { Request_Get_Axios } from "../../API";

const LoginRoute = ({
  withAdminAuthorization,
  withAuthorization,
  component,
  User_Info,
  needAccessToken,
}) => {
  const navigate = useNavigate();

  const [blockContent, setBlockContent] = useState(false);

  useEffect(() => {
    const verify = async () => {
      if (withAuthorization) {
        const isLogged = await before_Login_Checkig();
        if (!isLogged) {
          navigate("/login");
        }
      }
    };
    verify();
  }, [withAuthorization, navigate]);

  const before_Login_Checkig = async () => {
    const Login_Checking = await Request_Get_Axios("/Login/Token_Checking");

    if (Login_Checking.status) {
      setBlockContent(true);
      return true;
    } else {
      setBlockContent(false);
      return false;
    }
  };

  if (!withAuthorization) return <div>{component}</div>;

  const content = blockContent ? component : null;

  return withAdminAuthorization ? (
    <RestrictRoute
      component={component}
      User_Info={User_Info}
      needAccessToken={needAccessToken}
    >
      {content}
    </RestrictRoute>
  ) : (
    <div>{content}</div>
  );
};

export default LoginRoute;
