import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import LoginSelect from "../components/auth/LoginSelect";
import Login from '../components/auth/Login';
import Signup from '../components/auth/signup';

export default function AuthPage() {
  const [authFlow, setAuthFlow] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  // 특정 쿼리파라미터로 진입 시 상태 초기화
  useEffect(() => {
    const shouldReset = searchParams.get('reset') === '1' || searchParams.get('init') === '1';
    if (shouldReset) {
      setAuthFlow("");
      // URL에서 초기화 파라미터 제거 (뒤로가기 이력 오염 방지)
      const next = new URLSearchParams(searchParams);
      next.delete('reset');
      next.delete('init');
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const REDIRECT_URI    = import.meta.env.VITE_KAKAO_REDIRECT_URI;
  const REST_API_KEY    = import.meta.env.VITE_KAKAO_API_KEY;
  const kakaoURL        = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;

  const handleKakaoLogin = () => {
    window.location.href = kakaoURL;
  };

  if (authFlow === 'phone' || authFlow === 'email') {
    return(
      <Login flow={authFlow} onInit={() => setAuthFlow("")}/>
    )
  }
  if (authFlow === 'phone_signup' || authFlow === 'email_signup') {
    return(
      <Signup flow={authFlow} onInit={() => setAuthFlow("")}/>
    )
  }

  return (
    <LoginSelect
    onChoose={(type) =>
      (type === "kakao" || type === "kakao_signup")
        ? handleKakaoLogin()
        : setAuthFlow(type)
    }
  />
  );
}