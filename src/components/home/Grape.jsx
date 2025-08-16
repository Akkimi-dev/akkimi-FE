import Dot from "../../assets/home/dot.svg?react";

export default function Grape({goal, date, usedBudget, goalBudget}){
  return(
    <div className="w-full h-[240px] bg-gradient-to-b from-white to-green p-4 flex flex-col justify-between">
      <div className="w-fit px-4 py-2 rounded-[30px] flex justify-center items-center gap-2 bg-white border border-green-main flex items-center">
        <Dot/>
        <span className="text-body-02-regular text-gray-100 !leading-[100%] ">{goal}</span>
        <span className="text-body-02-Semibold text-green-main-dark !leading-[100%]">D-{date}</span>
      </div>
      <div className="w-full flex justify-end border-r pr-2 border-green-main">
        <div className="flex flex-col items-end justify-center">
          <span className="text-green-main text-detail-02-regular leading-[120%]">지출</span>
          <div className="flex items-center"><span className="text-detail-02-regular leading-[120%] text-gray-40 ">{usedBudget}/</span><span className="text-green-main text-detail-02-regular leading-[120%]">{goalBudget}</span></div>
        </div>  
      </div>
    </div>
  )
}