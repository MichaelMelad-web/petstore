import axios from "axios";

const apiURL = import.meta.env.VITE_BASE_URL;
const authHeader = () => ({ headers: { token: localStorage.getItem("userToken") } });

export const applyCoupon = (code) =>
  axios.post(`${apiURL}/coupons/apply`, { code }, authHeader());

export const removeCoupon = () =>
  axios.delete(`${apiURL}/coupons/remove`, authHeader());