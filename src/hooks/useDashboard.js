import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchHolidays } from "../Models/ReduxThunk/holiday";
import { Request_Get_Axios } from "../API"; // API 통신 모듈 (경로에 맞게 수정)
import { useNavigate } from "react-router-dom";

export const useDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { holidays, isLoaded, loading } = useSelector((state) => state.holiday);

  useEffect(() => {
    if (!isLoaded && !loading) {
      dispatch(fetchHolidays());
    }
  }, [isLoaded, loading, dispatch]);

  const [applications, setApplications] = useState([]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState("전체");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        const res = await Request_Get_Axios("/Select/selectOverTime");

        if (res.status) {
          setApplications(res.data);
        }
      } catch (error) {
        console.error("연장근로 내역 조회 실패:", error);
      }
    };

    fetchMyApplications();
  }, []);

  const handlePrevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    );
  const handleNextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    );

  const getDaysInMonth = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDay; i++) days.push({ type: "empty" });

    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;

      const dayEvents = applications.filter((app) => app.date === dateStr);

      const matchedHoliday = holidays.find((h) => h.holidayDate === dateStr);

      days.push({
        type: "day",
        day: i,
        dateStr,
        events: dayEvents,
        holidayName: matchedHoliday ? matchedHoliday.holidayName : null,
      });
    }
    return days;
  };

  const calendarDays = getDaysInMonth(
    currentDate.getFullYear(),
    currentDate.getMonth(),
  );

  const openModal = (app) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedApp(null);
  };

  const handleEdit = (appData) => {
    navigate("/apply", { state: { editData: appData } });
  };

  const currentMonthApps = applications.filter((app) => {
    const appDate = new Date(app.date);
    return (
      appDate.getMonth() === currentDate.getMonth() &&
      appDate.getFullYear() === currentDate.getFullYear()
    );
  });

  const pendingCount = currentMonthApps.filter(
    (app) => app.status === "결재대기",
  ).length;
  const approvedCount = currentMonthApps.filter(
    (app) => app.status === "승인완료",
  ).length;

  const totalNetHours = currentMonthApps
    .filter((app) => app.status === "승인완료")
    .reduce((sum, app) => sum + parseFloat(app.netHours || 0), 0);

  const workedHours = Math.floor(totalNetHours);
  const workedMinutes = Math.round((totalNetHours - workedHours) * 60);

  const limitHours = 52;
  const remainingDecimal = limitHours - totalNetHours;
  const remainHours = Math.floor(remainingDecimal);
  const remainMinutes = Math.round((remainingDecimal - remainHours) * 60);

  const stats = {
    workedHours,
    workedMinutes,
    remainHours,
    remainMinutes,
    pendingCount,
    approvedCount,
  };

  const filteredApps = currentMonthApps.filter((app) =>
    activeFilter === "전체" ? true : app.status === activeFilter,
  );

  return {
    currentDate,
    activeFilter,
    setActiveFilter,
    isModalOpen,
    selectedApp,
    calendarDays,
    filteredApps,
    handlePrevMonth,
    handleNextMonth,
    openModal,
    closeModal,
    stats,
    handleEdit,
  };
};
