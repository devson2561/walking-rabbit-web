import axios from "../config/axios.config";
import { Beverage, CreateBeverage } from "../interfaces/beverage.interface";

const baseURL = "beverages";

const list = async (): Promise<Beverage[]> => {
  const res = await axios.get(baseURL);
  return res.data;
};

const get = async (id: string): Promise<Beverage> => {
  const res = await axios.get(`${baseURL}/${id}`);
  return res.data;
};

const create = async (body: CreateBeverage): Promise<Beverage> => {
  const res = await axios.post(baseURL, body);
  return res.data;
};

const remove = async (id: string): Promise<Beverage> => {
  const res = await axios.delete(`${baseURL}/${id}`);
  return res.data;
};

const update = async (id: string, body: CreateBeverage): Promise<Beverage> => {
  const res = await axios.patch(`${baseURL}/${id}`, body);
  return res.data;
};

export default {
  list,
  get,
  create,
  remove,
  update,
};
