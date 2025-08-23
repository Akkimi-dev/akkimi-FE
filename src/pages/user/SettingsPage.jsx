import { useEffect, useState } from "react";
import NavLayout from "../../components/layouts/NavLayout";
import { useNavigate } from "react-router-dom";
import GobackIcon from '../../assets/settings/gobackarrow.svg?react';
import Goback2Icon from '../../assets/settings/gobackarrow2.svg?react';
import AgainIcon from '../../assets/settings/againarrow.svg?react';

// API
import { getUserProfile } from "../../apis/userApis";
import {updateNickname} from "../../apis/userApis";




export default function SettingsPage() {
  const nav = useNavigate();
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState("서울 마포구"); // 기본값
  const [profile, setProfile] = useState(null);
  const [maltu, setMaltu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 목업 데이터 (추후 API 연동 시 서버 데이터로 교체 가능)
  const goal = "영국에 갈끄야";
  const startDate = "25.08.01";
  const endDate = "25.08.31";
  const goalBudget = "500,000원";

   // 프로필 조회
    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const res = await getUserProfile(); // 여기서 res = response.data
          setProfile(res); // res.data 아님!
          console.log("API 응답: ", res);
        } catch (error) {
          console.error("프로필 불러오기 실패:", error);
        }
      };
      fetchProfile();
    }, []);
  
  //닉네임 변경
   const handleNicknameChange = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken"); // 저장된 토큰 불러오기
      const res = await updateNickname(accessToken, nickname);
      setMessage(res.message);
    } catch (err) {
      setMessage("닉네임 변경 실패 ❌");
    }
  };


  //현재 말투 조회
    useEffect(() => {
      const fetchMaltu = async () => {
        try {
          const data = await getCurrentMaltu();
          setMaltu(data.result);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchMaltu();
    }, []);



  // localStorage에서 지역 불러오기
  useEffect(() => {
    const saved = localStorage.getItem("selectedLocation");
    if (saved) {
      const { city, district } = JSON.parse(saved);
      if (city && district) {
        setLocation(`${city} ${district}`);
      }
    }
  }, []);

 

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
                <span className="bg-green text-gray-80 text-detail-01-regular rounded-[5px] px-[2px]">{startDate}</span>
                <span className="text-gray-100 text-detail-01-regular">~</span>
                <span className="bg-green text-detail-01-regular rounded-[5px] px-[2px]">{endDate}</span>
              </div>
            </div> 
            <div className="flex flex-col items-end gap-1">
              <span className="text-detail-02-regular text-gray-80">목표 지출액</span>
              <span className="text-body-02-semibold text-gray-100">{goalBudget.toLocaleString()}</span>
            </div>
          </div>

          {/* 내 소비 성향 */}
          <div className="flex flex-col gap-2">
            <div className="set-goal-font">내 소비 성향</div>
            <div className="flex p-4 justify-between items-center self-stretch rounded-[16px] border border-[#DDE2E7] bg-white shadow-[2px_4px_4px_0_rgba(0,0,0,0.05)]">
              <div className="set-result-font">{profile?.character ?? "미설정"}</div>
              <button
                onClick={() => nav("/survey")}
                className="flex justify-center items-center gap-1 rounded-[30px] border border-[#DDE2E7] bg-[#CAF6EC] py-1 pl-3 pr-2 set-again-font"
              >
                테스트 다시하기
                <AgainIcon className="w-3 h-3"/>
              </button>
            </div>
          </div>

          {/* 내 지역 */}
          <div className="flex flex-col gap-2">
            <div className="set-goal-font">내 지역</div>
            <div className="flex p-4 justify-between items-center self-stretch rounded-[16px] border border-[#DDE2E7] bg-white shadow-[2px_4px_4px_0_rgba(0,0,0,0.05)]">
              <div className="set-result-font">{location}</div>
              <button
                onClick={() => nav("/location-change")}
                className="flex justify-center items-center gap-1 rounded-[30px] border border-[#DDE2E7] bg-[#CAF6EC] py-1 pl-3 pr-2 set-again-font">
                지역 변경하기
                <AgainIcon className="w-3 h-3"/>
              </button>
            </div>
          </div>
        </div>

        {/* 챗봇 설정 */}
        <div className="bg-white shadow-sm p-4 flex flex-col gap-2">
          <div className="set-goal-font">챗봇 설정</div>
          <button 
            onClick={() => nav("/chatbotmaltu")}
            className="flex p-4 justify-between items-center self-stretch rounded-[16px] border border-[#DDE2E7] bg-white shadow-[2px_4px_4px_0_rgba(0,0,0,0.05)] set-result-font">
            <span>말투 설정</span>
            <Goback2Icon className="w-4 h-4"/>
          </button>
          
        </div>

      </div>
    </NavLayout>
  );
}
