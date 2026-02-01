import axios from "./axios";

export const updateProfile = async (id: string, data: any, image?: File | null) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (data[key]) formData.append(key, data[key]);
  });
  if (image) formData.append("image", image);
  const response = await axios.put(`/api/auth/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getUsers = async () => {
  const response = await axios.get("/api/admin/users");
  return response.data.users;
};

export const getUser = async (id: string) => {
  const response = await axios.get(`/api/admin/users/${id}`);
  return response.data.user;
};

export const createUser = async (data: any, image?: File | null) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => formData.append(key, data[key]));
  if (image) formData.append("image", image);
  const response = await axios.post("/api/admin/users", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateUser = async (id: string, data: any, image?: File | null) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (data[key]) formData.append(key, data[key]);
  });
  if (image) formData.append("image", image);
  const response = await axios.put(`/api/admin/users/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await axios.delete(`/api/admin/users/${id}`);
  return response.data;
};