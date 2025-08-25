import { useMemo } from "react";
import { useDailyConsumptions } from "../../hooks/consumption/useConsumptions";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Plus from "../../assets/home/plus.svg?react";
import ConsumptionList from "../consumption/ConsumptionList";
import MessageModal from "../consumption/MessageModal";

export default function Consumption({goalId, date}) {
  const [selectedItemId, setSelectedItemId] = useState(null);
  const navigate = useNavigate();

  // 일간 소비 내역 API 연동
  const { data: dailyList } = useDailyConsumptions(goalId, date);

  // API → UI 모델 매핑 
  // 메모로 선택된 아이디가 바꿔도 리렌더 최소화
  const consumptionList = useMemo(() => {
    if (!Array.isArray(dailyList)) return [];
    return dailyList.map((d) => ({
      id: d.consumptionId,
      category: d.category,
      consumptionName: d.itemName,
      price: d.amount,
      feedback: d.feedback,
    }));
  }, [dailyList]);

  // 선택된 아이템 객체 추출
  const selectedItem = useMemo(() => {
    if (!selectedItemId) return null;
    return consumptionList.find((it) => it.id === selectedItemId) || null;
  }, [selectedItemId, consumptionList]);

  return (
    <div className="p-4 flex flex-col gap-4 ">
      <span className="text-body-01-semibold text-gray-100">오늘 내 소비</span>
      <button
       onClick={() => navigate(`/consumption/create/${goalId}?date=${date}`)}
        className="cursor-pointer px-4 py-6 flex justify-between bg-white border border-green-main-dark-2 rounded-2xl"
      >
        <span>소비 내역 작성하기</span>
        <Plus />
      </button>
      <ConsumptionList
        goalId={goalId}
        consumptionList={consumptionList}
        onOpenModal={(item) => setSelectedItemId(item.id)}
      />
      {selectedItem && (
        <MessageModal
          message={selectedItem.feedback.feedback ?? '피드백이 없습니다.'}
          onClose={() => setSelectedItemId(null)}
        />
      )}
    </div>
  );
}