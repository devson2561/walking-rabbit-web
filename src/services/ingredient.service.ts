import axios from "../config/axios.config";
import { Ingredient } from "../interfaces/ingredient.interface";
const baseURL = "ingredients";

const list = async (): Promise<Ingredient[]> => {
  const res = await axios.get(baseURL);
  return res.data;
};

export default {
  list,
};
