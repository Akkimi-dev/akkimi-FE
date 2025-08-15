import HomeIcon from '../../assets/navbar/home.svg?react';
import LedgerIcon from '../../assets/navbar/ledger.svg?react';
import AkkimiIcon from '../../assets/navbar/akkimi.svg?react';
import SavingIcon from '../../assets/navbar/saving.svg?react';
import ProfileIcon from '../../assets/navbar/profile.svg?react';

export default function Navbar() {
  return (
    <nav className="absolute inset-x-0 bottom-0 z-50 w-full bg-white border-t border-nav-b">
      {/* 내용 래퍼: 고정 폭 393px, 중앙 정렬 */}
      <div className="relative mx-auto w-full">
        {/* 좌/우 그룹 + 중앙 버튼 오버레이 */}
        <div className="w-full flex items-end justify-around">
          {/* 좌측 그룹 */}
          <div className="flex flex-1 justify-around pt-1 pb-2">
            <button className="h-[56px] w-[56px] flex flex-col items-center justify-center gap-1">
              <HomeIcon className="w-6 h-6 " />
              <span className="text-detail-02-semibold text-gray-60 ">홈</span>
            </button>
            <button className="h-[56px] w-[56px] flex flex-col items-center justify-center gap-1">
              <LedgerIcon className="w-6 h-6 " />
              <span className="text-detail-02-semibold text-gray-60 ">가계부</span>
            </button>
          </div>

          <div className='w-[96px]'>
          {/* 가운데 플로팅 버튼: 레이아웃 비참여 */}
            <button
              className="absolute left-1/2 -translate-x-1/2 -top-[19px] flex w-[72px] h-[72px] pt-2 px-3 pb-0 items-start justify-center gap-[10px] shrink-0 rounded-full shadow-[0_2px_4px_0_#0000001A] bg-chat border border-chat-b"
            >
              <div className='bg-[#03FFDA]'>
                <AkkimiIcon className="w-12 h-12" />  
              </div>
            </button>
          </div>

          {/* 우측 그룹 */}
          <div className="flex flex-1 justify-around pt-1 pb-2">
            <button className="h-[56px] w-[56px] flex flex-col items-center justify-center gap-1">
              <SavingIcon className="w-6 h-6" />
              <span className="text-detail-02-semibold text-gray-60 ">아껴바요</span>
            </button>
           <button className="h-[56px] w-[56px] flex flex-col items-center justify-center gap-1">
              <ProfileIcon className="w-6 h-6" />
              <span className="text-detail-02-semibold text-gray-60 ">프로필</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
