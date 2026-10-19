import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Request_Get_Axios, Request_Post_Axios } from "../API";

export const useApply = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const reduxHolidays = useSelector((state) => state.holiday?.holidays);
  const [localHolidays, setLocalHolidays] = useState([]);

  const userInfo = useSelector(
    (state) => state.Login_Info_Reducer_State?.Login_Info,
  );

  const holidays = useMemo(() => {
    if (Array.isArray(reduxHolidays) && reduxHolidays.length > 0) {
      return reduxHolidays;
    }
    return localHolidays;
  }, [reduxHolidays, localHolidays]);

  useEffect(() => {
    const loadHolidays = async () => {
      try {
        const resultAction = await Request_Get_Axios(
          "/Home/Getting_Holiday_Lists",
        );

        if (resultAction.status) {
          setLocalHolidays(resultAction.data);
        }
      } catch (err) {
        console.error("휴일 정보 로드 실패:", err);
      }
    };

    loadHolidays();
  }, [dispatch, userInfo?.id]);

  const formatDateStr = useCallback((dateObj) => {
    if (!dateObj) return "";
    const d = dateObj instanceof Date ? dateObj : new Date(dateObj);
    if (isNaN(d.getTime())) return "";
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const normalizeDateStr = useCallback(
    (rawDate) => {
      if (!rawDate) return "";
      if (typeof rawDate === "string") return rawDate.slice(0, 10);
      return formatDateStr(rawDate);
    },
    [formatDateStr],
  );

  const normalizeRestTime = (val) => {
    if (val === undefined || val === null || val === "") return "0";
    const cleaned = String(val).replace(/[^0-9.]/g, "");
    const num = parseFloat(cleaned);
    return isNaN(num) ? "0" : String(num);
  };

  const parseTime = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(":").map(Number);
    return h + m / 60;
  };

  const calculateTimeBreakdown = useCallback(
    (startTime, endTime, restTimeStr) => {
      if (!startTime || !endTime)
        return { netHours: 0, dayHours: 0, nightHours: 0 };
      const start = parseTime(startTime);
      let end = parseTime(endTime);
      if (end <= start) end += 24;

      const rawTotal = end - start;
      const rest = Number(restTimeStr) || 0;

      const getOverlap = (s, e, winStart, winEnd) =>
        Math.max(0, Math.min(e, winEnd) - Math.max(s, winStart));
      const rawNight =
        getOverlap(start, end, 0, 6) + getOverlap(start, end, 22, 30);
      const rawDay = rawTotal - rawNight;

      let netDay = 0,
        netNight = 0;
      if (rawDay >= rest) {
        netDay = rawDay - rest;
        netNight = rawNight;
      } else {
        netDay = 0;
        netNight = Math.max(0, rawNight - (rest - rawDay));
      }

      return {
        netHours: Number((netDay + netNight).toFixed(1)),
        dayHours: Number(netDay.toFixed(1)),
        nightHours: Number(netNight.toFixed(1)),
      };
    },
    [],
  );

  const [isEditMode, setIsEditMode] = useState(false);
  const [coworkerList, setCoworkerList] = useState([]);
  const [selectedCoworkers, setSelectedCoworkers] = useState([]);

  const [formData, setFormData] = useState({
    appId: null,
    date: new Date(),
    applicants: [
      {
        id: "requester",
        userId: userInfo?.id || "",
        name: "본인 (기안자)",
        isRequester: true,
        startTime: "18:00",
        endTime: "20:00",
        restTime: "0",
        reason: "",
      },
    ],
  });

  const holidayInfo = useMemo(() => {
    const dateObj = formData.date;
    if (!dateObj) {
      return { isHoliday: false, reason: "평일", label: "평일 연장근로" };
    }

    const dateStr = formatDateStr(dateObj);
    const matchedHoliday = holidays.find(
      (h) => normalizeDateStr(h.holidayDate) === dateStr,
    );

    if (matchedHoliday) {
      return {
        isHoliday: true,
        reason: matchedHoliday.holidayName,
        label: `휴일근로 (${matchedHoliday.holidayName})`,
      };
    }

    const day = dateObj.getDay();
    if (day === 0) {
      return {
        isHoliday: true,
        reason: "일요일",
        label: "휴일근로 (일요일)",
      };
    }

    const editData = location.state?.editData;
    if (
      isEditMode &&
      editData &&
      normalizeDateStr(editData.date) === dateStr &&
      editData.isHoliday === "Y"
    ) {
      return {
        isHoliday: true,
        reason: editData.holidayReason || "지정휴일",
        label: `휴일근로 (${editData.holidayReason || "지정휴일"})`,
      };
    }

    if (day === 6) {
      return {
        isHoliday: false,
        reason: "토요일",
        label: "토요일 연장근로",
      };
    }

    return {
      isHoliday: false,
      reason: "평일",
      label: "평일 연장근로",
    };
  }, [
    formData.date,
    holidays,
    isEditMode,
    location.state,
    formatDateStr,
    normalizeDateStr,
  ]);

  const isCustomHoliday = useCallback(
    (checkDate) => {
      const targetStr = formatDateStr(checkDate);
      return holidays.some(
        (h) => normalizeDateStr(h.holidayDate) === targetStr,
      );
    },
    [holidays, formatDateStr, normalizeDateStr],
  );

  useEffect(() => {
    const getCoworkerList = async () => {
      try {
        const req = await Request_Get_Axios(`/User/getCoworkerList`);
        if (req.status && Array.isArray(req.data)) {
          const filteredList = req.data.filter(
            (user) => user.value !== userInfo?.id,
          );
          setCoworkerList(filteredList);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (userInfo?.id) {
      getCoworkerList();
      if (!location.state?.editData) {
        setFormData((prev) => {
          const newApplicants = [...prev.applicants];
          if (newApplicants[0]) {
            newApplicants[0] = { ...newApplicants[0], userId: userInfo.id };
          }
          return { ...prev, applicants: newApplicants };
        });
      }
    }
  }, [userInfo?.id, location.state]);

  const handleCoworkerSelectChange = (newSelectedList) => {
    const safeList = newSelectedList || [];
    setSelectedCoworkers(safeList);

    setFormData((prev) => {
      const requester = prev.applicants[0];
      const coworkerApplicants = safeList.map((co) => {
        const existing = prev.applicants.find((app) => app.id === co.value);
        return existing
          ? existing
          : {
              id: co.value,
              userId: co.value,
              name: co.label,
              isRequester: false,
              startTime: requester.startTime,
              endTime: requester.endTime,
              restTime: requester.restTime,
              reason: requester.reason,
            };
      });

      return { ...prev, applicants: [requester, ...coworkerApplicants] };
    });
  };

  // 수정 모드 진입 시 데이터 복원
  useEffect(() => {
    const editData = location.state?.editData;

    if (editData) {
      setIsEditMode(true);

      const cleanDateStr = normalizeDateStr(editData.date);
      const [yyyy, mm, dd] = cleanDateStr.split("-").map(Number);
      const localDate = new Date(yyyy, mm - 1, dd);

      let restoredApplicants = [];
      let preSelectedCoworkers = [];

      if (editData.teamMembers && editData.teamMembers.length > 0) {
        const requesterDB =
          editData.teamMembers.find(
            (m) => m.isRequester === "Y" || m.userId === editData.requesterId,
          ) || editData.teamMembers[0];

        // 동반자 찾기
        const coworkersDB = editData.teamMembers.filter(
          (m) => m.userId !== requesterDB.userId,
        );

        const requesterApp = {
          id: "requester",
          userId:
            requesterDB?.userId || userInfo?.id || editData.requesterId || "",
          name: "본인 (기안자)",
          isRequester: true,
          startTime: requesterDB?.startTime || "18:00",
          endTime: requesterDB?.endTime || "20:00",

          restTime: normalizeRestTime(
            requesterDB?.restTime ?? editData.restTime,
          ),
          reason: requesterDB?.reason || editData.reason || "",
        };

        const coworkersApps = coworkersDB.map((m) => ({
          id: m.userId,
          userId: m.userId,
          name: `[${m.departmentName}] ${m.name} ${m.titleName}`,
          isRequester: false,
          startTime: m.startTime || "18:00",
          endTime: m.endTime || "20:00",
          restTime: normalizeRestTime(m.restTime),
          reason: m.reason || "",
        }));

        preSelectedCoworkers = coworkersDB.map((m) => ({
          label: `[${m.departmentName}] ${m.name} ${m.titleName}`,
          value: m.userId,
        }));

        restoredApplicants = [requesterApp, ...coworkersApps];
      }

      setSelectedCoworkers(preSelectedCoworkers);
      setFormData({
        appId: editData.id,
        date: localDate,
        applicants: restoredApplicants,
      });
    }
  }, [location.state, userInfo?.id, normalizeDateStr]);

  const handleDateChange = (date) => setFormData((prev) => ({ ...prev, date }));

  const handleApplicantChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      applicants: prev.applicants.map((app) =>
        app.id === id ? { ...app, [field]: value } : app,
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const app of formData.applicants) {
      const breakdown = calculateTimeBreakdown(
        app.startTime,
        app.endTime,
        app.restTime,
      );
      if (breakdown.netHours <= 0) {
        alert(
          `[${app.name}]님의 실근로 시간이 0시간 이하입니다. 시간을 다시 확인해주세요.`,
        );
        return;
      }
    }

    const payload = {
      appId: formData.appId,
      workDate: formatDateStr(formData.date),
      isHoliday: holidayInfo.isHoliday ? "Y" : "N",
      holidayReason: holidayInfo.reason,
      members: formData.applicants.map((app) => {
        const breakdown = calculateTimeBreakdown(
          app.startTime,
          app.endTime,
          app.restTime,
        );
        return {
          userId: app.userId,
          isRequester: app.isRequester,
          startTime: app.startTime,
          endTime: app.endTime,
          restTime: app.restTime,
          reason: app.reason,
          ...breakdown,
        };
      }),
    };

    const apiUrl = isEditMode ? "/Apply/updateOvertime" : "/Apply/saveOvertime";

    try {
      const req = await Request_Post_Axios(apiUrl, payload);
      if (req.status) {
        alert(
          `[${holidayInfo.label}] 신청 내역이 ${isEditMode ? "수정" : "저장"}되었습니다.`,
        );
        navigate("/");
      }
    } catch (error) {
      console.error("저장 실패", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => navigate(-1);

  return {
    coworkerList,
    formData,
    holidayInfo,
    isCustomHoliday,
    selectedCoworkers,
    setSelectedCoworkers: handleCoworkerSelectChange,
    isEditMode,
    handleApplicantChange,
    handleDateChange,
    handleSubmit,
    handleCancel,
    calculateTimeBreakdown,
    holidays,
  };
};
