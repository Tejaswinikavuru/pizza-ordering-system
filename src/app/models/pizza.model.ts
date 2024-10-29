import { Topping } from "./topping.model";

export interface Pizza {
    price: number;
    size: string;
    toppings: Topping[];
    offerName: string;
  }
  