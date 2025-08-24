import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import ListIcon from "../assets/calendar/list.svg?react";
import PreviousIcon from "../assets/calendar/previousmonth.svg?react";
import NextIcon from "../assets/calendar/nextmonth.svg?react";
import Line2Icon from "../assets/calendar/line2.svg?react";
import PlusIcon from "../assets/calendar/plus.svg?react";
import Modal from "../components/modal/Modal";
import NavLayout from "../components/layouts/NavLayout";
import Consumption from "../components/calendar/Consumption";
import { useMonthlyConsumptionsSummary } from "../hooks/consumption/useConsumptions";
import { useGoals } from "../hooks/goal/useGoal";

// YYYY-MM-DD ↔ Date (LOCAL, not UTC)
function parseLocalYmd(ymd) {
  if (!ymd) return null;
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(y, m - 1, d);
}
 
export default function CalendarPage() {
  const [tab, setTab] = useState("goal"); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(7); // 0=1월 → 7=8월
  const [currentYear, setCurrentYear] = useState(2025);

  const monthStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`;
  const { data: monthlySummaryData } = useMonthlyConsumptionsSummary(selectedGoalId, monthStr);
  const summaryList = monthlySummaryData?.summary ?? [];
  const summaryMap = useMemo(() => {
    const obj = {};
    for (const item of summaryList) {
      if (item && item.date) obj[item.date] = item.price ?? 0;
    }
    return obj;
  }, [summaryList]);

  const navigate = useNavigate();

  // 목표 목록 API 연동
  const { data: goalsResp } = useGoals();
  const goals = useMemo(() => {
    if (!Array.isArray(goalsResp)) return [];
    return goalsResp.map((g) => ({
      id: g.goalId,
      title: g.purpose ?? '',
      amount: g.purposeBudget ?? 0,
      startDate: g.startDate,
      endDate: g.endDate,
    }));
  }, [goalsResp]);

  // 초기 선택 목표 설정: 첫 번째 목표
  React.useEffect(() => {
    if (selectedGoalId == null && goals.length > 0) {
      setSelectedGoalId(goals[0].id);
    }
  }, [goals, selectedGoalId]);

  const selectedGoal = goals.find((g) => g.id === selectedGoalId);

  // 월 총지출 (API 요약 합계)
  const monthTotal = summaryList.reduce((sum, it) => sum + (it?.price ?? 0), 0);

  // 목표 기간 내(해당 달에 한정) 총지출
  const goalStart = selectedGoal ? parseLocalYmd(selectedGoal.startDate) : null;
  const goalEnd = selectedGoal ? parseLocalYmd(selectedGoal.endDate) : null;
  const goalPeriodTotal = selectedGoal
    ? summaryList.reduce((sum, it) => {
        if (!it?.date) return sum;
        const d = parseLocalYmd(it.date);
        return d >= goalStart && d <= goalEnd ? sum + (it.price ?? 0) : sum;
      }, 0)
    : 0;

  // 화면 상단에 표시할 총액: 목표 탭은 목표기간 합, 월별 탭은 월 합
  const totalSpending = tab === "goal" ? goalPeriodTotal : monthTotal;
  const result = selectedGoal ? selectedGoal.amount - goalPeriodTotal : 0;

  // 캘린더 정보
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  return (
    <NavLayout currentPage="ledger">
    <div className="w-full bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center px-4 py-3">
        <h1 className="cal-title-font">캘린더</h1>
      </header>

      {/* Tabs */}
      <div className="w-full flex">
        <button
          className={`flex-1 py-3 text-base ${
            tab === "goal"
              ? "cal-selected-font border-b-[2px] border-[#074E42] bg-white"
              : "cal-none-selected-font bg-[#F1F1F5] border-b-0"
          }`}
          onClick={() => setTab("goal")}
        >
          목표 내 소비
        </button>
        <button
          className={`flex-1 py-3 text-base ${
            tab === "month"
              ? "cal-selected-font border-b-[2px] border-[#074E42] bg-white"
              : "cal-none-selected-font bg-[#F1F1F5] border-b-0"
          }`}
          onClick={() => setTab("month")}
        >
          월별 소비
        </button>
      </div>

      {/* 목표 부분 */}
      {tab === "goal" && (
        <div className="flex items-center justify-between w-full h-[76px] py-3 bg-[#F3F7FB] px-4">
          {selectedGoal ? (
            <>
              <div className="flex flex-row items-center justify-between flex-1 gap-4 rounded-[16px] border border-[#5ACBB0] bg-white px-4 py-3">
                <p className="cal-goal-title-font">[{selectedGoal.title}]</p>
                <p className="cal-goal-price-font">
                  지출 목표{" "}
                  <span className="cal-goal-money-font">
                    {selectedGoal.amount.toLocaleString()}원
                  </span>
                </p>
              </div>
              <button
                className="flex p-[10px] items-center justify-center rounded-[16px] border border-[#5ACBB0] bg-white ml-2"
                onClick={() => setIsModalOpen(true)}
              >
                <ListIcon className="w-6 h-6 text-[#5ACBB0]" />
              </button>
            </>
          ) : (
            <div className="flex flex-row items-center justify-between flex-1 gap-4 rounded-[16px] border border-[#DDE2E7] bg-white px-4 py-3">
              <p className="cal-goal-title-font text-[#7A828A]">목표를 선택하세요</p>
              <button
                className="flex p-[10px] items-center justify-center rounded-[16px] border border-[#5ACBB0] bg-white"
                onClick={() => setIsModalOpen(true)}
              >
                <ListIcon className="w-6 h-6 text-[#5ACBB0]" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ===== 스크롤 가능 영역 ===== */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* 캘린더 상단 총 지출, 결과 부분 */}
        <div className="w-full py-3 pb-0">
          {tab === "goal" ? (
            <div className="flex w-full justify-between items-center bg-white rounded-t-[24px] px-4 py-3 ">
              <p className="cal-total-use-font flex items-center">
                총 지출
                <span className="cal-total-use-price-font ml-4">
                  {totalSpending.toLocaleString()}원
                </span>
              </p>
              <p className="cal-total-use-font flex items-center">
                잔액{" "}
                <span
                  className={`ml-4 ${
                    result < 0
                      ? "cal-price-result-font"
                      : "cal-price-plus-result-font"
                  }`}
                >
                  {result.toLocaleString()}원
                </span>
              </p>
            </div>
          ) : (
            <div className="flex justify-between items-center bg-white rounded-t-2xl px-4 py-3 shadow">
              <p className="cal-monthly-total-use-font">총 지출</p>
              <span className="cal-total-use-price-font">
                {totalSpending.toLocaleString()}원
              </span>
            </div>
          )}
        </div>

        {/* 캘린더 섹션 */}
        <div className="w-full bg-white py-3">
          {/* 상단 월 이동 버튼 */}
          <div className="flex items-center justify-center px-2 mb-3">
            <button
              onClick={() =>
                setCurrentMonth((prev) =>
                  prev === 0
                    ? (setCurrentYear(currentYear - 1), 11)
                    : prev - 1
                )
              }
            >
              <PreviousIcon className="w-5 h-5" />
            </button>
            <h2 className="cal-year-month-font px-2">
              {currentYear}년 {currentMonth + 1}월
            </h2>
            <button
              onClick={() =>
                setCurrentMonth((prev) =>
                  prev === 11
                    ? (setCurrentYear(currentYear + 1), 0)
                    : prev + 1
                )
              }
            >
              <NextIcon className="w-5 h-5" />
            </button>
          </div>
          
          {/* 요일 */}
          <div className="grid grid-cols-7 text-center mb-2">
            <div className="cal-sun-font">일</div>
            <div className="cal-week-font">월</div>
            <div className="cal-week-font">화</div>
            <div className="cal-week-font">수</div>
            <div className="cal-week-font">목</div>
            <div className="cal-week-font">금</div>
            <div className="cal-sat-font">토</div>
          </div>

          <div className="border w-full border-[#DDE2E7] scale-y-50"></div>
          <div className="w-full bg-bg-blue">
            {/* 날짜 */}
            <div className="grid grid-cols-7 cal-date-font gap-0">
              {Array.from({ length: firstDay }).map((_, i) => {
                const prevDay =
                  new Date(currentYear, currentMonth, 0).getDate() -
                  (firstDay - 1) +
                  i;
                const prevDate = new Date(currentYear, currentMonth - 1, prevDay);
                return (
                  <div
                    key={`prev-${i}`}
                    className="flex flex-col justify-start items-center w-full h-[56px] bg-[#F3F7FB]"
                  >
                    <span className="cal-not-in-date-font">{prevDay}</span>
                  </div>
                );
              })}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateKey = `${currentYear}-${String(
                  currentMonth + 1
                ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const currentDate = new Date(currentYear, currentMonth, day);
                const priceForDay = summaryMap[dateKey] ?? 0;
                const isSelected = selectedDate === day;
                const isInGoalPeriod = goalStart && goalEnd ? (currentDate >= goalStart && currentDate <= goalEnd) : false;
                const spending = tab === "goal" ? (isInGoalPeriod ? priceForDay : 0) : priceForDay;

                return (
                  <div
                    key={i}
                    className={`flex flex-col justify-start items-center w-full h-[56px]
                      ${isSelected ? "bg-gradient-to-t from-[#5ACBB0] to-[#03FFDA]" : ""}
                      ${tab === "goal"
                          ? !isSelected && (isInGoalPeriod ? "bg-white" : "bg-[#F3F7FB]")
                          : "bg-white"
                      }
                      cursor-pointer`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <span
                      className={
                        isSelected
                          ? "cal-selected-date-font"
                          : tab === "goal"
                          ? isInGoalPeriod
                            ? "cal-date-font"
                            : "cal-not-in-date-font"
                          : "cal-date-font"
                      }
                    >
                      {day}
                    </span>
                    {spending > 0 && (
                      <span
                        className={
                          isSelected
                            ? "cal-selected-price-font"
                            : "text-[10px] text-[#28BFA1] mt-1"
                        }
                      >
                        {spending.toLocaleString()}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 선택된 날짜 소비 내역 */}
        {selectedDate && (
          <div className="p-4 bg-[#F3F7FB]">
            <div className="flex justify-between items-center pb-4">
              <div className="flex items-center gap-2">
                <Line2Icon className="stroke-[1px] stroke-[#A6AEB6]" />
                <span className="cal-use-money-date-font">
                  {currentYear - 2000}.
                  {String(currentMonth + 1).padStart(2, "0")}.
                  {String(selectedDate).padStart(2, "0")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <p className="cal-use-money-subtitle-font">일 지출 총액</p>
                <p className="cal-use-money-price-font">
                  {(
                    summaryMap[
                      `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`
                    ] ?? 0
                  ).toLocaleString()}
                  원
                </p>
              </div>
            </div>

            {/* 소비 내역 */}
            <Consumption
              goalId={selectedGoalId}
              date={`${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`}
            />
          </div>
        )}
      </div>
      {/* 모달로 목표 변경 선택 */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} height={500}>
        <div className="px-4">
          <h2 className="cal-choose-goal-font text-center mb-4">목표 선택하기</h2>
          {goals.map((g) => (
            <div
              key={g.id}
              className={`cursor-pointer p-3 rounded-lg mb-3 border flex justify-between items-center ${
                g.id === selectedGoalId
                  ? "border-[#5ACBB0] bg-white"
                  : "border-[#DDE2E7] bg-white"
              }`}
              onClick={() => {
                setSelectedGoalId(g.id);
                setIsModalOpen(false);
              }}
            >
              <div>
                <p className="cal-modal-goal-name-font">[{g.title}]</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="bg-[#CAF6EC] px-1 rounded cal-modal-time-font">
                    {g.startDate.slice(2).replace(/-/g, ".")}
                  </span>
                  <span className="cal-goal-wave-font">~</span>
                  <span className="bg-[#CAF6EC] px-1 rounded cal-modal-time-font">
                    {g.endDate.slice(2).replace(/-/g, ".")}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="cal-modal-goal-title-font">목표 지출액</p>
                <p className="cal-modal-goal-money-font">
                  {g.amount.toLocaleString()}원
                </p>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
    </NavLayout>
  );
}
