
import axios from "axios";

const apiURL = import.meta.env.VITE_BASE_URL;
const authHeader = () => ({ headers: { token: localStorage.getItem("userToken") } });

export const getCart = () =>
  axios.get(`${apiURL}/cart`, authHeader());

export const addToCart = (productId, quantity = 1) =>
  axios.post(`${apiURL}/cart`, { productId, quantity }, authHeader());

export const updateCartQuantity = (productId, quantity) =>
  axios.patch(`${apiURL}/cart`, { productId, quantity }, authHeader());

// Accepts either a productId or itemId — the caller decides which to pass
export const removeFromCart = (id) =>
  axios.delete(`${apiURL}/cart/${id}`, authHeader());

export const clearCart = () =>
  axios.delete(`${apiURL}/cart`, authHeader());