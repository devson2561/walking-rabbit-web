import axios from "../config/axios.config";
import { Category } from "../interfaces/category.interface";
const baseURL = "categories";

const list = async (): Promise<Category[]> => {
  const res = await axios.get(baseURL);
  return res.data;
};

export default {
  list,
};
