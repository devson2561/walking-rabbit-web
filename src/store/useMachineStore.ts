import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { MachineStock } from "../interfaces/machine-stock.interface";
import machineService from "../services/machine.service";

interface MachineStore {
  machineId?: string;
  stocks: MachineStock[];
  loadStocks: (machineId: string) => Promise<void>;
  updateStocks: () => void;
  clearStocks: () => void;
  isReadyPickup: boolean;
  setPickupStatus: (value: boolean) => void;
  setMachineId: (value?: string) => void;
}

const useMachineStore = create<MachineStore>()(
  devtools(
    persist(
      (set, get) => ({
        machineId: undefined,
        isReadyPickup: false,
        stocks: [],
        loadStocks: async (machineId: string) => {
          const data = await machineService.loadStocks(machineId);
          return set((state) => ({
            machineId,
            stocks: data,
          }));
        },
        setMachineId: (value?: string) =>
          set((state) => ({
            machineId: value,
          })),
        setPickupStatus: (value: boolean) =>
          set((state) => ({
            isReadyPickup: value,
          })),
        updateStocks: () => {},
        clearStocks: () =>
          set((state) => ({
            machineId: undefined,
            stocks: [],
          })),
      }),
      {
        name: "machine-store",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);

export default useMachineStore;
