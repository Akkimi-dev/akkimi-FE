import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createConsumption,
  deleteConsumption as deleteConsumptionApi,
  updateConsumption as updateConsumptionApi,
  getMonthlyConsumptions,
  getMonthlyConsumptionsSummary,
  getDailyConsumptions,
} from '../../apis/consumption';

// 월간 소비 내역
export const useMonthlyConsumptions = (goalId, month) => {
  return useQuery({
    queryKey: ['monthlyConsumptions', goalId, month],
    queryFn: () => getMonthlyConsumptions(goalId, month),
    enabled: !!goalId && !!month,
  });
};

// 월간 요약
export const useMonthlyConsumptionsSummary = (goalId, month) => {
  return useQuery({
    queryKey: ['monthlyConsumptionsSummary', goalId, month],
    queryFn: () => getMonthlyConsumptionsSummary(goalId, month),
    enabled: !!goalId && !!month,
  });
};

// 일간 소비 내역
export const useDailyConsumptions = (goalId, date) => {
  return useQuery({
    queryKey: ['dailyConsumptions', goalId, date],
    queryFn: () => getDailyConsumptions(goalId, date),
    enabled: !!goalId && !!date,
  });
};

// 생성
export const useCreateConsumption = (goalId, date, options = {}) => {
  const queryClient = useQueryClient();
  const monthKey = typeof date === 'string' ? date.slice(0, 7) : undefined; // YYYY-MM-DD -> YYYY-MM

  return useMutation({
    mutationFn: (payload) => createConsumption(goalId, date, payload),
    ...options,
    onSuccess: (data, variables, context) => {
      if (goalId && date) {
        queryClient.invalidateQueries({ queryKey: ['dailyConsumptions', goalId, date] });
      }
      if (goalId) {
        if (monthKey) {
          queryClient.invalidateQueries({ queryKey: ['monthlyConsumptions', goalId, monthKey] });
          queryClient.invalidateQueries({ queryKey: ['monthlyConsumptionsSummary', goalId, monthKey] });
        } else {
          queryClient.invalidateQueries({ queryKey: ['monthlyConsumptions', goalId] });
          queryClient.invalidateQueries({ queryKey: ['monthlyConsumptionsSummary', goalId] });
        }
      }
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

// 삭제
export const useDeleteConsumption = (goalId, date, options = {}) => {
  const queryClient = useQueryClient();
  const monthKey = typeof date === 'string' ? date.slice(0, 7) : undefined;

  return useMutation({
    mutationFn: (consumptionId) => deleteConsumptionApi(consumptionId),
    ...options,
    onSuccess: (data, variables, context) => {
      if (goalId && date) {
        queryClient.invalidateQueries({ queryKey: ['dailyConsumptions', goalId, date] });
      }
      if (goalId) {
        if (monthKey) {
          queryClient.invalidateQueries({ queryKey: ['monthlyConsumptions', goalId, monthKey] });
          queryClient.invalidateQueries({ queryKey: ['monthlyConsumptionsSummary', goalId, monthKey] });
        } else {
          queryClient.invalidateQueries({ queryKey: ['monthlyConsumptions', goalId] });
          queryClient.invalidateQueries({ queryKey: ['monthlyConsumptionsSummary', goalId] });
        }
      }
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

// 수정
export const useUpdateConsumption = (goalId, date, options = {}) => {
  const queryClient = useQueryClient();
  const monthKey = typeof date === 'string' ? date.slice(0, 7) : undefined;

  return useMutation({
    mutationFn: ({ consumptionId, payload }) => updateConsumptionApi(consumptionId, payload),
    ...options,
    onSuccess: (data, variables, context) => {
      if (goalId && date) {
        queryClient.invalidateQueries({ queryKey: ['dailyConsumptions', goalId, date] });
      }
      if (goalId) {
        if (monthKey) {
          queryClient.invalidateQueries({ queryKey: ['monthlyConsumptions', goalId, monthKey] });
          queryClient.invalidateQueries({ queryKey: ['monthlyConsumptionsSummary', goalId, monthKey] });
        } else {
          queryClient.invalidateQueries({ queryKey: ['monthlyConsumptions', goalId] });
          queryClient.invalidateQueries({ queryKey: ['monthlyConsumptionsSummary', goalId] });
        }
      }
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
