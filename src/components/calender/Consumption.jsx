const mockConsumptionList = [
  { id: 1, category: "식비", time: "12:30", consumptionName: "점심 식사", price: 8000 },
  { id: 2, category: "교통", time: "13:00", consumptionName: "지하철", price: 1250 },
  { id: 3, category: "카페", time: "15:00", consumptionName: "아메리카노", price: 4500 },
  { id: 4, category: "쇼핑", time: "18:00", consumptionName: "티셔츠", price: 25000 },
  { id: 5, category: "기타", time: "20:00", consumptionName: "편의점", price: 3000 },
  { id: 6, category: "식비", time: "12:30", consumptionName: "점심 식사", price: 8000 },
  { id: 7, category: "교통", time: "13:00", consumptionName: "지하철", price: 1250 },
  { id: 8, category: "카페", time: "15:00", consumptionName: "아메리카노", price: 4500 },
  { id: 9, category: "쇼핑", time: "18:00", consumptionName: "티셔츠", price: 25000 },
  { id: 10, category: "기타", time: "20:00", consumptionName: "편의점", price: 3000 },
];

import { useState } from "react";
import Plus from "../../assets/home/plus.svg?react";
import ConsumptionList from "../consumption/ConsumptionList";
import MessageModal from "../consumption/MessageModal";
import { useNavigate } from "react-router-dom";

export default function Consumption({date}) {
  const [selectedItemId, setSelectedItemId] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 ">
      <ConsumptionList
        consumptionList={mockConsumptionList}
        onOpenModal={(item) => setSelectedItemId(item.id)}
      />
      {selectedItemId && (
        <MessageModal
          message={` 20,000원짜리 돈까스..? 정말 최선이었어? 나 약간 실망했어. 더 합리적인 소비 할 수 있었잖아. 그래도.. `}
          onClose={() => setSelectedItemId(null)}
        />
      )}
      <button
        onClick={() => navigate(`consumption-create?date=${date}`)}
        className="px-4 py-6 flex justify-between bg-white border border-green-main-dark-2 rounded-2xl"
      >
        <span>소비 내역 작성하기</span>
        <Plus />
      </button>
    </div>
  );
}