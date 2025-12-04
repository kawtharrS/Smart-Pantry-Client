import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

export const registerUser = async (user: { name: string; email: string; password: string }) => {
  const response = await api.post("/register", user);
  return response.data;
};
