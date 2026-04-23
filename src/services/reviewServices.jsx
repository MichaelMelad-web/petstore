import axios from "axios";

const apiURL = import.meta.env.VITE_BASE_URL;
const authHeader = () => ({ headers: { token: localStorage.getItem("userToken") } });

export const getReviews = (productId) =>
  axios.get(`${apiURL}/products/${productId}/reviews`, authHeader());

export const addReview = (productId, data) =>
  axios.post(`${apiURL}/products/${productId}/reviews`, data, authHeader());

export const updateReview = (productId, reviewId, data) =>
  axios.patch(`${apiURL}/products/${productId}/reviews/${reviewId}`, data, authHeader());

export const deleteReview = (productId, reviewId) =>
  axios.delete(`${apiURL}/products/${productId}/reviews/${reviewId}`, authHeader());