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
      price: d.amount,
    }));
  }, [dailyList]);

  return (
    <div className="flex flex-col gap-4 ">
      <ConsumptionList
        consumptionList={consumptionList}
        onOpenModal={(item) => setSelectedItemId(item.id)}
      />
      {selectedItemId && (
        <MessageModal
          message={` 20,000원짜리 돈까스..? 정말 최선이었어? 나 약간 실망했어. 더 합리적인 소비 할 수 있었잖아. 그래도.. `}
          onClose={() => setSelectedItemId(null)}
        />
      )}
      <button
        onClick={() => navigate(`/consumption/create?date=${date}`)}
        className="px-4 py-6 flex justify-between bg-white border border-green-main-dark-2 rounded-2xl"
      >
        <span>소비 내역 작성하기</span>
        <Plus />
      </button>
    </div>
  );
}