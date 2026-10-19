import React from "react";
import styled from "styled-components";
import { X, ArrowRight } from "lucide-react";

// --- Styled Components 유지 ---
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
  max-width: 600px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  overflow: auto;
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
const FormGroup = styled.div`
  margin-bottom: 20px;
  label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #475569;
    margin-bottom: 8px;
  }
`;
const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 12px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 15px;
  color: #0f172a;
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
  &[disabled] {
    background-color: #f1f5f9;
    color: #94a3b8;
    cursor: not-allowed;
  }
`;
const Select = styled.select`
  padding: 12px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 15px;
  color: #0f172a;
  width: 100%;
  background-color: white;
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
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
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  ${(props) =>
    props.$primary
      ? `background-color: #3b82f6; color: white; &:hover { background-color: #2563eb; }`
      : `background-color: white; color: #475569; border: 1px solid #cbd5e1; &:hover { background-color: #f8fafc; }`}
`;

const ApprovalLineCard = styled.div`
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
`;
const AddApproverRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;
const ApproverList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const ApproverItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  border: 1px solid #cbd5e1;
  padding: 10px 16px;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
  .info {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    font-weight: 500;
    color: #0f172a;
  }
  .step {
    background-color: #3b82f6;
    color: white;
    font-size: 12px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
  }
  button {
    background: none;
    border: none;
    color: #ef4444;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 4px;
    border-radius: 4px;
    &:hover {
      background-color: #fef2f2;
    }
  }
`;
const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column; /* ✨ 가로(row)에서 세로(column)로 변경 */
  gap: 12px; /* 체크박스 간 세로 간격 조절 */
  margin-top: 8px;
  background-color: #f8fafc; /* 영역 구분을 위한 옅은 배경 (선택사항) */
  padding: 12px 16px; /* 패딩 추가 */
  border-radius: 8px; /* 둥근 모서리 */
  border: 1px solid #e2e8f0;

  label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #334155;
    cursor: pointer;
  }

  /* 체크박스 크기 살짝 키우기 (옵션) */
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
`;

const UserModal = ({
  departments,
  isModalOpen,
  modalMode,
  closeModal,
  handleSubmit,
  formData,
  handleInputChange,
  availableApprovers,
  selectedApproverId,
  setSelectedApproverId,
  handleAddApprover,
  handleRemoveApprover,
  getUserNameById,
}) => {
  if (!isModalOpen) return null;

  const handleAuthCheckbox = (e) => {
    const { value, checked } = e.target;
    let currentAuth = formData.menuAuth || [];

    if (checked) {
      currentAuth = [...currentAuth, value];
    } else {
      currentAuth = currentAuth.filter((auth) => auth !== value);
    }

    handleInputChange({ target: { name: "menuAuth", value: currentAuth } });
  };

  return (
    <ModalOverlay onClick={closeModal}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h3>
            {modalMode === "add" ? "신규 사용자 등록" : "사용자 정보 수정"}
          </h3>
          <button onClick={closeModal} type="button">
            <X size={24} />
          </button>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <FormGroup>
              <label>이메일 (아이디)</label>
              <Input
                type="email"
                name="userId"
                value={formData.userId}
                onChange={handleInputChange}
                placeholder="예: user@company.com"
                required
                disabled={modalMode === "edit"}
              />
            </FormGroup>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <FormGroup>
                <label>이름</label>
                <Input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="예: 홍길동"
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>직급</label>
                <Input
                  type="text"
                  name="titleName"
                  value={formData.titleName}
                  onChange={handleInputChange}
                  placeholder="예: 선임, 책임, 파트장"
                  required
                />
              </FormGroup>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <FormGroup>
                <label>부서</label>

                <Select
                  name="departmentName"
                  value={formData.departmentName}
                  onChange={handleInputChange}
                >
                  <option value="">선택해주세요</option>
                  {departments.map((team) => (
                    <option key={team.value} value={team.value}>
                      {team.label}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <label>메뉴 접근 권한 설정</label>
                <CheckboxGroup>
                  <label>
                    <input
                      type="checkbox"
                      value="approval"
                      checked={(formData.menuAuth || []).includes("approval")}
                      onChange={handleAuthCheckbox}
                    />
                    결재 관리
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="adminReport"
                      checked={(formData.menuAuth || []).includes(
                        "adminReport",
                      )}
                      onChange={handleAuthCheckbox}
                    />
                    월별 조회
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="adminUsers"
                      checked={(formData.menuAuth || []).includes("adminUsers")}
                      onChange={handleAuthCheckbox}
                    />
                    사용자 관리
                  </label>
                </CheckboxGroup>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#94a3b8",
                    marginTop: "8px",
                  }}
                >
                  * '메인 홈', '연장근로 신청'은 기본 노출됩니다.
                </div>
              </FormGroup>
            </div>

            <FormGroup>
              <label>전담 결재 라인 (순차 결재)</label>
              <ApprovalLineCard>
                <AddApproverRow>
                  <Select
                    style={{ flex: 1 }}
                    value={selectedApproverId}
                    onChange={(e) => setSelectedApproverId(e.target.value)}
                  >
                    <option value="" disabled>
                      승인권자 선택...
                    </option>
                    {availableApprovers.map((u) => (
                      <option key={u.userId} value={u.userId}>
                        {u.fullName} {u.titleName} ({u.departmentName})
                      </option>
                    ))}
                  </Select>
                  <Button type="button" onClick={handleAddApprover}>
                    추가
                  </Button>
                </AddApproverRow>

                <ApproverList>
                  {formData.approvalLine.length === 0 ? (
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#94a3b8",
                        textAlign: "center",
                        padding: "10px 0",
                      }}
                    >
                      지정된 결재자가 없습니다.
                    </div>
                  ) : (
                    formData.approvalLine.map((userId, idx) => (
                      <React.Fragment key={userId}>
                        {idx > 0 && (
                          <div
                            style={{
                              textAlign: "center",
                              color: "#94a3b8",
                              margin: "-4px 0",
                            }}
                          >
                            <ArrowRight
                              size={16}
                              style={{ transform: "rotate(90deg)" }}
                            />
                          </div>
                        )}
                        <ApproverItem>
                          <div className="info">
                            <span className="step">{idx + 1}차</span>
                            <span>{getUserNameById(userId)}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveApprover(userId)}
                          >
                            <X size={16} />
                          </button>
                        </ApproverItem>
                      </React.Fragment>
                    ))
                  )}
                </ApproverList>
              </ApprovalLineCard>
            </FormGroup>

            {modalMode === "edit" && (
              <FormGroup style={{ marginBottom: 0 }}>
                <label>계정 상태</label>
                <Select
                  name="inservice"
                  value={formData.inservice}
                  onChange={handleInputChange}
                >
                  <option value={1}>활성 (로그인 가능)</option>
                  <option value={0}>정지 (퇴사 또는 휴직)</option>
                </Select>
              </FormGroup>
            )}
          </ModalBody>

          <ModalFooter>
            <Button type="button" onClick={closeModal}>
              취소
            </Button>
            <Button type="submit" $primary>
              {modalMode === "add" ? "등록하기" : "저장하기"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default UserModal;
