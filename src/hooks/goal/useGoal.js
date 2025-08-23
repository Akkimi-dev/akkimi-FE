import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createSavingGoal,
  getGoalDetail,
  updateGoal,
  deleteGoal,
  getGoals,
  getCurrentGoals,
} from '../../apis/goal';

// 전체 목표 목록
export const useGoals = () => {
  return useQuery({
    queryKey: ['goals'],
    queryFn: getGoals,
    staleTime: 10_000,
  });
};

// 현재(활성) 목표 목록
export const useCurrentGoals = () => {
  return useQuery({
    queryKey: ['currentGoals'],
    queryFn: getCurrentGoals,
    staleTime: 10_000,
  });
};

// 목표 상세
export const useGoalDetail = (goalId) => {
  return useQuery({
    queryKey: ['goalDetail', goalId],
    queryFn: () => getGoalDetail(goalId),
    enabled: !!goalId,
  });
};

// 목표 생성
export const useCreateSavingGoal = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => createSavingGoal(payload),
    ...options,
    onSuccess: (data, variables, context) => {
      // 목록/활성 목록 무효화
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['currentGoals'] });
      if (typeof options.onSuccess === 'function') {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      if (typeof options.onError === 'function') {
        options.onError(error, variables, context);
      }
    },
  });
};

// 목표 수정
export const useUpdateGoal = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ goalId, payload }) => updateGoal(goalId, payload),
    ...options,
    onSuccess: (data, variables, context) => {
      const id = variables?.goalId ?? data?.id;
      if (id) queryClient.invalidateQueries({ queryKey: ['goalDetail', id] });
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['currentGoals'] });
      if (typeof options.onSuccess === 'function') {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      if (typeof options.onError === 'function') {
        options.onError(error, variables, context);
      }
    },
  });
};

// 목표 삭제
export const useDeleteGoal = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (goalId) => deleteGoal(goalId),
    ...options,
    onSuccess: (data, variables, context) => {
      const id = variables ?? data?.deletedId;
      if (id) queryClient.invalidateQueries({ queryKey: ['goalDetail', id] });
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['currentGoals'] });
      if (typeof options.onSuccess === 'function') {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      if (typeof options.onError === 'function') {
        options.onError(error, variables, context);
      }
    },
  });
};