// lib/api.ts
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_URL
if(!API_BASE_URL){
    throw new Error("VITE_PUBLIC_API_URL is not defined");
  }

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;