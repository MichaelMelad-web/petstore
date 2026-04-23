
import axios from "axios";

const apiURL = import.meta.env.VITE_BASE_URL;

const authHeader = () => ({
  headers: { token: localStorage.getItem("userToken") },
});

export async function registerUser(formData) {
  return axios.post(`${apiURL}/users/signup`, formData);
}

export async function loginUser(formData) {
  return axios.post(`${apiURL}/users/signin`, formData);
}

export async function getLoggedUserData() {
  return axios.get(`${apiURL}/users/profile`, authHeader());
}

export async function updateProfile(formData) {
  return axios.patch(`${apiURL}/users/updateProfile`, formData, authHeader());
}

export async function updatePassword(formData) {
  return axios.patch(`${apiURL}/users/updatePassword`, formData, authHeader());
}

export async function forgetPassword(email) {
  return axios.patch(`${apiURL}/users/forgetPassword`, { email });
}

export async function confirmOTP(data) {
  return axios.post(`${apiURL}/users/confirmPassword`, data);
}

export async function resetPassword(data) {
  return axios.patch(`${apiURL}/users/resetPassword`, data);
}
