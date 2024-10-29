import { TestBed } from '@angular/core/testing';
import { OfferService } from './offer.service';
import { Offer } from '../models/offer.model';
import { Order } from '../models/order.model';

describe('OfferService', () => {
  let service: OfferService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OfferService]
    });
    service = TestBed.inject(OfferService);
  });

  it('should return all available offers', () => {
    const offers: Offer[] = service.getAvailableOffers();
    expect(offers.length).toBe(3);
    expect(offers[0].name).toBe('Offer 1');
    expect(offers[1].name).toBe('Offer 2');
    expect(offers[2].name).toBe('Offer 3');
  });

  it('should return the correct offer description based on size', () => {
    const descriptionMedium = service.getOfferDescriptionBySize('Medium');
    const descriptionLarge = service.getOfferDescriptionBySize('Large');
    const descriptionSmall = service.getOfferDescriptionBySize('Small'); // Non-existent size

    expect(descriptionMedium).toBe('1 Medium Pizza with 2 toppings = $5');
    expect(descriptionLarge).toBe('1 Large Pizza with 4 toppings (50% discount)');
    expect(descriptionSmall).toBeNull();
  });

  it('should calculate the best offer for Offer 1 (1 Medium Pizza with 2 toppings = $5)', () => {
    const order: Order = {
        size: { name: 'Medium', price: 7 },
        quantity: 1,
        vegToppings: [{
            name: 'Tomato',
            price: 0,
            type: 'veg',
            isAdded: false
        }, {
            name: 'Mushrooms',
            price: 0,
            type: 'veg',
            isAdded: false
        }],
        nonVegToppings: [],
        beforeDiscount: 0,
        discountedPrice: 0,
        isChoosen: false,
        offerName: ''
    };

    const bestPrice = service.calculateBestOffer(order);
    expect(bestPrice).toBe(5); // Offer 1 should apply
  });

  it('should calculate the best offer for Offer 2 (2 Medium Pizzas with 4 toppings each = $9)', () => {
    const order: Order = {
        size: { name: 'Medium', price: 7 },
        quantity: 2,
        vegToppings: [{
            name: 'Tomato',
            price: 0,
            type: 'veg',
            isAdded: false
        }, {
            name: 'Mushrooms',
            price: 0,
            type: 'veg',
            isAdded: false
        }],
        nonVegToppings: [{
            name: 'Pepperoni',
            price: 0,
            type: 'veg',
            isAdded: false
        }, {
            name: 'Sausage',
            price: 0,
            type: 'veg',
            isAdded: false
        }],
        beforeDiscount: 0,
        discountedPrice: 0,
        isChoosen: false,
        offerName: ''
    };

    const bestPrice = service.calculateBestOffer(order);
    expect(bestPrice).toBe(9); // Offer 2 should apply
  });

  it('should calculate the best offer for Offer 3 (1 Large Pizza with 4 toppings, 50% discount)', () => {
    const order: Order = {
        size: { name: 'Large', price: 10 },
        quantity: 1,
        vegToppings: [{
            name: 'Tomato',
            price: 0,
            type: 'veg',
            isAdded: false
        }, {
            name: 'Olives',
            price: 0,
            type: 'veg',
            isAdded: false
        }],
        nonVegToppings: [{
            name: 'Pepperoni',
            price: 0,
            type: 'veg',
            isAdded: false
        }, {
            name: 'Sausage',
            price: 0,
            type: 'veg',
            isAdded: false
        }],
        beforeDiscount: 0,
        discountedPrice: 0,
        isChoosen: false,
        offerName: ''
    };

    const bestPrice = service.calculateBestOffer(order);
    expect(bestPrice).toBe(5); // 50% of beforeDiscount (10 * 1 = 10, then 10 * 0.5 = 5)
  });

  it('should not apply any offer if conditions are not met', () => {
    const order: Order = {
        size: { name: 'Small', price: 5 },
        quantity: 1,
        vegToppings: [{
            name: 'Tomato',
            price: 0,
            type: 'veg',
            isAdded: false
        }],
        nonVegToppings: [],
        beforeDiscount: 0,
        discountedPrice: 0,
        isChoosen: false,
        offerName: ''
    };

    const bestPrice = service.calculateBestOffer(order);
    expect(bestPrice).toBe(5); // No offer should apply, so best price is beforeDiscount price
  });
});
