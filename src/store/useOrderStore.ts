import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { BeverageConfig } from "../interfaces/beverage-config.interface";

interface OrderStore {
  beverageId?: string;
  configs: BeverageConfig[];
  setConfig: (config: BeverageConfig) => void;
}

const useOrderStore = create<OrderStore>((set, get) => ({
  beverageId: undefined,
  configs: [],
  setConfig: (config: BeverageConfig) => {
    const configs = get().configs.filter((c) => c.key !== config.key);
    const newConfigs = [...configs, config];
    set({
      configs: newConfigs,
    });
  },
}));

export default useOrderStore;
