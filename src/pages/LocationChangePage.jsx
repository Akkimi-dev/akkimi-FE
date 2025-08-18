//아직 디자인 안 들어간 버전입니다!

import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LocationChangePage() {
  const nav = useNavigate();

  // 1단계: 도시, 2단계: 시/군/구
  const [step, setStep] = useState('city'); 
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');

  // 목업 데이터
  const cities = ['서울', '부산', '대구', '인천', '대전', '광주'];
  const districtsMap = {
    서울: ['강서구', '마포구', '강북구', '송파구', '강남구', '노원구'],
    부산: ['해운대구', '수영구', '부산진구', '동래구', '연제구', '사상구'],
    대구: ['중구', '수성구', '동구', '북구', '달서구', '달성군'],
    인천: ['연수구', '남동구', '미추홀구', '부평구', '계양구', '서구'],
    대전: ['유성구', '서구', '중구', '대덕구', '동구'],
    광주: ['광산구', '서구', '남구', '북구', '동구'],
  };

  const districts = useMemo(() => (city ? districtsMap[city] || [] : []), [city]);

  const onBack = () => {
    if (step === 'district') {
      setStep('city');
      setDistrict('');
      return;
    }
    nav(-1);
  };

  const canNext = step === 'city' ? !!city : !!district;

  const onPrimary = () => {
    if (step === 'city') {
      setStep('district');
      return;
    }
    // 완료: 임시로 로컬 저장 후 이전 화면으로
    localStorage.setItem(
      'selectedLocation',
      JSON.stringify({ city, district, updatedAt: Date.now() })
    );
    nav(-1); // 돌아가기
  };

  return (
    <div className="max-w-[393px] h-[700px] mx-auto bg-white flex flex-col">
      {/* 헤더 */}
      <header className="flex items-center justify-between h-12 px-4">
        <button onClick={onBack} className="text-[18px] leading-none" aria-label="뒤로가기">
          ←
        </button>
        <h1 className="text-[16px] font-semibold">지역 변경하기</h1>
        <div className="w-5" />
      </header>

      {/* 얇은 구분선 */}
      <div className="h-px bg-[#EDEFF2]" />

      {/* 설명 */}
      <div className="px-4 pt-3 pb-2 text-[12px] text-[#6B7280]">아껴바요를 위한 정보 수집임</div>

      {/* 브레드크럼 & 탭 라인 */}
      <div className="px-4">
        <div className="flex items-center gap-2 text-[13px]">
          <span className={step === 'city' ? 'text-[#10B981] font-medium' : ''}>전체지역</span>
          <span className="text-[#9CA3AF]">{'>'}</span>
          <span className={step === 'district' ? 'text-[#10B981] font-medium' : 'text-[#9CA3AF]'}>시/군/구</span>
        </div>
        <div className="h-px bg-[#EDEFF2] mt-2" />
      </div>

      {/* 컨텐츠 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {step === 'city' && (
          <GridButtons
            items={cities}
            value={city}
            onChange={(v) => {
              setCity(v);
              setDistrict('');
            }}
          />
        )}

        {step === 'district' && (
          <>
            <div className="mb-3 text-[13px] text-[#6B7280]">
              <span className="text-black font-medium">{city}</span> &nbsp;&gt;&nbsp; 시/군/구
            </div>
            <GridButtons items={districts} value={district} onChange={setDistrict} />
          </>
        )}
      </div>

      {/* 하단 고정 버튼 */}
      <div className="px-4 pb-4">
        <button
          onClick={onPrimary}
          disabled={!canNext}
          className={`w-full h-11 rounded-md text-[15px] font-medium ${
            canNext ? 'bg-black text-white' : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
          }`}
        >
          {step === 'city' ? '다음' : '완료'}
        </button>
      </div>
    </div>
  );
}

/** 공통 버튼 그리드 (3열) */
function GridButtons({ items, value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map((label) => {
        const selected = value === label;
        return (
          <button
            key={label}
            onClick={() => onChange(label)}
            className={
              'h-10 rounded-full text-[14px] ' +
              (selected ? 'bg-[#CAF6EC] text-[#0F766E]' : 'bg-[#F1F1F5] text-[#374151]')
            }
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
