import axiosInstance from "./axios";

// 프로필 조회
export const getUserProfile = async () => {
  const { data } = await axiosInstance.get("/api/v1/users");
 return data?.result ?? {}; 
};

// 닉네임 변경
export const changeNickname = async (nickname) => {
  const { data } = await axiosInstance.put("/api/v1/users/nickname", {
    nickname,
  });
  return data.result;
};

// 소비캐릭터 설정 및 수정
export const setCharacter = async (characterId) => {
  const { data } = await axiosInstance.put(`/api/v1/users/character/${characterId}`);
  return data.result;
};

// 설정한 말투 조회
export const getCurrentMaltu = async () => {
  const { data } = await axiosInstance.get("/api/v1/users/current-maltu");
  return data.result;
};

// 말투 설정
export const setMaltu = async (maltuId) => {
const { data } = await axiosInstance.put(`/api/v1/users/current-maltu/${maltuId}`);
  return data.result;};

// 지역 변경
export const changeRegion = async (region) => {
  const { data } = await axiosInstance.put("/api/v1/users/region", {
    region,
  });
  return data.result;
};

// 비밀번호 변경
export const changePassword = async ({ oldPassword, newPassword }) => {
  const { data } = await axiosInstance.patch("/api/v1/users/password", {
    oldPassword,
    newPassword,
  });
  return data.result;
};

// Setup 확인 여부 조회
export const checkSetup = async () => {
  const { data } = await axiosInstance.get("/api/v1/users");
  return data.result;
};
