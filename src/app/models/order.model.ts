import { PizzaSize } from "./pizza-size.model";
import { Topping } from "./topping.model";

export interface Order {
  quantity: number;
  size: PizzaSize;
  discountedPrice: number;
  isChoosen : boolean;
  vegToppings: Topping[];
  nonVegToppings: Topping[];
  beforeDiscount: number;
  offerName: string;
}
