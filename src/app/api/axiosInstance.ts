import axios from "axios";

// 프로덕션에서는 직접 백엔드 URL, 개발에서는 상대 경로 (Next.js 프록시 사용)
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api/v1/admin'
  : process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1/admin';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// 요청 인터셉터를 추가하여 인증 토큰을 헤더에 포함
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
