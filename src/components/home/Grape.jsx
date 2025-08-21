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
  1: Grape10,
  2: Grape9,
  3: Grape8,
  4: Grape7,
  5: Grape6,
  6: Grape5,
  7: Grape4,
  8: Grape3,
  9: Grape2,
  10: Grape1,
};

export default function Grape({goal, date, usedBudget, goalBudget}){
  const level = Math.min(10, Math.ceil((usedBudget / goalBudget) * 10));
  const GrapeBg = grapeBackgrounds[level] || Grape1;

  return(
    <div className="w-full h-[240px] relative p-4 flex flex-col justify-between bg-white">
      <div className="absolute inset-0">
        <img src={GrapeBg} alt={`grape-${level}`} className="w-full h-full object-fill" />
      </div>
      <div className="relative z-10 flex flex-col justify-between h-full p-4">
        <div className="w-fit px-4 py-2 rounded-[30px] flex justify-center items-center gap-2 bg-white border border-green-main">
          <Dot/>
          <span className="text-body-02-regular text-gray-100 !leading-[100%] ">{goal}</span>
          <span className="text-body-02-Semibold text-green-main-dark !leading-[100%]">D-{date}</span>
        </div>
        <div className="w-full flex justify-end border-r pr-2 border-green-main">
          <div className="flex flex-col items-end justify-center">
            <span className="text-green-main text-detail-02-regular leading-[120%]">지출</span>
            <div className="flex items-center">
              <span className="text-detail-02-regular leading-[120%] text-gray-40 ">{usedBudget}/</span>
              <span className="text-green-main text-detail-02-regular leading-[120%]">{goalBudget}</span>
            </div>
          </div>  
        </div>
      </div>
    </div>
  )
}