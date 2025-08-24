
import { axiosInstance } from './axios';

/**
 * 오늘의 소비 내역 등록
 * POST /api/v1/goals/{goalId}/days/{date}/consumptions
*/
export const createConsumption = async (goalId, date, payload) => {
  const res = await axiosInstance.post(
    `/api/v1/goals/${goalId}/days/${date}/consumptions`,
    payload
  );
  return res.data.result;
};

/**
 * 소비 내역 조회
 * GET /api/v1/consumptions/{consumptionId}
 */
export const getConsumption = async (consumptionId) => {
  const res = await axiosInstance.get(`/api/v1/consumptions/${consumptionId}`);
  return res.data.result;
};


/**
 * 소비 내역 삭제
 * DELETE /api/v1/consumptions/{consumptionId}
 */
export const deleteConsumption = async (consumptionId) => {
  const res = await axiosInstance.delete(`/api/v1/consumptions/${consumptionId}`);
  return res.data.result;
};

/**
 * 소비 내역 수정
 * PATCH /api/v1/consumptions/{consumptionId}
 */
export const updateConsumption = async (consumptionId, payload) => {
  const res = await axiosInstance.patch(`/api/v1/consumptions/${consumptionId}`, payload);
  return res.data.result;
};

/**
 * 특정 월의 모든 소비 내역 조회
 * GET /api/v1/goals/{goalId}/month?month=YYYY-MM
 */
export const getMonthlyConsumptions = async (goalId, month) => {
  const res = await axiosInstance.get(`/api/v1/goals/${goalId}/month`, {
    params: { month },
  });
  return res.data.result;
};

/**
 * 특정 월의 소비 내역 요약 조회
 * GET /api/v1/goals/{goalId}/month/summary?month=YYYY-MM
 */
export const getMonthlyConsumptionsSummary = async (goalId, month) => {
  const res = await axiosInstance.get(`/api/v1/goals/${goalId}/month/summary`, {
    params: { month },
  });
  return res.data.result;
};

/**
 * 특정 일의 소비 내역 조회
 * GET /api/v1/goals/{goalId}/days?date=YYYY-MM-DD
 */
export const getDailyConsumptions = async (goalId, date) => {
  const res = await axiosInstance.get(`/api/v1/goals/${goalId}/days`, {
    params: { date },
  });
  return res.data.result;
};