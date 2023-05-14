import { Beverage } from "./beverage.interface";
import { Location } from "./location.interface";
import { MachineStock } from "./machine-stock.interface";

export interface Machine {
  id: string;
  title: string;
  location: Location;
  isActive: boolean;
  beverages: Beverage[];
  stocks: MachineStock[];
}
