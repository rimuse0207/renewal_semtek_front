import { ChevronRight } from "lucide-react";
import React from "react";
import styled from "styled-components";
import { SectionTitle } from "../MainHome";
import moment from "moment";
import "moment/locale/ko";

const FILTERS = ["전체", "결재대기", "승인완료", "반려"];

const TableBody = ({
  activeFilter,
  setActiveFilter,
  filteredApps,
  openModal,
}) => {
  return (
    <>
      <ListHeader>
        <SectionTitle>상세 신청 내역</SectionTitle>
        <FilterGroup>
          {FILTERS.map((filter) => (
            <FilterChip
              key={filter}
              $active={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </FilterChip>
          ))}
        </FilterGroup>
      </ListHeader>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>신청일자</Th>
              <Th>시간</Th>
              <Th>사유</Th>
              <Th>대상자</Th>
              <Th>상태</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.length > 0 ? (
              filteredApps.map((app) => (
                <Tr key={app.id} onClick={() => openModal(app)}>
                  <Td style={{ fontWeight: "500" }}>
                    {moment(app.date).format("YYYY-MM-DD (dd)")}
                  </Td>
                  <Td>{app.time}</Td>
                  <Td>{app.reason}</Td>
                  <Td>{app.team}</Td>
                  <Td>
                    <StatusBadge $status={app.status}>{app.status}</StatusBadge>
                  </Td>
                  <Td style={{ textAlign: "right", color: "#94a3b8" }}>
                    <ChevronRight size={20} />
                  </Td>
                </Tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">
                  <EmptyState>조건에 맞는 신청 내역이 없습니다.</EmptyState>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default TableBody;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 8px;
`;
const FilterChip = styled.button`
  background-color: ${(props) => (props.$active ? "#0f172a" : "#ffffff")};
  color: ${(props) => (props.$active ? "#ffffff" : "#64748b")};
  border: 1px solid ${(props) => (props.$active ? "#0f172a" : "#e2e8f0")};
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background-color: ${(props) => (props.$active ? "#0f172a" : "#f8fafc")};
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
  color: #64748b;
  font-weight: 500;
  font-size: 14px;
  border-bottom: 1px solid #e2e8f0;
`;
const Td = styled.td`
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
  color: #334155;
  font-size: 15px;
  vertical-align: middle;
`;
const Tr = styled.tr`
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #f1f5f9;
  }
`;
const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  ${({ $status }) => {
    switch ($status) {
      case "승인완료":
        return "background-color: #dcfce7; color: #166534;";
      case "결재대기":
        return "background-color: #fef9c3; color: #854d0e;";
      case "반려":
        return "background-color: #fee2e2; color: #991b1b;";
      default:
        return "background-color: #f1f5f9; color: #475569;";
    }
  }}
`;
const EmptyState = styled.div`
  padding: 48px;
  text-align: center;
  color: #94a3b8;
  font-size: 15px;
`;
