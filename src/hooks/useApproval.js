import { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { Request_Get_Axios, Request_Post_Axios } from "../API";

export const useApproval = () => {
  const userInfo = useSelector(
    (state) => state.Login_Info_Reducer_State.Login_Info,
  );
  const currentUserId = userInfo?.id || "";

  const [activeTab, setActiveTab] = useState("pending");
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchApprovals = async () => {
    try {
      const res = await Request_Get_Axios("/Select/selectApprovals");
      if (res.status) {
        setApplications(res.data);
      }
    } catch (error) {
      console.error("결재 목록 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handlePrevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    );
  const handleNextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    );

  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      if (activeTab === "pending") {
        return app.status === "결재대기";
      } else {
        const appDate = new Date(app.date);
        const isSameMonth =
          appDate.getMonth() === currentDate.getMonth() &&
          appDate.getFullYear() === currentDate.getFullYear();
        return (
          (app.status === "승인완료" ||
            app.status === "반려" ||
            app.status === "결재취소") &&
          isSameMonth
        );
      }
    });
  }, [applications, activeTab, currentDate]);

  const openModal = (app) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedApp(null);
  };

  const handleApproval = async (id, action) => {
    if (!window.confirm(`해당 신청 건을 ${action} 처리하시겠습니까?`)) return;

    try {
      const res = await Request_Post_Axios("/Select/processApproval", {
        appId: id,
        action,
      });
      if (res.status) {
        alert(`${action} 처리되었습니다.`);
        closeModal();
        fetchApprovals();
      }
    } catch (error) {
      console.error("결재 처리 실패:", error);
      alert("결재 처리 중 오류가 발생했습니다.");
    }
  };

  const groupTeamMembers = (membersArray) => {
    if (!membersArray || !Array.isArray(membersArray)) return {};

    return membersArray.reduce((acc, member) => {
      const team = member.departmentName || "기타";
      const nameWithTitle = `${member.name} ${member.titleName}`;

      if (!acc[team]) acc[team] = [];
      acc[team].push(nameWithTitle);
      return acc;
    }, {});
  };

  return {
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
    groupTeamMembers,
  };
};
