import React from "react";
import styled from "styled-components";
import { useDashboard } from "../../hooks/useDashboard";
import PrintableDetailModal from "./PrintableDetailModal";
import Header from "./Header/Header";
import Card from "./Header/Card";
import Table from "./Body/Table";
import Calendar from "./Body/Calendar";

// --- Styled Components ---
const ContentArea = styled.div`
  flex: 1;
  padding: 0px 24px;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  box-sizing: border-box;
`;

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export default function MainDashboard() {
  const {
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
  } = useDashboard();

  return (
    <>
      <ContentArea>
        <Header
          currentDate={currentDate}
          handlePrevMonth={handlePrevMonth}
          handleNextMonth={handleNextMonth}
        ></Header>

        <Card stats={stats} />

        <Table
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          filteredApps={filteredApps}
          openModal={openModal}
        ></Table>

        <SectionTitle style={{ marginBottom: "16px" }}>
          월간 시각화
        </SectionTitle>
        <Calendar calendarDays={calendarDays} openModal={openModal}></Calendar>
      </ContentArea>

      <PrintableDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        data={selectedApp}
        onEdit={handleEdit}
      />
    </>
  );
}
