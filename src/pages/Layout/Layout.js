import React from "react";
import styled from "styled-components";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  Clock,
  FileText,
  CheckCircle,
  Bell,
  User,
  LogOut,
  Users,
  Calendar1,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Logout_Inistate_State_Func } from "../../Models/LoginInfoReducer/LoginInfoReduce";

// --- Styled Components (유지) ---
const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #f4f7f9;
  font-family:
    "Pretendard",
    -apple-system,
    BlinkMacSystemFont,
    system-ui,
    Roboto,
    sans-serif;
`;
const Sidebar = styled.aside`
  width: 260px;
  background-color: #1e293b;
  color: white;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;
const LogoArea = styled.div`
  padding: 24px;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #334155;
`;
const NavMenu = styled.nav`
  padding: 24px 0;
  flex: 1;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;
const NavItem = styled(Link)`
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${(props) => (props.$active ? "#ffffff" : "#94a3b8")};
  background-color: ${(props) => (props.$active ? "#334155" : "transparent")};
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 4px solid
    ${(props) => (props.$active ? "#3b82f6" : "transparent")};
  &:hover {
    color: #ffffff;
    background-color: #334155;
  }
`;
const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;
const Header = styled.header`
  height: 72px;
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  flex-shrink: 0;
`;
const HeaderTitle = styled.h1`
  font-size: 20px;
  font-weight: 600;
  color: #0f172a;
`;
const UserActions = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  color: #64748b;
`;
const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  background-color: #f1f5f9;
  border-radius: 999px;
  color: #334155;
  font-weight: 500;
  cursor: pointer;
`;
const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
`;

// --- Component ---
export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const dispatch = useDispatch();

  const userInfo = useSelector(
    (state) => state.Login_Info_Reducer_State.Login_Info,
  );

  let userAuths = [];
  if (userInfo?.access) {
    userAuths =
      typeof userInfo.access === "string"
        ? userInfo.access.split(",")
        : userInfo.access;
  }

  const getHeaderTitle = () => {
    if (currentPath === "/apply") return "연장근로 신청";
    if (currentPath === "/approval") return "결재 관리";
    if (currentPath === "/admin/report") return "월별 조회";
    if (currentPath === "/admin/users") return "사용자 관리";
    return "메인 홈";
  };

  return (
    <Container>
      {/* 1. 사이드바 (고정) */}
      <Sidebar>
        <LogoArea onClick={() => navigate("/")}>
          <Clock size={24} color="#3b82f6" />
          <span>연장근로 시스템</span>
        </LogoArea>
        <NavMenu>
          {/* 누구나 접근 가능한 기본 메뉴 */}
          <NavItem to="/" $active={currentPath === "/"}>
            <Clock size={20} />
            메인 홈
          </NavItem>
          <NavItem to="/apply" $active={currentPath === "/apply"}>
            <FileText size={20} />
            연장근로 신청
          </NavItem>

          {userAuths.includes("approval") && (
            <NavItem to="/approval" $active={currentPath === "/approval"}>
              <CheckCircle size={20} />
              결재 관리
            </NavItem>
          )}

          {userAuths.includes("adminReport") && (
            <NavItem
              to="/admin/report"
              $active={currentPath === "/admin/report"}
            >
              <Calendar1 size={20} />
              월별 조회
            </NavItem>
          )}

          {userAuths.includes("adminUsers") && (
            <NavItem to="/admin/users" $active={currentPath === "/admin/users"}>
              <Users size={20} />
              사용자 관리
            </NavItem>
          )}
        </NavMenu>
      </Sidebar>

      <MainContent>
        {/* 2. 상단 헤더 (고정) */}
        <Header>
          <HeaderTitle>{getHeaderTitle()}</HeaderTitle>
          <UserActions>
            <UserProfile>
              <User size={16} />
              {userInfo?.name} {userInfo?.position}
            </UserProfile>
            <LogOut
              size={20}
              style={{ cursor: "pointer" }}
              onClick={() => {
                dispatch(Logout_Inistate_State_Func());
                localStorage.clear();
                return navigate("/Login");
              }}
            />
          </UserActions>
        </Header>

        <ScrollArea>
          <Outlet />
        </ScrollArea>
      </MainContent>
    </Container>
  );
}
