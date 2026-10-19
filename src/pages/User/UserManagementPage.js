import React from "react";
import styled from "styled-components";
import {
  Search,
  Filter,
  UserPlus,
  Edit2,
  Trash2,
  KeyRound,
  ShieldAlert,
  GitMerge,
  RotateCcw,
} from "lucide-react";
import { useUserManagement } from "../../hooks/User/useUserManagement";
import UserModal from "./Modal/UserModal";

// --- Styled Components 유지 ---
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
  margin-bottom: 8px;
`;
const SubTitle = styled.p`
  color: #64748b;
  margin: 0;
  font-size: 15px;
`;
const AddButton = styled.button`
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
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
const ResetButton = styled.button`
  background-color: white;
  color: #64748b;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background-color: #f1f5f9;
    color: #0f172a;
    border-color: #94a3b8;
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
  padding: 16px 24px;
  background-color: #f8fafc;
  color: #475569;
  font-weight: 600;
  font-size: 13px;
  border-bottom: 1px solid #e2e8f0;
`;
const Td = styled.td`
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
  color: #334155;
  font-size: 14px;
  vertical-align: middle;
`;
const RoleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${(props) =>
    props.$role === "관리자" ? "#fef2f2" : "#f1f5f9"};
  color: ${(props) => (props.$role === "관리자" ? "#ef4444" : "#64748b")};
  border: 1px solid
    ${(props) => (props.$role === "관리자" ? "#fecaca" : "#e2e8f0")};
`;
const StatusText = styled.span`
  font-weight: 600;
  color: ${(props) => (props.$status === "활성" ? "#10b981" : "#94a3b8")};
`;
const ApprovalLineBadge = styled.span`
  background-color: #f8fafc;
  border: 1px solid #cbd5e1;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #475569;
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;
const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;
const IconButton = styled.button`
  background: none;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: #64748b;
  &:hover {
    background-color: ${(props) =>
      props.$color === "red" ? "#fef2f2" : "#f1f5f9"};
    color: ${(props) => (props.$color === "red" ? "#ef4444" : "#0f172a")};
    border-color: ${(props) =>
      props.$color === "red" ? "#fca5a5" : "#cbd5e1"};
  }
`;

const AuthBadgeGroup = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const AuthBadge = styled.span`
  background-color: #f1f5f9;
  color: #475569;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid #cbd5e1;

  ${({ $type }) => {
    if ($type === "approval")
      return "background-color: #dbeafe; color: #1d4ed8; border-color: #bfdbfe;";
    if ($type === "adminReport")
      return "background-color: #dcfce7; color: #15803d; border-color: #bbf7d0;";
    if ($type === "adminUsers")
      return "background-color: #f3e8ff; color: #7e22ce; border-color: #e9d5ff;";
    return "";
  }}
`;

const AUTH_LABELS = {
  approval: "결재 관리",
  adminReport: "월별 조회",
  adminUsers: "사용자 관리",
};

export default function UserManagementPage() {
  const {
    departments,
    filteredUsers,
    searchQuery,
    setSearchQuery,
    selectedTeam,
    setSelectedTeam,
    isModalOpen,
    modalMode,
    formData,
    handleInputChange,
    availableApprovers,
    selectedApproverId,
    setSelectedApproverId,
    handleAddApprover,
    handleRemoveApprover,
    openAddModal,
    openEditModal,
    closeModal,
    handleSubmit,
    handleDelete,
    handlePasswordReset,
    getUserNameById,
    uniqueTeams,
    resetFilters,
  } = useUserManagement();

  return (
    <ContentArea>
      <PageHeader>
        <div>
          <PageTitle>시스템 사용자 관리</PageTitle>
          <SubTitle>사용자 계정 생성, 결재 라인 지정 및 권한 관리</SubTitle>
        </div>
        <AddButton onClick={openAddModal}>
          <UserPlus size={18} />
          신규 사용자 등록
        </AddButton>
      </PageHeader>

      <FilterSection>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <FilterGroup>
            <Filter size={18} color="#64748b" />
            <Select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              <option value="전체">모든 부서</option>
              {uniqueTeams.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </Select>
          </FilterGroup>

          <SearchBox>
            <Search size={18} color="#94a3b8" />
            <input
              type="text"
              placeholder="이메일 또는 이름 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBox>
        </div>

        <ResetButton onClick={resetFilters}>
          <RotateCcw size={16} />
          초기화
        </ResetButton>
      </FilterSection>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>이름</Th>
              <Th>직급</Th>
              <Th>이메일 (ID)</Th>
              <Th>부서</Th>
              <Th>결재 라인</Th>
              <Th>권한 현황</Th>
              <Th>상태</Th>
              <Th style={{ textAlign: "center" }}>관리</Th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.indexs}>
                  <Td style={{ fontWeight: "700", color: "#0f172a" }}>
                    {user.fullName}
                  </Td>
                  <Td style={{ color: "#334155" }}>{user.titleName}</Td>
                  <Td style={{ color: "#64748b" }}>{user.userId}</Td>
                  <Td>{user.departmentName}</Td>
                  <Td>
                    {user.approvalLine && user.approvalLine.length > 0 ? (
                      <ApprovalLineBadge>
                        <GitMerge size={14} color="#3b82f6" />
                        {user.approvalLine.length}단계 결재
                      </ApprovalLineBadge>
                    ) : (
                      <span style={{ color: "#94a3b8", fontSize: "13px" }}>
                        미지정
                      </span>
                    )}
                  </Td>
                  <Td>
                    {user.menuAuth && user.menuAuth.length > 0 ? (
                      <AuthBadgeGroup>
                        {user.menuAuth.map((authCode) => (
                          <AuthBadge key={authCode} $type={authCode}>
                            {AUTH_LABELS[authCode] || authCode}
                          </AuthBadge>
                        ))}
                      </AuthBadgeGroup>
                    ) : (
                      <span style={{ fontSize: "13px", color: "#94a3b8" }}>
                        -
                      </span>
                    )}
                  </Td>
                  <Td>
                    <StatusText
                      $status={user.inservice === 1 ? "활성" : "정지"}
                    >
                      {user.inservice === 1 ? "활성" : "정지"}
                    </StatusText>
                  </Td>
                  <Td>
                    <ActionButtons style={{ justifyContent: "center" }}>
                      <IconButton
                        title="정보 수정 (결재라인 변경)"
                        onClick={() => openEditModal(user)}
                      >
                        <Edit2 size={16} />
                      </IconButton>
                      <IconButton
                        title="비밀번호 초기화"
                        onClick={() =>
                          handlePasswordReset(user.userId, user.fullName)
                        }
                      >
                        <KeyRound size={16} />
                      </IconButton>
                    </ActionButtons>
                  </Td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  style={{
                    textAlign: "center",
                    padding: "60px",
                    color: "#94a3b8",
                  }}
                >
                  검색 결과가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </TableContainer>

      <UserModal
        departments={departments}
        isModalOpen={isModalOpen}
        modalMode={modalMode}
        closeModal={closeModal}
        handleSubmit={handleSubmit}
        formData={formData}
        handleInputChange={handleInputChange}
        availableApprovers={availableApprovers}
        selectedApproverId={selectedApproverId}
        setSelectedApproverId={setSelectedApproverId}
        handleAddApprover={handleAddApprover}
        handleRemoveApprover={handleRemoveApprover}
        getUserNameById={getUserNameById}
      />
    </ContentArea>
  );
}
