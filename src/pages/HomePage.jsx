import { useMe } from "../hooks/auth/useMe";
import Consumption from "../components/home/Consumption";
import Goal from "../components/home/Goal";
import Grape from "../components/home/Grape";
import Header from "../components/home/Header";
import NavLayout from "../components/layouts/NavLayout";
import SadFaceIcon from "../assets/home/sadface.svg?react";
import Plus2Icon from "../assets/home/plus2.svg?react";
import Edit2Icon from "../assets/home/edit2.svg?react";
import Pen from "../assets/home/pen.svg?react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/date";

export default function HomePage() {
  const { user } = useMe();
  const navigate = useNavigate();

  // Mock Data (나중에 API 연동 예정)
  const goalData = {
    goalId: 1,
    goal: "영국 가즈아",
    startDate: "25.08.01",
    endDate: "25.08.31",
    goalBudget: 200000,
    usedBudget: 1000,
    dDay: 20,
  };

  // // 목표 없을 때 테스트
  // const goalData = null;

  return (
    <NavLayout>
      <div className="bg-bg-blue flex flex-col gap-8 pb-5">
        <div>
          <Header name={user?.name || ""} />

          {/* 상단 목표 카드 */}
          {goalData ? (
            <Grape
              goal={goalData.goal}
              date={goalData.dDay}
              usedBudget={goalData.usedBudget}
              goalBudget={goalData.goalBudget}
            />
          ) : (
            <div className="flex w-full min-h-[190px] p-4 flex-col justify-center items-center gap-[10px] bg-[#DDE2E7]">
              <div className="flex flex-col items-center gap-[10px] self-stretch 
                              p-[39px_86px] rounded-[24px] border border-[#5ACBB0] bg-white">
                <SadFaceIcon className="w-[26px] h-[26px]" />
                <p className="home-not-yet-font mb-3">현재 진행중인 목표가 없어요</p>
                <button
                  onClick={() => navigate("/goal/create")}
                  className="home-set-new-goal flex justify-center items-center gap-2 
                             px-[12px] py-[10px] pl-[16px] rounded-[30px] bg-[#5ACBB0] text-white"
                >
                  새로운 목표 설정하기
                  <Plus2Icon className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* 진행 중인 목표 섹션 (항상 표시) */}
          <div className="w-full bg-white rounded-b-[32px] py-8 px-4 ">
            <div className="w-full flex flex-col gap-4"> 
              <div className="w-full flex justify-between">
                <span className="text-body-01-semibold text-gray-100">진행중인 목표</span>
                <button onClick={goalData ? () => navigate(`/goal/edit/${goalData.goalId}`) : () => navigate("/goal/create")}><Pen/></button>
              </div>
              {goalData ? (
                <Goal
                  goal={goalData.goal}
                  startDate={goalData.startDate}
                  endDate={goalData.endDate}
                  goalBudget={goalData.goalBudget}
                />
              ) : (
                <button
                  onClick={() => navigate("/goal/create")}
                  className="flex flex-col justify-center items-center 
                            h-[76px] px-4 pt-2 pb-3 gap-[10px] self-stretch 
                            rounded-[16px] border border-[#6C7582] bg-[#F1F1F5]
                            hover:bg-[#e4e7ec] transition"
                >
                  <p className="home-goal-font text-center">
                    새로운 목표를 추가하세요
                  </p>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 소비 영역 */}
        <Consumption date={formatDate()} /> 
      </div>
    </NavLayout>
  );
}
