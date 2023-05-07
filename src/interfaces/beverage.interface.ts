import { BeverageConfig } from "./beverage-config.interface";
import { BeverageIngredient } from "./beverage-ingredient.interface";
import { Category } from "./category.interface";

export interface Beverage {
  id: string;
  title: string;
  category?: Category;
  configs: BeverageConfig[];
  ingredients: BeverageIngredient[];
}

export interface CreateBeverage {
  title: string;
  configs: string[];
  ingredients: BeverageIngredient[];
}
