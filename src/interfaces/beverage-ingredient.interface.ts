import { Beverage } from "./beverage.interface";
import { Ingredient } from "./ingredient.interface";

export interface BeverageIngredient {
  id?: string;
  usage: number;

  ingredient_id: string;
  beverage_id?: string;

  ingredient?: Ingredient;
  beverage?: Beverage;
}
