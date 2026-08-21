import axios from "axios";

const apiUrl =
  import.meta.env.VITE_API_URL ||
  "https://jeevan-sanjavni-ecommers-1.onrender.com/api";

const api = axios.create({
  baseURL: apiUrl.replace(/\/$/, ""),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;