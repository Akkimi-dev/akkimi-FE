import Pen from "../../assets/home/pen.svg?react";

export default function Goal({goal, startDate, endDate, goalBudget = 10000}){
  return(
    <div className="w-full flex flex-col gap-4">
      <div className="w-full rounded-[16px] border border-green-main-dark-2 flex justify-between items-end px-4 pt-2 pb-3">
        <div className="flex flex-col gap-2">
          <span className="text-body-02-semibold">{`[${goal}]`}</span>
          <div>
            <span className="bg-green text-gray-80 text-detail-01-regular rounded-[5px] px-[2px]">{startDate}</span>
            <span className="text-gray-100 text-detail-01-regular">~</span>
            <span className="bg-green text-gray-80 text-detail-01-regular rounded-[5px] px-[2px]">{endDate}</span>
          </div>
        </div> 
        <div className="flex flex-col items-end gap-1">
            <span className="text-detail-02-regular text-gray-80">목표 지출액</span>
            <span className="text-body-02-semibold text-gray-100">{goalBudget}원</span>
        </div>
      </div>
    </div>
  )
}