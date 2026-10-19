import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Request_Post_Axios } from "../../API/index";
import { useDispatch } from "react-redux";
import { Login_Info_Apply_State_Func } from "../../Models/LoginInfoReducer/LoginInfoReduce";

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 1. 로그인 폼 상태
  const [loginForm, setLoginForm] = useState({
    userId: "",
    password: "",
  });

  // 2. 비밀번호 변경 폼 상태
  const [pwForm, setPwForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errorMsg, setErrorMsg] = useState("");

  // 3. 비밀번호 변경 화면 노출 여부
  const [isRequirePwChange, setIsRequirePwChange] = useState(false);

  // 로그인 폼 핸들러
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg("");
  };

  // 비밀번호 변경 폼 핸들러
  const handlePwChange = (e) => {
    const { name, value } = e.target;
    setPwForm((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg("");
  };

  // 로그인 시도 (API 통신 모의)
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const req = await Request_Post_Axios("/Login/Login", loginForm);

    if (req.status) {
      if (!req.data.LoginChecking) {
        alert("아이디 또는 비밀번호가 올바르지 않습니다.");
        setLoginForm({ ...loginForm, password: "" });
        return;
      }

      if (req.data.passwordChange) {
        alert("초기 비밀번호입니다. 비밀번호 변경이후 사용 가능합니다.");
        setIsRequirePwChange(true);
        return;
      }
    }

    dispatch(
      Login_Info_Apply_State_Func({
        id: req.data.Select_User_Info_Data_SQL.userId,
        position: req.data.Select_User_Info_Data_SQL.titleName,
        team: req.data.Select_User_Info_Data_SQL.departmentName,
        name: req.data.Select_User_Info_Data_SQL.fullName,
        access: req.data.Select_User_Info_Data_SQL.menuAuth || [],
      }),
    );

    localStorage.setItem("Token", req.data.CreateJWTToken.token);

    navigate("/"); // 메인 대시보드로 이동
  };

  // 비밀번호 변경 시도
  const handlePwSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (pwForm.newPassword.length < 4) {
      setErrorMsg("새 비밀번호는 4자리 이상이어야 합니다.");
      return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setErrorMsg("새 비밀번호가 일치하지 않습니다.");
      return;
    }
    if (pwForm.newPassword === loginForm.password) {
      setErrorMsg("기존과 동일한 비밀번호로는 변경할 수 없습니다.");
      return;
    }

    const req = await Request_Post_Axios("/Login/Change_Password", {
      pwForm,
      loginForm,
    });
    if (req.status) {
      alert(
        "비밀번호가 성공적으로 변경되었습니다. 변경된 비밀번호로 다시 로그인해주세요.",
      );

      // 상태 초기화 및 로그인 화면으로 복귀
      setIsRequirePwChange(false);
      setLoginForm({ ...loginForm, password: "" });
      setPwForm({ newPassword: "", confirmPassword: "" });
      setErrorMsg("");
      return;
    }
  };

  return {
    loginForm,
    pwForm,
    errorMsg,
    isRequirePwChange,
    handleLoginChange,
    handlePwChange,
    handleLoginSubmit,
    handlePwSubmit,
  };
};
