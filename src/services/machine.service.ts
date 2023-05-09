import axios from "../config/axios.config";
import { Machine } from "../interfaces/macine.interface";
const baseURL = "machines";

const list = async (): Promise<Machine[]> => {
  const res = await axios.get(baseURL);
  return res.data;
};

const create = async (body: any): Promise<Machine[]> => {
  const res = await axios.post(baseURL, body);
  return res.data;
};

export default {
  list,
  create
};
