import axios, { AxiosHeaders } from "axios";
import { buildAuthHeader, getAuthTokenFromCookie } from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // 例: https://api.example.com/api
  // withCredentials: true, // サーバがSet-Cookie(RT)を返す設計ならON。ただしCORS設定も要対応（後述）
});

// 起動時にCookieのATがあればヘッダに積む
api.interceptors.request.use((config) => {
  config.headers = AxiosHeaders.from({
    ...(config.headers || {}),
    ...buildAuthHeader(getAuthTokenFromCookie()),
  });
  return config;
});

export default api;
