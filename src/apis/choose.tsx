import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v0.1",
  headers: { "Content-Type": "application/json" },
});

export const createHousehold = async (
  token: string,
  body: { name: string; invite_code: string }
) => {
  const response = await api.post("/household/add", body, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const joinHousehold = async (
  token: string,
  code: string
) => {
  const response = await api.post(
    "/household/join",
    { invite_code: code },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
