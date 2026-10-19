import { useLogin } from "../../hooks/Login/useLogin";
import React from "react";
import styled from "styled-components";
import { Clock, User, Lock, KeyRound, CheckCircle } from "lucide-react";

// --- Styled Components ---

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-color: #f4f7f9;
  font-family:
    "Pretendard",
    -apple-system,
    BlinkMacSystemFont,
    system-ui,
    Roboto,
    sans-serif;
`;

const LoginBox = styled.div`
  background: white;
  width: 100%;
  max-width: 400px;
  padding: 48px 40px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
`;

const LogoArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
  text-align: center;

  .icon-wrapper {
    background-color: ${(props) => (props.$isAlert ? "#fef2f2" : "#eff6ff")};
    color: ${(props) => (props.$isAlert ? "#ef4444" : "#3b82f6")};
    padding: 16px;
    border-radius: 16px;
    margin-bottom: 20px;
  }

  h1 {
    font-size: 26px;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 8px 0;
  }

  p {
    font-size: 15px;
    color: #64748b;
    margin: 0;
    line-height: 1.5;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 16px;

  svg {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
  }
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 14px 16px 14px 44px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 15px;
  color: #0f172a;
  transition: all 0.2s ease;
  background-color: #f8fafc;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    background-color: #ffffff;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 16px;
  text-align: center;
`;

const SubmitButton = styled.button`
  width: 100%;
  background-color: #3b82f6;
  color: white;
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563eb;
  }
`;

const FooterText = styled.div`
  margin-top: 24px;
  text-align: center;
  font-size: 13px;
  color: #94a3b8;
`;

export default function LoginPage() {
  const {
    loginForm,
    pwForm,
    errorMsg,
    isRequirePwChange,
    handleLoginChange,
    handlePwChange,
    handleLoginSubmit,
    handlePwSubmit,
  } = useLogin();

  return (
    <Container>
      <LoginBox>
        {/* 1. 기본 로그인 화면 */}
        {!isRequirePwChange ? (
          <>
            <LogoArea>
              <div className="icon-wrapper">
                <Clock size={32} />
              </div>
              <h1>SEMTEK</h1>
              <p>연장근로 통합 관리 시스템</p>
            </LogoArea>

            <Form key="login-form" onSubmit={handleLoginSubmit}>
              <InputWrapper>
                <User size={20} />
                <Input
                  type="text"
                  name="userId"
                  placeholder="이메일"
                  value={loginForm.userId}
                  onChange={handleLoginChange}
                  required
                />
              </InputWrapper>

              <InputWrapper>
                <Lock size={20} />
                <Input
                  type="password"
                  name="password"
                  placeholder="비밀번호"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  required
                />
              </InputWrapper>

              {errorMsg && <ErrorMessage>{errorMsg}</ErrorMessage>}

              <SubmitButton type="submit">로그인</SubmitButton>
            </Form>
          </>
        ) : (
          <>
            <LogoArea $isAlert={true}>
              <div className="icon-wrapper">
                <KeyRound size={32} />
              </div>
              <h1>비밀번호 변경</h1>
              <p>
                초기 비밀번호를 사용 중입니다.
                <br />
                안전한 사용을 위해 새 비밀번호를 설정해 주세요.
              </p>
            </LogoArea>

            <Form key="pw-change-form" onSubmit={handlePwSubmit}>
              <InputWrapper>
                <Lock size={20} />
                <Input
                  type="password"
                  name="newPassword"
                  placeholder="새 비밀번호 입력 (4자리 이상)"
                  value={pwForm.newPassword}
                  onChange={handlePwChange}
                  required
                  autoFocus
                />
              </InputWrapper>

              <InputWrapper>
                <CheckCircle
                  size={20}
                  style={{
                    position: "absolute",
                    left: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                  }}
                />
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="새 비밀번호 확인"
                  value={pwForm.confirmPassword}
                  onChange={handlePwChange}
                  required
                />
              </InputWrapper>

              {errorMsg && <ErrorMessage>{errorMsg}</ErrorMessage>}

              <SubmitButton type="submit">비밀번호 변경 완료</SubmitButton>
            </Form>
          </>
        )}

        <FooterText>© 2026 WorkTime Pro. All rights reserved.</FooterText>
      </LoginBox>
    </Container>
  );
}
