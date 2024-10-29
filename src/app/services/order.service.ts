import { Injectable } from '@angular/core';
import { Order } from '../models/order.model';
import { Observable, of } from 'rxjs';
import { Topping } from '../models/topping.model';
import { OfferService } from './offer.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private orders: Order[] = [];

  constructor(private offerService: OfferService) {}

  // Place an order with selected toppings, size, and quantity
  placeOrder(
    quantity: number,
    size: { name: string; price: number },
    vegToppings: Topping[],
    nonVegToppings: Topping[],
    selectedPizzaOrder: { beforeDiscount: number; discount?: number }
  ): Observable<Order> {
    // Base price calculation with toppings
    const basePrice =
      size.price +
      vegToppings.reduce((sum, t) => sum + t.price, 0) +
      nonVegToppings.reduce((sum, t) => sum + t.price, 0);

    const discount = selectedPizzaOrder.discount || 0;
    const discountedPrice = basePrice - (basePrice * (discount / 100));
    const totalPrice = discountedPrice * quantity;

    // Create the order
    const order: Order = {
      quantity,
      size,
      discountedPrice: this.offerService.calculateBestOffer({
        quantity,
        size,
        vegToppings,
        nonVegToppings,
        beforeDiscount: basePrice,
        offerName: '',
        isChoosen: true,
        discountedPrice: totalPrice,
      }),
      isChoosen: true,
      vegToppings,
      nonVegToppings,
      beforeDiscount: basePrice,
      offerName: '',
    };

    // Save order to orders list
    this.orders.push(order);
    return of(order);
  }

  // Retrieve all orders
  getOrders(): Observable<Order[]> {
    return of(this.orders);
  }
}
