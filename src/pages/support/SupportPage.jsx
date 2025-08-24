import LineIcon from '../../assets/support/line.svg?react';
import LocationIcon from '../../assets/support/location.svg?react';
import MovetoIcon from '../../assets/support/moveto.svg?react';
import IconRight from '../../assets/support/icon-right.svg?react';
import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavLayout from "../../components/layouts/NavLayout";

export default function SupportPage() {
  const navigate = useNavigate();
  const handleLocationClick = () => navigate('/location-change');
  const [currentLoc, setCurrentLoc] = useState('마포구');
  const categories = ['전체', '음식', '편의시설', '문화', '행사', '기타'];
  const [selected, setSelected] = useState(0);
  const [visibleCount, setVisibleCount] = useState(6);

  // 카테고리별 데이터
  const datasets = {
    음식: [
      {
        title: '냠냠분식',
        address: '마포구 모래내로 7길 89 1층 2호 (성산동)',
        tag: '김밥',
        price: '3,500원',
        image: '/mockFood.png',
        phone: '02-303-7332',
        hours: '매일 10:00 ~ 22:00',
        holiday: '명절',
        goodPrice: true,
        editorNote: '김밥이 단 3,500! 라면이 단돈 4,500원! 아끼미에게 최고의 선택지가 될 분식집!',
      },
      {
        title: '리우키친',
        address: '마포구 월드컵북로 402 (상암동) B101호',
        tag: '샐러드',
        price: '4,500원',
        image: '/mockFood2.jpg',
        phone: '0507-1300-5493',
        hours: '평일 11:00 ~ 22:00',
        holiday: '주말',
        goodPrice: false,
        editorNote: '신선한 샐러드로 든든하게! 다이어트 중인 아끼미들에게 추천!',
      },
      {
        title: '미소국수',
        address: '마포구 동교로 27길 41 (연남동)',
        tag: '잔치국수',
        price: '7,000원',
        image: '/mockFood3.jpg',
        phone: '02-326-5403',
        hours: '9:00 ~ 21:00',
        holiday: '일요일',
        goodPrice: false,
        editorNote: '따끈한 잔치국수 한 그릇, 7천 원의 행복',
      },
      {
        title: '서교밥집',
        address: '마포구 모래내로 7길 89 1층 2호 (성산동)',
        tag: '돈가스',
        price: '7,000원',
        image: '/mockFood4.jpg',
        phone: '02-6010-1208',
        hours: '9:00 ~ 21:00',
        holiday: '명절',
        goodPrice: true,
        editorNote: '돈까스와 대야냉면의 성지, 가성비 끝판왕 분식집!',
      },
    ],
    편의시설: [
      {
        title: '마포주민편익시설',
        address: '마포구 월드컵북로44길 40',
        tag: '편익시설',
        price: '무료',
        image: '/mockPlace.jpg',
        phone: '02-000-0000',
        hours: '6:00 ~ 22:00',
        holiday: '공휴일',
        goodPrice: false,
        editorNote: '주민 누구나 편리하게 이용할 수 있는 열린 공간!',
      },
      {
        title: '서교동 주민센터',
        address: '마포구 동교로15길 7 서교동주민자치회',
        tag: '주민센터',
        price: '무료',
        image: '/mockPlace2.jpg',
        phone: '02-3153-6740',
        hours: '9:00 ~ 18:00',
        holiday: '공휴일, 주말',
        goodPrice: false,
        editorNote: '주민을 위한 다양한 행정·복지 서비스를 제공하는 생활 거점!',
      },
      {
        title: '합정동 주민센터',
        address: '마포구 월드컵로5길 11',
        tag: '주민센터',
        price: '무료',
        image: '/mockPlace3.jpg',
        phone: '02-303-7332',
        hours: '9:00 ~ 18:00',
        holiday: '공휴일, 주말',
        goodPrice: false,
        editorNote: '주민 생활과 밀접한 행정 서비스를 한곳에서!',
      },
      {
        title: '마포구민체육센터',
        address: '마포구 월드컵로25길 190',
        tag: '체육센터',
        price: '무료',
        image: '/mockPlace4.jpg',
        phone: '02-324-7800',
        hours: '매일 6:00 ~ 22:00',
        holiday: '공휴일',
        goodPrice: false,
        editorNote: '운동과 건강을 책임지는 주민들의 체력 단련장!',
      },
    ],
    문화: [
      {
        title: '마포아트센터',
        address: '서울 마포구 대흥로20길 28 마포아트센터',
        tag: '문화',
        price: '무료',
        image: '/mockCulture.jpg',
        phone: '02-3274-8500',
        hours: '06:00 ~ 22:00',
        holiday: '주말',
        goodPrice: false,
        editorNote: '다양한 공연과 전시가 열리는 문화예술의 중심지',
      },
      {
        title: '마포문화원',
        address: ' 마포구 백범로 227 (신공덕동)',
        tag: '문화원',
        price: '개별 문의',
        image: '/mockCulture2.jpg',
        phone: '02-312-1100',
        hours: '9:00 ~ 18:00',
        holiday: '공휴일',
        goodPrice: false,
        editorNote: '지역 전통과 문화를 이어가는 마포의 문화 사랑방',
      },
      {
        title: '마포평생학습관',
        address: '마포구 홍익로2길 16',
        tag: '평생학습관',
        price: '무료',
        image: '/mockCulture3.jpg',
        phone: '02-2137-0000',
        hours: '9:00 ~ 17:00',
        holiday: '공휴일',
        goodPrice: false,
        editorNote: '누구나 배우고 성장할 수 있는 열린 배움터',
      },
      {
        title: '마포중앙도서관',
        address: '마포구 성산로 128',
        tag: '도서관',
        price: '무료',
        image: '/mockCulture4.jpg',
        phone: '02-3153-5800',
        hours: '매일 9:00 ~ 18:00',
        holiday: '월요일, 공휴일',
        goodPrice: false,
        editorNote: '지식과 쉼이 함께하는 주민들의 지식 허브',
      },
    ],
    행사: [
      {
        title: '홍대로 문화로 관광으로',
        address: '마포구 홍대축제거리',
        tag: '행사',
        price: '입장무료',
        image: '/mockFestival.jpg',
        phone: '02-3153-8114',
        hours: '매년 4월 ~ 11월',
        holiday: '공휴일',
        goodPrice: false,
        editorNote: '거리와 문화가 하나 되는 축제의 장',
      },
      {
        title: '하늘공원해맞이축제',
        address: '마포구 하늘공원로 95',
        tag: '행사',
        price: '무료',
        image: '/mockFestival2.jpg',
        phone: '02-3153-8114',
        hours: '매년 1월 1일',
        holiday: '.',
        goodPrice: false,
        editorNote: '새해 소망을 담아 떠오르는 해와 함께하는 특별한 순간',
      },
      {
        title: '마포음식문화축제',
        address: '마포구 홍대축제거리',
        tag: '축제',
        price: '무료',
        image: '/mockFestival3.jpg',
        phone: '02-303-7332',
        hours: '매년 10월',
        holiday: '공휴일',
        goodPrice: false,
        editorNote: '맛있는 음식들로 모든 세대를 함께 아우르는 열정과 미식의 축제!',
      },
      {
        title: '서울 억새 축제',
        address: '마포구 하늘공원로 95',
        tag: '축제',
        price: '무료',
        image: '/mockFestival4.png',
        phone: '02-303-7332',
        hours: '25.10.19 ~ 25.10.25',
        holiday: '공휴일',
        goodPrice: false,
        editorNote: '억새 물결 속에서 가을 정취를 만끽하는 힐링 축제',
      },
    ],
    기타: [
      {
        title: '뷰티클럽',
        address: '서울특별시 마포구 동교로32길 8 2층',
        tag: '여드름 관리',
        price: '20,000원',
        image: '/mockElse.jpg',
        phone: '0507-1373-3536',
        hours: '상시',
        holiday: '',
        goodPrice: true,
        editorNote: '합리적인 가격에 피부 고민을 케어하는 뷰티 공간',
      },
      {
        title: '수도미용실',
        address: '서울특별시 마포구 굴레방로7길 26 (아현동)',
        tag: '커트',
        price: '10,000원',
        image: '/mockElse2.jpg',
        phone: '02-363-1248',
        hours: '11:30 ~ 20:30',
        holiday: '주말, 공휴일',
        goodPrice: true,
        editorNote: '지역 주민이 꾸준히 찾는 믿음직한 헤어샵',
      },
      {
        title: '연백이발관',
        address: '마포구 만리재옛길 5 (공덕동)',
        tag: '이발',
        price: '7,000원',
        image: '/mockElse3.jpg',
        phone: '02-711-9782',
        hours: '8:00 ~ 19:00',
        holiday: '공휴일',
        goodPrice: true,
        editorNote: '세월의 멋을 간직한 정겨운 이발소',
      },
      {
        title: '염색하우스',
        address: '마포구 방울내로7길 23 1층',
        tag: '염색',
        price: '20,000원',
        image: '/mockElse4.jpg',
        phone: '02-337-4999',
        hours: '매일 11:00 ~ 19:00',
        holiday: '공휴일',
        goodPrice: true,
        editorNote: '합리적인 가격으로 변신을 돕는 염색 전문점',
      },
    ],
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
      try {
        const raw = localStorage.getItem('selectedLocation');
        const saved = raw ? JSON.parse(raw) : null;
        const name = saved?.district || saved?.city;
        if (name) setCurrentLoc(name);
      } catch {}
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
    <NavLayout>
      <div className="w-full min-h-screen mx-auto bg-white flex flex-col">
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

        {/* 리스트 영역 */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
          <div className="grid grid-cols-2 gap-[13px] px-4 pb-4">
            {items.slice(0, visibleCount).map((item, idx) => (
              <div
                key={idx}
                onClick={() => navigate('/support-detail', { state: item })}
                className="cursor-pointer h-auto rounded-lg bg-white flex flex-col border-none overflow-hidden"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <div className="p-2 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h2 className="support-factor-name-font">{item.title}</h2>
                    <MovetoIcon className="w-4 h-4" />
                  </div>
                  <p className="support-detail-font whitespace-pre-line">
                    {item.address}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="support-price-font">{item.tag}</span>
                    <LineIcon className="h-4" />
                    <span className="support-price-font">{item.price}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* 더보기 버튼 */}
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
    </NavLayout>
  );
}
