import { axiosInstance } from './axios';

const login = async (code) => {
    const res = await axiosInstance.post('/api/v1/auth/kakao',{
        code,
    });
    console.log(res)
    return res.data;
};

export default login;