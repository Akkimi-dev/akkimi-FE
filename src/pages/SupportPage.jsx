import LineIcon from '../assets/Support/line.svg?react';
import LocationIcon from '../assets/Support/location.svg?react';
import MovetoIcon from '../assets/Support/moveto.svg?react';
import IconRight from '../assets/Support/icon-right.svg?react';
import mockFood from '/mockFood.png';
import mockRoom from '/mockRoom.png';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SupportPage() {
  const navigate = useNavigate();
  const handleLocationClick = () => {
    navigate('/location-change');
  };

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
      // 예시로 3개마다 착한가격업소 플래그 주었습니다(mock 데이터는 나중에 수정하겠습니다)
      goodPrice: i % 3 === 0,
      editorNote: '김밥이 단 3,500! 라면이 단돈 4,500원! 아끼미에게 최고의 선택지가 될 분식집!'
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
      goodPrice: false
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
      goodPrice: false
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
      goodPrice: false
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
      goodPrice: false
    }))
  };

  // '전체' 카테고리는 모든 카테고리 내용 합치고 셔플해서 반환하도록 했습니다.
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
      // 셔플
      for (let i = merged.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [merged[i], merged[j]] = [merged[j], merged[i]];
      }
      return merged;
    }
    return datasets[key] ?? [];
  }, [selected]);

  return (
    <div className="max-w-[393px] min-h-screen mx-auto bg-white">
      {/* 상태바 */}
      <div className="flex justify-between items-center w-[393px] h-[60px] px-[43px] pr-[36px] py-[19px]">
        <span className="time-font">9:41</span>
        <IconRight className="w-[75.403px] h-[13px] shrink-0" />
      </div>

      {/* 헤더 */}
      <header className="flex w-[361px] h-12 px-4 flex-row justify-between items-center self-stretch">
        <h1 className="support-title-font">아껴바요</h1>
        <div
          className="flex items-center gap-1 mr-[-30px] cursor-pointer"
          onClick={handleLocationClick}
        >
          <span className="support-location-font">마포구</span>
          <LocationIcon className="w-[20px] h-[20px]" />
        </div>
      </header>

      {/* 회색 줄 */}
      <div className="w-[417.5px] h-2 bg-[#F3F7FB] relative left-1/2 -translate-x-1/2"></div>

      {/* 카테고리: 가로 스크롤(바 숨김 수정) */}
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

      {/* 카드 리스트: 세로 스크롤(바 숨김 수정) */}
      <div className="grid grid-cols-2 gap-[13px] px-4 overflow-y-auto overflow-x-hidden no-scrollbar h-[calc(100vh-60px-48px-72px)]">
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
              <p className="support-detail-font w-[160px] whitespace-pre-line">
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

        {/* 더보기 */}
        {visibleCount < items.length && (
          <div className="col-span-2 flex justify-center mt-2 mb-4">
            <button
              onClick={() => setVisibleCount(prev => prev + 6)}
              className="flex px-4 py-2 justify-center items-center gap-[10px] w-full rounded-[30px] bg-[#F1F1F5] support-more"
            >
              더보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
