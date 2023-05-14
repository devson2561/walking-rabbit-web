import axios from "../config/axios.config";
import { Beverage } from "../interfaces/beverage.interface";
import { MachineStock } from "../interfaces/machine-stock.interface";
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

const listBeverages = async (
  id: string,
  categoryId: string | null
): Promise<Beverage[]> => {
  const res = await axios.get(`${baseURL}/${id}/beverages`, {
    params: {
      categoryId,
    },
  });
  return res.data;
};

const loadStocks = async (id: string): Promise<MachineStock[]> => {
  const res = await axios.get(`${baseURL}/${id}/stocks`);
  return res.data;
};

const get = async (id: string): Promise<Machine> => {
  const res = await axios.get(`${baseURL}/${id}`);
  return res.data;
};

const update = async (id: string, body: object): Promise<Machine> => {
  const res = await axios.patch(`${baseURL}/${id}`, body);
  return res.data;
};

export default {
  list,
  create,
  listBeverages,
  loadStocks,
  get,
  update,
};
