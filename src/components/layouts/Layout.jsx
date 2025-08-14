import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className=" min-h-[100dvh] md:h-screen bg-gray-100 flex justify-center items-center">
      {/* 안쪽: 실제 앱 캔버스. 모바일 퍼스트: 가로는 100%, 데스크탑에서는 최대 420px로 고정 */}
      <div
        className="w-full max-w-[420px] bg-white md:border md:shadow overflow-hidden min-h-[100dvh] md:h-[800px] md:min-h-[600px] "
      >
        {/* 스크롤은 내부에서만 발생하도록 처리 (바디 스크롤 방지) */}
        <main className="min-h-[100dvh] overflow-y-auto overscroll-contain">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
