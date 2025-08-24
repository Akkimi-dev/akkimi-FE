import { useNavigate } from "react-router-dom";
import NavLayout from "../../components/layouts/NavLayout";
import GobackIcon from "../../assets/settings/gobackarrow.svg?react";
import Goback2Icon from "../../assets/settings/gobackarrow2.svg?react";
import AgainIcon from "../../assets/settings/againarrow.svg?react";
import { useUserProfile } from "../../hooks/user/useUser";
import { useLogout } from "../../hooks/auth/useLogout";
import { useEffect, useState } from "react";
import { useCurrentGoals } from "../../hooks/goal/useGoal";
import useErrorModal from "../../hooks/error/useErrorModal";

export default function SettingsPage() {
  const nav = useNavigate();
  const { data: profile, isError } = useUserProfile();
  const { mutateAsync: logout, isLoading: isLoggingOut } = useLogout();
  const { show: showError, Modal: ErrorModalMount } = useErrorModal();

  // ✅ 지역: API 연결 안 하고 localStorage + fallback
  const [location, setLocation] = useState("서울시 마포구");

  useEffect(() => {
    const saved = localStorage.getItem("selectedLocation");
    if (saved) {
      const { city, district } = JSON.parse(saved);
      if (city && district) {
        setLocation(`${city} ${district}`);
      }
    }
  }, []);

  const { data: currentGoal, isError: isGoalError, error: goalError } = useCurrentGoals();
  const isNoGoal404 = isGoalError && (goalError?.response?.status === 404);
  const hasGoal = isNoGoal404 ? false : !!currentGoal?.goalId;

  useEffect(() => {
    if (isError) {
      showError('프로필 정보를 불러오지 못했습니다. 잠시 후 다시 시도하세요.');
    } else if (isGoalError && !isNoGoal404) {
      showError('진행 중인 목표 정보를 불러오지 못했습니다.');
    }
  }, [isError, isGoalError, isNoGoal404, showError]);

  const goal = currentGoal?.purpose ?? '미설정';
  const startDate = currentGoal?.startDate ?? '';
  const endDate = currentGoal?.endDate ?? '';
  const goalBudget = currentGoal?.purposeBudget ?? 0;

  return (
    <NavLayout>
      <div className="bg-[#F1F1F5]">
        {/* 프로필 */}
        <div className="flex w-full p-4 h-12 flex-col justify-center items-start gap-2 shrink-0 bg-[#F1F1F5] set-title-font py-10">
          내 프로필
        </div>
        <div className="flex items-center justify-between set-name-font rounded-t-2xl p-4 bg-white">
          <div className="flex gap-2 items-center">
            {profile?.nickname ?
              <span>{profile?.nickname}님</span>
              :
              <span>이름을 정해주세요</span>
            }
            <button className="" onClick={() => nav(`/user/userName?nickname=${profile.nickname}`)}><GobackIcon className="w-4 h-4" /></button>
          </div>
          <button
            onClick={() => logout()}
            disabled={isLoggingOut}
            className={` cursor-pointer px-3 py-1 rounded-[30px] border border-gray-60 set-again-font`}
          >
            {isLoggingOut ? '로그아웃 중…' : '로그아웃'}
          </button>
        </div>

        {/* 진행중인 목표 + 내 소비 성향 + 내 지역 컨테이너 */}
        <div className="flex flex-col gap-6 w-full px-4 py-8 bg-white">
          {/* 진행중인 목표 */}
          {hasGoal ? (
            <div className="w-full rounded-[16px] border border-green-main-dark-2 flex justify-between items-end px-4 pt-2 pb-3">
              <div className="flex flex-col gap-2">
                <span className="text-body-02-semibold">{`[${goal}]`}</span>
                <div>
                  <span className="bg-green text-gray-80 text-detail-01-regular rounded-[5px] px-[2px]">
                    {startDate}
                  </span>
                  <span className="text-gray-100 text-detail-01-regular">~</span>
                  <span className="bg-green text-detail-01-regular rounded-[5px] px-[2px]">
                    {endDate}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-detail-02-regular text-gray-80">목표 지출액</span>
                <span className="text-body-02-semibold text-gray-100">
                  {goalBudget.toLocaleString()}
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full rounded-[16px] border border-[#DDE2E7] flex justify-between items-center px-4 py-3">
              <div className="flex flex-col gap-1">
                <span className="text-body-02-semibold text-gray-80">진행 중인 목표가 없습니다.</span>
                <span className="text-detail-02-regular text-gray-60">새로운 목표를 생성해 시작해보세요.</span>
              </div>
              <button
                onClick={() => nav('/goal/create')}
                className="flex justify-center items-center gap-2 px-4 py-2 rounded-[8px] bg-[#CAF6EC] border border-[#DDE2E7] set-again-font"
              >
                목표 만들기
              </button>
            </div>
          )}

          {/* 내 소비 성향 */}
          <div className="flex flex-col gap-2">
            <div className="set-goal-font">내 소비 성향</div>
            <div className="flex p-4 justify-between items-center self-stretch rounded-[16px] border border-[#DDE2E7] bg-white shadow-[2px_4px_4px_0_rgba(0,0,0,0.05)]">
              <div className="set-result-font">
                {profile?.character?.name ?? "미설정"}
              </div>
              <button
                onClick={() => nav("/survey")}
                className="flex justify-center items-center gap-1 rounded-[30px] border border-[#DDE2E7] bg-[#CAF6EC] py-1 pl-3 pr-2 set-again-font"
              >
                테스트 다시하기
                <AgainIcon className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* 내 지역 (✅ localStorage + 하드코딩 fallback) */}
          <div className="flex flex-col gap-2">
            <div className="set-goal-font">내 지역</div>
            <div className="flex p-4 justify-between items-center self-stretch rounded-[16px] border border-[#DDE2E7] bg-white shadow-[2px_4px_4px_0_rgba(0,0,0,0.05)]">
              <div className="set-result-font">{location}</div>
              <button
                onClick={() => nav("/location-change")}
                className="flex justify-center items-center gap-1 rounded-[30px] border border-[#DDE2E7] bg-[#CAF6EC] py-1 pl-3 pr-2 set-again-font"
              >
                지역 변경하기
                <AgainIcon className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* 챗봇 설정 */}
        <div className="bg-white shadow-sm p-4 flex flex-col gap-2">
          <div className="set-goal-font">챗봇 설정</div>
          <button
            onClick={() => nav("/chatbotmaltu")}
            className="flex p-4 justify-between items-center self-stretch rounded-[16px] border border-[#DDE2E7] bg-white shadow-[2px_4px_4px_0_rgba(0,0,0,0.05)] set-result-font"
          >
            <span>말투 설정</span>
            <Goback2Icon className="w-4 h-4" />
          </button>
        </div>
      </div>
      <ErrorModalMount />
    </NavLayout>
  );
}
