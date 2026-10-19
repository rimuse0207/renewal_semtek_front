import { useState, useMemo, useEffect } from "react";
import { Request_Get_Axios, Request_Post_Axios } from "../../API"; // 경로는 환경에 맞게 확인해주세요

export const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("전체");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");

  // ✨ 초기 상태에 menuAuth 배열 추가
  const initialFormState = {
    indexs: null,
    userId: "",
    fullName: "",
    titleName: "프로",
    departmentName: "",
    role: "일반",
    inservice: "활성",
    approvalLine: [],
    menuAuth: [], // ✨ 새로 추가됨
  };
  const [formData, setFormData] = useState(initialFormState);

  const [selectedApproverId, setSelectedApproverId] = useState("");

  // 1. 유저 목록 불러오기 API 연동
  const getUserList = async () => {
    try {
      const req = await Request_Get_Axios("/User/getUserList");

      if (req.status) {
        // 백엔드에서 user 정보에 menuAuth (배열)를 함께 넘겨준다고 가정
        setUsers(req.data.userOptions || []);
        setDepartments(req.data.departmentOptions || []);
      }
    } catch (error) {
      console.error("유저 목록 조회 실패:", error);
    }
  };

  useEffect(() => {
    getUserList();
  }, []);

  // 2. 고유 팀 목록 추출
  const uniqueTeams = useMemo(() => {
    const allTeams = users.map((user) => user.departmentName);
    return [...new Set(allTeams)].filter(Boolean);
  }, [users]);

  // 3. 필터 초기화
  const resetFilters = () => {
    setSelectedTeam("전체");
    setSearchQuery("");
  };

  // 4. 사용자 필터링
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchTeam =
        selectedTeam === "전체" || user.departmentName === selectedTeam;
      const matchSearch =
        user.fullName.includes(searchQuery) ||
        user.userId.includes(searchQuery);
      return matchTeam && matchSearch;
    });
  }, [users, selectedTeam, searchQuery]);

  // 5. 결재자 후보 리스트
  const availableApprovers = useMemo(() => {
    return users.filter(
      (u) =>
        u.userId !== formData.userId &&
        !formData.approvalLine.includes(u.userId),
    );
  }, [users, formData.userId, formData.approvalLine]);

  // --- 모달 제어 ---
  const openAddModal = () => {
    setModalMode("add");
    setFormData(initialFormState);
    setSelectedApproverId("");
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setModalMode("edit");
    // ✨ user 객체 안에 menuAuth 가 없으면 빈 배열로 셋팅
    setFormData({
      ...user,
      approvalLine: user.approvalLine || [],
      menuAuth: user.menuAuth || [], // ✨ 새로 추가됨
    });
    setSelectedApproverId("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(initialFormState);
  };

  // 일반 인풋 변경 처리
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- 결재 라인 제어 (userId 기준) ---
  const handleAddApprover = () => {
    if (!selectedApproverId) return;
    setFormData((prev) => ({
      ...prev,
      approvalLine: [...prev.approvalLine, selectedApproverId],
    }));
    setSelectedApproverId("");
  };

  const handleRemoveApprover = (idToRemove) => {
    setFormData((prev) => ({
      ...prev,
      approvalLine: prev.approvalLine.filter((id) => id !== idToRemove),
    }));
  };

  // --- 서버 연동 ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (modalMode === "add") {
      if (users.find((u) => u.userId === formData.userId)) {
        return alert("이미 등록된 이메일(아이디)입니다.");
      }

      // 💡 백엔드의 saveNewUser 로직으로 formData 전송 (menuAuth 포함됨)
      const req = await Request_Post_Axios("/User/saveNewUser", formData);

      if (req.status) {
        await getUserList();
        alert("신규 사용자가 추가되었습니다. (초기 비밀번호: 1234)");
      }
    } else {
      // 💡 백엔드의 updateUserInfo 로직으로 formData 전송 (menuAuth 포함됨)
      const req = await Request_Post_Axios("/User/updateUserInfo", formData);

      if (req.status) {
        await getUserList();
        alert("사용자 정보가 수정되었습니다.");
      }
    }

    closeModal();
  };

  const handleDelete = (indexs, fullName) => {
    if (window.confirm(`정말 [${fullName}] 사용자를 삭제 처리하시겠습니까?`)) {
      setUsers((prev) => prev.filter((u) => u.indexs !== indexs));
      alert("삭제되었습니다.");
    }
  };

  const handlePasswordReset = async (userId, fullName) => {
    if (
      window.confirm(
        `[${fullName}] 사용자의 비밀번호를 초기화(1234) 하시겠습니까?`,
      )
    ) {
      const req = await Request_Post_Axios("/User/userPasswordReset", {
        userId,
      });
      if (req.status) {
        alert(`[${fullName}]님의 비밀번호를 '1234'으로 초기화하였습니다.`);
      }
    }
  };

  const getUserNameById = (userId) => {
    const user = users.find((u) => u.userId === userId);
    return user ? `${user.fullName} ${user.titleName}` : userId;
  };

  return {
    users,
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
  };
};
