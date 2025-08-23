import api from "./axios";

// 말투 생성
export const createMaltu = async (payload) => {
  const response = await api.post("/api/v1/maltus", payload);
  return response.data;
};

// 말투 상세 조회
export const getMaltuDetail = async (maltuId) => {
  const response = await api.get(`/api/v1/maltus/${maltuId}`);
  return response.data;
};

// 모든 공유된 말투 목록 조회
export const getPublicMaltus = async () => {
  const response = await api.get("/api/v1/maltus/public/list");
  return response.data;
};

// 내가 생성한 말투 목록 조회
export const getMyMaltus = async () => {
  const response = await api.get("/api/v1/maltus/mine/list");
  return response.data;
};

// 기본 말투 목록 조회
export const getDefaultMaltus = async () => {
  const response = await api.get("/api/v1/maltus/default");
  return response.data;
};

// 내가 생성한 말투 수정
export const updateMaltu = async (maltuId, payload) => {
  const response = await api.put(`/api/v1/maltus/${maltuId}`, payload);
  return response.data;
};

// 말투 공유 수정
export const updateMaltuShare = async (maltuId, isPublic) => {
  const response = await api.put(`/api/v1/maltus/${maltuId}?isPublic=${isPublic}`);
  return response.data;
};

// 생성한 말투 삭제
export const deleteMaltu = async (maltuId) => {
  const response = await api.delete(`/api/v1/maltus/${maltuId}`);
  return response.data;
};