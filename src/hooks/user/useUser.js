import { useQuery, useMutation, useQueryClient } from "react-query";
import { getUserProfile, changeNickname, setMaltu, changeRegion } from "../../apis/userApis";

{/*프로필 정보를 가져오는 훅 (GET)
 @returns {object} 프로필 데이터, 로딩 상태, 에러 상태 등*/}
export const useUserProfile = () => {
  return useQuery("userProfile", getUserProfile);
};

{/*닉네임을 변경하는 훅 (PUT)
 @returns {object} 닉네임 변경 함수, 로딩 상태 등*/}
export const useUpdateNickname = () => {
  const queryClient = useQueryClient();
  return useMutation(changeNickname, {
    onSuccess: (data) => {
      console.log("✅ 닉네임 변경 성공:", data);
      // 'userProfile' 쿼리 캐시를 무효화하여 최신 데이터로 다시 가져옴
      queryClient.invalidateQueries("userProfile");
    }
  });
};

{/*말투를 설정하는 훅 (PUT)
  @returns {object} 말투 설정 함수, 로딩 상태 등*/}
export const useSetMaltu = () => {
  const queryClient = useQueryClient();
  return useMutation(setMaltu, {
    onSuccess: (data) => {
      console.log("✅ 말투 설정 성공:", data);
      queryClient.invalidateQueries("userProfile");
    }
  });
};

{/*지역을 변경하는 훅 (PUT)
 @returns {object} 지역 변경 함수, 로딩 상태 등*/}
export const useChangeRegion = () => {
  const queryClient = useQueryClient();
  return useMutation(changeRegion, {
    onSuccess: (data) => {
      console.log("✅ 지역 변경 성공:", data);
      queryClient.invalidateQueries("userProfile");
    }
  });
};