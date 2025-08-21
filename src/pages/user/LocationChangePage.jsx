import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import GobackIcon from "../../assets/Settings/goback.svg?react";
import NoNavLayout from "../../components/layouts/NoNavLayout";

export default function LocationChangePage() {
  const nav = useNavigate();
  const [step, setStep] = useState("city");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");

  const cities = [
    "서울","부산","대구","인천","광주",
    "대전","울산","세종","경기","강원",
    "충청","전라","경상","제주"
  ];

  const districtsMap = {
    서울: ["강남구","강동구","강북구","강서구","관악구","광진구","구로구",
      "금천구","노원구","도봉구","동대문구","동작구","마포구","서대문구",
      "서초구","성동구","성북구","송파구","양천구","영등포구",
      "용산구","은평구","종로구","중구","중랑구"],
    부산: ["강서구","금정구","남구","동구","동래구","부산진구","북구",
      "사상구","사하구","서구","수영구","연제구","영도구","중구","해운대구"],
    대구: ["남구","달서구","달성군","동구","북구","서구","수성구","중구"],
    인천: ["강화군","계양구","남동구","동구","미추홀구","부평구",
      "서구","연수구","옹진군","중구"],
    광주: ["광산구","남구","동구","북구","서구"],
    대전: ["대덕구","동구","서구","유성구","중구"],
    울산: ["남구","동구","북구","울주군","중구"],
    세종: ["세종시"],
    경기: ["고양시","광명시","광주시","군포시","김포시","남양주시",
      "동두천시","부천시","성남시","수원시","시흥시","안성시",
      "안양시","오산시","용인시","의왕시","의정부시","이천시",
      "평택시","파주시","하남시","화성시"],
    강원: ["강릉시","고성군","동해시","삼척시","속초시","양구군","양양군",
      "영월군","원주시","인제군","정선군","철원군","춘천시",
      "태백시","평창군","홍천군","화천군","횡성군"],
    충청: ["괴산군","공주시","계룡시","금산군","논산시","당진시",
      "단양군","보령시","보은군","부여군","서산시","서천군",
      "아산시","영동군","옥천군","음성군","제천시","진천군",
      "청주시","천안시","충주시"],
    전라: ["고흥군","곡성군","광양시","군산시","김제시","나주시",
      "남원시","담양군","목포시","무주군","보성군","순창군",
      "순천시","완주군","익산시","임실군","장수군","전주시",
      "정읍시","진안군","화순군","여수시","구례군"],
    경상: ["거제시","경산시","경주시","고령군","구미시","김천시","김해시",
      "밀양시","문경시","사천시","상주시","양산시","영덕군","영양군",
      "영주시","영천시","예천군","울릉군","울진군","의성군",
      "창원시","청송군","포항시","진주시","통영시","안동시"],
    제주: ["서귀포시","제주시"]
  };

  const districts = useMemo(() => (city ? districtsMap[city] || [] : []), [city]);

  const onBack = () => {
    if (step === "district") {
      setStep("city");
      setDistrict("");
      return;
    }
    nav(-1);
  };

  const canNext = step === "city" ? !!city : !!district;

  const onPrimary = () => {
    if (step === "city") {
      setStep("district");
      return;
    }
    localStorage.setItem(
      "selectedLocation",
      JSON.stringify({ city, district, updatedAt: Date.now() })
    );
    nav(-1);
  };

  return (
    <NoNavLayout>
      <div className="w-full min-h-full mx-auto bg-white flex flex-col">
        <header className="flex items-center justify-between h-12 px-4 mt-6 mb-8">
          <GobackIcon onClick={onBack} className="w-5 h-5" />
          <h1 className="loc-name-font">지역 설정하기</h1>
          <div className="w-5" />
        </header>

        <div className="px-4 pt-3 pb-2 loc-info-font">
          지역 정보 수집은 아껴바요를 위한 정보수집입니다.
        </div>

        {/* 전체지역/시군구 */}
        <div className="px-4">
          <div className="flex items-center gap-2 text-[13px]">
            <span className={city ? "loc-1-font" : "loc-2-font"}>
              {city || "전체지역"}
            </span>
            <span className="loc-2-font">{">"}</span>
            <span className={district ? "loc-1-font" : "loc-2-font"}>
              {district || "시/군/구"}
            </span>
          </div>
          <div className="h-px bg-[#A6AEB6] mt-2" />
        </div>

        {/* 내용 */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {step === "city" && (
            <GridButtons
              items={cities}
              value={city}
              onChange={(v) => {
                setCity(v);
                setDistrict("");
              }}
            />
          )}
          {step === "district" && (
            <GridButtons items={districts} value={district} onChange={setDistrict} />
          )}
        </div>

        <div className="px-4 pb-4">
          <button
            onClick={onPrimary}
            disabled={!canNext}
            className={`w-full flex py-[12px] justify-center items-center gap-[10px] rounded-[100px] ${
              canNext
                ? "loc-done-font bg-[#CAF6EC]"
                : "loc-next-font bg-[#DDE2E7] cursor-not-allowed"
            }`}
          >
            {step === "city" ? "다음" : "저장하기"}
          </button>
        </div>
      </div>
    </NoNavLayout>
  );
}

function GridButtons({ items, value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-3 justify-center">
      {items.map((label) => {
        const selected = value === label;
        return (
          <button
            key={label}
            onClick={() => onChange(label)}
            className={
              "flex w-[112px] px-[10px] py-[12px] justify-center items-center gap-[10px] rounded-[30px] " +
              (selected
                ? "bg-[#CAF6EC] loc-city-font"
                : "bg-[#DDE2E7] loc-city-not-chosen-font")
            }
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
