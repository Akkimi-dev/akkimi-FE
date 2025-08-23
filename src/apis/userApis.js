import api from "./axios";

// 프로필 조회
export const getUserProfile = async () => {
  const response = await api.get("/api/v1/users");
  console.log("요청 URL:", response.config.url);
  console.log("응답 Content-Type:", response.headers["content-type"]);
  return response.data;
};

// 닉네임 변경
export const changeNickname = async (nickname) => {
  const response = await api.put("/api/v1/users/nickname", { nickname });
  return response.data;
};

// 말투 설정
export const setMaltu = async (maltuId) => {
  const response = await api.put(`/api/v1/users/current-maltu/${maltuId}`);
  return response.data;
};

// 지역 변경
export const changeRegion = async (region) => {
  const response = await api.put("/api/v1/users/region", { region });
  return response.data;
};

// 소비 캐릭터 설정 (characterId 전달)
export const setCharacter = async (characterId) => {
  const response = await api.put(`/api/v1/users/character/${characterId}`);
  return response.data;
};

// isSetup 확인
export const checkIsSetup = async () => {
  const response = await api.get("/api/v1/users/setup");
  return response.data;
};

// 현재 말투 조회
export const getCurrentMaltu = async () => {
  const response = await api.get("/api/v1/users/current-maltu");
  return response.data;
};