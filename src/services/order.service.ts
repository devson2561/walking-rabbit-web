import axios from "../config/axios.config";
import { Order } from "../interfaces/order.interface";

const baseURL = "orders";

const list = async (): Promise<Order[]> => {
  const res = await axios.get(baseURL);
  return res.data;
};

const create = async (body: object): Promise<Order> => {
  const res = await axios.post(baseURL, body);
  return res.data;
};

const get = async (id: string): Promise<Order> => {
  const res = await axios.get(`${baseURL}/${id}`);
  return res.data;
};

export default {
  list,
  create,
  get,
};
