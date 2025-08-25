import  { axiosInstance }  from './axios';

/**
 * POST /api/v1/sav1ng-goals
 * 새로운 절약 목표 생성
 */
export const createSavingGoal = async (payload) => {
  const res = await axiosInstance.post('/api/v1/saving-goals', payload);
  return res.data.result;
};

/**
 * GET /api/v1/goals/{goalId}
 * 절약 목표 상세 조회
 */
export const getGoalDetail = async (goalId) => {
  const res = await axiosInstance.get(`/api/v1/goals/${goalId}`);
  return res.data.result;
};

/**
 * PATCH /api/v1/goals/{goalId}
 * 절약 목표 수정
 */
export const updateGoal = async (goalId, payload) => {
  const res = await axiosInstance.patch(`/api/v1/goals/${goalId}`, payload);
  return res.data.result;
};

/**
 * DELETE /api/v1/goals/{goalId}
 * 절약 목표 삭제
 */
export const deleteGoal = async (goalId) => {
  const res = await axiosInstance.delete(`/api/v1/goals/${goalId}`);
  return res.data.result;
};

/**
 * GET /api/v1/goals
 * 절약 목표 전체 조회
 */
export const getGoals = async () => {
  const res = await axiosInstance.get('/api/v1/goals');
  return res.data.result;
};

/**
 * GET /api/v1/goals/current
 * 현재 절약 목표 전체 조회(활성 목표 목록)
 */
export const getCurrentGoals = async () => {
  const res = await axiosInstance.get('/api/v1/goals/current');
  return res.data.result;
};