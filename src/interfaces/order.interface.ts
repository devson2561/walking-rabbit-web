import { Beverage } from "./beverage.interface";
import { BeverageConfig } from "./beverage-config.interface";

export interface Order {
  id: string;
  beverage_id: string;
  machine_id: string;
  configs: BeverageConfig[];

  beverage: Beverage;
}
