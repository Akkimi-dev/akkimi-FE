import { useNavigate } from "react-router-dom";
import NavLayout from "../../components/layouts/NavLayout";
import GobackIcon from "../../assets/settings/gobackarrow.svg?react";
import Goback2Icon from "../../assets/settings/gobackarrow2.svg?react";
import AgainIcon from "../../assets/settings/againarrow.svg?react";
import { useUserProfile } from "../../hooks/user/useUser";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const nav = useNavigate();
  const { data: profile, isLoading, isError } = useUserProfile();

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

  // 목업 데이터 (목표 관련은 아직 API 없음 → 그대로 둠)
  const goal = "영국에 갈끄야";
  const startDate = "25.08.01";
  const endDate = "25.08.31";
  const goalBudget = "500,000원";

  if (isLoading) return <div>로딩중...</div>;
  if (isError) return <div>데이터 불러오기 실패 😢</div>;

  return (
    <NavLayout>
      <div className="bg-[#F1F1F5]">
        {/* 프로필 */}
        <div className="flex w-full p-4 h-12 flex-col justify-center items-start gap-2 shrink-0 bg-[#F1F1F5] set-title-font py-10">
          내 프로필
        </div>
        <div className="flex flex-row items-center set-name-font rounded-t-2xl p-4 gap-2 bg-white">
          <span>{profile?.nickname ?? "이름 없음"}님</span>
          <GobackIcon className="w-4 h-4" />
        </div>

        {/* 진행중인 목표 + 내 소비 성향 + 내 지역 컨테이너 */}
        <div className="flex flex-col gap-6 w-full px-4 py-8 bg-white">
          {/* 진행중인 목표 */}
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
    </NavLayout>
  );
}
