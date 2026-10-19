import React from "react";
import styled from "styled-components";

const WEEKS = ["일", "월", "화", "수", "목", "금", "토"];

const Calendar = ({ calendarDays, openModal }) => {
  return (
    <CalendarSection>
      <CalendarGrid>
        {WEEKS.map((week, idx) => (
          <DayHeader key={idx} $isSun={idx === 0} $isSat={idx === 6}>
            {week}
          </DayHeader>
        ))}
        {calendarDays.map((item, idx) => (
          <DayCell key={idx} $isEmpty={item.type === "empty"}>
            {item.type === "day" && (
              <>
                <DateNumber
                  $isHoliday={idx % 7 === 0 || !!item.holidayName}
                  $isSat={idx % 7 === 6}
                >
                  {item.day}

                  {item.holidayName && (
                    <span className="holiday-name">({item.holidayName})</span>
                  )}
                </DateNumber>

                {item.events.map((evt, i) => {
                  const duration = (evt.time.match(/\((.*?)\)/) || [])[1] || "";
                  return (
                    <EventBadge
                      key={i}
                      $status={evt.status}
                      onClick={() => openModal(evt)}
                      style={{ cursor: "pointer" }}
                    >
                      {evt.status} {duration && `(${duration})`}
                    </EventBadge>
                  );
                })}
              </>
            )}
          </DayCell>
        ))}
      </CalendarGrid>
    </CalendarSection>
  );
};

export default Calendar;

const CalendarSection = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
`;
const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-top: 1px solid #e2e8f0;
  border-left: 1px solid #e2e8f0;
  border-radius: 8px 8px 0 0;
`;
const DayHeader = styled.div`
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  padding: 12px 0;
  background-color: #f8fafc;
  border-right: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  color: ${(props) =>
    props.$isSun ? "#ef4444" : props.$isSat ? "#3b82f6" : "#64748b"};
`;
const DayCell = styled.div`
  min-height: 100px;
  padding: 8px;
  background-color: ${(props) => (props.$isEmpty ? "#f8fafc" : "#ffffff")};
  border-right: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DateNumber = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;

  /* 휴일($isHoliday)이면 빨간색, 토요일($isSat)이면 파란색, 그 외 기본색 */
  color: ${(props) =>
    props.$isHoliday ? "#ef4444" : props.$isSat ? "#3b82f6" : "#334155"};

  .holiday-name {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: -0.5px;
  }
`;

const EventBadge = styled.div`
  font-size: 11px;
  padding: 4px 6px;
  border-radius: 4px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  ${({ $status }) => {
    switch ($status) {
      case "승인완료":
        return "background-color: #dcfce7; color: #166534; border: 1px solid #bbf7d0;";
      case "결재대기":
        return "background-color: #fef9c3; color: #854d0e; border: 1px solid #fef08a;";
      case "반려":
        return "background-color: #fee2e2; color: #991b1b; border: 1px solid #fecaca;";
      default:
        return "background-color: #f1f5f9; color: #475569;";
    }
  }}
`;
