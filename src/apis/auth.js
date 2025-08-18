import { axiosInstance } from './axios';

// 아이디 유효성(중복 검사)
const validatePhone = async (phoneNumber) => {
  const res = await axiosInstance.post('/api/v1/auth/validate/phone', { phoneNumber });
  return res.data;
};

const validateEmail = async (email) => {
  const res = await axiosInstance.post('/api/v1/auth/validate/email', { email });
  return res.data;
};

// 회원가입
const signupPhone = async (phoneNumber, password) => {
  const res = await axiosInstance.post('/api/v1/auth/signup/phone', { phoneNumber, password });
  return res.data;
};

const signupEmail = async (email, password) => {
  const res = await axiosInstance.post('/api/v1/auth/signup/email', { email, password });
  return res.data;
};

// 로그인
const loginPhone = async (phoneNumber, password) => {
  const res = await axiosInstance.post('/api/v1/auth/login/phone', { phoneNumber, password });
  return res.data;
};

const loginEmail = async (email, password) => {
  const res = await axiosInstance.post('/api/v1/auth/login/email', { email, password });
  return res.data;
};

// 카카오 로그인
const kakaoLogin = async (code) => {
  const res = await axiosInstance.post('/api/v1/auth/kakao', {
    code,
  });
  console.log(res);
  return res.data;
};

// 로그아웃
const logout = async (refreshToken) => {
  const res = await axiosInstance.post('/api/v1/auth/logout', { refreshToken });
  return res.data;
};

// 엑세스 토큰 재발급
const refreshAccessToken = async (refreshToken) => {
  const res = await axiosInstance.post('/api/v1/auth/refresh', { refreshToken });
  return res.data;
};


//
const getMe = async () => {
  const res = await axiosInstance.get('/api/v1/auth/me');
  return res.data;
};



export {
  validatePhone,
  validateEmail,
  signupPhone,
  signupEmail,
  loginPhone,
  loginEmail,
  logout,
  refreshAccessToken,
  kakaoLogin,
  getMe,
};