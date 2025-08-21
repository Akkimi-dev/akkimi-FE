import React, { useState } from "react";
import CalIcon from "../assets/goal/calendar.svg?react";
import PreviousIcon from "../assets/calendar/previousmonth.svg?react";
import NextIcon from "../assets/calendar/nextmonth.svg?react";

export default function GoalPeriod({ startDate, endDate, onChange, onSave }) {
  const [showCalendar, setShowCalendar] = useState(false);

  const [currentYear, setCurrentYear] = useState(2025);
  const [currentMonth, setCurrentMonth] = useState(7); // 0=1월 → 7=8월

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const handleDateClick = (day) => {
    const clicked = new Date(currentYear, currentMonth, day);

    if (!startDate || (startDate && endDate)) {
      // 시작일이 없거나, 이미 시작/종료가 모두 선택된 상태면 시작일만 다시 설정
      if (onChange) onChange(clicked, null);
    } else if (!endDate) {
      // 종료일이 아직 없고, 클릭한 날짜가 시작일 이후라면 종료일 설정
      if (clicked >= startDate) {
        if (onChange) onChange(startDate, clicked);
      } else {
        // 시작일보다 이전을 클릭한 경우: 시작일을 다시 선택
        if (onChange) onChange(clicked, null);
      }
    }
  };

  const isBetween = (day) => {
    if (!startDate || !endDate) return false;
    const d = new Date(currentYear, currentMonth, day);
    return d > startDate && d < endDate;
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  return (
    <div>
      <label className="text-sm goal-subtitle-font">목표 기간</label>
      <div className="flex items-center justify-between border-b py-2">
        <span className="flex-1 text-center goal-input-font">
          {startDate ? startDate.toLocaleDateString("ko-KR") : ""}
        </span>
        <span className="mx-2">~</span>
        <span className="flex-1 text-center goal-input-font">
          {endDate ? endDate.toLocaleDateString("ko-KR") : ""}
        </span>

        <button
          onClick={() => setShowCalendar(true)}
          className="px-2 py-1 border-0 rounded text-sm"
        >
          <CalIcon className="w-4 h-4" />
        </button>
      </div>

      {/* 모달 */}
      {showCalendar && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-5 rounded-xl shadow-xl w-[350px]">
            {/* 달력 헤더 */}
            <div className="flex justify-between items-center mb-2">
              <button
                onClick={() => {
                  if (currentMonth === 0) {
                    setCurrentMonth(11);
                    setCurrentYear(currentYear - 1);
                  } else {
                    setCurrentMonth(currentMonth - 1);
                  }
                }}
                className="px-2"
              >
                <PreviousIcon />
              </button>

              <h2 className="text-center goal-cal-title">
                {currentYear}년 {currentMonth + 1}월
              </h2>

              <button
                onClick={() => {
                  if (currentMonth === 11) {
                    setCurrentMonth(0);
                    setCurrentYear(currentYear + 1);
                  } else {
                    setCurrentMonth(currentMonth + 1);
                  }
                }}
                className="px-2"
              >
                <NextIcon />
              </button>
            </div>

            {/* 선택된 시작/종료일 표시 */}
            <div className="flex justify-between mb-3">
              <span className="goal-modal-date">
                시작일: {formatDate(startDate)}
              </span>
              <span className="goal-modal-date">
                종료일: {formatDate(endDate)}
              </span>
            </div>

            {/* 요일 */}
            <div className="grid grid-cols-7 text-center text-sm mb-2">
              <div className="text-red-400">일</div>
              <div>월</div>
              <div>화</div>
              <div>수</div>
              <div>목</div>
              <div>금</div>
              <div className="text-blue-400">토</div>
            </div>

            {/* 날짜 */}
            <div className="grid grid-cols-7 text-center gap-0">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const d = new Date(currentYear, currentMonth, day);
                const isStart =
                  startDate && d.getTime() === startDate.getTime();
                const isEnd = endDate && d.getTime() === endDate.getTime();

                return (
                  <div
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`h-10 flex items-center justify-center cursor-pointer goal-cal-date
                      ${
                        isStart || isEnd
                          ? "goal-start-date bg-gradient-to-t from-[#5ACBB0] to-[#03FFDA]"
                          : ""
                      }
                      ${isBetween(day) ? "goal-cal-date bg-[#CAF6EC]" : ""}
                    `}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            {/* 버튼 */}
            <div className="flex justify-end mt-4">
              <button
                className={`px-4 py-2 rounded-[4px] goal-delete-font ${
                  startDate && endDate
                    ? "bg-[#CAF6EC] goal-saved-font"
                    : "bg-[#DDE2E7] goal-not-saved-font cursor-not-allowed"
                }`}
                disabled={!startDate || !endDate}
                onClick={() => {
                  if (onSave) onSave(startDate, endDate); // ✅ 부모에 값 전달
                  setShowCalendar(false); // ✅ 모달 닫기
                }}
              >
                저장 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
