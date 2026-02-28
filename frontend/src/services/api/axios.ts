import axios, { type AxiosInstance } from "axios";
import { getToken, clearToken } from "@/services/auth/token";

const walletBaseURL = process.env.NEXT_PUBLIC_WALLET_API_URL ?? "http://localhost:3001";
const usersBaseURL = process.env.NEXT_PUBLIC_USERS_API_URL ?? "http://localhost:3002";

function createInstance(baseURL: string): AxiosInstance {
  const instance = axios.create({ baseURL });

  instance.interceptors.request.use((config) => {
    if (typeof window === "undefined") return config;
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err?.response?.status === 401 && typeof window !== "undefined") {
        clearToken();
        window.location.href = "/auth/login";
      }
      return Promise.reject(err);
    }
  );

  return instance;
}

export const walletApi = createInstance(walletBaseURL);
export const usersApi = createInstance(usersBaseURL);
