


import axios from "axios";

const apiURL = import.meta.env.VITE_BASE_URL;

export const getAllProducts = () =>
  axios.get(`${apiURL}/products`);

export const getProductById = (id) =>
  axios.get(`${apiURL}/products/${id}`);

export const getProductsByCategory = (category) =>
  axios.get(`${apiURL}/products/filter?category=${category}`);

export const filterProducts = (params) => {
  const query = new URLSearchParams();
  if (params.category) query.append("category", params.category);
  if (params.name)     query.append("name",     params.name);
  if (params.minPrice) query.append("minPrice",  params.minPrice);
  if (params.maxPrice) query.append("maxPrice",  params.maxPrice);
  return axios.get(`${apiURL}/products/filter?${query.toString()}`);
};