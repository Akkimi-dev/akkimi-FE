import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useKakaoLogin } from '../../hooks/auth/useLogin';
import { useAuthStore } from '../../stores/useAuthStore';

export default function KakaoRedirect(){
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate } = useKakaoLogin();
  const setTokens = useAuthStore((s) => s.setTokens);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');

    if (!code) {
      navigate('/auth');
      return;
    }

    mutate(code, {
      onSuccess: (data) => {
        setTokens(data.accessToken, data.refreshToken);
        navigate('/', { replace: true });
      },
      onError: (error) => {
        console.error('[KakaoRedirect] 로그인 실패:', error);
        navigate('/auth', { replace: true });
      },
    });
    
  }, [location.search, navigate, mutate, setTokens]);

  return <div className='bg-gradient-to-b from-login-start to-login-end  min-h-[100dvh] md:min-h-[800px]'></div>;
};