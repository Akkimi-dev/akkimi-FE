import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './stores/useAuthStore';

// 보호 라우트: 로그인 필요
export function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuthStore();
  const location = useLocation();
  if (isLoggedIn) return children;
  return <Navigate to="/auth" replace state={{ from: location }} />;
}

// 공개 전용 라우트: 로그인 상태면 접근 차단
export function PublicOnlyRoute({ children }) {
  const { isLoggedIn } = useAuthStore();
  if (!isLoggedIn) return children;
  return <Navigate to="/" replace />;
}