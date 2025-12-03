import axios from "axios";

const api = axios.create({
  baseURL:"http://127.0.0.1:8000/api",
});

export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await api.post("/login", credentials);
  return response.data;
};
