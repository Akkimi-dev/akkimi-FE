import Dot from "../../assets/home/dot.svg?react";
import Grape1 from "../../assets/home/grape/grape-1.png";
import Grape2 from "../../assets/home/grape/grape-2.png";
import Grape3 from "../../assets/home/grape/grape-3.png";
import Grape4 from "../../assets/home/grape/grape-4.png";
import Grape5 from "../../assets/home/grape/grape-5.png";
import Grape6 from "../../assets/home/grape/grape-6.png";
import Grape7 from "../../assets/home/grape/grape-7.png";
import Grape8 from "../../assets/home/grape/grape-8.png";
import Grape9 from "../../assets/home/grape/grape-9.png";
import Grape10 from "../../assets/home/grape/grape-10.png";

const grapeBackgrounds = {
  1: Grape1,
  2: Grape2,
  3: Grape3,
  4: Grape4,
  5: Grape5,
  6: Grape6,
  7: Grape7,
  8: Grape8,
  9: Grape9,
  10: Grape10,
};

export default function Grape({goal, date, usedBudget, goalBudget}){
  const level = Math.min(10, Math.ceil((usedBudget / goalBudget) * 10));
  console.log(level)
  const GrapeBg = grapeBackgrounds[level] || Grape1;

  return(
    <div className="w-full h-[240px] relative p-4 flex flex-col justify-between bg-white">
      <div className="absolute inset-0">
        <img src={GrapeBg} alt={`grape-${level}`} className="w-full h-full object-fill" />
      </div>
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="flex flex-col gap-4">
          <div className="w-fit px-4 py-2 rounded-[30px] flex justify-center items-center gap-2 bg-white border border-green-main">
            <Dot/>
            <span className="text-body-02-regular text-gray-100 !leading-[100%] ">{goal}</span>
            <span className="text-body-02-Semibold text-green-main-dark !leading-[100%]">D-{date}</span>
          </div>
          <div>
            <p className="text-heading-01-regular text-green-main"><span className="text-heading-01-bold text-green-main">{date}일</span> 동안 쓸 수 있는 예산은</p>
            <p className="text-heading-01-regular text-green-main"><span className="text-heading-01-bold text-green-main">{goalBudget - usedBudget}원</span>이예요!</p>
          </div>
        </div>
        <div className="w-full flex justify-end border-r pr-2 border-green-main">
          <div className="flex flex-col items-end justify-center">
            <span className="text-green-main text-detail-02-regular leading-[120%]">잔액</span>
            <div className="flex items-center">
              <span className="text-detail-02-regular leading-[120%] text-gray-40 ">{goalBudget}/</span>
              <span className="text-green-main text-detail-02-regular leading-[120%]">{goalBudget - usedBudget}</span>
            </div>
          </div>  
        </div>
      </div>
    </div>
  )
}