import axios from "axios";

export const getAllShoppingLists = async () => {
  const res = await axios.get("/shopping-list");
  return res.data;
};

export const getShoppingListById = async (id: number) => {
  const res = await axios.get(`/shopping-list/${id}`);
  return res.data;
};

export const createShoppingList = async (payload: any) => {
  const res = await axios.post(`/shopping-list`, payload);
  return res.data;
};

export const updateShoppingList = async (id: number, payload: any) => {
  const res = await axios.put(`/shopping-list/${id}`, payload);
  return res.data;
};

export const deleteShoppingList = async (id: number) => {
  const res = await axios.delete(`/shopping-list/${id}`);
  return res.data;
};

// Special: Weekly missing ingredients
export const getWeeklyShoppingList = async (householdId: number) => {
  const res = await axios.get(`/shopping-list/weekly/${householdId}`);
  return res.data;
};
