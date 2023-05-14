import { Ingredient } from "./ingredient.interface";
import { Machine } from "./macine.interface";

export interface MachineStock {
  id: string;
  machine_id: string;
  machine?: Machine;
  ingredient_id: string;
  ingredient?: Ingredient;
  capacity: number;
  stock: number;
}
