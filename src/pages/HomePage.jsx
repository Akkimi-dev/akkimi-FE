import Consumption from "../components/home/Consumption";
import Goal from "../components/home/Goal";
import Grape from "../components/home/Grape";
import Header from "../components/home/Header";
import NavLayout from "../components/layouts/NavLayout";
import SadFaceIcon from "../assets/home/sadface.svg?react";
import Plus2Icon from "../assets/home/plus2.svg?react";
import Pen from "../assets/home/pen.svg?react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/date";
import { useCurrentGoals } from "../hooks/goal/useGoal";
import { useUserProfile, useCheckSetup } from "../hooks/user/useUser";

import { useEffect, useState } from "react";
import MessageModal from "../components/home/Modal";

export default function HomePage() {
  const { data: profile } = useUserProfile();

  const navigate = useNavigate();

  const [showSetupModal, setShowSetupModal] = useState(false);
  const [dismissedSetup, setDismissedSetup] = useState(false);
  
  // 설정 여부 조회 훅
  const { data: setupState } = useCheckSetup();

  // 설정 페이지 URL (필요한 경로로 교체)
  const SETTINGS_URL = '/user/userName?type=init';

  useEffect(() => {
    if (dismissedSetup) return;
    if (setupState?.isSetup === false) setShowSetupModal(true);
  }, [setupState, dismissedSetup]);

  // 현재 목표 조회 훅 연결
  const { data: currentGoal } = useCurrentGoals();

  const toYYMMDD = (iso) => {
    if (!iso || typeof iso !== 'string') return '';
    const [y, m, d] = iso.split('-');
    if (!y || !m || !d) return iso;
    return `${y.slice(2)}.${m}.${d}`; // '25.08.01'
  };

  const goalData = currentGoal
    ? {
        goalId: currentGoal.goalId,
        goal: currentGoal.purpose ?? '',
        startDate: toYYMMDD(currentGoal.startDate),
        endDate: toYYMMDD(currentGoal.endDate),
        goalBudget: currentGoal.purposeBudget ?? 0,
        usedBudget: currentGoal.totalSum ?? 0,
        dDay: currentGoal.dday ?? 0,
      }
    : null;

  return (
    <NavLayout>
      <div className="bg-bg-blue min-h-[calc(100vh-69px)] flex flex-col gap-8">
        <div>
          <Header name={profile?.nickname || ""} />

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
                              py-9 rounded-[24px] border border-[#5ACBB0] bg-white">
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
        {goalData && (
          <Consumption goalId={goalData.goalId} date={formatDate()} />
        )}
      </div>
      {showSetupModal && (
        <MessageModal
          message={"회원 정보를 입력하지 않으셨어요.\n설정하시겠어요?"}
          onClose={() => { setShowSetupModal(false); setDismissedSetup(true); }}
          onConfirm={() => { setShowSetupModal(false); navigate(SETTINGS_URL); }}
          confirmText="하러 가기"
          cancelText="나중에 하기"
        />
      )}
    </NavLayout>
  );
}
