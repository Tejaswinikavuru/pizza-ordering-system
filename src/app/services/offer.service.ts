import { Injectable } from '@angular/core';
import { Offer } from '../models/offer.model';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  
  private offers: Offer[] = [
    {
      name: 'Offer 1',
      description: '1 Medium Pizza with 2 toppings = $5',
      size: 'Medium',
      calculateDiscountedPrice: (order: Order) => {
        if (order.size.name === 'Medium' && order.vegToppings.length + order.nonVegToppings.length === 2) {
          return 5 * order.quantity;
        }
        return order.beforeDiscount;
      }
    },
    {
      name: 'Offer 2',
      description: '2 Medium Pizzas with 4 toppings each = $9',
      size: 'Medium',
      calculateDiscountedPrice: (order: Order) => {
        if (order.size.name === 'Medium' && order.quantity === 2 && order.vegToppings.length + order.nonVegToppings.length === 4) {
          return 9;
        }
        return order.beforeDiscount;
      }
    },
    {
      name: 'Offer 3',
      description: '1 Large Pizza with 4 toppings (50% discount)',
      size: 'Large',
      calculateDiscountedPrice: (order: Order) => {
        if (order.size.name === 'Large' && order.vegToppings.length + order.nonVegToppings.length === 4) {
          return order.beforeDiscount * 0.5;
        }
        return order.beforeDiscount;
      }
    }
  ];

  // Function to get all available offers
  getAvailableOffers(): Offer[] {
    return this.offers;
  }

  getOfferDescriptionBySize(size: string): string | null {
    const offer = this.offers.find((offer) => offer.size === size);
    return offer ? offer.description : null;
  }

  // Function to calculate the best offer for a given order
  calculateBestOffer(order: Order): number {
    order.beforeDiscount = order.quantity * order.size.price;
    // Find the best discount available
    const discountedPrices = this.offers.map((offer) =>
      offer.calculateDiscountedPrice(order)
    );

    // Choose the lowest price as the best offer
    const bestPrice = Math.min(...discountedPrices);
    order.discountedPrice = bestPrice;
    return bestPrice;
  }
}
