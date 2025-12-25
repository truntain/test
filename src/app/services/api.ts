// api.ts
import axios from "axios";
import type { ApiClient } from "./apiClient";
import { mockApi } from "./mockApi";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

// Axios instance (dùng khi có BE)
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Adapter để axiosInstance khớp ApiClient
const axiosClient: ApiClient = {
  async get(url, config) { const res = await axiosInstance.get(url, config); return { data: res.data }; },
  async post(url, body, config) { const res = await axiosInstance.post(url, body, config); return { data: res.data }; },
  async put(url, body, config) { const res = await axiosInstance.put(url, body, config); return { data: res.data }; },
  async patch(url, body, config) { const res = await axiosInstance.patch(url, body, config); return { data: res.data }; },
  async delete(url, config) { const res = await axiosInstance.delete(url, config); return { data: res.data }; },
};

export const api: ApiClient = USE_MOCK ? mockApi : axiosClient;
