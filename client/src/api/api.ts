import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let onTokenExpire: (() => void) | null = null;

export function setOnTokenExpire(callback: () => void) {
  onTokenExpire = callback;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const code = error.response?.data?.code;

    if (code === "TOKEN_INVALIDE") {
      localStorage.removeItem("token");
      if (onTokenExpire) {
        onTokenExpire();
      }
    }

    return Promise.reject(error);
  },
);
