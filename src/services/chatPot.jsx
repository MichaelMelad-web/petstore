import axios from "axios";

const apiURL = import.meta.env.VITE_BASE_URL;

const authHeader = () => {
  const token = localStorage.getItem("userToken");
  return token ? { headers: { token } } : {};
};

export const sendChatMessage = (message) =>
  axios.post(`${apiURL}/chatbot/message`, { message }, authHeader());