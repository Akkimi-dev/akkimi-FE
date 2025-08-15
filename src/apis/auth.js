import { axiosInstance } from './axios';

const login = async (code) => {
    const res = await axiosInstance.post('/auth/kakao/callback',{
        code,
    });
    return res.data;
};

export default login;