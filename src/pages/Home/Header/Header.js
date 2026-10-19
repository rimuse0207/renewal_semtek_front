import { CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Header = ({ currentDate, handlePrevMonth, handleNextMonth }) => {
  const navigate = useNavigate();
  const userInfo = useSelector(
    (state) => state.Login_Info_Reducer_State.Login_Info,
  );
  return (
    <TopSection>
      <Greeting>
        <h2>
          안녕하세요, {userInfo?.name} {userInfo?.position}님
        </h2>
        <p>선택하신 월의 연장근로 현황입니다.</p>
      </Greeting>
      <MonthSelector>
        <button onClick={handlePrevMonth}>
          <ChevronLeft size={20} />
        </button>
        <div className="month-display">
          <CalendarIcon size={18} color="#64748b" />
          {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
        </div>
        <button onClick={handleNextMonth}>
          <ChevronRight size={20} />
        </button>
      </MonthSelector>
      <ApplyButton onClick={() => navigate("/apply")}>
        <Plus size={18} /> 연장근로 신청하기
      </ApplyButton>
    </TopSection>
  );
};

export default Header;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
`;
const Greeting = styled.div`
  h2 {
    font-size: 24px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 8px;
  }
  p {
    color: #64748b;
  }
`;
const MonthSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: white;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  button {
    background: none;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #64748b;
    padding: 4px;
    border-radius: 4px;
    &:hover {
      background-color: #f1f5f9;
      color: #0f172a;
    }
  }
  .month-display {
    font-size: 16px;
    font-weight: 600;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 110px;
    justify-content: center;
  }
`;
const ApplyButton = styled.button`
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
  &:hover {
    background-color: #2563eb;
  }
`;
