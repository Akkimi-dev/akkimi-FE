import axios from 'axios';
import { useAuthStore } from '../stores/useAuthStore';

const gotoAuth = () => {
  // 뒤로가기 시 보호 페이지로 되돌아오지 않도록 replace 사용
  window.location.replace('/auth');
};

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // 백엔드 URL .env로
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
   
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 재발급 중복을 막기 위한 변수
let isRefreshing = false;
// 재발급 처리 프로미스 객체
let refreshPromise = null;

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    // 백엔드 토큰 만료 상태 코드가 완전하지 않아 임시로...
    if ([401, 403].includes(status)) {
      const originalRequest = error.config;

      // 무한 루프 방지 이미 재발급 처리를 한 요청 -> 로그아웃
      // 즉, 토큰 문제가 아닌 다른 오류에 의한 에러 -> 백엔드 상태 코드 정상화 이후에는 크게 필요 x
      if (originalRequest._retry) {
        useAuthStore.getState().clearTokens();
        gotoAuth();
        return Promise.reject(error);
      }

      const { refreshToken } = useAuthStore.getState();
  
      // 리프레시 토큰 없을시 -> 에러
      if (!refreshToken) {
        return Promise.reject(error);
      }

      try {
        // 재발급 중일 경우에는 처리 x
        // api 두개 동시 요청 -> 재발급 2번 상황 방지
        if (!isRefreshing) {
          isRefreshing = true;
          // 재발급 용 객체
          refreshPromise = axios
            // 재발급
            .post(`${import.meta.env.VITE_API_URL}/api/v1/auth/refresh`, { refreshToken })
            .then((res) => {
              const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data?.result || {};
              // 재발급 실패시 에러 -> catch해서 로그아웃
              if (!newAccessToken || !newRefreshToken) throw new Error('Invalid refresh response');
              useAuthStore.getState().setTokens(newAccessToken, newRefreshToken);
              return newAccessToken;
            })
            .finally(() => {
              isRefreshing = false;
            });
        }

        const newAccessToken = await refreshPromise;
        // 성공 실패 여부에 관계없이 원래 요청은 이 함수가 다시 인터셉트 해도 pass
        originalRequest._retry = true;
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        // 원래 요청 재발급된 토큰으로 요청
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // 재발급 실패시 로그아웃 처리
        useAuthStore.getState().clearTokens();
        gotoAuth();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
