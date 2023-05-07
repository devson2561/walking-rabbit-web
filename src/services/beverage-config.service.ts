import axios from "../config/axios.config";
import { BeverageConfig } from "../interfaces/beverage-config.interface";

const baseURL = "beverage-configs";

const list = async (): Promise<BeverageConfig[]> => {
  const res = await axios.get(baseURL);
  return res.data;
};

export default {
  list,
};
