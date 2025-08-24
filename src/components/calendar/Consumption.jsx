import { useState, useMemo } from "react";
import { useDailyConsumptions } from "../../hooks/consumption/useConsumptions";
import Plus from "../../assets/home/plus.svg?react";
import ConsumptionList from "../consumption/ConsumptionList";
import MessageModal from "../consumption/MessageModal";
import { useNavigate } from "react-router-dom";

export default function Consumption({ goalId, date }) {
  const [selectedItemId, setSelectedItemId] = useState(null);
  const navigate = useNavigate();

  // 일간 소비 내역 API 연동
  const { data: dailyList } = useDailyConsumptions(goalId, date);

  // API → UI 모델 매핑
  const consumptionList = useMemo(() => {
    if (!Array.isArray(dailyList)) return [];
    return dailyList.map((d) => ({
      id: d.consumptionId,
      category: d.category,
      consumptionName: d.itemName,
      feedback: d.feedback,
      price: d.amount,
    }));
  }, [dailyList]);

  // 선택된 아이템 객체 추출
  const selectedItem = useMemo(() => {
    if (!selectedItemId) return null;
    return consumptionList.find((it) => it.id === selectedItemId) || null;
  }, [selectedItemId, consumptionList]);

  const handleCreateClick = () => {
    const path = `/consumption/create/${goalId}?date=${date}`;
    console.log('[Consumption] navigate ->', path, { goalId, date });
    navigate(path);
  };
  return (
    <div className="flex flex-col gap-4 ">
      <ConsumptionList
        consumptionList={consumptionList}
        onOpenModal={(item) => setSelectedItemId(item.id)}
      />
      {selectedItemId && (
         <MessageModal
          message={selectedItem.feedback.feedback ?? '피드백이 없습니다.'}
          onClose={() => setSelectedItemId(null)}
        />
      )}
      <button
        onClick={handleCreateClick}
        className="px-4 py-6 flex justify-between bg-white border border-green-main-dark-2 rounded-2xl"
      >
        <span>소비 내역 작성하기</span>
        <Plus />
      </button>
    </div>
  );
}