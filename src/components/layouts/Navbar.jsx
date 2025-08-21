import HomeIcon from '../../assets/navbar/home.svg?react';
import LedgerIcon from '../../assets/navbar/ledger.svg?react';
import AkkimiIcon from '../../assets/navbar/akkimi.svg?react';
import SavingIcon from '../../assets/navbar/saving.svg?react';
import ProfileIcon from '../../assets/navbar/profile.svg?react';

import HomeHover from '../../assets/navbar/homeHover.svg?react';
import LedgerHover from '../../assets/navbar/ledgerHover.svg?react';
import SavingHover from '../../assets/navbar/savingHover.svg?react';
import ProfileHover from '../../assets/navbar/profileHover.svg?react';

import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    console.log('Home button clicked');
    navigate('/');
  };

  const handleLedgerClick = () => {
    console.log('Ledger button clicked');
    navigate('/calendar'); // TODO: change to '/ledger' if you create that route
  };

  const handleAkkimiClick = () => {
    console.log('Akkimi button clicked');
    navigate('/chatbot');
  };

  const handleSavingClick = () => {
    console.log('Saving button clicked');
    navigate('/support');
  };

  const handleProfileClick = () => {
    console.log('Profile button clicked');
    navigate('/settings');
  };

  return (
    <nav className="fixed xs:absolute xs:inset-x-0 bottom-0 z-50 w-full max-w-[768px] bg-white border-t border-nav-b">
      {/* 내용 래퍼: 고정 폭 393px, 중앙 정렬 */}
      <div className="relative mx-auto w-full">
        {/* 좌/우 그룹 + 중앙 버튼 오버레이 */}
        <div className="w-full flex items-end justify-around">
          {/* 좌측 그룹 */}
          <div className="flex flex-1 justify-around pt-1 pb-2">
            <button onClick={handleHomeClick} className="group cursor-pointer h-[56px] w-[56px] flex flex-col items-center justify-center gap-1">
              <HomeIcon className="w-6 h-6 block group-hover:hidden" />
              <HomeHover className="w-6 h-6 hidden group-hover:block" />
              <span className="text-detail-02-semibold text-gray-60 group-hover:text-gray-80 ">홈</span>
            </button>
            <button onClick={handleLedgerClick} className="group cursor-pointer h-[56px] w-[56px] flex flex-col items-center justify-center gap-1">
              <LedgerIcon className="w-6 h-6 block group-hover:hidden" />
              <LedgerHover className="w-6 h-6 hidden group-hover:block" />
              <span className="text-detail-02-semibold text-gray-60 group-hover:text-gray-80 ">가계부</span>
            </button>
          </div>

          <div className='w-[96px]'>
          {/* 가운데 플로팅 버튼: 레이아웃 비참여 */}
            <button
              onClick={handleAkkimiClick}
              className="cursor-pointer absolute left-1/2 -translate-x-1/2 -top-[19px] flex w-[72px] h-[72px] pt-2 px-3 pb-0 items-start justify-center gap-[10px] shrink-0 rounded-full shadow-[0_2px_4px_0_#0000001A] bg-green-main-dark border border-green-main-dark-2 hover:border-green-main"
            >
              <div className='bg-[#03FFDA]'>
                <AkkimiIcon className="w-12 h-12" />  
              </div>
            </button>
          </div>

          {/* 우측 그룹 */}
          <div className="flex flex-1 justify-around pt-1 pb-2">
            <button onClick={handleSavingClick} className="group cursor-pointer h-[56px] w-[56px] flex flex-col items-center justify-center gap-1">
              <SavingIcon className="w-6 h-6 block group-hover:hidden" />
              <SavingHover className="w-6 h-6 hidden group-hover:block" />
              <span className="text-detail-02-semibold text-gray-60 group-hover:text-gray-80 ">아껴바요</span>
            </button>
           <button onClick={handleProfileClick} className="group cursor-pointer h-[56px] w-[56px] flex flex-col items-center justify-center gap-1">
              <ProfileIcon className="w-6 h-6 block group-hover:hidden" />
              <ProfileHover className="w-6 h-6 hidden group-hover:block" />
              <span className="text-detail-02-semibold text-gray-60 group-hover:text-gray-80 ">프로필</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}