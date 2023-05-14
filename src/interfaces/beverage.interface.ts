import { BeverageConfig } from "./beverage-config.interface";
import { BeverageIngredient } from "./beverage-ingredient.interface";
import { Category } from "./category.interface";
import { Process } from "./process.interface";

export interface Beverage {
  id: string;
  title: string;
  price: number;
  category_id: string;

  category?: Category;
  configs: BeverageConfig[];
  ingredients: BeverageIngredient[];
  processes: Process[];
}

export interface CreateBeverage {
  title: string;
  configs: string[];
  ingredients: BeverageIngredient[];
}
