import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "../../../ToastMessage/ToastManager";

import { API_CONFIG } from "../../../../API/config"; // API 주소 모음집

import { Login_Info_Apply_State_Func } from "../../../../Models/LoginInfoReducer/LoginInfoReduce";

import { Request_Get_Axios } from "../../../../API";

export const useAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const checkAutoLogin = useCallback(async () => {
    try {
      const { status, data } = await Request_Get_Axios(
        API_CONFIG.LoginAPI.TOKEN_CHECK.path,
      );
      if (status && data?.token === "Validable") return { isLogged: true };
      localStorage.removeItem("Token");
      return { isLogged: false };
    } catch {
      return { isLogged: false };
    }
  }, []);

  const login = useCallback(
    (loginData, callbacks = {}) => {
      loginRequest(loginData, {
        ...callbacks,
        onSuccess: (data) => {
          const {
            LoginChecking,
            passwordChange,
            Select_User_Info_Data_SQL: userInfo,
            CreateJWTToken,
            User_Access_Lists,
            Admin_Access_Lists,
          } = data;

          if (!LoginChecking) {
            toast.show({
              title: `아이디 또는 비밀번호가 틀립니다.`,
              successCheck: false,
              duration: 6000,
            });
            callbacks.onError?.();
            return;
          }

          if (passwordChange) {
            toast.show({
              title: `비밀번호 변경 이후 사용 가능합니다.`,
              successCheck: true,
              duration: 6000,
            });
            callbacks.onRequirePasswordChange?.();
            return;
          }

          localStorage.setItem("Token", CreateJWTToken.token);
          localStorage.setItem("userId", userInfo.email);
          dispatch(
            Login_Info_Apply_State_Func({
              id: userInfo.email,
              team: userInfo.department,
              name: userInfo.name,
              company: userInfo.company,
              position: userInfo.position,
              user_access: User_Access_Lists,
              admin_access: Admin_Access_Lists,
            }),
          );

          navigate("/Home");

          callbacks.onSuccess?.(data);
        },
      });
    },
    [loginRequest, navigate, dispatch],
  );

  const changePassword = useCallback(
    (passwordData, callbacks = {}) => {
      changePwRequest(passwordData, {
        ...callbacks,
        onSuccess: (data) => {
          toast.show({
            title: `비밀번호가 변경되었습니다.`,
            successCheck: true,
            duration: 3000,
          });
          callbacks.onSuccess?.(data);
        },
      });
    },
    [changePwRequest],
  );

  return {
    checkAutoLogin,
    login,
    changePassword,
    isLoginLoading,
    isChangePwLoading,
  };
};
