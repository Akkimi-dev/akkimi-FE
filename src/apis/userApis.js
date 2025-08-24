import { axiosInstance } from "./axios";

// 프로필 조회
export const getUserProfile = async () => {
  const res = await axiosInstance.get("/api/v1/users");
 return res.data.result; 
};

// 닉네임 변경
export const changeNickname = async (nickname) => {
  const res = await axiosInstance.put("/api/v1/users/nickname", {
    nickname,
  });
  return res.data.result;
};

// 소비캐릭터 설정 및 수정
export const setCharacter = async (characterId) => {
  const res = await axiosInstance.put(`/api/v1/users/character/${characterId}`);
  return res.data.result;
};

// 설정한 말투 조회
export const getCurrentMaltu = async () => {
  const res = await axiosInstance.get("/api/v1/users/current-maltu");
  return res.data.result;
};

// 말투 설정
export const setMaltu = async (maltuId) => {
  const res = await axiosInstance.put(`/api/v1/users/current-maltu/${maltuId}`);
  return res.data.result;
};

// 지역 변경
export const changeRegion = async (region) => {
  const res = await axiosInstance.put("/api/v1/users/region", {
    region,
  });
  return res.data.result;
};

// 비밀번호 변경
export const changePassword = async ({ oldPassword, newPassword }) => {
  const res = await axiosInstance.patch("/api/v1/users/password", {
    oldPassword,
    newPassword,
  });
  return res.data.result;
};

// Setup 확인 여부 조회
export const checkSetup = async () => {
  const res = await axiosInstance.get("/api/v1/users/setup");
  return res.data.result;
};
