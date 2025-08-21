import { Outlet } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

export default function Layout() {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  if (isMobile) {
    return (
      <div className="w-full h-[100dvh] bg-white relative">
        <div id="layout-portal" className="absolute inset-0 pointer-events-none" />
        <Outlet />
      </div>
    );
  } else {
    return (
      <div className="relative h-[100dvh] flex justify-around items-center bg-green">
        <div className="w-[375px] bg-white xs:h-[667px]">
          <div id="layout-portal" className="absolute inset-0 pointer-events-none" />
          <Outlet />
        </div>
        <div className="w-[375px] px-6">
          <div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-6 shadow-sm">
            <h2 className="text-heading-01-bold">모바일 전용 서비스</h2>
            <p className="mt-2 text-body-02-regular text-gray-600">
              이 서비스는 모바일 환경에 최적화되어 있습니다.
            </p>
            <div className="mt-4 space-y-2 text-body-02-regular text-gray-700">
              <p>이용 방법</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>휴대폰으로 접속해 사용하세요.</li>
                <li>또는 왼쪽 앱 미리보기에서 핵심 기능을 확인할 수 있습니다.</li>
              </ul>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-2">
              <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-gray-600">
                데스크톱에서는 일부 인터랙션이 제한될 수 있습니다.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}