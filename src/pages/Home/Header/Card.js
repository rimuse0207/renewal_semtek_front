import { CheckCircle, Clock, FileText } from "lucide-react";
import React from "react";
import styled from "styled-components";

const Card = ({ stats }) => {
  const {
    workedHours = 0,
    workedMinutes = 0,
    remainHours = 52,
    remainMinutes = 0,
    pendingCount = 0,
    approvedCount = 0,
  } = stats || {};

  return (
    <StatsGrid>
      <StatCard>
        <StatHeader>
          해당 월 누적 연장근로
          <Clock size={18} color="#3b82f6" />
        </StatHeader>
        <StatValue>
          {workedHours}
          <span>시간</span>{" "}
          {workedMinutes > 0 && (
            <>
              {workedMinutes}
              <span>분</span>
            </>
          )}
        </StatValue>
        <SubText>최종 승인된 월 누적 시간</SubText>
      </StatCard>

      <StatCard>
        <StatHeader>
          결재 대기
          <FileText size={18} color="#eab308" />
        </StatHeader>
        <StatValue>
          {pendingCount}
          <span>건</span>
        </StatValue>
        <SubText>진행중인 결재 내역</SubText>
      </StatCard>

      <StatCard>
        <StatHeader>
          승인 완료
          <CheckCircle size={18} color="#22c55e" />
        </StatHeader>
        <StatValue>
          {approvedCount}
          <span>건</span>
        </StatValue>
        <SubText>최종 승인된 연장근로</SubText>
      </StatCard>
    </StatsGrid>
  );
};

export default Card;

// --- Styled Components 유지 ---
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 32px;
`;
const StatCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
`;
const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #64748b;
  font-size: 14px;
  margin-bottom: 16px;
`;
const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  span {
    font-size: 16px;
    font-weight: 500;
    color: #64748b;
    margin-left: 4px;
  }
`;
const SubText = styled.div`
  font-size: 13px;
  color: #64748b;
  margin-top: 4px;
`;
