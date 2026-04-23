import axios from "axios";

const apiURL = import.meta.env.VITE_BASE_URL;
const authHeader = () => ({ headers: { token: localStorage.getItem("userToken") } });

export const createOrder = (data) =>
  axios.post(`${apiURL}/orders`, data, authHeader());

export const getMyOrders = () =>
  axios.get(`${apiURL}/orders`, authHeader());

export const cancelOrder = (orderId) =>
  axios.patch(`${apiURL}/orders/${orderId}/cancel`, {}, authHeader());