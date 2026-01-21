import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { InternalAxiosRequestConfig } from 'axios';

/* ====== CHỈ SỬA IP Ở ĐÂY ====== */
export const API_HOST = 'http://172.20.10.3:8080';

/* ====== CÁC ĐƯỜNG DẪN CHUẨN ====== */
export const API_BASE = `${API_HOST}/api`;
export const PUBLIC_API = `${API_BASE}/public`;
export const IMAGE_API = `${PUBLIC_API}/products/image/`;

/* ====== AXIOS ====== */
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

/* ====== TỰ ĐỘNG GẮN TOKEN ====== */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem('jwt-token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  }
);

export default apiClient;
