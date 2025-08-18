import { useState } from 'react';
import LoginSelect from "../components/auth/LoginSelect";
import Login from '../components/auth/Login';
import Signup from '../components/auth/signup';

export default function AuthPage() {
  const [authFlow, setAuthFlow] = useState("");

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