import axios from "axios";

const apiURL = import.meta.env.VITE_BASE_URL;
const authHeader = () => ({ headers: { token: localStorage.getItem("userToken") } });

export const getWishlist = () =>
  axios.get(`${apiURL}/wishlist`, authHeader());

export const addToWishlist = (productId) =>
  axios.post(`${apiURL}/wishlist`, { productId }, authHeader());

// ← بيبعت wishlistItemId مش productId
export const removeFromWishlist = (wishlistItemId) =>
  axios.delete(`${apiURL}/wishlist/${wishlistItemId}`, authHeader());

export const clearWishlist = () =>
  axios.delete(`${apiURL}/wishlist`, authHeader());