import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { Request_Get_Axios } from "../API";
import moment from "moment";
import "moment/locale/ko";
import { fetchHolidays } from "../Models/ReduxThunk/holiday";

export const useAdminReport = () => {
  const dispatch = useDispatch();

  const holidays = useSelector((state) => state.holiday?.holidays) || [];

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTeam, setSelectedTeam] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [approvedMonthData, setApprovedMonthData] = useState([]);

  useEffect(() => {
    dispatch(fetchHolidays());

    const fetchReports = async () => {
      try {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const res = await Request_Get_Axios(`/Select/getReports`, {
          year,
          month,
        });

        if (res.status) {
          setApprovedMonthData(res.data);
        }
      } catch (error) {
        console.error("리포트 데이터 조회 실패:", error);
      }
    };

    fetchReports();
  }, [currentDate, dispatch]);

  const handlePrevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    );
  const handleNextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    );

  const enhancedData = useMemo(() => {
    return approvedMonthData.map((app) => {
      let holidayLabel = "평일 (연장)";

      if (app.isHoliday === "Y") {
        const matchedHoliday = holidays.find((h) => h.holidayDate === app.date);

        if (matchedHoliday) {
          holidayLabel = `휴일 (${matchedHoliday.holidayName})`;
        } else {
          const day = new Date(app.date).getDay();
          if (day === 0) {
            holidayLabel = "휴일 (일요일)";
          } else {
            holidayLabel = "휴일 (지정휴일)";
          }
        }
      }

      return { ...app, holidayLabel };
    });
  }, [approvedMonthData, holidays]);

  // 부서명 동적 추출
  const teamList = useMemo(() => {
    const teams = enhancedData.map((app) => app.team).filter(Boolean);
    const uniqueTeams = Array.from(new Set(teams)).sort();
    return ["전체", ...uniqueTeams];
  }, [enhancedData]);

  // 검색 및 부서 필터 적용
  const filteredData = useMemo(() => {
    return enhancedData.filter((app) => {
      const matchTeam = selectedTeam === "전체" || app.team === selectedTeam;
      const matchSearch =
        (app.name && app.name.includes(searchQuery)) ||
        (app.reason && app.reason.includes(searchQuery));
      return matchTeam && matchSearch;
    });
  }, [enhancedData, selectedTeam, searchQuery]);

  // 통계 집계
  const stats = useMemo(() => {
    const totalHours = filteredData.reduce(
      (sum, app) => sum + parseFloat(app.netHours || 0),
      0,
    );
    const totalDayHours = filteredData.reduce(
      (sum, app) => sum + parseFloat(app.dayHours || app.netHours || 0),
      0,
    );
    const totalNightHours = filteredData.reduce(
      (sum, app) => sum + parseFloat(app.nightHours || 0),
      0,
    );

    // DB의 isHoliday 플래그를 기준으로 휴일 실근로 시간 합산
    const totalHolidayHours = filteredData.reduce(
      (sum, app) =>
        sum + (app.isHoliday === "Y" ? parseFloat(app.netHours || 0) : 0),
      0,
    );

    const totalApprovedCounts = filteredData.length;
    const uniqueMembers = new Set(filteredData.map((app) => app.name)).size;
    const avgHours =
      uniqueMembers > 0 ? (totalHours / uniqueMembers).toFixed(1) : 0;

    return {
      totalHours: Number(totalHours.toFixed(1)),
      totalDayHours: Number(totalDayHours.toFixed(1)),
      totalNightHours: Number(totalNightHours.toFixed(1)),
      totalHolidayHours: Number(totalHolidayHours.toFixed(1)),
      totalApprovedCounts,
      uniqueMembers,
      avgHours,
    };
  }, [filteredData]);

  // 엑셀 다운로드
  const handleExcelDownload = () => {
    if (filteredData.length === 0) {
      alert("다운로드할 데이터가 없습니다.");
      return;
    }

    const exportData = filteredData.map((row) => ({
      일자: row.date,
      요일: moment(row.date).format("dd요일"),
      소속팀: row.team,
      이름: row.name,
      구분: row.holidayLabel, // ✨ 업데이트된 완벽한 라벨 출력
      근무시간: `${row.startTime} ~ ${row.endTime}`,
      주간: Number(row.dayHours || row.netHours),
      심야: Number(row.nightHours || 0),
      휴게: Number(row.restTime || 0),
      실근로: Number(row.netHours),
      사유: row.reason,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    worksheet["!cols"] = [
      { wch: 12 },
      { wch: 8 },
      { wch: 15 },
      { wch: 10 },
      { wch: 18 },
      { wch: 15 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 40 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "월간_연장심야휴일근로");
    const fileName = `연장근로_집계리포트_${currentDate.getFullYear()}년_${currentDate.getMonth() + 1}월.xlsx`;

    XLSX.writeFile(workbook, fileName);
  };

  const openUserModal = (name) => {
    setSelectedUser(name);
    setIsModalOpen(true);
  };

  const closeUserModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const userModalData = useMemo(() => {
    if (!selectedUser) return [];
    return enhancedData.filter((app) => app.name === selectedUser);
  }, [enhancedData, selectedUser]);

  const userTotalHours = userModalData
    .reduce((sum, app) => sum + parseFloat(app.netHours || 0), 0)
    .toFixed(1);
  const userTeam = userModalData.length > 0 ? userModalData[0].team : "";

  return {
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
    teamList,
    handlePrevMonth,
    handleNextMonth,
    handleExcelDownload,
    openUserModal,
    closeUserModal,
  };
};
