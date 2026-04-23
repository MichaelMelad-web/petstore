import axios from "axios";

const apiURL = import.meta.env.VITE_BASE_URL;
const authHeader = () => ({ headers: { token: localStorage.getItem("userToken") } });

export const getAddresses = () =>
  axios.get(`${apiURL}/users/address`, authHeader());

export const addAddress = (data) =>
  axios.post(`${apiURL}/users/address`, data, authHeader());

export const updateAddress = (addressId, data) =>
  axios.patch(`${apiURL}/users/address/${addressId}`, data, authHeader());

export const removeAddress = (addressId) =>
  axios.delete(`${apiURL}/users/address/${addressId}`, authHeader());