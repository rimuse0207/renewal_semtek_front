import React from "react";
import styled from "styled-components";
import {
  Download,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Search,
  Clock,
  Filter,
  X,
  User,
  Sun,
  Moon,
} from "lucide-react";
import { useAdminReport } from "../../../hooks/useAdminReport";
import moment from "moment";
import "moment/locale/ko";

// --- Styled Components ---
const ContentArea = styled.div`
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  box-sizing: border-box;
`;
const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
`;
const PageTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  margin-bottom: 8px;
`;
const SubTitle = styled.p`
  color: #64748b;
  margin: 0;
  font-size: 15px;
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
const TopActions = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;
const ExcelButton = styled.button`
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);
  &:hover {
    background-color: #059669;
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 32px;
`;
const SummaryCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
`;
const SummaryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #64748b;
  font-size: 13px;
  margin-bottom: 10px;
  font-weight: 600;
`;
const SummaryValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  span {
    font-size: 14px;
    font-weight: 500;
    color: #64748b;
    margin-left: 4px;
  }
`;

const FilterSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 16px 24px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin-bottom: 24px;
`;
const FilterGroup = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;
const Select = styled.select`
  padding: 10px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  color: #0f172a;
  min-width: 140px;
  background-color: #f8fafc;
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;
const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background-color: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0 16px;
  width: 280px;
  input {
    border: none;
    background: transparent;
    padding: 10px 0;
    width: 100%;
    font-size: 14px;
    color: #0f172a;
    outline: none;
    margin-left: 8px;
  }
`;

const TableContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  margin-bottom: 40px;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;
const Th = styled.th`
  text-align: left;
  padding: 16px 20px;
  background-color: #f8fafc;
  color: #475569;
  font-weight: 600;
  font-size: 13px;
  border-bottom: 1px solid #e2e8f0;
`;
const Td = styled.td`
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
  color: #334155;
  font-size: 14px;
  vertical-align: middle;
`;
const Tr = styled.tr`
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #f8fafc;
  }
`;

// ✨ 휴일 여부에 따라 뱃지 색상을 다르게 처리하는 스타일
const WorkTypeBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  background-color: ${(props) => (props.$isHoliday ? "#fef2f2" : "#eff6ff")};
  color: ${(props) => (props.$isHoliday ? "#dc2626" : "#2563eb")};
  border: 1px solid ${(props) => (props.$isHoliday ? "#fecaca" : "#bfdbfe")};
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
`;
const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 850px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
`;
const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid #e2e8f0;
  h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #0f172a;
  }
  button {
    background: none;
    border: none;
    cursor: pointer;
    color: #64748b;
    &:hover {
      color: #0f172a;
    }
  }
`;
const ModalBody = styled.div`
  padding: 32px;
  overflow-y: auto;
`;

const UserSummaryBox = styled.div`
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;
const UserInfoArea = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;
const UserAvatar = styled.div`
  width: 56px;
  height: 56px;
  background-color: #eff6ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
`;
const UserMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  .name-group {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .name {
    font-size: 20px;
    font-weight: 700;
    color: #0f172a;
  }
  .team-badge {
    background-color: #f1f5f9;
    color: #475569;
    border: 1px solid #cbd5e1;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
  }
`;
const StatsArea = styled.div`
  display: flex;
  gap: 30px;
  padding-right: 16px;
`;
const UserStat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-end;
  .label {
    font-size: 12px;
    color: #64748b;
    font-weight: 600;
  }
  .val {
    font-size: 20px;
    font-weight: 700;
    color: #0f172a;
    span {
      font-size: 13px;
      margin-left: 2px;
    }
  }
`;

export default function AdminReportPage() {
  const {
    currentDate,
    selectedTeam,
    setSelectedTeam,
    searchQuery,
    setSearchQuery,
    isModalOpen,
    selectedUser,
    filteredData,
    stats,
    userModalData,
    userTotalHours,
    userTeam,
    handlePrevMonth,
    handleNextMonth,
    handleExcelDownload,
    openUserModal,
    closeUserModal,
    teamList,
  } = useAdminReport();

  return (
    <ContentArea>
      <PageHeader>
        <div>
          <PageTitle>월별 연장근로 리포트</PageTitle>
          <SubTitle>전사 승인 완료 내역 통계</SubTitle>
        </div>
        <TopActions>
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
          <ExcelButton onClick={handleExcelDownload}>
            <Download size={18} /> 엑셀(XLSX) 다운로드
          </ExcelButton>
        </TopActions>
      </PageHeader>

      <SummaryGrid>
        <SummaryCard>
          <SummaryHeader>
            총 실근로 시간
            <Clock size={16} color="#3b82f6" />
          </SummaryHeader>
          <SummaryValue>
            {stats.totalHours}
            <span>시간</span>
          </SummaryValue>
        </SummaryCard>
        <SummaryCard>
          <SummaryHeader>
            주간 연장
            <Sun size={16} color="#f59e0b" />
          </SummaryHeader>
          <SummaryValue>
            {stats.totalDayHours}
            <span>시간</span>
          </SummaryValue>
        </SummaryCard>
        <SummaryCard>
          <SummaryHeader>
            심야 근로 (야간)
            <Moon size={16} color="#6366f1" />
          </SummaryHeader>
          <SummaryValue>
            {stats.totalNightHours}
            <span>시간</span>
          </SummaryValue>
        </SummaryCard>
      </SummaryGrid>

      <FilterSection>
        <FilterGroup>
          <Filter size={18} color="#64748b" />
          <Select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            {teamList.map((team, index) => (
              <option key={index} value={team}>
                {team === "전체" ? "ALL (전체 부서)" : team}
              </option>
            ))}
          </Select>
        </FilterGroup>
        <SearchBox>
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder="이름 또는 사유 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBox>
      </FilterSection>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>일자</Th>
              <Th>요일</Th>
              <Th>소속팀</Th>
              <Th>이름 (상세보기)</Th>
              <Th>구분</Th>
              <Th>근무시간</Th>
              <Th>주간</Th>
              <Th>심야</Th>
              <Th>휴게</Th>
              <Th>실근로</Th>
              <Th>사유</Th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((app) => (
                <Tr
                  key={app.id + app.userId}
                  onClick={() => openUserModal(app.name)}
                >
                  <Td>{app.date}</Td>
                  <Td>{moment(app.date).format("dd")}</Td>
                  <Td>{app.team}</Td>
                  <Td style={{ fontWeight: "600", color: "#0f172a" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <User size={16} color="#3b82f6" /> {app.name}
                    </div>
                  </Td>
                  <Td>
                    <WorkTypeBadge
                      $isHoliday={app.holidayLabel.includes("휴일")}
                    >
                      {app.holidayLabel}
                    </WorkTypeBadge>
                  </Td>
                  <Td>
                    {app.startTime} ~ {app.endTime}
                  </Td>
                  <Td>{app.dayHours || app.netHours}h</Td>
                  <Td
                    style={{
                      color: (app.nightHours || 0) > 0 ? "#6366f1" : "#94a3b8",
                      fontWeight: (app.nightHours || 0) > 0 ? "600" : "400",
                    }}
                  >
                    {(app.nightHours || 0) > 0 ? `${app.nightHours}h` : "-"}
                  </Td>
                  <Td>{app.restTime}h</Td>
                  <Td style={{ fontWeight: "700", color: "#2563eb" }}>
                    {app.netHours}h
                  </Td>
                  <Td>{app.reason}</Td>
                </Tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="11"
                  style={{
                    textAlign: "center",
                    padding: "60px",
                    color: "#94a3b8",
                  }}
                >
                  조건에 맞는 데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </TableContainer>

      {/* 개인별 모달 */}
      {isModalOpen && selectedUser && (
        <ModalOverlay onClick={closeUserModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h3>{currentDate.getMonth() + 1}월 연장근로 집계 상세</h3>
              <button onClick={closeUserModal}>
                <X size={24} />
              </button>
            </ModalHeader>
            <ModalBody>
              <UserSummaryBox>
                <UserInfoArea>
                  <UserAvatar>
                    <User size={28} />
                  </UserAvatar>
                  <UserMeta>
                    <div className="name-group">
                      <span className="name">{selectedUser}</span>
                      <span className="team-badge">{userTeam}</span>
                    </div>
                    <span style={{ fontSize: "13px", color: "#64748b" }}>
                      연장 및 휴일근로 상세 통계
                    </span>
                  </UserMeta>
                </UserInfoArea>
                <StatsArea>
                  <UserStat>
                    <span className="label">총 근무건수</span>
                    <span className="val">
                      {userModalData.length}
                      <span>건</span>
                    </span>
                  </UserStat>
                  <UserStat>
                    <span className="label">누적 실근로</span>
                    <span className="val" style={{ color: "#2563eb" }}>
                      {userTotalHours}
                      <span>시간</span>
                    </span>
                  </UserStat>
                </StatsArea>
              </UserSummaryBox>

              <TableContainer style={{ marginBottom: 0, boxShadow: "none" }}>
                <Table>
                  <thead>
                    <tr>
                      <Th>일자</Th>
                      <Th>구분</Th>
                      <Th>근무시간</Th>
                      <Th>주간</Th>
                      <Th>심야</Th>
                      <Th>실근로</Th>
                      <Th>사유</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {userModalData.map((log) => (
                      <tr key={log.id}>
                        <Td>{log.date}</Td>
                        <Td>
                          <WorkTypeBadge
                            $isHoliday={log.holidayLabel.includes("휴일")}
                          >
                            {log.holidayLabel}
                          </WorkTypeBadge>
                        </Td>
                        <Td>
                          {log.startTime} ~ {log.endTime}
                        </Td>
                        <Td>{log.dayHours || log.netHours}h</Td>
                        <Td
                          style={{
                            color:
                              (log.nightHours || 0) > 0 ? "#6366f1" : "#94a3b8",
                          }}
                        >
                          {(log.nightHours || 0) > 0
                            ? `${log.nightHours}h`
                            : "-"}
                        </Td>
                        <Td style={{ fontWeight: "600" }}>
                          {log.netHours}시간
                        </Td>
                        <Td>{log.reason}</Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableContainer>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </ContentArea>
  );
}
