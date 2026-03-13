import axios, { AxiosError } from 'axios';

const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

request.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

request.interceptors.response.use(
  (response) => {
    const data = response.data as { code: number; message: string; data: any };
    // 检查业务状态码，如果不是 200 则抛出错误
    if (data && data.code !== undefined && data.code !== 200) {
      const error: any = new Error(data.message || '请求失败');
      error.code = data.code;
      error.response = response;
      return Promise.reject(error);
    }
    return response.data;
  },
  (error: AxiosError<{ code: number; message: string; data: { message: string } }>) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/admin/login';
      }
    }

    // Extract error message from response
    const errorMessage = error.response?.data?.message || error.message || '请求失败';

    // Return a more detailed error object
    const errorObj = {
      ...error,
      message: errorMessage,
      response: error.response ? {
        ...error.response,
        data: error.response.data
      } : undefined
    };

    return Promise.reject(errorObj);
  }
);

export default request;
