import { useLocation, useNavigate } from 'react-router-dom';
import LocationIcon from '../../assets/support/location.svg?react';
import GobackIcon from '../../assets/support/goback.svg?react';
import MovetoIcon from '../../assets/support/moveto.svg?react';
import PhoneIcon from '../../assets/support/phone.svg?react';
import CopyIcon from '../../assets/support/copy.svg?react';
import ClockIcon from '../../assets/support/clock.svg?react';
import NoNavLayout from "../../components/layouts/NoNavLayout";

export default function SupportDetail() {
  const nav = useNavigate();
  const { state } = useLocation();
  const item = state ?? {};

  const {
    image,
    title = '상호명',
    address = '',
    phone = '정보 없음',
    hours = '정보 없음',
    holiday = '',
    goodPrice = false,
    editorNote,
  } = item;

  const openNaverMap = () => {
    if (!address) return;
    const q = encodeURIComponent(address);
    window.open(`https://map.naver.com/v5/search/${q}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <NoNavLayout>
    <div className="max-w-full h-[700px] mx-auto bg-white overflow-y-auto no-scrollbar">
      {/* 히어로: 좌우 풀블리드 */}
      <div className="relative w-full h-[260px] overflow-hidden z-0">
        <img src={image} alt={title} className="block w-full h-full object-cover" />
        {/* 이미지 위 그라디언트 */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background:
              'linear-gradient(0deg, rgba(255, 255, 255, 0.00) 0%, rgba(0, 0, 0, 0.60) 100%)',
          }}
        />

        {/* 상태바자리였지만 그냥 패딩용으로 쓰기로 함*/}
        {/* <div
          className="absolute inset-x-0 top-0 z-10 flex items-center justify-between text-white"
          style={{
            paddingTop: 'calc(max(env(safe-area-inset-top), 19px))',
            paddingBottom: '19px',
            paddingLeft: '43px',
            paddingRight: '36px',
          }}
        >
        </div> */}

        {/* 뒤로가기 */}
        <button
          onClick={() => nav(-1)}
          className="absolute left-0 z-10"
          style={{ top: 'calc(max(env(safe-area-inset-top), 19px))', padding: '14px' }}
          aria-label="뒤로가기"
        >
          <GobackIcon className="w-[24px] h-[24px]" />
        </button>
      </div>

      {/* 카드: 히어로와 40px 겹치기(-mt-10), 위쪽만 라운드 32px / 바깥 좌우 여백 없음 */}
      <div className="-mt-10 relative z-20 w-full">
        <div
          className="bg-white py-6 shadow-[0_-6px_12px_rgba(0,0,0,0.03)] rounded-t-[32px]"
          style={{ borderTopLeftRadius: 32, borderTopRightRadius: 32 }}
        >
          {/* 내부 내용만 좌우 패딩 유지 */}
          <div className="px-4">
            {/* 배지 */}
            <div className="mb-4">
              <span
                className={
                  goodPrice
                    ? 'flex justify-center items-center w-[93px] h-[26px] px-2 py-1 rounded-[30px] bg-[#CAF6EC] text-[12px] support-goodprice-badge-font'
                    : 'flex justify-center items-center w-[68px] h-[26px] px-2 py-1 rounded-[30px] border border-[#CAF6EC] text-[12px] support-akke-badge-font'
                }
              >
                {goodPrice ? '착한 가격 업소' : '아껴바요'}
              </span>
            </div>

            {/* 상호명 + 네이버 지도로 이동 (한 줄) */}
            <div className="flex items-center justify-between">
              <h1 className="support-detail-name-font">{title}</h1>
              <button
                onClick={openNaverMap}
                className="support-goto-navermap-font underline underline-offset-4"
              >
                네이버 지도로 이동
              </button>
            </div>

            {/* 구분선 */}
            <div className="h-px bg-[#DDE2E7] my-6" />

            {/* 주소 */}
            <button
              onClick={openNaverMap}
              className="w-full h-[56px] text-left flex items-center justify-between gap-3 px-4 py-4 rounded-[16px] border border-[#DDE2E7] bg-white mb-4"
            >
              <div className="flex items-center gap-3">
                <LocationIcon className="w-6 h-6" />
                <span className="support-detail-address-font">{address || '주소 정보 없음'}</span>
              </div>
              <MovetoIcon className="w-5 h-5" />
            </button>

            {/* 전화 */}
            <div className="w-full h-[56px] flex items-center justify-between gap-3 px-4 py-4 rounded-[16px] border border-[#DDE2E7] bg-white mb-4">
              <div className="flex items-center gap-3">
                <PhoneIcon className="w-6 h-6" />
                <span className="support-detail-phone-font">{phone}</span>
              </div>
              <button
                onClick={() => navigator.clipboard?.writeText(phone)}
                aria-label="전화번호 복사"
                className="p-0"
              >
                <CopyIcon className="w-6 h-6" />
              </button>
            </div>

            {/* 영업시간 */}
            <div className="w-full px-4 py-4 rounded-[16px] border border-[#DDE2E7] bg-white mb-4">
              <div className="flex items-start gap-3">
                <ClockIcon className="w-6 h-6 mt-[2px]" />
                <div className="flex flex-col">
                  <span className="support-detail-time-font">{hours}</span>
                  {holiday && (
                    <span className="support-detail-notime-font mt-1">휴무 : {holiday}</span>
                  )}
                </div>
              </div>
            </div>

            {/* 에디터의 한마디 (항상 표시) */}
            <div className="mt-8 flex flex-col items-start gap-[10px] p-4 self-stretch rounded-[16px] border border-[#DDE2E7] bg-[#CAF6EC]">
              <p className="support-detail-editor-font">에디터의 한마디</p>
              <p className="support-detail-editor2-font">
                {(editorNote?.trim()) || '아끼미가 추천하는 가게입니다!'}
              </p>
            </div>

            {/* 하단 여백 */}
            <div className="h-4" />
          </div>
        </div>
      </div>
    </div>
    </NoNavLayout>
  );
}
