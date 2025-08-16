import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="h-[100dvh] flex justify-center items-center bg-black">
      {/* 안쪽: 실제 앱 캔버스. 모바일 퍼스트: 가로는 100%, 데스크탑에서는 최대 420px로 고정 */}
      <div
        className="w-full max-w-[420px] bg-white h-[100dvh] sm:h-[700px]"
      >
        <Outlet />
      </div>
    </div>
  );
}
