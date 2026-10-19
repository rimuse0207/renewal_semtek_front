import React, { useEffect } from "react";
import styled from "styled-components";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import {
  Clock,
  Users,
  CalendarCheck,
  Sun,
  Moon,
  Lock,
  User,
  Info,
} from "lucide-react";
import { useApply } from "../../hooks/useApply";
import { useDispatch } from "react-redux";
import { fetchHolidays } from "../../Models/ReduxThunk/holiday";

// --- Styled Components ---
const ContentArea = styled.div`
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  box-sizing: border-box;
  background-color: #f8fafc;
`;
const PageHeader = styled.div`
  margin-bottom: 24px;
`;
const PageTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px 0;
`;
const PageDesc = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 15px;
`;
const FormCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  margin-bottom: 24px;
  width: 100%;
  box-sizing: border-box;
  overflow: visible;
`;

// ✨ 동반 신청자 전용 카드 (디자인 단순화)
const PersonCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -1px rgba(0, 0, 0, 0.03);
  border: 1px solid #e2e8f0;
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
`;
const PersonCardHeader = styled.div`
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  .name {
    font-size: 16px;
    font-weight: 700;
    color: #334155;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;
const PersonCardBody = styled.div`
  padding: 24px;
`;
const PersonBadge = styled.span`
  background-color: #64748b;
  color: white;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
`;
const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 12px;
`;
const FormGroup = styled.div`
  display: grid;
  grid-template-columns: 140px minmax(0, 1fr);
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
  label {
    font-size: 15px;
    font-weight: 600;
    color: #475569;
  }
`;
const DatePickerWrapper = styled.div`
  .react-datepicker-wrapper {
    width: 200px;
  }
  .react-datepicker__input-container input {
    box-sizing: border-box;
    padding: 12px 16px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 15px;
    color: #0f172a;
    width: 100%;
    cursor: pointer;
    &:focus {
      outline: none;
      border-color: #3b82f6;
    }
  }
  .sunday-text {
    color: #ef4444 !important;
    font-weight: 600;
  }
  .saturday-text {
    color: #3b82f6 !important;
  }
  .react-datepicker__day--today {
    font-weight: bold;
    background-color: #f1f5f9;
    border-radius: 50%;
  }
  .react-datepicker__day--selected {
    background-color: #3b82f6 !important;
    color: white !important;
    border-radius: 50%;
  }
`;
const NativeSelect = styled.select`
  box-sizing: border-box;
  padding: 12px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 15px;
  color: #0f172a;
  width: 100%;
  max-width: ${(props) => props.$maxWidth || "100%"};
  background-color: white;
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;
const Textarea = styled.textarea`
  box-sizing: border-box;
  padding: 12px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 15px;
  color: #0f172a;
  width: 100%;
  min-height: 80px;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;
const TimeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  span {
    color: #64748b;
    font-weight: 500;
  }
`;
const FixedWorkTypeBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  border: 1px solid ${(props) => (props.$isHoliday ? "#fecaca" : "#cbd5e1")};
  background-color: ${(props) => (props.$isHoliday ? "#fef2f2" : "#f8fafc")};
  color: ${(props) => (props.$isHoliday ? "#dc2626" : "#334155")};
  user-select: none;
  .auto-tag {
    font-size: 11px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 4px;
    background-color: ${(props) => (props.$isHoliday ? "#fee2e2" : "#e2e8f0")};
    color: ${(props) => (props.$isHoliday ? "#b91c1c" : "#475569")};
    margin-left: 4px;
  }
`;
const BreakdownContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;
const Badge = styled.div`
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  ${({ $variant }) => {
    switch ($variant) {
      case "holiday":
        return "background-color: #fef2f2; color: #dc2626; border: 1px solid #fecaca;";
      case "day":
        return "background-color: #f8fafc; color: #334155; border: 1px solid #e2e8f0; font-weight: 600;";
      case "night":
        return "background-color: #1e293b; color: #f8fafc;";
      default:
        return "background-color: #eff6ff; color: #2563eb;";
    }
  }}
`;
const SubmitArea = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 40px;
  padding-bottom: 40px;
`;
const Button = styled.button`
  padding: 14px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  ${(props) =>
    props.$primary
      ? `background-color: #3b82f6; color: white; border: none; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2); &:hover { background-color: #2563eb; }`
      : `background-color: white; color: #475569; border: 1px solid #cbd5e1; &:hover { background-color: #f8fafc; }`}
`;
const InfoBox = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1e3a8a;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  font-size: 14px;
  line-height: 1.5;
`;

const TIME_OPTIONS = (() => {
  const opts = [];
  for (let i = 0; i < 24; i++) {
    const h = String(i).padStart(2, "0");
    opts.push(`${h}:00`, `${h}:30`);
  }
  opts.push("24:00");
  return opts;
})();

export default function ApplyPage() {
  const {
    coworkerList,
    formData,
    holidayInfo,
    isCustomHoliday,
    selectedCoworkers,
    setSelectedCoworkers,
    isEditMode,
    handleApplicantChange,
    handleDateChange,
    handleSubmit,
    handleCancel,
    calculateTimeBreakdown,
  } = useApply();

  const requester = formData.applicants[0];
  const coApplicants = formData.applicants.slice(1);

  const reqBreakdown = calculateTimeBreakdown(
    requester.startTime,
    requester.endTime,
    requester.restTime,
  );

  return (
    <ContentArea>
      <PageHeader>
        <PageTitle>{isEditMode ? "신청서 수정" : "신청서 작성"}</PageTitle>
        <PageDesc>
          일정 및 본인의 근로 정보를 먼저 입력한 후, 동반 근무자가 있다면
          추가해주세요.
        </PageDesc>
      </PageHeader>

      <form onSubmit={handleSubmit}>
        {/* ========================================================
            1. 공통 일자 및 기안자 정보 
        ========================================================= */}
        <FormCard>
          <SectionTitle>
            <CalendarCheck size={18} color="#3b82f6" /> 일정 및 본인(기안자)
            근로 정보
          </SectionTitle>

          {/* 일자 */}
          <FormGroup>
            <label>근무 일자 / 유형</label>
            <TimeWrapper>
              <DatePickerWrapper>
                <DatePicker
                  selected={formData.date}
                  onChange={handleDateChange}
                  dateFormat="yyyy-MM-dd"
                  locale={ko}
                  dayClassName={(date) => {
                    const day = date.getDay();
                    if (day === 0 || isCustomHoliday(date))
                      return "sunday-text";
                    if (day === 6) return "saturday-text";
                    return "";
                  }}
                />
              </DatePickerWrapper>
              <FixedWorkTypeBadge $isHoliday={holidayInfo.isHoliday}>
                {holidayInfo.label}
                <span className="auto-tag">
                  <Lock
                    size={10}
                    style={{ marginRight: "3px", verticalAlign: "middle" }}
                  />
                  자동지정
                </span>
              </FixedWorkTypeBadge>
            </TimeWrapper>
          </FormGroup>

          {/* 기안자 출퇴근 시간 */}
          <FormGroup>
            <label>근로 시간 (본인)</label>
            <TimeWrapper>
              <NativeSelect
                value={requester.startTime}
                onChange={(e) =>
                  handleApplicantChange(
                    requester.id,
                    "startTime",
                    e.target.value,
                  )
                }
                $maxWidth="140px"
              >
                {TIME_OPTIONS.map((time) => (
                  <option key={`start-${time}`} value={time}>
                    {time}
                  </option>
                ))}
              </NativeSelect>
              <span>~</span>
              <NativeSelect
                value={requester.endTime}
                onChange={(e) =>
                  handleApplicantChange(requester.id, "endTime", e.target.value)
                }
                $maxWidth="140px"
              >
                {TIME_OPTIONS.map((time) => (
                  <option key={`end-${time}`} value={time}>
                    {time}
                  </option>
                ))}
              </NativeSelect>
            </TimeWrapper>
          </FormGroup>

          {/* 기안자 휴게 시간 및 계산 결과 */}
          <FormGroup>
            <label>휴게 시간 / 산출</label>
            <TimeWrapper>
              <NativeSelect
                value={requester.restTime}
                onChange={(e) =>
                  handleApplicantChange(
                    requester.id,
                    "restTime",
                    e.target.value,
                  )
                }
                $maxWidth="160px"
              >
                <option value="0">없음 (0분)</option>
                <option value="0.5">30분 (0.5h)</option>
                <option value="1">1시간</option>
                <option value="1.5">1시간 30분</option>
                <option value="2">2시간</option>
              </NativeSelect>

              <BreakdownContainer>
                <Badge $variant={holidayInfo.isHoliday ? "holiday" : "default"}>
                  총 실근로 {reqBreakdown.netHours}시간
                </Badge>
                <Badge $variant="day">
                  <Sun size={14} color="#f59e0b" />
                  주간 {reqBreakdown.dayHours}h
                </Badge>
                {reqBreakdown.nightHours > 0 && (
                  <Badge $variant="night">
                    <Moon size={14} color="#fde047" />
                    심야 {reqBreakdown.nightHours}h
                  </Badge>
                )}
              </BreakdownContainer>
            </TimeWrapper>
          </FormGroup>

          {/* 기안자 사유 */}
          <FormGroup style={{ marginBottom: 0 }}>
            <label style={{ alignSelf: "flex-start", marginTop: "12px" }}>
              근무 사유
            </label>
            <Textarea
              value={requester.reason}
              onChange={(e) =>
                handleApplicantChange(requester.id, "reason", e.target.value)
              }
              placeholder="본인의 연장/휴일근로 사유를 상세히 적어주세요."
              required
            />
          </FormGroup>
        </FormCard>

        {/* ========================================================
            2. 동반 신청자 추가 영역 
        ========================================================= */}
        <FormCard
          style={{ marginBottom: coApplicants.length > 0 ? "24px" : "40px" }}
        >
          <SectionTitle>
            <Users size={18} color="#8b5cf6" /> 동반 신청자 추가 (선택)
          </SectionTitle>
          <FormGroup style={{ marginBottom: 0 }}>
            <label>팀원 검색</label>
            <div style={{ width: "100%", maxWidth: "600px" }}>
              <Select
                isMulti
                name="coworkers"
                options={coworkerList}
                classNamePrefix="select"
                placeholder="함께 근무할 팀원을 검색하여 추가하세요"
                value={selectedCoworkers}
                onChange={setSelectedCoworkers}
                noOptionsMessage={() => "검색된 팀원이 없습니다."}
              />
            </div>
          </FormGroup>
        </FormCard>

        {/* ========================================================
            3. 동반 신청자 개별 폼 
        ========================================================= */}
        {coApplicants.length > 0 && (
          <>
            <InfoBox>
              <Info
                size={20}
                color="#2563eb"
                style={{ flexShrink: 0, marginTop: "2px" }}
              />
              <div>
                <strong>동반 신청자 개별 설정</strong> <br />
                추가된 팀원들의 기본 설정값은{" "}
                <strong>현재 기안자(본인)의 내용과 동일하게 자동 복사</strong>
                되었습니다. <br />
                시간이나 사유가 다른 팀원이 있다면 아래에서 개별적으로 수정해
                주세요.
              </div>
            </InfoBox>

            {coApplicants.map((person, index) => {
              const personBreakdown = calculateTimeBreakdown(
                person.startTime,
                person.endTime,
                person.restTime,
              );

              return (
                <PersonCard key={person.id}>
                  <PersonCardHeader>
                    <div className="name">
                      <User size={18} color="#64748b" />
                      {person.name}
                    </div>
                    <PersonBadge>동반자 {index + 1}</PersonBadge>
                  </PersonCardHeader>

                  <PersonCardBody>
                    <FormGroup>
                      <label>근로 시간</label>
                      <TimeWrapper>
                        <NativeSelect
                          value={person.startTime}
                          onChange={(e) =>
                            handleApplicantChange(
                              person.id,
                              "startTime",
                              e.target.value,
                            )
                          }
                          $maxWidth="140px"
                        >
                          {TIME_OPTIONS.map((time) => (
                            <option key={`start-${time}`} value={time}>
                              {time}
                            </option>
                          ))}
                        </NativeSelect>
                        <span>~</span>
                        <NativeSelect
                          value={person.endTime}
                          onChange={(e) =>
                            handleApplicantChange(
                              person.id,
                              "endTime",
                              e.target.value,
                            )
                          }
                          $maxWidth="140px"
                        >
                          {TIME_OPTIONS.map((time) => (
                            <option key={`end-${time}`} value={time}>
                              {time}
                            </option>
                          ))}
                        </NativeSelect>
                      </TimeWrapper>
                    </FormGroup>

                    <FormGroup>
                      <label>휴게 시간 / 산출</label>
                      <TimeWrapper>
                        <NativeSelect
                          value={person.restTime}
                          onChange={(e) =>
                            handleApplicantChange(
                              person.id,
                              "restTime",
                              e.target.value,
                            )
                          }
                          $maxWidth="160px"
                        >
                          <option value="0">없음 (0분)</option>
                          <option value="0.5">30분 (0.5h)</option>
                          <option value="1">1시간</option>
                          <option value="1.5">1시간 30분</option>
                          <option value="2">2시간</option>
                        </NativeSelect>

                        <BreakdownContainer>
                          <Badge
                            $variant={
                              holidayInfo.isHoliday ? "holiday" : "default"
                            }
                          >
                            총 실근로 {personBreakdown.netHours}시간
                          </Badge>
                          <Badge $variant="day">
                            <Sun size={14} color="#f59e0b" />
                            주간 {personBreakdown.dayHours}h
                          </Badge>
                          {personBreakdown.nightHours > 0 && (
                            <Badge $variant="night">
                              <Moon size={14} color="#fde047" />
                              심야 {personBreakdown.nightHours}h
                            </Badge>
                          )}
                        </BreakdownContainer>
                      </TimeWrapper>
                    </FormGroup>

                    <FormGroup style={{ marginBottom: 0 }}>
                      <label
                        style={{ alignSelf: "flex-start", marginTop: "12px" }}
                      >
                        근무 사유
                      </label>
                      <Textarea
                        value={person.reason}
                        onChange={(e) =>
                          handleApplicantChange(
                            person.id,
                            "reason",
                            e.target.value,
                          )
                        }
                        placeholder="해당 팀원의 연장/휴일근로 사유를 상세히 적어주세요."
                        required
                      />
                    </FormGroup>
                  </PersonCardBody>
                </PersonCard>
              );
            })}
          </>
        )}

        <SubmitArea>
          <Button type="button" onClick={handleCancel}>
            취소
          </Button>
          <Button type="submit" $primary>
            {isEditMode ? "수정하여 상신하기" : "결재 상신하기"}
          </Button>
        </SubmitArea>
      </form>
    </ContentArea>
  );
}
