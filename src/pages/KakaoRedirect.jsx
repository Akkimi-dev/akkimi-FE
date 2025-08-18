import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { kakaoLogin } from '../apis/auth';
import {useAuthStore} from '../stores/useAuthStore'

export default function KakaoRedirect(){
  const navigate = useNavigate();
  const location = useLocation();
  const { setTokens } = useAuthStore();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');

    if (!code) {
      navigate('/auth');
      return;
    }

    const login = async () => {
      try {
        const { accessToken, refreshToken } = await kakaoLogin(code);
        setTokens(accessToken, refreshToken);
        navigate('/');
      } catch (err) {
        console.log(err)
        navigate('/auth');
      }
    };

    login(); 

    // console.log('카카오 인가 코드:', code);
    
  }, [location.search, navigate, setTokens]);

  return <div className='bg-gradient-to-b from-login-start to-login-end  min-h-[100dvh] md:min-h-[800px]'></div>;
};