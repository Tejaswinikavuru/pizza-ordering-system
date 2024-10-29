import { Order } from "./order.model";

export interface Offer {
    name: string;
    description: string;
    size: string;
    calculateDiscountedPrice(order: Order): number;
  }
  