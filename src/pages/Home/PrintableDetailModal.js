import React from "react";
import styled from "styled-components";
import { X, Printer, Edit2 } from "lucide-react";
import { useSelector } from "react-redux";
import moment from "moment";
import "moment/locale/ko";

// --- Styled Components ---
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
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  position: relative;
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
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      color: #0f172a;
    }
  }
`;
const ModalBody = styled.div`
  padding: 32px;
`;
const ModalFooter = styled.div`
  padding: 20px 32px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background-color: #f8fafc;
  border-radius: 0 0 12px 12px;
`;
const Button = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  ${(props) =>
    props.$primary
      ? `background-color: #3b82f6; color: white; border: none; &:hover { background-color: #2563eb; }`
      : `background-color: white; color: #475569; border: 1px solid #cbd5e1; &:hover { background-color: #f8fafc; }`}
`;

// 상단 헤더 (제목 + 결재선)
const PrintDocumentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

// 결재선 영역
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

// 하단 개별 데이터 테이블
const ListTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
  th,
  td {
    padding: 12px 4px;
    border: 1px solid #cbd5e1;
    font-size: 12px;
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
    word-break: break-all;
    line-height: 1.4;
  }
  .time-col {
    letter-spacing: -0.3px;
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  ${({ $status }) => {
    switch ($status) {
      case "승인완료":
        return "background-color: #dcfce7; color: #166534;";
      case "결재대기":
        return "background-color: #fef9c3; color: #854d0e;";
      case "반려":
        return "background-color: #fee2e2; color: #991b1b;";
      default:
        return "background-color: #f1f5f9; color: #475569;";
    }
  }}
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

export default function PrintableDetailModal({
  isOpen,
  onClose,
  data,
  onEdit,
}) {
  const userInfo = useSelector(
    (state) => state.Login_Info_Reducer_State.Login_Info,
  );

  if (!isOpen || !data) return null;

  const handlePrint = () => window.print();

  const approvalLine = data.approvalLine || [];
  const teamMembers = data.teamMembers || [];

  const requesterName =
    typeof teamMembers[0] === "object"
      ? teamMembers[0].name
      : data.requester.split(" ")[0];

  return (
    <>
      <style>
        {`@media print { 
          body * { visibility: hidden; } 
          #printable-modal, #printable-modal * { visibility: visible; } 
          #printable-modal { 
            position: absolute; left: 0; top: 0; width: 100%; padding: 0; margin: 0; 
            box-shadow: none; border: none; 
          } 
          .no-print { display: none !important; } 

          /* ✨ 출력 시 모든 색상을 흑백으로 강제 변환 */
          #printable-modal * {
            color: #000 !important;
          }
          /* 배경 투명화 및 테두리 검은색 유지 */
          table, th, td, .sign-box-container, .sign-box, .sign-title, .sign-data-area {
            background-color: transparent !important;
            border-color: #000 !important;
          }
        }`}
      </style>
      <ModalOverlay onClick={onClose}>
        <ModalContent id="printable-modal" onClick={(e) => e.stopPropagation()}>
          <ModalHeader className="no-print">
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <h3>연장근로 신청서 상세</h3>
              <StatusBadge $status={data.status}>{data.status}</StatusBadge>
            </div>
            <button onClick={onClose}>
              <X size={24} />
            </button>
          </ModalHeader>

          <ModalBody>
            <PrintDocumentHeader>
              <DocumentTitle>연장 및 휴일 근로 신청서</DocumentTitle>

              <SignGroupArea>
                {/* 1. 결재 라인 (기안자 + 결재자) */}
                <SignBoxContainer className="sign-box-container">
                  <SignBox className="sign-box">
                    <SignTitle className="sign-title">기안자</SignTitle>
                    <SignDataArea className="sign-data-area">
                      <SignName>{requesterName}</SignName>
                      <SignDate>
                        {formatStampDate(data.requestDate || data.date)}
                      </SignDate>
                    </SignDataArea>
                  </SignBox>

                  {approvalLine.map((line, idx) => (
                    <SignBox className="sign-box" key={idx}>
                      <SignTitle className="sign-title">
                        {line.step}차 결재
                      </SignTitle>
                      <SignDataArea className="sign-data-area">
                        {line.status === "승인완료" ? (
                          <>
                            <SignName>{line.name.split(" ")[0]}</SignName>
                            <SignDate>
                              {formatStampDate(line.approvedAt)}
                            </SignDate>
                          </>
                        ) : line.status === "반려" ? (
                          <SignName style={{ color: "#ef4444" }}>반려</SignName>
                        ) : (
                          <SignName style={{ color: "#cbd5e1" }}>대기</SignName>
                        )}
                      </SignDataArea>
                    </SignBox>
                  ))}
                </SignBoxContainer>
              </SignGroupArea>
            </PrintDocumentHeader>

            {/* 3. 대상자별 상세 데이터 그리드 (테이블형) */}

            <ListTable>
              <thead>
                <tr>
                  <th colSpan={3}>구분</th>
                  <th colSpan={4}>
                    {moment().format("YYYY년 MM월 DD일 dd요일")}
                  </th>
                </tr>
                <tr>
                  <th style={{ width: "7%" }}>No</th>
                  <th style={{ width: "13%" }}>부서</th>
                  <th style={{ width: "10%" }}>성명</th>

                  <th style={{ width: "auto" }}>업무 내용</th>
                  <th style={{ width: "18%" }}>연장 및 휴일 근로시간</th>
                  <th style={{ width: "8%" }}>시간</th>
                  <th style={{ width: "10%" }}>휴게 시간</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{member.departmentName}</td>
                    <td>{member.name}</td>
                    <td className="reason-col">{member.reason}</td>
                    <td className="time-col">
                      {member.startTime} ~ {member.endTime}
                    </td>
                    <td>{member.netHours}시간</td>
                    <td>{member.restTime === 0 ? "" : member.restTime}시간</td>
                  </tr>
                ))}

                <tr>
                  <td>비고</td>
                  <td colSpan={2}></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </ListTable>
          </ModalBody>

          <ModalFooter className="no-print">
            <Button onClick={onClose}>닫기</Button>

            {/* 기안자만 수정 가능 & (결재대기 or 결재취소 상태일 때) */}
            {userInfo?.id === data.requesterId &&
              data.status === "결재취소" && (
                <Button
                  style={{
                    backgroundColor: "#f59e0b",
                    color: "white",
                    border: "none",
                  }}
                  onClick={() => onEdit(data)}
                >
                  <Edit2 size={18} /> 내용 수정하기
                </Button>
              )}

            {data.status === "승인완료" && (
              <Button $primary onClick={handlePrint}>
                <Printer size={18} /> 문서 인쇄하기
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </>
  );
}
