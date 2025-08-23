import api from "./axios";

// 말투 생성
export const createMaltu = async (payload) => {
  const response = await api.post("/api/v1/maltus", payload);
  return response.data.result;
};

// 말투 상세 조회
export const getMaltuDetail = async (maltuId) => {
  const response = await api.get(`/api/v1/maltus/${maltuId}`);
  return response.data.result;
};

// 모든 공유된 말투 목록 조회
export const getPublicMaltus = async () => {
  const response = await api.get("/api/v1/maltus/public/list");
  return response.data.result;
};

// 내가 생성한 말투 목록 조회
export const getMyMaltus = async () => {
  const response = await api.get("/api/v1/maltus/mine/list");
  return response.data.result;
};

// 기본 말투 목록 조회
export const getDefaultMaltus = async () => {
  const response = await api.get("/api/v1/maltus/default");
  return response.data.result;
};

// 내가 생성한 말투 수정
export const updateMaltu = async (maltuId, payload) => {
  const response = await api.put(`/api/v1/maltus/${maltuId}`, payload);
  return response.data.result;
};

// 말투 공유 여부 수정
export const updateMaltuShare = async (maltuId, isPublic) => {
  const response = await api.put(`/api/v1/maltus/${maltuId}?isPublic=${isPublic}`);
  return response.data.result;
};

// 생성한 말투 삭제
export const deleteMaltu = async (maltuId) => {
  const response = await api.delete(`/api/v1/maltus/${maltuId}`);
  return response.data.result;
};

// ✅ 현재 말투 변경
export const setMaltu = async (maltuId) => {
  const response = await api.put(`/api/v1/users/current-maltu/${maltuId}`);
  return response.data.result;
};

// ✅ 현재 말투 조회
export const getCurrentMaltu = async () => {
  const res = await api.get("/api/v1/users/current-maltu");
  return res.data.result;
};
