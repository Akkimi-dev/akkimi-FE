import { useState } from "react";
import DownArrow from "../../assets/consumption/downArrow.svg?react";
import ConsumptionItem from "./consumptionItem";

export default function ConsumptionList({consumptionList, onOpenModal}){
  const [visibleCount, setVisibleCount] = useState(3);

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 3);
  };

  const visibleList = consumptionList.slice(0, visibleCount);

  return(
  <div className="flex flex-col gap-1">
    <ul className="flex flex-col rounded-2xl bg-white divide-y divide-gray-20">
      {visibleList.map((item) => (
        <ConsumptionItem
          key={item.id}
          goalId = {item.goalId}
          id={item.id}
          category={item.category}
          time={item.time}
          consumptionName={item.consumptionName}
          price={item.price}
          onClick={() => onOpenModal(item)}
        />
      ))}
    </ul>
    {visibleCount < consumptionList.length && (
      <button className="w-full px-4 py-2 flex items-center justify-center bg-white rounded-[8px] border border-gray-20" onClick={handleShowMore}>
        <span className="text-body-02-regular text-gray-100">더보기</span>
        <DownArrow/>
      </button>
    )}
  </div>
)}