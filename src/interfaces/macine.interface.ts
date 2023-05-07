import { Location } from "./location.interface";

export interface Machine {
  id: string;
  title: string;
  location: Location;
  isActive: boolean;
}
