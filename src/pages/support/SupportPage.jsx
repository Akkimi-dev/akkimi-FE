import LineIcon from '../../assets/support/line.svg?react';
import LocationIcon from '../../assets/support/location.svg?react';
import MovetoIcon from '../../assets/support/moveto.svg?react';
import IconRight from '../../assets/support/icon-right.svg?react';
import NoNavLayout from "../../components/layouts/NoNavLayout";

import mockFood from '/mockFood.png';
import mockRoom from '/mockRoom.png';
import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SupportPage() {
  const navigate = useNavigate();
  const handleLocationClick = () => navigate('/location-change');
  const [currentLoc, setCurrentLoc] = useState('마포구');
  const categories = ['전체', '음식', '편의시설', '문화', '행사', '기타'];
  const [selected, setSelected] = useState(0);
  const [visibleCount, setVisibleCount] = useState(6);

  // 카테고리별 데이터
  const datasets = {
    음식: Array.from({ length: 12 }, (_, i) => ({
      title: '냠냠분식',
      address: '마포구 모래내로 7길 89 1층 2호 (성산동)',
      tag: '김밥',
      price: '3,500원',
      image: mockFood,
      phone: '02-303-7332',
      hours: '매일 10:00 ~ 22:00',
      holiday: '명절',
      goodPrice:
        i % 3 === 0,
      editorNote:
        '김밥이 단 3,500! 라면이 단돈 4,500원! 아끼미에게 최고의 선택지가 될 분식집!',
    })),
    편의시설: Array.from({ length: 12 }, () => ({
      title: '편의점',
      address: '마포구 성산동 123-45 1층',
      tag: '편의시설',
      price: '24시간',
      image: mockRoom,
      phone: '02-000-0000',
      hours: '연중무휴 24시간',
      holiday: '',
      goodPrice: false,
    })),
    문화: Array.from({ length: 12 }, () => ({
      title: '문화센터',
      address: '마포구 문화로 11 2층',
      tag: '문화',
      price: '무료',
      image: mockFood,
      phone: '02-111-2222',
      hours: '평일 09:00 ~ 18:00',
      holiday: '주말',
      goodPrice: false,
    })),
    행사: Array.from({ length: 12 }, () => ({
      title: '지역축제',
      address: '마포구 축제로 55',
      tag: '행사',
      price: '입장무료',
      image: mockFood,
      phone: '',
      hours: '행사일정 참고',
      holiday: '',
      goodPrice: false,
    })),
    기타: Array.from({ length: 12 }, () => ({
      title: '기타 장소',
      address: '마포구 어딘가 1층',
      tag: '기타',
      price: '상시',
      image: mockFood,
      phone: '',
      hours: '상시',
      holiday: '',
      goodPrice: false,
    })),
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem('selectedLocation');
      if (!raw) return;
      const saved = JSON.parse(raw);
      const name = saved?.district || saved?.city;
      if (name) setCurrentLoc(name);
    } catch { /* 무시 */ }
  }, []);

  useEffect(() => {
    const refresh = () => {
      const raw = localStorage.getItem('selectedLocation');
      const saved = raw ? JSON.parse(raw) : null;
      const name = saved?.district || saved?.city;
      if (name) setCurrentLoc(name);    
    };
    window.addEventListener('focus', refresh);
    return () => window.removeEventListener('focus', refresh);
  }, []);

  // '전체'는 합치고 셔플
  const items = useMemo(() => {
    const key = categories[selected];
    if (key === '전체') {
      const merged = [
        ...datasets['음식'],
        ...datasets['편의시설'],
        ...datasets['문화'],
        ...datasets['행사'],
        ...datasets['기타'],
      ];
      for (let i = merged.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [merged[i], merged[j]] = [merged[j], merged[i]];
      }
      return merged;
    }
    return datasets[key] ?? [];
  }, [selected]);

  return (
    <NoNavLayout>
      <div className="w-full h-full mx-auto bg-white flex flex-col">

        {/* 헤더 */}
        <header className="flex w-full h-12 px-4 flex-row justify-between items-center self-center">
          <h1 className="support-title-font">아껴바요</h1>
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={handleLocationClick}
          >
            <span className="support-location-font">{currentLoc}</span>
            <LocationIcon className="w-[20px] h-[20px]" />
          </div>
        </header>

        {/* 회색 줄 */}
        <div className="w-full h-2 bg-[#F3F7FB]" />

        {/* 카테고리 */}
        <div className="px-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 p-4">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelected(idx);
                  setVisibleCount(6);
                }}
                className={`shrink-0 flex justify-center items-center gap-[10px] px-4 py-2 rounded-[30px] whitespace-nowrap border-none support-category-name-font ${
                  selected === idx ? 'bg-[#CAF6EC]' : 'bg-[#F1F1F5]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 리스트 영역 (세로 스크롤 가능) */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
          <div className="grid grid-cols-2 gap-[13px] px-4 pb-4">
            {items.slice(0, visibleCount).map((item, idx) => (
              <div
                key={idx}
                onClick={() => navigate('/support-detail', { state: item })}
                className="cursor-pointer h-[281px] rounded-lg bg-white flex flex-col border-none overflow-hidden"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="block w-full h-[168px] object-cover rounded-lg"
                />
                <div className="p-2 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h2 className="support-factor-name-font">{item.title}</h2>
                    <MovetoIcon className="w-4 h-4" />
                  </div>
                  <p className="support-detail-font whitespace-pre-line">
                    {item.address.replace(/\s*(\d+층)/g, '\n$1')}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="support-price-font">{item.tag}</span>
                    <LineIcon className="h-4" />
                    <span className="support-price-font">{item.price}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* 더보기 (스타일 그대로 유지) */}
            {visibleCount < items.length && (
              <div className="col-span-2 flex justify-center mt-2">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="flex px-4 py-2 justify-center items-center gap-[10px] w-full rounded-[30px] bg-[#F1F1F5] support-more"
                >
                  더보기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </NoNavLayout>
  );
}
