import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useKakaoLogin } from '../../hooks/auth/useLogin';

export default function KakaoRedirect(){
  const navigate = useNavigate();
  const location = useLocation();
  const { mutateAsync } = useKakaoLogin();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');

    if (!code) {
      navigate('/auth');
      return;
    }

    (async () => {
      try {
        await mutateAsync(code);
        navigate('/');
      } catch (err) {
        console.log(err);
        navigate('/auth');
      }
    })();
    
  }, [location.search, navigate, mutateAsync]);

  return <div className='bg-gradient-to-b from-login-start to-login-end  min-h-[100dvh] md:min-h-[800px]'></div>;
};