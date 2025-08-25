import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserProfile,
  changeNickname,
  setCharacter,
  getCurrentMaltu,
  setMaltu,
  changeRegion,
  changePassword,
  checkSetup,
} from "../../apis/userApis";

// 프로필 조회
export const useUserProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
  });
};

// 닉네임 변경
export const useUpdateNickname = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: changeNickname,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["checkSetup"] });
    },
  });
};

// 소비캐릭터 설정
export const useSetCharacter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: setCharacter,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["checkSetup"] });
    },
  });
};

// 현재 말투 조회
export const useCurrentMaltu = () => {
  return useQuery({
    queryKey: ["currentMaltu"],
    queryFn: getCurrentMaltu,
  });
};

// ✅ 현재 말투 설정 훅
export const useSetMaltu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (maltuId) => setMaltu(maltuId),
    onSuccess: async () => {
      // ✅ 말투 바꾼 후 프로필 & 현재 말투 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["defaultMaltus"] });
      queryClient.invalidateQueries({ queryKey: ["myMaltus"] });
      queryClient.setQueryData(['checkSetup'], { isSetup: true });
      await queryClient.invalidateQueries({ queryKey: ["checkSetup"] });  
    },
  });
};

// 지역 변경
export const useChangeRegion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: changeRegion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};

// 비밀번호 변경
export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
  });
};

// Setup 확인 여부
export const useCheckSetup = () => {
  return useQuery({
    queryKey: ["checkSetup"],
    queryFn: checkSetup,
  });
};
