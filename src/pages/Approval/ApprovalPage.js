import React from "react";
import styled from "styled-components";
import {
  CheckCircle,
  XCircle,
  FileText,
  ChevronRight,
  ChevronLeft,
  Calendar as CalendarIcon,
  X,
  User,
  Users,
  Check,
  AlertCircle,
  RotateCcw,
  Printer,
} from "lucide-react";
import { useApproval } from "../../hooks/useApproval";
import moment from "moment";
import "moment/locale/ko";

// --- Styled Components ---
const ContentArea = styled.div`
  flex: 1;
  padding: 12px 24px;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  box-sizing: border-box;
`;
const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
`;
const PageTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`;
const TabAndFilterArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 24px;
`;
const TabContainer = styled.div`
  display: flex;
  gap: 8px;
`;
const TabButton = styled.button`
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  background: none;
  border: none;
  border-bottom: 2px solid
    ${(props) => (props.$active ? "#3b82f6" : "transparent")};
  color: ${(props) => (props.$active ? "#3b82f6" : "#64748b")};
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    color: ${(props) => (props.$active ? "#3b82f6" : "#0f172a")};
  }
`;
const MonthSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin-bottom: 8px;
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
    font-size: 14px;
    font-weight: 600;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 90px;
    justify-content: center;
  }
`;

const TableContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  overflow: hidden;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;
const Th = styled.th`
  text-align: left;
  padding: 16px 24px;
  background-color: #f8fafc;
  color: #64748b;
  font-weight: 500;
  font-size: 14px;
  border-bottom: 1px solid #e2e8f0;
`;
const Td = styled.td`
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
  color: #334155;
  font-size: 15px;
  vertical-align: middle;
`;
const Tr = styled.tr`
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #f1f5f9;
  }
`;

const RequesterTeamBadge = styled.span`
  display: inline-block;
  background-color: #f1f5f9;
  color: #475569;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid #e2e8f0;
  margin-bottom: 6px;
`;
const ExtraMemberBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background-color: #eff6ff;
  color: #2563eb;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  margin-left: 8px;
`;
const EmptyState = styled.div`
  padding: 60px;
  text-align: center;
  color: #94a3b8;
  font-size: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
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
  max-width: 900px;
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
const ModalFooter = styled.div`
  padding: 20px 32px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8fafc;
  border-radius: 0 0 12px 12px;
`;
const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button`
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  ${(props) => {
    if (props.$variant === "approve")
      return `background-color: #22c55e; color: white; border: none; &:hover { background-color: #16a34a; }`;
    if (props.$variant === "reject")
      return `background-color: white; color: #ef4444; border: 1px solid #f87171; &:hover { background-color: #fef2f2; }`;
    if (props.$variant === "cancel")
      return `background-color: white; color: #64748b; border: 1px solid #cbd5e1; &:hover { background-color: #f1f5f9; color: #0f172a; }`;
    return `background-color: white; color: #475569; border: 1px solid #cbd5e1; &:hover { background-color: #f1f5f9; }`;
  }}
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  ${({ $statusType }) => {
    switch ($statusType) {
      case "승인완료":
        return "background-color: #dcfce7; color: #166534;";
      case "반려":
        return "background-color: #fee2e2; color: #991b1b;";
      case "결재취소":
        return "background-color: #f1f5f9; color: #64748b; border: 1px dashed #94a3b8;";
      case "내차례":
        return "background-color: #e0e7ff; color: #4338ca; border: 1px solid #c7d2fe;";
      case "타인대기":
        return "background-color: #fef9c3; color: #854d0e;";
      default:
        return "background-color: #f1f5f9; color: #475569;";
    }
  }}
`;

const FlowContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin-bottom: 24px;
  overflow-x: auto;
`;
const FlowStep = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;
const StepCircle = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  border: 2px solid
    ${({ $state }) =>
      $state === "승인완료"
        ? "#22c55e"
        : $state === "반려"
          ? "#ef4444"
          : $state === "결재취소"
            ? "#94a3b8"
            : "#cbd5e1"};
  background-color: ${({ $state }) =>
    $state === "승인완료"
      ? "#dcfce7"
      : $state === "반려"
        ? "#fee2e2"
        : $state === "결재취소"
          ? "#f1f5f9"
          : "white"};
  color: ${({ $state }) =>
    $state === "승인완료"
      ? "#166534"
      : $state === "반려"
        ? "#991b1b"
        : $state === "결재취소"
          ? "#64748b"
          : "#64748b"};
  opacity: ${({ $state }) => ($state === "결재취소" ? 0.7 : 1)};
`;
const StepInfo = styled.div`
  display: flex;
  flex-direction: column;
  .name {
    font-size: 14px;
    font-weight: 600;
    color: #0f172a;
  }
  .status {
    font-size: 12px;
    color: #64748b;
    margin-top: 2px;
  }
`;
const StepDivider = styled.div`
  width: 30px;
  height: 2px;
  background-color: #e2e8f0;
`;

const PrintDocumentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 24px;
  margin-bottom: 32px;
`;
const DocumentTitle = styled.h2`
  font-size: 28px;
  font-weight: 800;
  margin: 0;
  margin-top: 4px;
  border-bottom: 4px solid #0f172a;
  padding-bottom: 8px;
`;
const SignGroupArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
`;
const SignBoxContainer = styled.div`
  display: flex;
  border: 1px solid #cbd5e1;
`;
const SignBox = styled.div`
  width: 90px;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #cbd5e1;
  &:first-child {
    border-left: none;
  }
`;
const SignTitle = styled.div`
  background: #f8fafc;
  padding: 6px;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  border-bottom: 1px solid #cbd5e1;
  color: #475569;
`;
const SignDataArea = styled.div`
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  gap: 4px;
`;
const SignName = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
`;
const SignDate = styled.span`
  font-size: 11px;
  color: #64748b;
  letter-spacing: -0.5px;
`;

const ListTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
  th,
  td {
    padding: 12px 8px;
    border: 1px solid #cbd5e1;
    font-size: 13px;
    text-align: center;
    vertical-align: middle;
  }
  th {
    background-color: #f1f5f9;
    color: #334155;
    font-weight: 700;
  }
  .reason-col {
    text-align: left;
    word-break: keep-all;
    line-height: 1.4;
  }
  .time-col {
    letter-spacing: -0.3px;
  }
`;

const formatStampDate = (dateStr) => {
  if (!dateStr) return "-";
  if (dateStr.length > 10) {
    const d = new Date(dateStr);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}.${mm}.${dd}`;
  }
  return dateStr;
};

export default function ApprovalPage() {
  const {
    activeTab,
    setActiveTab,
    applications,
    selectedApp,
    isModalOpen,
    filteredApps,
    currentDate,
    currentUserId,
    handlePrevMonth,
    handleNextMonth,
    openModal,
    closeModal,
    handleApproval,
  } = useApproval();

  const getSmartDisplayStatus = (app) => {
    if (app.status === "결재취소")
      return {
        label: "결재 취소됨",
        type: "결재취소",
        subText: "기안자의 수정 필요",
      };
    if (app.status === "승인완료")
      return { label: "최종 승인완료", type: "승인완료", subText: "" };
    if (app.status === "반려")
      return { label: "반려됨", type: "반려", subText: "" };

    const pendingIndex = app.approvalLine.findIndex(
      (line) => line.status === "대기",
    );

    if (pendingIndex !== -1) {
      const currentApprover = app.approvalLine[pendingIndex];
      const myApprovalInfo = app.approvalLine.find(
        (line) => line.approverId === currentUserId,
      );

      if (currentApprover.approverId === currentUserId) {
        return {
          label: "결재 필요",
          type: "내차례",
          subText: `(현재 ${pendingIndex + 1}차 차례)`,
        };
      }

      if (myApprovalInfo && myApprovalInfo.status === "승인완료") {
        return {
          label: "본인 결재 완료",
          type: "타인대기",
          subText: `(${currentApprover.name} 결재 대기중)`,
        };
      }

      return {
        label: `${pendingIndex + 1}차 대기중`,
        type: "타인대기",
        subText: `(${currentApprover.name} 대기중)`,
      };
    }
    return { label: "상태 불명", type: "기본", subText: "" };
  };

  return (
    <>
      <style>
        {`@media print { 
          body * { visibility: hidden; } 
          #printable-modal, #printable-modal * { visibility: visible; } 
          #printable-modal { position: absolute; left: 0; top: 0; width: 100%; padding: 0; margin: 0; box-shadow: none; border: none; } 
          .no-print { display: none !important; } 
        }`}
      </style>

      <ContentArea>
        <PageHeader>
          <PageTitle>결재 관리</PageTitle>
        </PageHeader>

        <TabAndFilterArea>
          <TabContainer>
            <TabButton
              $active={activeTab === "pending"}
              onClick={() => setActiveTab("pending")}
            >
              결재 대기 (
              {applications.filter((a) => a.status === "결재대기").length})
            </TabButton>
            <TabButton
              $active={activeTab === "completed"}
              onClick={() => setActiveTab("completed")}
            >
              결재 완료
            </TabButton>
          </TabContainer>

          {activeTab === "completed" && (
            <MonthSelector>
              <button onClick={handlePrevMonth}>
                <ChevronLeft size={16} />
              </button>
              <div className="month-display">
                <CalendarIcon size={16} color="#64748b" />
                {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
              </div>
              <button onClick={handleNextMonth}>
                <ChevronRight size={16} />
              </button>
            </MonthSelector>
          )}
        </TabAndFilterArea>

        <TableContainer>
          <Table>
            <thead>
              <tr>
                <Th>기안자 </Th>
                <Th>근무일</Th>
                <Th>근무 시간 (휴게)</Th>
                <Th>사유</Th>
                <Th>진행 상태 (현황)</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.length > 0 ? (
                filteredApps.map((app) => {
                  const extraCount = (app.teamMembers?.length || 1) - 1;
                  const { label, type, subText } = getSmartDisplayStatus(app);

                  return (
                    <Tr key={app.id} onClick={() => openModal(app)}>
                      <Td>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                          }}
                        >
                          <RequesterTeamBadge>
                            {app.requesterTeam || "부서없음"}
                          </RequesterTeamBadge>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              fontWeight: "600",
                            }}
                          >
                            <User
                              size={16}
                              color="#64748b"
                              style={{ marginRight: "6px" }}
                            />
                            {app.requester}
                            {extraCount > 0 && (
                              <ExtraMemberBadge>
                                <Users size={14} /> 외 {extraCount}명
                              </ExtraMemberBadge>
                            )}
                          </div>
                        </div>
                      </Td>
                      <Td>{app.date}</Td>
                      <Td>
                        <div style={{ fontWeight: "500" }}>{app.time}</div>
                        <div
                          style={{
                            fontSize: "13px",
                            color: "#64748b",
                            marginTop: "4px",
                          }}
                        >
                          휴게: {app.restTime}
                        </div>
                      </Td>
                      <Td>{app.reason}</Td>
                      <Td>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                          }}
                        >
                          <StatusBadge $statusType={type}>
                            {type === "내차례" && <AlertCircle size={14} />}
                            {label}
                          </StatusBadge>
                          {subText && (
                            <div
                              style={{
                                fontSize: "12px",
                                color: "#64748b",
                                marginTop: "6px",
                                fontWeight: "500",
                              }}
                            >
                              {subText}
                            </div>
                          )}
                        </div>
                      </Td>
                      <Td style={{ textAlign: "right", color: "#94a3b8" }}>
                        <ChevronRight size={20} />
                      </Td>
                    </Tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6">
                    <EmptyState>
                      <CheckCircle size={40} color="#cbd5e1" /> 현재 조건에 맞는
                      결재 내역이 없습니다.
                    </EmptyState>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </TableContainer>

        {/* ========================================================
            모달 영역 (인쇄 양식 적용)
        ========================================================= */}
        {isModalOpen && selectedApp && (
          <ModalOverlay onClick={closeModal}>
            <ModalContent
              id="printable-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader className="no-print">
                <h3>결재 문서 확인</h3>
                <button onClick={closeModal}>
                  <X size={24} />
                </button>
              </ModalHeader>

              <ModalBody>
                {/* 1. 화면에만 보이는 결재 진행 플로우 (인쇄 시 숨김) */}
                <div className="no-print">
                  <h4
                    style={{
                      margin: "0 0 12px 0",
                      fontSize: "15px",
                      color: "#334155",
                    }}
                  >
                    결재 진행 현황
                  </h4>
                  <FlowContainer>
                    {selectedApp.approvalLine.map((line, index) => (
                      <React.Fragment key={index}>
                        <FlowStep>
                          <StepCircle $state={line.status}>
                            {line.status === "승인완료" ? (
                              <Check size={16} />
                            ) : line.status === "결재취소" ? (
                              <RotateCcw size={16} />
                            ) : (
                              line.step
                            )}
                          </StepCircle>
                          <StepInfo>
                            <span
                              className="name"
                              style={{
                                textDecoration:
                                  line.status === "결재취소"
                                    ? "line-through"
                                    : "none",
                              }}
                            >
                              {line.name}
                            </span>
                            <span className="status">
                              {line.status === "승인완료"
                                ? line.approvedAt
                                : line.status}
                            </span>
                          </StepInfo>
                        </FlowStep>
                        {index < selectedApp.approvalLine.length - 1 && (
                          <StepDivider />
                        )}
                      </React.Fragment>
                    ))}
                  </FlowContainer>
                </div>

                {/* 2. 전자결재 양식 인쇄 헤더 및 결재선 */}
                <PrintDocumentHeader>
                  <DocumentTitle>연장/휴일근로 신청서</DocumentTitle>

                  <SignGroupArea>
                    <SignBoxContainer>
                      <SignBox>
                        <SignTitle>기안자</SignTitle>
                        <SignDataArea>
                          <SignName>
                            {selectedApp.requester?.split(" ")[0] || "이름없음"}
                          </SignName>
                          <SignDate>
                            {formatStampDate(
                              selectedApp.requestDate || selectedApp.date,
                            )}
                          </SignDate>
                        </SignDataArea>
                      </SignBox>

                      {selectedApp.approvalLine.map((line, idx) => (
                        <SignBox key={idx}>
                          <SignTitle>{line.step}차 결재</SignTitle>
                          <SignDataArea>
                            {line.status === "승인완료" ? (
                              <>
                                <SignName>{line.name.split(" ")[0]}</SignName>
                                <SignDate>
                                  {formatStampDate(line.approvedAt)}
                                </SignDate>
                              </>
                            ) : line.status === "반려" ? (
                              <SignName style={{ color: "#ef4444" }}>
                                반려
                              </SignName>
                            ) : (
                              <SignName style={{ color: "#cbd5e1" }}>
                                대기
                              </SignName>
                            )}
                          </SignDataArea>
                        </SignBox>
                      ))}
                    </SignBoxContainer>
                  </SignGroupArea>
                </PrintDocumentHeader>

                {/* 3. 하단 개별 상세 그리드 테이블 */}
                <h4
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: "15px",
                    color: "#334155",
                  }}
                >
                  근무 상세 내역 ( 일자 :{" "}
                  {moment(selectedApp.date).format("YYYY.MM.DD dd요일")} )
                </h4>
                <ListTable>
                  <thead>
                    <tr>
                      <th style={{ width: "40px" }}>No</th>
                      <th style={{ width: "120px" }}>부서</th>
                      <th style={{ width: "90px" }}>성명(직급)</th>
                      <th style={{ width: "150px" }}>연장/휴일 근로시간</th>
                      <th style={{ width: "80px" }}>
                        실 연장 <br />
                        근로시간
                      </th>
                      <th>업무 내용 (사유)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedApp.teamMembers || []).map((member, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{member.departmentName}</td>
                        <td
                          style={{
                            fontWeight:
                              member.isRequester === "Y" ? "700" : "500",
                            color:
                              member.isRequester === "Y"
                                ? "#1d4ed8"
                                : "#0f172a",
                          }}
                        >
                          {member.name} {member.titleName}
                        </td>
                        <td className="time-col">
                          {member.startTime} ~ {member.endTime}
                          <div
                            style={{
                              fontSize: "11px",
                              color: "#64748b",
                              marginTop: "2px",
                            }}
                          >
                            (휴게 {member.restTime}h)
                          </div>
                        </td>
                        <td style={{ fontWeight: "600", color: "#0f172a" }}>
                          {member.netHours}h
                        </td>
                        <td className="reason-col">{member.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </ListTable>
              </ModalBody>

              <ModalFooter className="no-print">
                <Button onClick={closeModal}>닫기</Button>

                <ActionButtons>
                  {/* 내 결재 차례일 때 (대기 중): 반려, 승인 노출 */}
                  {selectedApp.status === "결재대기" &&
                    selectedApp.approvalLine.find(
                      (line) => line.status === "대기",
                    )?.approverId === currentUserId && (
                      <>
                        <Button
                          $variant="reject"
                          onClick={() => handleApproval(selectedApp.id, "반려")}
                        >
                          <XCircle size={18} /> 반려
                        </Button>
                        <Button
                          $variant="approve"
                          onClick={() =>
                            handleApproval(selectedApp.id, "승인완료")
                          }
                        >
                          <CheckCircle size={18} /> 승인
                        </Button>
                      </>
                    )}

                  {/* 내가 이미 승인을 한 상태라면, 전체 결재가 진행 중이거나 승인완료여도 취소 가능 */}
                  {(selectedApp.status === "결재대기" ||
                    selectedApp.status === "승인완료") &&
                    selectedApp.approvalLine.find(
                      (line) => line.approverId === currentUserId,
                    )?.status === "승인완료" && (
                      <Button
                        $variant="cancel"
                        onClick={() =>
                          handleApproval(selectedApp.id, "결재취소")
                        }
                      >
                        <RotateCcw size={18} /> 승인 취소
                      </Button>
                    )}
                </ActionButtons>
              </ModalFooter>
            </ModalContent>
          </ModalOverlay>
        )}
      </ContentArea>
    </>
  );
}
